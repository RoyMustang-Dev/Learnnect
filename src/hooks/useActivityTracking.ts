// React Hook for Easy Activity Tracking
// Provides convenient methods to track user interactions

import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userActivityService } from '../services/userActivityService';

interface UseActivityTrackingReturn {
  // Basic tracking methods
  trackClick: (elementName: string, details?: string) => Promise<void>;
  trackPageView: (pageName: string, details?: string) => Promise<void>;
  trackFormSubmit: (formName: string, success: boolean, details?: string) => Promise<void>;
  trackError: (errorType: string, errorMessage: string) => Promise<void>;
  
  // Specific interaction tracking
  trackButtonClick: (buttonName: string, details?: string) => Promise<void>;
  trackLinkClick: (linkName: string, destination: string) => Promise<void>;
  trackModalOpen: (modalName: string) => Promise<void>;
  trackModalClose: (modalName: string) => Promise<void>;
  trackTabSwitch: (fromTab: string, toTab: string) => Promise<void>;
  trackDropdownToggle: (dropdownName: string, isOpen: boolean) => Promise<void>;
  
  // Course-specific tracking
  trackCourseView: (courseId: string, courseName: string) => Promise<void>;
  trackCourseEnroll: (courseId: string, courseName: string) => Promise<void>;
  trackLessonStart: (courseId: string, lessonId: string) => Promise<void>;
  trackLessonComplete: (courseId: string, lessonId: string) => Promise<void>;
  
  // Profile and settings tracking
  trackProfileEdit: (section: string, field?: string) => Promise<void>;
  trackSettingsChange: (setting: string, oldValue: string, newValue: string) => Promise<void>;
  trackPreferenceUpdate: (preference: string, value: string) => Promise<void>;
  
  // Search and filter tracking
  trackSearch: (searchTerm: string, resultsCount?: number) => Promise<void>;
  trackFilterApply: (filterType: string, filterValue: string) => Promise<void>;
  trackFilterClear: (filterType: string) => Promise<void>;
  
  // Social and engagement tracking
  trackShare: (contentType: string, contentId: string, platform: string) => Promise<void>;
  trackLike: (contentType: string, contentId: string) => Promise<void>;
  trackComment: (contentType: string, contentId: string) => Promise<void>;
  trackDownload: (fileName: string, fileType: string) => Promise<void>;
  
  // Performance and UX tracking
  trackLoadTime: (pageName: string, loadTimeMs: number) => Promise<void>;
  trackScrollDepth: (pageName: string, scrollPercentage: number) => Promise<void>;
  trackTimeSpent: (pageName: string, timeSpentMs: number) => Promise<void>;
  
  // Feature usage tracking
  trackFeatureUsage: (featureName: string, details?: string) => Promise<void>;
  trackExperimentView: (experimentName: string, variant: string) => Promise<void>;
  
  // Helper methods
  isTrackingEnabled: boolean;
  getUserEmail: () => string | null;
}

export const useActivityTracking = (): UseActivityTrackingReturn => {
  const { user } = useAuth();

  const isTrackingEnabled = !!user?.email;
  const getUserEmail = useCallback(() => user?.email || null, [user?.email]);

  // Basic tracking methods
  const trackClick = useCallback(async (elementName: string, details?: string) => {
    if (!user?.email) return;
    await userActivityService.trackActivity('click', `Element: ${elementName}${details ? ` | ${details}` : ''}`, user.email);
  }, [user?.email]);

  const trackPageView = useCallback(async (pageName: string, details?: string) => {
    if (!user?.email) return;
    await userActivityService.trackPageView(pageName, user.email);
    if (details) {
      await userActivityService.trackActivity('page_view_details', details, user.email);
    }
  }, [user?.email]);

  const trackFormSubmit = useCallback(async (formName: string, success: boolean, details?: string) => {
    if (!user?.email) return;
    await userActivityService.trackActivity(
      success ? 'form_submit_success' : 'form_submit_error',
      `Form: ${formName}${details ? ` | ${details}` : ''}`,
      user.email
    );
  }, [user?.email]);

  const trackError = useCallback(async (errorType: string, errorMessage: string) => {
    if (!user?.email) return;
    await userActivityService.trackError(errorType, errorMessage, user.email);
  }, [user?.email]);

  // Specific interaction tracking
  const trackButtonClick = useCallback(async (buttonName: string, details?: string) => {
    if (!user?.email) return;
    await userActivityService.trackButtonClick(buttonName, user.email);
    if (details) {
      await userActivityService.trackActivity('button_click_details', `Button: ${buttonName} | ${details}`, user.email);
    }
  }, [user?.email]);

  const trackLinkClick = useCallback(async (linkName: string, destination: string) => {
    if (!user?.email) return;
    await userActivityService.trackActivity('link_click', `Link: ${linkName} -> ${destination}`, user.email);
  }, [user?.email]);

  const trackModalOpen = useCallback(async (modalName: string) => {
    if (!user?.email) return;
    await userActivityService.trackActivity('modal_open', `Modal: ${modalName}`, user.email);
  }, [user?.email]);

  const trackModalClose = useCallback(async (modalName: string) => {
    if (!user?.email) return;
    await userActivityService.trackActivity('modal_close', `Modal: ${modalName}`, user.email);
  }, [user?.email]);

  const trackTabSwitch = useCallback(async (fromTab: string, toTab: string) => {
    if (!user?.email) return;
    await userActivityService.trackActivity('tab_switch', `From: ${fromTab} -> To: ${toTab}`, user.email);
  }, [user?.email]);

  const trackDropdownToggle = useCallback(async (dropdownName: string, isOpen: boolean) => {
    if (!user?.email) return;
    await userActivityService.trackActivity(
      isOpen ? 'dropdown_open' : 'dropdown_close',
      `Dropdown: ${dropdownName}`,
      user.email
    );
  }, [user?.email]);

  // Course-specific tracking
  const trackCourseView = useCallback(async (courseId: string, courseName: string) => {
    if (!user?.email) return;
    await userActivityService.trackCourseView(courseId, courseName, user.email);
  }, [user?.email]);

  const trackCourseEnroll = useCallback(async (courseId: string, courseName: string) => {
    if (!user?.email) return;
    await userActivityService.trackCourseEnroll(courseId, courseName, user.email);
  }, [user?.email]);

  const trackLessonStart = useCallback(async (courseId: string, lessonId: string) => {
    if (!user?.email) return;
    await userActivityService.trackActivity('lesson_start', `Course: ${courseId} | Lesson: ${lessonId}`, user.email);
  }, [user?.email]);

  const trackLessonComplete = useCallback(async (courseId: string, lessonId: string) => {
    if (!user?.email) return;
    await userActivityService.trackActivity('lesson_complete', `Course: ${courseId} | Lesson: ${lessonId}`, user.email);
  }, [user?.email]);

  // Profile and settings tracking
  const trackProfileEdit = useCallback(async (section: string, field?: string) => {
    if (!user?.email) return;
    await userActivityService.trackProfileUpdate(section, user.email);
    if (field) {
      await userActivityService.trackActivity('profile_field_edit', `Section: ${section} | Field: ${field}`, user.email);
    }
  }, [user?.email]);

  const trackSettingsChange = useCallback(async (setting: string, oldValue: string, newValue: string) => {
    if (!user?.email) return;
    await userActivityService.trackSettingsChange(setting, `${oldValue} -> ${newValue}`, user.email);
  }, [user?.email]);

  const trackPreferenceUpdate = useCallback(async (preference: string, value: string) => {
    if (!user?.email) return;
    await userActivityService.trackActivity('preference_update', `${preference}: ${value}`, user.email);
  }, [user?.email]);

  // Search and filter tracking
  const trackSearch = useCallback(async (searchTerm: string, resultsCount?: number) => {
    if (!user?.email) return;
    await userActivityService.trackSearch(searchTerm, user.email);
    if (resultsCount !== undefined) {
      await userActivityService.trackActivity('search_results', `Term: ${searchTerm} | Results: ${resultsCount}`, user.email);
    }
  }, [user?.email]);

  const trackFilterApply = useCallback(async (filterType: string, filterValue: string) => {
    if (!user?.email) return;
    await userActivityService.trackFilter(filterType, filterValue, user.email);
  }, [user?.email]);

  const trackFilterClear = useCallback(async (filterType: string) => {
    if (!user?.email) return;
    await userActivityService.trackActivity('filter_clear', `Filter: ${filterType}`, user.email);
  }, [user?.email]);

  // Social and engagement tracking
  const trackShare = useCallback(async (contentType: string, contentId: string, platform: string) => {
    if (!user?.email) return;
    await userActivityService.trackActivity('share', `${contentType}:${contentId} on ${platform}`, user.email);
  }, [user?.email]);

  const trackLike = useCallback(async (contentType: string, contentId: string) => {
    if (!user?.email) return;
    await userActivityService.trackActivity('like', `${contentType}:${contentId}`, user.email);
  }, [user?.email]);

  const trackComment = useCallback(async (contentType: string, contentId: string) => {
    if (!user?.email) return;
    await userActivityService.trackActivity('comment', `${contentType}:${contentId}`, user.email);
  }, [user?.email]);

  const trackDownload = useCallback(async (fileName: string, fileType: string) => {
    if (!user?.email) return;
    await userActivityService.trackActivity('download', `File: ${fileName} | Type: ${fileType}`, user.email);
  }, [user?.email]);

  // Performance and UX tracking
  const trackLoadTime = useCallback(async (pageName: string, loadTimeMs: number) => {
    if (!user?.email) return;
    await userActivityService.trackActivity('page_load_time', `Page: ${pageName} | Time: ${loadTimeMs}ms`, user.email);
  }, [user?.email]);

  const trackScrollDepth = useCallback(async (pageName: string, scrollPercentage: number) => {
    if (!user?.email) return;
    await userActivityService.trackActivity('scroll_depth', `Page: ${pageName} | Depth: ${scrollPercentage}%`, user.email);
  }, [user?.email]);

  const trackTimeSpent = useCallback(async (pageName: string, timeSpentMs: number) => {
    if (!user?.email) return;
    await userActivityService.trackActivity('time_spent', `Page: ${pageName} | Time: ${timeSpentMs}ms`, user.email);
  }, [user?.email]);

  // Feature usage tracking
  const trackFeatureUsage = useCallback(async (featureName: string, details?: string) => {
    if (!user?.email) return;
    await userActivityService.trackFeatureUsage(featureName, user.email);
    if (details) {
      await userActivityService.trackActivity('feature_details', `Feature: ${featureName} | ${details}`, user.email);
    }
  }, [user?.email]);

  const trackExperimentView = useCallback(async (experimentName: string, variant: string) => {
    if (!user?.email) return;
    await userActivityService.trackActivity('experiment_view', `Experiment: ${experimentName} | Variant: ${variant}`, user.email);
  }, [user?.email]);

  return {
    // Basic tracking
    trackClick,
    trackPageView,
    trackFormSubmit,
    trackError,
    
    // Specific interactions
    trackButtonClick,
    trackLinkClick,
    trackModalOpen,
    trackModalClose,
    trackTabSwitch,
    trackDropdownToggle,
    
    // Course-specific
    trackCourseView,
    trackCourseEnroll,
    trackLessonStart,
    trackLessonComplete,
    
    // Profile and settings
    trackProfileEdit,
    trackSettingsChange,
    trackPreferenceUpdate,
    
    // Search and filters
    trackSearch,
    trackFilterApply,
    trackFilterClear,
    
    // Social and engagement
    trackShare,
    trackLike,
    trackComment,
    trackDownload,
    
    // Performance and UX
    trackLoadTime,
    trackScrollDepth,
    trackTimeSpent,
    
    // Feature usage
    trackFeatureUsage,
    trackExperimentView,
    
    // Helpers
    isTrackingEnabled,
    getUserEmail
  };
};

export default useActivityTracking;
