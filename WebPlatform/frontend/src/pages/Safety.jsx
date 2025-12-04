import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { Shield, AlertTriangle, CheckCircle, XCircle, ChevronDown, Home, Clock, MapPin } from 'lucide-react';

const Safety = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState('tips');

  const safetyTips = {
    en: [
      { icon: Home, text: 'Regularly inspect your home for cracks in walls and floors' },
      { icon: AlertTriangle, text: 'Keep important documents in a waterproof bag ready for evacuation' },
      { icon: MapPin, text: 'Know your nearest safe zone and evacuation routes' },
      { icon: Clock, text: 'Report any new cracks or ground changes immediately through the app' },
      { icon: Shield, text: 'Avoid staying in condemned or severely damaged buildings' }
    ],
    hi: [
      { icon: Home, text: 'नियमित रूप से अपने घर में दीवारों और फर्श में दरारों की जांच करें' },
      { icon: AlertTriangle, text: 'महत्वपूर्ण दस्तावेजों को वाटरप्रूफ बैग में निकासी के लिए तैयार रखें' },
      { icon: MapPin, text: 'अपने निकटतम सुरक्षित क्षेत्र और निकासी मार्गों को जानें' },
      { icon: Clock, text: 'ऐप के माध्यम से किसी भी नई दरार या जमीन के बदलाव की तुरंत रिपोर्ट करें' },
      { icon: Shield, text: 'गंभीर रूप से क्षतिग्रस्त भवनों में रहने से बचें' }
    ]
  };

  const dosAndDonts = {
    en: {
      dos: [
        'Keep emergency kit ready with water, food, medicines',
        'Stay informed through official JhariaWatch alerts',
        'Participate in community awareness programs',
        'Know first aid basics',
        'Keep battery-powered radio for emergency updates'
      ],
      donts: [
        'Do not ignore cracks in walls or ground',
        'Do not enter subsided or collapsed areas',
        'Do not spread rumors about disasters',
        'Do not store heavy items on upper floors in risk zones',
        'Do not block evacuation routes'
      ]
    },
    hi: {
      dos: [
        'पानी, भोजन, दवाओं के साथ आपातकालीन किट तैयार रखें',
        'आधिकारिक JhariaWatch अलर्ट के माध्यम से सूचित रहें',
        'सामुदायिक जागरूकता कार्यक्रमों में भाग लें',
        'प्राथमिक चिकित्सा की मूल बातें जानें',
        'आपातकालीन अपडेट के लिए बैटरी चालित रेडियो रखें'
      ],
      donts: [
        'दीवारों या जमीन में दरारों को नज़रअंदाज़ न करें',
        'धंसे हुए या गिरे हुए क्षेत्रों में प्रवेश न करें',
        'आपदाओं के बारे में अफवाहें न फैलाएं',
        'जोखिम क्षेत्रों में ऊपरी मंजिलों पर भारी सामान न रखें',
        'निकासी मार्गों को अवरुद्ध न करें'
      ]
    }
  };

  const evacuationGuide = {
    en: [
      { step: 1, title: 'Stay Calm', desc: 'Do not panic. Alert your family members immediately.' },
      { step: 2, title: 'Grab Essentials', desc: 'Take your emergency kit, documents, and phone.' },
      { step: 3, title: 'Follow Routes', desc: 'Use designated evacuation routes shown in the app.' },
      { step: 4, title: 'Move to Safe Zone', desc: 'Go to the nearest marked safe assembly point.' },
      { step: 5, title: 'Report Status', desc: 'Inform authorities about your status and any trapped people.' }
    ],
    hi: [
      { step: 1, title: 'शांत रहें', desc: 'घबराएं नहीं। अपने परिवार के सदस्यों को तुरंत सचेत करें।' },
      { step: 2, title: 'जरूरी चीजें लें', desc: 'अपनी आपातकालीन किट, दस्तावेज और फोन लें।' },
      { step: 3, title: 'मार्ग का पालन करें', desc: 'ऐप में दिखाए गए निर्दिष्ट निकासी मार्गों का उपयोग करें।' },
      { step: 4, title: 'सुरक्षित क्षेत्र में जाएं', desc: 'निकटतम चिह्नित सुरक्षित सभा स्थल पर जाएं।' },
      { step: 5, title: 'स्थिति की रिपोर्ट करें', desc: 'अधिकारियों को अपनी स्थिति और किसी भी फंसे लोगों के बारे में सूचित करें।' }
    ]
  };

  const sections = [
    { id: 'tips', label: language === 'hi' ? 'सुरक्षा टिप्स' : 'Safety Tips' },
    { id: 'dosdont', label: language === 'hi' ? 'क्या करें/न करें' : "Do's & Don'ts" },
    { id: 'evacuation', label: language === 'hi' ? 'निकासी गाइड' : 'Evacuation Guide' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8" />
          <h1 className="text-2xl font-bold">{t('safety.title')}</h1>
        </div>
        <p className="text-green-100 text-sm">
          {language === 'hi' ? 'धंसाव आपदा में सुरक्षित रहने के लिए महत्वपूर्ण जानकारी' : 'Important information to stay safe during subsidence events'}
        </p>
      </div>

      <div className="flex gap-2 p-4 overflow-x-auto">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              activeSection === section.id
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 shadow-sm'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      <div className="px-4">
        {activeSection === 'tips' && (
          <div className="space-y-3">
            {safetyTips[language].map((tip, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-full flex-shrink-0">
                  <tip.icon className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-gray-700">{tip.text}</p>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'dosdont' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-green-700 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {language === 'hi' ? 'क्या करें' : "DO's"}
              </h3>
              <div className="space-y-2">
                {dosAndDonts[language].dos.map((item, index) => (
                  <div key={index} className="bg-green-50 rounded-xl p-3 flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-red-700 mb-3 flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                {language === 'hi' ? 'क्या न करें' : "DON'Ts"}
              </h3>
              <div className="space-y-2">
                {dosAndDonts[language].donts.map((item, index) => (
                  <div key={index} className="bg-red-50 rounded-xl p-3 flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'evacuation' && (
          <div className="space-y-3">
            {evacuationGuide[language].map((step, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm flex gap-4">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {step.step}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{step.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Safety;
