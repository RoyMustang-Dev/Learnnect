import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  signOut,
  onAuthStateChanged,
  UserCredential
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Types
export interface SocialUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  provider: 'google' | 'github' | 'form';

  // Common fields
  username?: string;
  firstName?: string;
  lastName?: string;
  locale?: string;
  emailVerified?: boolean;

  // Google-specific fields
  googleId?: string;

  // GitHub-specific fields
  githubId?: number;
  githubLogin?: string;
  bio?: string;
  company?: string;
  location?: string;
  blog?: string;
  website?: string;
  publicRepos?: number;
  followers?: number;
  following?: number;
  hireable?: boolean;
  createdAt?: string;
  updatedAt?: string;

  // Raw profile data for debugging/future use
  rawProfile?: any;
}

export interface AuthResult {
  user: SocialUser;
  isNewUser: boolean;
  isSignupAttempt?: boolean;
}

// Legacy type for backward compatibility
export type GoogleUser = SocialUser;

class FirebaseAuthService {
  private googleProvider: GoogleAuthProvider;
  private githubProvider: GithubAuthProvider;

  constructor() {
    // Google Provider with enhanced scopes
    this.googleProvider = new GoogleAuthProvider();
    this.googleProvider.addScope('email');
    this.googleProvider.addScope('profile');
    this.googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
    this.googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
    this.googleProvider.setCustomParameters({
      prompt: 'select_account'
    });

    // GitHub Provider with enhanced scopes
    this.githubProvider = new GithubAuthProvider();
    this.githubProvider.addScope('user:email');
    this.githubProvider.addScope('read:user');
    this.githubProvider.addScope('user:follow');

    // Add custom parameters for better mobile compatibility (same as Google)
    this.githubProvider.setCustomParameters({
      allow_signup: 'true'
    });

    // Add debug logging for GitHub provider
    console.log('🔧 GitHub Provider initialized with scopes:', this.githubProvider.scopes);
  }

  /**
   * Convert Firebase user to our SocialUser format with enhanced data extraction
   */
  private convertFirebaseUser(
    firebaseUser: FirebaseUser,
    provider: 'google' | 'github',
    additionalUserInfo?: any
  ): SocialUser {
    const baseUser: SocialUser = {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || '',
      picture: firebaseUser.photoURL || '',
      provider,
      emailVerified: firebaseUser.emailVerified
    };

    // Extract additional data from the profile if available
    const profile = additionalUserInfo?.profile;

    if (profile) {
      baseUser.rawProfile = profile; // Store raw profile for debugging

      if (provider === 'google') {
        // Google-specific data extraction
        baseUser.googleId = profile.id;
        baseUser.firstName = profile.given_name;
        baseUser.lastName = profile.family_name;
        baseUser.locale = profile.locale;
        baseUser.emailVerified = profile.verified_email;

        // Use structured name if available
        if (profile.given_name && profile.family_name) {
          baseUser.name = `${profile.given_name} ${profile.family_name}`;
        }

      } else if (provider === 'github') {
        // GitHub-specific data extraction
        baseUser.githubId = profile.id;
        baseUser.githubLogin = profile.login;
        baseUser.username = profile.login;
        baseUser.bio = profile.bio;
        baseUser.company = profile.company;
        baseUser.location = profile.location;
        baseUser.blog = profile.blog;
        baseUser.website = profile.blog; // GitHub uses 'blog' field for website
        baseUser.publicRepos = profile.public_repos;
        baseUser.followers = profile.followers;
        baseUser.following = profile.following;
        baseUser.hireable = profile.hireable;
        baseUser.createdAt = profile.created_at;
        baseUser.updatedAt = profile.updated_at;

        // Use GitHub name if available, fallback to login
        if (profile.name) {
          baseUser.name = profile.name;
          // Try to extract first/last name from full name
          const nameParts = profile.name.split(' ');
          if (nameParts.length >= 2) {
            baseUser.firstName = nameParts[0];
            baseUser.lastName = nameParts.slice(1).join(' ');
          } else {
            baseUser.firstName = profile.name;
          }
        } else {
          baseUser.name = profile.login;
          baseUser.firstName = profile.login;
        }
      }
    } else {
      // Fallback for cases where additionalUserInfo is not available
      console.log('🔄 Using fallback data extraction from Firebase user object');

      if (provider === 'github') {
        // Try to extract username from displayName or email
        baseUser.username = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '';
        baseUser.githubLogin = baseUser.username;
      }

      // Try to extract first/last name from displayName
      if (firebaseUser.displayName) {
        const nameParts = firebaseUser.displayName.split(' ');
        if (nameParts.length >= 2) {
          baseUser.firstName = nameParts[0];
          baseUser.lastName = nameParts.slice(1).join(' ');
        } else {
          baseUser.firstName = firebaseUser.displayName;
        }
      }

      // For Google users, try to extract additional info from providerData
      if (provider === 'google' && firebaseUser.providerData && firebaseUser.providerData.length > 0) {
        const googleProviderData = firebaseUser.providerData.find(p => p.providerId === 'google.com');
        if (googleProviderData) {
          console.log('📊 Google provider data found:', googleProviderData);
          // Firebase doesn't expose the full Google profile in providerData
          // but we can still get basic info
          baseUser.emailVerified = firebaseUser.emailVerified;
        }
      }
    }

    return baseUser;
  }

  /**
   * Sign in with Google using popup
   */
  async signInWithGooglePopup(): Promise<AuthResult> {
    try {
      console.log('🔐 Starting Google popup sign-in...');
      console.log('🔧 Firebase config check:', {
        authDomain: auth.app.options.authDomain,
        projectId: auth.app.options.projectId,
        apiKey: auth.app.options.apiKey ? 'Set' : 'Missing'
      });

      const result: UserCredential = await signInWithPopup(auth, this.googleProvider);
      const user = result.user;
      const isNewUser = result.additionalUserInfo?.isNewUser || false;

      console.log('✅ Google sign-in successful:', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        isNewUser
      });

      // Log all available data for debugging
      console.log('📊 Google OAuth Data Available:', {
        firebaseUser: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          providerData: user.providerData
        },
        additionalUserInfo: result.additionalUserInfo,
        profile: result.additionalUserInfo?.profile,
        isNewUser: result.additionalUserInfo?.isNewUser,
        providerId: result.additionalUserInfo?.providerId
      });

      // Debug why additionalUserInfo might be undefined
      if (!result.additionalUserInfo) {
        console.log('⚠️ additionalUserInfo is undefined - this usually happens for existing users');
        console.log('🔍 Attempting to extract data from Firebase user object...');
      }

      return {
        user: this.convertFirebaseUser(user, 'google', result.additionalUserInfo),
        isNewUser
      };
    } catch (error: any) {
      console.error('❌ Google popup sign-in error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Full error object:', error);

      // Handle specific Firebase auth errors
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup was blocked by your browser. Please allow popups and try again.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        throw new Error('Another sign-in popup is already open.');
      } else if (error.code === 'auth/unauthorized-domain') {
        throw new Error('This domain is not authorized for Google sign-in. Please contact support.');
      } else if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Google sign-in is not enabled. Please contact support.');
      } else if (error.code === 'auth/invalid-api-key') {
        throw new Error('Invalid Firebase configuration. Please contact support.');
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        throw new Error('FIREBASE_ACCOUNT_EXISTS');
      } else {
        throw new Error(`Google sign-in failed: ${error.message || 'Unknown error'}`);
      }
    }
  }

  /**
   * Sign in with Google using redirect (for better mobile compatibility)
   */
  async signInWithGoogleRedirect(): Promise<void> {
    try {
      console.log('🔄 Starting Google redirect authentication...');
      console.log('🔄 Current URL:', window.location.href);

      // Store current URL to redirect back after auth (only if not already on auth page)
      const currentPath = window.location.pathname;
      if (currentPath !== '/auth' && currentPath !== '/') {
        sessionStorage.setItem('authRedirectUrl', currentPath);
        console.log('💾 Stored redirect URL:', currentPath);
      } else {
        // Default to dashboard for auth page
        sessionStorage.setItem('authRedirectUrl', '/dashboard');
        console.log('💾 Stored default redirect URL: /dashboard');
      }

      console.log('🚀 Initiating Firebase redirect...');
      await signInWithRedirect(auth, this.googleProvider);
      console.log('✅ Redirect initiated successfully');
    } catch (error: any) {
      console.error('❌ Google redirect sign-in error:', error);
      throw new Error('Google sign-in failed. Please try again.');
    }
  }

  /**
   * Get redirect result after redirect sign-in
   */
  async getRedirectResult(): Promise<AuthResult | null> {
    try {
      console.log('🔍 Checking for redirect result...');
      console.log('🔍 Current URL:', window.location.href);
      console.log('🔍 URL search params:', window.location.search);
      console.log('🔍 URL hash:', window.location.hash);

      const result = await getRedirectResult(auth);
      console.log('🔍 Raw Firebase redirect result:', result);

      if (!result) {
        console.log('📭 No redirect result found');
        console.log('📭 This could mean:');
        console.log('   - No redirect was initiated');
        console.log('   - Redirect was cancelled');
        console.log('   - OAuth provider redirect failed');
        console.log('   - Firebase configuration issue');
        return null;
      }

      console.log('✅ Redirect result found:', {
        user: result.user?.email,
        providerId: result.providerId,
        isNewUser: result.additionalUserInfo?.isNewUser
      });

      const user = result.user;
      const isNewUser = result.additionalUserInfo?.isNewUser || false;

      // Determine provider from the result
      const providerId = result.providerId;
      const provider = providerId?.includes('github') ? 'github' : 'google';

      console.log('🔄 Converting redirect result to AuthResult format');
      return {
        user: this.convertFirebaseUser(user, provider, result.additionalUserInfo),
        isNewUser
      };
    } catch (error: any) {
      console.error('❌ Get redirect result error:', error);
      throw new Error('Failed to complete sign-in.');
    }
  }

  /**
   * Sign in with GitHub using popup
   */
  async signInWithGitHubPopup(): Promise<AuthResult> {
    try {
      console.log('🔐 Starting GitHub popup sign-in...');

      const result: UserCredential = await signInWithPopup(auth, this.githubProvider);
      const user = result.user;
      const isNewUser = result.additionalUserInfo?.isNewUser || false;

      console.log('✅ GitHub sign-in successful:', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        isNewUser
      });

      // Log all available data for debugging
      console.log('📊 GitHub OAuth Data Available:', {
        firebaseUser: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          providerData: user.providerData
        },
        additionalUserInfo: result.additionalUserInfo,
        profile: result.additionalUserInfo?.profile
      });

      return {
        user: this.convertFirebaseUser(user, 'github', result.additionalUserInfo),
        isNewUser
      };
    } catch (error: any) {
      console.error('❌ GitHub popup sign-in error:', error);

      // Handle specific Firebase auth errors
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('GitHub sign-in was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup was blocked by your browser. Please allow popups and try again.');
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        throw new Error('FIREBASE_ACCOUNT_EXISTS');
      } else if (error.code === 'auth/operation-not-allowed') {
        throw new Error('GitHub sign-in is not enabled. Please contact support.');
      } else {
        throw new Error(`GitHub sign-in failed: ${error.message || 'Unknown error'}`);
      }
    }
  }

  /**
   * Sign in with GitHub using redirect (for better mobile compatibility)
   */
  async signInWithGitHubRedirect(): Promise<void> {
    try {
      console.log('🔄 Starting GitHub redirect authentication...');
      console.log('🔄 Current URL:', window.location.href);
      console.log('🔄 User Agent:', navigator.userAgent);
      console.log('🔄 Is Mobile:', this.isMobile());

      // Store current URL to redirect back after auth (only if not already on auth page)
      const currentPath = window.location.pathname;
      if (currentPath !== '/auth' && currentPath !== '/') {
        sessionStorage.setItem('authRedirectUrl', currentPath);
        console.log('💾 Stored redirect URL:', currentPath);
      } else {
        // Default to dashboard for auth page
        sessionStorage.setItem('authRedirectUrl', '/dashboard');
        console.log('💾 Stored default redirect URL: /dashboard');
      }

      console.log('🚀 Initiating GitHub Firebase redirect...');
      console.log('🔧 GitHub Provider Config:', {
        scopes: this.githubProvider.scopes,
        customParameters: this.githubProvider.customParameters
      });

      await signInWithRedirect(auth, this.githubProvider);
      console.log('✅ GitHub redirect initiated successfully');
    } catch (error: any) {
      console.error('❌ GitHub redirect sign-in error:', error);
      console.error('❌ Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      throw new Error(`GitHub sign-in failed: ${error.message}`);
    }
  }

  /**
   * Email/Password Authentication
   */
  async signUpWithEmailAndPassword(
    email: string,
    password: string,
    displayName: string
  ): Promise<{ user: SocialUser; isNewUser: boolean }> {
    try {
      console.log('🔐 Creating account with email/password...');

      const result: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // Update the user's display name
      await updateProfile(user, {
        displayName: displayName
      });

      console.log('✅ Email/password signup successful:', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      });

      const socialUser: SocialUser = {
        id: user.uid,
        email: user.email || '',
        name: displayName,
        picture: user.photoURL || '',
        provider: 'form',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return {
        user: socialUser,
        isNewUser: true
      };
    } catch (error: any) {
      console.error('❌ Email/password signup error:', error);

      if (error.code === 'auth/email-already-in-use') {
        throw new Error('FIREBASE_ACCOUNT_EXISTS');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please choose a stronger password.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      }

      throw new Error(`Account creation failed: ${error.message}`);
    }
  }

  async signInWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<{ user: SocialUser; isNewUser: boolean }> {
    try {
      console.log('🔐 Signing in with email/password...');

      const result: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      console.log('✅ Email/password login successful:', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      });

      const socialUser: SocialUser = {
        id: user.uid,
        email: user.email || '',
        name: user.displayName || 'User',
        picture: user.photoURL || '',
        provider: 'form',
        createdAt: user.metadata.creationTime || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return {
        user: socialUser,
        isNewUser: false
      };
    } catch (error: any) {
      console.error('❌ Email/password login error:', error);

      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email. Please check your email or sign up.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please try again later.');
      }

      throw new Error(`Login failed: ${error.message}`);
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      console.log('🔐 Sending password reset email...');
      await sendPasswordResetEmail(auth, email);
      console.log('✅ Password reset email sent successfully');
    } catch (error: any) {
      console.error('❌ Password reset error:', error);

      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email address.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      }

      throw new Error(`Password reset failed: ${error.message}`);
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out.');
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Check if user is signed in
   */
  isSignedIn(): boolean {
    return !!auth.currentUser;
  }

  /**
   * Get current user as SocialUser format with proper provider detection
   */
  getCurrentSocialUser(): SocialUser | null {
    const firebaseUser = this.getCurrentUser();
    if (!firebaseUser) {
      return null;
    }

    // Determine provider from Firebase user data
    let provider: 'google' | 'github' = 'google'; // default
    if (firebaseUser.providerData && firebaseUser.providerData.length > 0) {
      const providerId = firebaseUser.providerData[0].providerId;
      if (providerId === 'github.com') {
        provider = 'github';
      } else if (providerId === 'google.com') {
        provider = 'google';
      }
    }

    return this.convertFirebaseUser(firebaseUser, provider);
  }

  /**
   * @deprecated Use getCurrentSocialUser() instead
   * Get current user as GoogleUser format (legacy method)
   */
  getCurrentGoogleUser(): GoogleUser | null {
    return this.getCurrentSocialUser();
  }

  /**
   * Detect if device is mobile for choosing popup vs redirect
   * Use CSS media query approach for better reliability
   */
  private isMobile(): boolean {
    // Use CSS media query approach instead of JavaScript detection
    // This is more reliable and consistent with Tailwind breakpoints
    return window.matchMedia('(max-width: 767px)').matches;
  }

  /**
   * Smart Google sign-in that chooses popup or redirect based on device
   */
  async signInWithGoogle(isSignupAttempt: boolean = false): Promise<AuthResult> {
    const isMobileDevice = this.isMobile();
    console.log(`🔐 Google sign-in initiated (${isMobileDevice ? 'mobile' : 'desktop'} mode)`);

    if (isMobileDevice) {
      // Try popup first on mobile, fallback to redirect if it fails
      console.log('📱 Trying popup authentication for mobile device first...');
      try {
        const result = await this.signInWithGooglePopup();
        console.log('✅ Mobile popup authentication successful!');
        return {
          ...result,
          isSignupAttempt
        };
      } catch (popupError: any) {
        console.log('📱 Mobile popup failed, falling back to redirect...', popupError.code);

        // Store auth intent for mobile redirect fallback
        const authIntent = isSignupAttempt ? 'signup' : 'login';
        sessionStorage.setItem('authIntent', authIntent);
        console.log('💾 Stored auth intent for redirect fallback:', authIntent);
        console.log('💾 Verification - stored value:', sessionStorage.getItem('authIntent'));

        try {
          await this.signInWithGoogleRedirect();
          // Return will happen after redirect, so we throw to indicate redirect
          throw new Error('REDIRECT_IN_PROGRESS');
        } catch (error: any) {
          if (error.message === 'REDIRECT_IN_PROGRESS') {
            throw error; // Re-throw redirect indicator
          }
          console.error('❌ Mobile redirect authentication failed:', error);
          throw new Error(`Mobile authentication failed: ${error.message}`);
        }
      }
    } else {
      // Use popup for desktop devices - optimized for speed
      try {
        console.log('🖥️ Using popup authentication for desktop');
        const result = await this.signInWithGooglePopup();
        return {
          ...result,
          isSignupAttempt
        };
      } catch (error: any) {
        // Only fallback to redirect for specific popup issues
        if (error.code === 'auth/popup-blocked' ||
            error.code === 'auth/popup-closed-by-user') {
          console.log('🔄 Popup blocked, falling back to redirect...');
          // Store auth intent for desktop fallback redirect
          sessionStorage.setItem('authIntent', isSignupAttempt ? 'signup' : 'login');
          await this.signInWithGoogleRedirect();
          throw new Error('REDIRECT_IN_PROGRESS');
        }

        // Re-throw other errors immediately
        throw error;
      }
    }
  }

  /**
   * Google sign-up (same as sign-in but with signup flag)
   */
  async signUpWithGoogle(): Promise<AuthResult> {
    return this.signInWithGoogle(true);
  }

  /**
   * Google login (explicit login attempt)
   */
  async loginWithGoogle(): Promise<AuthResult> {
    return this.signInWithGoogle(false);
  }

  /**
   * Smart GitHub sign-in that chooses popup or redirect based on device
   */
  async signInWithGitHub(isSignupAttempt: boolean = false): Promise<AuthResult> {
    const isMobileDevice = this.isMobile();
    console.log(`🔐 GitHub sign-in initiated (${isMobileDevice ? 'mobile' : 'desktop'} mode)`);

    if (isMobileDevice) {
      // Try popup first on mobile, fallback to redirect if it fails (same as Google)
      console.log('📱 Trying GitHub popup authentication for mobile device first...');
      try {
        const result = await this.signInWithGitHubPopup();
        console.log('✅ Mobile GitHub popup authentication successful!');
        return {
          ...result,
          isSignupAttempt
        };
      } catch (popupError: any) {
        console.log('📱 Mobile GitHub popup failed, falling back to redirect...', popupError.code);

        // Store auth intent for mobile redirect fallback
        const authIntent = isSignupAttempt ? 'signup' : 'login';
        sessionStorage.setItem('authIntent', authIntent);
        console.log('💾 Stored GitHub auth intent for redirect fallback:', authIntent);
        console.log('💾 Verification - stored value:', sessionStorage.getItem('authIntent'));

        try {
          await this.signInWithGitHubRedirect();
          // Return will happen after redirect, so we throw to indicate redirect
          throw new Error('REDIRECT_IN_PROGRESS');
        } catch (error: any) {
          if (error.message === 'REDIRECT_IN_PROGRESS') {
            throw error; // Re-throw redirect indicator
          }
          console.error('❌ Mobile GitHub redirect authentication failed:', error);
          throw new Error(`Mobile GitHub authentication failed: ${error.message}`);
        }
      }
    } else {
      // Use popup for desktop devices - optimized for speed
      try {
        console.log('🖥️ Using GitHub popup authentication for desktop');
        const result = await this.signInWithGitHubPopup();
        return {
          ...result,
          isSignupAttempt
        };
      } catch (error: any) {
        // Only fallback to redirect for specific popup issues
        if (error.code === 'auth/popup-blocked' ||
            error.code === 'auth/popup-closed-by-user') {
          console.log('🔄 GitHub popup blocked, falling back to redirect...');
          // Store auth intent for desktop fallback redirect
          sessionStorage.setItem('authIntent', isSignupAttempt ? 'signup' : 'login');
          await this.signInWithGitHubRedirect();
          throw new Error('REDIRECT_IN_PROGRESS');
        }

        // Re-throw other errors immediately
        throw error;
      }
    }
  }

  /**
   * GitHub sign-up (same as sign-in but with signup flag)
   */
  async signUpWithGitHub(): Promise<AuthResult> {
    return this.signInWithGitHub(true);
  }

  /**
   * GitHub login (explicit login attempt)
   */
  async loginWithGitHub(): Promise<AuthResult> {
    return this.signInWithGitHub(false);
  }

  /**
   * Force fresh Google authentication to capture enhanced data
   * This will prompt user to re-authenticate and should provide additionalUserInfo
   */
  async forceGoogleReauth(): Promise<AuthResult> {
    try {
      console.log('🔄 Forcing fresh Google authentication...');

      // Create a new provider instance with consent prompt
      const freshProvider = new GoogleAuthProvider();
      freshProvider.addScope('email');
      freshProvider.addScope('profile');
      freshProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
      freshProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
      freshProvider.setCustomParameters({
        prompt: 'consent' // Force consent screen to get fresh data
      });

      const result: UserCredential = await signInWithPopup(auth, freshProvider);
      const user = result.user;
      const isNewUser = result.additionalUserInfo?.isNewUser || false;

      console.log('✅ Fresh Google authentication successful:', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        isNewUser
      });

      console.log('📊 Fresh Google OAuth Data:', {
        additionalUserInfo: result.additionalUserInfo,
        profile: result.additionalUserInfo?.profile
      });

      return {
        user: this.convertFirebaseUser(user, 'google', result.additionalUserInfo),
        isNewUser
      };
    } catch (error: any) {
      console.error('❌ Fresh Google authentication error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const firebaseAuthService = new FirebaseAuthService();
export default firebaseAuthService;
