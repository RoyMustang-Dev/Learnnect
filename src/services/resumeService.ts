import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';



import { learnnectStorageService } from './learnnectStorageService';

export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  fileType: string;
  downloadURL: string;
  driveFileId: string;
  uploadedAt: Timestamp;
  isActive: boolean;
  version: number;
  textContent?: string;
  storageType: 'learnnect_storage';
}

export interface ResumeUploadResult {
  success: boolean;
  resume?: Resume;
  error?: string;
}

class ResumeService {
  private readonly COLLECTION_NAME = 'resumes';
  private readonly MAX_RESUMES = 3;
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];



  /**
   * Check if a file with the same name already exists
   */
  async checkDuplicateFile(userId: string, fileName: string): Promise<Resume | null> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        where('originalName', '==', fileName),
        where('isActive', '==', true)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Resume;
      }

      return null;
    } catch (error) {
      console.error('Error checking duplicate file:', error);
      return null;
    }
  }

  /**
   * Upload a new resume for a user (Google Drive only)
   */
  async uploadResume(userId: string, file: File, userEmail: string): Promise<ResumeUploadResult> {
    try {
      console.log('🚀 Starting Google Drive resume upload...');

      // Validate file
      const validation = this.validateFile(file);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Check for duplicate file
      const duplicateFile = await this.checkDuplicateFile(userId, file.name);
      if (duplicateFile) {
        return {
          success: false,
          error: 'DUPLICATE_FILE',
          resume: duplicateFile
        };
      }

      // Check if Learnnect storage is available
      const storageConnected = await learnnectStorageService.checkConnection();
      if (!storageConnected) {
        return {
          success: false,
          error: 'Learnnect storage service is currently unavailable. Please try again later.'
        };
      }

      // Get current resumes count
      const currentResumes = await this.getUserResumes(userId);
      
      // If user has max resumes, delete the oldest one
      if (currentResumes.length >= this.MAX_RESUMES) {
        const oldestResume = currentResumes[currentResumes.length - 1];
        await this.deleteResume(oldestResume.id, userId);
      }

      // Upload to Learnnect Storage
      console.log('📤 Uploading to Learnnect Storage...');
      const storageResult = await learnnectStorageService.uploadResume(userId, userEmail, file);

      if (!storageResult.success) {
        return {
          success: false,
          error: storageResult.error || 'Learnnect storage upload failed'
        };
      }

      // Get next version number
      const nextVersion = currentResumes.length > 0 ?
        Math.max(...currentResumes.map(r => r.version)) + 1 : 1;



      // Save metadata to Firestore
      const resumeData = {
        userId,
        fileName: `resume_${Date.now()}.${file.name.split('.').pop()}`,
        originalName: file.name,
        fileSize: file.size,
        fileType: file.type,
        downloadURL: storageResult.downloadURL || '',
        driveFileId: storageResult.fileId || '',
        uploadedAt: Timestamp.now(),
        isActive: true,
        version: nextVersion,
        textContent: '',
        storageType: 'learnnect_storage' as const
      };

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), resumeData);

      const resume: Resume = {
        id: docRef.id,
        ...resumeData
      };

      console.log('✅ Resume uploaded successfully to Learnnect Storage!');
      return { success: true, resume };

    } catch (error) {
      console.error('❌ Resume upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  /**
   * Get all resumes for a user
   */
  async getUserResumes(userId: string): Promise<Resume[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        where('isActive', '==', true),
        orderBy('uploadedAt', 'desc'),
        limit(this.MAX_RESUMES)
      );

      const querySnapshot = await getDocs(q);
      const resumes: Resume[] = [];

      querySnapshot.forEach((doc) => {
        resumes.push({
          id: doc.id,
          ...doc.data()
        } as Resume);
      });

      return resumes;
    } catch (error) {
      console.error('❌ Error fetching user resumes:', error);
      return [];
    }
  }

  /**
   * Delete a resume
   */
  async deleteResume(resumeId: string, userId: string): Promise<boolean> {
    try {
      // Get resume data first
      const resumes = await this.getUserResumes(userId);
      const resume = resumes.find(r => r.id === resumeId);
      
      if (!resume) {
        throw new Error('Resume not found');
      }

      // Delete from Learnnect Storage
      if (resume.driveFileId) {
        await learnnectStorageService.deleteResume(resume.driveFileId, userId);
      }

      // Mark as inactive in Firestore (soft delete)
      await updateDoc(doc(db, this.COLLECTION_NAME, resumeId), {
        isActive: false
      });

      console.log('✅ Resume deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Error deleting resume:', error);
      return false;
    }
  }

  /**
   * Get latest resume for a user
   */
  async getLatestResume(userId: string): Promise<Resume | null> {
    const resumes = await this.getUserResumes(userId);
    return resumes.length > 0 ? resumes[0] : null;
  }

  /**
   * Validate uploaded file
   */
  private validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      return { 
        valid: false, 
        error: `File size must be less than ${this.MAX_FILE_SIZE / (1024 * 1024)}MB` 
      };
    }

    // Check file type
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { 
        valid: false, 
        error: 'Only PDF and Word documents are allowed' 
      };
    }

    return { valid: true };
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get file icon based on type
   */
  getFileIcon(fileType: string): string {
    switch (fileType) {
      case 'application/pdf':
        return '📄';
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return '📝';
      default:
        return '📋';
    }
  }


}

export const resumeService = new ResumeService();
export default resumeService;
