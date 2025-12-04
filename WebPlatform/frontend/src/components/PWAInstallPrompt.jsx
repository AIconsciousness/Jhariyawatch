import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    // Check if already dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) return;

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show install prompt after 3 seconds
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-red-600 to-orange-600 text-white p-4 shadow-2xl z-50 animate-slide-up">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <img src="/logo.png" alt="JhariaWatch" className="w-10 h-10 rounded-lg" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">
              {language === 'hi' ? 'ऐप इंस्टॉल करें' : 'Install App'}
            </h3>
            <p className="text-sm text-white/90">
              {language === 'hi'
                ? 'बेहतर अनुभव के लिए JhariaWatch ऐप इंस्टॉल करें'
                : 'Install JhariaWatch app for better experience'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center gap-2 whitespace-nowrap"
          >
            <Download className="w-5 h-5" />
            {language === 'hi' ? 'इंस्टॉल करें' : 'Install'}
          </button>
          <button
            onClick={handleDismiss}
            className="p-2 hover:bg-white/10 rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
