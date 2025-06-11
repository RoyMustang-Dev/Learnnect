// Authentication Service
// This file contains all the backend logic for authentication
// Replace the mock implementations with real API calls

interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

interface LoginResponse {
  success: boolean;
  user: User;
  token: string;
  refreshToken?: string;
}

interface SignupData {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

interface OTPResponse {
  success: boolean;
  message: string;
  expiresAt?: string;
}

class AuthService {
  private baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  // Login with email and password
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      // Mock implementation - replace with real API call
      await this.delay(1500);

      if (email === 'demo@learnnect.com' && password === 'Demo123!') {
        return {
          success: true,
          user: {
            id: '1',
            email,
            name: 'Demo User',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          },
          token: 'mock-jwt-token'
        };
      }

      throw new Error('Invalid credentials');

      // Real API implementation would look like:
      /*
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      return await response.json();
      */
    } catch (error) {
      throw error;
    }
  }

  // Sign up new user
  async signup(userData: SignupData): Promise<LoginResponse> {
    try {
      // Mock implementation - replace with real API call
      await this.delay(1500);

      return {
        success: true,
        user: {
          id: Date.now().toString(),
          ...userData,
          createdAt: new Date().toISOString()
        },
        token: 'mock-jwt-token'
      };

      // Real API implementation:
      /*
      const response = await fetch(`${this.baseURL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }

      return await response.json();
      */
    } catch (error) {
      throw error;
    }
  }

  // Send OTP for password reset
  async sendOTP(identifier: string, method: 'email' | 'phone'): Promise<OTPResponse> {
    try {
      // Mock implementation - replace with real API call
      await this.delay(1000);

      return {
        success: true,
        message: `OTP sent to your ${method}`,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes
      };

      // Real API implementation:
      /*
      const response = await fetch(`${this.baseURL}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, method }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send OTP');
      }

      return await response.json();
      */
    } catch (error) {
      throw error;
    }
  }

  // Verify OTP
  async verifyOTP(otp: string, identifier: string): Promise<{ success: boolean; resetToken?: string }> {
    try {
      // Mock implementation - replace with real API call
      await this.delay(1000);

      if (otp === '123456') {
        return {
          success: true,
          resetToken: 'mock-reset-token'
        };
      }

      throw new Error('Invalid OTP');

      // Real API implementation:
      /*
      const response = await fetch(`${this.baseURL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp, identifier }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'OTP verification failed');
      }

      return await response.json();
      */
    } catch (error) {
      throw error;
    }
  }

  // Reset password with token
  async resetPassword(resetToken: string, newPassword: string): Promise<{ success: boolean }> {
    try {
      // Mock implementation - replace with real API call
      await this.delay(1000);

      return { success: true };

      // Real API implementation:
      /*
      const response = await fetch(`${this.baseURL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resetToken, newPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Password reset failed');
      }

      return await response.json();
      */
    } catch (error) {
      throw error;
    }
  }

  // Social login (Google, GitHub)
  async socialLogin(provider: string, userEmail?: string): Promise<LoginResponse> {
    try {
      // Mock implementation - replace with real API call
      await this.delay(1000);

      // Simulate checking if user exists in database
      const mockExistingUsers = [
        'demo@learnnect.com',
        'user@google.com',
        'existing@github.com',
        'test@gmail.com' // Add some test emails
      ];

      const email = userEmail || `user@${provider}.com`;
      const userExists = mockExistingUsers.includes(email);

      if (!userExists) {
        // User doesn't exist, throw error to trigger signup flow
        throw new Error('USER_NOT_FOUND');
      }

      return {
        success: true,
        user: {
          id: Date.now().toString(),
          email: email,
          name: `${provider} User`,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        },
        token: 'mock-jwt-token'
      };

      // Real API implementation:
      /*
      const response = await fetch(`${this.baseURL}/auth/social/${provider}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          email: userEmail,
          token
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Social login failed');
      }

      return await response.json();
      */
    } catch (error) {
      throw error;
    }
  }

  // Social signup (Google, GitHub, LinkedIn)
  async socialSignup(provider: string, userData: any): Promise<LoginResponse> {
    try {
      // Mock implementation - replace with real API call
      await this.delay(1000);

      return {
        success: true,
        user: {
          id: Date.now().toString(),
          email: userData.email,
          name: userData.name,
          avatar: userData.avatar,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        },
        token: 'mock-jwt-token'
      };

      // Real API implementation:
      /*
      const response = await fetch(`${this.baseURL}/auth/social/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          ...userData
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Social signup failed');
      }

      return await response.json();
      */
    } catch (error) {
      throw error;
    }
  }

  // Refresh token
  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    try {
      // Real API implementation:
      /*
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      return await response.json();
      */

      // Mock implementation
      await this.delay(500);
      return {
        token: 'new-mock-jwt-token',
        refreshToken: 'new-mock-refresh-token'
      };
    } catch (error) {
      throw error;
    }
  }

  // Logout
  async logout(token: string): Promise<{ success: boolean }> {
    try {
      // Real API implementation:
      /*
      const response = await fetch(`${this.baseURL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return { success: response.ok };
      */

      // Mock implementation
      await this.delay(500);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  // Utility method for mock delays
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Validate email format using enhanced validation
  validateEmail(email: string): boolean {
    // Import the enhanced validation function
    const { validateEmail } = require('../utils/validation');
    return validateEmail(email);
  }

  // Validate phone format
  validatePhone(phone: string): boolean {
    return /^[\+]?[1-9][\d]{0,15}$/.test(phone);
  }

  // Validate password strength
  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
