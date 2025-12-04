import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { Bell, AlertTriangle, Info, Clock, ChevronRight, RefreshCw } from 'lucide-react';
import { alertAPI } from '../services/api';

const Alerts = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const response = await alertAPI.getAlerts();
      if (response.data.success) {
        setAlerts(response.data.data.alerts);
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'emergency': return AlertTriangle;
      case 'warning': return AlertTriangle;
      default: return Info;
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'critical': return { bg: 'bg-red-500', light: 'bg-red-50', text: 'text-red-700', border: 'border-red-500' };
      case 'high': return { bg: 'bg-orange-500', light: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-500' };
      case 'medium': return { bg: 'bg-yellow-500', light: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-500' };
      default: return { bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-500' };
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <div className="bg-white px-4 py-4 shadow-sm flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">{t('alerts.title')}</h1>
        <button 
          onClick={fetchAlerts}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 mt-8">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <Bell className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">{t('alerts.noAlerts')}</p>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {alerts.map((alert) => {
            const Icon = getAlertIcon(alert.alertType);
            const colors = getAlertColor(alert.severity);
            
            return (
              <div
                key={alert.alertId}
                className={`bg-white rounded-xl shadow-sm overflow-hidden border-l-4 ${colors.border}`}
                onClick={() => setSelectedAlert(selectedAlert?.alertId === alert.alertId ? null : alert)}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${colors.bg}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.light} ${colors.text}`}>
                          {t(`alerts.${alert.alertType}`)}
                        </span>
                        <ChevronRight className={`w-5 h-5 text-gray-400 transition ${selectedAlert?.alertId === alert.alertId ? 'rotate-90' : ''}`} />
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {alert.title?.[language] || alert.title?.en}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {alert.message?.[language] || alert.message?.en}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(alert.createdAt)}</span>
                        {alert.validUntil && (
                          <span className="text-gray-400">
                            | {t('alerts.validUntil')} {formatDate(alert.validUntil)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedAlert?.alertId === alert.alertId && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      {alert.instructions && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">{t('alerts.instructions')}</h4>
                          <ul className="space-y-2">
                            {(alert.instructions[language] || alert.instructions.en || []).map((instruction, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                <span className="text-primary font-bold">{idx + 1}.</span>
                                <span>{instruction}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {alert.emergencyContacts && alert.emergencyContacts.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">{t('emergency.title')}</h4>
                          <div className="space-y-2">
                            {alert.emergencyContacts.map((contact, idx) => (
                              <a 
                                key={idx}
                                href={`tel:${contact.phone}`}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                              >
                                <span className="text-sm text-gray-700">{contact.name}</span>
                                <span className="text-sm font-medium text-primary">{contact.phone}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Alerts;
