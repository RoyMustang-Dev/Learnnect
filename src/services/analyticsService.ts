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
  Timestamp,
  increment
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface ProfileAnalytics {
  userId: string;
  profileViews: number;
  searchAppearances: number;
  connectionRequests: number;
  messagesSent: number;
  messagesReceived: number;
  lastUpdated: Timestamp;
  weeklyViews: number[];
  monthlyViews: number[];
  topViewSources: { source: string; count: number }[];
  viewerLocations: { location: string; count: number }[];
}

export interface ViewEvent {
  id: string;
  viewedUserId: string;
  viewerUserId?: string;
  viewerLocation?: string;
  viewSource: 'search' | 'profile_link' | 'connection' | 'message' | 'direct';
  timestamp: Timestamp;
  sessionId: string;
  userAgent?: string;
  referrer?: string;
}

export interface AnalyticsSummary {
  totalViews: number;
  weeklyGrowth: number;
  monthlyGrowth: number;
  topPerformingDay: string;
  averageViewsPerDay: number;
  connectionRate: number;
  responseRate: number;
}

class AnalyticsService {
  private readonly ANALYTICS_COLLECTION = 'profile_analytics';
  private readonly VIEW_EVENTS_COLLECTION = 'view_events';
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  /**
   * Track profile view
   */
  async trackProfileView(
    viewedUserId: string,
    viewerUserId?: string,
    viewSource: ViewEvent['viewSource'] = 'direct',
    additionalData?: {
      location?: string;
      userAgent?: string;
      referrer?: string;
    }
  ): Promise<void> {
    try {
      const sessionId = this.getOrCreateSessionId();
      
      // Record view event
      const viewEvent: Omit<ViewEvent, 'id'> = {
        viewedUserId,
        viewerUserId,
        viewerLocation: additionalData?.location,
        viewSource,
        timestamp: Timestamp.now(),
        sessionId,
        userAgent: additionalData?.userAgent || navigator.userAgent,
        referrer: additionalData?.referrer || document.referrer
      };

      await addDoc(collection(db, this.VIEW_EVENTS_COLLECTION), viewEvent);

      // Update analytics counters
      await this.updateAnalyticsCounters(viewedUserId, viewSource);

      console.log('✅ Profile view tracked:', viewEvent);
    } catch (error) {
      console.error('❌ Error tracking profile view:', error);
    }
  }

  /**
   * Get profile analytics for a user
   */
  async getProfileAnalytics(userId: string): Promise<ProfileAnalytics | null> {
    try {
      const q = query(
        collection(db, this.ANALYTICS_COLLECTION),
        where('userId', '==', userId),
        limit(1)
      );

      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        // Create initial analytics record
        return await this.createInitialAnalytics(userId);
      }

      const doc = querySnapshot.docs[0];
      return {
        userId,
        ...doc.data()
      } as ProfileAnalytics;
    } catch (error) {
      console.error('❌ Error fetching profile analytics:', error);
      return null;
    }
  }

  /**
   * Get analytics summary with calculated metrics
   */
  async getAnalyticsSummary(userId: string): Promise<AnalyticsSummary | null> {
    try {
      const analytics = await this.getProfileAnalytics(userId);
      if (!analytics) return null;

      const viewEvents = await this.getRecentViewEvents(userId, 30); // Last 30 days
      
      // Calculate metrics
      const totalViews = analytics.profileViews;
      const weeklyViews = analytics.weeklyViews || [];
      const monthlyViews = analytics.monthlyViews || [];
      
      const weeklyGrowth = this.calculateGrowthRate(weeklyViews);
      const monthlyGrowth = this.calculateGrowthRate(monthlyViews);
      
      const topPerformingDay = this.getTopPerformingDay(viewEvents);
      const averageViewsPerDay = this.calculateAverageViewsPerDay(viewEvents);
      
      // Calculate rates (these would need connection and message data)
      const connectionRate = 0; // Placeholder - would calculate from actual data
      const responseRate = 0; // Placeholder - would calculate from actual data

      return {
        totalViews,
        weeklyGrowth,
        monthlyGrowth,
        topPerformingDay,
        averageViewsPerDay,
        connectionRate,
        responseRate
      };
    } catch (error) {
      console.error('❌ Error calculating analytics summary:', error);
      return null;
    }
  }

  /**
   * Get view events for a user within a date range
   */
  async getRecentViewEvents(userId: string, days: number = 7): Promise<ViewEvent[]> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const q = query(
        collection(db, this.VIEW_EVENTS_COLLECTION),
        where('viewedUserId', '==', userId),
        where('timestamp', '>=', Timestamp.fromDate(startDate)),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const events: ViewEvent[] = [];

      querySnapshot.forEach((doc) => {
        events.push({
          id: doc.id,
          ...doc.data()
        } as ViewEvent);
      });

      return events;
    } catch (error) {
      console.error('❌ Error fetching view events:', error);
      return [];
    }
  }

  /**
   * Update analytics counters
   */
  private async updateAnalyticsCounters(
    userId: string, 
    viewSource: ViewEvent['viewSource']
  ): Promise<void> {
    try {
      // Get or create analytics document
      let analyticsDoc = await this.getAnalyticsDocument(userId);
      
      if (!analyticsDoc) {
        await this.createInitialAnalytics(userId);
        analyticsDoc = await this.getAnalyticsDocument(userId);
      }

      if (!analyticsDoc) return;

      // Update counters
      const updates: any = {
        profileViews: increment(1),
        lastUpdated: Timestamp.now()
      };

      if (viewSource === 'search') {
        updates.searchAppearances = increment(1);
      }

      await updateDoc(analyticsDoc.ref, updates);

      // Update weekly/monthly arrays
      await this.updateTimeSeriesData(analyticsDoc.ref);
    } catch (error) {
      console.error('❌ Error updating analytics counters:', error);
    }
  }

  /**
   * Create initial analytics record
   */
  private async createInitialAnalytics(userId: string): Promise<ProfileAnalytics> {
    const initialData: Omit<ProfileAnalytics, 'userId'> = {
      profileViews: 0,
      searchAppearances: 0,
      connectionRequests: 0,
      messagesSent: 0,
      messagesReceived: 0,
      lastUpdated: Timestamp.now(),
      weeklyViews: new Array(7).fill(0),
      monthlyViews: new Array(30).fill(0),
      topViewSources: [],
      viewerLocations: []
    };

    const docRef = await addDoc(collection(db, this.ANALYTICS_COLLECTION), {
      userId,
      ...initialData
    });

    return {
      userId,
      ...initialData
    };
  }

  /**
   * Get analytics document reference
   */
  private async getAnalyticsDocument(userId: string): Promise<any> {
    const q = query(
      collection(db, this.ANALYTICS_COLLECTION),
      where('userId', '==', userId),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.empty ? null : querySnapshot.docs[0];
  }

  /**
   * Update time series data (weekly/monthly views)
   */
  private async updateTimeSeriesData(docRef: any): Promise<void> {
    try {
      const doc = await docRef.get();
      const data = doc.data();
      
      const weeklyViews = [...(data.weeklyViews || new Array(7).fill(0))];
      const monthlyViews = [...(data.monthlyViews || new Array(30).fill(0))];
      
      // Shift arrays and add today's increment
      weeklyViews.shift();
      weeklyViews.push((weeklyViews[weeklyViews.length - 1] || 0) + 1);
      
      monthlyViews.shift();
      monthlyViews.push((monthlyViews[monthlyViews.length - 1] || 0) + 1);

      await updateDoc(docRef, {
        weeklyViews,
        monthlyViews
      });
    } catch (error) {
      console.error('❌ Error updating time series data:', error);
    }
  }

  /**
   * Calculate growth rate from time series data
   */
  private calculateGrowthRate(timeSeriesData: number[]): number {
    if (timeSeriesData.length < 2) return 0;
    
    const current = timeSeriesData[timeSeriesData.length - 1];
    const previous = timeSeriesData[timeSeriesData.length - 2];
    
    if (previous === 0) return current > 0 ? 100 : 0;
    
    return Math.round(((current - previous) / previous) * 100);
  }

  /**
   * Get top performing day from view events
   */
  private getTopPerformingDay(viewEvents: ViewEvent[]): string {
    const dayCount: { [key: string]: number } = {};
    
    viewEvents.forEach(event => {
      const day = event.timestamp.toDate().toLocaleDateString('en-US', { weekday: 'long' });
      dayCount[day] = (dayCount[day] || 0) + 1;
    });

    const topDay = Object.entries(dayCount).reduce((a, b) => 
      dayCount[a[0]] > dayCount[b[0]] ? a : b
    );

    return topDay ? topDay[0] : 'Monday';
  }

  /**
   * Calculate average views per day
   */
  private calculateAverageViewsPerDay(viewEvents: ViewEvent[]): number {
    if (viewEvents.length === 0) return 0;
    
    const days = Math.max(1, Math.ceil(viewEvents.length / 7)); // Estimate days from events
    return Math.round(viewEvents.length / days);
  }

  /**
   * Get or create session ID
   */
  private getOrCreateSessionId(): string {
    const sessionKey = 'analytics_session_id';
    const timestampKey = 'analytics_session_timestamp';
    
    const existingSession = sessionStorage.getItem(sessionKey);
    const existingTimestamp = sessionStorage.getItem(timestampKey);
    
    // Check if session is still valid
    if (existingSession && existingTimestamp) {
      const sessionAge = Date.now() - parseInt(existingTimestamp);
      if (sessionAge < this.SESSION_TIMEOUT) {
        return existingSession;
      }
    }
    
    // Create new session
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(sessionKey, newSessionId);
    sessionStorage.setItem(timestampKey, Date.now().toString());
    
    return newSessionId;
  }

  /**
   * Track connection request
   */
  async trackConnectionRequest(userId: string): Promise<void> {
    try {
      const analyticsDoc = await this.getAnalyticsDocument(userId);
      if (analyticsDoc) {
        await updateDoc(analyticsDoc.ref, {
          connectionRequests: increment(1),
          lastUpdated: Timestamp.now()
        });
      }
    } catch (error) {
      console.error('❌ Error tracking connection request:', error);
    }
  }

  /**
   * Track message sent/received
   */
  async trackMessage(userId: string, type: 'sent' | 'received'): Promise<void> {
    try {
      const analyticsDoc = await this.getAnalyticsDocument(userId);
      if (analyticsDoc) {
        const field = type === 'sent' ? 'messagesSent' : 'messagesReceived';
        await updateDoc(analyticsDoc.ref, {
          [field]: increment(1),
          lastUpdated: Timestamp.now()
        });
      }
    } catch (error) {
      console.error('❌ Error tracking message:', error);
    }
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
