import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageToggle = ({ className = '' }) => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className={`px-3 py-1.5 rounded-full text-sm font-bold transition-all ${className}`}
      style={{ 
        backgroundColor: 'rgba(255,255,255,0.2)',
        backdropFilter: 'blur(4px)'
      }}
    >
      {language === 'en' ? 'हिं' : 'EN'}
    </button>
  );
};

export default LanguageToggle;
