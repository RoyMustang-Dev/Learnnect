// Test utility for Firebase Authentication
// This file can be used to test Firebase auth functionality

import firebaseAuthService from '../services/firebaseAuthService';

export const testFirebaseAuth = {
  /**
   * Test if Firebase is properly configured
   */
  async testConfiguration(): Promise<boolean> {
    try {
      const currentUser = firebaseAuthService.getCurrentUser();
      console.log('Firebase Auth initialized successfully');
      console.log('Current user:', currentUser?.email || 'No user signed in');
      return true;
    } catch (error) {
      console.error('Firebase Auth configuration error:', error);
      return false;
    }
  },

  /**
   * Test Google sign-in (for development/testing)
   */
  async testGoogleSignIn(): Promise<void> {
    try {
      console.log('Testing Google sign-in...');
      const result = await firebaseAuthService.signInWithGoogle();
      console.log('Google sign-in successful:', result);
    } catch (error: any) {
      if (error.message === 'REDIRECT_IN_PROGRESS') {
        console.log('Redirect in progress (mobile flow)');
      } else {
        console.error('Google sign-in test failed:', error);
      }
    }
  },

  /**
   * Test sign out
   */
  async testSignOut(): Promise<void> {
    try {
      console.log('Testing sign out...');
      await firebaseAuthService.signOut();
      console.log('Sign out successful');
    } catch (error) {
      console.error('Sign out test failed:', error);
    }
  },

  /**
   * Monitor auth state changes
   */
  monitorAuthState(): () => void {
    console.log('Starting auth state monitoring...');
    return firebaseAuthService.onAuthStateChanged((user) => {
      if (user) {
        console.log('User signed in:', {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        });
      } else {
        console.log('User signed out');
      }
    });
  },

  /**
   * Run all tests
   */
  async runAllTests(): Promise<void> {
    console.log('🧪 Running Firebase Auth Tests...');
    
    // Test configuration
    const configOk = await this.testConfiguration();
    if (!configOk) {
      console.error('❌ Configuration test failed');
      return;
    }
    console.log('✅ Configuration test passed');

    // Monitor auth state
    const unsubscribe = this.monitorAuthState();
    
    // Wait a bit for any existing auth state
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Clean up
    unsubscribe();
    console.log('🧪 Firebase Auth Tests completed');
  }
};

// Export for console testing
if (typeof window !== 'undefined') {
  (window as any).testFirebaseAuth = testFirebaseAuth;
  console.log('Firebase Auth test utilities available at window.testFirebaseAuth');
}
