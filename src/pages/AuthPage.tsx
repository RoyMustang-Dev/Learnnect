import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Mail,
  Eye,
  EyeOff,
  Phone,
  User,
  Lock,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import SocialLoginModal from '../components/SocialLoginModal';
import AccountExistsModal from '../components/AccountExistsModal';
import NewUserLoginModal from '../components/NewUserLoginModal';
import OTPVerification from '../components/OTPVerification';
import { useAuth } from '../contexts/AuthContext';
import { validatePhone, getEmailValidationError, getPasswordValidationError, getPhoneValidationError } from '../utils/validation';
import PhoneInput from '../components/PhoneInput';
import firebaseAuthService from '../services/firebaseAuthService';
// import { isGoogleConfigured, startGoogleAuth, getGoogleStatus } from '../utils/googleAuth';

// Types
interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    signInWithGoogle,
    signUpWithGoogle,
    loginWithGoogle,
    signInWithGitHub,
    signUpWithGitHub,
    loginWithGitHub,
    signUpWithEmailAndPassword,
    signInWithEmailAndPassword,
    resetPassword,
    initializePhoneAuth,
    sendPhoneOTP,
    verifyPhoneOTP,
    cleanupPhoneAuth
  } = useAuth();
  const isSignup = searchParams.get('signup') === 'true';

  // Main state
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'forgot' | 'otp'>(
    isSignup ? 'signup' : 'login'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [accountExistsModal, setAccountExistsModal] = useState({
    isOpen: false,
    email: '',
    attemptedProvider: '',
    existingProvider: '',
    isSignupAttempt: false
  });
  const [newUserLoginModal, setNewUserLoginModal] = useState({
    isOpen: false,
    provider: '',
    email: ''
  });
  const [socialProvider, setSocialProvider] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [redirectMessage, setRedirectMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  });

  // Phone validation state
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  // Validation state
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    form: '' // For form-level errors
  });

  // OTP state
  const [otpData, setOtpData] = useState({
    otp: '',
    method: 'phone' as 'email' | 'phone',
    countdown: 0,
    canResend: true,
    phoneNumber: '',
    confirmationResult: null as any,
    pendingUserData: null as any
  });

  // Forgot password state (for future implementation)
  // const [forgotData, setForgotData] = useState({
  //   identifier: '',
  //   method: 'email' as 'email' | 'phone'
  // });



  // Firebase authentication will be used instead of mock API

  // Effects
  useEffect(() => {
    // Update activeTab when URL parameters change
    const isSignupParam = searchParams.get('signup') === 'true';
    setActiveTab(isSignupParam ? 'signup' : 'login');
  }, [searchParams]);

  // Mobile detection - consistent with Firebase service
  useEffect(() => {
    const checkMobile = () => {
      // Use CSS media query approach for consistency
      setIsMobile(window.matchMedia('(max-width: 767px)').matches);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize phone authentication
  useEffect(() => {
    try {
      initializePhoneAuth('recaptcha-container');
    } catch (error) {
      console.error('Failed to initialize phone auth:', error);
    }

    // Cleanup on unmount
    return () => {
      cleanupPhoneAuth();
    };
  }, [initializePhoneAuth, cleanupPhoneAuth]);

  // Listen for account exists events and signup success events from AuthContext
  useEffect(() => {
    const handleAccountExists = (event: CustomEvent) => {
      setAccountExistsModal({
        isOpen: true,
        email: event.detail?.email || '',
        attemptedProvider: event.detail?.attemptedProvider || '',
        existingProvider: event.detail?.existingProvider || '',
        isSignupAttempt: event.detail?.isSignupAttempt || false
      });
    };

    const handleSignupSuccess = (event: CustomEvent) => {
      console.log('Signup success event received:', event.detail);
      setSuccess(event.detail.message);
      setTimeout(() => {
        navigate('/dashboard');
        window.location.reload();
      }, 1500);
    };

    window.addEventListener('accountExists', handleAccountExists as EventListener);
    window.addEventListener('signupSuccess', handleSignupSuccess as EventListener);

    return () => {
      window.removeEventListener('accountExists', handleAccountExists as EventListener);
      window.removeEventListener('signupSuccess', handleSignupSuccess as EventListener);
    };
  }, [navigate]);

  useEffect(() => {
    if (otpData.countdown > 0) {
      const timer = setTimeout(() => {
        setOtpData(prev => ({ ...prev, countdown: prev.countdown - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (otpData.countdown === 0 && !otpData.canResend) {
      setOtpData(prev => ({ ...prev, canResend: true }));
    }
  }, [otpData.countdown, otpData.canResend]);

  // Event handlers
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');

    // Clear validation error for this field
    setValidationErrors(prev => ({ ...prev, [field]: '' }));

    // Real-time validation for specific fields
    if (field === 'email' && value.trim()) {
      const emailError = getEmailValidationError(value);
      setValidationErrors(prev => ({ ...prev, email: emailError }));
    }

    if (field === 'phone' && value.trim()) {
      const phoneError = getPhoneValidationError(value);
      setValidationErrors(prev => ({ ...prev, phone: phoneError }));
    }

    if (field === 'password' && value.trim()) {
      const passwordError = getPasswordValidationError(value);
      setValidationErrors(prev => ({ ...prev, password: passwordError }));
    }

    if (field === 'confirmPassword' && value.trim()) {
      const confirmError = formData.password !== value ? 'Passwords do not match' : '';
      setValidationErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }

    if (field === 'name' && value.trim() === '') {
      setValidationErrors(prev => ({ ...prev, name: 'Name is required' }));
    }
  };

  const handlePhoneChange = (value: string, isValid: boolean) => {
    setFormData(prev => ({ ...prev, phone: value }));
    setIsPhoneValid(isValid);
    setError('');

    // Clear validation error for phone field
    setValidationErrors(prev => ({ ...prev, phone: '' }));

    // Set validation error if phone is provided but invalid
    if (value.trim() && !isValid) {
      setValidationErrors(prev => ({ ...prev, phone: 'Please enter a valid phone number' }));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setValidationErrors({});

    try {
      // Validate email
      const emailError = getEmailValidationError(formData.email);
      if (emailError) {
        setValidationErrors(prev => ({ ...prev, email: emailError }));
        setLoading(false);
        return;
      }

      // Validate password
      if (!formData.password.trim()) {
        setValidationErrors(prev => ({ ...prev, password: 'Password is required' }));
        setLoading(false);
        return;
      }

      // Use Firebase authentication instead of mockAPI
      await signInWithEmailAndPassword(formData.email, formData.password);

      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      setSuccess('Login successful! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
        window.location.reload();
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      // Set inline error based on error type
      if (errorMessage.includes('email') || errorMessage.includes('user-not-found')) {
        setValidationErrors(prev => ({ ...prev, email: 'No account found with this email address' }));
      } else if (errorMessage.includes('password') || errorMessage.includes('wrong-password')) {
        setValidationErrors(prev => ({ ...prev, password: 'Incorrect password' }));
      } else {
        // For general errors, show on email field as it's the primary identifier
        setValidationErrors(prev => ({ ...prev, email: errorMessage }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setValidationErrors({});

    try {
      if (!formData.name.trim()) {
        setValidationErrors(prev => ({ ...prev, name: 'Name is required' }));
        setLoading(false);
        return;
      }

      const emailError = getEmailValidationError(formData.email);
      if (emailError) {
        setValidationErrors(prev => ({ ...prev, email: emailError }));
        setLoading(false);
        return;
      }

      // Phone is now required
      if (!formData.phone.trim()) {
        setValidationErrors(prev => ({ ...prev, phone: 'Phone number is required' }));
        setLoading(false);
        return;
      }

      const phoneError = getPhoneValidationError(formData.phone);
      if (phoneError) {
        setValidationErrors(prev => ({ ...prev, phone: phoneError }));
        setLoading(false);
        return;
      }

      const passwordError = getPasswordValidationError(formData.password);
      if (passwordError) {
        setValidationErrors(prev => ({ ...prev, password: passwordError }));
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setValidationErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
        setLoading(false);
        return;
      }

      // Check if email already exists before proceeding
      const emailCheck = await firebaseAuthService.checkEmailExists(formData.email);
      if (emailCheck.exists) {
        setAccountExistsModal({
          isOpen: true,
          email: formData.email,
          attemptedProvider: 'Email/Password',
          existingProvider: emailCheck.providers.includes('password') ? 'Email/Password' :
                           emailCheck.providers.includes('google.com') ? 'Google' :
                           emailCheck.providers.includes('github.com') ? 'GitHub' : 'Unknown',
          isSignupAttempt: true
        });
        return;
      }

      // Store user data for OTP verification
      setOtpData(prev => ({
        ...prev,
        pendingUserData: {
          email: formData.email,
          password: formData.password,
          name: formData.name
        },
        phoneNumber: formData.phone
      }));

      // Send OTP to phone number
      try {
        const confirmationResult = await sendPhoneOTP(formData.phone);
        setOtpData(prev => ({
          ...prev,
          confirmationResult
        }));

        setActiveTab('otp');
        setSuccess('OTP sent to your phone number!');
      } catch (otpError: any) {
        console.error('OTP sending failed:', otpError);
        // Fallback: Create account without phone verification
        await signUpWithEmailAndPassword(formData.email, formData.password, formData.name);
        setSuccess('Account created successfully! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Account creation failed';

      // Handle duplicate account error - don't show inline error, let modal handle it
      if (errorMessage === 'FIREBASE_ACCOUNT_EXISTS' || errorMessage === 'ACCOUNT_ALREADY_EXISTS') {
        // Show account exists modal for email/password signup
        setAccountExistsModal({
          isOpen: true,
          email: formData.email,
          attemptedProvider: 'Email/Password',
          existingProvider: 'Email/Password',
          isSignupAttempt: true
        });
        return;
      }

      // Set inline error based on error type for other errors
      if (errorMessage.includes('email') || errorMessage.includes('email-already-in-use')) {
        setValidationErrors(prev => ({ ...prev, email: 'An account with this email already exists' }));
      } else if (errorMessage.includes('password')) {
        setValidationErrors(prev => ({ ...prev, password: errorMessage }));
      } else if (errorMessage.includes('phone')) {
        setValidationErrors(prev => ({ ...prev, phone: errorMessage }));
      } else {
        // For general errors, show on email field as it's the primary identifier
        setValidationErrors(prev => ({ ...prev, email: errorMessage }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const emailError = getEmailValidationError(formData.email);
      if (emailError) {
        throw new Error(emailError);
      }

      // Use Firebase password reset
      await resetPassword(formData.email);

      setSuccess('Password reset email sent! Check your inbox and follow the instructions.');

      // Switch back to login after 3 seconds
      setTimeout(() => {
        setActiveTab('login');
        setSuccess('');
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password reset failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async (otp: string) => {
    setLoading(true);
    setError('');

    try {
      if (!otpData.confirmationResult) {
        throw new Error('No OTP session found. Please try again.');
      }

      // Verify OTP
      await verifyPhoneOTP(otpData.confirmationResult, otp);

      // Create account with email/password after OTP verification
      if (otpData.pendingUserData) {
        await signUpWithEmailAndPassword(
          otpData.pendingUserData.email,
          otpData.pendingUserData.password,
          otpData.pendingUserData.name
        );
      }

      setSuccess('Account created successfully! Phone number verified. Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
        window.location.reload();
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'OTP verification failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      if (!otpData.phoneNumber) {
        throw new Error('Phone number not found');
      }

      const confirmationResult = await sendPhoneOTP(otpData.phoneNumber);
      setOtpData(prev => ({
        ...prev,
        confirmationResult
      }));

      setSuccess('New OTP sent to your phone number!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError(error.message || 'Failed to resend OTP');
    }
  };

  const handleBackFromOTP = () => {
    setActiveTab('signup');
    setOtpData(prev => ({
      ...prev,
      confirmationResult: null,
      pendingUserData: null,
      phoneNumber: ''
    }));
    setError('');
    setSuccess('');
  };

  const handleSocialLogin = async (provider: string) => {
    setLoading(true);
    setError('');

    try {
      if (provider === 'Google') {
        // Firebase Google authentication
        try {
          console.log('Starting Firebase Google authentication...');

          // Use appropriate method based on current tab
          if (activeTab === 'signup') {
            console.log('🔐 Attempting Google sign-up...');
            await signUpWithGoogle();
            // For signup, success handling is done in auth state change
            // Don't show success message or navigate here
          } else {
            console.log('🔐 Attempting Google login...');
            await loginWithGoogle();
            setSuccess('Google login successful! Redirecting to dashboard...');
            setTimeout(() => {
              navigate('/dashboard');
              window.location.reload();
            }, 1500);
          }
          return;
        } catch (error: any) {
          console.error('Firebase Google auth error:', error);
          if (error.message === 'REDIRECT_IN_PROGRESS') {
            // Show mobile-friendly redirect message
            if (isMobile) {
              setRedirectMessage('Redirecting to Google for authentication...');
              setLoading(false);
            }
            return;
          }

          // Handle specific error cases
          if (error.message.includes('account with this email already exists') ||
              error.message === 'FIREBASE_ACCOUNT_EXISTS' ||
              error.message === 'ACCOUNT_ALREADY_EXISTS') {
            // Show the account exists modal with provider info
            setAccountExistsModal({
              isOpen: true,
              email: '', // We could extract email from error if needed
              attemptedProvider: 'Google',
              existingProvider: 'Google',
              isSignupAttempt: activeTab === 'signup'
            });
            return;
          }

          const errorMessage = error instanceof Error ? error.message : 'Google authentication error';
          setError(errorMessage);
          return;
        }
      }

      // GitHub Firebase authentication
      if (provider === 'GitHub') {
        try {
          console.log('Starting Firebase GitHub authentication...');

          // Use appropriate method based on current tab
          if (activeTab === 'signup') {
            console.log('🔐 Attempting GitHub sign-up...');
            await signUpWithGitHub();
            // For signup, success handling is done in auth state change
            // Don't show success message or navigate here
          } else {
            console.log('🔐 Attempting GitHub login...');
            await loginWithGitHub();
            setSuccess('GitHub login successful! Redirecting to dashboard...');
            setTimeout(() => {
              navigate('/dashboard');
              window.location.reload();
            }, 1500);
          }
          return;
        } catch (error: any) {
          console.error('Firebase GitHub auth error:', error);
          if (error.message === 'REDIRECT_IN_PROGRESS') {
            // Show mobile-friendly redirect message
            if (isMobile) {
              setRedirectMessage('Redirecting to GitHub for authentication...');
              setLoading(false);
            }
            return;
          }

          // Handle specific error cases
          if (error.message.includes('account with this email already exists') ||
              error.message === 'FIREBASE_ACCOUNT_EXISTS' ||
              error.message === 'ACCOUNT_ALREADY_EXISTS') {
            // Show the account exists modal with provider info
            setAccountExistsModal({
              isOpen: true,
              email: '', // We could extract email from error if needed
              attemptedProvider: 'GitHub',
              existingProvider: 'GitHub',
              isSignupAttempt: activeTab === 'signup'
            });
            return;
          }

          const errorMessage = error instanceof Error ? error.message : 'GitHub authentication error';
          setError(errorMessage);
          return;
        }
      }

      // Only Google and GitHub are supported for social authentication
      console.log(`${provider} authentication is not implemented yet.`);
      setError(`${provider} authentication is not available at this time.`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      if (errorMessage === 'USER_NOT_FOUND' && activeTab === 'login') {
        setSocialProvider(provider);
        setShowSocialModal(true);
      } else if (errorMessage === 'NEW_USER_LOGIN_ATTEMPT' && activeTab === 'login') {
        // New user trying to login - show signup suggestion modal
        setNewUserLoginModal({
          isOpen: true,
          provider: provider,
          email: '' // We don't have email in this context
        });
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle direct login with existing provider from modal
  const handleDirectProviderLogin = async () => {
    const existingProvider = accountExistsModal.existingProvider;

    // Close the modal first
    setAccountExistsModal({
      isOpen: false,
      email: '',
      attemptedProvider: '',
      existingProvider: '',
      isSignupAttempt: false
    });

    // Clear any errors
    setError('');

    try {
      setLoading(true);

      if (existingProvider === 'Google') {
        console.log('🔐 Attempting direct Google login from modal...');
        await loginWithGoogle();
        setSuccess('Google login successful! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
          window.location.reload();
        }, 1500);
      } else if (existingProvider === 'GitHub') {
        console.log('🔐 Attempting direct GitHub login from modal...');
        await loginWithGitHub();
        setSuccess('GitHub login successful! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
          window.location.reload();
        }, 1500);
      }
    } catch (error: any) {
      console.error('Direct provider login error:', error);
      if (error.message === 'REDIRECT_IN_PROGRESS') {
        // Show mobile-friendly redirect message
        if (isMobile) {
          setRedirectMessage(`Redirecting to ${existingProvider} for authentication...`);
        }
        return;
      }
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neon-black via-gray-900 to-neon-black pt-20 sm:pt-24 relative overflow-hidden">
      {/* Enhanced Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-cyan/10 via-transparent to-neon-magenta/10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-magenta/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-neon-cyan/3 to-neon-magenta/3 rounded-full blur-3xl"></div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-6rem)] flex items-center py-8">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-7 gap-6 sm:gap-8 lg:gap-12 xl:gap-16 items-stretch min-h-[calc(100vh-12rem)]">

            {/* Left Side - Text Content */}
            <div className="lg:col-span-3 space-y-6 lg:space-y-8 text-center lg:text-left order-2 lg:order-1 lg:pr-4 xl:pr-8">
              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-magenta leading-tight">
                  {activeTab === 'login' && (
                    <>
                      Welcome<br />
                      <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl">Back to</span><br />
                      <span className="text-neon-cyan">Learnnect</span>
                    </>
                  )}
                  {activeTab === 'signup' && (
                    <>
                      Join the<br />
                      <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl">Future of</span><br />
                      <span className="text-neon-magenta">Learning</span>
                    </>
                  )}
                  {activeTab === 'forgot' && (
                    <>
                      Reset Your<br />
                      <span className="text-neon-cyan">Password</span>
                    </>
                  )}
                  {activeTab === 'otp' && (
                    <>
                      Verify<br />
                      <span className="text-neon-cyan">Your Code</span>
                    </>
                  )}
                </h1>

                <p className="text-lg sm:text-xl text-cyan-100/80 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  {activeTab === 'login' && 'Continue your learning journey and unlock your potential with our cutting-edge LMS platform.'}
                  {activeTab === 'signup' && 'Transform your skills with premium courses, expert instructors, and a community of learners.'}
                  {activeTab === 'forgot' && 'No worries! Enter your details below and we\'ll help you get back to learning.'}
                  {activeTab === 'otp' && `We've sent a verification code to your ${otpData.method}. Enter it below to continue.`}
                </p>
              </div>

              {/* Feature highlights for signup */}
              {activeTab === 'signup' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto lg:mx-0">
                  <div className="flex items-center space-x-3 p-3 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20">
                    <div className="w-8 h-8 rounded-full bg-neon-cyan/20 flex items-center justify-center">
                      <span className="text-neon-cyan text-sm">🎓</span>
                    </div>
                    <span className="text-cyan-200 text-sm font-medium">Premium Courses</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-xl bg-neon-magenta/10 border border-neon-magenta/20">
                    <div className="w-8 h-8 rounded-full bg-neon-magenta/20 flex items-center justify-center">
                      <span className="text-neon-magenta text-sm">📊</span>
                    </div>
                    <span className="text-cyan-200 text-sm font-medium">Progress Tracking</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-xl bg-neon-blue/10 border border-neon-blue/20">
                    <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center">
                      <span className="text-neon-blue text-sm">🏆</span>
                    </div>
                    <span className="text-cyan-200 text-sm font-medium">Certificates</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20">
                    <div className="w-8 h-8 rounded-full bg-neon-cyan/20 flex items-center justify-center">
                      <span className="text-neon-cyan text-sm">👥</span>
                    </div>
                    <span className="text-cyan-200 text-sm font-medium">Community</span>
                  </div>
                </div>
              )}

              {/* Stats for login */}
              {activeTab === 'login' && (
                <div className="flex justify-center lg:justify-start space-x-8">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-neon-cyan">50K+</div>
                    <div className="text-cyan-300/70 text-sm">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-neon-magenta">200+</div>
                    <div className="text-cyan-300/70 text-sm">Courses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-neon-blue">95%</div>
                    <div className="text-cyan-300/70 text-sm">Success Rate</div>
                  </div>
                </div>
              )}

              {/* Decorative elements */}
              <div className="hidden lg:block">
                <div className="flex space-x-2 justify-center lg:justify-start">
                  <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-neon-magenta animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" style={{animationDelay: '1s'}}></div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:col-span-4 order-1 lg:order-2 flex">
              <div className="w-full flex flex-col">
                <div
                  className="relative flex-1 py-6 sm:py-8 px-6 sm:px-8 lg:px-10 xl:px-12 2xl:px-16 rounded-xl sm:rounded-2xl border border-white/10 flex flex-col"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)'
                  }}
                >
          {/* Status Messages - Only show success and redirect messages */}
          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
              <p className="text-green-300 text-sm">{success}</p>
            </div>
          )}

          {redirectMessage && (
            <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center space-x-3">
              <Loader2 className="h-5 w-5 text-blue-400 flex-shrink-0 animate-spin" />
              <p className="text-blue-300 text-sm">{redirectMessage}</p>
            </div>
          )}

          {/* Back button for forgot password and OTP */}
          {(activeTab === 'forgot' || activeTab === 'otp') && (
            <button
              onClick={() => setActiveTab('login')}
              className="mb-6 flex items-center text-cyan-300 hover:text-neon-cyan transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to login
            </button>
          )}

          <div className="flex-1 flex flex-col space-y-6">
            {/* Social login options - only show for login/signup */}
            {(activeTab === 'login' || activeTab === 'signup') && (
              <div className="grid grid-cols-1 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  disabled={loading}
                  className="w-full flex items-center justify-center py-2.5 sm:py-3 px-3 sm:px-4 border border-white/30 hover:border-white/50 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-300 backdrop-blur-sm group text-sm sm:text-base transform hover:scale-105"
                  style={{boxShadow: '0 0 15px rgba(255,255,255,0.1)'}}
                >
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="group-hover:text-neon-cyan transition-colors">Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin('GitHub')}
                  disabled={loading}
                  className="w-full flex items-center justify-center py-2.5 sm:py-3 px-3 sm:px-4 border border-white/30 hover:border-white/50 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-300 backdrop-blur-sm group text-sm sm:text-base transform hover:scale-105"
                  style={{boxShadow: '0 0 15px rgba(255,255,255,0.1)'}}
                >
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-300 group-hover:text-neon-cyan transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span className="group-hover:text-neon-cyan transition-colors">Continue with GitHub</span>
                </button>


              </div>
            )}

            {/* Divider */}
            {(activeTab === 'login' || activeTab === 'signup') && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-cyan-200">Or continue with email</span>
                </div>
              </div>
            )}

            {/* Login Form */}
            {activeTab === 'login' && (
              <div>
                <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-neon-cyan/10 to-neon-blue/10 border border-neon-cyan/20">
                  <h3 className="text-neon-cyan font-semibold text-sm mb-2">🚀 Welcome back!</h3>
                  <p className="text-cyan-200/80 text-xs">
                    Sign in to access your personalized learning dashboard, continue your courses, and track your progress.
                  </p>
                </div>

                <form className="flex-1 flex flex-col space-y-4 sm:space-y-6" onSubmit={handleLogin}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="flex-1">
                      <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-cyan-200 mb-1.5 sm:mb-2">
                        Email address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white/5 border rounded-lg sm:rounded-xl text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 transition-all duration-200 backdrop-blur-sm text-sm sm:text-base ${
                            validationErrors.email
                              ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                              : 'border-white/20 focus:ring-neon-cyan focus:border-neon-cyan'
                          }`}
                          placeholder="Enter your email"
                        />
                      </div>
                      {validationErrors.email && (
                        <p className="mt-1 text-xs text-red-400">
                          {validationErrors.email}
                        </p>
                      )}
                    </div>

                    <div className="flex-1">
                      <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-cyan-200 mb-1.5 sm:mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          required
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-white/5 border rounded-lg sm:rounded-xl text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 transition-all duration-200 backdrop-blur-sm text-sm sm:text-base ${
                            validationErrors.password
                              ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                              : 'border-white/20 focus:ring-neon-cyan focus:border-neon-cyan'
                          }`}
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400 hover:text-neon-cyan transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {validationErrors.password && (
                        <p className="mt-1 text-xs text-red-400">
                          {validationErrors.password}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                        className="h-4 w-4 text-neon-cyan focus:ring-neon-cyan border-white/20 rounded bg-white/5"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-cyan-200">
                        Remember me
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('forgot')}
                      className="text-sm font-medium text-neon-cyan hover:text-cyan-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center py-3 px-4 border border-neon-cyan/50 rounded-xl text-sm font-bold text-neon-cyan bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 hover:from-neon-cyan/30 hover:to-neon-blue/30 hover:text-white hover:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-cyan disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                    style={{ boxShadow: '0 0 25px rgba(0,255,255,0.4), inset 0 0 20px rgba(0,255,255,0.1)' }}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                        Signing in...
                      </>
                    ) : (
                      'Sign in'
                    )}
                  </button>
                </form>

                <div className="mt-6 p-4 rounded-xl bg-neon-cyan/5 border border-neon-cyan/20">
                  <p className="text-cyan-200 text-sm text-center">
                    <strong>Secure Authentication:</strong><br />
                    Your account is protected with Firebase Authentication.<br />
                    All passwords are securely encrypted.
                  </p>
                </div>
              </div>
            )}

            {/* Signup Form */}
            {activeTab === 'signup' && (
              <div>
                <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-neon-magenta/10 to-neon-pink/10 border border-neon-magenta/20">
                  <h3 className="text-neon-magenta font-semibold text-sm mb-2">🎓 What you'll get:</h3>
                  <ul className="text-cyan-200/80 text-xs space-y-1">
                    <li>• Access to premium courses and content</li>
                    <li>• Personal learning dashboard and progress tracking</li>
                    <li>• Certificates upon course completion</li>
                    <li>• Community access and peer learning</li>
                  </ul>
                </div>

                <form className="flex-1 flex flex-col space-y-4 sm:space-y-6" onSubmit={handleSignup}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="flex-1">
                      <label htmlFor="name" className="block text-sm font-medium text-cyan-200 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400" />
                        <input
                          id="name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          required
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className={`w-full pl-12 pr-4 py-3 sm:py-4 bg-white/5 border rounded-xl text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 transition-all duration-200 backdrop-blur-sm ${
                            validationErrors.name
                              ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                              : 'border-white/20 focus:ring-neon-cyan focus:border-neon-cyan'
                          }`}
                          placeholder="Enter your full name"
                        />
                      </div>
                      {validationErrors.name && (
                        <p className="mt-1 text-xs text-red-400">
                          {validationErrors.name}
                        </p>
                      )}
                      {formData.name && !validationErrors.name && (
                        <p className="mt-1 text-xs text-green-400">
                          ✓ Valid name
                        </p>
                      )}
                    </div>

                    <div className="flex-1">
                      <label htmlFor="signup-email" className="block text-sm font-medium text-cyan-200 mb-2">
                        Email address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400" />
                        <input
                          id="signup-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`w-full pl-12 pr-4 py-3 sm:py-4 bg-white/5 border rounded-xl text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 transition-all duration-200 backdrop-blur-sm ${
                            validationErrors.email
                              ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                              : 'border-white/20 focus:ring-neon-cyan focus:border-neon-cyan'
                          }`}
                          placeholder="Enter your email"
                        />
                      </div>
                      {validationErrors.email && (
                        <p className="mt-1 text-xs text-red-400">
                          {validationErrors.email}
                        </p>
                      )}
                      {formData.email && !validationErrors.email && (
                        <p className="mt-1 text-xs text-green-400">
                          ✓ Valid email address
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="flex-1">
                      <label htmlFor="phone" className="block text-sm font-medium text-cyan-200 mb-2">
                        Phone Number <span className="text-red-400">*</span>
                      </label>
                      <PhoneInput
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        placeholder="Enter your phone number"
                        error={validationErrors.phone}
                        required
                      />
                    </div>

                    <div className="flex-1">
                      <label htmlFor="signup-password" className="block text-sm font-medium text-cyan-200 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400" />
                        <input
                          id="signup-password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          required
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className={`w-full pl-12 pr-12 py-3 sm:py-4 bg-white/5 border rounded-xl text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 transition-all duration-200 backdrop-blur-sm ${
                            validationErrors.password
                              ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                              : 'border-white/20 focus:ring-neon-cyan focus:border-neon-cyan'
                          }`}
                          placeholder="Create a password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400 hover:text-neon-cyan transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {validationErrors.password ? (
                        <p className="mt-1 text-xs text-red-400">
                          {validationErrors.password}
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-cyan-300/60">
                          Must be at least 8 characters with uppercase, lowercase, and number
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 sm:gap-6">
                    <div className="flex-1">
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-cyan-200 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400" />
                        <input
                          id="confirm-password"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          required
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className={`w-full pl-12 pr-12 py-3 sm:py-4 bg-white/5 border rounded-xl text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 transition-all duration-200 backdrop-blur-sm ${
                            validationErrors.confirmPassword
                              ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                              : 'border-white/20 focus:ring-neon-cyan focus:border-neon-cyan'
                          }`}
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400 hover:text-neon-cyan transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {validationErrors.confirmPassword && (
                        <p className="mt-1 text-xs text-red-400">
                          {validationErrors.confirmPassword}
                        </p>
                      )}
                      {formData.confirmPassword && !validationErrors.confirmPassword && formData.password === formData.confirmPassword && (
                        <p className="mt-1 text-xs text-green-400">
                          ✓ Passwords match
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-neon-magenta to-neon-pink hover:from-magenta-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-magenta disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    style={{ boxShadow: '0 0 20px rgba(255,0,255,0.3)' }}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                        Creating account...
                      </>
                    ) : (
                      'Create account'
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* OTP Verification Form */}
            {activeTab === 'otp' && (
              <OTPVerification
                phoneNumber={otpData.phoneNumber}
                onVerifySuccess={() => {
                  setSuccess('Phone verified successfully!');
                }}
                onBack={handleBackFromOTP}
                onResendOTP={handleResendOTP}
                onVerifyOTP={handleOTPVerification}
                loading={loading}
                error={error}
              />
            )}

            {/* Forgot Password Form */}
            {activeTab === 'forgot' && (
              <div>
                <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-neon-cyan/10 to-neon-blue/10 border border-neon-cyan/20">
                  <h3 className="text-neon-cyan font-semibold text-sm mb-2">🔐 Reset Your Password</h3>
                  <p className="text-cyan-200/80 text-xs">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                <form className="flex-1 flex flex-col space-y-6" onSubmit={handleForgotPassword}>
                  <div>
                    <label htmlFor="forgot-email" className="block text-sm font-medium text-cyan-200 mb-2">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400" />
                      <input
                        id="forgot-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan transition-all duration-200 backdrop-blur-sm"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-neon-cyan to-neon-blue hover:from-cyan-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-cyan disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    style={{ boxShadow: '0 0 20px rgba(0,255,255,0.3)' }}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                        Sending reset email...
                      </>
                    ) : (
                      'Send reset email'
                    )}
                  </button>
                </form>

                <div className="mt-6 p-4 rounded-xl bg-neon-cyan/5 border border-neon-cyan/20">
                  <p className="text-cyan-200 text-sm text-center">
                    Remember your password?{' '}
                    <button
                      onClick={() => setActiveTab('login')}
                      className="font-medium text-neon-cyan hover:text-cyan-300 transition-colors"
                    >
                      Back to login
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* Tab switching for login/signup */}
            {(activeTab === 'login' || activeTab === 'signup') && (
              <div className="text-center">
                <p className="text-cyan-100/60 text-sm">
                  {activeTab === 'login' ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={() => setActiveTab(activeTab === 'login' ? 'signup' : 'login')}
                    className="font-bold text-neon-cyan hover:text-white transition-all duration-300 hover:underline"
                    style={{textShadow: '0 0 10px rgba(0,255,255,0.6)'}}
                  >
                    {activeTab === 'login' ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>
            )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Login Modal */}
      <SocialLoginModal
        isOpen={showSocialModal}
        onClose={() => setShowSocialModal(false)}
        provider={socialProvider}
      />

      {/* Account Exists Modal */}
      <AccountExistsModal
        isOpen={accountExistsModal.isOpen}
        onClose={() => setAccountExistsModal({ isOpen: false, email: '', attemptedProvider: '', existingProvider: '', isSignupAttempt: false })}
        onSwitchToLogin={() => {
          setAccountExistsModal({ isOpen: false, email: '', attemptedProvider: '', existingProvider: '', isSignupAttempt: false });
          setError('');
          setSuccess('');

          // Clear any lingering session storage
          sessionStorage.removeItem('authIntent');

          // Use window.location.href for a complete redirect with refresh
          // Add timestamp to ensure fresh state
          window.location.href = '/auth?signup=false&t=' + Date.now();
        }}
        onLoginWithProvider={handleDirectProviderLogin}
        email={accountExistsModal.email}
        attemptedProvider={accountExistsModal.attemptedProvider}
        existingProvider={accountExistsModal.existingProvider}
        isSignupAttempt={accountExistsModal.isSignupAttempt}
        isOnLoginPage={activeTab === 'login'}
      />

      {/* New User Login Modal */}
      <NewUserLoginModal
        isOpen={newUserLoginModal.isOpen}
        onClose={() => setNewUserLoginModal({ isOpen: false, provider: '', email: '' })}
        onSwitchToSignup={() => {
          setNewUserLoginModal({ isOpen: false, provider: '', email: '' });
          setError('');
          setSuccess('');

          // Clear any lingering session storage
          sessionStorage.removeItem('authIntent');

          // Redirect to signup page
          window.location.href = '/auth?signup=true&t=' + Date.now();
        }}
        provider={newUserLoginModal.provider}
        email={newUserLoginModal.email}
      />

      {/* reCAPTCHA Container - Hidden */}
      <div id="recaptcha-container" style={{ display: 'none' }}></div>
    </div>
  );
};

export default AuthPage;
