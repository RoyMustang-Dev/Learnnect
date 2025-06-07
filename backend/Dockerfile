# Learnnect AI Chatbot - Docker Configuration
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND=noninteractive

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    wget \
    git \
    ffmpeg \
    espeak \
    espeak-data \
    libespeak1 \
    libespeak-dev \
    festival \
    festvox-kallpc16k \
    portaudio19-dev \
    libsndfile1 \
    redis-server \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js for n8n
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Install n8n globally
RUN npm install -g n8n

# Install Ollama
RUN curl -fsSL https://ollama.ai/install.sh | sh

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu \
    && pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p chroma_db logs

# Download Whisper model
RUN python -c "import whisper; whisper.load_model('base')"

# Create startup script
RUN cat > start.sh << 'EOF'
#!/bin/bash

# Start Redis in background
redis-server --daemonize yes

# Start Ollama in background
ollama serve &

# Wait for Ollama to start
sleep 5

# Pull required models
ollama pull llama2:7b-chat &
ollama pull mistral:7b &

# Start n8n in background
n8n start &

# Wait for services to initialize
sleep 10

# Initialize knowledge base
python -c "
from knowledge_base.learnnect_knowledge import LearnnectKnowledgeBase
kb = LearnnectKnowledgeBase()
print('✅ Knowledge base initialized')
"

# Start the main application
python main.py
EOF

RUN chmod +x start.sh

# Expose ports
EXPOSE 8000 5678 11434 6379

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Start the application
CMD ["./start.sh"]
