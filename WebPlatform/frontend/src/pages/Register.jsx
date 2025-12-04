import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Eye, EyeOff, MapPin, AlertTriangle } from 'lucide-react';
import LanguageToggle from '../components/LanguageToggle';

const Register = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    addressDetails: {
      area: '',
      street: '',
      landmark: '',
      pincode: '',
      nearbyMiningSite: ''
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        addressDetails: { ...formData.addressDetails, [field]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const jhariaAreas = [
    'Alkusa', 'Ena', 'Tisra', 'Bastacola', 'Bera-Dobari', 'CK-Siding',
    'Jeenagora', 'Jorapokhar', 'Kusunda', 'Lodna', 'Kuzama', 'Begariya More',
    'Jharia Town', 'Dhanbad', 'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError(language === 'hi' ? 'पासवर्ड मेल नहीं खाते' : 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError(language === 'hi' ? 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए' : 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      preferredLanguage: language,
      addressDetails: formData.addressDetails
    });
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error?.message?.[language] || result.error?.message?.en || 'Registration failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center transform scale-110 animate-subtle-zoom"
        style={{
          backgroundImage: 'url(/images/mining.jpg)',
          filter: 'brightness(0.7) contrast(1.1) saturate(1.2)'
        }}
      />
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/95 via-red-900/90 to-orange-800/95 animate-gradient-shift" />

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -top-48 -right-48 animate-float-slow"></div>
        <div className="absolute w-96 h-96 bg-red-500/10 rounded-full blur-3xl -bottom-48 -left-48 animate-float-slower"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="absolute top-4 right-4">
          <LanguageToggle className="text-white" />
        </div>

        <div className="min-h-screen flex flex-col justify-center px-6 py-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-3">
              <img src="/logo.png" alt="JhariaWatch" className="w-14 h-14 rounded-full" />
            </div>
            <h1 className="text-2xl font-bold text-white">{t('app.name')}</h1>
          </div>

        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 max-w-md mx-auto w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {t('auth.registerTitle')}
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.name')}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                placeholder={language === 'hi' ? 'आपका नाम' : 'Your name'}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.email')}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                placeholder="example@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.phone')} <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                placeholder="+91 9876543210"
                required
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                {language === 'hi' ? '📍 पता विवरण' : '📍 Address Details'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'hi' ? 'क्षेत्र/कॉलोनी (झरिया में)' : 'Area/Colony (in Jharia)'} <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="address.area"
                    value={formData.addressDetails.area}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    required
                  >
                    <option value="">{language === 'hi' ? 'क्षेत्र चुनें' : 'Select Area'}</option>
                    {jhariaAreas.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'hi' ? 'गली/सड़क का नाम' : 'Street/Road Name'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.addressDetails.street}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    placeholder={language === 'hi' ? 'जैसे: मुख्य सड़क, स्टेशन रोड' : 'e.g., Main Road, Station Road'}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'hi' ? 'निकटतम लैंडमार्क' : 'Nearest Landmark'} <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="address.landmark"
                    value={formData.addressDetails.landmark}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    placeholder={language === 'hi' ? 'जैसे: BCCL अस्पताल, स्कूल के पास' : 'e.g., Near BCCL Hospital, School'}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'hi' ? 'पिनकोड' : 'Pincode'} <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="address.pincode"
                      value={formData.addressDetails.pincode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      placeholder="826001"
                      maxLength="6"
                      pattern="[0-9]{6}"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'hi' ? 'निकटतम खदान' : 'Nearby Mine'} <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="address.nearbyMiningSite"
                      value={formData.addressDetails.nearbyMiningSite}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      placeholder={language === 'hi' ? 'जैसे: एना कोलियरी' : 'e.g., Ena Colliery'}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.confirmPassword')}
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('common.loading')}
                </span>
              ) : (
                t('auth.register')
              )}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            {t('auth.haveAccount')}{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              {t('auth.login')}
            </Link>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
