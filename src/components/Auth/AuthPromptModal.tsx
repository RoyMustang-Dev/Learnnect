import React, { useState } from 'react';
import { X, User, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ModalPortal from '../Modals/ModalPortal';
import { emailService } from '../../services/emailService';
import { otpService } from '../../services/otpService';
import OTPVerificationModal from './OTPVerificationModal';
import EmailInput from '../EmailInput';
import PhoneInput from '../PhoneInput';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user?: any) => void;
  courseName: string;
  coursePrice: number;
}

const AuthPromptModal: React.FC<AuthPromptModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  courseName,
  coursePrice
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [pendingSignupData, setPendingSignupData] = useState<any>(null);

  // Validation states
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const { signIn, signUp, signInWithGoogle, signInWithGitHub } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleEmailChange = (value: string, isValid: boolean) => {
    setFormData(prev => ({ ...prev, email: value }));
    setIsEmailValid(isValid);
    setError('');
  };

  const handlePhoneChange = (value: string, isValid: boolean) => {
    setFormData(prev => ({ ...prev, phone: value }));
    setIsPhoneValid(isValid);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login flow - no OTP needed
        const result = await signIn(formData.email, formData.password);

        console.log('📧 Email/Password login result:', result);

        // Extract user data properly
        const user = result?.user as any;
        const userData = {
          id: user?.uid || '',
          email: user?.email || formData.email,
          name: user?.displayName || formData.name,
          photoURL: user?.photoURL || null
        };

        console.log('👤 Extracted user data for callback:', userData);
        onSuccess(userData);
      } else {
        // Signup flow - require email OTP verification
        // Validate email
        if (!isEmailValid) {
          throw new Error('Please enter a valid email address');
        }

        // Validate phone number if provided
        if (formData.phone && !isPhoneValid) {
          throw new Error('Please enter a valid Indian phone number starting with 6, 7, 8, or 9');
        }

        // Send OTP to email first
        const otpResult = await otpService.sendEmailOTP(formData.email, 'signup');

        if (otpResult.success) {
          // Store signup data for after OTP verification
          setPendingSignupData({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            phone: formData.phone
          });

          // Show OTP verification modal
          setShowOTPModal(true);
        } else {
          throw new Error(otpResult.message || 'Failed to send verification email');
        }
      }
    } catch (error: any) {
      setError(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerified = async () => {
    if (!pendingSignupData) return;

    setIsLoading(true);
    setError('');

    try {
      // Create the account after OTP verification
      const result = await signUp(
        pendingSignupData.email,
        pendingSignupData.password,
        pendingSignupData.name,
        pendingSignupData.phone
      );

      // Send welcome email for new signups
      await emailService.sendSignupWelcome({
        to: pendingSignupData.email,
        name: pendingSignupData.name,
        provider: 'Email'
      });

      console.log('📧 Email/Password signup result after OTP:', result);

      // Extract user data properly
      const user = result?.user as any;
      const userData = {
        id: user?.uid || '',
        email: user?.email || pendingSignupData.email,
        name: user?.displayName || pendingSignupData.name,
        photoURL: user?.photoURL || null
      };

      console.log('👤 Extracted user data for callback:', userData);

      // Close OTP modal and auth modal
      setShowOTPModal(false);
      setPendingSignupData(null);

      // Pass the authenticated user data to the success callback
      onSuccess(userData);
    } catch (error: any) {
      setError(error.message || 'Account creation failed');
      setShowOTPModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    setError('');

    try {
      let result;
      if (provider === 'google') {
        result = await signInWithGoogle();
      } else {
        result = await signInWithGitHub();
      }

      console.log('🔐 Social auth result:', result);

      // Send welcome email for new users (check if this was a signup)
      if (result && result.isNewUser) {
        await emailService.sendSignupWelcome({
          to: result.user.email,
          name: result.user.name || result.user.email.split('@')[0],
          provider: provider === 'google' ? 'Google' : 'GitHub'
        });
      }

      // Extract user data properly from social auth result
      const user = result?.user as any;
      const userData = user ? {
        id: user.uid,
        email: user.email || '',
        name: user.displayName || user.email?.split('@')[0] || '',
        photoURL: user.photoURL || null
      } : null;

      console.log('👤 Extracted social user data for callback:', userData);

      // Pass the authenticated user data to the success callback
      onSuccess(userData);
    } catch (error: any) {
      setError(error.message || 'Social authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalPortal isOpen={isOpen}>
      <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {isLogin ? 'Sign In Required' : 'Create Account'}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {coursePrice === 0 ? 'Free enrollment' : `Enroll for ₹${coursePrice}`} in {courseName}
            </p>
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
          {/* Course Info */}
          <div className="bg-gradient-to-r from-neon-cyan/10 to-neon-magenta/10 rounded-lg p-4 mb-6 border border-neon-cyan/30">
            <h3 className="font-bold text-neon-cyan mb-2">Ready to start learning?</h3>
            <p className="text-gray-300 text-sm">
              Join thousands of students who are already advancing their careers with our courses.
            </p>
          </div>

          {/* Social Auth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialAuth('google')}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              onClick={() => handleSocialAuth('github')}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>Continue with GitHub</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">Or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            <EmailInput
              label="Email Address"
              value={formData.email}
              onChange={handleEmailChange}
              required
              placeholder="Enter your email"
              className=""
            />

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <PhoneInput
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="Enter 10-digit mobile number"
                  className=""
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-neon-magenta to-neon-pink text-white font-bold rounded-lg hover:from-neon-pink hover:to-neon-magenta transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : isLogin ? 'Sign In & Enroll' : 'Create Account & Enroll'}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({ email: '', password: '', name: '', phone: '' });
                }}
                className="ml-2 text-neon-cyan hover:text-cyan-300 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOTPModal && (
        <OTPVerificationModal
          isOpen={showOTPModal}
          onClose={() => {
            setShowOTPModal(false);
            setPendingSignupData(null);
          }}
          onVerified={handleOTPVerified}
          identifier={pendingSignupData?.email || ''}
          type="email"
          purpose="signup"
          title="Verify Your Email"
        />
      )}
    </ModalPortal>
  );
};

export default AuthPromptModal;
