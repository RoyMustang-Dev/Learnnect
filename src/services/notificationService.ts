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
  onSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  actionData?: any;
  createdAt: Timestamp;
  expiresAt?: Timestamp;
  priority: 'low' | 'medium' | 'high';
  category: NotificationCategory;
}

export type NotificationType = 
  | 'message_received'
  | 'connection_request'
  | 'connection_accepted'
  | 'profile_view'
  | 'blog_post_published'
  | 'newsletter_sent'
  | 'course_update'
  | 'achievement_unlocked'
  | 'system_announcement';

export type NotificationCategory = 
  | 'social'
  | 'content'
  | 'learning'
  | 'system';

export interface NotificationSummary {
  total: number;
  unread: number;
  byCategory: {
    social: number;
    content: number;
    learning: number;
    system: number;
  };
  recent: Notification[];
}

class NotificationService {
  private readonly COLLECTION_NAME = 'notifications';
  private readonly MAX_NOTIFICATIONS = 100;

  /**
   * Create a new notification
   */
  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    options?: {
      actionUrl?: string;
      actionData?: any;
      priority?: 'low' | 'medium' | 'high';
      expiresIn?: number; // milliseconds
    }
  ): Promise<Notification | null> {
    try {
      const category = this.getNotificationCategory(type);
      const priority = options?.priority || this.getDefaultPriority(type);
      
      const notificationData: Omit<Notification, 'id'> = {
        userId,
        type,
        title,
        message,
        read: false,
        actionUrl: options?.actionUrl,
        actionData: options?.actionData,
        createdAt: Timestamp.now(),
        expiresAt: options?.expiresIn ? 
          Timestamp.fromMillis(Date.now() + options.expiresIn) : 
          undefined,
        priority,
        category
      };

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), notificationData);
      
      // Clean up old notifications if needed
      await this.cleanupOldNotifications(userId);

      const notification: Notification = {
        id: docRef.id,
        ...notificationData
      };

      console.log('✅ Notification created:', notification);
      return notification;
    } catch (error) {
      console.error('❌ Error creating notification:', error);
      return null;
    }
  }

  /**
   * Get notifications for a user
   */
  async getUserNotifications(
    userId: string, 
    limitCount: number = 20,
    unreadOnly: boolean = false
  ): Promise<Notification[]> {
    try {
      let q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      if (unreadOnly) {
        q = query(
          collection(db, this.COLLECTION_NAME),
          where('userId', '==', userId),
          where('read', '==', false),
          orderBy('createdAt', 'desc'),
          limit(limitCount)
        );
      }

      const querySnapshot = await getDocs(q);
      const notifications: Notification[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Filter out expired notifications
        if (!data.expiresAt || data.expiresAt.toMillis() > Date.now()) {
          notifications.push({
            id: doc.id,
            ...data
          } as Notification);
        }
      });

      return notifications;
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      return [];
    }
  }

  /**
   * Get notification summary
   */
  async getNotificationSummary(userId: string): Promise<NotificationSummary> {
    try {
      const notifications = await this.getUserNotifications(userId, 50);
      const unreadNotifications = notifications.filter(n => !n.read);
      
      const byCategory = {
        social: unreadNotifications.filter(n => n.category === 'social').length,
        content: unreadNotifications.filter(n => n.category === 'content').length,
        learning: unreadNotifications.filter(n => n.category === 'learning').length,
        system: unreadNotifications.filter(n => n.category === 'system').length
      };

      return {
        total: notifications.length,
        unread: unreadNotifications.length,
        byCategory,
        recent: notifications.slice(0, 5)
      };
    } catch (error) {
      console.error('❌ Error getting notification summary:', error);
      return {
        total: 0,
        unread: 0,
        byCategory: { social: 0, content: 0, learning: 0, system: 0 },
        recent: []
      };
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const notificationRef = doc(db, this.COLLECTION_NAME, notificationId);
      await updateDoc(notificationRef, {
        read: true
      });
      return true;
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
      return false;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const unreadNotifications = await this.getUserNotifications(userId, 100, true);
      
      const updatePromises = unreadNotifications.map(notification => 
        this.markAsRead(notification.id)
      );

      await Promise.all(updatePromises);
      return true;
    } catch (error) {
      console.error('❌ Error marking all notifications as read:', error);
      return false;
    }
  }

  /**
   * Subscribe to real-time notifications
   */
  subscribeToNotifications(
    userId: string, 
    callback: (notifications: Notification[]) => void
  ): () => void {
    const q = query(
      collection(db, this.COLLECTION_NAME),
      where('userId', '==', userId),
      where('read', '==', false),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    return onSnapshot(q, (snapshot) => {
      const notifications: Notification[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Filter out expired notifications
        if (!data.expiresAt || data.expiresAt.toMillis() > Date.now()) {
          notifications.push({
            id: doc.id,
            ...data
          } as Notification);
        }
      });
      callback(notifications);
    });
  }

  /**
   * Create message notification
   */
  async notifyMessageReceived(
    userId: string, 
    senderName: string, 
    messagePreview: string,
    conversationId: string
  ): Promise<void> {
    await this.createNotification(
      userId,
      'message_received',
      `New message from ${senderName}`,
      messagePreview.length > 50 ? 
        `${messagePreview.substring(0, 50)}...` : 
        messagePreview,
      {
        actionUrl: `/messages/${conversationId}`,
        priority: 'medium'
      }
    );
  }

  /**
   * Create connection request notification
   */
  async notifyConnectionRequest(
    userId: string, 
    requesterName: string, 
    requestId: string
  ): Promise<void> {
    await this.createNotification(
      userId,
      'connection_request',
      `${requesterName} wants to connect`,
      `${requesterName} sent you a connection request`,
      {
        actionUrl: `/connections/requests`,
        actionData: { requestId },
        priority: 'medium'
      }
    );
  }

  /**
   * Create connection accepted notification
   */
  async notifyConnectionAccepted(
    userId: string, 
    accepterName: string
  ): Promise<void> {
    await this.createNotification(
      userId,
      'connection_accepted',
      `${accepterName} accepted your connection`,
      `You are now connected with ${accepterName}`,
      {
        actionUrl: `/profile/${userId}`,
        priority: 'low'
      }
    );
  }

  /**
   * Create blog post notification
   */
  async notifyBlogPostPublished(
    userId: string, 
    postTitle: string, 
    postSlug: string
  ): Promise<void> {
    await this.createNotification(
      userId,
      'blog_post_published',
      'New blog post published',
      `Check out our latest post: ${postTitle}`,
      {
        actionUrl: `/blog/${postSlug}`,
        priority: 'low',
        expiresIn: 7 * 24 * 60 * 60 * 1000 // 7 days
      }
    );
  }

  /**
   * Create newsletter notification
   */
  async notifyNewsletterSent(
    userId: string, 
    newsletterTitle: string
  ): Promise<void> {
    await this.createNotification(
      userId,
      'newsletter_sent',
      'New newsletter available',
      `${newsletterTitle} has been sent to your email`,
      {
        priority: 'low',
        expiresIn: 30 * 24 * 60 * 60 * 1000 // 30 days
      }
    );
  }

  /**
   * Get notification category based on type
   */
  private getNotificationCategory(type: NotificationType): NotificationCategory {
    const categoryMap: { [key in NotificationType]: NotificationCategory } = {
      'message_received': 'social',
      'connection_request': 'social',
      'connection_accepted': 'social',
      'profile_view': 'social',
      'blog_post_published': 'content',
      'newsletter_sent': 'content',
      'course_update': 'learning',
      'achievement_unlocked': 'learning',
      'system_announcement': 'system'
    };

    return categoryMap[type];
  }

  /**
   * Get default priority based on type
   */
  private getDefaultPriority(type: NotificationType): 'low' | 'medium' | 'high' {
    const priorityMap: { [key in NotificationType]: 'low' | 'medium' | 'high' } = {
      'message_received': 'medium',
      'connection_request': 'medium',
      'connection_accepted': 'low',
      'profile_view': 'low',
      'blog_post_published': 'low',
      'newsletter_sent': 'low',
      'course_update': 'medium',
      'achievement_unlocked': 'medium',
      'system_announcement': 'high'
    };

    return priorityMap[type];
  }

  /**
   * Clean up old notifications
   */
  private async cleanupOldNotifications(userId: string): Promise<void> {
    try {
      const notifications = await this.getUserNotifications(userId, this.MAX_NOTIFICATIONS + 20);
      
      if (notifications.length > this.MAX_NOTIFICATIONS) {
        const toDelete = notifications.slice(this.MAX_NOTIFICATIONS);
        
        const deletePromises = toDelete.map(notification => 
          doc(db, this.COLLECTION_NAME, notification.id)
        );

        // In a real implementation, you'd batch delete these
        console.log(`Cleaning up ${toDelete.length} old notifications`);
      }
    } catch (error) {
      console.error('❌ Error cleaning up notifications:', error);
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;
