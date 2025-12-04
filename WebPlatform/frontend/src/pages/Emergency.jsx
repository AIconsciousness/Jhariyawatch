import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { Phone, AlertTriangle, Building2, Shield, Heart, Flame, Users } from 'lucide-react';

const Emergency = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const emergencyContacts = [
    {
      name: { en: 'BCCL Control Room', hi: 'BCCL नियंत्रण कक्ष' },
      phone: '0326-2222000',
      icon: Building2,
      color: 'bg-blue-500',
      description: { en: 'For mining emergencies', hi: 'खनन आपात स्थिति के लिए' }
    },
    {
      name: { en: 'Dhanbad DC Office', hi: 'धनबाद DC कार्यालय' },
      phone: '0326-2222001',
      icon: Shield,
      color: 'bg-purple-500',
      description: { en: 'District administration', hi: 'जिला प्रशासन' }
    },
    {
      name: { en: 'NDMA Helpline', hi: 'NDMA हेल्पलाइन' },
      phone: '1078',
      icon: AlertTriangle,
      color: 'bg-red-500',
      description: { en: 'National disaster management', hi: 'राष्ट्रीय आपदा प्रबंधन' }
    },
    {
      name: { en: 'Fire Services', hi: 'अग्निशमन सेवा' },
      phone: '101',
      icon: Flame,
      color: 'bg-orange-500',
      description: { en: 'Fire and rescue', hi: 'अग्नि और बचाव' }
    },
    {
      name: { en: 'Ambulance', hi: 'एम्बुलेंस' },
      phone: '102',
      icon: Heart,
      color: 'bg-green-500',
      description: { en: 'Medical emergency', hi: 'चिकित्सा आपातकाल' }
    },
    {
      name: { en: 'Police', hi: 'पुलिस' },
      phone: '100',
      icon: Users,
      color: 'bg-gray-700',
      description: { en: 'Law enforcement', hi: 'कानून प्रवर्तन' }
    }
  ];

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-6">
        <div className="flex items-center gap-3 mb-2">
          <Phone className="w-8 h-8" />
          <h1 className="text-2xl font-bold">{t('emergency.title')}</h1>
        </div>
        <p className="text-red-100 text-sm">
          {language === 'hi' ? 'आपातकालीन स्थिति में तुरंत संपर्क करें' : 'Contact immediately in emergency situations'}
        </p>
      </div>

      <div className="p-4 space-y-3">
        {emergencyContacts.map((contact, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${contact.color}`}>
                <contact.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">
                  {contact.name[language]}
                </h3>
                <p className="text-sm text-gray-500">
                  {contact.description[language]}
                </p>
                <p className="text-lg font-bold text-primary mt-1">
                  {contact.phone}
                </p>
              </div>
              <button
                onClick={() => handleCall(contact.phone)}
                className="p-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
              >
                <Phone className="w-6 h-6" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 mt-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-800">
                {language === 'hi' ? 'महत्वपूर्ण सूचना' : 'Important Notice'}
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                {language === 'hi' 
                  ? 'आपातकालीन स्थिति में घबराएं नहीं। शांत रहें और निर्देशों का पालन करें। यदि आप धंसाव देखते हैं, तो तुरंत क्षेत्र खाली करें और अधिकारियों को सूचित करें।'
                  : 'In emergency, do not panic. Stay calm and follow instructions. If you witness subsidence, evacuate the area immediately and inform authorities.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emergency;
