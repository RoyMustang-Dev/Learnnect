@echo off
REM Learnnect AI Chatbot - Windows 11 Setup Script
REM This script sets up the AI chatbot on Windows 11

echo.
echo ========================================
echo   Learnnect AI Chatbot - Windows Setup
echo ========================================
echo.

REM Check if Python is installed
echo [INFO] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found. Please install Python 3.8+ from python.org
    echo [INFO] Download from: https://www.python.org/downloads/
    pause
    exit /b 1
)

python --version
echo [SUCCESS] Python found

REM Check if we're in the right directory
if not exist "main.py" (
    echo [ERROR] main.py not found. Please run this script from the backend directory
    pause
    exit /b 1
)

echo [SUCCESS] In correct directory

REM Create virtual environment
echo.
echo [INFO] Creating Python virtual environment...
if not exist "venv" (
    python -m venv venv
    echo [SUCCESS] Virtual environment created
) else (
    echo [INFO] Virtual environment already exists
)

REM Activate virtual environment
echo [INFO] Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip
echo [INFO] Upgrading pip...
python -m pip install --upgrade pip

REM Install PyTorch (CPU version for Windows)
echo.
echo [INFO] Installing PyTorch (this may take a few minutes)...
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

REM Install other requirements
echo.
echo [INFO] Installing Python dependencies...
pip install -r requirements.txt

REM Copy .env file
echo.
echo [INFO] Setting up configuration...
if not exist ".env" (
    copy ".env.example" ".env"
    echo [SUCCESS] .env file created
) else (
    echo [INFO] .env file already exists
)

REM Create necessary directories
echo [INFO] Creating directories...
if not exist "chroma_db" mkdir chroma_db
if not exist "logs" mkdir logs
if not exist "uploads" mkdir uploads

echo [SUCCESS] Directories created

REM Download Whisper model
echo.
echo [INFO] Downloading Whisper model (this may take a few minutes)...
python -c "import whisper; whisper.load_model('base')"
echo [SUCCESS] Whisper model downloaded

echo.
echo ========================================
echo   Windows-Specific Service Setup
echo ========================================
echo.

REM Check for Redis
echo [INFO] Checking Redis...
redis-server --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Redis not found. 
    echo [INFO] For Windows, you can:
    echo [INFO] 1. Use Docker: docker run -d -p 6379:6379 redis:alpine
    echo [INFO] 2. Install Redis from: https://github.com/microsoftarchive/redis/releases
    echo [INFO] 3. Use WSL2 with Linux Redis
) else (
    echo [SUCCESS] Redis found
)

REM Check for Node.js (for n8n)
echo [INFO] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Node.js not found.
    echo [INFO] Install from: https://nodejs.org/
    echo [INFO] Then run: npm install -g n8n
) else (
    node --version
    echo [SUCCESS] Node.js found
    
    REM Check for n8n
    n8n --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo [INFO] Installing n8n...
        npm install -g n8n
    ) else (
        echo [SUCCESS] n8n found
    )
)

REM Check for Ollama
echo [INFO] Checking Ollama...
ollama --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Ollama not found.
    echo [INFO] Download from: https://ollama.ai/download/windows
    echo [INFO] After installation, run: ollama pull llama2:7b-chat
) else (
    ollama --version
    echo [SUCCESS] Ollama found
)

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.

echo [SUCCESS] Basic setup completed successfully!
echo.
echo Next steps:
echo 1. Install missing services if any (Redis, Node.js, Ollama)
echo 2. Run the test script: python test_setup.py
echo 3. Start the services (see instructions below)
echo 4. Run the chatbot: python main.py
echo.
echo Service startup commands:
echo - Redis: redis-server (or use Docker)
echo - n8n: n8n start
echo - Ollama: ollama serve
echo.
echo For detailed instructions, see README.md
echo.
pause
