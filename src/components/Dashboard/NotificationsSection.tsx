import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { notificationService, Notification, NotificationSummary } from '../../services/notificationService';
import { 
  Bell, 
  MessageCircle, 
  UserPlus, 
  Eye, 
  BookOpen, 
  FileText, 
  Award,
  AlertCircle,
  CheckCircle,
  X,
  Loader2
} from 'lucide-react';

interface NotificationsSectionProps {
  className?: string;
}

const NotificationsSection: React.FC<NotificationsSectionProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [summary, setSummary] = useState<NotificationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadNotifications();
      
      // Subscribe to real-time notifications
      const unsubscribe = notificationService.subscribeToNotifications(
        user.id,
        (newNotifications) => {
          setNotifications(newNotifications);
        }
      );

      return unsubscribe;
    }
  }, [user?.id]);

  const loadNotifications = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const [notificationsList, notificationSummary] = await Promise.all([
        notificationService.getUserNotifications(user.id, 10),
        notificationService.getNotificationSummary(user.id)
      ]);
      
      setNotifications(notificationsList);
      setSummary(notificationSummary);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      
      // Update summary
      if (summary) {
        setSummary(prev => prev ? { ...prev, unread: prev.unread - 1 } : null);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;

    try {
      await notificationService.markAllAsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setSummary(prev => prev ? { ...prev, unread: 0 } : null);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    const iconMap = {
      'message_received': MessageCircle,
      'connection_request': UserPlus,
      'connection_accepted': UserPlus,
      'profile_view': Eye,
      'blog_post_published': FileText,
      'newsletter_sent': FileText,
      'course_update': BookOpen,
      'achievement_unlocked': Award,
      'system_announcement': AlertCircle
    };

    const IconComponent = iconMap[type as keyof typeof iconMap] || Bell;
    return <IconComponent className="h-4 w-4" />;
  };

  const getNotificationColor = (type: string) => {
    const colorMap = {
      'message_received': 'text-blue-400',
      'connection_request': 'text-green-400',
      'connection_accepted': 'text-green-400',
      'profile_view': 'text-purple-400',
      'blog_post_published': 'text-cyan-400',
      'newsletter_sent': 'text-cyan-400',
      'course_update': 'text-yellow-400',
      'achievement_unlocked': 'text-orange-400',
      'system_announcement': 'text-red-400'
    };

    return colorMap[type as keyof typeof colorMap] || 'text-gray-400';
  };

  const formatTimeAgo = (timestamp: any) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  const displayedNotifications = showAll ? notifications : notifications.slice(0, 5);

  if (loading) {
    return (
      <div className={`bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-neon-cyan" />
          <span className="ml-2 text-gray-300">Loading notifications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-neon-cyan/20 rounded-lg flex items-center justify-center">
            <Bell className="h-4 w-4 text-neon-cyan" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Notifications</h3>
            {summary && summary.unread > 0 && (
              <p className="text-sm text-gray-400">
                {summary.unread} unread notification{summary.unread !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
        
        {summary && summary.unread > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-neon-cyan hover:text-cyan-300 transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-400">{summary.byCategory.social}</div>
            <div className="text-xs text-gray-400">Social</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-cyan-400">{summary.byCategory.content}</div>
            <div className="text-xs text-gray-400">Content</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-400">{summary.byCategory.learning}</div>
            <div className="text-xs text-gray-400">Learning</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-400">{summary.byCategory.system}</div>
            <div className="text-xs text-gray-400">System</div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="text-center py-8">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-400">No notifications yet</p>
          <p className="text-gray-500 text-sm mt-1">
            You'll see updates about messages, connections, and more here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-xl border transition-all duration-200 hover:bg-white/5 ${
                notification.read 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-neon-cyan/5 border-neon-cyan/20'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className={`text-sm font-medium ${
                        notification.read ? 'text-gray-300' : 'text-white'
                      }`}>
                        {notification.title}
                      </h4>
                      <p className={`text-sm mt-1 ${
                        notification.read ? 'text-gray-400' : 'text-gray-300'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                    
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="flex-shrink-0 ml-2 p-1 text-gray-400 hover:text-white transition-colors"
                        title="Mark as read"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  {notification.actionUrl && (
                    <button
                      onClick={() => {
                        if (!notification.read) {
                          handleMarkAsRead(notification.id);
                        }
                        window.location.href = notification.actionUrl!;
                      }}
                      className="text-xs text-neon-cyan hover:text-cyan-300 transition-colors mt-2"
                    >
                      View →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {notifications.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full text-center py-3 text-sm text-neon-cyan hover:text-cyan-300 transition-colors"
            >
              {showAll ? 'Show less' : `Show all ${notifications.length} notifications`}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsSection;
