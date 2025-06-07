#!/bin/bash

# Learnnect AI Chatbot - Dependency Installation Script
# This script installs all required dependencies for the advanced AI chatbot

set -e  # Exit on any error

echo "🚀 Installing Learnnect AI Chatbot Dependencies..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running on supported OS
check_os() {
    print_status "Checking operating system..."
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        OS="linux"
        print_success "Linux detected"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
        print_success "macOS detected"
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        OS="windows"
        print_success "Windows detected"
    else
        print_error "Unsupported operating system: $OSTYPE"
        exit 1
    fi
}

# Check Python version
check_python() {
    print_status "Checking Python version..."
    
    if command -v python3 &> /dev/null; then
        PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
        PYTHON_MAJOR=$(echo $PYTHON_VERSION | cut -d'.' -f1)
        PYTHON_MINOR=$(echo $PYTHON_VERSION | cut -d'.' -f2)
        
        if [ "$PYTHON_MAJOR" -eq 3 ] && [ "$PYTHON_MINOR" -ge 8 ]; then
            print_success "Python $PYTHON_VERSION found"
            PYTHON_CMD="python3"
        else
            print_error "Python 3.8+ required, found $PYTHON_VERSION"
            exit 1
        fi
    else
        print_error "Python 3 not found. Please install Python 3.8+"
        exit 1
    fi
}

# Install system dependencies
install_system_deps() {
    print_status "Installing system dependencies..."
    
    if [ "$OS" == "linux" ]; then
        # Ubuntu/Debian
        if command -v apt-get &> /dev/null; then
            sudo apt-get update
            sudo apt-get install -y \
                build-essential \
                python3-dev \
                python3-pip \
                python3-venv \
                ffmpeg \
                espeak \
                espeak-data \
                libespeak1 \
                libespeak-dev \
                festival \
                festvox-kallpc16k \
                redis-server \
                portaudio19-dev \
                libsndfile1 \
                git \
                curl \
                wget
        # CentOS/RHEL/Fedora
        elif command -v yum &> /dev/null; then
            sudo yum install -y \
                gcc \
                gcc-c++ \
                python3-devel \
                python3-pip \
                ffmpeg \
                espeak \
                festival \
                redis \
                portaudio-devel \
                libsndfile \
                git \
                curl \
                wget
        else
            print_warning "Unknown Linux distribution. Please install dependencies manually."
        fi
        
    elif [ "$OS" == "macos" ]; then
        # macOS with Homebrew
        if command -v brew &> /dev/null; then
            brew install \
                python@3.11 \
                ffmpeg \
                espeak \
                festival \
                redis \
                portaudio \
                libsndfile \
                git
        else
            print_error "Homebrew not found. Please install Homebrew first."
            exit 1
        fi
        
    elif [ "$OS" == "windows" ]; then
        print_warning "Windows detected. Please install dependencies manually:"
        print_warning "1. Python 3.8+ from python.org"
        print_warning "2. Git from git-scm.com"
        print_warning "3. Redis from redis.io"
        print_warning "4. FFmpeg from ffmpeg.org"
    fi
    
    print_success "System dependencies installed"
}

# Install Ollama
install_ollama() {
    print_status "Installing Ollama..."
    
    if command -v ollama &> /dev/null; then
        print_success "Ollama already installed"
    else
        if [ "$OS" == "linux" ] || [ "$OS" == "macos" ]; then
            curl -fsSL https://ollama.ai/install.sh | sh
            print_success "Ollama installed"
        else
            print_warning "Please install Ollama manually from ollama.ai"
        fi
    fi
    
    # Pull required models
    print_status "Pulling Ollama models..."
    ollama pull llama2:7b-chat || print_warning "Failed to pull llama2:7b-chat model"
    ollama pull mistral:7b || print_warning "Failed to pull mistral:7b model"
}

# Install n8n
install_n8n() {
    print_status "Installing n8n..."
    
    if command -v npm &> /dev/null; then
        npm install -g n8n
        print_success "n8n installed globally"
    else
        print_warning "npm not found. Please install Node.js and npm first."
        print_warning "Then run: npm install -g n8n"
    fi
}

# Create Python virtual environment
create_venv() {
    print_status "Creating Python virtual environment..."
    
    if [ ! -d "venv" ]; then
        $PYTHON_CMD -m venv venv
        print_success "Virtual environment created"
    else
        print_success "Virtual environment already exists"
    fi
    
    # Activate virtual environment
    source venv/bin/activate || source venv/Scripts/activate
    
    # Upgrade pip
    pip install --upgrade pip
    print_success "Virtual environment activated and pip upgraded"
}

# Install Python dependencies
install_python_deps() {
    print_status "Installing Python dependencies..."
    
    # Ensure we're in virtual environment
    if [ -z "$VIRTUAL_ENV" ]; then
        source venv/bin/activate || source venv/Scripts/activate
    fi
    
    # Install PyTorch (CPU version by default)
    pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
    
    # Install other requirements
    pip install -r requirements.txt
    
    print_success "Python dependencies installed"
}

# Setup ChromaDB
setup_chromadb() {
    print_status "Setting up ChromaDB..."
    
    # Create ChromaDB directory
    mkdir -p chroma_db
    
    # Initialize knowledge base
    $PYTHON_CMD -c "
from knowledge_base.learnnect_knowledge import LearnnectKnowledgeBase
kb = LearnnectKnowledgeBase()
print('✅ ChromaDB initialized with knowledge base')
"
    
    print_success "ChromaDB setup complete"
}

# Setup Redis
setup_redis() {
    print_status "Setting up Redis..."
    
    if [ "$OS" == "linux" ]; then
        sudo systemctl start redis-server
        sudo systemctl enable redis-server
    elif [ "$OS" == "macos" ]; then
        brew services start redis
    fi
    
    # Test Redis connection
    redis-cli ping && print_success "Redis is running" || print_warning "Redis connection failed"
}

# Create configuration files
create_config() {
    print_status "Creating configuration files..."
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        cat > .env << EOF
# Learnnect AI Chatbot Configuration

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

# Logging
LOG_LEVEL=INFO

# Model Configuration
WHISPER_MODEL=base
OLLAMA_MODEL=llama2:7b-chat
TTS_ENGINE=espeak
EOF
        print_success ".env file created"
    else
        print_success ".env file already exists"
    fi
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    if [ -z "$VIRTUAL_ENV" ]; then
        source venv/bin/activate || source venv/Scripts/activate
    fi
    
    # Run basic import tests
    $PYTHON_CMD -c "
import sys
try:
    from knowledge_base.learnnect_knowledge import LearnnectKnowledgeBase
    from rag_system.advanced_rag import AdvancedRAGSystem
    from voice_processing.speech_handler import SpeechHandler
    from file_processing.document_processor import DocumentProcessor
    from n8n_integration.workflow_manager import WorkflowManager
    print('✅ All modules imported successfully')
except ImportError as e:
    print(f'❌ Import error: {e}')
    sys.exit(1)
"
    
    print_success "Basic tests passed"
}

# Main installation function
main() {
    echo "🎯 Learnnect AI Chatbot - Advanced Setup"
    echo "========================================"
    
    check_os
    check_python
    install_system_deps
    install_ollama
    install_n8n
    create_venv
    install_python_deps
    setup_chromadb
    setup_redis
    create_config
    run_tests
    
    echo ""
    echo "🎉 Installation Complete!"
    echo "========================"
    echo ""
    echo "Next steps:"
    echo "1. Edit .env file with your API keys"
    echo "2. Start the services:"
    echo "   - Redis: redis-server"
    echo "   - n8n: n8n start"
    echo "   - Ollama: ollama serve"
    echo "3. Run the chatbot: python main.py"
    echo ""
    echo "For more information, see the README.md file."
}

# Run main function
main "$@"
