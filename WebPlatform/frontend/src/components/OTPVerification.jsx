import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, CheckCircle, Phone } from 'lucide-react';
import { sendOTP, verifyOTP, setupRecaptcha } from '../services/firebaseAuth';

const OTPVerification = ({ phoneNumber, onVerified, onCancel, language = 'hi' }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const recaptchaContainerRef = useRef(null);

  useEffect(() => {
    if (phoneNumber && !otpSent) {
      sendOTPToPhone();
    }
  }, [phoneNumber]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const sendOTPToPhone = async () => {
    setLoading(true);
    setError(null);

    try {
      // Setup recaptcha
      const recaptcha = setupRecaptcha('recaptcha-container');
      if (!recaptcha) {
        throw new Error('Recaptcha setup failed');
      }

      // Send OTP
      const result = await sendOTP(phoneNumber, recaptcha);
      
      if (result.success) {
        setConfirmationResult(result.confirmationResult);
        setOtpSent(true);
        setCountdown(60); // 60 seconds countdown
      } else {
        setError(result.error?.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.error('Send OTP error:', err);
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError(language === 'hi' ? 'कृपया 6 अंकों का OTP दर्ज करें' : 'Please enter 6-digit OTP');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Mock OTP verification (123456 or 000000)
      const mockOTPs = ['123456', '000000'];
      
      if (mockOTPs.includes(otpString)) {
        // Mock successful verification
        console.log('✅ Mock OTP verified:', otpString);
        onVerified({
          phoneNumber: phoneNumber,
          uid: `mock_${Date.now()}`
        }, 'mock_token_' + Date.now());
      } else if (confirmationResult) {
        // Real Firebase OTP verification
        const result = await verifyOTP(confirmationResult, otpString);
        
        if (result.success) {
          onVerified(result.user, result.token);
        } else {
          setError(result.error?.message || 'Invalid OTP');
        }
      } else {
        setError(language === 'hi' ? 'अमान्य OTP. कृपया 123456 या 000000 दर्ज करें' : 'Invalid OTP. Please enter 123456 or 000000');
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
      setError(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    setOtpSent(false);
    setError(null);
    sendOTPToPhone();
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
          <Phone className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {language === 'hi' ? 'OTP सत्यापन' : 'OTP Verification'}
        </h3>
        <p className="text-sm text-gray-600">
          {language === 'hi' 
            ? `हमने OTP भेजा है ${phoneNumber} पर`
            : `We sent an OTP to ${phoneNumber}`
          }
        </p>
      </div>

      {/* Recaptcha Container (hidden) */}
      <div id="recaptcha-container" ref={recaptchaContainerRef}></div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {otpSent && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
            {language === 'hi' ? 'OTP दर्ज करें' : 'Enter OTP'}
          </label>
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary outline-none transition"
              />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {otpSent ? (
          <>
            <button
              onClick={handleVerify}
              disabled={loading || otp.join('').length !== 6}
              className="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {language === 'hi' ? 'सत्यापित कर रहे हैं...' : 'Verifying...'}
                </span>
              ) : (
                language === 'hi' ? 'सत्यापित करें' : 'Verify'
              )}
            </button>
            
            {countdown > 0 ? (
              <p className="text-center text-sm text-gray-500">
                {language === 'hi' 
                  ? `OTP पुनः भेजें (${countdown} सेकंड)`
                  : `Resend OTP (${countdown}s)`
                }
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="w-full py-2 text-primary font-medium hover:underline"
              >
                {language === 'hi' ? 'OTP पुनः भेजें' : 'Resend OTP'}
              </button>
            )}
          </>
        ) : (
          <button
            onClick={sendOTPToPhone}
            disabled={loading}
            className="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {language === 'hi' ? 'OTP भेज रहे हैं...' : 'Sending OTP...'}
              </span>
            ) : (
              language === 'hi' ? 'OTP भेजें' : 'Send OTP'
            )}
          </button>
        )}

        <button
          onClick={onCancel}
          className="w-full py-2 text-gray-600 hover:text-gray-800 font-medium"
        >
          {language === 'hi' ? 'रद्द करें' : 'Cancel'}
        </button>
      </div>
    </div>
  );
};

export default OTPVerification;

