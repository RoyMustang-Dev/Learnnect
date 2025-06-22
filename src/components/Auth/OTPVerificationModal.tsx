import React, { useState, useEffect } from 'react';
import { X, Mail, Smartphone, RefreshCw, CheckCircle } from 'lucide-react';
import { otpService } from '../../services/otpService';
import ModalPortal from '../Modals/ModalPortal';

interface OTPVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
  identifier: string; // email or phone
  type: 'email' | 'sms';
  purpose: 'signup' | 'login' | 'password_reset' | 'phone_verification';
  title?: string;
}

const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({
  isOpen,
  onClose,
  onVerified,
  identifier,
  type,
  purpose,
  title
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [canResend, setCanResend] = useState(false);

  // Timer for OTP expiry
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  // Allow resend after 60 seconds
  useEffect(() => {
    if (!isOpen) return;

    const resendTimer = setTimeout(() => {
      setCanResend(true);
    }, 60000); // 1 minute

    return () => clearTimeout(resendTimer);
  }, [isOpen]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '', '', '']);
      setError('');
      setSuccess(false);
      setTimeLeft(600);
      setCanResend(false);
    }
  }, [isOpen]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-verify when all digits are entered
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async (otpCode?: string) => {
    const code = otpCode || otp.join('');
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const result = await otpService.verifyOTP(identifier, code, type);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onVerified();
        }, 1500);
      } else {
        setError(result.message);
        if (result.remainingAttempts === 0) {
          setTimeout(() => {
            onClose();
          }, 3000);
        }
      }
    } catch (error) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError('');

    try {
      const result = await otpService.resendOTP(identifier, type, purpose);
      
      if (result.success) {
        setTimeLeft(600);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        
        // Reset resend timer
        setTimeout(() => {
          setCanResend(true);
        }, 60000);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMaskedIdentifier = () => {
    if (type === 'email') {
      const [username, domain] = identifier.split('@');
      return `${username.slice(0, 2)}***@${domain}`;
    } else {
      return `+91 ${identifier.slice(0, 2)}****${identifier.slice(-2)}`;
    }
  };

  if (!isOpen) return null;

  if (success) {
    return (
      <ModalPortal isOpen={isOpen}>
        <div className="bg-gray-900 rounded-2xl border border-gray-700 max-w-md w-full p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Verified Successfully!</h2>
          <p className="text-gray-300">
            Your {type === 'email' ? 'email' : 'phone number'} has been verified.
          </p>
        </div>
      </ModalPortal>
    );
  }

  return (
    <ModalPortal isOpen={isOpen}>
      <div className="bg-gray-900 rounded-2xl border border-gray-700 max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            {type === 'email' ? (
              <Mail className="h-6 w-6 text-neon-cyan" />
            ) : (
              <Smartphone className="h-6 w-6 text-neon-cyan" />
            )}
            <div>
              <h2 className="text-xl font-bold text-white">
                {title || `Verify ${type === 'email' ? 'Email' : 'Phone'}`}
              </h2>
              <p className="text-gray-400 text-sm">
                Enter the 6-digit code sent to {getMaskedIdentifier()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* OTP Input */}
          <div className="flex justify-center space-x-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
                maxLength={1}
                autoComplete="off"
              />
            ))}
          </div>

          {/* Timer */}
          <div className="text-center mb-4">
            <p className="text-gray-400 text-sm">
              {timeLeft > 0 ? (
                <>Code expires in <span className="text-neon-cyan font-mono">{formatTime(timeLeft)}</span></>
              ) : (
                <span className="text-red-400">Code has expired</span>
              )}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Verify Button */}
          <button
            onClick={() => handleVerify()}
            disabled={isVerifying || otp.some(digit => digit === '')}
            className="w-full py-3 bg-gradient-to-r from-neon-magenta to-neon-pink text-white font-bold rounded-lg hover:from-neon-pink hover:to-neon-magenta transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {isVerifying ? 'Verifying...' : 'Verify OTP'}
          </button>

          {/* Resend Button */}
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">Didn't receive the code?</p>
            <button
              onClick={handleResend}
              disabled={!canResend || isResending}
              className="text-neon-cyan hover:text-cyan-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mx-auto"
            >
              <RefreshCw className={`h-4 w-4 ${isResending ? 'animate-spin' : ''}`} />
              <span>{isResending ? 'Resending...' : 'Resend OTP'}</span>
            </button>
            {!canResend && timeLeft > 540 && (
              <p className="text-xs text-gray-500 mt-1">
                You can resend in {60 - Math.floor((600 - timeLeft))} seconds
              </p>
            )}
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default OTPVerificationModal;
