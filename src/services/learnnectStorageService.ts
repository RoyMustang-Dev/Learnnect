/**
 * Learnnect Storage Service
 * Uses Learnnect's Google Drive service account to store user resumes
 * No user authentication required - all storage handled server-side
 */

export interface StorageUploadResult {
  success: boolean;
  fileId?: string;
  downloadURL?: string;
  error?: string;
}

export interface StorageFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  createdTime: string;
  downloadURL: string;
}

class LearnnectStorageService {
  private readonly API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://learnnect-backend.onrender.com';

  /**
   * Upload resume to Learnnect's Google Drive
   */
  async uploadResume(
    userId: string,
    userEmail: string,
    file: File
  ): Promise<StorageUploadResult> {
    try {
      console.log('🔄 Starting Learnnect storage upload...');

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('userEmail', userEmail);

      // Generate unique filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileExtension = file.name.split('.').pop();
      const fileName = `Resume_${timestamp}.${fileExtension}`;
      formData.append('fileName', fileName);

      const response = await fetch(`${this.API_BASE_URL}/api/storage/upload-resume`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      console.log('✅ Resume uploaded to Learnnect storage:', fileName);
      
      return {
        success: true,
        fileId: result.fileId,
        downloadURL: result.downloadURL
      };

    } catch (error) {
      console.error('❌ Learnnect storage upload failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  /**
   * Get user's resumes from Learnnect storage
   */
  async getUserResumes(userId: string, userEmail: string): Promise<StorageFile[]> {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/api/storage/user-resumes?userId=${encodeURIComponent(userId)}&userEmail=${encodeURIComponent(userEmail)}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get resumes: ${response.statusText}`);
      }

      const result = await response.json();
      return result.files || [];

    } catch (error) {
      console.error('❌ Failed to get user resumes:', error);
      return [];
    }
  }

  /**
   * Delete resume from Learnnect storage
   */
  async deleteResume(fileId: string, userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/storage/delete-resume`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileId, userId }),
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.statusText}`);
      }

      console.log('✅ Resume deleted from Learnnect storage');
      return true;
    } catch (error) {
      console.error('❌ Failed to delete resume:', error);
      return false;
    }
  }

  /**
   * Get download URL for a resume
   */
  async getDownloadURL(fileId: string, userId: string): Promise<string | null> {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/api/storage/download-url?fileId=${encodeURIComponent(fileId)}&userId=${encodeURIComponent(userId)}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get download URL: ${response.statusText}`);
      }

      const result = await response.json();
      return result.downloadURL;

    } catch (error) {
      console.error('❌ Failed to get download URL:', error);
      return null;
    }
  }

  /**
   * Check storage connection status
   */
  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/storage/health`, {
        method: 'GET',
      });

      return response.ok;
    } catch (error) {
      console.error('❌ Storage connection check failed:', error);
      return false;
    }
  }

  /**
   * Check if user has existing image of the same type
   */
  async checkExistingImage(
    userId: string,
    userEmail: string,
    imageType: 'profile' | 'banner'
  ): Promise<{ hasExisting: boolean; existingInfo?: any }> {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/api/storage/check-existing-image?userId=${encodeURIComponent(userId)}&userEmail=${encodeURIComponent(userEmail)}&imageType=${imageType}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        return { hasExisting: false };
      }

      const result = await response.json();
      return {
        hasExisting: result.hasExisting || false,
        existingInfo: result.existingInfo
      };

    } catch (error) {
      console.error('❌ Failed to check existing image:', error);
      return { hasExisting: false };
    }
  }

  /**
   * Upload profile image (profile picture or banner)
   */
  async uploadProfileImage(
    userId: string,
    userEmail: string,
    file: File,
    imageType: 'profile' | 'banner',
    forceUpload: boolean = false
  ): Promise<StorageUploadResult & { isDuplicate?: boolean; existingInfo?: any }> {
    try {
      console.log(`🔄 Starting ${imageType} image upload...`);

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
      }

      // Validate file size (5MB limit for images)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File too large. Maximum size is 5MB.');
      }

      // Check for existing image unless forced upload
      if (!forceUpload) {
        const existingCheck = await this.checkExistingImage(userId, userEmail, imageType);
        if (existingCheck.hasExisting) {
          return {
            success: false,
            error: 'DUPLICATE_IMAGE',
            isDuplicate: true,
            existingInfo: existingCheck.existingInfo
          };
        }
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('userEmail', userEmail);

      // Generate unique filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileExtension = file.name.split('.').pop() || 'jpg';
      const fileName = `${imageType}_${timestamp}.${fileExtension}`;
      formData.append('fileName', fileName);
      formData.append('imageType', imageType);

      const response = await fetch(`${this.API_BASE_URL}/api/storage/upload-image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed: ${response.statusText}`);
      }

      const result = await response.json();

      console.log(`✅ ${imageType} image uploaded:`, fileName);

      return {
        success: true,
        fileId: result.fileId,
        downloadURL: result.downloadURL
      };

    } catch (error) {
      console.error(`❌ ${imageType} image upload failed:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  /**
   * Check if user has existing storage folder
   */
  async checkUserFolder(userId: string, userEmail: string): Promise<{
    success: boolean;
    hasFolder?: boolean;
    isFirstTime?: boolean;
    error?: string;
  }> {
    try {
      console.log('🔍 Checking if user has existing storage folder...');

      const response = await fetch(
        `${this.API_BASE_URL}/api/storage/check-user-folder?userId=${encodeURIComponent(userId)}&userEmail=${encodeURIComponent(userEmail)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Check failed: ${response.statusText}`);
      }

      const result = await response.json();

      console.log('✅ User folder check result:', result);

      return result;

    } catch (error) {
      console.error('❌ User folder check failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Check failed',
        isFirstTime: true // Default to first time on error
      };
    }
  }

  /**
   * Delete profile image (profile picture or banner)
   */
  async deleteProfileImage(
    userId: string,
    userEmail: string,
    imageType: 'profile' | 'banner'
  ): Promise<StorageUploadResult> {
    try {
      console.log(`🔄 Starting ${imageType} image deletion...`);

      const response = await fetch(`${this.API_BASE_URL}/api/storage/delete-image`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          userEmail,
          imageType
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Delete failed: ${response.statusText}`);
      }

      const result = await response.json();

      console.log(`✅ ${imageType} image deleted successfully`);

      return {
        success: true,
        fileId: '',
        downloadURL: ''
      };

    } catch (error) {
      console.error(`❌ ${imageType} image deletion failed:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delete failed'
      };
    }
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
}

export const learnnectStorageService = new LearnnectStorageService();
