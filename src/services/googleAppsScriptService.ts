// Frontend Service for Google Apps Script Integration
// This TypeScript service sends data from React app to Google Apps Script Web App
// The corresponding Google Apps Script code is in GOOGLE_APPS_SCRIPT_CORRECT.gs

interface GoogleSheetsResponse {
  result: 'success' | 'error';
  action?: string;
  row?: number;
  message?: string;
  error?: string;
}

interface UserSignupData {
  actionType: 'signup';
  platform: string;
  userName: string;
  userEmail: string;
  mobile?: string;
  userID: string;
  provider: 'google' | 'github' | 'form';
}

interface UserLoginData {
  actionType: 'login';
  userEmail: string;
  platform?: string;
}

interface ContactFormData {
  actionType: 'contact';
  name: string;
  email: string;
  subject?: string;
  message: string;
}

interface EnquiryFormData {
  actionType: 'enquiry';
  name: string;
  email: string;
  phone?: string;
  courseInterest?: string;
  message: string;
}

interface CourseEnrollmentData {
  actionType: 'enrollment';
  userEmail: string;
  courseID: string;
  courseName: string;
  price: string;
  paymentStatus?: string;
  enrollmentStatus?: string;
}

interface UserActivityData {
  actionType: 'activity';
  userEmail: string;
  action: string;
  details?: string;
  platform?: string;
  sessionID?: string;
}

class GoogleAppsScriptService {
  private readonly scriptUrl: string;

  constructor() {
    // Replace with your actual Google Apps Script Web App URL
    this.scriptUrl = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || '';
    
    if (!this.scriptUrl) {
      console.warn('Google Apps Script URL not configured. Set VITE_GOOGLE_APPS_SCRIPT_URL in your .env file');
    }
  }

  private async sendToGoogleSheets(data: any): Promise<GoogleSheetsResponse> {
    if (!this.scriptUrl) {
      console.warn('Google Sheets integration disabled - no script URL configured');
      return { result: 'error', error: 'Google Sheets integration not configured' };
    }

    try {
      console.log('📊 Sending data to Google Sheets:', data);

      const formData = new FormData();
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });

      const response = await fetch(this.scriptUrl, {
        method: 'POST',
        body: formData,
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: GoogleSheetsResponse = await response.json();
      console.log('✅ Google Sheets response:', result);

      return result;
    } catch (error) {
      console.error('❌ Error sending data to Google Sheets:', error);
      return {
        result: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Record user signup
  async recordUserSignup(userData: Omit<UserSignupData, 'actionType'>): Promise<GoogleSheetsResponse> {
    const data: UserSignupData = {
      actionType: 'signup',
      ...userData,
      platform: userData.platform || 'Web' // Allow override but default to Web
    };

    return this.sendToGoogleSheets(data);
  }

  // Record user login
  async recordUserLogin(userData: Omit<UserLoginData, 'actionType'>): Promise<GoogleSheetsResponse> {
    const data: UserLoginData = {
      actionType: 'login',
      platform: 'Web',
      ...userData
    };

    return this.sendToGoogleSheets(data);
  }

  // Record contact form submission
  async recordContactForm(formData: Omit<ContactFormData, 'actionType'>): Promise<GoogleSheetsResponse> {
    const data: ContactFormData = {
      actionType: 'contact',
      ...formData
    };

    return this.sendToGoogleSheets(data);
  }

  // Record enquiry form submission
  async recordEnquiryForm(formData: Omit<EnquiryFormData, 'actionType'>): Promise<GoogleSheetsResponse> {
    const data: EnquiryFormData = {
      actionType: 'enquiry',
      ...formData
    };

    return this.sendToGoogleSheets(data);
  }

  // Record course enrollment
  async recordCourseEnrollment(enrollmentData: Omit<CourseEnrollmentData, 'actionType'>): Promise<GoogleSheetsResponse> {
    const data: CourseEnrollmentData = {
      actionType: 'enrollment',
      paymentStatus: 'Completed',
      enrollmentStatus: 'Active',
      ...enrollmentData
    };

    return this.sendToGoogleSheets(data);
  }

  // Record user activity
  async recordUserActivity(activityData: Omit<UserActivityData, 'actionType'>): Promise<GoogleSheetsResponse> {
    const data: UserActivityData = {
      actionType: 'activity',
      platform: 'Web',
      sessionID: this.generateSessionID(),
      ...activityData
    };

    return this.sendToGoogleSheets(data);
  }

  // Helper method to generate session ID
  private generateSessionID(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  // Convenience method for tracking page views
  async trackPageView(userEmail: string, pageName: string, details?: string): Promise<GoogleSheetsResponse> {
    return this.recordUserActivity({
      userEmail,
      action: 'page_view',
      details: `Page: ${pageName}${details ? ` | ${details}` : ''}`
    });
  }

  // Convenience method for tracking course interactions
  async trackCourseInteraction(userEmail: string, courseId: string, action: string, details?: string): Promise<GoogleSheetsResponse> {
    return this.recordUserActivity({
      userEmail,
      action: `course_${action}`,
      details: `Course: ${courseId}${details ? ` | ${details}` : ''}`
    });
  }

  // Convenience method for tracking authentication events
  async trackAuthEvent(userEmail: string, provider: string, action: 'signup' | 'login'): Promise<GoogleSheetsResponse> {
    if (action === 'signup') {
      return this.recordUserSignup({
        platform: 'Web',
        userName: userEmail.split('@')[0], // Extract name from email as fallback
        userEmail,
        userID: `${provider}_${Date.now()}`,
        provider: provider as 'google' | 'github' | 'form'
      });
    } else {
      return this.recordUserLogin({
        userEmail,
        platform: 'Web'
      });
    }
  }
}

// Export singleton instance
export const googleAppsScriptService = new GoogleAppsScriptService();
export default googleAppsScriptService;
