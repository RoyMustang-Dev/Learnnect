import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  Send,
  X,
  MapPin,
  Lightbulb,
  Clock,
  User,
  BookOpen,
  DollarSign,
  Calendar,
  HeadphonesIcon,
  Zap,
  Target,
  Rocket,
  Star,
  TrendingUp,
  Coffee,
  Brain,
  Award,
  Users,
  ChevronUp,
  Mic,
  MicOff,
  FileText,
  Volume2,
  Maximize2,
  Minimize2,
  Upload,
  Camera
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { chatBotService } from '../../services/chatBotService';
// Removed HuggingFaceAI import as we're using Groq AI backend
interface SimpleMessage {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  isStreaming?: boolean;
  isAIGenerated?: boolean;
  attachments?: FileAttachment[];
  context?: {
    page?: string;
    suggestions?: string[];
    userIntent?: string;
  };
}

interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  content?: string;
}

interface PageContext {
  path: string;
  title: string;
  description: string;
  suggestions: string[];
  keywords: string[];
}

interface SmartSuggestion {
  id: string;
  text: string;
  prompt: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'page' | 'general' | 'action';
}

const SimpleChatBot: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<SimpleMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [suggestionsManuallyHidden, setSuggestionsManuallyHidden] = useState(false);
  const [currentContext, setCurrentContext] = useState<PageContext | null>(null);

  // Enhanced AI features (always enabled)
  const [isAIProcessing, setIsAIProcessing] = useState(false);

  // Operational features
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);

  // Expand/Minimize functionality
  const [isExpanded, setIsExpanded] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);
  const shouldAutoScroll = useRef(true);
  const lastPageChangeRef = useRef<string>('');
  const pageChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Page context detection
  const getPageContext = (pathname: string): PageContext => {
    const contexts: Record<string, PageContext> = {
      '/': {
        path: '/',
        title: 'Home Page',
        description: 'Main landing page with course overview',
        suggestions: [
          'Spill the tea on your courses',
          'Why should I choose you over Netflix?',
          'What\'s the damage? (pricing)',
          'I\'m ready to level up my life!'
        ],
        keywords: ['courses', 'learning', 'education', 'skills', 'career']
      },
      '/courses': {
        path: '/courses',
        title: 'Courses Page',
        description: 'Browse all available courses',
        suggestions: [
          'Which course won\'t make me cry?',
          'Data Science vs ML - the ultimate showdown!',
          'Do I need to be a genius to start?',
          'When can I start my glow-up journey?'
        ],
        keywords: ['course', 'curriculum', 'syllabus', 'duration', 'difficulty']
      },
      '/about': {
        path: '/about',
        title: 'About Page',
        description: 'Learn about Learnnect and our mission',
        suggestions: [
          'Are your instructors actually cool?',
          'What\'s your secret sauce?',
          'How long have you been slaying?',
          'Show me the success stories!'
        ],
        keywords: ['company', 'mission', 'team', 'experience', 'methodology']
      },
      '/contact': {
        path: '/contact',
        title: 'Contact Page',
        description: 'Get in touch with our team',
        suggestions: [
          'Let\'s have a chat!',
          'When are you actually available?',
          'SOS! I need help!',
          'Can I visit your cool office?'
        ],
        keywords: ['contact', 'support', 'help', 'consultation', 'appointment']
      },
      '/auth': {
        path: '/auth',
        title: 'Authentication Page',
        description: 'Sign up or log in to your account',
        suggestions: [
          'Help me join the cool kids club!',
          'I forgot my password (again)',
          'What perks do I get?',
          'Promise you won\'t sell my data?'
        ],
        keywords: ['login', 'signup', 'account', 'password', 'security']
      },
      '/dashboard': {
        path: '/dashboard',
        title: 'Student Dashboard',
        description: 'Your personalized learning dashboard',
        suggestions: [
          'How\'s my glow-up going?',
          'What homework is haunting me?',
          'Where are my study materials hiding?',
          'Time to update my main character energy!'
        ],
        keywords: ['progress', 'assignments', 'materials', 'profile', 'dashboard']
      }
    };

    // Check for dynamic routes
    if (pathname.startsWith('/courses/')) {
      return {
        path: pathname,
        title: 'Course Details',
        description: 'Detailed information about a specific course',
        suggestions: [
          'Is this course worth the hype?',
          'What skills will I unlock?',
          'How do I secure my spot?',
          'Am I smart enough for this?'
        ],
        keywords: ['enroll', 'syllabus', 'requirements', 'instructor', 'certification']
      };
    }

    return contexts[pathname] || {
      path: pathname,
      title: 'Learnnect',
      description: 'Learnnect learning platform',
      suggestions: [
        'What\'s the tea about Learnnect?',
        'Show me the course menu!',
        'I\'m ready to start my journey!',
        'Help! I\'m lost!'
      ],
      keywords: ['help', 'courses', 'learning', 'support']
    };
  };

  // Check if user is near bottom of chat
  const isNearBottom = () => {
    if (!messagesContainerRef.current) return true;

    const container = messagesContainerRef.current;
    const threshold = 100; // pixels from bottom

    return (
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - threshold
    );
  };

  // Smart auto-scroll - only scroll if user is near bottom
  const scrollToBottom = (force = false) => {
    if (force || shouldAutoScroll.current) {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }
  };

  // Handle scroll events to detect user scrolling
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      shouldAutoScroll.current = isNearBottom();
    }
  };

  // Initialize chat only once when component mounts
  useEffect(() => {
    // Only initialize if not already initialized and messages array is empty
    if (!isInitialized.current && messages.length === 0) {
      const getInitialWelcomeMessage = () => {
        const greetings = [
          `Hey${user?.name ? ` ${user.name}` : ' there'}! 👋 I'm Connect Bot, your AI bestie for all things learning!`,
          `What's good${user?.name ? ` ${user.name}` : ''}! 🔥 Connect Bot here, ready to help you level up!`,
          `Heyy${user?.name ? ` ${user.name}` : ' bestie'}! ✨ I'm Connect Bot, your personal learning guru!`,
          `Yo${user?.name ? ` ${user.name}` : ''}! 🚀 Connect Bot at your service - let's make learning fun!`
        ];

        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        return `${randomGreeting} I'm here to help you with anything about Learnnect - courses, pricing, bookings, you name it! I'll also keep track of where you are on the site to give you the most relevant help. What can we make happen today? ✨`;
      };

      const welcomeMessage: SimpleMessage = {
        id: 'welcome',
        content: getInitialWelcomeMessage(),
        isBot: true,
        timestamp: new Date(),
        isAIGenerated: true,
        context: {
          page: 'Initial',
          suggestions: []
        }
      };

      setMessages([welcomeMessage]);
      setShowSuggestions(true);
      isInitialized.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty - initialize only once on mount

  // Fallback initialization check - ensure chatbot doesn't disappear
  useEffect(() => {
    // If component has been mounted for a while but still not initialized, force initialize
    const fallbackTimer = setTimeout(() => {
      if (!isInitialized.current && messages.length === 0) {
        console.log('🔄 Fallback initialization triggered');
        const welcomeMessage: SimpleMessage = {
          id: 'welcome-fallback',
          content: `Hey there! 👋 I'm Connect Bot, your AI bestie for all things learning! I'm here to help you with anything about Learnnect - courses, pricing, bookings, you name it! What can we make happen today? ✨`,
          isBot: true,
          timestamp: new Date(),
          isAIGenerated: true,
          context: {
            page: 'Initial',
            suggestions: []
          }
        };
        setMessages([welcomeMessage]);
        setShowSuggestions(true);
        isInitialized.current = true;
      }
    }, 1000); // Wait 1 second before fallback

    return () => clearTimeout(fallbackTimer);
  }, [messages.length]);

  // Update context when page changes (without resetting chat)
  useEffect(() => {
    const context = getPageContext(location.pathname);
    setCurrentContext(context);

    // Clear any existing timeout
    if (pageChangeTimeoutRef.current) {
      clearTimeout(pageChangeTimeoutRef.current);
    }

    // Add a subtle page change notification if chat has messages, is open, and not typing
    if (messages.length > 1 && isOpen && !isTyping && lastPageChangeRef.current !== location.pathname) {
      lastPageChangeRef.current = location.pathname;

      const pageChangeMessage: SimpleMessage = {
        id: `page-change-${Date.now()}`,
        content: getPageChangeMessage(context),
        isBot: true,
        timestamp: new Date(),
        context: {
          page: context.title,
          suggestions: context.suggestions
        }
      };

      // Add page change message after a delay, only if not typing
      pageChangeTimeoutRef.current = setTimeout(() => {
        if (!isTyping) { // Double-check bot is not typing
          setMessages(prev => [...prev, pageChangeMessage]);

          // Auto-hide suggestions if they're currently visible to avoid awkward positioning
          if (showSuggestions) {
            setShowSuggestions(false);
            setSuggestionsManuallyHidden(true);
          }

          // Only show suggestions if they weren't manually hidden AND not currently visible
          if (!suggestionsManuallyHidden && !showSuggestions) {
            setShowSuggestions(true);
          }
        }
      }, 1500); // Increased delay to avoid conflicts
    }
  }, [location.pathname, isOpen, messages.length, isTyping, suggestionsManuallyHidden, showSuggestions]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (pageChangeTimeoutRef.current) {
        clearTimeout(pageChangeTimeoutRef.current);
      }
    };
  }, []);

  // Component initialization
  useEffect(() => {
    console.log('🚀 Enhanced ChatBot with Groq AI initialized');
  }, []);

  // Creative page change messages
  const getPageChangeMessage = (context: PageContext): string => {
    const pageMessages: Record<string, string[]> = {
      'Home Page': [
        "Oh, back to the homepage! 🏠 Perfect place to explore everything we offer!",
        "Home sweet home! 🏡 Ready to dive into our course catalog?",
        "Welcome back to base! 🎯 What adventure shall we embark on?"
      ],
      'Courses Page': [
        "Ooh, course shopping time! 🛒 I love this energy! Which one's catching your eye?",
        "Course browsing mode: ACTIVATED! 🔍 Need help comparing options?",
        "Time to find your perfect match! 💕 Want me to help you choose?"
      ],
      'About Page': [
        "Getting to know us better? I'm here for the research vibes! 📚",
        "Love that you're doing your homework! 🤓 Any specific questions?",
        "Stalking our About page? Totally valid! 😄 What would you like to know?"
      ],
      'Contact Page': [
        "Ready to connect? Let's make it happen! 📞",
        "Contact mode engaged! 🚀 How can we get in touch?",
        "Time to slide into our DMs? I'm here to help! 💬"
      ],
      'Authentication Page': [
        "Account time! 👤 Need help with login or signup?",
        "Authentication station! 🔐 I can guide you through this!",
        "Ready to join the family? 🤗 Let me help you get set up!"
      ],
      'Student Dashboard': [
        "Dashboard vibes! 📊 How's your learning journey going?",
        "Back to your learning HQ! 🏢 What's on the agenda today?",
        "Time to check your progress! 📈 Need help navigating anything?"
      ]
    };

    const messages = pageMessages[context.title] || [
      "New page, new possibilities! ✨ How can I help you here?",
      "Exploring the site? I love it! 🗺️ What can I assist with?",
      "Page hopping like a pro! 🦘 What are you looking for?"
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  };

  useEffect(() => {
    // Only auto-scroll for new messages if user is near bottom
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 50);

    return () => clearTimeout(timer);
  }, [messages]);

  // Force scroll when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        shouldAutoScroll.current = true;
        scrollToBottom(true); // Force scroll when opening
      }, 100);
    }
  }, [isOpen]);

  // Generate smart suggestions based on current context
  const getSmartSuggestions = (): SmartSuggestion[] => {
    if (!currentContext) return [];

    // Page-specific icon mapping
    const getPageIcon = (index: number) => {
      const pageIcons: Record<string, React.ComponentType<{ className?: string }>[]> = {
        'Home Page': [Rocket, Star, TrendingUp, Zap],
        'Courses Page': [BookOpen, Brain, Award, Target],
        'About Page': [Users, Coffee, Star, Award],
        'Contact Page': [Calendar, Clock, HeadphonesIcon, MapPin],
        'Authentication Page': [User, Star, Award, Zap],
        'Student Dashboard': [TrendingUp, BookOpen, Award, Target],
        'Course Details': [BookOpen, Brain, Award, Rocket]
      };

      const icons = pageIcons[currentContext.title] || [Star, Rocket, Target, Zap];
      return icons[index % icons.length];
    };

    const suggestions: SmartSuggestion[] = [
      // Page-specific suggestions with dynamic icons
      ...currentContext.suggestions.map((suggestion, index) => ({
        id: `page-${index}`,
        text: suggestion,
        prompt: suggestion.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim(),
        icon: getPageIcon(index),
        category: 'page' as const
      })),

      // General suggestions with professional icons
      {
        id: 'general-1',
        text: 'Book a consultation call',
        prompt: 'I would like to book a consultation call with a counselor to discuss my learning goals',
        icon: Calendar,
        category: 'action' as const
      },
      {
        id: 'general-2',
        text: 'What\'s the investment?',
        prompt: 'What are your course fees and pricing options? Any payment plans available?',
        icon: DollarSign,
        category: 'general' as const
      },
      {
        id: 'general-3',
        text: 'Connect me with support',
        prompt: 'I need help from customer support - can someone assist me?',
        icon: HeadphonesIcon,
        category: 'action' as const
      }
    ];

    return suggestions.slice(0, 6); // Limit to 6 suggestions
  };

  // Removed getBotResponse function - now using Groq AI backend exclusively

  // Enhanced AI-powered response generation using ChatBot Service
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      setIsAIProcessing(true);
      console.log('🤖 ConnectBot: Generating response for:', userMessage);

      // Use chatBotService to send message
      const response = await chatBotService.sendMessage({
        message: userMessage,
        type: 'text',
        userId: user?.id || 'anonymous',
        context: {
          currentPage: location.pathname,
          pageTitle: currentContext?.title,
          conversationHistory: messages
            .filter(msg => !msg.isStreaming)
            .slice(-6)
            .map(msg => `${msg.isBot ? 'Bot' : 'User'}: ${msg.content}`)
        }
      });

      console.log('✅ ConnectBot: Response received:', response);

      if (response.success) {
        return response.message || 'I received your message and I\'m here to help!';
      } else {
        throw new Error(response.error || 'Service unavailable');
      }
    } catch (error) {
      console.error('❌ ConnectBot: AI processing error:', error);

      // This should not happen anymore since we're using fallback responses
      return `I apologize, but I'm experiencing some technical difficulties right now. However, I'm here to help you with anything about Learnnect - courses, pricing, bookings, and more! Could you please try rephrasing your question?`;
    } finally {
      setIsAIProcessing(false);
    }
  };

  // Streaming text effect with character-by-character animation
  const streamText = (text: string, messageId: string) => {
    const characters = text.split('');
    let currentText = '';
    let charIndex = 0;

    const streamInterval = setInterval(() => {
      if (charIndex < characters.length) {
        currentText += characters[charIndex];

        setMessages(prev => prev.map(msg =>
          msg.id === messageId
            ? { ...msg, content: currentText, isStreaming: true }
            : msg
        ));

        charIndex++;

        // Scroll more frequently for smoother experience, but only if user is near bottom
        if (charIndex % 10 === 0) { // Scroll every 10 characters
          scrollToBottom();
        }
      } else {
        // Streaming complete
        setMessages(prev => prev.map(msg =>
          msg.id === messageId
            ? { ...msg, isStreaming: false }
            : msg
        ));
        setIsTyping(false);
        clearInterval(streamInterval);
        scrollToBottom(); // Final scroll
      }
    }, 30); // Faster character-by-character streaming (30ms per character)
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SmartSuggestion) => {
    setMessage(suggestion.prompt);
    setShowSuggestions(false);
    setSuggestionsManuallyHidden(true); // Mark as manually hidden
    // Auto-send after a short delay to allow user to see the populated message
    setTimeout(() => {
      if (!isTyping) { // Only send if bot is not already responding
        sendMessage(suggestion.prompt);
      }
    }, 500);
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
    // Shift+Enter allows new line (default behavior)
  };

  const sendMessage = (customMessage?: string) => {
    const messageToSend = customMessage || message;
    if (!messageToSend.trim() || isTyping || isAIProcessing) return; // Prevent sending if bot is responding

    const userMessage: SimpleMessage = {
      id: Date.now().toString(),
      content: messageToSend,
      isBot: false,
      timestamp: new Date(),
      context: {
        page: currentContext?.title,
        userIntent: detectUserIntent(messageToSend)
      }
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);
    setShowSuggestions(false);
    setSuggestionsManuallyHidden(true); // Hide suggestions when user sends a message

    // Show typing indicator first
    setTimeout(async () => {
      const botMessageId = (Date.now() + 1).toString();

      // Use AI response if available, otherwise fallback to basic response
      const fullBotResponse = await generateAIResponse(messageToSend);

      // Add empty bot message first
      const botMessage: SimpleMessage = {
        id: botMessageId,
        content: '',
        isBot: true,
        timestamp: new Date(),
        isStreaming: true,
        isAIGenerated: true, // Always use enhanced AI
        context: {
          page: currentContext?.title
        }
      };

      setMessages(prev => [...prev, botMessage]);

      // Start streaming the text after a short delay
      setTimeout(() => {
        streamText(fullBotResponse, botMessageId);
      }, 300);

    }, Math.random() * 800 + 500); // Random delay between 500-1300ms for more natural feel
  };

  // Detect user intent for better context
  const detectUserIntent = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) return 'pricing_inquiry';
    if (lowerMessage.includes('course') || lowerMessage.includes('learn')) return 'course_inquiry';
    if (lowerMessage.includes('appointment') || lowerMessage.includes('book')) return 'booking_request';
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) return 'support_request';
    if (lowerMessage.includes('about') || lowerMessage.includes('company')) return 'company_inquiry';

    return 'general_inquiry';
  };

  // Operational feature handlers
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      try {
        // Upload file using the correct API endpoint
        const uploadResponse = await chatBotService.uploadFile(file, user?.id || 'anonymous');

        if (uploadResponse.success) {
          const attachment: FileAttachment = {
            id: uploadResponse.context?.fileId || Date.now().toString() + Math.random(),
            name: file.name,
            type: file.type,
            size: file.size
          };

          // Add file to attachments list
          setAttachments(prev => [...prev, attachment]);

          // Pre-populate message input with file reference (user can edit)
          const fileMessage = `I've uploaded "${file.name}" (${(file.size / 1024).toFixed(1)}KB). `;
          setMessage(prev => prev + fileMessage);
        } else {
          console.error('File upload failed:', uploadResponse.error);
          // Still add to local attachments for UI purposes
          const attachment: FileAttachment = {
            id: Date.now().toString() + Math.random(),
            name: file.name,
            type: file.type,
            size: file.size
          };
          setAttachments(prev => [...prev, attachment]);
          setMessage(prev => prev + `I've attached "${file.name}" (${(file.size / 1024).toFixed(1)}KB). `);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        // Fallback to local attachment
        const attachment: FileAttachment = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          type: file.type,
          size: file.size
        };
        setAttachments(prev => [...prev, attachment]);
        setMessage(prev => prev + `I've attached "${file.name}" (${(file.size / 1024).toFixed(1)}KB). `);
      }
    }

    // Reset the input
    event.target.value = '';
  };

  const handleVoiceInput = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser. Please try Chrome or Edge.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      setIsRecording(true);

      // Create speech recognition instance
      // @ts-expect-error - Browser API not fully typed
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      // @ts-expect-error - Browser API event type
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
        alert('Speech recognition error. Please try again.');
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (error) {
      setIsRecording(false);
      console.error('Speech recognition error:', error);
    }
  };

  const removeAttachment = (attachmentId: string) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };

  // Removed file upload functionality

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full shadow-lg flex items-center justify-center z-[10000] hover:shadow-xl transition-all duration-300"
      >
        <MessageCircle className="w-8 h-8 text-white" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
      </motion.button>
    );
  }

  return (
    <>
      {/* Backdrop overlay for mobile/better focus */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9999] md:hidden"
        onClick={() => setIsOpen(false)}
      />

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{
          opacity: 1,
          y: 0,
          width: isExpanded ? '50vw' : '384px',
          height: isExpanded ? 'calc(100vh - 80px)' : '500px',
          bottom: isExpanded ? '0' : '24px',
          right: isExpanded ? '0' : '24px',
          top: isExpanded ? '80px' : 'auto'
        }}
        exit={{ opacity: 0, y: 100 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.3
        }}
        className={`fixed bg-gray-900 border border-cyan-500/30 shadow-2xl z-[10000] overflow-hidden flex flex-col ${
          isExpanded ? 'rounded-none' : 'rounded-lg'
        }`}
        style={{
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 255, 255, 0.3), 0 0 60px rgba(255, 0, 255, 0.2)'
        }}
      >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gradient-to-r from-cyan-900/20 to-purple-900/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Connect Bot</h3>
            <p className="text-xs text-gray-400">AI Learning Assistant</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Expand/Minimize Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title={isExpanded ? 'Minimize' : 'Expand'}
          >
            {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 h-80"
      >
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-[85%] px-4 py-3 rounded-lg shadow-sm ${
              msg.isBot
                ? 'bg-gray-800/70 text-gray-100 border border-gray-600/50'
                : 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white'
            }`}>
              {/* ConnectBot Indicator */}
              {msg.isBot && msg.isAIGenerated && (
                <div className="flex items-center space-x-1 mb-2 text-xs">
                  <Brain className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                  <span className="text-cyan-400">ConnectBot</span>
                </div>
              )}

              <div className="text-sm leading-relaxed break-words">
                {msg.content}
                {msg.isStreaming && (
                  <span className="inline-block w-1 h-4 bg-cyan-400 ml-1 animate-pulse rounded-sm"></span>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-gray-600/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{formatTime(msg.timestamp)}</span>
                  {msg.isBot && msg.isAIGenerated && (
                    <div className="flex items-center space-x-1 text-xs text-cyan-400">
                      <span>🤗</span>
                      <span>AI</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gray-800/70 text-gray-100 border border-gray-600/50 px-4 py-3 rounded-lg shadow-sm">
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-gray-400 ml-2">Connect Bot is typing...</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Smart Suggestions */}
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 pb-2"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-gray-300">Quick suggestions for you:</span>
              </div>
              <button
                onClick={() => {
                  setShowSuggestions(false);
                  setSuggestionsManuallyHidden(true);
                }}
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {getSmartSuggestions().map((suggestion) => {
                const IconComponent = suggestion.icon;
                return (
                  <motion.button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-left p-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-cyan-500/20 rounded-lg hover:border-cyan-400/40 transition-all duration-200 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors">
                        <IconComponent className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white group-hover:text-cyan-300 transition-colors">
                          {suggestion.text}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {suggestion.category === 'page' ? `About ${currentContext?.title}` :
                           suggestion.category === 'action' ? 'Quick Action' : 'General Help'}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Page Context Indicator */}
            {currentContext && (
              <div className="mt-3 p-3 bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-cyan-500/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-cyan-300 font-medium">
                    Currently on: {currentContext.title}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {currentContext.description}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        {/* Show suggestions toggle */}
        {!showSuggestions && (
          <div className="mb-3">
            <button
              onClick={() => {
                setShowSuggestions(true);
                setSuggestionsManuallyHidden(false);
              }}
              className="flex items-center space-x-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Show suggestions</span>
            </button>
          </div>
        )}

        {/* AI Processing Indicator */}
        {isAIProcessing && (
          <div className="mb-3 flex items-center justify-center">
            <div className="flex items-center space-x-2 px-3 py-1 rounded-lg text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <div className="w-3 h-3 border border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <span>ConnectBot is thinking...</span>
            </div>
          </div>
        )}

        {/* Attachments Display */}
        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center space-x-2 bg-gray-700/50 px-3 py-1 rounded-lg text-xs">
                <FileText className="w-3 h-3 text-cyan-400" />
                <span className="text-gray-300">{attachment.name}</span>
                <button
                  onClick={() => removeAttachment(attachment.id)}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Input Area with Operational Buttons */}
        <div className="space-y-2">
          {/* Operational Buttons Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* File Upload Button */}
              <div className="relative">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all border border-transparent hover:border-cyan-500/30"
                  title="Upload documents"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </div>

              {/* Voice Input Button */}
              <button
                onClick={handleVoiceInput}
                className={`p-2 rounded-lg transition-all border ${
                  isRecording
                    ? 'text-red-400 bg-red-500/20 border-red-500/30 animate-pulse'
                    : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 border-transparent hover:border-cyan-500/30'
                }`}
                title={isRecording ? 'Recording... Click to stop' : 'Voice input'}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Image Upload Button */}
              <div className="relative">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => document.getElementById('image-upload')?.click()}
                  className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all border border-transparent hover:border-cyan-500/30"
                  title="Upload images"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Voice Output Button */}
            <button
              className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-gray-700/50 rounded-lg transition-all"
              title="Text-to-speech (Coming soon)"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Input and Send Button */}
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isRecording
                    ? "🎤 Listening..."
                    : isTyping
                      ? "Connect Bot is typing..."
                      : "Type your message (Enter to send, Shift+Enter for new line)..."
                }
                disabled={isRecording}
                rows={message.split('\n').length || 1}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed resize-none min-h-[48px] max-h-[120px] overflow-y-auto"
              />

              {/* Helpful hint for new users */}
              {!message && !isTyping && (
                <div className="absolute bottom-1 right-2 text-xs text-gray-500 pointer-events-none">
                  💡 Enter to send • Shift+Enter for new line
                </div>
              )}
            </div>

            <button
              onClick={() => sendMessage()}
              disabled={!message.trim() || isTyping || isRecording || isAIProcessing}
              className="p-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-lg hover:from-cyan-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
    </>
  );
};

export default SimpleChatBot;
