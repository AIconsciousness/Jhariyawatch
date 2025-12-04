import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, AlertTriangle, Shield, TrendingDown, Navigation, Satellite } from 'lucide-react';
import RiskMap from '../components/RiskMap';
import RiskBadge from '../components/RiskBadge';
import { riskAPI } from '../services/api';

const RiskCheck = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  
  const [userLocation, setUserLocation] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkUserLocation();
  }, []);

  const checkUserLocation = () => {
    setLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(loc);
          await fetchRiskData(loc.lat, loc.lng);
        },
        (err) => {
          setUserLocation({ lat: 23.767, lng: 86.396 });
          fetchRiskData(23.767, 86.396);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setError(language === 'hi' ? 'जियोलोकेशन उपलब्ध नहीं है' : 'Geolocation not available');
      setLoading(false);
    }
  };

  const fetchRiskData = async (lat, lng) => {
    try {
      const response = await riskAPI.checkLocation(lat, lng);
      if (response.data.success) {
        setRiskData(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch risk data:', error);
      setError(language === 'hi' ? 'जोखिम डेटा प्राप्त करने में विफल' : 'Failed to fetch risk data');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    const colors = {
      critical: '#dc2626',
      high: '#ea580c',
      moderate: '#ca8a04',
      low: '#65a30d',
      stable: '#16a34a'
    };
    return colors[level] || '#6b7280';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">{t('risk.checking')}</p>
      </div>
    );
  }

  const riskLevel = riskData?.riskAssessment?.zone?.riskLevel || riskData?.riskAssessment?.riskLevel || 'stable';
  const riskColor = getRiskColor(riskLevel);

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <div className="bg-white px-4 py-4 shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">{t('risk.title')}</h1>
      </div>

      {userLocation && (
        <div className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-sm flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">{t('risk.yourLocation')}</p>
            <p className="font-medium text-gray-800">
              {userLocation.lat.toFixed(4)}°N, {userLocation.lng.toFixed(4)}°E
            </p>
          </div>
          <button 
            onClick={checkUserLocation}
            className="ml-auto p-2 text-blue-600 hover:bg-blue-50 rounded-full"
          >
            <Navigation className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="px-4 mt-4">
        <RiskMap userLocation={userLocation} height="220px" />
      </div>

      {riskData && (
        <>
          <div 
            className="mx-4 mt-4 p-6 rounded-xl text-center"
            style={{ backgroundColor: riskColor + '15' }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-3" style={{ backgroundColor: riskColor + '20' }}>
              <AlertTriangle className="w-8 h-8" style={{ color: riskColor }} />
            </div>
            <p className="text-sm text-gray-500 mb-1">{t('risk.riskLevel')}</p>
            <p className="text-3xl font-bold mb-2" style={{ color: riskColor }}>
              {t(`risk.${riskLevel}`)}
            </p>
            {riskData.riskAssessment?.zone && (
              <p className="text-sm text-gray-600 mb-2">
                {riskData.riskAssessment.zone.zoneName?.[language] || riskData.riskAssessment.zone.zoneName?.en}
              </p>
            )}
            <RiskBadge level={riskLevel} size="lg" />
            {riskData.riskAssessment?.riskScore && (
              <div className="mt-3 text-sm text-gray-500">
                Score: <span className="font-bold" style={{ color: riskColor }}>{riskData.riskAssessment.riskScore}/100</span>
              </div>
            )}
          </div>

          {riskData.riskAssessment?.subsidenceData && (
            <div className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Satellite className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-gray-800">PSInSAR Data</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                    <TrendingDown className="w-4 h-4" />
                    {t('risk.subsidenceRate')}
                  </div>
                  <p className="text-xl font-bold" style={{ color: riskColor }}>
                    {riskData.riskAssessment.subsidenceData.averageRate} mm
                    <span className="text-sm font-normal text-gray-500">/{t('risk.perYear')}</span>
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-gray-500 text-xs mb-1">{t('risk.displacement')}</div>
                  <p className="text-xl font-bold text-gray-800">
                    {riskData.riskAssessment.subsidenceData.cumulativeDisplacement} mm
                  </p>
                </div>
              </div>
              {riskData.riskAssessment.psinsar && (
                <div className="mt-3 flex justify-between text-sm text-gray-500">
                  <span>{t('risk.coherence')}: <span className="font-medium text-gray-700">{(riskData.riskAssessment.psinsar.coherence * 100).toFixed(0)}%</span></span>
                  <span>Source: Sentinel-1</span>
                </div>
              )}
            </div>
          )}

          {riskData.riskAssessment?.riskDescription && (
            <div className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-sm">
              <p className="text-gray-700 leading-relaxed">
                {riskData.riskAssessment.riskDescription[language] || riskData.riskAssessment.riskDescription.en}
              </p>
            </div>
          )}

          {riskData.safetyRecommendations && (
            <div className="mx-4 mt-4">
              <h3 className="text-lg font-bold text-gray-800 mb-3">{t('risk.recommendations')}</h3>
              <div className="space-y-2">
                {(riskData.safetyRecommendations[language] || riskData.safetyRecommendations.en || []).map((rec, index) => (
                  <div key={index} className="bg-white p-3 rounded-xl shadow-sm flex items-start gap-3">
                    <div className="p-1.5 bg-green-100 rounded-full flex-shrink-0 mt-0.5">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-gray-700 text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {riskData.nearestSafeZone && (
            <div className="mx-4 mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-green-600">{t('risk.nearestSafe')}</p>
                  <p className="font-semibold text-gray-800">
                    {riskData.nearestSafeZone.name?.[language] || riskData.nearestSafeZone.name?.en || 'Safe Zone'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {riskData.nearestSafeZone.distance} {t('common.km')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RiskCheck;
