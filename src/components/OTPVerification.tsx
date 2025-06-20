import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Loader2, Shield, Smartphone, RefreshCw } from 'lucide-react';

interface OTPVerificationProps {
  phoneNumber: string;
  onVerifySuccess: () => void;
  onBack: () => void;
  onResendOTP: () => Promise<void>;
  onVerifyOTP: (otp: string) => Promise<void>;
  loading: boolean;
  error: string;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  phoneNumber,
  onVerifySuccess,
  onBack,
  onResendOTP,
  onVerifyOTP,
  loading,
  error
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    
    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex(digit => digit === '');
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();

    // Auto-submit if complete
    if (newOtp.every(digit => digit !== '')) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  const handleVerifyOTP = async (otpCode: string) => {
    try {
      await onVerifyOTP(otpCode);
      onVerifySuccess();
    } catch (error) {
      // Error is handled by parent component
      console.error('OTP verification failed:', error);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    try {
      await onResendOTP();
      setCountdown(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error('Resend OTP failed:', error);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    // Format phone number for display (e.g., +1 (555) 123-4567)
    if (phone.startsWith('+91')) {
      return `+91 ${phone.slice(3, 8)} ${phone.slice(8)}`;
    }
    return phone;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <button
          onClick={onBack}
          className="inline-flex items-center text-cyan-300 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
        
        <div className="mb-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Verify Your Phone</h2>
          <p className="text-cyan-200/80 text-sm">
            We've sent a 6-digit code to
          </p>
          <p className="text-neon-cyan font-medium">
            {formatPhoneNumber(phoneNumber)}
          </p>
        </div>
      </div>

      {/* OTP Input */}
      <div className="space-y-4">
        <div className="flex justify-center space-x-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={e => handleInputChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-12 text-center text-xl font-bold bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan transition-all duration-200"
              disabled={loading}
            />
          ))}
        </div>

        {error && (
          <div className="text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Verify Button */}
      <button
        onClick={() => handleVerifyOTP(otp.join(''))}
        disabled={loading || otp.some(digit => digit === '')}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-neon-cyan to-neon-blue hover:from-cyan-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-cyan disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        style={{ boxShadow: '0 0 20px rgba(0,255,255,0.3)' }}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
            Verifying...
          </>
        ) : (
          <>
            <Shield className="h-4 w-4 mr-2" />
            Verify Code
          </>
        )}
      </button>

      {/* Resend Section */}
      <div className="text-center">
        <p className="text-cyan-200/60 text-sm mb-2">
          Didn't receive the code?
        </p>
        
        {canResend ? (
          <button
            onClick={handleResend}
            className="inline-flex items-center text-neon-cyan hover:text-cyan-300 font-medium text-sm transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Resend Code
          </button>
        ) : (
          <p className="text-cyan-300/60 text-sm">
            Resend code in {countdown}s
          </p>
        )}
      </div>

      {/* Info */}
      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <div className="flex items-start space-x-3">
          <Smartphone className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-blue-200 text-sm font-medium mb-1">
              SMS Verification
            </p>
            <p className="text-blue-200/80 text-xs">
              Standard messaging rates may apply. The code will expire in 10 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
