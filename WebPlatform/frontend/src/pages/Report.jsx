import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { Camera, Upload, MapPin, AlertCircle, CheckCircle, X, Loader } from 'lucide-react';
import { reportAPI } from '../services/api';
import { uploadImageUnsigned } from '../services/cloudinary';

const Report = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const fileInputRef = useRef(null);
  
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [reportType, setReportType] = useState('crack');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('medium');
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        () => {
          setLocation({ lat: 23.767, lng: 86.396 });
        }
      );
    }
  }, []);

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!photo) {
      setError(language === 'hi' ? 'कृपया एक फोटो चुनें' : 'Please select a photo');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Upload image to Cloudinary
      console.log('📤 Uploading image to Cloudinary...');
      const uploadResult = await uploadImageUnsigned(photo, {
        folder: 'jharia-reports'
      });

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Image upload failed');
      }

      console.log('✅ Image uploaded:', uploadResult.url);

      // Step 2: Send report data with Cloudinary URL to backend
      const reportData = {
        reportType,
        description,
        urgencyLevel: urgency,
        latitude: location?.lat || 23.767,
        longitude: location?.lng || 86.396,
        imageUrl: uploadResult.url, // Cloudinary URL
        imagePublicId: uploadResult.publicId, // For future deletion if needed
        imageMetadata: {
          width: uploadResult.width,
          height: uploadResult.height,
          format: uploadResult.format,
          bytes: uploadResult.bytes
        }
      };

      const response = await reportAPI.submit(reportData);
      
      if (response.data.success) {
        setSubmitted(true);
        setAiResult(response.data.data.aiAnalysis);
      }
    } catch (err) {
      console.error('❌ Submit error:', err);
      setError(err.response?.data?.error?.message?.[language] || err.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  const reportTypes = [
    { value: 'crack', label: t('report.types.crack') },
    { value: 'subsidence', label: t('report.types.subsidence') },
    { value: 'building_damage', label: t('report.types.building_damage') },
    { value: 'road_damage', label: t('report.types.road_damage') },
    { value: 'other', label: t('report.types.other') }
  ];

  const urgencyLevels = [
    { value: 'low', label: t('report.urgencyLevels.low'), color: 'bg-green-100 text-green-700 border-green-300' },
    { value: 'medium', label: t('report.urgencyLevels.medium'), color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
    { value: 'high', label: t('report.urgencyLevels.high'), color: 'bg-orange-100 text-orange-700 border-orange-300' },
    { value: 'emergency', label: t('report.urgencyLevels.emergency'), color: 'bg-red-100 text-red-700 border-red-300' }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-100 pb-24 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-sm w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{t('report.success')}</h2>
          
          {aiResult && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl text-left">
              <h3 className="font-semibold text-gray-800 mb-2">{t('report.aiAnalyzing')}</h3>
              {aiResult.crackDetected && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('report.crackDetected')}</span>
                    <span className="font-medium text-red-600">
                      {language === 'hi' ? 'हाँ' : 'Yes'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('report.severity')}</span>
                    <span className="font-medium capitalize">{aiResult.crackSeverity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('report.confidence')}</span>
                    <span className="font-medium">{(aiResult.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              )}
              {!aiResult.crackDetected && (
                <p className="text-gray-600">
                  {language === 'hi' ? 'कोई दरार नहीं पाई गई' : 'No crack detected'}
                </p>
              )}
            </div>
          )}
          
          <button
            onClick={() => {
              setSubmitted(false);
              setPhoto(null);
              setPhotoPreview(null);
              setDescription('');
              setAiResult(null);
            }}
            className="mt-6 w-full py-3 bg-primary text-white rounded-lg font-semibold"
          >
            {language === 'hi' ? 'नई रिपोर्ट' : 'New Report'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <div className="bg-white px-4 py-4 shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">{t('report.title')}</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {language === 'hi' ? 'फोटो *' : 'Photo *'}
          </label>
          
          {!photoPreview ? (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary transition"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-700">{t('report.takePhoto')}</p>
                  <p className="text-sm text-gray-500">{t('report.selectFromGallery')}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              <img 
                src={photoPreview} 
                alt="Preview" 
                className="w-full h-48 object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={removePhoto}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoSelect}
            className="hidden"
          />
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('report.reportType')}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {reportTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setReportType(type.value)}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition ${
                  reportType === type.value
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('report.urgency')}
          </label>
          <div className="flex gap-2 flex-wrap">
            {urgencyLevels.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => setUrgency(level.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition ${
                  urgency === level.value ? level.color : 'border-gray-200 text-gray-500'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('report.description')}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
            placeholder={t('report.descriptionPlaceholder')}
          />
        </div>

        {location && (
          <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{language === 'hi' ? 'स्थान' : 'Location'}</p>
              <p className="font-medium text-gray-800">
                {location.lat.toFixed(4)}°N, {location.lng.toFixed(4)}°E
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !photo}
          className="w-full py-4 bg-primary text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              {t('report.submitting')}
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              {t('report.submit')}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Report;
