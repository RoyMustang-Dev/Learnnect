import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Send, User, Mail, Phone, MessageSquare, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { googleAppsScriptService } from '../services/googleAppsScriptService';
import { useAuth } from '../contexts/AuthContext';
import { usePageTimer } from '../hooks/usePageTimer';

interface EnquiryFormData {
  name: string;
  email: string;
  phone: string;
  courseInterest: string;
  message: string;
}

interface EnquiryWidgetProps {
  autoShowDelay?: number; // Delay in milliseconds before auto-showing popup
}

const EnquiryWidget: React.FC<EnquiryWidgetProps> = ({ autoShowDelay = 10000 }) => {
  const { user } = useAuth();
  const [isMinimized, setIsMinimized] = useState(true);
  const [showAutoPopup, setShowAutoPopup] = useState(false);
  const [hasAutoShown, setHasAutoShown] = useState(false);
  const [shouldAnimatePhone, setShouldAnimatePhone] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<EnquiryFormData>({
    name: '',
    email: '',
    phone: '',
    courseInterest: '',
    message: ''
  });

  // Check if popup was already shown in this session
  useEffect(() => {
    const popupShown = sessionStorage.getItem('enquiry-popup-shown');
    if (popupShown === 'true') {
      setHasAutoShown(true);
    }
  }, []);

  // Use page timer hook for better time tracking
  const { hasReachedTarget } = usePageTimer({
    targetTime: autoShowDelay,
    onTimeReached: () => {
      if (!hasAutoShown) {
        setShowAutoPopup(true);
        setHasAutoShown(true);
        setShouldAnimatePhone(false); // Stop phone animation when popup shows
        sessionStorage.setItem('enquiry-popup-shown', 'true');
      }
    },
    trackVisibility: true // Only count time when page is visible
  });

  // Pre-fill form with user data if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.displayName || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('🚀 Submitting enquiry form:', formData);

      // Validate required fields
      if (!formData.name || !formData.email) {
        throw new Error('Name and email are required');
      }

      // Send to Google Sheets using the enquiry form method
      const result = await googleAppsScriptService.recordEnquiryForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        courseInterest: formData.courseInterest,
        message: formData.message
      });

      console.log('📊 Google Sheets response:', result);

      if (result.result === 'success') {
        setShowSuccess(true);

        // Trigger email notification event
        window.dispatchEvent(new CustomEvent('emailSent', {
          detail: { email: formData.email, type: 'contact' }
        }));

        // Reset form after delay
        setTimeout(() => {
          setFormData({
            name: user?.displayName || '',
            email: user?.email || '',
            phone: '',
            courseInterest: '',
            message: ''
          });
          setShowSuccess(false);
          setIsMinimized(true);
          setShowAutoPopup(false);
        }, 3000);
      } else {
        throw new Error(result.error || 'Failed to submit enquiry');
      }
    } catch (error) {
      console.error('❌ Error submitting enquiry:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit enquiry. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeAutoPopup = () => {
    setShowAutoPopup(false);
    setIsMinimized(true);
    // Stop phone animation when form is closed
    setShouldAnimatePhone(false);
  };

  const toggleWidget = () => {
    if (showAutoPopup) {
      setShowAutoPopup(false);
    }
    setIsMinimized(!isMinimized);
    // Stop phone animation when any form is opened
    setShouldAnimatePhone(false);
  };

  const courseOptions = [
    'Complete Data Science with Lean 6 Sigma',
    'AI & Machine Learning',
    'Generative AI',
    'Data Science with Gen AI',
    'Machine Learning with Gen AI',
    'Python for Data Science',
    'Other'
  ];

  return (
    <>
      {/* Auto-popup Overlay */}
      {showAutoPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div 
            className="relative bg-gradient-to-br from-gray-900/95 to-neon-black/95 rounded-2xl border border-neon-cyan/50 backdrop-blur-sm max-w-md w-full transform transition-all duration-500 scale-100"
            style={{
              boxShadow: '0 0 50px rgba(0,255,255,0.3), inset 0 0 30px rgba(255,0,255,0.1)'
            }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-neon-magenta/5 rounded-2xl"></div>
            
            {/* Header */}
            <div className="relative z-10 p-6 border-b border-neon-cyan/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-neon-magenta/20 rounded-full border border-neon-magenta/40">
                    <Phone className="h-6 w-6 text-neon-magenta" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-magenta to-neon-cyan">
                      Enquire Now
                    </h3>
                    <p className="text-sm text-cyan-200/80">Get course information instantly</p>
                  </div>
                </div>
                <button
                  onClick={closeAutoPopup}
                  className="p-2 text-gray-400 hover:text-neon-magenta transition-colors rounded-full hover:bg-neon-magenta/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="relative z-10 p-6">
              {showSuccess ? (
                <div className="text-center py-8">
                  <div className="mb-4">
                    <div className="mx-auto w-16 h-16 bg-neon-cyan/20 rounded-full flex items-center justify-center border border-neon-cyan/40">
                      <Zap className="h-8 w-8 text-neon-cyan animate-pulse" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-neon-cyan mb-2">Enquiry Sent Successfully!</h4>
                  <p className="text-cyan-200/80 text-sm">We'll contact you within 24 hours</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neon-magenta mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800/50 border border-neon-cyan/30 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neon-magenta mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800/50 border border-neon-cyan/30 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neon-magenta mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-neon-cyan/30 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all"
                      placeholder="+91 9876543210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neon-magenta mb-2">
                      Course Interest
                    </label>
                    <select
                      name="courseInterest"
                      value={formData.courseInterest}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-neon-cyan/30 rounded-lg text-white focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all"
                    >
                      <option value="">Select a course</option>
                      {courseOptions.map((course) => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neon-magenta mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-neon-cyan/30 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all resize-none"
                      placeholder="Tell us about your learning goals..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-neon-magenta/20 to-neon-pink/20 border-2 border-neon-magenta/50 text-neon-magenta rounded-lg font-bold hover:border-neon-magenta hover:bg-neon-magenta/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    style={{boxShadow: '0 0 20px rgba(255,0,255,0.3)'}}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-neon-magenta"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Send Enquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Minimized Widget Button - Professional Vertical Style */}
      <div className="fixed top-1/2 right-6 transform -translate-y-1/2 z-[9998]">
        <div className="relative">

          <motion.button
            onClick={toggleWidget}
            className="relative bg-gradient-to-b from-neon-magenta to-purple-600 text-white font-medium backdrop-blur-sm group shadow-lg active:scale-95 overflow-hidden"
            style={{
              boxShadow: '0 4px 20px rgba(255,0,255,0.3)',
              borderRadius: '30px',
              height: '140px',
              width: '50px',
              border: '1px solid rgba(255,255,255,0.15)'
            }}
            whileHover={{
              boxShadow: [
                '0 4px 20px rgba(255,0,255,0.3)',
                '0 8px 30px rgba(0,255,255,0.4)',
                '0 4px 20px rgba(255,0,255,0.3)'
              ],
              transition: { duration: 1.5, repeat: Infinity }
            }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Animated background overlay for hover effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-neon-cyan/20 to-neon-blue/20 opacity-0"
              style={{ borderRadius: '30px' }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />

            {/* Content with proper layout - Centered with equal padding */}
            <div className="relative flex flex-col items-center justify-between h-full py-4 px-1">
              {/* Text reading from bottom to top */}
              <div
                className="text-sm font-semibold text-white tracking-wide whitespace-nowrap flex items-center justify-center flex-1 mb-1"
                style={{
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  transform: 'rotate(180deg)'
                }}
              >
                Enquire Now
              </div>

              {/* Animated Phone Icon at bottom - Tilted horizontally */}
              <motion.div
                animate={(!hasAutoShown && shouldAnimatePhone) ? {
                  rotate: [-15, -23, -7, -23, -7, -15],
                  scale: [1, 1.05, 1, 1.05, 1]
                } : { rotate: -15 }}
                transition={{
                  duration: 0.6,
                  repeat: (!hasAutoShown && shouldAnimatePhone) ? Infinity : 0,
                  repeatDelay: 1.5,
                  ease: "easeInOut"
                }}
                className="flex items-center justify-center"
              >
                <Phone className="h-5 w-5 text-white" />
              </motion.div>
            </div>
          </motion.button>
        </div>

        {/* Expanded Widget Form */}
        {!isMinimized && !showAutoPopup && (
          <div
            className="absolute top-1/2 right-20 sm:right-24 md:right-28 transform -translate-y-1/2 w-72 sm:w-80 max-w-[calc(100vw-6rem)] bg-gradient-to-br from-gray-900/95 to-neon-black/95 rounded-2xl border border-neon-cyan/50 backdrop-blur-sm transition-all duration-300 scale-100 opacity-100"
            style={{
              boxShadow: '0 0 50px rgba(0,255,255,0.3), inset 0 0 30px rgba(255,0,255,0.1)'
            }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-neon-magenta/20 rounded-full border border-neon-magenta/40">
                    <Phone className="h-4 w-4 text-neon-magenta" />
                  </div>
                  <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-magenta to-neon-cyan">
                    Enquire Now
                  </h3>
                </div>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1 text-gray-400 hover:text-neon-magenta transition-colors rounded-full hover:bg-neon-magenta/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {showSuccess ? (
                <div className="text-center py-6">
                  <div className="mb-3">
                    <div className="mx-auto w-12 h-12 bg-neon-cyan/20 rounded-full flex items-center justify-center border border-neon-cyan/40">
                      <Zap className="h-6 w-6 text-neon-cyan animate-pulse" />
                    </div>
                  </div>
                  <h4 className="text-base font-bold text-neon-cyan mb-1">Success!</h4>
                  <p className="text-cyan-200/80 text-xs">We'll contact you soon</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-gray-800/50 border border-neon-cyan/30 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 transition-all text-sm"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-gray-800/50 border border-neon-cyan/30 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 transition-all text-sm"
                      placeholder="Email address"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-neon-cyan/30 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 transition-all text-sm"
                      placeholder="Phone number"
                    />
                  </div>
                  <div>
                    <select
                      name="courseInterest"
                      value={formData.courseInterest}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-neon-cyan/30 rounded-lg text-white focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 transition-all text-sm"
                    >
                      <option value="">Select course</option>
                      {courseOptions.map((course) => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-neon-cyan/30 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 transition-all resize-none text-sm"
                      placeholder="Your message..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2 bg-gradient-to-r from-neon-magenta/20 to-neon-pink/20 border-2 border-neon-magenta/50 text-neon-magenta rounded-lg font-bold hover:border-neon-magenta hover:bg-neon-magenta/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
                    style={{boxShadow: '0 0 15px rgba(255,0,255,0.3)'}}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-neon-magenta"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Send</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EnquiryWidget;
