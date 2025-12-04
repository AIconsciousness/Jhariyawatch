import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, Shield } from 'lucide-react';

const PrivacyPolicy = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
            <ArrowLeft className="w-5 h-5" />
            {language === 'hi' ? 'होम पेज' : 'Back to Home'}
          </Link>
          <div className="flex items-center gap-3 mt-4">
            <Shield className="w-10 h-10" />
            <h1 className="text-4xl font-bold">
              {language === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy'}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-gray-600 mb-8">
            {language === 'hi' ? 'अंतिम अपडेट: दिसंबर 2024' : 'Last Updated: December 2024'}
          </p>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'hi' ? '1. परिचय' : '1. Introduction'}
            </h2>
            <p className="text-gray-700 mb-6">
              {language === 'hi'
                ? 'JhariaWatch ("हम", "हमारा", या "हमें") आपकी गोपनीयता की रक्षा के लिए प्रतिबद्ध है। यह गोपनीयता नीति बताती है कि हम आपकी व्यक्तिगत जानकारी को कैसे एकत्र, उपयोग और संरक्षित करते हैं।'
                : 'JhariaWatch ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your personal information.'}
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'hi' ? '2. हम जो जानकारी एकत्र करते हैं' : '2. Information We Collect'}
            </h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {language === 'hi' ? 'व्यक्तिगत जानकारी' : 'Personal Information'}
            </h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>{language === 'hi' ? 'नाम' : 'Name'}</li>
              <li>{language === 'hi' ? 'ईमेल पता' : 'Email address'}</li>
              <li>{language === 'hi' ? 'फोन नंबर' : 'Phone number'}</li>
              <li>{language === 'hi' ? 'घर का पता और स्थान' : 'Home address and location'}</li>
              <li>{language === 'hi' ? 'भाषा प्राथमिकता' : 'Language preference'}</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {language === 'hi' ? 'तकनीकी जानकारी' : 'Technical Information'}
            </h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>{language === 'hi' ? 'IP पता' : 'IP address'}</li>
              <li>{language === 'hi' ? 'ब्राउज़र प्रकार और संस्करण' : 'Browser type and version'}</li>
              <li>{language === 'hi' ? 'डिवाइस जानकारी' : 'Device information'}</li>
              <li>{language === 'hi' ? 'उपयोग डेटा और गतिविधि लॉग' : 'Usage data and activity logs'}</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'hi' ? '3. हम आपकी जानकारी का उपयोग कैसे करते हैं' : '3. How We Use Your Information'}
            </h2>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>{language === 'hi' ? 'आपके क्षेत्र के लिए जोखिम मूल्यांकन प्रदान करना' : 'Provide risk assessments for your area'}</li>
              <li>{language === 'hi' ? 'सबसाइडेंस चेतावनी भेजना' : 'Send subsidence alerts'}</li>
              <li>{language === 'hi' ? 'सेवाओं में सुधार और वैयक्तिकरण' : 'Improve and personalize services'}</li>
              <li>{language === 'hi' ? 'तकनीकी सहायता प्रदान करना' : 'Provide technical support'}</li>
              <li>{language === 'hi' ? 'कानूनी दायित्वों का पालन करना' : 'Comply with legal obligations'}</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'hi' ? '4. डेटा सुरक्षा' : '4. Data Security'}
            </h2>
            <p className="text-gray-700 mb-6">
              {language === 'hi'
                ? 'हम आपकी जानकारी की सुरक्षा के लिए उद्योग-मानक सुरक्षा उपायों का उपयोग करते हैं, जिसमें एन्क्रिप्शन, सुरक्षित सर्वर और नियमित सुरक्षा ऑडिट शामिल हैं।'
                : 'We use industry-standard security measures to protect your information, including encryption, secure servers, and regular security audits.'}
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'hi' ? '5. कुकीज़' : '5. Cookies'}
            </h2>
            <p className="text-gray-700 mb-6">
              {language === 'hi'
                ? 'हम उपयोगकर्ता अनुभव को बेहतर बनाने के लिए कुकीज़ और समान तकनीकों का उपयोग करते हैं। अधिक जानकारी के लिए हमारी कुकी नीति देखें।'
                : 'We use cookies and similar technologies to enhance user experience. See our Cookie Policy for more information.'}
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'hi' ? '6. आपके अधिकार' : '6. Your Rights'}
            </h2>
            <p className="text-gray-700 mb-4">
              {language === 'hi' ? 'आपके पास निम्नलिखित अधिकार हैं:' : 'You have the right to:'}
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>{language === 'hi' ? 'अपनी व्यक्तिगत जानकारी तक पहुंचना' : 'Access your personal information'}</li>
              <li>{language === 'hi' ? 'गलत जानकारी को सुधारना' : 'Correct inaccurate information'}</li>
              <li>{language === 'hi' ? 'अपनी जानकारी को हटाने का अनुरोध करना' : 'Request deletion of your information'}</li>
              <li>{language === 'hi' ? 'डेटा प्रोसेसिंग पर आपत्ति करना' : 'Object to data processing'}</li>
              <li>{language === 'hi' ? 'डेटा पोर्टेबिलिटी' : 'Data portability'}</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'hi' ? '7. संपर्क करें' : '7. Contact Us'}
            </h2>
            <p className="text-gray-700 mb-2">
              {language === 'hi'
                ? 'यदि आपके पास इस गोपनीयता नीति के बारे में कोई प्रश्न है, तो कृपया हमसे संपर्क करें:'
                : 'If you have any questions about this Privacy Policy, please contact us:'}
            </p>
            <ul className="list-none text-gray-700 space-y-1">
              <li><strong>Email:</strong> privacy@jhariawatch.org</li>
              <li><strong>{language === 'hi' ? 'फोन' : 'Phone'}:</strong> 1800-xxx-xxxx</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
