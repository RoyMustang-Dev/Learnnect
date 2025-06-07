// Firebase Configuration Checker
// Use this to diagnose Firebase authentication issues

import { auth } from '../config/firebase';

// Environment-based logging utility
const isDev = import.meta.env.MODE !== 'production';
const devLog = (message: string, ...args: unknown[]) => {
  if (isDev) console.log(message, ...args);
};
const devError = (message: string, ...args: unknown[]) => {
  if (isDev) console.error(message, ...args);
};

export const firebaseConfigChecker = {
  /**
   * Check Firebase configuration
   */
  checkConfig() {
    devLog('🔍 Firebase Configuration Check');
    devLog('================================');

    const config = auth.app.options;

    devLog('📋 Current Configuration:');
    devLog('- API Key:', config.apiKey ? '✅ Set' : '❌ Missing');
    devLog('- Auth Domain:', config.authDomain || '❌ Missing');
    devLog('- Project ID:', config.projectId || '❌ Missing');
    devLog('- Storage Bucket:', config.storageBucket || '❌ Missing');
    devLog('- Messaging Sender ID:', config.messagingSenderId || '❌ Missing');
    devLog('- App ID:', config.appId || '❌ Missing');

    devLog('\n🌐 Environment Variables:');
    devLog('- VITE_FIREBASE_API_KEY:', import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Set' : '❌ Not set');
    devLog('- VITE_FIREBASE_AUTH_DOMAIN:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Not set');
    devLog('- VITE_FIREBASE_PROJECT_ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Not set');

    devLog('\n🔗 URLs:');
    devLog('- Current URL:', window.location.origin);
    devLog('- Auth Domain:', `https://${config.authDomain}`);

    return config;
  },

  /**
   * Check if current domain is authorized
   */
  checkDomain() {
    const currentDomain = window.location.hostname;
    const authDomain = auth.app.options.authDomain;

    devLog('\n🌍 Domain Authorization Check:');
    devLog('- Current domain:', currentDomain);
    devLog('- Auth domain:', authDomain);

    if (currentDomain === 'localhost' || currentDomain === '127.0.0.1') {
      devLog('✅ Local development - should be authorized by default');
    } else {
      devLog('⚠️  Production domain - must be added to Firebase Console');
      devLog('   Go to Firebase Console > Authentication > Settings > Authorized domains');
    }
  },

  /**
   * Test Firebase Auth initialization
   */
  async testAuth() {
    devLog('\n🔐 Firebase Auth Test:');

    try {
      const currentUser = auth.currentUser;
      devLog('- Auth instance:', auth ? '✅ Initialized' : '❌ Not initialized');
      devLog('- Current user:', currentUser ? `✅ ${currentUser.email}` : '❌ Not signed in');

      // Test auth state listener
      const unsubscribe = auth.onAuthStateChanged((user) => {
        devLog('- Auth state change:', user ? `User: ${user.email}` : 'No user');
      });

      // Clean up after 1 second
      setTimeout(() => {
        unsubscribe();
      }, 1000);

    } catch (error) {
      devError('❌ Firebase Auth test failed:', error);
    }
  },

  /**
   * Check Google provider configuration
   */
  checkGoogleProvider() {
    devLog('\n🔍 Google Provider Check:');
    devLog('- Provider ID: google.com');
    devLog('- Scopes: email, profile');
    devLog('- Custom parameters: prompt=select_account');

    // Check if Google APIs are accessible
    const googleApiScript = document.querySelector('script[src*="googleapis.com"]');
    devLog('- Google APIs loaded:', googleApiScript ? '✅ Yes' : '❌ No');
  },

  /**
   * Run all checks
   */
  async runAllChecks() {
    if (isDev) console.clear();
    devLog('🚀 Firebase Authentication Diagnostic');
    devLog('=====================================\n');

    this.checkConfig();
    this.checkDomain();
    await this.testAuth();
    this.checkGoogleProvider();

    devLog('\n📝 Common Issues & Solutions:');
    devLog('1. ❌ "unauthorized-domain" → Add your domain to Firebase Console');
    devLog('2. ❌ "operation-not-allowed" → Enable Google provider in Firebase Console');
    devLog('3. ❌ "invalid-api-key" → Check your Firebase configuration');
    devLog('4. ❌ "popup-blocked" → Allow popups in your browser');

    devLog('\n🔧 Next Steps:');
    devLog('1. Check Firebase Console: https://console.firebase.google.com/');
    devLog('2. Go to Authentication > Sign-in method');
    devLog('3. Enable Google provider');
    devLog('4. Add authorized domains');
    devLog('5. Check OAuth consent screen configuration');
  }
};

// Make available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).firebaseConfigChecker = firebaseConfigChecker;
  devLog('🔧 Firebase config checker available at: window.firebaseConfigChecker.runAllChecks()');
}
