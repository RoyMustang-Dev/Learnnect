"""
Learnnect AI Chatbot - Enhanced Version
Full-featured AI chatbot with all optional services
"""

import asyncio
import json
import logging
import os
from datetime import datetime
from typing import List, Dict, Any, Optional
import uuid

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn

# Import our custom modules
from knowledge_base.learnnect_knowledge import LearnnectKnowledgeBase
from groq import Groq

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Learnnect AI Chatbot API (Simplified)",
    description="AI chatbot with RAG capabilities using Groq and ChromaDB",
    version="1.0.0-simple"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://learnnect.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
knowledge_base = None
groq_client = None

# Pydantic models
class ChatMessage(BaseModel):
    message: str
    user_id: str
    session_id: str
    current_page: str = "/"
    conversation_history: Optional[List[Dict]] = None

class ChatResponse(BaseModel):
    response: str
    confidence: float
    sources: List[str]
    processing_time: float
    model_used: str
    timestamp: str

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    global knowledge_base, groq_client
    
    logger.info("🚀 Starting Learnnect AI Chatbot (Simplified)...")
    
    try:
        # Initialize knowledge base
        knowledge_base = LearnnectKnowledgeBase()
        logger.info("✅ Knowledge Base initialized")
        
        # Initialize Groq client
        groq_api_key = "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"
        groq_client = Groq(api_key=groq_api_key)
        logger.info("✅ Groq API client initialized")
        
        logger.info("🎉 Simplified chatbot ready!")
        
    except Exception as e:
        logger.error(f"❌ Startup error: {e}")
        raise

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Learnnect AI Chatbot (Simplified)",
        "version": "1.0.0-simple",
        "timestamp": datetime.now().isoformat(),
        "features": ["ChromaDB Knowledge Base", "Groq API", "RAG System"]
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    health_status = {
        "status": "healthy",
        "services": {
            "knowledge_base": knowledge_base is not None,
            "groq_client": groq_client is not None
        },
        "timestamp": datetime.now().isoformat()
    }
    
    # Check knowledge base stats
    if knowledge_base:
        try:
            kb_stats = knowledge_base.get_knowledge_stats()
            health_status["knowledge_base_stats"] = kb_stats
        except Exception as e:
            health_status["knowledge_base_error"] = str(e)
    
    return health_status

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(message: ChatMessage):
    """Main chat endpoint using simplified RAG system"""
    
    if not knowledge_base or not groq_client:
        raise HTTPException(status_code=503, detail="Services not initialized")
    
    try:
        start_time = datetime.now()
        logger.info(f"💬 Processing chat: {message.message[:50]}...")
        
        # Step 1: Search knowledge base
        knowledge_results = knowledge_base.search_knowledge(
            query=message.message,
            n_results=3
        )
        
        # Step 2: Build context from knowledge
        context = ""
        sources = []
        for result in knowledge_results:
            context += result['content'][:300] + "...\n\n"
            sources.append(result.get('id', 'unknown'))
        
        # Step 3: Enhance query based on current page
        page_context = get_page_context(message.current_page)
        
        # Step 4: Generate response with Groq
        system_prompt = f"""You are Connect Bot, Learnnect's AI learning assistant. You're helpful, friendly, and use Gen-Z friendly language with emojis.

LEARNNECT KNOWLEDGE:
{context}

CURRENT PAGE: {message.current_page} - {page_context}

GUIDELINES:
- Use the provided knowledge to answer questions accurately
- Be enthusiastic about learning and technology
- Use emojis and modern language appropriately
- Keep responses concise but informative
- If you don't know something, say so honestly
- Always encourage learning and growth"""

        response = groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message.message}
            ],
            temperature=0.7,
            max_tokens=250
        )
        
        ai_response = response.choices[0].message.content
        processing_time = (datetime.now() - start_time).total_seconds()
        
        logger.info(f"✅ Response generated in {processing_time:.2f}s")
        
        return ChatResponse(
            response=ai_response,
            confidence=0.9,  # High confidence with Groq
            sources=sources,
            processing_time=processing_time,
            model_used="groq-llama3-8b",
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"❌ Chat processing error: {e}")
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {str(e)}")

@app.get("/knowledge-stats")
async def get_knowledge_stats():
    """Get knowledge base statistics"""
    
    if not knowledge_base:
        raise HTTPException(status_code=503, detail="Knowledge base not initialized")
    
    try:
        stats = knowledge_base.get_knowledge_stats()
        return stats
    except Exception as e:
        logger.error(f"❌ Knowledge stats error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get knowledge stats: {str(e)}")

@app.get("/search-knowledge")
async def search_knowledge_endpoint(query: str, n_results: int = 5):
    """Search knowledge base"""
    
    if not knowledge_base:
        raise HTTPException(status_code=503, detail="Knowledge base not initialized")
    
    try:
        results = knowledge_base.search_knowledge(query, n_results)
        return {"results": results, "query": query, "count": len(results)}
    except Exception as e:
        logger.error(f"❌ Knowledge search error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to search knowledge: {str(e)}")

def get_page_context(current_page: str) -> str:
    """Get context based on current page"""
    
    page_contexts = {
        "/": "homepage - main landing page with course overview",
        "/courses": "courses page - browsing available courses and programs",
        "/about": "about page - learning about Learnnect's mission and team",
        "/contact": "contact page - looking for contact information and support",
        "/auth": "authentication page - signing up or logging in"
    }
    
    return page_contexts.get(current_page, "unknown page")

@app.get("/test")
async def test_endpoint():
    """Test endpoint to verify everything is working"""
    
    try:
        # Test knowledge base
        if knowledge_base:
            kb_stats = knowledge_base.get_knowledge_stats()
            kb_test = f"✅ Knowledge base: {kb_stats['total_documents']} documents"
        else:
            kb_test = "❌ Knowledge base not available"
        
        # Test Groq API
        if groq_client:
            test_response = groq_client.chat.completions.create(
                model="llama3-8b-8192",
                messages=[
                    {"role": "user", "content": "Say hello briefly"}
                ],
                max_tokens=20
            )
            groq_test = f"✅ Groq API: {test_response.choices[0].message.content[:30]}..."
        else:
            groq_test = "❌ Groq API not available"
        
        return {
            "status": "test_complete",
            "knowledge_base": kb_test,
            "groq_api": groq_test,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        return {
            "status": "test_failed",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

if __name__ == "__main__":
    # Load environment variables
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    
    print("🚀 Starting Learnnect AI Chatbot (Simplified Version)")
    print("=" * 60)
    print("Features:")
    print("✅ ChromaDB Knowledge Base")
    print("✅ Groq API Integration") 
    print("✅ RAG System")
    print("✅ FastAPI REST API")
    print("⚠️  Redis and Ollama not required")
    print("=" * 60)
    print(f"🌐 Server will start at: http://localhost:{port}")
    print("📚 API docs at: http://localhost:8000/docs")
    print("🧪 Test endpoint: http://localhost:8000/test")
    print("=" * 60)
    
    # Run the server
    uvicorn.run(
        "main_simple:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )
