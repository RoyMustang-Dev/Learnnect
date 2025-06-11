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
  private readonly API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';

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
