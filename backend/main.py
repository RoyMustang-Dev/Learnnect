"""
Learnnect Advanced AI Chatbot Backend
FastAPI server with RAG system, voice processing, and n8n integration
"""

import asyncio
import json
import logging
import os
from datetime import datetime
from typing import List, Dict, Any, Optional
import uuid

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn

# Import our custom modules
from rag_system.advanced_rag import AdvancedRAGSystem
from voice_processing.speech_handler import SpeechHandler
from file_processing.document_processor import DocumentProcessor
from n8n_integration.workflow_manager import WorkflowManager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Learnnect AI Chatbot API",
    description="Advanced AI chatbot with RAG, voice processing, and multimodal capabilities",
    version="1.0.0"
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
rag_system = None
speech_handler = None
document_processor = None
workflow_manager = None

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

class VoiceMessage(BaseModel):
    audio_data: str  # Base64 encoded audio
    user_id: str
    session_id: str
    current_page: str = "/"

class FileUploadRequest(BaseModel):
    user_id: str
    session_id: str
    file_type: str

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.user_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections.append(websocket)
        self.user_connections[user_id] = websocket
        logger.info(f"🔌 WebSocket connected: {user_id}")

    def disconnect(self, websocket: WebSocket, user_id: str):
        self.active_connections.remove(websocket)
        if user_id in self.user_connections:
            del self.user_connections[user_id]
        logger.info(f"🔌 WebSocket disconnected: {user_id}")

    async def send_personal_message(self, message: str, user_id: str):
        if user_id in self.user_connections:
            await self.user_connections[user_id].send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    global rag_system, speech_handler, document_processor, workflow_manager
    
    logger.info("🚀 Starting Learnnect AI Chatbot Backend...")
    
    try:
        # Initialize RAG system
        groq_api_key = os.getenv("GROQ_API_KEY")
        rag_system = AdvancedRAGSystem(groq_api_key=groq_api_key)
        logger.info("✅ RAG System initialized")
        
        # Initialize speech handler
        speech_handler = SpeechHandler()
        logger.info("✅ Speech Handler initialized")
        
        # Initialize document processor
        document_processor = DocumentProcessor()
        logger.info("✅ Document Processor initialized")
        
        # Initialize n8n workflow manager
        n8n_webhook_url = os.getenv("N8N_WEBHOOK_URL", "http://localhost:5678/webhook/chatbot")
        workflow_manager = WorkflowManager(webhook_url=n8n_webhook_url)
        logger.info("✅ Workflow Manager initialized")
        
        logger.info("🎉 All services initialized successfully!")
        
    except Exception as e:
        logger.error(f"❌ Startup error: {e}")
        raise

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Learnnect AI Chatbot",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    health_status = {
        "status": "healthy",
        "services": {
            "rag_system": rag_system is not None,
            "speech_handler": speech_handler is not None,
            "document_processor": document_processor is not None,
            "workflow_manager": workflow_manager is not None
        },
        "timestamp": datetime.now().isoformat()
    }
    
    # Check knowledge base stats
    if rag_system:
        try:
            kb_stats = rag_system.knowledge_base.get_knowledge_stats()
            health_status["knowledge_base"] = kb_stats
        except Exception as e:
            health_status["knowledge_base"] = {"error": str(e)}
    
    return health_status

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(message: ChatMessage):
    """Main chat endpoint using RAG system"""
    
    if not rag_system:
        raise HTTPException(status_code=503, detail="RAG system not initialized")
    
    try:
        logger.info(f"💬 Processing chat: {message.message[:50]}...")
        
        # Process with RAG system
        result = await rag_system.process_query(
            user_query=message.message,
            user_id=message.user_id,
            session_id=message.session_id,
            current_page=message.current_page,
            conversation_history=message.conversation_history
        )
        
        # Send to n8n workflow if available
        if workflow_manager:
            try:
                await workflow_manager.trigger_workflow({
                    "type": "chat_message",
                    "user_id": message.user_id,
                    "session_id": message.session_id,
                    "message": message.message,
                    "response": result["response"],
                    "confidence": result["confidence"]
                })
            except Exception as e:
                logger.warning(f"⚠️ n8n workflow trigger failed: {e}")
        
        return ChatResponse(
            response=result["response"],
            confidence=result["confidence"],
            sources=result["sources"],
            processing_time=result["processing_time"],
            model_used=result["model_used"],
            timestamp=result["timestamp"]
        )
        
    except Exception as e:
        logger.error(f"❌ Chat processing error: {e}")
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {str(e)}")

@app.post("/voice-chat")
async def voice_chat_endpoint(voice_message: VoiceMessage):
    """Voice chat endpoint with speech-to-text and text-to-speech"""
    
    if not speech_handler or not rag_system:
        raise HTTPException(status_code=503, detail="Speech services not initialized")
    
    try:
        logger.info("🎤 Processing voice message...")
        
        # Convert speech to text
        transcribed_text = await speech_handler.speech_to_text(voice_message.audio_data)
        
        if not transcribed_text:
            raise HTTPException(status_code=400, detail="Could not transcribe audio")
        
        logger.info(f"📝 Transcribed: {transcribed_text}")
        
        # Process with RAG system
        result = await rag_system.process_query(
            user_query=transcribed_text,
            user_id=voice_message.user_id,
            session_id=voice_message.session_id,
            current_page=voice_message.current_page
        )
        
        # Convert response to speech
        audio_response = await speech_handler.text_to_speech(result["response"])
        
        return {
            "transcribed_text": transcribed_text,
            "response_text": result["response"],
            "audio_response": audio_response,  # Base64 encoded audio
            "confidence": result["confidence"],
            "processing_time": result["processing_time"],
            "model_used": result["model_used"]
        }
        
    except Exception as e:
        logger.error(f"❌ Voice processing error: {e}")
        raise HTTPException(status_code=500, detail=f"Voice processing failed: {str(e)}")

@app.post("/upload-file")
async def upload_file_endpoint(file: UploadFile = File(...), user_id: str = "", session_id: str = ""):
    """File upload and processing endpoint"""
    
    if not document_processor or not rag_system:
        raise HTTPException(status_code=503, detail="File processing services not initialized")
    
    try:
        logger.info(f"📄 Processing file upload: {file.filename}")
        
        # Read file content
        file_content = await file.read()
        
        # Process document
        processed_doc = await document_processor.process_document(
            file_content=file_content,
            filename=file.filename,
            content_type=file.content_type
        )
        
        # Add to knowledge base
        doc_id = f"user_upload_{user_id}_{uuid.uuid4()}"
        rag_system.knowledge_base.add_document(
            content=processed_doc["extracted_text"],
            metadata={
                "source": "user_upload",
                "user_id": user_id,
                "session_id": session_id,
                "filename": file.filename,
                "type": processed_doc["document_type"],
                "upload_timestamp": datetime.now().isoformat()
            },
            doc_id=doc_id
        )
        
        return {
            "success": True,
            "document_id": doc_id,
            "filename": file.filename,
            "document_type": processed_doc["document_type"],
            "extracted_text_length": len(processed_doc["extracted_text"]),
            "summary": processed_doc.get("summary", ""),
            "key_points": processed_doc.get("key_points", []),
            "processing_time": processed_doc["processing_time"]
        }
        
    except Exception as e:
        logger.error(f"❌ File processing error: {e}")
        raise HTTPException(status_code=500, detail=f"File processing failed: {str(e)}")

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    """WebSocket endpoint for real-time chat"""
    
    await manager.connect(websocket, user_id)
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Process with RAG system
            if rag_system:
                result = await rag_system.process_query(
                    user_query=message_data["message"],
                    user_id=user_id,
                    session_id=message_data.get("session_id", "ws_session"),
                    current_page=message_data.get("current_page", "/")
                )
                
                # Send response back
                response = {
                    "type": "chat_response",
                    "response": result["response"],
                    "confidence": result["confidence"],
                    "sources": result["sources"],
                    "model_used": result["model_used"],
                    "timestamp": result["timestamp"]
                }
                
                await manager.send_personal_message(json.dumps(response), user_id)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
    except Exception as e:
        logger.error(f"❌ WebSocket error: {e}")
        manager.disconnect(websocket, user_id)

@app.get("/knowledge-stats")
async def get_knowledge_stats():
    """Get knowledge base statistics"""
    
    if not rag_system:
        raise HTTPException(status_code=503, detail="RAG system not initialized")
    
    try:
        stats = rag_system.knowledge_base.get_knowledge_stats()
        return stats
    except Exception as e:
        logger.error(f"❌ Knowledge stats error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get knowledge stats: {str(e)}")

@app.post("/update-knowledge")
async def update_knowledge_endpoint(doc_id: str, content: str, metadata: Dict[str, Any]):
    """Update knowledge base document"""
    
    if not rag_system:
        raise HTTPException(status_code=503, detail="RAG system not initialized")
    
    try:
        rag_system.knowledge_base.update_knowledge(doc_id, content, metadata)
        return {"success": True, "message": f"Document {doc_id} updated successfully"}
    except Exception as e:
        logger.error(f"❌ Knowledge update error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to update knowledge: {str(e)}")

@app.get("/search-knowledge")
async def search_knowledge_endpoint(query: str, n_results: int = 5):
    """Search knowledge base"""
    
    if not rag_system:
        raise HTTPException(status_code=503, detail="RAG system not initialized")
    
    try:
        results = rag_system.knowledge_base.search_knowledge(query, n_results)
        return {"results": results, "query": query, "count": len(results)}
    except Exception as e:
        logger.error(f"❌ Knowledge search error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to search knowledge: {str(e)}")

if __name__ == "__main__":
    # Load environment variables
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    
    # Run the server
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )
