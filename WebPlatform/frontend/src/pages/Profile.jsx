import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { User, Mail, Phone, Globe, Bell, LogOut, FileText, ChevronRight, Settings } from 'lucide-react';
import { reportAPI } from '../services/api';

const Profile = () => {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await reportAPI.getMyReports({ limit: 5 });
        if (response.data.success) {
          setReports(response.data.data.reports);
        }
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoadingReports(false);
      }
    };

    fetchReports();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <div className="bg-gradient-to-r from-primary to-primary-light text-white px-4 py-8">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user?.name || 'User'}</h1>
            <p className="text-white/70 text-sm">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 flex items-center gap-3 border-b border-gray-100">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">{t('auth.email')}</p>
              <p className="font-medium text-gray-800">{user?.email}</p>
            </div>
          </div>
          {user?.phone && (
            <div className="p-4 flex items-center gap-3 border-b border-gray-100">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">{t('auth.phone')}</p>
                <p className="font-medium text-gray-800">{user?.phone}</p>
              </div>
            </div>
          )}
          <button 
            onClick={toggleLanguage}
            className="w-full p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-400" />
              <div className="text-left">
                <p className="text-xs text-gray-500">{t('profile.language')}</p>
                <p className="font-medium text-gray-800">
                  {language === 'en' ? 'English' : 'हिंदी'}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {language === 'en' ? 'हिं' : 'EN'}
            </span>
          </button>
        </div>
      </div>

      <div className="px-4 mt-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">{t('profile.myReports')}</h2>
        
        {loadingReports ? (
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">
              {language === 'hi' ? 'कोई रिपोर्ट नहीं' : 'No reports yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {reports.map((report) => (
              <div key={report.reportId} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
                {report.photos?.[0]?.url ? (
                  <img 
                    src={report.photos[0].url}
                    alt="Report"
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 capitalize">
                    {t(`report.types.${report.reportType}`)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN')}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 mt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-red-600 transition"
        >
          <LogOut className="w-5 h-5" />
          {t('auth.logout')}
        </button>
      </div>
    </div>
  );
};

export default Profile;
