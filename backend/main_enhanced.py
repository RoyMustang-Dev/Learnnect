"""
Learnnect AI Chatbot - Enhanced Version
Full-featured AI chatbot with all optional services:
- Memory System (Redis alternative)
- Voice Processing (Whisper + gTTS)
- File Upload & Processing
- Advanced RAG System
"""

import asyncio
import json
import logging
import os
from datetime import datetime
from typing import List, Dict, Any, Optional
import uuid
import base64

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn

# Import our enhanced modules
from knowledge_base.learnnect_knowledge import LearnnectKnowledgeBase
from memory_system.conversation_memory import ConversationMemory
from voice_system.voice_processor import VoiceProcessor, initialize_voice_system
from file_system.file_processor import FileProcessor
from groq import Groq

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Learnnect AI Chatbot API (Enhanced)",
    description="Full-featured AI chatbot with RAG, memory, voice, and file processing",
    version="2.0.0-enhanced"
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
conversation_memory = None
voice_processor = None
file_processor = None
groq_client = None

# Pydantic models
class ChatMessage(BaseModel):
    message: str
    user_id: str
    session_id: str
    current_page: str = "/"
    conversation_history: Optional[List[Dict]] = None
    include_memory: bool = True

class VoiceMessage(BaseModel):
    user_id: str
    session_id: str
    current_page: str = "/"
    language: str = "en"
    include_memory: bool = True

class TextToSpeechRequest(BaseModel):
    text: str
    language: str = "en"
    slow: bool = False

class ChatResponse(BaseModel):
    response: str
    confidence: float
    sources: List[str]
    processing_time: float
    model_used: str
    timestamp: str
    session_stats: Optional[Dict] = None
    audio_response: Optional[str] = None

class VoiceResponse(BaseModel):
    transcribed_text: str
    chat_response: str
    audio_response: str
    confidence: float
    sources: List[str]
    processing_time: float
    timestamp: str

@app.on_event("startup")
async def startup_event():
    """Initialize all services on startup"""
    global knowledge_base, conversation_memory, voice_processor, file_processor, groq_client
    
    logger.info("🚀 Starting Learnnect AI Chatbot (Enhanced)...")
    
    try:
        # Initialize knowledge base
        knowledge_base = LearnnectKnowledgeBase()
        logger.info("✅ Knowledge Base initialized")
        
        # Initialize conversation memory
        conversation_memory = ConversationMemory()
        logger.info("✅ Conversation Memory initialized")
        
        # Initialize voice processor
        voice_processor = VoiceProcessor()
        await initialize_voice_system()
        logger.info("✅ Voice Processing initialized")
        
        # Initialize file processor
        file_processor = FileProcessor()
        logger.info("✅ File Processing initialized")
        
        # Initialize Groq client
        groq_api_key = "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"
        groq_client = Groq(api_key=groq_api_key)
        logger.info("✅ Groq API client initialized")
        
        logger.info("🎉 Enhanced chatbot ready with all services!")
        
    except Exception as e:
        logger.error(f"❌ Startup error: {e}")
        raise

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Learnnect AI Chatbot (Enhanced)",
        "version": "2.0.0-enhanced",
        "timestamp": datetime.now().isoformat(),
        "features": [
            "ChromaDB Knowledge Base",
            "Groq API",
            "Advanced RAG System",
            "Conversation Memory",
            "Voice Processing (Whisper + gTTS)",
            "File Upload & Processing",
            "Multi-language Support"
        ]
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    health_status = {
        "status": "healthy",
        "services": {
            "knowledge_base": knowledge_base is not None,
            "conversation_memory": conversation_memory is not None,
            "voice_processor": voice_processor is not None,
            "file_processor": file_processor is not None,
            "groq_client": groq_client is not None
        },
        "timestamp": datetime.now().isoformat()
    }
    
    # Add service-specific stats
    if knowledge_base:
        try:
            kb_stats = knowledge_base.get_knowledge_stats()
            health_status["knowledge_base_stats"] = kb_stats
        except Exception as e:
            health_status["knowledge_base_error"] = str(e)
    
    if conversation_memory:
        try:
            memory_stats = conversation_memory.get_memory_stats()
            health_status["memory_stats"] = memory_stats
        except Exception as e:
            health_status["memory_error"] = str(e)
    
    if voice_processor:
        try:
            voice_stats = voice_processor.get_voice_stats()
            health_status["voice_stats"] = voice_stats
        except Exception as e:
            health_status["voice_error"] = str(e)
    
    if file_processor:
        try:
            file_stats = file_processor.get_upload_stats()
            health_status["file_stats"] = file_stats
        except Exception as e:
            health_status["file_error"] = str(e)
    
    return health_status

@app.post("/chat", response_model=ChatResponse)
async def enhanced_chat_endpoint(message: ChatMessage):
    """Enhanced chat endpoint with memory and advanced features"""
    
    if not all([knowledge_base, conversation_memory, groq_client]):
        raise HTTPException(status_code=503, detail="Core services not initialized")
    
    try:
        start_time = datetime.now()
        logger.info(f"💬 Processing enhanced chat: {message.message[:50]}...")
        
        # Step 1: Get conversation context from memory
        conversation_context = []
        if message.include_memory:
            conversation_context = conversation_memory.get_conversation_context(
                message.user_id, message.session_id, last_n=5
            )
        
        # Step 2: Search knowledge base
        knowledge_results = knowledge_base.search_knowledge(
            query=message.message,
            n_results=3
        )
        
        # Step 3: Build enhanced context
        context = ""
        sources = []
        for result in knowledge_results:
            context += result['content'][:300] + "...\n\n"
            sources.append(result.get('id', 'unknown'))
        
        # Step 4: Get page context and user preferences
        page_context = get_page_context(message.current_page)
        user_preferences = conversation_memory.get_user_preferences(
            message.user_id, message.session_id
        )
        
        # Step 5: Build conversation messages
        messages = [
            {
                "role": "system",
                "content": f"""You are Connect Bot, Learnnect's AI learning assistant. You're helpful, friendly, and use Gen-Z friendly language with emojis.

LEARNNECT KNOWLEDGE:
{context}

CURRENT PAGE: {message.current_page} - {page_context}

USER PREFERENCES: {json.dumps(user_preferences) if user_preferences else 'None set'}

GUIDELINES:
- Use the provided knowledge to answer questions accurately
- Be enthusiastic about learning and technology
- Use emojis and modern language appropriately
- Keep responses concise but informative
- Remember previous conversation context
- If you don't know something, say so honestly
- Always encourage learning and growth"""
            }
        ]
        
        # Add conversation history
        messages.extend(conversation_context)
        
        # Add current message
        messages.append({"role": "user", "content": message.message})
        
        # Step 6: Generate response with Groq
        response = groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=messages,
            temperature=0.7,
            max_tokens=250
        )
        
        ai_response = response.choices[0].message.content
        processing_time = (datetime.now() - start_time).total_seconds()
        
        # Step 7: Store conversation in memory
        conversation_memory.add_conversation_turn(
            user_id=message.user_id,
            session_id=message.session_id,
            user_message=message.message,
            bot_response=ai_response,
            confidence=0.9,
            sources=sources,
            page_context=message.current_page,
            processing_time=processing_time
        )
        
        # Step 8: Get session stats
        session_stats = conversation_memory.get_session_stats(
            message.user_id, message.session_id
        )
        
        logger.info(f"✅ Enhanced response generated in {processing_time:.2f}s")
        
        return ChatResponse(
            response=ai_response,
            confidence=0.9,
            sources=sources,
            processing_time=processing_time,
            model_used="groq-llama3-8b-enhanced",
            timestamp=datetime.now().isoformat(),
            session_stats=session_stats
        )
        
    except Exception as e:
        logger.error(f"❌ Enhanced chat processing error: {e}")
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {str(e)}")

@app.post("/voice-chat", response_model=VoiceResponse)
async def voice_chat_endpoint(
    audio_file: UploadFile = File(...),
    user_id: str = Form(...),
    session_id: str = Form(...),
    current_page: str = Form("/"),
    language: str = Form("en"),
    include_memory: bool = Form(True)
):
    """Voice chat endpoint with speech-to-text and text-to-speech"""
    
    if not all([voice_processor, knowledge_base, conversation_memory, groq_client]):
        raise HTTPException(status_code=503, detail="Voice services not initialized")
    
    try:
        start_time = datetime.now()
        logger.info(f"🎤 Processing voice chat from user: {user_id}")
        
        # Step 1: Read audio file
        audio_content = await audio_file.read()
        
        # Step 2: Speech-to-text
        stt_result = await voice_processor.speech_to_text(
            audio_data=audio_content,
            language=language,
            audio_format=audio_file.filename.split('.')[-1] if '.' in audio_file.filename else 'wav'
        )
        
        if not stt_result['success']:
            raise HTTPException(status_code=400, detail=f"Speech recognition failed: {stt_result['error']}")
        
        transcribed_text = stt_result['text']
        logger.info(f"🎤 Transcribed: {transcribed_text[:50]}...")
        
        # Step 3: Process as regular chat
        chat_message = ChatMessage(
            message=transcribed_text,
            user_id=user_id,
            session_id=session_id,
            current_page=current_page,
            include_memory=include_memory
        )
        
        chat_response = await enhanced_chat_endpoint(chat_message)
        
        # Step 4: Text-to-speech for response
        tts_result = await voice_processor.text_to_speech(
            text=chat_response.response,
            language=language
        )
        
        if not tts_result['success']:
            logger.warning(f"TTS failed: {tts_result['error']}")
            audio_response = ""
        else:
            audio_response = tts_result['audio_data']
        
        processing_time = (datetime.now() - start_time).total_seconds()
        
        logger.info(f"✅ Voice chat processed in {processing_time:.2f}s")
        
        return VoiceResponse(
            transcribed_text=transcribed_text,
            chat_response=chat_response.response,
            audio_response=audio_response,
            confidence=chat_response.confidence,
            sources=chat_response.sources,
            processing_time=processing_time,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"❌ Voice chat error: {e}")
        raise HTTPException(status_code=500, detail=f"Voice chat failed: {str(e)}")

@app.post("/text-to-speech")
async def text_to_speech_endpoint(request: TextToSpeechRequest):
    """Convert text to speech"""

    if not voice_processor:
        raise HTTPException(status_code=503, detail="Voice processor not initialized")

    try:
        result = await voice_processor.text_to_speech(
            text=request.text,
            language=request.language,
            slow=request.slow
        )

        if result['success']:
            return {
                "success": True,
                "audio_data": result['audio_data'],
                "audio_format": result['audio_format'],
                "language": result['language']
            }
        else:
            raise HTTPException(status_code=400, detail=result['error'])

    except Exception as e:
        logger.error(f"❌ TTS error: {e}")
        raise HTTPException(status_code=500, detail=f"TTS failed: {str(e)}")

@app.post("/upload-file")
async def upload_file_endpoint(
    file: UploadFile = File(...),
    user_id: str = Form(...),
    description: str = Form(None)
):
    """Upload and process file"""

    if not file_processor:
        raise HTTPException(status_code=503, detail="File processor not initialized")

    try:
        # Read file content
        file_content = await file.read()

        # Process file
        result = await file_processor.process_uploaded_file(
            file_content=file_content,
            filename=file.filename,
            user_id=user_id,
            description=description
        )

        if result['success']:
            return {
                "success": True,
                "file_info": result['file_info'],
                "content_preview": result['content_preview']
            }
        else:
            raise HTTPException(status_code=400, detail=result['error'])

    except Exception as e:
        logger.error(f"❌ File upload error: {e}")
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

@app.get("/memory-stats/{user_id}/{session_id}")
async def get_memory_stats_endpoint(user_id: str, session_id: str):
    """Get memory statistics for a user session"""

    if not conversation_memory:
        raise HTTPException(status_code=503, detail="Memory system not initialized")

    try:
        stats = conversation_memory.get_session_stats(user_id, session_id)
        return stats
    except Exception as e:
        logger.error(f"❌ Memory stats error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get memory stats: {str(e)}")

@app.get("/supported-languages")
async def get_supported_languages():
    """Get supported languages for voice processing"""

    if not voice_processor:
        return {"languages": {}}

    try:
        languages = voice_processor.get_supported_languages()
        return {"languages": languages}
    except Exception as e:
        logger.error(f"❌ Language list error: {e}")
        return {"languages": {}, "error": str(e)}

@app.get("/file-formats")
async def get_supported_file_formats():
    """Get supported file formats"""

    if not file_processor:
        return {"formats": {}}

    try:
        formats = file_processor.get_supported_formats()
        return {"formats": formats}
    except Exception as e:
        logger.error(f"❌ File formats error: {e}")
        return {"formats": {}, "error": str(e)}

@app.get("/test-enhanced")
async def test_enhanced_endpoint():
    """Test all enhanced features"""

    try:
        results = {
            "timestamp": datetime.now().isoformat(),
            "tests": {}
        }

        # Test knowledge base
        if knowledge_base:
            kb_stats = knowledge_base.get_knowledge_stats()
            results["tests"]["knowledge_base"] = f"✅ {kb_stats['total_documents']} documents"
        else:
            results["tests"]["knowledge_base"] = "❌ Not available"

        # Test memory system
        if conversation_memory:
            memory_stats = conversation_memory.get_memory_stats()
            results["tests"]["memory_system"] = f"✅ {memory_stats['active_sessions']} active sessions"
        else:
            results["tests"]["memory_system"] = "❌ Not available"

        # Test voice processor
        if voice_processor:
            voice_stats = voice_processor.get_voice_stats()
            results["tests"]["voice_processor"] = f"✅ Whisper: {voice_stats['whisper_model_loaded']}"
        else:
            results["tests"]["voice_processor"] = "❌ Not available"

        # Test file processor
        if file_processor:
            file_stats = file_processor.get_upload_stats()
            results["tests"]["file_processor"] = f"✅ {file_stats['total_files']} files processed"
        else:
            results["tests"]["file_processor"] = "❌ Not available"

        # Test Groq API
        if groq_client:
            test_response = groq_client.chat.completions.create(
                model="llama3-8b-8192",
                messages=[
                    {"role": "user", "content": "Say hello briefly"}
                ],
                max_tokens=20
            )
            results["tests"]["groq_api"] = f"✅ {test_response.choices[0].message.content[:30]}..."
        else:
            results["tests"]["groq_api"] = "❌ Not available"

        return results

    except Exception as e:
        return {
            "timestamp": datetime.now().isoformat(),
            "status": "test_failed",
            "error": str(e)
        }

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

if __name__ == "__main__":
    # Load environment variables
    port = int(os.getenv("PORT", 8001))  # Different port to avoid conflicts
    host = os.getenv("HOST", "0.0.0.0")
    
    print("🚀 Starting Learnnect AI Chatbot (Enhanced Version)")
    print("=" * 70)
    print("Features:")
    print("✅ ChromaDB Knowledge Base")
    print("✅ Groq API Integration") 
    print("✅ Advanced RAG System")
    print("✅ Conversation Memory System")
    print("✅ Voice Processing (Whisper + gTTS)")
    print("✅ File Upload & Processing")
    print("✅ Multi-language Support")
    print("✅ FastAPI REST API")
    print("=" * 70)
    print(f"🌐 Server will start at: http://localhost:{port}")
    print("📚 API docs at: http://localhost:8001/docs")
    print("🧪 Test endpoint: http://localhost:8001/test")
    print("=" * 70)
    
    # Run the server
    uvicorn.run(
        "main_enhanced:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )
