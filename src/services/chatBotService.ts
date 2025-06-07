// ChatBot Service - Handles all chatbot API interactions
interface ChatBotMessage {
  id: string;
  type: 'text' | 'voice' | 'file' | 'system';
  content: string;
  timestamp: Date;
  isBot: boolean;
  language?: string;
  audioUrl?: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
}

interface ChatBotResponse {
  success: boolean;
  message: string;
  language?: string;
  audioUrl?: string;
  intent?: string;
  actions?: string[];
  context?: any;
  error?: string;
}

interface ChatBotRequest {
  message: string;
  type: 'text' | 'voice' | 'file';
  userId: string;
  sessionId?: string;
  files?: File[];
  context?: any;
}

class ChatBotService {
  private baseURL: string;
  private n8nWebhookURL: string;
  private sessionId: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
    this.n8nWebhookURL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/chatbot';
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Send message using correct API endpoint from documentation
  async sendMessage(request: ChatBotRequest): Promise<ChatBotResponse> {
    try {
      if (import.meta.env.MODE === 'development') {
        console.log('🤖 ConnectBot: Calling enhanced AI backend:', `${this.baseURL}/chat`);
        console.log('📝 Message:', request.message);
      }

      // Convert conversation history to the format expected by enhanced backend
      let formattedHistory = null;
      if (request.context?.conversationHistory && Array.isArray(request.context.conversationHistory)) {
        formattedHistory = request.context.conversationHistory.map((msg: string) => {
          if (msg.startsWith('User: ')) {
            return { role: 'user', content: msg.replace('User: ', '') };
          } else if (msg.startsWith('Bot: ')) {
            return { role: 'assistant', content: msg.replace('Bot: ', '') };
          } else {
            // Fallback for any other format
            return { role: 'user', content: msg };
          }
        });
      }

      const requestBody = {
        message: request.message,
        user_id: request.userId || 'anonymous',
        session_id: request.sessionId || this.sessionId,
        current_page: request.context?.currentPage || '/',
        conversation_history: formattedHistory,
        include_memory: true
      };

      if (import.meta.env.MODE === 'development') {
        console.log('📤 Request body:', requestBody);
      }

      const response = await fetch(`${this.baseURL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionId,
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (import.meta.env.MODE === 'development') {
        console.log('✅ ConnectBot: Enhanced AI response received:', data);
      }

      return {
        success: true,
        message: data.response || data.message || data.answer || 'I received your message!',
        language: data.language || 'en',
        audioUrl: data.audio_url || data.audioUrl,
        intent: data.intent || data.query_type,
        actions: data.actions || data.suggested_actions || [],
        context: data.context || data.metadata
      };

    } catch (error) {
      if (import.meta.env.MODE === 'development') {
        console.error('❌ ConnectBot: Backend unavailable, using fallback response:', error);
        console.log('🔄 ConnectBot: Switching to intelligent fallback responses');
      }

      // Simulate API delay for realistic experience
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

      return this.generateFallbackResponse(request);
    }
  }

  // Fallback response generator when n8n is unavailable
  private generateFallbackResponse(request: ChatBotRequest): ChatBotResponse {
    const message = request.message.toLowerCase();
    const context = request.context;

    // Context-aware responses
    if (context?.currentPage === '/courses' && (message.includes('course') || message.includes('learn'))) {
      return {
        success: true,
        message: "Perfect! Since you're already browsing our courses, I can see you're serious about your learning journey! We offer Data Science, Machine Learning, Web Development, and AI courses with hands-on projects and job placement assistance. Which course catches your interest?",
        intent: 'course_inquiry'
      };
    }

    if (context?.currentPage === '/about' && (message.includes('about') || message.includes('company'))) {
      return {
        success: true,
        message: "Great to see you're researching us! We're passionate about transforming careers through practical, industry-focused education. Our expert instructors and comprehensive curriculum have helped thousands transition into tech roles. What would you like to know about our approach?",
        intent: 'company_inquiry'
      };
    }

    if (context?.currentPage === '/contact' && (message.includes('contact') || message.includes('appointment'))) {
      return {
        success: true,
        message: "Perfect timing! Since you're on our Contact page, let's connect! Our counselors are available Monday to Friday, 9 AM to 6 PM. Would you like me to help you book a consultation call or connect you with our support team?",
        intent: 'contact_inquiry'
      };
    }

    // Intent-based responses
    if (message.includes('price') || message.includes('cost') || message.includes('fee')) {
      return {
        success: true,
        message: "Let's talk about investment in your future! Our courses are competitively priced with flexible payment options. We offer early bird discounts, installment plans, and scholarship opportunities. The investment varies by course duration and complexity. Want me to connect you with our admissions team for detailed pricing?",
        intent: 'pricing_inquiry'
      };
    }

    if (message.includes('course') || message.includes('learn')) {
      return {
        success: true,
        message: "Excellent! You're ready to level up your skills! We offer comprehensive programs in Data Science, Machine Learning, Web Development, and AI. Each course includes hands-on projects, expert mentorship, and job placement assistance. Which area interests you most?",
        intent: 'course_inquiry'
      };
    }

    if (message.includes('appointment') || message.includes('book') || message.includes('schedule')) {
      return {
        success: true,
        message: "I'd be thrilled to help you book an appointment! Our counselors are available Monday to Friday, 9 AM to 6 PM. You can schedule a free consultation to discuss your learning goals and find the perfect course for your career path. Ready to book your spot?",
        intent: 'booking_request'
      };
    }

    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      const pageContext = context?.pageTitle ? ` I see you're on the ${context.pageTitle} - great choice!` : '';
      return {
        success: true,
        message: `Hello! Welcome to Learnnect!${pageContext} I'm ConnectBot, your AI learning assistant. I'm here to help you explore our courses, pricing, booking options, and answer any questions about your learning journey. What can I help you with today?`,
        intent: 'greeting'
      };
    }

    if (message.includes('help') || message.includes('support')) {
      return {
        success: true,
        message: "I'm here to help! I can assist you with course information, pricing details, scheduling appointments, technical support, and answering questions about our learning platform. What specific area can I help you with?",
        intent: 'support_request'
      };
    }

    // File upload responses
    if (message.includes('attached') || message.includes('uploaded') || message.includes('file')) {
      return {
        success: true,
        message: "Thanks for sharing that file! I can see you've uploaded a document. While I can't process files directly yet, I can definitely help you with any questions about our courses, pricing, or booking consultations. What would you like to know?",
        intent: 'file_upload'
      };
    }

    // Default response
    return {
      success: true,
      message: "Thanks for reaching out! I'm ConnectBot, your AI learning assistant. I'm here to help you with courses, pricing, bookings, and any questions about Learnnect. What can I help you with today?",
      intent: 'general_inquiry'
    };
  }

  // Process voice message using correct API endpoint
  async processVoiceMessage(audioBlob: Blob, userId: string): Promise<ChatBotResponse> {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice_message.wav');
      formData.append('user_id', userId);
      formData.append('session_id', this.sessionId);

      const response = await fetch(`${this.baseURL}/voice-chat`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Session-ID': this.sessionId,
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        message: data.transcription || data.response || 'Voice message processed',
        language: data.language || 'en',
        audioUrl: data.audio_url,
        intent: data.intent,
        actions: data.actions || []
      };

    } catch (error) {
      console.error('Error processing voice message:', error);
      return {
        success: false,
        message: 'Sorry, I couldn\'t process your voice message. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Upload file using correct API endpoint
  async uploadFile(file: File, userId: string): Promise<ChatBotResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', userId);
      formData.append('session_id', this.sessionId);

      const response = await fetch(`${this.baseURL}/upload-file`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Session-ID': this.sessionId,
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        message: data.message || `File "${file.name}" uploaded successfully!`,
        context: {
          fileId: data.file_id,
          fileName: file.name,
          fileUrl: data.file_url
        }
      };

    } catch (error) {
      console.error('Error uploading file:', error);
      return {
        success: false,
        message: 'Sorry, I couldn\'t upload your file. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get chat history
  async getChatHistory(userId: string, limit: number = 50): Promise<ChatBotMessage[]> {
    try {
      const response = await fetch(`${this.baseURL}/chatbot/history?userId=${userId}&limit=${limit}&sessionId=${this.sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.messages || [];

    } catch (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
  }

  // Clear chat session
  async clearSession(userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/chatbot/clear-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          sessionId: this.sessionId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Generate new session ID
      this.sessionId = this.generateSessionId();
      return true;

    } catch (error) {
      console.error('Error clearing chat session:', error);
      return false;
    }
  }

  // Book appointment through chatbot
  async bookAppointment(appointmentData: any, userId: string): Promise<ChatBotResponse> {
    try {
      const response = await fetch(`${this.n8nWebhookURL}/appointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionId,
        },
        body: JSON.stringify({
          ...appointmentData,
          userId,
          sessionId: this.sessionId,
          action: 'book_appointment'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        message: data.message || 'Appointment booking request submitted!',
        actions: ['appointment_booked'],
        context: data.appointmentDetails
      };

    } catch (error) {
      console.error('Error booking appointment:', error);
      return {
        success: false,
        message: 'Sorry, I couldn\'t book your appointment right now. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get available time slots
  async getAvailableSlots(date: string): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseURL}/chatbot/available-slots?date=${date}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.slots || [];

    } catch (error) {
      console.error('Error fetching available slots:', error);
      return [];
    }
  }

  // Submit enquiry form
  async submitEnquiry(enquiryData: any, userId: string): Promise<ChatBotResponse> {
    try {
      const response = await fetch(`${this.n8nWebhookURL}/enquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionId,
        },
        body: JSON.stringify({
          ...enquiryData,
          userId,
          sessionId: this.sessionId,
          action: 'submit_enquiry'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        message: data.message || 'Your enquiry has been submitted successfully!',
        actions: ['enquiry_submitted'],
        context: data.enquiryDetails
      };

    } catch (error) {
      console.error('Error submitting enquiry:', error);
      return {
        success: false,
        message: 'Sorry, I couldn\'t submit your enquiry right now. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Text-to-speech using correct API endpoint
  async textToSpeech(text: string, language: string = 'en'): Promise<ChatBotResponse> {
    try {
      const response = await fetch(`${this.baseURL}/text-to-speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionId,
        },
        body: JSON.stringify({
          text: text,
          language: language,
          session_id: this.sessionId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        message: 'Audio generated successfully',
        audioUrl: data.audio_url,
        language: data.language
      };

    } catch (error) {
      console.error('Error generating speech:', error);
      return {
        success: false,
        message: 'Sorry, I couldn\'t generate audio for that message.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get current session ID
  getSessionId(): string {
    return this.sessionId;
  }

  // Update session context
  async updateContext(context: any, userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/chatbot/context`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionId,
        },
        body: JSON.stringify({
          userId,
          sessionId: this.sessionId,
          context
        })
      });

      return response.ok;

    } catch (error) {
      console.error('Error updating context:', error);
      return false;
    }
  }
}

// Export singleton instance
export const chatBotService = new ChatBotService();
export default ChatBotService;
