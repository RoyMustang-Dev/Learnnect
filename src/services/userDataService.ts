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

// LinkedIn-style User Profile Interface
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bannerImage?: string;
  provider: 'google' | 'github' | 'email';
  providerId?: string;

  // Basic Information
  firstName?: string;
  lastName?: string;
  headline?: string; // Professional headline
  location?: string;
  industry?: string;
  phone?: string;
  dateOfBirth?: string;
  website?: string;

  // Professional Summary
  about?: string; // About section
  currentPosition?: string;
  company?: string;

  // Experience
  experience?: Experience[];

  // Education
  education?: Education[];

  // Skills & Endorsements
  skills?: Skill[];

  // Certifications & Licenses
  certifications?: Certification[];

  // Projects
  projects?: Project[];

  // Publications
  publications?: Publication[];

  // Languages
  languages?: Language[];

  // Volunteer Experience
  volunteerExperience?: VolunteerExperience[];

  // Accomplishments
  accomplishments?: {
    honors?: Honor[];
    courses?: CourseAccomplishment[];
    organizations?: Organization[];
    patents?: Patent[];
  };

  // Learning data (EdTech specific)
  enrolledCourses?: string[];
  completedCourses?: string[];
  certificates?: string[];
  learningProgress?: Record<string, number>;

  // Social & Contact
  socialLinks?: {
    twitter?: string;
    github?: string;
    portfolio?: string;
    blog?: string;
  };

  // Provider-specific data
  googleId?: string;
  locale?: string;
  githubStats?: {
    username?: string;
    publicRepos?: number;
    followers?: number;
    following?: number;
    hireable?: boolean;
  };

  // Privacy Settings
  profileVisibility?: 'public' | 'connections' | 'private';
  showEmail?: boolean;
  showPhone?: boolean;

  // Preferences
  preferences?: {
    notifications: boolean;
    newsletter: boolean;
    theme: 'light' | 'dark' | 'auto';
    language: string;
    jobAlerts?: boolean;
    networkUpdates?: boolean;
  };

  // Metadata
  createdAt: any; // Firestore timestamp
  lastLoginAt: any; // Firestore timestamp
  updatedAt: any; // Firestore timestamp
  isActive: boolean;
  role: 'student' | 'instructor' | 'admin';
  profileCompleteness?: number; // Percentage of profile completion
}

// Supporting Interfaces
export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string; // YYYY-MM format
  endDate?: string; // YYYY-MM format or null for current
  isCurrent: boolean;
  description?: string;
  skills?: string[];
  media?: MediaItem[];
}

export interface Education {
  id: string;
  school: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  grade?: string;
  activities?: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  endorsements?: number;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category?: string;
}

export interface Certification {
  id: string;
  name: string;
  organization: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  skills?: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  url?: string;
  skills?: string[];
  collaborators?: string[];
  media?: MediaItem[];
}

export interface Publication {
  id: string;
  title: string;
  publisher: string;
  publishDate: string;
  description?: string;
  url?: string;
  authors?: string[];
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'elementary' | 'limited' | 'professional' | 'full' | 'native';
}

export interface VolunteerExperience {
  id: string;
  organization: string;
  role: string;
  cause?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

export interface Honor {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  description?: string;
}

export interface CourseAccomplishment {
  id: string;
  name: string;
  number?: string;
  associatedWith?: string;
}

export interface Organization {
  id: string;
  name: string;
  position?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

export interface Patent {
  id: string;
  title: string;
  patentOffice: string;
  patentNumber: string;
  issueDate: string;
  description?: string;
  inventors?: string[];
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'document' | 'link';
  url: string;
  title?: string;
  description?: string;
}

class UserDataService {
  private usersCollection = 'users';

  /**
   * Create a new user profile in Firestore with enhanced data from OAuth providers
   */
  async createUserProfile(socialUser: GoogleUser, isNewUser: boolean): Promise<UserProfile> {
    try {
      console.log('🔧 UserDataService: Starting createUserProfile...');
      console.log('📊 Input data:', { socialUser, isNewUser });

      const userRef = doc(db, this.usersCollection, socialUser.id);
      console.log('📍 Firestore reference created for UID:', socialUser.id);

      // Check if user already exists
      console.log('🔍 Checking if user already exists...');
      const existingUser = await getDoc(userRef);
      console.log('📋 Existing user check result:', existingUser.exists());

      if (existingUser.exists() && !isNewUser) {
        console.log('✅ Existing user found, updating last login...');
        // Update last login time for existing user
        await updateDoc(userRef, {
          lastLoginAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        return existingUser.data() as UserProfile;
      }

      // Create new user profile with enhanced data
      console.log('📝 Creating new user profile...');

      // Helper function to remove undefined values
      const cleanObject = (obj: any): any => {
        const cleaned: any = {};
        Object.keys(obj).forEach(key => {
          if (obj[key] !== undefined && obj[key] !== null) {
            cleaned[key] = obj[key];
          }
        });
        return cleaned;
      };

      const baseProfile = {
        uid: socialUser.id,
        email: socialUser.email,
        displayName: socialUser.name,
        photoURL: socialUser.picture,
        provider: socialUser.provider as 'google' | 'github' | 'email',
        providerId: socialUser.id,

        // Enhanced profile data from OAuth providers (only if not undefined)
        headline: this.generateHeadline(socialUser),

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
          language: socialUser.locale || 'en'
        },

        // Metadata
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true,
        role: 'student',
        profileCompleteness: this.calculateProfileCompleteness(socialUser)
      };

      // Add optional fields only if they have values
      const optionalFields = cleanObject({
        firstName: socialUser.firstName,
        lastName: socialUser.lastName,
        location: socialUser.location,
        website: socialUser.website || socialUser.blog,
        about: socialUser.bio,
        googleId: socialUser.provider === 'google' ? socialUser.googleId : undefined,
        locale: socialUser.provider === 'google' ? socialUser.locale : undefined,
        company: socialUser.provider === 'github' ? socialUser.company : undefined
      });

      // Add GitHub stats if available
      const githubStats = socialUser.provider === 'github' ? cleanObject({
        username: socialUser.githubLogin,
        publicRepos: socialUser.publicRepos,
        followers: socialUser.followers,
        following: socialUser.following,
        hireable: socialUser.hireable
      }) : {};

      const newUserProfile = {
        ...baseProfile,
        ...optionalFields,
        ...(Object.keys(githubStats).length > 0 && { githubStats })
      };

      console.log('💾 Writing to Firestore...');
      console.log('📄 Profile data to write:', newUserProfile);

      await setDoc(userRef, newUserProfile);
      console.log('✅ Firestore write completed successfully');

      console.log('✅ Enhanced user profile created in Firestore:', socialUser.email);
      console.log('📊 Profile data captured:', {
        provider: socialUser.provider,
        hasFirstName: !!socialUser.firstName,
        hasLastName: !!socialUser.lastName,
        hasLocation: !!socialUser.location,
        hasBio: !!socialUser.bio,
        hasCompany: !!socialUser.company,
        hasWebsite: !!socialUser.website,
        githubStats: socialUser.provider === 'github' ? {
          repos: socialUser.publicRepos,
          followers: socialUser.followers,
          following: socialUser.following
        } : null
      });

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
   * Generate a professional headline based on available data
   */
  private generateHeadline(socialUser: GoogleUser): string {
    if (socialUser.provider === 'github') {
      if (socialUser.bio) {
        return socialUser.bio;
      }
      if (socialUser.company) {
        return `Developer at ${socialUser.company}`;
      }
      return 'Software Developer';
    }

    // Default headline
    return 'Learner at Learnnect';
  }

  /**
   * Calculate profile completeness percentage
   */
  private calculateProfileCompleteness(socialUser: GoogleUser): number {
    let completeness = 30; // Base score for having an account

    if (socialUser.firstName) completeness += 10;
    if (socialUser.lastName) completeness += 10;
    if (socialUser.picture) completeness += 10;
    if (socialUser.bio) completeness += 15;
    if (socialUser.location) completeness += 10;
    if (socialUser.company) completeness += 10;
    if (socialUser.website || socialUser.blog) completeness += 5;

    return Math.min(completeness, 100);
  }

  /**
   * Get user profile by UID
   */
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      console.log('🔍 UserDataService: Getting user profile for UID:', uid);
      const userRef = doc(db, this.usersCollection, uid);
      const userDoc = await getDoc(userRef);

      console.log('📋 User document exists:', userDoc.exists());

      if (userDoc.exists()) {
        const userData = userDoc.data() as UserProfile;
        console.log('✅ User profile retrieved:', userData.email);
        return userData;
      }

      console.log('❌ No user profile found for UID:', uid);
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

      // Clean the updates to remove undefined values
      const cleanedUpdates = this.cleanObjectForFirebase(updates);

      await updateDoc(userRef, {
        ...cleanedUpdates,
        updatedAt: serverTimestamp()
      });

      console.log('✅ User profile updated:', uid);
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  }

  /**
   * Clean object to remove undefined values for Firebase
   */
  private cleanObjectForFirebase(obj: any): any {
    if (obj === null || obj === undefined) {
      return null;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.cleanObjectForFirebase(item));
    }

    if (typeof obj === 'object') {
      const cleaned: any = {};
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (value !== undefined) {
          cleaned[key] = this.cleanObjectForFirebase(value);
        }
      });
      return cleaned;
    }

    return obj;
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
