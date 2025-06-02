import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  GithubAuthProvider,
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
  provider: 'google' | 'github' | 'linkedin' | 'form';
  username?: string; // For GitHub
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
    // Google Provider
    this.googleProvider = new GoogleAuthProvider();
    this.googleProvider.addScope('email');
    this.googleProvider.addScope('profile');
    this.googleProvider.setCustomParameters({
      prompt: 'select_account'
    });

    // GitHub Provider
    this.githubProvider = new GithubAuthProvider();
    this.githubProvider.addScope('user:email');
    this.githubProvider.addScope('read:user');
  }

  /**
   * Convert Firebase user to our SocialUser format
   */
  private convertFirebaseUser(firebaseUser: FirebaseUser, provider: 'google' | 'github' = 'google'): SocialUser {
    const baseUser: SocialUser = {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || '',
      picture: firebaseUser.photoURL || '',
      provider
    };

    // Add GitHub-specific data if available
    if (provider === 'github') {
      // GitHub username is often in the displayName or we can extract from email
      const githubUsername = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '';
      baseUser.username = githubUsername;
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

      return {
        user: this.convertFirebaseUser(user, 'google'),
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
   * Sign in with Google using redirect (fallback for mobile)
   */
  async signInWithGoogleRedirect(): Promise<void> {
    try {
      await signInWithRedirect(auth, this.googleProvider);
    } catch (error: any) {
      console.error('Google redirect sign-in error:', error);
      throw new Error('Google sign-in failed. Please try again.');
    }
  }

  /**
   * Get redirect result after redirect sign-in
   */
  async getRedirectResult(): Promise<AuthResult | null> {
    try {
      const result = await getRedirectResult(auth);
      if (!result) {
        return null;
      }

      const user = result.user;
      const isNewUser = result.additionalUserInfo?.isNewUser || false;

      // Determine provider from the result
      const providerId = result.providerId;
      const provider = providerId?.includes('github') ? 'github' : 'google';

      return {
        user: this.convertFirebaseUser(user, provider),
        isNewUser
      };
    } catch (error: any) {
      console.error('Get redirect result error:', error);
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

      return {
        user: this.convertFirebaseUser(user, 'github'),
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
   * Sign in with GitHub using redirect (fallback for mobile)
   */
  async signInWithGitHubRedirect(): Promise<void> {
    try {
      await signInWithRedirect(auth, this.githubProvider);
    } catch (error: any) {
      console.error('GitHub redirect sign-in error:', error);
      throw new Error('GitHub sign-in failed. Please try again.');
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
   * Get current user as GoogleUser format
   */
  getCurrentGoogleUser(): GoogleUser | null {
    const firebaseUser = this.getCurrentUser();
    if (!firebaseUser) {
      return null;
    }
    return this.convertFirebaseUser(firebaseUser);
  }

  /**
   * Detect if device is mobile for choosing popup vs redirect
   */
  private isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Smart sign-in that chooses popup or redirect based on device
   */
  async signInWithGoogle(isSignupAttempt: boolean = false): Promise<AuthResult> {
    if (this.isMobile()) {
      // Use redirect for mobile devices
      await this.signInWithGoogleRedirect();
      // Return will happen after redirect, so we throw to indicate redirect
      throw new Error('REDIRECT_IN_PROGRESS');
    } else {
      // Try popup first, fallback to redirect if popup fails
      try {
        const result = await this.signInWithGooglePopup();
        return {
          ...result,
          isSignupAttempt
        };
      } catch (error: any) {
        console.warn('🔄 Popup failed, trying redirect method...', error.code);

        // If popup is blocked or fails, try redirect as fallback
        if (error.code === 'auth/popup-blocked' ||
            error.code === 'auth/popup-closed-by-user' ||
            error.code === 'auth/cancelled-popup-request') {

          console.log('🔄 Falling back to redirect method...');
          await this.signInWithGoogleRedirect();
          throw new Error('REDIRECT_IN_PROGRESS');
        }

        // Re-throw other errors
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
    if (this.isMobile()) {
      // Use redirect for mobile devices
      await this.signInWithGitHubRedirect();
      // Return will happen after redirect, so we throw to indicate redirect
      throw new Error('REDIRECT_IN_PROGRESS');
    } else {
      // Try popup first, fallback to redirect if popup fails
      try {
        const result = await this.signInWithGitHubPopup();
        return {
          ...result,
          isSignupAttempt
        };
      } catch (error: any) {
        console.warn('🔄 GitHub popup failed, trying redirect method...', error.code);

        // If popup is blocked or fails, try redirect as fallback
        if (error.code === 'auth/popup-blocked' ||
            error.code === 'auth/popup-closed-by-user' ||
            error.code === 'auth/cancelled-popup-request') {

          console.log('🔄 Falling back to redirect method...');
          await this.signInWithGitHubRedirect();
          throw new Error('REDIRECT_IN_PROGRESS');
        }

        // Re-throw other errors
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
}

// Export singleton instance
export const firebaseAuthService = new FirebaseAuthService();
export default firebaseAuthService;
