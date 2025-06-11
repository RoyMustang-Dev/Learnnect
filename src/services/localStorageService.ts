/**
 * Local Storage Service for Resume Upload (Development Fallback)
 * Use this when Firebase Storage requires billing
 */

export interface LocalStorageResult {
  success: boolean;
  downloadURL?: string;
  error?: string;
}

class LocalStorageService {
  private readonly STORAGE_KEY = 'learnnect_resumes';

  /**
   * Store file in browser's local storage (for development)
   */
  async storeFile(userId: string, file: File): Promise<LocalStorageResult> {
    try {
      // Convert file to base64
      const base64 = await this.fileToBase64(file);
      
      // Get existing resumes
      const existingResumes = this.getStoredResumes();
      
      // Create resume entry
      const resumeEntry = {
        id: `resume_${Date.now()}`,
        userId,
        fileName: `${userId}_${Date.now()}.${file.name.split('.').pop()}`,
        originalName: file.name,
        fileSize: file.size,
        fileType: file.type,
        base64Data: base64,
        uploadedAt: new Date().toISOString(),
        isActive: true,
        version: existingResumes.filter(r => r.userId === userId).length + 1
      };

      // Store in localStorage
      existingResumes.push(resumeEntry);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingResumes));

      // Create a blob URL for download
      const blob = new Blob([file], { type: file.type });
      const downloadURL = URL.createObjectURL(blob);

      console.log('✅ File stored locally:', resumeEntry.fileName);
      
      return {
        success: true,
        downloadURL
      };
    } catch (error) {
      console.error('❌ Local storage failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Storage failed'
      };
    }
  }

  /**
   * Get user's resumes from local storage
   */
  getUserResumes(userId: string) {
    const allResumes = this.getStoredResumes();
    return allResumes.filter(resume => resume.userId === userId);
  }

  /**
   * Convert file to base64
   */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data:type;base64, prefix
      };
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Get all stored resumes
   */
  private getStoredResumes() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Clear all stored resumes (for testing)
   */
  clearAll() {
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('🗑️ All local resumes cleared');
  }
}

export const localStorageService = new LocalStorageService();

// Development helper
if (import.meta.env.DEV) {
  (window as any).clearResumes = () => localStorageService.clearAll();
  console.log('🔧 Development mode: Use clearResumes() to clear stored resumes');
}
