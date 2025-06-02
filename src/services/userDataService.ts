import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { GoogleUser } from './firebaseAuthService';

// User data interface for Firestore
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: 'google' | 'email';
  providerId?: string;
  
  // Additional profile data
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  
  // Learning data
  enrolledCourses?: string[];
  completedCourses?: string[];
  certificates?: string[];
  learningProgress?: Record<string, number>;
  
  // Preferences
  preferences?: {
    notifications: boolean;
    newsletter: boolean;
    theme: 'light' | 'dark' | 'auto';
    language: string;
  };
  
  // Metadata
  createdAt: any; // Firestore timestamp
  lastLoginAt: any; // Firestore timestamp
  updatedAt: any; // Firestore timestamp
  isActive: boolean;
  role: 'student' | 'instructor' | 'admin';
}

class UserDataService {
  private usersCollection = 'users';

  /**
   * Create a new user profile in Firestore
   */
  async createUserProfile(googleUser: GoogleUser, isNewUser: boolean): Promise<UserProfile> {
    try {
      const userRef = doc(db, this.usersCollection, googleUser.id);
      
      // Check if user already exists
      const existingUser = await getDoc(userRef);
      
      if (existingUser.exists() && !isNewUser) {
        // Update last login time for existing user
        await updateDoc(userRef, {
          lastLoginAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        return existingUser.data() as UserProfile;
      }
      
      // Create new user profile
      const newUserProfile: Partial<UserProfile> = {
        uid: googleUser.id,
        email: googleUser.email,
        displayName: googleUser.name,
        photoURL: googleUser.picture,
        provider: 'google',
        providerId: googleUser.id,
        
        // Default values with some sample data for demo
        enrolledCourses: ['react-fundamentals', 'javascript-advanced'],
        completedCourses: [],
        certificates: [],
        learningProgress: {
          'react-fundamentals': 45,
          'javascript-advanced': 20
        },
        
        preferences: {
          notifications: true,
          newsletter: true,
          theme: 'auto',
          language: 'en'
        },
        
        // Metadata
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true,
        role: 'student'
      };
      
      await setDoc(userRef, newUserProfile);
      
      console.log('✅ User profile created in Firestore:', googleUser.email);
      
      // Return the created profile (convert timestamps for local use)
      return {
        ...newUserProfile,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        updatedAt: new Date()
      } as UserProfile;
      
    } catch (error) {
      console.error('❌ Error creating user profile:', error);
      throw new Error('Failed to create user profile');
    }
  }

  /**
   * Get user profile by UID
   */
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, this.usersCollection, uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const userRef = doc(db, this.usersCollection, uid);
      
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      console.log('✅ User profile updated:', uid);
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  }

  /**
   * Update last login time
   */
  async updateLastLogin(uid: string): Promise<void> {
    try {
      const userRef = doc(db, this.usersCollection, uid);
      
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('❌ Error updating last login:', error);
      // Don't throw error for login time update failure
    }
  }

  /**
   * Check if email already exists
   */
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const usersRef = collection(db, this.usersCollection);
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      return !querySnapshot.empty;
    } catch (error) {
      console.error('❌ Error checking email existence:', error);
      return false;
    }
  }

  /**
   * Enroll user in a course
   */
  async enrollInCourse(uid: string, courseId: string): Promise<void> {
    try {
      const userRef = doc(db, this.usersCollection, uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserProfile;
        const enrolledCourses = userData.enrolledCourses || [];
        
        if (!enrolledCourses.includes(courseId)) {
          enrolledCourses.push(courseId);
          
          await updateDoc(userRef, {
            enrolledCourses,
            updatedAt: serverTimestamp()
          });
          
          console.log('✅ User enrolled in course:', courseId);
        }
      }
    } catch (error) {
      console.error('❌ Error enrolling in course:', error);
      throw new Error('Failed to enroll in course');
    }
  }

  /**
   * Update learning progress
   */
  async updateLearningProgress(uid: string, courseId: string, progress: number): Promise<void> {
    try {
      const userRef = doc(db, this.usersCollection, uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserProfile;
        const learningProgress = userData.learningProgress || {};
        
        learningProgress[courseId] = progress;
        
        await updateDoc(userRef, {
          learningProgress,
          updatedAt: serverTimestamp()
        });
        
        console.log('✅ Learning progress updated:', courseId, progress);
      }
    } catch (error) {
      console.error('❌ Error updating learning progress:', error);
      throw new Error('Failed to update learning progress');
    }
  }
}

// Export singleton instance
export const userDataService = new UserDataService();
export default userDataService;
