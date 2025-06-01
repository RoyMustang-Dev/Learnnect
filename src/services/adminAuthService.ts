// Admin authentication service
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { AdminUser } from '../types/blog';

// Predefined admin emails (you can modify this list)
const ADMIN_EMAILS = [
  'admin@learnnect.com',
  'superadmin@learnnect.com',
  'adityamishra0996@gmail.com'  // Replace with your actual email
  // Add more admin emails as needed
];

export const adminAuthService = {
  // Check if email is admin
  isAdminEmail(email: string): boolean {
    return ADMIN_EMAILS.includes(email.toLowerCase());
  },

  // Admin login
  async loginAdmin(email: string, password: string): Promise<AdminUser> {
    try {
      // Check if email is in admin list
      if (!this.isAdminEmail(email)) {
        throw new Error('Access denied. Admin privileges required.');
      }

      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get or create admin profile
      const adminData = await this.getOrCreateAdminProfile(user);

      return adminData;
    } catch (error: any) {
      console.error('Admin login error:', error);
      if (error.code === 'auth/user-not-found') {
        throw new Error('Admin account not found. Please contact system administrator.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Invalid password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email format.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please try again later.');
      }
      throw new Error(error.message || 'Login failed. Please try again.');
    }
  },

  // Get or create admin profile
  async getOrCreateAdminProfile(user: User): Promise<AdminUser> {
    try {
      const adminDocRef = doc(db, 'adminUsers', user.uid);
      const adminDoc = await getDoc(adminDocRef);

      if (adminDoc.exists()) {
        // Update last login
        await setDoc(adminDocRef, {
          lastLogin: serverTimestamp()
        }, { merge: true });

        return {
          id: adminDoc.id,
          ...adminDoc.data(),
          createdAt: adminDoc.data().createdAt?.toDate(),
          lastLogin: new Date(),
        } as AdminUser;
      } else {
        // Create new admin profile
        const newAdminData: Omit<AdminUser, 'id'> = {
          email: user.email!,
          name: user.displayName || user.email!.split('@')[0],
          role: user.email === 'superadmin@learnnect.com' ? 'super-admin' : 'admin',
          createdAt: new Date(),
          lastLogin: new Date()
        };

        await setDoc(adminDocRef, {
          ...newAdminData,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        });

        return {
          id: user.uid,
          ...newAdminData
        };
      }
    } catch (error) {
      console.error('Error getting/creating admin profile:', error);
      throw error;
    }
  },

  // Admin logout
  async logoutAdmin(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Admin logout error:', error);
      throw error;
    }
  },

  // Get current admin user
  async getCurrentAdmin(): Promise<AdminUser | null> {
    try {
      console.log('🔍 Getting current admin...');
      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          unsubscribe();
          console.log('👤 Auth state changed, user:', user?.email);

          if (user && user.email) {
            console.log('📧 Checking if email is admin:', user.email);
            console.log('📋 Admin emails list:', ADMIN_EMAILS);

            const isAdminEmail = this.isAdminEmail(user.email);
            console.log('✅ Is admin email?', isAdminEmail);

            if (isAdminEmail) {
              try {
                console.log('🔄 Getting admin profile...');
                const adminData = await this.getOrCreateAdminProfile(user);
                console.log('✅ Admin data retrieved:', adminData);
                resolve(adminData);
              } catch (error) {
                console.error('❌ Error getting admin profile:', error);
                resolve(null);
              }
            } else {
              console.log('❌ Email not in admin list');
              resolve(null);
            }
          } else {
            console.log('❌ No user or email found');
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.error('❌ Error getting current admin:', error);
      return null;
    }
  },

  // Listen to admin auth state changes
  onAdminAuthStateChanged(callback: (admin: AdminUser | null) => void): () => void {
    return onAuthStateChanged(auth, async (user) => {
      if (user && this.isAdminEmail(user.email!)) {
        try {
          const adminData = await this.getOrCreateAdminProfile(user);
          callback(adminData);
        } catch (error) {
          console.error('Error in auth state change:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  },

  // Check if current user is admin (simplified method)
  async isAdmin(): Promise<boolean> {
    try {
      console.log('🔍 Checking admin status...');
      const currentAdmin = await this.getCurrentAdmin();
      console.log('👤 Current admin:', currentAdmin);
      const isAdminResult = currentAdmin !== null;
      console.log('✅ Is admin result:', isAdminResult);
      return isAdminResult;
    } catch (error) {
      console.error('❌ Error checking admin status:', error);
      return false;
    }
  }
};
