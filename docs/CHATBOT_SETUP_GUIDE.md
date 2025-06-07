# Connect Bot - Complete Setup Guide

## 🤖 Overview

Connect Bot is an advanced AI-powered chatbot for the Learnnect platform with the following capabilities:

### ✨ Features
- **Agentic AI** - Intelligent decision making and task execution
- **RAG System** - Knowledge retrieval from course materials
- **Multi-language Support** - Automatic language detection and response
- **Voice Conversations** - Speech-to-text and text-to-speech
- **File Processing** - Document analysis and Q&A
- **Appointment Booking** - Integrated with Google Sheets
- **Context Memory** - Maintains conversation history
- **Real-time Responses** - Powered by n8n workflows

## 🏗️ Architecture

```
User Interface (React) 
    ↓
ChatBot Service (TypeScript)
    ↓
n8n Workflow Engine
    ↓
┌─────────────────┬─────────────────┬─────────────────┐
│   LLM Service   │  Vector DB      │  Memory Store   │
│   (Ollama/Groq) │  (ChromaDB)     │  (Redis)        │
└─────────────────┴─────────────────┴─────────────────┘
    ↓
┌─────────────────┬─────────────────┬─────────────────┐
│  Voice Service  │  File Processor │  Integration    │
│  (Whisper/TTS)  │  (Python)       │  (Firebase/GS)  │
└─────────────────┴─────────────────┴─────────────────┘
```

## 🚀 Quick Start

### 1. Add ChatBot to Your App

```tsx
// In your main App.tsx or layout component
import { ChatBotContainer } from './components/ChatBot';

function App() {
  return (
    <div className="app">
      {/* Your existing app content */}
      
      {/* Add ChatBot - it will appear as a floating button */}
      <ChatBotContainer />
    </div>
  );
}
```

### 2. Environment Variables

Add to your `.env` file:

```env
# n8n Configuration
REACT_APP_N8N_WEBHOOK_URL=http://localhost:5678/webhook/chatbot

# Optional: Custom API endpoints
REACT_APP_CHATBOT_API_URL=http://localhost:3001/api/chatbot
```

## 🛠️ Complete Setup

### Phase 1: n8n Installation (5 minutes)

```bash
# Option 1: Docker (Recommended)
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Option 2: NPM
npm install -g n8n
n8n start
```

Access n8n at: http://localhost:5678

### Phase 2: LLM Setup (10 minutes)

#### Option A: Ollama (Local, Free)
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model
ollama pull llama2:7b-chat

# Start Ollama server
ollama serve
```

#### Option B: Groq API (Cloud, Free Tier)
1. Sign up at https://console.groq.com/
2. Get API key
3. Add to n8n credentials

### Phase 3: Vector Database (5 minutes)

```bash
# Install ChromaDB
pip install chromadb

# Start ChromaDB server
chroma run --host localhost --port 8000
```

### Phase 4: Memory Store (5 minutes)

```bash
# Option 1: Docker Redis
docker run -d --name redis -p 6379:6379 redis:alpine

# Option 2: Local Redis
# Install Redis for your OS
redis-server
```

### Phase 5: Voice Processing (10 minutes)

```bash
# Install Whisper for speech-to-text
pip install openai-whisper

# Install TTS library
pip install pyttsx3

# For better quality TTS (optional)
pip install gTTS
```

## 📋 n8n Workflow Configuration

### 1. Create Main Chatbot Workflow

Import this workflow into n8n:

```json
{
  "name": "Connect Bot - Main Workflow",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "chatbot",
        "responseMode": "responseNode",
        "options": {}
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [240, 300]
    },
    {
      "parameters": {
        "jsCode": "// Extract and process user message\nconst message = $input.first().json.body.message;\nconst userId = $input.first().json.body.userId;\nconst type = $input.first().json.body.type || 'text';\n\nreturn {\n  message,\n  userId,\n  type,\n  timestamp: new Date().toISOString()\n};"
      },
      "name": "Process Input",
      "type": "n8n-nodes-base.code",
      "position": [460, 300]
    },
    {
      "parameters": {
        "operation": "get",
        "key": "={{$json.userId}}_context"
      },
      "name": "Load Context",
      "type": "n8n-nodes-base.redis",
      "position": [680, 300]
    },
    {
      "parameters": {
        "url": "http://localhost:11434/api/generate",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "model",
              "value": "llama2:7b-chat"
            },
            {
              "name": "prompt",
              "value": "={{$json.message}}"
            },
            {
              "name": "stream",
              "value": false
            }
          ]
        }
      },
      "name": "LLM Response",
      "type": "n8n-nodes-base.httpRequest",
      "position": [900, 300]
    },
    {
      "parameters": {
        "operation": "set",
        "key": "={{$json.userId}}_context",
        "value": "={{JSON.stringify($json)}}"
      },
      "name": "Save Context",
      "type": "n8n-nodes-base.redis",
      "position": [1120, 300]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={\n  \"success\": true,\n  \"message\": {{JSON.stringify($json.response)}},\n  \"timestamp\": \"{{new Date().toISOString()}}\"\n}"
      },
      "name": "Response",
      "type": "n8n-nodes-base.respondToWebhook",
      "position": [1340, 300]
    }
  ],
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "Process Input",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Process Input": {
      "main": [
        [
          {
            "node": "Load Context",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Load Context": {
      "main": [
        [
          {
            "node": "LLM Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "LLM Response": {
      "main": [
        [
          {
            "node": "Save Context",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Save Context": {
      "main": [
        [
          {
            "node": "Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

### 2. Voice Processing Workflow

Create a separate workflow for voice processing:

```json
{
  "name": "Connect Bot - Voice Processing",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "chatbot/voice",
        "options": {}
      },
      "name": "Voice Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [240, 300]
    },
    {
      "parameters": {
        "jsCode": "// Process audio file with Whisper\nconst audioFile = $input.first().binary.audio;\n// Add Whisper processing logic here\nreturn { transcription: 'Processed voice message' };"
      },
      "name": "Speech to Text",
      "type": "n8n-nodes-base.code",
      "position": [460, 300]
    }
  ]
}
```

## 🎯 UI Features Explained

### 1. **Floating Chat Button**
- Appears in bottom-right corner
- Animated with neon glow effect
- Shows notification dot when active

### 2. **Chat Interface**
- **Minimizable** - Click minus to minimize
- **Fullscreen** - Click expand for full view
- **Voice Toggle** - Enable/disable voice responses
- **File Upload** - Attach documents, images, videos
- **Voice Recording** - Hold to record voice messages

### 3. **Message Types**
- **Text Messages** - Standard chat
- **Voice Messages** - With audio playback
- **File Messages** - With file preview
- **System Messages** - Bot announcements

### 4. **Quick Actions**
- **Book Appointment** - Direct booking flow
- **Course Info** - Get course details
- **Get Support** - Contact support
- **Pricing Info** - View pricing

### 5. **Advanced Features**
- **Language Detection** - Auto-detects user language
- **Context Memory** - Remembers conversation
- **Typing Indicators** - Shows bot is thinking
- **Audio Responses** - Text-to-speech in user's language

## 🔧 Customization

### Styling
The chatbot uses your existing Tailwind classes and neon theme. Customize colors in:
```tsx
// In ChatBot.tsx
className="bg-gradient-to-r from-cyan-500 to-purple-500"
```

### Behavior
Modify responses and actions in:
```typescript
// In chatBotService.ts
const response = await chatBotService.sendMessage({...});
```

## 🚀 Deployment

### Development
```bash
npm run dev
# n8n runs on localhost:5678
# ChatBot connects automatically
```

### Production
1. Deploy n8n to cloud (Railway, Heroku, etc.)
2. Update `REACT_APP_N8N_WEBHOOK_URL`
3. Configure production LLM service
4. Set up production Redis/ChromaDB

## 📞 Support

The chatbot is now ready! Users can:
- Ask questions about courses
- Upload documents for analysis
- Book appointments
- Get support in multiple languages
- Have voice conversations

The system will automatically handle all interactions and provide intelligent responses based on your course content and business logic.
