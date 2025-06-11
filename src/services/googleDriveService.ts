/**
 * Google Drive Service for Resume Storage
 * Creates user-specific folders and manages resume uploads
 */

export interface DriveUploadResult {
  success: boolean;
  fileId?: string;
  downloadURL?: string;
  error?: string;
}

export interface DriveFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  createdTime: string;
  downloadURL: string;
}

class GoogleDriveService {
  private readonly CLIENT_ID = import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_ID || '';
  private readonly API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';
  private readonly DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
  private readonly SCOPES = 'https://www.googleapis.com/auth/drive.file';
  
  private gapi: any = null;
  private isInitialized = false;

  /**
   * Initialize Google Drive API with Google Identity Services
   */
  async initialize(): Promise<boolean> {
    try {
      if (this.isInitialized) return true;

      // Debug: Log which Client ID is being used
      console.log('🔍 Google Drive Client ID:', this.CLIENT_ID);
      console.log('🔍 Environment variables:', {
        VITE_GOOGLE_DRIVE_CLIENT_ID: import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_ID,
        VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID
      });

      if (!this.CLIENT_ID) {
        throw new Error('Google Drive Client ID not found in environment variables');
      }

      // Load Google API and GIS
      await this.loadGoogleAPI();

      // Initialize gapi client (without auth2)
      await new Promise<void>((resolve, reject) => {
        this.gapi.load('client', async () => {
          try {
            await this.gapi.client.init({
              apiKey: this.API_KEY,
              discoveryDocs: [this.DISCOVERY_DOC]
            });
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      });

      this.isInitialized = true;
      console.log('✅ Google Drive API initialized with GIS and Client ID:', this.CLIENT_ID);
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Google Drive API:', error);
      return false;
    }
  }

  /**
   * Load Google API script and Google Identity Services
   */
  private loadGoogleAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Load both gapi and Google Identity Services
      const loadGapi = () => {
        if ((window as any).gapi) {
          this.gapi = (window as any).gapi;
          return Promise.resolve();
        }

        return new Promise<void>((resolveGapi, rejectGapi) => {
          const script = document.createElement('script');
          script.src = 'https://apis.google.com/js/api.js';
          script.onload = () => {
            this.gapi = (window as any).gapi;
            resolveGapi();
          };
          script.onerror = rejectGapi;
          document.head.appendChild(script);
        });
      };

      const loadGIS = () => {
        if ((window as any).google?.accounts) {
          return Promise.resolve();
        }

        return new Promise<void>((resolveGIS, rejectGIS) => {
          const script = document.createElement('script');
          script.src = 'https://accounts.google.com/gsi/client';
          script.onload = () => resolveGIS();
          script.onerror = rejectGIS;
          document.head.appendChild(script);
        });
      };

      // Load both scripts
      Promise.all([loadGapi(), loadGIS()])
        .then(() => resolve())
        .catch(reject);
    });
  }

  private accessToken: string | null = null;

  /**
   * Sign in to Google Drive using Google Identity Services
   */
  async signIn(): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Check if already have valid token
      if (this.accessToken) {
        console.log('✅ Already have access token for Google Drive');
        return true;
      }

      // Use Google Identity Services for OAuth
      return new Promise((resolve) => {
        const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: this.CLIENT_ID,
          scope: this.SCOPES,
          callback: (response: any) => {
            if (response.error) {
              console.error('❌ Google Drive OAuth failed:', response.error);
              resolve(false);
              return;
            }

            this.accessToken = response.access_token;
            console.log('✅ Signed in to Google Drive with GIS');
            resolve(true);
          },
        });

        tokenClient.requestAccessToken();
      });
    } catch (error) {
      console.error('❌ Google Drive sign-in failed:', error);
      return false;
    }
  }

  /**
   * Create or get user folder in Google Drive
   */
  async createUserFolder(userId: string, fullName: string): Promise<string | null> {
    try {
      const folderName = `Learnnect_${fullName.replace(/\s+/g, '_')}_${userId.slice(-8)}`;
      
      // Check if folder already exists
      const existingFolder = await this.findFolder(folderName);
      if (existingFolder) {
        console.log('📁 User folder already exists:', folderName);
        return existingFolder.id;
      }

      // Create new folder
      const folderMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [] // Root folder
      };

      const response = await this.gapi.client.drive.files.create({
        resource: folderMetadata
      });

      console.log('✅ Created user folder:', folderName);
      return response.result.id;
    } catch (error) {
      console.error('❌ Failed to create user folder:', error);
      return null;
    }
  }

  /**
   * Find folder by name
   */
  private async findFolder(folderName: string): Promise<any> {
    try {
      const response = await this.gapi.client.drive.files.list({
        q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id, name)'
      });

      return response.result.files.length > 0 ? response.result.files[0] : null;
    } catch (error) {
      console.error('❌ Failed to find folder:', error);
      return null;
    }
  }

  /**
   * Upload resume to user's Google Drive folder
   */
  async uploadResume(
    userId: string, 
    fullName: string, 
    file: File
  ): Promise<DriveUploadResult> {
    try {
      console.log('🔄 Starting Google Drive upload...');

      // Ensure signed in
      const signedIn = await this.signIn();
      if (!signedIn) {
        return { success: false, error: 'Failed to sign in to Google Drive' };
      }

      // Create or get user folder
      const folderId = await this.createUserFolder(userId, fullName);
      if (!folderId) {
        return { success: false, error: 'Failed to create user folder' };
      }

      // Generate unique filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileExtension = file.name.split('.').pop();
      const fileName = `Resume_${timestamp}.${fileExtension}`;

      // Upload file
      const fileMetadata = {
        name: fileName,
        parents: [folderId]
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(fileMetadata)], {
        type: 'application/json'
      }));
      form.append('file', file);

      const response = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          },
          body: form
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Make file publicly readable
      await this.makeFilePublic(result.id);
      
      // Get download URL
      const downloadURL = `https://drive.google.com/file/d/${result.id}/view`;

      console.log('✅ Resume uploaded to Google Drive:', fileName);
      
      return {
        success: true,
        fileId: result.id,
        downloadURL
      };

    } catch (error) {
      console.error('❌ Google Drive upload failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  /**
   * Make file publicly readable
   */
  private async makeFilePublic(fileId: string): Promise<void> {
    try {
      await this.gapi.client.drive.permissions.create({
        fileId: fileId,
        resource: {
          role: 'reader',
          type: 'anyone'
        }
      });
    } catch (error) {
      console.warn('⚠️ Could not make file public:', error);
    }
  }

  /**
   * Get user's resumes from their folder
   */
  async getUserResumes(userId: string, fullName: string): Promise<DriveFile[]> {
    try {
      const folderName = `Learnnect_${fullName.replace(/\s+/g, '_')}_${userId.slice(-8)}`;
      const folder = await this.findFolder(folderName);
      
      if (!folder) {
        return [];
      }

      const response = await this.gapi.client.drive.files.list({
        q: `'${folder.id}' in parents and trashed=false`,
        fields: 'files(id, name, size, mimeType, createdTime)',
        orderBy: 'createdTime desc'
      });

      return response.result.files.map((file: any) => ({
        id: file.id,
        name: file.name,
        size: parseInt(file.size) || 0,
        mimeType: file.mimeType,
        createdTime: file.createdTime,
        downloadURL: `https://drive.google.com/file/d/${file.id}/view`
      }));

    } catch (error) {
      console.error('❌ Failed to get user resumes:', error);
      return [];
    }
  }

  /**
   * Delete resume from Google Drive
   */
  async deleteResume(fileId: string): Promise<boolean> {
    try {
      await this.gapi.client.drive.files.delete({
        fileId: fileId
      });
      
      console.log('✅ Resume deleted from Google Drive');
      return true;
    } catch (error) {
      console.error('❌ Failed to delete resume:', error);
      return false;
    }
  }

  /**
   * Check if user is signed in to Google Drive
   */
  isSignedIn(): boolean {
    return !!this.accessToken;
  }

  /**
   * Sign out from Google Drive
   */
  async signOut(): Promise<void> {
    try {
      this.accessToken = null;
      console.log('✅ Signed out from Google Drive');
    } catch (error) {
      console.error('❌ Sign out failed:', error);
    }
  }
}

export const googleDriveService = new GoogleDriveService();
