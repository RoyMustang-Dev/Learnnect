# 🚀 Learnnect Advanced AI Chatbot

A comprehensive, production-ready AI chatbot system with RAG (Retrieval-Augmented Generation), voice processing, multimodal capabilities, and workflow automation.

## 🌟 Features

### 🧠 **Advanced AI Capabilities**
- **RAG System**: ChromaDB vector database with intelligent knowledge retrieval
- **Dual LLM Support**: Ollama (local) + Groq (cloud) for optimal performance
- **Context Memory**: Redis-based conversation context and memory
- **Intent Recognition**: Smart query analysis and routing

### 🎤 **Voice Processing**
- **Speech-to-Text**: OpenAI Whisper for accurate transcription
- **Text-to-Speech**: Festival/eSpeak for natural voice synthesis
- **Language Detection**: Multi-language support with auto-detection
- **Real-time Processing**: Streaming audio processing capabilities

### 📄 **Document Processing**
- **Multi-format Support**: PDF, DOCX, TXT, CSV, JSON, Excel
- **Intelligent Extraction**: Text extraction with metadata preservation
- **Auto-summarization**: Key points and summary generation
- **Knowledge Integration**: Automatic addition to knowledge base

### 🔄 **Workflow Automation**
- **n8n Integration**: Visual workflow automation and orchestration
- **Event Triggers**: Automated responses to user actions
- **Analytics Pipeline**: Data collection and processing workflows
- **Custom Workflows**: Extensible workflow templates

### 🌐 **API & Integration**
- **FastAPI Backend**: High-performance async API
- **WebSocket Support**: Real-time bidirectional communication
- **REST Endpoints**: Comprehensive API for all features
- **CORS Enabled**: Frontend integration ready

## 📋 **Technology Stack**

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Chatbot Engine** | n8n (Self-hosted) | Workflow automation and orchestration |
| **LLM** | Ollama (Local) + Groq API | Language model processing |
| **Vector Database** | ChromaDB | Knowledge storage and retrieval |
| **Memory/Context** | Redis | Session and conversation memory |
| **Speech Processing** | OpenAI Whisper | Speech-to-text conversion |
| **Text-to-Speech** | Festival/eSpeak | Voice synthesis |
| **Language Detection** | Google Translate API | Multi-language support |
| **File Processing** | Python libraries | Document analysis |
| **Database** | Firebase + Google Sheets | User data and analytics |
| **API Framework** | FastAPI | Backend API server |

## 🚀 **Quick Start**

### **Option 1: Docker Compose (Recommended)**

```bash
# Clone the repository
git clone <repository-url>
cd backend

# Create environment file
cp .env.example .env
# Edit .env with your API keys

# Start all services
docker-compose up -d

# Check service health
docker-compose ps
```

### **Option 2: Manual Installation**

```bash
# Run the installation script
chmod +x scripts/install_dependencies.sh
./scripts/install_dependencies.sh

# Activate virtual environment
source venv/bin/activate

# Start services manually
redis-server &
ollama serve &
n8n start &

# Run the chatbot
python main.py
```

## 📁 **Project Structure**

```
backend/
├── knowledge_base/           # ChromaDB knowledge management
│   └── learnnect_knowledge.py
├── rag_system/              # RAG implementation
│   └── advanced_rag.py
├── voice_processing/        # Speech processing
│   └── speech_handler.py
├── file_processing/         # Document processing
│   └── document_processor.py
├── n8n_integration/         # Workflow automation
│   └── workflow_manager.py
├── scripts/                 # Setup and utility scripts
│   └── install_dependencies.sh
├── main.py                  # FastAPI application
├── requirements.txt         # Python dependencies
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Multi-service setup
└── README.md               # This file
```

## 🔧 **Configuration**

### **Environment Variables**

Create a `.env` file with the following variables:

```env
# API Keys
GROQ_API_KEY=your_groq_api_key_here
GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key_here

# Database Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# n8n Configuration
N8N_WEBHOOK_URL=http://localhost:5678/webhook/chatbot

# Server Configuration
HOST=0.0.0.0
PORT=8000

# Model Configuration
WHISPER_MODEL=base
OLLAMA_MODEL=llama2:7b-chat
TTS_ENGINE=espeak
```

### **Service Ports**

| Service | Port | Description |
|---------|------|-------------|
| Chatbot API | 8000 | Main FastAPI application |
| n8n | 5678 | Workflow automation interface |
| Ollama | 11434 | Local LLM API |
| Redis | 6379 | Memory/context storage |
| ChromaDB | 8001 | Vector database |

## 📚 **Knowledge Base**

The system includes a comprehensive knowledge base with:

### **Course Information**
- Introduction to Data Science (FREE)
- Generative AI with Python ($99.99)
- Machine Learning Fundamentals
- Web Development Bootcamp
- AI/ML Specialization

### **Pricing & Payment Plans**
- Full payment discounts
- 3-month and 6-month payment plans
- Student discounts
- Bundle deals

### **Company Information**
- Mission and vision
- Features and benefits
- Contact information
- Support channels

### **Dynamic Updates**
The knowledge base automatically updates when website content changes, ensuring always-current information.

## 🎯 **API Endpoints**

### **Chat Endpoints**
```
POST /chat                    # Text-based chat
POST /voice-chat             # Voice message processing
POST /upload-file            # File upload and processing
GET  /search-knowledge       # Search knowledge base
```

### **WebSocket**
```
WS   /ws/{user_id}           # Real-time chat connection
```

### **Management**
```
GET  /health                 # Service health check
GET  /knowledge-stats        # Knowledge base statistics
POST /update-knowledge       # Update knowledge base
```

## 🔄 **Workflow Integration**

### **n8n Workflows**

The system includes pre-built workflows for:

1. **Chat Processing**: Log and analyze conversations
2. **Voice Processing**: Handle voice message workflows
3. **File Processing**: Process uploaded documents
4. **Analytics**: Collect and analyze usage data

### **Custom Workflows**

Create custom workflows in n8n for:
- Lead generation and follow-up
- Course enrollment automation
- Support ticket creation
- Email marketing triggers

## 🎤 **Voice Features**

### **Speech-to-Text**
- Powered by OpenAI Whisper
- Multi-language support
- High accuracy transcription
- Real-time processing

### **Text-to-Speech**
- Festival/eSpeak engines
- Multiple voice options
- Adjustable speech rate
- Emotion and tone control

### **Language Support**
- Auto-detection of spoken language
- Translation to English
- Multi-language responses
- Cultural context awareness

## 📄 **File Processing**

### **Supported Formats**
- **Documents**: PDF, DOCX, TXT
- **Spreadsheets**: CSV, Excel (XLS/XLSX)
- **Data**: JSON, XML
- **Images**: OCR text extraction (planned)

### **Processing Features**
- Text extraction and cleaning
- Metadata preservation
- Auto-summarization
- Key point extraction
- Knowledge base integration

## 🔍 **RAG System**

### **Knowledge Retrieval**
- Semantic search with embeddings
- Context-aware filtering
- Relevance scoring
- Multi-source aggregation

### **Response Generation**
- Context-enhanced prompts
- Source attribution
- Confidence scoring
- Fallback mechanisms

### **Memory Management**
- Conversation context
- User preferences
- Session persistence
- Long-term memory

## 📊 **Monitoring & Analytics**

### **Health Monitoring**
- Service health checks
- Performance metrics
- Error tracking
- Resource usage

### **Usage Analytics**
- Conversation analytics
- User behavior tracking
- Feature usage statistics
- Performance insights

## 🚀 **Deployment**

### **Production Deployment**

1. **Docker Swarm**
```bash
docker swarm init
docker stack deploy -c docker-compose.yml learnnect
```

2. **Kubernetes**
```bash
kubectl apply -f k8s/
```

3. **Cloud Deployment**
- AWS ECS/EKS
- Google Cloud Run/GKE
- Azure Container Instances/AKS

### **Scaling Considerations**
- Load balancing for API endpoints
- Redis clustering for memory
- ChromaDB sharding for knowledge
- Ollama model distribution

## 🔒 **Security**

### **API Security**
- Rate limiting
- Authentication tokens
- CORS configuration
- Input validation

### **Data Privacy**
- Local processing with Ollama
- Encrypted data storage
- GDPR compliance
- User data anonymization

## 🧪 **Testing**

```bash
# Run all tests
pytest

# Run specific test categories
pytest tests/test_rag.py
pytest tests/test_voice.py
pytest tests/test_files.py

# Run with coverage
pytest --cov=. --cov-report=html
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

- **Documentation**: [docs.learnnect.com](https://docs.learnnect.com)
- **Issues**: [GitHub Issues](https://github.com/learnnect/ai-chatbot/issues)
- **Discord**: [Learnnect Community](https://discord.gg/learnnect)
- **Email**: tech@learnnect.com

---

**Built with ❤️ by the Learnnect Team**
