import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Eye, EyeOff, MapPin, AlertTriangle } from 'lucide-react';
import LanguageToggle from '../components/LanguageToggle';

const Login = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error?.message?.[language] || result.error?.message?.en || 'Login failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center transform scale-110 animate-subtle-zoom"
        style={{
          backgroundImage: 'url(/images/coalfield.jpg)',
          filter: 'brightness(0.7) contrast(1.1)'
        }}
      />
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/95 via-orange-900/90 to-red-800/95 animate-gradient-shift" />

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -top-48 -left-48 animate-float-slow"></div>
        <div className="absolute w-96 h-96 bg-red-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-float-slower"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="absolute top-4 right-4">
          <LanguageToggle className="text-white" />
        </div>

        <div className="min-h-screen flex flex-col justify-center px-6 py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-4">
              <img src="/logo.png" alt="JhariaWatch" className="w-16 h-16 rounded-full" />
            </div>
            <h1 className="text-3xl font-bold text-white">{t('app.name')}</h1>
            <p className="text-white/90 mt-2 font-medium">{t('app.tagline')}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {t('auth.loginTitle')}
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
                {t('auth.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                placeholder="example@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                t('auth.login')
              )}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              {t('auth.register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
