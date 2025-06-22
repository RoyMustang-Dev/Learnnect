import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import firebaseAuthService, { SocialUser } from '../services/firebaseAuthService';
import userDataService, { UserProfile } from '../services/userDataService';
import { googleAppsScriptService } from '../services/googleAppsScriptService';

// Environment-based logging utility
const isDev = process.env.NODE_ENV !== 'production';
const devLog = (message: string, ...args: unknown[]) => {
  if (isDev) console.log(message, ...args);
};
const devError = (message: string, ...args: unknown[]) => {
  if (isDev) console.error(message, ...args);
};

// Types
interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  avatar?: string;
  originalAvatar?: string; // Store original auth provider photo
  createdAt: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: unknown) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  // Simple auth methods for AuthPromptModal
  signIn: (email: string, password: string) => Promise<{ user: User; isNewUser: boolean } | void>;
  signUp: (email: string, password: string, name: string, phone?: string) => Promise<{ user: User; isNewUser: boolean } | void>;
  signInWithGoogle: () => Promise<{ user: User; isNewUser: boolean } | void>;
  signUpWithGoogle: () => Promise<{ user: User; isNewUser: boolean } | void>;
  loginWithGoogle: () => Promise<{ user: User; isNewUser: boolean } | void>;
  signInWithGitHub: () => Promise<{ user: User; isNewUser: boolean } | void>;
  signUpWithGitHub: () => Promise<{ user: User; isNewUser: boolean } | void>;
  loginWithGitHub: () => Promise<{ user: User; isNewUser: boolean } | void>;
  // Firebase Email/Password methods
  signUpWithEmailAndPassword: (email: string, password: string, displayName: string) => Promise<{ user: User; isNewUser: boolean } | void>;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<{ user: User; isNewUser: boolean } | void>;
  resetPassword: (email: string) => Promise<void>;

  // Phone Authentication
  initializePhoneAuth: (containerId: string) => void;
  sendPhoneOTP: (phoneNumber: string) => Promise<any>;
  verifyPhoneOTP: (confirmationResult: any, otp: string) => Promise<void>;
  linkPhoneToAccount: (phoneNumber: string) => Promise<any>;
  confirmPhoneLink: (confirmationResult: any, otp: string) => Promise<void>;
  cleanupPhoneAuth: () => void;

  // Temporary authentication override for modals
  setAuthOverride: (override: boolean) => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authOverride, setAuthOverride] = useState(false); // Temporarily override authentication state

  // Check for existing session on mount and listen to Firebase auth changes
  useEffect(() => {
    const unsubscribe = firebaseAuthService.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          devLog('🔐 Firebase user authenticated:', firebaseUser.email);
          devLog('🔍 Provider data:', firebaseUser.providerData);

          // Check the auth intent to see if this was a signup attempt
          const authIntent = sessionStorage.getItem('authIntent');
          devLog('🔍 Auth intent:', authIntent);

          // Determine the provider from Firebase user data
          let provider: 'google' | 'github' | 'form' = 'google'; // default
          if (firebaseUser.providerData && firebaseUser.providerData.length > 0) {
            const providerId = firebaseUser.providerData[0].providerId;
            if (providerId === 'github.com') {
              provider = 'github';
            } else if (providerId === 'google.com') {
              provider = 'google';
            }
          }

          // Create SocialUser object with basic Firebase data
          // Note: Enhanced OAuth data is only available during the initial auth flow
          // For subsequent auth state changes, we only have basic Firebase user data
          const socialUser: SocialUser = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || '',
            picture: firebaseUser.photoURL || '',
            provider: provider,
            emailVerified: firebaseUser.emailVerified,

            // Try to extract first/last name from displayName if available
            ...(firebaseUser.displayName && (() => {
              const nameParts = firebaseUser.displayName.split(' ');
              return {
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || ''
              };
            })())
          };

          // Get or create user profile in Firestore
          devLog('🔍 Checking for existing user profile in Firestore...');
          let userProfile = await userDataService.getUserProfile(firebaseUser.uid);

          if (!userProfile) {
            // New user - only allow if this was a signup attempt or login attempt
            devLog('📝 Creating new user profile in Firestore...');
            devLog('📊 SocialUser data for profile creation:', socialUser);

            try {
              userProfile = await userDataService.createUserProfile(socialUser, true);
              devLog('✅ User profile created successfully:', userProfile);
            } catch (profileError) {
              devError('❌ Failed to create user profile:', profileError);
              throw new Error(`Failed to create user profile: ${profileError}`);
            }
          } else {
            // Existing user
            devLog('✅ Existing user profile found');

            // If this was a signup attempt with an existing user, reject it
            if (authIntent === 'signup') {
              devLog('⚠️ Existing user tried to sign up, rejecting...');
              devLog('🔍 Triggering account exists modal');

              // Clear the auth intent first to prevent loops
              sessionStorage.removeItem('authIntent');

              // Determine the provider from the user's provider data
              const providerData = firebaseUser.providerData[0];
              let existingProvider = 'Unknown';
              let attemptedProvider = 'Unknown';

              if (providerData) {
                if (providerData.providerId === 'google.com') {
                  existingProvider = 'Google';
                } else if (providerData.providerId === 'github.com') {
                  existingProvider = 'GitHub';
                } else if (providerData.providerId === 'password') {
                  existingProvider = 'Email/Password';
                }
              }

              // Try to determine attempted provider from current auth flow
              // This is a best guess based on the provider that just authenticated
              attemptedProvider = existingProvider; // Same provider was used

              // Trigger the account exists modal with proper provider information
              window.dispatchEvent(new CustomEvent('accountExists', {
                detail: {
                  email: firebaseUser.email || '',
                  attemptedProvider: attemptedProvider,
                  existingProvider: existingProvider,
                  isSignupAttempt: true
                }
              }));

              // Sign out the user after a small delay to ensure modal is shown
              setTimeout(async () => {
                try {
                  await firebaseAuthService.signOut();
                } catch (error) {
                  devError('Error signing out after duplicate detection:', error);
                }
              }, 200);

              return;
            }

            // Update last login for existing user
            await userDataService.updateLastLogin(firebaseUser.uid);
          }

          // Check if this was a signup attempt for success handling
          const wasSignupAttempt = authIntent === 'signup';

          // Clear the auth intent on successful authentication
          sessionStorage.removeItem('authIntent');

          // Convert to our User format for the app
          devLog('🔄 Converting user profile to app format...');
          const userData: User = {
            id: userProfile.uid,
            email: userProfile.email,
            name: userProfile.displayName,
            avatar: userProfile.photoURL,
            originalAvatar: firebaseUser.photoURL, // Store original auth provider photo
            phone: userProfile.phone,
            createdAt: userProfile.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            lastLogin: userProfile.lastLoginAt?.toDate?.()?.toISOString() || new Date().toISOString()
          };

          devLog('👤 Final user data:', userData);

          // Set user state and store locally
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          devLog('✅ User state updated and stored locally');

          // Get real Firebase ID token
          try {
            const token = await firebaseUser.getIdToken();
            localStorage.setItem('token', token);
            devLog('✅ Firebase ID token stored');
          } catch (tokenError) {
            devError('❌ Error getting Firebase ID token:', tokenError);
            localStorage.setItem('token', 'firebase-auth-fallback');
          }

          devLog('✅ User data stored locally:', userData.email);
          devLog('✅ User state set:', userData);
          devLog('✅ isAuthenticated should be:', !!userData);

          // If this was a successful signup, trigger success message and navigation
          if (wasSignupAttempt) {
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('signupSuccess', {
                detail: {
                  provider: provider,
                  message: `${provider.charAt(0).toUpperCase() + provider.slice(1)} sign-up successful! Redirecting to dashboard...`
                }
              }));
            }, 100);
          }
        } else {
          // User is signed out
          devLog('🚪 User signed out');
          setUser(null);
          localStorage.removeItem('user');
          localStorage.removeItem('token');

          // Clear any lingering auth intent when user is signed out
          sessionStorage.removeItem('authIntent');
        }
      } catch (error: unknown) {
        devError('❌ Error in auth state change:', error);
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    });

    // Also check for any redirect results (mobile flow)
    const checkRedirectResult = async () => {
      try {
        devLog('🔍 Checking for redirect result on page load...');
        devLog('🔍 Current URL:', window.location.href);
        devLog('🔍 Session storage authIntent:', sessionStorage.getItem('authIntent'));
        devLog('🔍 Session storage authRedirectUrl:', sessionStorage.getItem('authRedirectUrl'));
        devLog('🔍 Is Mobile Device:', window.matchMedia('(max-width: 767px)').matches);
        devLog('🔍 User Agent:', navigator.userAgent);
        devLog('🔍 Window dimensions:', window.innerWidth, 'x', window.innerHeight);

        const result = await firebaseAuthService.getRedirectResult();
        if (result) {
          devLog('✅ Redirect result received:', result);

          // The onAuthStateChanged listener will handle the user state update
          // We just need to handle the navigation and cleanup here
          const authIntent = sessionStorage.getItem('authIntent');
          const redirectUrl = sessionStorage.getItem('authRedirectUrl');

          devLog('📋 Auth intent:', authIntent);
          devLog('📋 Redirect URL:', redirectUrl);

          // Clear stored values
          sessionStorage.removeItem('authIntent');
          sessionStorage.removeItem('authRedirectUrl');

          // If this was a signup attempt, record it in Google Sheets
          if (authIntent === 'signup') {
            try {
              // Use the provider information from the result object
              const provider = result.user.provider || 'google'; // Default to google if not specified

              await googleAppsScriptService.recordUserSignup({
                userName: result.user.name,
                userEmail: result.user.email,
                userID: result.user.id,
                provider: provider,
                mobile: '',
                platform: 'Web'
              });
              devLog('📊 User signup recorded in Google Sheets');
            } catch (sheetsError) {
              devError('❌ Failed to record signup in Google Sheets:', sheetsError);
            }
          }

          // Navigate to appropriate page after successful auth
          devLog('🚀 Scheduling navigation after redirect auth...');
          setTimeout(() => {
            if (redirectUrl && redirectUrl !== '/auth') {
              devLog('🔄 Redirecting to stored URL:', redirectUrl);
              window.location.href = redirectUrl;
            } else {
              devLog('🔄 Redirecting to dashboard');
              window.location.href = '/dashboard';
            }
          }, 1500); // Increased delay to ensure user state is set
        } else {
          devLog('📭 No redirect result found');
        }
      } catch (error) {
        devError('❌ Error checking redirect result:', error);
        setLoading(false);
      }
    };

    checkRedirectResult();

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    // This would typically make an API call
    // For now, using the same mock logic as in AuthPage
    if (email === 'demo@learnnect.com' && password === 'Demo123!') {
      const userData = {
        id: '1',
        email,
        name: 'Demo User',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', 'mock-jwt-token');
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const signup = async (userData: unknown) => {
    // This would typically make an API call
    const newUser = {
      id: Date.now().toString(),
      email: '',
      name: '',
      ...(userData as Record<string, unknown>),
      createdAt: new Date().toISOString()
    };

    setUser(newUser as User);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('token', 'mock-jwt-token');
  };

  const logout = async () => {
    try {
      devLog('🚪 Starting logout process...');
      setLoading(true);

      // Sign out from Firebase
      await firebaseAuthService.signOut();
      devLog('✅ Firebase signOut completed');

      // The onAuthStateChanged listener will handle clearing the user state
      // But we'll also clear it manually as a fallback
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('rememberMe');

      devLog('✅ Logout completed successfully');
    } catch (error) {
      devError('❌ Error during logout:', error);

      // Fallback: clear local state anyway
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('rememberMe');

      devLog('✅ Logout completed with fallback cleanup');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = useCallback((userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }, [user]);

  // Simple auth methods for AuthPromptModal
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await firebaseAuthService.signInWithEmailAndPassword(email, password);
      devLog('Email/password sign-in successful:', result);

      // Return user data for immediate use
      if (result && result.user) {
        return {
          user: result.user,
          isNewUser: result.isNewUser || false
        };
      }
    } catch (error: unknown) {
      devError('Email/password sign-in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, phone?: string) => {
    try {
      setLoading(true);
      const result = await firebaseAuthService.signUpWithEmailAndPassword(email, password, name);
      devLog('Email/password sign-up successful:', result);

      // Return user data for immediate use
      if (result && result.user) {
        return {
          user: result.user,
          isNewUser: true // Always true for new signups
        };
      }
    } catch (error: unknown) {
      devError('Email/password sign-up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await firebaseAuthService.signInWithGoogle();
      // The onAuthStateChanged listener will handle updating the user state
      devLog('Google sign-in successful:', result);

      // Return user data for immediate use
      if (result && result.user) {
        return {
          user: result.user,
          isNewUser: result.isNewUser || false
        };
      }
    } catch (error: unknown) {
      devError('Google sign-in error:', error);
      if (error instanceof Error && error.message === 'REDIRECT_IN_PROGRESS') {
        // Redirect is happening, don't show error
        return;
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithGoogle = async () => {
    try {
      setLoading(true);
      devLog('🔐 Starting Google sign-up process...');

      const result = await firebaseAuthService.signUpWithGoogle();

      // Record signup in Google Sheets
      try {
        await googleAppsScriptService.recordUserSignup({
          userName: result.user.name,
          userEmail: result.user.email,
          userID: result.user.id,
          provider: 'google',
          mobile: '', // Google doesn't provide phone number
          platform: 'Web'
        });
        devLog('📊 User signup recorded in Google Sheets');

        // Show email notification to user
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('emailSent', {
            detail: {
              email: result.user.email,
              type: 'welcome'
            }
          }));
        }, 1000);
      } catch (sheetsError) {
        devError('❌ Failed to record signup in Google Sheets:', sheetsError);
        // Don't throw - sheets failure shouldn't break authentication
      }

      // Don't clear authIntent here - let onAuthStateChanged handle it
      // sessionStorage.removeItem('authIntent'); // Moved to onAuthStateChanged
      devLog('✅ Google sign-up completed:', result);
    } catch (error: unknown) {
      devError('❌ Google sign-up error:', error);
      sessionStorage.removeItem('authIntent');
      if (error instanceof Error && error.message === 'REDIRECT_IN_PROGRESS') {
        return;
      }
      if (error instanceof Error && error.message === 'FIREBASE_ACCOUNT_EXISTS') {
        // Firebase detected account exists with different credential
        // Sign out any partially authenticated user
        try {
          await firebaseAuthService.signOut();
        } catch (signOutError) {
          devError('Error signing out after account exists:', signOutError);
        }

        // Trigger the account exists modal with a small delay to ensure UI is ready
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('accountExists', {
            detail: {
              email: '',
              attemptedProvider: 'Google',
              existingProvider: 'GitHub', // This would need to be determined dynamically
              isSignupAttempt: true
            }
          }));
        }, 100);
        return;
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      devLog('🔐 Starting Google login process...');

      const result = await firebaseAuthService.loginWithGoogle();

      // Record login in Google Sheets
      try {
        await googleAppsScriptService.recordUserLogin({
          userEmail: result.user.email,
          platform: 'Web'
        });
        devLog('📊 User login recorded in Google Sheets');
      } catch (sheetsError) {
        devError('❌ Failed to record login in Google Sheets:', sheetsError);
        // Don't throw - sheets failure shouldn't break authentication
      }

      devLog('✅ Google login successful:', result);
    } catch (error: unknown) {
      devError('❌ Google login error:', error);
      if (error instanceof Error && error.message === 'REDIRECT_IN_PROGRESS') {
        return;
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // GitHub Authentication Methods
  const signInWithGitHub = async () => {
    try {
      setLoading(true);
      const result = await firebaseAuthService.signInWithGitHub();
      devLog('GitHub sign-in successful:', result);

      // Return user data for immediate use
      if (result && result.user) {
        return {
          user: result.user,
          isNewUser: result.isNewUser || false
        };
      }
    } catch (error: unknown) {
      devError('GitHub sign-in error:', error);
      if (error instanceof Error && error.message === 'REDIRECT_IN_PROGRESS') {
        return;
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithGitHub = async () => {
    try {
      setLoading(true);
      devLog('🔐 Starting GitHub sign-up process...');

      // Store that this is a signup attempt
      sessionStorage.setItem('authIntent', 'signup');

      const result = await firebaseAuthService.signUpWithGitHub();

      // Record signup in Google Sheets
      try {
        await googleAppsScriptService.recordUserSignup({
          userName: result.user.name,
          userEmail: result.user.email,
          userID: result.user.id,
          provider: 'github',
          mobile: '', // GitHub doesn't provide phone number
          platform: 'Web'
        });
        devLog('📊 User signup recorded in Google Sheets');
      } catch (sheetsError) {
        devError('❌ Failed to record signup in Google Sheets:', sheetsError);
        // Don't throw - sheets failure shouldn't break authentication
      }

      // Don't clear authIntent here - let onAuthStateChanged handle it
      // sessionStorage.removeItem('authIntent'); // Moved to onAuthStateChanged
      devLog('✅ GitHub sign-up completed:', result);
    } catch (error: unknown) {
      devError('❌ GitHub sign-up error:', error);
      sessionStorage.removeItem('authIntent');
      if (error instanceof Error && error.message === 'REDIRECT_IN_PROGRESS') {
        return;
      }
      if (error instanceof Error && error.message === 'FIREBASE_ACCOUNT_EXISTS') {
        // Firebase detected account exists with different credential
        // Sign out any partially authenticated user
        try {
          await firebaseAuthService.signOut();
        } catch (signOutError) {
          devError('Error signing out after account exists:', signOutError);
        }

        // Trigger the account exists modal with a small delay to ensure UI is ready
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('accountExists', {
            detail: {
              email: '',
              attemptedProvider: 'GitHub',
              existingProvider: 'Google', // This would need to be determined dynamically
              isSignupAttempt: true
            }
          }));
        }, 100);
        return;
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGitHub = async () => {
    try {
      setLoading(true);
      devLog('🔐 Starting GitHub login process...');

      const result = await firebaseAuthService.loginWithGitHub();

      // Record login in Google Sheets
      try {
        await googleAppsScriptService.recordUserLogin({
          userEmail: result.user.email,
          platform: 'Web'
        });
        devLog('📊 User login recorded in Google Sheets');
      } catch (sheetsError) {
        devError('❌ Failed to record login in Google Sheets:', sheetsError);
        // Don't throw - sheets failure shouldn't break authentication
      }

      devLog('✅ GitHub login successful:', result);
    } catch (error: unknown) {
      devError('❌ GitHub login error:', error);
      if (error instanceof Error && error.message === 'REDIRECT_IN_PROGRESS') {
        return;
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Firebase Email/Password Authentication Methods
  const signUpWithEmailAndPassword = async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      devLog('🔐 Starting email/password sign-up process...');

      // Store that this is a signup attempt
      sessionStorage.setItem('authIntent', 'signup');

      const result = await firebaseAuthService.signUpWithEmailAndPassword(email, password, displayName);

      // Record signup in Google Sheets
      try {
        await googleAppsScriptService.recordUserSignup({
          userName: displayName,
          userEmail: email,
          userID: result.user.id,
          provider: 'form',
          mobile: '', // Email signup doesn't require phone
          platform: 'Web'
        });
        devLog('📊 User signup recorded in Google Sheets');
      } catch (sheetsError) {
        devError('❌ Failed to record signup in Google Sheets:', sheetsError);
        // Don't throw - sheets failure shouldn't break authentication
      }

      devLog('✅ Email/password sign-up completed:', result);
    } catch (error: unknown) {
      devError('❌ Email/password sign-up error:', error);
      sessionStorage.removeItem('authIntent');

      // Handle duplicate account error for email/password signup
      if (error instanceof Error && error.message === 'FIREBASE_ACCOUNT_EXISTS') {
        // Trigger the account exists modal with a small delay to ensure UI is ready
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('accountExists', {
            detail: {
              email: '',
              attemptedProvider: 'Email/Password',
              existingProvider: 'Email/Password',
              isSignupAttempt: true
            }
          }));
        }, 100);
        return;
      }

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmailAndPassword = async (email: string, password: string) => {
    try {
      setLoading(true);
      devLog('🔐 Starting email/password login process...');

      const result = await firebaseAuthService.signInWithEmailAndPassword(email, password);

      // Record login in Google Sheets
      try {
        await googleAppsScriptService.recordUserLogin({
          userEmail: email,
          platform: 'Web'
        });
        devLog('📊 User login recorded in Google Sheets');
      } catch (sheetsError) {
        devError('❌ Failed to record login in Google Sheets:', sheetsError);
        // Don't throw - sheets failure shouldn't break authentication
      }

      devLog('✅ Email/password login successful:', result);
    } catch (error: unknown) {
      devError('❌ Email/password login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      devLog('🔐 Starting password reset process...');

      await firebaseAuthService.resetPassword(email);
      devLog('✅ Password reset email sent successfully');
    } catch (error: unknown) {
      devError('❌ Password reset error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Phone Authentication Methods
  const initializePhoneAuth = (containerId: string) => {
    try {
      firebaseAuthService.initializeRecaptcha(containerId);
      devLog('✅ Phone authentication initialized');
    } catch (error: unknown) {
      devError('❌ Phone authentication initialization error:', error);
      throw error;
    }
  };

  const sendPhoneOTP = async (phoneNumber: string) => {
    try {
      setLoading(true);
      devLog('📱 Sending phone OTP...');

      const confirmationResult = await firebaseAuthService.sendPhoneOTP(phoneNumber);
      devLog('✅ Phone OTP sent successfully');

      return confirmationResult;
    } catch (error: unknown) {
      devError('❌ Send phone OTP error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyPhoneOTP = async (confirmationResult: any, otp: string) => {
    try {
      setLoading(true);
      devLog('🔐 Verifying phone OTP...');

      const result = await firebaseAuthService.verifyPhoneOTP(confirmationResult, otp);

      // Record signup in Google Sheets if this is a new user
      if (result.isNewUser) {
        try {
          await googleAppsScriptService.recordUserSignup({
            userName: result.user.name,
            userEmail: result.user.email,
            userID: result.user.id,
            provider: 'phone',
            mobile: result.user.phone || '',
            platform: 'Web'
          });
          devLog('📊 Phone user signup recorded in Google Sheets');
        } catch (sheetsError) {
          devError('❌ Failed to record phone signup in Google Sheets:', sheetsError);
        }
      }

      devLog('✅ Phone OTP verification successful');
    } catch (error: unknown) {
      devError('❌ Phone OTP verification error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const linkPhoneToAccount = async (phoneNumber: string) => {
    try {
      setLoading(true);
      devLog('🔗 Linking phone to account...');

      const confirmationResult = await firebaseAuthService.linkPhoneToAccount(phoneNumber);
      devLog('✅ Phone linking OTP sent');

      return confirmationResult;
    } catch (error: unknown) {
      devError('❌ Phone linking error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const confirmPhoneLink = async (confirmationResult: any, otp: string) => {
    try {
      setLoading(true);
      devLog('🔗 Confirming phone link...');

      await firebaseAuthService.confirmPhoneLink(confirmationResult, otp);
      devLog('✅ Phone link confirmed successfully');
    } catch (error: unknown) {
      devError('❌ Phone link confirmation error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cleanupPhoneAuth = () => {
    try {
      firebaseAuthService.cleanupRecaptcha();
      devLog('🧹 Phone authentication cleaned up');
    } catch (error: unknown) {
      devError('❌ Phone authentication cleanup error:', error);
    }
  };

  // Memoize the context value to prevent unnecessary re-renders
  // Only depend on the core state values that actually matter for re-rendering
  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user && !authOverride, // Override authentication state when needed
    loading,
    login,
    signup,
    logout,
    updateUser,
    signIn,
    signUp,
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
    linkPhoneToAccount,
    confirmPhoneLink,
    cleanupPhoneAuth,
    setAuthOverride
  }), [user, loading, authOverride, updateUser, signIn, signUp]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Protected route component
export const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neon-black via-gray-900 to-neon-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan mx-auto mb-4"></div>
          <p className="text-cyan-200">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neon-black via-gray-900 to-neon-black flex items-center justify-center relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-cyan/10 via-transparent to-neon-magenta/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-magenta/5 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center max-w-md mx-auto px-6">
          <div className="mb-6 w-20 h-20 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta mb-4">
            Premium Content
          </h2>
          <p className="text-cyan-200 mb-8 leading-relaxed">
            This content is exclusive to registered learners. Join our community to access premium courses, track your progress, and earn certificates.
          </p>

          <div className="space-y-4">
            <a
              href="/auth?signup=true"
              className="block w-full px-6 py-3 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-neon-magenta to-neon-pink hover:from-magenta-500 hover:to-pink-500 transition-all duration-200 transform hover:scale-105"
              style={{ boxShadow: '0 0 20px rgba(255,0,255,0.3)' }}
            >
              Sign Up Now
            </a>

            <a
              href="/auth"
              className="block w-full px-6 py-3 border border-neon-cyan/50 rounded-xl text-sm font-medium text-neon-cyan hover:bg-neon-cyan/10 transition-all duration-200"
            >
              Already have an account? Login
            </a>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-cyan-300/60 text-xs">
              ✨ Join thousands of learners advancing their careers with our premium content
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthContext;
