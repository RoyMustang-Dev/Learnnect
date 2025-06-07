#!/usr/bin/env python3
"""
Basic Chatbot Test - Test core functionality without external services
"""

import asyncio
import os
from datetime import datetime

def print_header(text: str):
    print(f"\n{'='*60}")
    print(f"{text.center(60)}")
    print(f"{'='*60}\n")

def print_success(text: str):
    print(f"✅ {text}")

def print_error(text: str):
    print(f"❌ {text}")

def print_info(text: str):
    print(f"ℹ️  {text}")

async def test_basic_chatbot():
    """Test basic chatbot functionality"""
    
    print_header("BASIC CHATBOT TEST")
    print_info(f"Testing core functionality at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    try:
        # Test 1: Knowledge Base
        print("\n🧪 Testing Knowledge Base...")
        from knowledge_base.learnnect_knowledge import LearnnectKnowledgeBase
        
        kb = LearnnectKnowledgeBase()
        stats = kb.get_knowledge_stats()
        print_success(f"Knowledge base loaded: {stats['total_documents']} documents")
        
        # Test search
        results = kb.search_knowledge("What courses do you offer?", n_results=3)
        print_success(f"Search test: Found {len(results)} relevant results")
        
        # Test 2: Groq API
        print("\n🧪 Testing Groq API...")
        from groq import Groq
        
        api_key = "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"
        client = Groq(api_key=api_key)
        
        # Simple test call
        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Say hello in a friendly way."}
            ],
            max_tokens=50
        )
        
        ai_response = response.choices[0].message.content
        print_success(f"Groq API test: '{ai_response[:50]}...'")
        
        # Test 3: Basic RAG without Redis
        print("\n🧪 Testing Basic RAG (without Redis)...")
        
        # Simulate a simple RAG query
        user_query = "What are your course prices?"
        
        # Search knowledge base
        knowledge_results = kb.search_knowledge(user_query, n_results=3)
        
        # Build context
        context = ""
        for result in knowledge_results:
            context += result['content'][:200] + "...\n"
        
        # Generate response with Groq
        rag_response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {
                    "role": "system", 
                    "content": f"""You are Connect Bot, Learnnect's AI assistant. Use this knowledge to answer questions:

KNOWLEDGE:
{context}

Be helpful, friendly, and use Gen-Z friendly language with emojis."""
                },
                {"role": "user", "content": user_query}
            ],
            max_tokens=200
        )
        
        rag_answer = rag_response.choices[0].message.content
        print_success("RAG test successful!")
        print_info(f"Query: {user_query}")
        print_info(f"Answer: {rag_answer}")
        
        # Test 4: FastAPI imports
        print("\n🧪 Testing FastAPI components...")
        import fastapi
        import uvicorn
        print_success("FastAPI components imported successfully")
        
        print_header("TEST RESULTS")
        print_success("🎉 All core components are working!")
        print_info("✅ Knowledge base: Ready")
        print_info("✅ Groq API: Connected")
        print_info("✅ Basic RAG: Functional")
        print_info("✅ FastAPI: Ready")
        
        print("\n🚀 You can now run the chatbot with:")
        print("   python main.py")
        print("\n💡 Note: Some features require Redis and Ollama, but core functionality works!")
        
        return True
        
    except Exception as e:
        print_error(f"Test failed: {e}")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_basic_chatbot())
    if success:
        print("\n🎯 Ready to start the chatbot!")
    else:
        print("\n❌ Please fix the errors above before proceeding.")
