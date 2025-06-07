#!/usr/bin/env python3
"""
Learnnect AI Chatbot - Windows Setup Test
Simplified test script for Windows 11 environment
"""

import asyncio
import json
import os
import sys
import time
import subprocess
from datetime import datetime
from typing import Dict, Any

def print_header(text: str):
    print(f"\n{'='*60}")
    print(f"{text.center(60)}")
    print(f"{'='*60}\n")

def print_success(text: str):
    print(f"✅ {text}")

def print_error(text: str):
    print(f"❌ {text}")

def print_warning(text: str):
    print(f"⚠️  {text}")

def print_info(text: str):
    print(f"ℹ️  {text}")

def print_test(text: str):
    print(f"🧪 Testing: {text}")

class WindowsTester:
    def __init__(self):
        self.results = {}
        self.start_time = datetime.now()
    
    async def run_tests(self):
        """Run Windows-specific tests"""
        print_header("LEARNNECT AI CHATBOT - WINDOWS 11 SETUP TEST")
        print_info(f"Started at: {self.start_time.strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Basic environment tests
        await self.test_basic_environment()
        
        # Python dependencies
        await self.test_python_dependencies()
        
        # Configuration
        await self.test_configuration()
        
        # Services (Docker or local)
        await self.test_services()
        
        # AI components
        await self.test_ai_components()
        
        # Print results
        self.print_summary()
    
    async def test_basic_environment(self):
        """Test basic Windows environment"""
        print_header("BASIC ENVIRONMENT")
        
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
            print_success("Virtual environment active")
            self.results['virtual_env'] = True
        else:
            print_warning("No virtual environment (run: venv\\Scripts\\activate)")
            self.results['virtual_env'] = False
        
        # Working directory
        print_test("Working directory")
        if os.path.exists('main.py'):
            print_success("In correct directory")
            self.results['working_dir'] = True
        else:
            print_error("main.py not found - run from backend directory")
            self.results['working_dir'] = False
        
        # .env file
        print_test(".env configuration file")
        if os.path.exists('.env'):
            print_success(".env file exists")
            self.results['env_file'] = True
        else:
            print_error(".env file missing - copy from .env.example")
            self.results['env_file'] = False
    
    async def test_python_dependencies(self):
        """Test critical Python packages"""
        print_header("PYTHON DEPENDENCIES")
        
        critical_packages = [
            'fastapi',
            'uvicorn', 
            'chromadb',
            'redis',
            'whisper',
            'groq',
            'httpx',
            'sentence_transformers'
        ]
        
        for package in critical_packages:
            print_test(f"{package}")
            try:
                __import__(package)
                print_success(f"{package} ✓")
                self.results[f'pkg_{package}'] = True
            except ImportError:
                print_error(f"{package} missing - run: pip install {package}")
                self.results[f'pkg_{package}'] = False
    
    async def test_configuration(self):
        """Test configuration"""
        print_header("CONFIGURATION")
        
        if os.path.exists('.env'):
            # Load environment variables
            with open('.env', 'r') as f:
                env_content = f.read()
            
            # Check Groq API key
            print_test("Groq API Key")
            if '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' in env_content:
                print_success("Groq API key configured")
                self.results['groq_key'] = True
            else:
                print_error("Groq API key not found in .env")
                self.results['groq_key'] = False
            
            # Check other settings
            print_test("Other configuration")
            required_settings = ['REDIS_HOST', 'PORT', 'HOST']
            for setting in required_settings:
                if setting in env_content:
                    print_success(f"{setting} configured")
                else:
                    print_warning(f"{setting} not found")
        else:
            print_error("No .env file found")
            self.results['groq_key'] = False
    
    async def test_services(self):
        """Test services (Docker or local)"""
        print_header("SERVICES")
        
        # Check if Docker is available
        print_test("Docker availability")
        try:
            result = subprocess.run(['docker', '--version'], 
                                  capture_output=True, text=True, timeout=5)
            if result.returncode == 0:
                print_success(f"Docker available: {result.stdout.strip()}")
                self.results['docker'] = True
                await self.test_docker_services()
            else:
                print_warning("Docker not available")
                self.results['docker'] = False
                await self.test_local_services()
        except:
            print_warning("Docker not found - testing local services")
            self.results['docker'] = False
            await self.test_local_services()
    
    async def test_docker_services(self):
        """Test Docker services"""
        print_info("Testing Docker services...")
        
        # Check if services are running
        services = ['learnnect-redis', 'learnnect-chromadb', 'learnnect-n8n', 'learnnect-ollama']
        
        for service in services:
            print_test(f"Docker service: {service}")
            try:
                result = subprocess.run(['docker', 'ps', '--filter', f'name={service}', '--format', 'table {{.Names}}'], 
                                      capture_output=True, text=True, timeout=5)
                if service in result.stdout:
                    print_success(f"{service} running")
                    self.results[f'docker_{service}'] = True
                else:
                    print_warning(f"{service} not running")
                    self.results[f'docker_{service}'] = False
            except:
                print_warning(f"Could not check {service}")
                self.results[f'docker_{service}'] = False
    
    async def test_local_services(self):
        """Test local services"""
        print_info("Testing local services...")
        
        # Test Redis
        print_test("Redis connection")
        try:
            import redis
            r = redis.Redis(host='localhost', port=6379, db=0, socket_timeout=2)
            r.ping()
            print_success("Redis connected")
            self.results['redis'] = True
        except:
            print_warning("Redis not accessible")
            self.results['redis'] = False
        
        # Test Ollama
        print_test("Ollama service")
        try:
            import httpx
            async with httpx.AsyncClient() as client:
                response = await client.get('http://localhost:11434/api/tags', timeout=3)
                if response.status_code == 200:
                    print_success("Ollama accessible")
                    self.results['ollama'] = True
                else:
                    print_warning("Ollama responded with error")
                    self.results['ollama'] = False
        except:
            print_warning("Ollama not accessible")
            self.results['ollama'] = False
    
    async def test_ai_components(self):
        """Test AI components"""
        print_header("AI COMPONENTS")
        
        # Test Whisper
        print_test("Whisper model")
        try:
            import whisper
            model = whisper.load_model("base")
            print_success("Whisper model loaded")
            self.results['whisper'] = True
        except Exception as e:
            print_error(f"Whisper failed: {e}")
            self.results['whisper'] = False
        
        # Test Groq API
        print_test("Groq API connection")
        try:
            from groq import Groq
            client = Groq(api_key="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")
            print_success("Groq client initialized")
            self.results['groq_client'] = True
        except Exception as e:
            print_error(f"Groq client failed: {e}")
            self.results['groq_client'] = False
        
        # Test knowledge base
        print_test("Knowledge base")
        try:
            from knowledge_base.learnnect_knowledge import LearnnectKnowledgeBase
            kb = LearnnectKnowledgeBase()
            stats = kb.get_knowledge_stats()
            print_success(f"Knowledge base: {stats['total_documents']} documents")
            self.results['knowledge_base'] = True
        except Exception as e:
            print_error(f"Knowledge base failed: {e}")
            self.results['knowledge_base'] = False
    
    def print_summary(self):
        """Print test summary"""
        print_header("TEST SUMMARY")
        
        total = len(self.results)
        passed = sum(1 for r in self.results.values() if r)
        failed = total - passed
        
        print_info(f"Total tests: {total}")
        print_success(f"Passed: {passed}")
        if failed > 0:
            print_error(f"Failed: {failed}")
        
        # Show what's working and what needs attention
        if failed > 0:
            print("\n⚠️  Issues to address:")
            for test, result in self.results.items():
                if not result:
                    print_error(f"  {test}")
        
        print_header("NEXT STEPS")
        
        if self.results.get('docker', False):
            print_info("Docker is available! Recommended approach:")
            print("1. Run: docker-compose -f docker-compose.windows.yml up -d")
            print("2. Wait for services to start (2-3 minutes)")
            print("3. Run: python main.py")
        else:
            print_info("Manual setup required:")
            if not self.results.get('redis', False):
                print("1. Install Redis or run: docker run -d -p 6379:6379 redis:alpine")
            if not self.results.get('ollama', False):
                print("2. Install Ollama from: https://ollama.ai/download/windows")
                print("3. Run: ollama serve")
                print("4. Run: ollama pull llama2:7b-chat")
            print("5. Run: python main.py")
        
        duration = (datetime.now() - self.start_time).total_seconds()
        print_info(f"Test completed in {duration:.1f} seconds")
        
        if passed >= total * 0.8:  # 80% success rate
            print_success("🚀 System is ready to run!")
        else:
            print_warning("🔧 Please fix the issues above before running")

async def main():
    tester = WindowsTester()
    await tester.run_tests()

if __name__ == "__main__":
    asyncio.run(main())
