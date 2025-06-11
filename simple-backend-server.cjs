// Simple Backend Server for ConnectBot
// Run this with: node simple-backend-server.js

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // React and Vite dev servers
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-ID'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple AI response generator
function generateAIResponse(message, context = {}) {
  const lowerMessage = message.toLowerCase();
  
  // Context-aware responses
  if (context.currentPage === '/courses' && (lowerMessage.includes('course') || lowerMessage.includes('learn'))) {
    return "Perfect! Since you're browsing our courses, I can see you're serious about learning! We offer Data Science, Machine Learning, Web Development, and AI courses with hands-on projects and job placement assistance. Which course interests you most?";
  }
  
  if (context.currentPage === '/about' && (lowerMessage.includes('about') || lowerMessage.includes('company'))) {
    return "Great to see you're researching us! We're passionate about transforming careers through practical, industry-focused education. Our expert instructors have helped thousands transition into tech roles. What would you like to know about our approach?";
  }
  
  if (context.currentPage === '/contact' && (lowerMessage.includes('contact') || lowerMessage.includes('appointment'))) {
    return "Perfect timing! Since you're on our Contact page, let's connect! Our counselors are available Monday to Friday, 9 AM to 6 PM. Would you like me to help you book a consultation call?";
  }
  
  // Intent-based responses
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('fee')) {
    return "Let's talk about investment in your future! Our courses are competitively priced with flexible payment options. We offer early bird discounts, installment plans, and scholarship opportunities. Want me to connect you with our admissions team for detailed pricing?";
  }
  
  if (lowerMessage.includes('course') || lowerMessage.includes('learn')) {
    return "Excellent! You're ready to level up your skills! We offer comprehensive programs in Data Science, Machine Learning, Web Development, and AI. Each course includes hands-on projects, expert mentorship, and job placement assistance. Which area interests you most?";
  }
  
  if (lowerMessage.includes('appointment') || lowerMessage.includes('book') || lowerMessage.includes('schedule')) {
    return "I'd be thrilled to help you book an appointment! Our counselors are available Monday to Friday, 9 AM to 6 PM. You can schedule a free consultation to discuss your learning goals. Ready to book your spot?";
  }
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    const pageContext = context.pageTitle ? ` I see you're on the ${context.pageTitle} - great choice!` : '';
    return `Hello! Welcome to Learnnect!${pageContext} I'm ConnectBot, your AI learning assistant. I'm here to help you explore our courses, pricing, and answer any questions about your learning journey. What can I help you with today?`;
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
    return "I'm here to help! I can assist you with course information, pricing details, scheduling appointments, and answering questions about our learning platform. What specific area can I help you with?";
  }
  
  // Default response
  return "Thanks for reaching out! I'm ConnectBot, your AI learning assistant. I'm here to help you with courses, pricing, bookings, and any questions about Learnnect. What can I help you with today?";
}

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ConnectBot Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// Main chat endpoint
app.post('/chat', (req, res) => {
  try {
    const { message, user_id, session_id, context, conversation_history } = req.body;
    
    console.log('📨 Received chat request:', {
      message,
      user_id,
      session_id,
      currentPage: context?.currentPage
    });
    
    // Simulate AI processing delay
    setTimeout(() => {
      const response = generateAIResponse(message, context);
      
      res.json({
        response: response,
        language: 'en',
        intent: detectIntent(message),
        actions: [],
        context: {
          session_id,
          timestamp: new Date().toISOString()
        }
      });
    }, 500 + Math.random() * 1000); // Random delay 500-1500ms
    
  } catch (error) {
    console.error('Error in /chat:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Sorry, I encountered an error processing your request.'
    });
  }
});

// Voice chat endpoint
app.post('/voice-chat', (req, res) => {
  try {
    console.log('🎤 Received voice chat request');
    
    // In a real implementation, you'd process the audio file here
    res.json({
      transcription: 'Voice message received',
      response: 'I received your voice message! However, voice processing is not fully implemented yet. Please type your message for now.',
      language: 'en',
      audio_url: null
    });
  } catch (error) {
    console.error('Error in /voice-chat:', error);
    res.status(500).json({
      error: 'Voice processing error',
      message: 'Sorry, I couldn\'t process your voice message.'
    });
  }
});

// File upload endpoint
app.post('/upload-file', (req, res) => {
  try {
    console.log('📁 Received file upload request');
    
    // In a real implementation, you'd save the file and process it
    res.json({
      message: 'File uploaded successfully!',
      file_id: 'file_' + Date.now(),
      file_url: '/uploads/placeholder.pdf'
    });
  } catch (error) {
    console.error('Error in /upload-file:', error);
    res.status(500).json({
      error: 'File upload error',
      message: 'Sorry, I couldn\'t upload your file.'
    });
  }
});

// Text-to-speech endpoint
app.post('/text-to-speech', (req, res) => {
  try {
    const { text, language } = req.body;
    console.log('🔊 Received TTS request for:', text.substring(0, 50) + '...');
    
    // In a real implementation, you'd generate audio here
    res.json({
      audio_url: '/audio/placeholder.mp3',
      language: language || 'en'
    });
  } catch (error) {
    console.error('Error in /text-to-speech:', error);
    res.status(500).json({
      error: 'TTS error',
      message: 'Sorry, I couldn\'t generate audio.'
    });
  }
});

// Helper function to detect intent
function detectIntent(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('price') || lowerMessage.includes('cost')) return 'pricing_inquiry';
  if (lowerMessage.includes('course') || lowerMessage.includes('learn')) return 'course_inquiry';
  if (lowerMessage.includes('appointment') || lowerMessage.includes('book')) return 'booking_request';
  if (lowerMessage.includes('help') || lowerMessage.includes('support')) return 'support_request';
  if (lowerMessage.includes('about') || lowerMessage.includes('company')) return 'company_inquiry';
  
  return 'general_inquiry';
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ConnectBot Backend Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`💬 Chat endpoint: http://localhost:${PORT}/chat`);
  console.log(`🎤 Voice endpoint: http://localhost:${PORT}/voice-chat`);
  console.log(`📁 Upload endpoint: http://localhost:${PORT}/upload-file`);
  console.log(`🔊 TTS endpoint: http://localhost:${PORT}/text-to-speech`);
});

module.exports = app;
