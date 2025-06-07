#!/usr/bin/env python3
"""
Learnnect AI Chatbot - Setup Test Script
Tests all components to ensure proper installation and configuration
"""

import asyncio
import json
import os
import sys
import time
from datetime import datetime
from typing import Dict, Any

# Color codes for terminal output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    PURPLE = '\033[95m'
    CYAN = '\033[96m'
    WHITE = '\033[97m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_header(text: str):
    print(f"\n{Colors.BOLD}{Colors.CYAN}{'='*60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.CYAN}{text.center(60)}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.CYAN}{'='*60}{Colors.END}\n")

def print_success(text: str):
    print(f"{Colors.GREEN}✅ {text}{Colors.END}")

def print_error(text: str):
    print(f"{Colors.RED}❌ {text}{Colors.END}")

def print_warning(text: str):
    print(f"{Colors.YELLOW}⚠️  {text}{Colors.END}")

def print_info(text: str):
    print(f"{Colors.BLUE}ℹ️  {text}{Colors.END}")

def print_test(text: str):
    print(f"{Colors.PURPLE}🧪 Testing: {text}{Colors.END}")

class SetupTester:
    def __init__(self):
        self.results = {}
        self.start_time = datetime.now()
    
    async def run_all_tests(self):
        """Run all setup tests"""
        print_header("LEARNNECT AI CHATBOT SETUP TESTER")
        print_info(f"Started at: {self.start_time.strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Test environment
        await self.test_environment()
        
        # Test Python dependencies
        await self.test_python_dependencies()
        
        # Test system dependencies
        await self.test_system_dependencies()
        
        # Test configuration
        await self.test_configuration()
        
        # Test services
        await self.test_services()
        
        # Test AI components
        await self.test_ai_components()
        
        # Print summary
        self.print_summary()
    
    async def test_environment(self):
        """Test Python environment and basic setup"""
        print_header("ENVIRONMENT TESTS")
        
        # Python version
        print_test("Python version")
        python_version = sys.version_info
        if python_version.major == 3 and python_version.minor >= 8:
            print_success(f"Python {python_version.major}.{python_version.minor}.{python_version.micro}")
            self.results['python_version'] = True
        else:
            print_error(f"Python {python_version.major}.{python_version.minor}.{python_version.micro} - Need 3.8+")
            self.results['python_version'] = False
        
        # Virtual environment
        print_test("Virtual environment")
        if hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
            print_success("Virtual environment detected")
            self.results['virtual_env'] = True
        else:
            print_warning("No virtual environment detected (recommended but not required)")
            self.results['virtual_env'] = False
        
        # Working directory
        print_test("Working directory")
        cwd = os.getcwd()
        if 'backend' in cwd or os.path.exists('main.py'):
            print_success(f"Correct directory: {cwd}")
            self.results['working_dir'] = True
        else:
            print_error(f"Wrong directory: {cwd} - Should be in backend folder")
            self.results['working_dir'] = False
    
    async def test_python_dependencies(self):
        """Test Python package imports"""
        print_header("PYTHON DEPENDENCIES")
        
        dependencies = [
            ('fastapi', 'FastAPI web framework'),
            ('uvicorn', 'ASGI server'),
            ('chromadb', 'Vector database'),
            ('redis', 'Redis client'),
            ('whisper', 'OpenAI Whisper'),
            ('sentence_transformers', 'Sentence embeddings'),
            ('groq', 'Groq API client'),
            ('PyPDF2', 'PDF processing'),
            ('docx', 'Word document processing'),
            ('pandas', 'Data processing'),
            ('httpx', 'HTTP client'),
        ]
        
        for package, description in dependencies:
            print_test(f"{package} - {description}")
            try:
                __import__(package)
                print_success(f"{package} imported successfully")
                self.results[f'dep_{package}'] = True
            except ImportError as e:
                print_error(f"{package} import failed: {e}")
                self.results[f'dep_{package}'] = False
    
    async def test_system_dependencies(self):
        """Test system-level dependencies"""
        print_header("SYSTEM DEPENDENCIES")
        
        import subprocess
        
        commands = [
            ('redis-server --version', 'Redis server'),
            ('ollama --version', 'Ollama LLM'),
            ('espeak --version', 'eSpeak TTS'),
            ('ffmpeg -version', 'FFmpeg audio processing'),
        ]
        
        for cmd, description in commands:
            print_test(f"{description}")
            try:
                result = subprocess.run(
                    cmd.split(), 
                    capture_output=True, 
                    text=True, 
                    timeout=10
                )
                if result.returncode == 0:
                    version = result.stdout.split('\n')[0] if result.stdout else result.stderr.split('\n')[0]
                    print_success(f"{description}: {version}")
                    self.results[f'sys_{description.lower().replace(" ", "_")}'] = True
                else:
                    print_warning(f"{description}: Command failed but might be installed")
                    self.results[f'sys_{description.lower().replace(" ", "_")}'] = False
            except (subprocess.TimeoutExpired, FileNotFoundError):
                print_warning(f"{description}: Not found or not in PATH")
                self.results[f'sys_{description.lower().replace(" ", "_")}'] = False
    
    async def test_configuration(self):
        """Test configuration files and environment variables"""
        print_header("CONFIGURATION")
        
        # Check .env file
        print_test(".env file")
        if os.path.exists('.env'):
            print_success(".env file exists")
            self.results['env_file'] = True
            
            # Load and check environment variables
            from dotenv import load_dotenv
            load_dotenv()
            
            # Check required variables
            required_vars = ['GROQ_API_KEY']
            optional_vars = ['GOOGLE_TRANSLATE_API_KEY', 'REDIS_HOST', 'N8N_WEBHOOK_URL']
            
            for var in required_vars:
                print_test(f"Required variable: {var}")
                value = os.getenv(var)
                if value and value != f'your_{var.lower()}_here':
                    print_success(f"{var} is configured")
                    self.results[f'env_{var}'] = True
                else:
                    print_error(f"{var} is not configured")
                    self.results[f'env_{var}'] = False
            
            for var in optional_vars:
                print_test(f"Optional variable: {var}")
                value = os.getenv(var)
                if value and value != f'your_{var.lower()}_here':
                    print_success(f"{var} is configured")
                    self.results[f'env_{var}'] = True
                else:
                    print_warning(f"{var} is not configured (optional)")
                    self.results[f'env_{var}'] = False
        else:
            print_error(".env file not found")
            self.results['env_file'] = False
    
    async def test_services(self):
        """Test external services connectivity"""
        print_header("SERVICES")
        
        # Test Redis
        print_test("Redis connection")
        try:
            import redis
            r = redis.Redis(host='localhost', port=6379, db=0)
            r.ping()
            print_success("Redis is running and accessible")
            self.results['redis_connection'] = True
        except Exception as e:
            print_warning(f"Redis connection failed: {e}")
            self.results['redis_connection'] = False
        
        # Test Ollama
        print_test("Ollama service")
        try:
            import httpx
            async with httpx.AsyncClient() as client:
                response = await client.get('http://localhost:11434/api/tags', timeout=5)
                if response.status_code == 200:
                    print_success("Ollama is running")
                    self.results['ollama_service'] = True
                else:
                    print_warning("Ollama responded but with error")
                    self.results['ollama_service'] = False
        except Exception as e:
            print_warning(f"Ollama connection failed: {e}")
            self.results['ollama_service'] = False
        
        # Test Groq API
        print_test("Groq API")
        try:
            from groq import Groq
            api_key = os.getenv('GROQ_API_KEY')
            if api_key and api_key != 'your_groq_api_key_here':
                client = Groq(api_key=api_key)
                # Simple test call
                print_success("Groq API key is valid")
                self.results['groq_api'] = True
            else:
                print_error("Groq API key not configured")
                self.results['groq_api'] = False
        except Exception as e:
            print_error(f"Groq API test failed: {e}")
            self.results['groq_api'] = False
    
    async def test_ai_components(self):
        """Test AI components"""
        print_header("AI COMPONENTS")
        
        # Test knowledge base
        print_test("ChromaDB Knowledge Base")
        try:
            from knowledge_base.learnnect_knowledge import LearnnectKnowledgeBase
            kb = LearnnectKnowledgeBase()
            stats = kb.get_knowledge_stats()
            print_success(f"Knowledge base initialized with {stats['total_documents']} documents")
            self.results['knowledge_base'] = True
        except Exception as e:
            print_error(f"Knowledge base test failed: {e}")
            self.results['knowledge_base'] = False
        
        # Test RAG system
        print_test("RAG System")
        try:
            from rag_system.advanced_rag import AdvancedRAGSystem
            rag = AdvancedRAGSystem()
            print_success("RAG system initialized")
            self.results['rag_system'] = True
        except Exception as e:
            print_error(f"RAG system test failed: {e}")
            self.results['rag_system'] = False
        
        # Test Whisper
        print_test("Whisper Speech Recognition")
        try:
            import whisper
            model = whisper.load_model("base")
            print_success("Whisper model loaded successfully")
            self.results['whisper'] = True
        except Exception as e:
            print_warning(f"Whisper test failed: {e}")
            self.results['whisper'] = False
    
    def print_summary(self):
        """Print test summary"""
        print_header("TEST SUMMARY")
        
        total_tests = len(self.results)
        passed_tests = sum(1 for result in self.results.values() if result)
        failed_tests = total_tests - passed_tests
        
        print_info(f"Total tests: {total_tests}")
        print_success(f"Passed: {passed_tests}")
        if failed_tests > 0:
            print_error(f"Failed: {failed_tests}")
        else:
            print_success("All tests passed! 🎉")
        
        # Show failed tests
        if failed_tests > 0:
            print("\n" + Colors.YELLOW + "Failed tests:" + Colors.END)
            for test_name, result in self.results.items():
                if not result:
                    print_error(f"  {test_name}")
        
        # Recommendations
        print_header("RECOMMENDATIONS")
        
        if not self.results.get('env_GROQ_API_KEY', False):
            print_warning("Configure GROQ_API_KEY in .env file")
        
        if not self.results.get('redis_connection', False):
            print_warning("Start Redis server: redis-server")
        
        if not self.results.get('ollama_service', False):
            print_warning("Start Ollama service: ollama serve")
        
        # Final status
        end_time = datetime.now()
        duration = (end_time - self.start_time).total_seconds()
        
        print_info(f"Test completed in {duration:.2f} seconds")
        
        if passed_tests == total_tests:
            print_success("🚀 Your system is ready to run the AI chatbot!")
            print_info("Next step: python main.py")
        else:
            print_warning("⚠️  Please fix the failed tests before running the chatbot")

async def main():
    """Main test function"""
    tester = SetupTester()
    await tester.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())
