import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, FileText } from 'lucide-react';

const TermsOfService = () => {
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
            <FileText className="w-10 h-10" />
            <h1 className="text-4xl font-bold">
              {language === 'hi' ? 'सेवा की शर्तें' : 'Terms of Service'}
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
              {language === 'hi' ? '1. शर्तों की स्वीकृति' : '1. Acceptance of Terms'}
            </h2>
            <p className="text-gray-700 mb-6">
              {language === 'hi'
                ? 'JhariaWatch का उपयोग करके, आप इन सेवा की शर्तों से सहमत होते हैं। यदि आप इन शर्तों से सहमत नहीं हैं, तो कृपया इस सेवा का उपयोग न करें।'
                : 'By using JhariaWatch, you agree to these Terms of Service. If you do not agree to these terms, please do not use this service.'}
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'hi' ? '2. सेवा का उपयोग' : '2. Use of Service'}
            </h2>
            <p className="text-gray-700 mb-4">
              {language === 'hi' ? 'आप सहमत हैं:' : 'You agree to:'}
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>{language === 'hi' ? 'सटीक और वर्तमान जानकारी प्रदान करना' : 'Provide accurate and current information'}</li>
              <li>{language === 'hi' ? 'सभी लागू कानूनों और विनियमों का पालन करना' : 'Comply with all applicable laws and regulations'}</li>
              <li>{language === 'hi' ? 'सेवा का अनधिकृत या अवैध उपयोग न करना' : 'Not use the service for unauthorized or illegal purposes'}</li>
              <li>{language === 'hi' ? 'अपने खाते की जानकारी की सुरक्षा करना' : 'Protect your account information'}</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'hi' ? '3. चेतावनी और अस्वीकरण' : '3. Disclaimer'}
            </h2>
            <p className="text-gray-700 mb-6">
              {language === 'hi'
                ? 'JhariaWatch सूचना और सहायता उद्देश्यों के लिए प्रदान किया गया है। हम सर्वोत्तम प्रयास करते हैं, लेकिन सटीकता या समयबद्धता की गारंटी नहीं दे सकते। आपातकालीन स्थितियों में, कृपया आधिकारिक सरकारी चैनलों और आपातकालीन सेवाओं का पालन करें।'
                : 'JhariaWatch is provided for informational and assistance purposes. We strive for accuracy but cannot guarantee completeness or timeliness. In emergency situations, please follow official government channels and emergency services.'}
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'hi' ? '4. दायित्व की सीमा' : '4. Limitation of Liability'}
            </h2>
            <p className="text-gray-700 mb-6">
              {language === 'hi'
                ? 'JhariaWatch और इसके संचालक सेवा के उपयोग या उपयोग करने में असमर्थता से उत्पन्न किसी भी प्रत्यक्ष या अप्रत्यक्ष क्षति के लिए उत्तरदायी नहीं होंगे।'
                : 'JhariaWatch and its operators shall not be liable for any direct or indirect damages arising from the use or inability to use the service.'}
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'hi' ? '5. परिवर्तन' : '5. Changes to Terms'}
            </h2>
            <p className="text-gray-700 mb-6">
              {language === 'hi'
                ? 'हम इन शर्तों को किसी भी समय संशोधित कर सकते हैं। निरंतर उपयोग संशोधित शर्तों की स्वीकृति का गठन करता है।'
                : 'We may modify these terms at any time. Continued use constitutes acceptance of modified terms.'}
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'hi' ? '6. संपर्क करें' : '6. Contact Us'}
            </h2>
            <p className="text-gray-700 mb-2">
              {language === 'hi'
                ? 'यदि आपके पास इन शर्तों के बारे में कोई प्रश्न है:'
                : 'If you have any questions about these terms:'}
            </p>
            <ul className="list-none text-gray-700 space-y-1">
              <li><strong>Email:</strong> legal@jhariawatch.org</li>
              <li><strong>{language === 'hi' ? 'फोन' : 'Phone'}:</strong> 1800-xxx-xxxx</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
