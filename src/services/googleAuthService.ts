// Simplified Google Authentication Service
// This service handles Google OAuth 2.0 authentication

interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  verified_email?: boolean;
}

class GoogleAuthService {
  private readonly scope = 'openid email profile';

  /**
   * Get Google Client ID from environment
   */
  private getClientId(): string {
    try {
      return import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
    } catch (error) {
      console.warn('Failed to get Google Client ID:', error);
      return '';
    }
  }

  /**
   * Get redirect URI for OAuth callback
   */
  private getRedirectUri(): string {
    try {
      if (typeof window !== 'undefined' && window.location) {
        return `${window.location.origin}/auth/google/callback`;
      }
    } catch (error) {
      console.warn('Failed to get redirect URI:', error);
    }
    return 'http://localhost:5174/auth/google/callback';
  }

  /**
   * Check if Google Client ID is configured
   */
  isConfigured(): boolean {
    try {
      const clientId = this.getClientId();
      return !!clientId && clientId !== 'your-google-client-id' && clientId.length > 10;
    } catch (error) {
      console.warn('Error checking Google configuration:', error);
      return false;
    }
  }

  /**
   * Generate a random state parameter for security
   */
  private generateState(): string {
    try {
      const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem('google_oauth_state', state);
      }
      return state;
    } catch (error) {
      console.warn('Failed to generate state:', error);
      return 'fallback-state';
    }
  }

  /**
   * Generate Google OAuth URL for authentication
   */
  getAuthUrl(): string {
    try {
      if (!this.isConfigured()) {
        throw new Error('Google Client ID not configured. Please add VITE_GOOGLE_CLIENT_ID to your .env file.');
      }

      const params = new URLSearchParams({
        client_id: this.getClientId(),
        redirect_uri: this.getRedirectUri(),
        response_type: 'code',
        scope: this.scope,
        access_type: 'offline',
        prompt: 'consent',
        state: this.generateState()
      });

      return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    } catch (error) {
      console.error('Failed to generate auth URL:', error);
      throw error;
    }
  }

  /**
   * Verify state parameter to prevent CSRF attacks
   */
  private verifyState(state: string): boolean {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const storedState = sessionStorage.getItem('google_oauth_state');
        sessionStorage.removeItem('google_oauth_state');
        return storedState === state;
      }
      return true; // Skip verification if sessionStorage not available
    } catch (error) {
      console.warn('Failed to verify state:', error);
      return true; // Allow through if verification fails
    }
  }

  /**
   * Get user information from Google using access token
   */
  async getUserInfo(accessToken: string): Promise<GoogleUser> {
    try {
      const userInfoEndpoint = 'https://www.googleapis.com/oauth2/v2/userinfo';

      const response = await fetch(userInfoEndpoint, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user information from Google');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get user info:', error);
      throw error;
    }
  }

  /**
   * Simplified authentication using authorization code
   * This method handles the OAuth callback and gets user info
   */
  async authenticateWithCode(code: string, state: string): Promise<GoogleUser> {
    try {
      // Verify state parameter
      if (!this.verifyState(state)) {
        throw new Error('Invalid state parameter. Possible CSRF attack.');
      }

      // For simplicity, we'll use the authorization code to get user info directly
      // In a real app, you'd exchange this for tokens on your backend
      const userInfo = await this.getUserInfoFromCode(code);

      return userInfo;
    } catch (error) {
      console.error('Google authentication error:', error);
      throw error;
    }
  }

  /**
   * Get user info using authorization code (simplified approach)
   */
  private async getUserInfoFromCode(code: string): Promise<GoogleUser> {
    try {
      // Exchange code for access token
      const tokenEndpoint = 'https://oauth2.googleapis.com/token';
      const params = new URLSearchParams({
        client_id: this.getClientId(),
        client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.getRedirectUri()
      });

      const tokenResponse = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
      });

      if (!tokenResponse.ok) {
        const error = await tokenResponse.json();
        throw new Error(`Token exchange failed: ${error.error_description || error.error}`);
      }

      const tokens = await tokenResponse.json();

      // Get user info with access token
      return await this.getUserInfo(tokens.access_token);
    } catch (error) {
      console.error('Failed to get user info from code:', error);
      throw error;
    }
  }

  /**
   * Initiate Google login by redirecting to Google OAuth
   */
  login(): void {
    try {
      if (!this.isConfigured()) {
        alert('Google authentication is not configured. Please contact the administrator.');
        return;
      }

      const authUrl = this.getAuthUrl();
      if (typeof window !== 'undefined' && window.location) {
        window.location.href = authUrl;
      }
    } catch (error) {
      console.error('Failed to initiate Google login:', error);
      alert('Failed to start Google login. Please try again.');
    }
  }

  /**
   * Handle the callback from Google OAuth
   */
  async handleCallback(): Promise<GoogleUser> {
    try {
      if (typeof window === 'undefined' || !window.location) {
        throw new Error('Window location not available');
      }

      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');

      if (error) {
        throw new Error(`Google OAuth error: ${error}`);
      }

      if (!code || !state) {
        throw new Error('Missing authorization code or state parameter');
      }

      return await this.authenticateWithCode(code, state);
    } catch (error) {
      console.error('Failed to handle Google callback:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const googleAuthService = new GoogleAuthService();
export default googleAuthService;
