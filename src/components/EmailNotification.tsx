import React, { useState, useEffect } from 'react';
import { X, Mail, AlertCircle, CheckCircle } from 'lucide-react';

interface EmailNotificationProps {
  email: string;
  type: 'welcome' | 'contact';
  onClose: () => void;
}

const EmailNotification: React.FC<EmailNotificationProps> = ({ email, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-close after 10 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation
  };

  const getContent = () => {
    if (type === 'welcome') {
      return {
        title: '📧 Welcome Email Sent!',
        message: `We've sent a welcome email to ${email}`,
        icon: <Mail className="h-6 w-6 text-neon-cyan" />
      };
    } else {
      return {
        title: '✅ Message Received!',
        message: `Confirmation email sent to ${email}`,
        icon: <CheckCircle className="h-6 w-6 text-green-400" />
      };
    }
  };

  const content = getContent();

  if (!isVisible) return null;

  return (
    <div className={`fixed top-20 right-4 z-50 transform transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div 
        className="relative p-4 rounded-xl border border-white/20 max-w-md"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="h-4 w-4 text-gray-400" />
        </button>

        {/* Content */}
        <div className="flex items-start space-x-3 pr-6">
          <div className="flex-shrink-0 mt-1">
            {content.icon}
          </div>
          
          <div className="flex-1">
            <h4 className="font-semibold text-white text-sm mb-1">
              {content.title}
            </h4>
            <p className="text-cyan-200/80 text-sm">
              {content.message}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-xl overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-neon-cyan to-neon-magenta transition-all duration-[10000ms] ease-linear"
            style={{ width: isVisible ? '0%' : '100%' }}
          />
        </div>
      </div>
    </div>
  );
};

// Global notification manager
export const EmailNotificationManager: React.FC = () => {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    email: string;
    type: 'welcome' | 'contact';
  }>>([]);

  useEffect(() => {
    const handleEmailSent = (event: CustomEvent) => {
      const { email, type } = event.detail;
      const id = `${type}_${Date.now()}`;
      
      setNotifications(prev => [...prev, { id, email, type }]);
    };

    window.addEventListener('emailSent', handleEmailSent as EventListener);
    
    return () => {
      window.removeEventListener('emailSent', handleEmailSent as EventListener);
    };
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <>
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{ top: `${5 + index * 6}rem` }}
          className="fixed right-4 z-50"
        >
          <EmailNotification
            email={notification.email}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
          />
        </div>
      ))}
    </>
  );
};

export default EmailNotification;
