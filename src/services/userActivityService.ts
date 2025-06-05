// User Activity Tracking Service
// Automatically tracks user interactions and page views

import { googleAppsScriptService } from './googleAppsScriptService';

interface ActivityData {
  userEmail: string;
  action: string;
  details?: string;
  platform?: string;
}

class UserActivityService {
  private sessionId: string;
  private lastActivity: number = 0;
  private activityQueue: ActivityData[] = [];
  private isProcessing: boolean = false;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeTracking();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  private initializeTracking() {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.trackActivity('page_focus', `Page became visible: ${window.location.pathname}`);
      } else {
        this.trackActivity('page_blur', `Page became hidden: ${window.location.pathname}`);
      }
    });

    // Track page unload
    window.addEventListener('beforeunload', () => {
      this.trackActivity('page_unload', `User leaving: ${window.location.pathname}`);
      this.flushQueue(); // Send any pending activities
    });
  }

  // Main tracking method
  async trackActivity(action: string, details?: string, userEmail?: string): Promise<void> {
    // Get user email from localStorage or context if not provided
    if (!userEmail) {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          userEmail = user.email;
        } catch (error) {
          console.warn('Could not parse user data for activity tracking');
          return; // Don't track if no user email
        }
      } else {
        return; // Don't track anonymous users
      }
    }

    const activityData: ActivityData = {
      userEmail,
      action,
      details,
      platform: 'Web'
    };

    // Add to queue for batch processing
    this.activityQueue.push(activityData);
    this.lastActivity = Date.now();

    // Process queue if it's getting full or after a delay
    if (this.activityQueue.length >= 5 || !this.isProcessing) {
      setTimeout(() => this.processQueue(), 1000);
    }
  }

  // Process queued activities
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.activityQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      // Process activities in batches
      while (this.activityQueue.length > 0) {
        const activity = this.activityQueue.shift();
        if (activity) {
          await googleAppsScriptService.recordUserActivity({
            userEmail: activity.userEmail,
            action: activity.action,
            details: activity.details,
            platform: activity.platform,
            sessionID: this.sessionId
          });
        }
      }
    } catch (error) {
      console.error('Error processing activity queue:', error);
      // Don't throw - activity tracking shouldn't break the app
    } finally {
      this.isProcessing = false;
    }
  }

  // Force flush all pending activities
  private flushQueue(): void {
    if (this.activityQueue.length > 0) {
      // Use sendBeacon for reliable sending during page unload
      const activities = [...this.activityQueue];
      this.activityQueue = [];

      activities.forEach(activity => {
        try {
          const formData = new FormData();
          formData.append('actionType', 'activity');
          formData.append('userEmail', activity.userEmail);
          formData.append('action', activity.action);
          formData.append('details', activity.details || '');
          formData.append('platform', activity.platform || 'Web');
          formData.append('sessionID', this.sessionId);

          // Use sendBeacon for reliable delivery
          const scriptUrl = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;
          if (scriptUrl && navigator.sendBeacon) {
            navigator.sendBeacon(scriptUrl, formData);
          }
        } catch (error) {
          console.error('Error flushing activity:', error);
        }
      });
    }
  }

  // Convenience methods for common activities
  async trackPageView(pageName: string, userEmail?: string): Promise<void> {
    return this.trackActivity('page_view', `Page: ${pageName}`, userEmail);
  }

  async trackButtonClick(buttonName: string, userEmail?: string): Promise<void> {
    return this.trackActivity('button_click', `Button: ${buttonName}`, userEmail);
  }

  async trackCourseView(courseId: string, courseName: string, userEmail?: string): Promise<void> {
    return this.trackActivity('course_view', `Course: ${courseId} - ${courseName}`, userEmail);
  }

  async trackCourseEnroll(courseId: string, courseName: string, userEmail?: string): Promise<void> {
    return this.trackActivity('course_enroll', `Enrolled: ${courseId} - ${courseName}`, userEmail);
  }

  async trackSearch(searchTerm: string, userEmail?: string): Promise<void> {
    return this.trackActivity('search', `Search: ${searchTerm}`, userEmail);
  }

  async trackFilter(filterType: string, filterValue: string, userEmail?: string): Promise<void> {
    return this.trackActivity('filter', `Filter: ${filterType} = ${filterValue}`, userEmail);
  }

  async trackProfileUpdate(section: string, userEmail?: string): Promise<void> {
    return this.trackActivity('profile_update', `Updated: ${section}`, userEmail);
  }

  async trackSettingsChange(setting: string, value: string, userEmail?: string): Promise<void> {
    return this.trackActivity('settings_change', `${setting}: ${value}`, userEmail);
  }

  async trackError(errorType: string, errorMessage: string, userEmail?: string): Promise<void> {
    return this.trackActivity('error', `${errorType}: ${errorMessage}`, userEmail);
  }

  async trackFeatureUsage(featureName: string, userEmail?: string): Promise<void> {
    return this.trackActivity('feature_usage', `Feature: ${featureName}`, userEmail);
  }

  // Get session info
  getSessionId(): string {
    return this.sessionId;
  }

  getLastActivity(): number {
    return this.lastActivity;
  }

  // Check if user is active (activity within last 5 minutes)
  isUserActive(): boolean {
    return Date.now() - this.lastActivity < 5 * 60 * 1000;
  }
}

// Create singleton instance
export const userActivityService = new UserActivityService();

// Auto-track page views when the service is imported
if (typeof window !== 'undefined') {
  // Track initial page load
  window.addEventListener('load', () => {
    userActivityService.trackPageView(window.location.pathname);
  });

  // Track route changes (for SPAs)
  let currentPath = window.location.pathname;
  const observer = new MutationObserver(() => {
    if (window.location.pathname !== currentPath) {
      currentPath = window.location.pathname;
      userActivityService.trackPageView(currentPath);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

export default userActivityService;
