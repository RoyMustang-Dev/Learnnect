// Debug utility for authentication issues
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export class AuthDebugger {
  /**
   * Test Firebase connectivity
   */
  static async testFirebaseConnection(): Promise<void> {
    console.log('🔧 Testing Firebase connection...');
    
    try {
      // Test Auth
      console.log('📱 Auth instance:', {
        app: auth.app.name,
        currentUser: auth.currentUser?.uid || 'None'
      });
      
      // Test Firestore
      console.log('🗄️ Firestore instance:', {
        app: db.app.name
      });
      
      // Test write permissions with a test document
      const testRef = doc(db, 'test', 'connection-test');
      await setDoc(testRef, {
        timestamp: serverTimestamp(),
        test: true
      });
      
      console.log('✅ Firestore write test successful');
      
      // Test read permissions
      const testDoc = await getDoc(testRef);
      if (testDoc.exists()) {
        console.log('✅ Firestore read test successful');
      } else {
        console.log('❌ Firestore read test failed');
      }
      
    } catch (error) {
      console.error('❌ Firebase connection test failed:', error);
      throw error;
    }
  }

  /**
   * Test user creation flow
   */
  static async testUserCreation(): Promise<void> {
    console.log('🧪 Testing user creation flow...');
    
    const testUser = {
      id: 'test-user-' + Date.now(),
      email: 'test@example.com',
      name: 'Test User',
      picture: '',
      provider: 'google' as const
    };
    
    try {
      const userRef = doc(db, 'users', testUser.id);
      
      const testProfile = {
        uid: testUser.id,
        email: testUser.email,
        displayName: testUser.name,
        photoURL: testUser.picture,
        provider: testUser.provider,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true,
        role: 'student'
      };
      
      console.log('📝 Creating test user profile...');
      await setDoc(userRef, testProfile);
      console.log('✅ Test user profile created');
      
      // Verify it was created
      const createdDoc = await getDoc(userRef);
      if (createdDoc.exists()) {
        console.log('✅ Test user profile verified');
        console.log('📊 Created data:', createdDoc.data());
      } else {
        console.log('❌ Test user profile not found after creation');
      }
      
    } catch (error) {
      console.error('❌ User creation test failed:', error);
      throw error;
    }
  }

  /**
   * Check Firestore security rules
   */
  static async checkFirestoreRules(): Promise<void> {
    console.log('🔒 Checking Firestore security rules...');
    
    try {
      // Try to write without authentication
      const testRef = doc(db, 'users', 'unauthorized-test');
      await setDoc(testRef, { test: true });
      console.log('⚠️ Warning: Firestore allows unauthenticated writes');
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        console.log('✅ Firestore security rules are working (permission denied for unauthenticated writes)');
      } else {
        console.log('❌ Unexpected error testing security rules:', error);
      }
    }
  }

  /**
   * Run all debug tests
   */
  static async runAllTests(): Promise<void> {
    console.log('🚀 Starting comprehensive auth debug tests...');
    
    try {
      await this.testFirebaseConnection();
      await this.testUserCreation();
      await this.checkFirestoreRules();
      
      console.log('✅ All debug tests completed successfully');
    } catch (error) {
      console.error('❌ Debug tests failed:', error);
    }
  }
}

// Export for easy console access
(window as any).AuthDebugger = AuthDebugger;

export default AuthDebugger;
