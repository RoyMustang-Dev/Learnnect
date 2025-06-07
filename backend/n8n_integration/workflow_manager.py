"""
n8n Workflow Manager for Learnnect AI Chatbot
Handles integration with n8n for workflow automation and orchestration
"""

import asyncio
import json
import logging
from datetime import datetime
from typing import Dict, Any, List, Optional
import httpx
import uuid

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WorkflowManager:
    def __init__(self, 
                 webhook_url: str = "http://localhost:5678/webhook/chatbot",
                 api_key: Optional[str] = None,
                 timeout: int = 30):
        """Initialize n8n workflow manager"""
        
        self.webhook_url = webhook_url
        self.api_key = api_key
        self.timeout = timeout
        
        # HTTP client for async requests
        self.client = httpx.AsyncClient(timeout=timeout)
        
        logger.info(f"🔄 n8n Workflow Manager initialized: {webhook_url}")
    
    async def trigger_workflow(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Trigger n8n workflow with data"""
        
        try:
            # Add metadata
            workflow_data = {
                **data,
                "timestamp": datetime.now().isoformat(),
                "workflow_id": str(uuid.uuid4()),
                "source": "learnnect_chatbot"
            }
            
            logger.info(f"🚀 Triggering n8n workflow: {data.get('type', 'unknown')}")
            
            # Prepare headers
            headers = {"Content-Type": "application/json"}
            if self.api_key:
                headers["Authorization"] = f"Bearer {self.api_key}"
            
            # Send webhook request
            response = await self.client.post(
                self.webhook_url,
                json=workflow_data,
                headers=headers
            )
            
            response.raise_for_status()
            
            result = {
                "success": True,
                "status_code": response.status_code,
                "response": response.json() if response.content else {},
                "workflow_id": workflow_data["workflow_id"]
            }
            
            logger.info(f"✅ Workflow triggered successfully: {workflow_data['workflow_id']}")
            return result
            
        except httpx.TimeoutException:
            logger.error("⏰ n8n workflow timeout")
            return {"success": False, "error": "timeout"}
        except httpx.HTTPStatusError as e:
            logger.error(f"❌ n8n workflow HTTP error: {e.response.status_code}")
            return {"success": False, "error": f"http_error_{e.response.status_code}"}
        except Exception as e:
            logger.error(f"❌ n8n workflow error: {e}")
            return {"success": False, "error": str(e)}
    
    async def trigger_chat_workflow(self, 
                                  user_id: str,
                                  session_id: str,
                                  message: str,
                                  response: str,
                                  confidence: float,
                                  sources: List[str] = None) -> Dict[str, Any]:
        """Trigger chat-specific workflow"""
        
        data = {
            "type": "chat_message",
            "user_id": user_id,
            "session_id": session_id,
            "user_message": message,
            "bot_response": response,
            "confidence": confidence,
            "sources": sources or [],
            "metadata": {
                "message_length": len(message),
                "response_length": len(response),
                "has_sources": bool(sources)
            }
        }
        
        return await self.trigger_workflow(data)
    
    async def trigger_voice_workflow(self,
                                   user_id: str,
                                   session_id: str,
                                   transcribed_text: str,
                                   response_text: str,
                                   language: str = "en") -> Dict[str, Any]:
        """Trigger voice processing workflow"""
        
        data = {
            "type": "voice_message",
            "user_id": user_id,
            "session_id": session_id,
            "transcribed_text": transcribed_text,
            "response_text": response_text,
            "language": language,
            "metadata": {
                "transcription_length": len(transcribed_text),
                "response_length": len(response_text)
            }
        }
        
        return await self.trigger_workflow(data)
    
    async def trigger_file_workflow(self,
                                  user_id: str,
                                  session_id: str,
                                  filename: str,
                                  file_type: str,
                                  extracted_text: str,
                                  summary: str,
                                  key_points: List[str]) -> Dict[str, Any]:
        """Trigger file processing workflow"""
        
        data = {
            "type": "file_upload",
            "user_id": user_id,
            "session_id": session_id,
            "filename": filename,
            "file_type": file_type,
            "extracted_text": extracted_text[:1000],  # Truncate for workflow
            "summary": summary,
            "key_points": key_points,
            "metadata": {
                "text_length": len(extracted_text),
                "key_points_count": len(key_points)
            }
        }
        
        return await self.trigger_workflow(data)
    
    async def trigger_user_event(self,
                                user_id: str,
                                event_type: str,
                                event_data: Dict[str, Any]) -> Dict[str, Any]:
        """Trigger user event workflow"""
        
        data = {
            "type": "user_event",
            "user_id": user_id,
            "event_type": event_type,
            "event_data": event_data,
            "metadata": {
                "event_timestamp": datetime.now().isoformat()
            }
        }
        
        return await self.trigger_workflow(data)
    
    async def trigger_analytics_workflow(self,
                                       analytics_data: Dict[str, Any]) -> Dict[str, Any]:
        """Trigger analytics workflow"""
        
        data = {
            "type": "analytics",
            "analytics_data": analytics_data,
            "metadata": {
                "collection_timestamp": datetime.now().isoformat()
            }
        }
        
        return await self.trigger_workflow(data)
    
    async def get_workflow_status(self, workflow_id: str) -> Dict[str, Any]:
        """Get status of a workflow execution"""
        
        try:
            # This would require n8n API access
            # For now, return a placeholder
            return {
                "workflow_id": workflow_id,
                "status": "unknown",
                "message": "Status checking requires n8n API access"
            }
            
        except Exception as e:
            logger.error(f"❌ Workflow status error: {e}")
            return {"error": str(e)}
    
    async def create_workflow_templates(self) -> Dict[str, Any]:
        """Create n8n workflow templates for common use cases"""
        
        templates = {
            "chat_processing": {
                "name": "Learnnect Chat Processing",
                "description": "Process chat messages and responses",
                "nodes": [
                    {
                        "name": "Webhook Trigger",
                        "type": "n8n-nodes-base.webhook",
                        "parameters": {
                            "path": "chatbot",
                            "httpMethod": "POST"
                        }
                    },
                    {
                        "name": "Data Processing",
                        "type": "n8n-nodes-base.function",
                        "parameters": {
                            "functionCode": """
                            // Process chat data
                            const chatData = $json;
                            
                            // Log to console
                            console.log('Chat processed:', chatData.user_message);
                            
                            // Store in database (example)
                            return {
                                user_id: chatData.user_id,
                                message: chatData.user_message,
                                response: chatData.bot_response,
                                confidence: chatData.confidence,
                                timestamp: new Date().toISOString()
                            };
                            """
                        }
                    },
                    {
                        "name": "Store in Database",
                        "type": "n8n-nodes-base.postgres",
                        "parameters": {
                            "operation": "insert",
                            "table": "chat_logs",
                            "columns": "user_id,message,response,confidence,timestamp"
                        }
                    }
                ]
            },
            "voice_processing": {
                "name": "Learnnect Voice Processing",
                "description": "Process voice messages and transcriptions",
                "nodes": [
                    {
                        "name": "Voice Webhook",
                        "type": "n8n-nodes-base.webhook",
                        "parameters": {
                            "path": "voice",
                            "httpMethod": "POST"
                        }
                    },
                    {
                        "name": "Language Detection",
                        "type": "n8n-nodes-base.function",
                        "parameters": {
                            "functionCode": """
                            // Detect language and process
                            const voiceData = $json;
                            
                            return {
                                ...voiceData,
                                processed_at: new Date().toISOString(),
                                language_detected: voiceData.language || 'en'
                            };
                            """
                        }
                    }
                ]
            },
            "file_processing": {
                "name": "Learnnect File Processing",
                "description": "Process uploaded files and documents",
                "nodes": [
                    {
                        "name": "File Webhook",
                        "type": "n8n-nodes-base.webhook",
                        "parameters": {
                            "path": "file-upload",
                            "httpMethod": "POST"
                        }
                    },
                    {
                        "name": "File Analysis",
                        "type": "n8n-nodes-base.function",
                        "parameters": {
                            "functionCode": """
                            // Analyze uploaded file
                            const fileData = $json;
                            
                            return {
                                filename: fileData.filename,
                                type: fileData.file_type,
                                summary: fileData.summary,
                                key_points: fileData.key_points,
                                processed_at: new Date().toISOString()
                            };
                            """
                        }
                    }
                ]
            },
            "analytics": {
                "name": "Learnnect Analytics",
                "description": "Collect and process analytics data",
                "nodes": [
                    {
                        "name": "Analytics Webhook",
                        "type": "n8n-nodes-base.webhook",
                        "parameters": {
                            "path": "analytics",
                            "httpMethod": "POST"
                        }
                    },
                    {
                        "name": "Data Aggregation",
                        "type": "n8n-nodes-base.function",
                        "parameters": {
                            "functionCode": """
                            // Aggregate analytics data
                            const analyticsData = $json;
                            
                            return {
                                ...analyticsData.analytics_data,
                                aggregated_at: new Date().toISOString()
                            };
                            """
                        }
                    }
                ]
            }
        }
        
        return templates
    
    async def health_check(self) -> Dict[str, Any]:
        """Check if n8n is accessible"""
        
        try:
            # Try to ping the webhook URL
            response = await self.client.get(self.webhook_url.replace('/webhook/chatbot', '/healthz'))
            
            return {
                "status": "healthy" if response.status_code == 200 else "unhealthy",
                "status_code": response.status_code,
                "url": self.webhook_url
            }
            
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e),
                "url": self.webhook_url
            }
    
    async def close(self):
        """Close HTTP client"""
        await self.client.aclose()

# Example usage and testing
if __name__ == "__main__":
    async def test_workflow_manager():
        manager = WorkflowManager()
        
        # Test health check
        health = await manager.health_check()
        print(f"🏥 n8n Health: {health}")
        
        # Test chat workflow
        result = await manager.trigger_chat_workflow(
            user_id="test_user",
            session_id="test_session",
            message="Hello, how are you?",
            response="I'm doing great! How can I help you today?",
            confidence=0.9,
            sources=["knowledge_base"]
        )
        
        print(f"💬 Chat workflow result: {result}")
        
        # Get workflow templates
        templates = await manager.create_workflow_templates()
        print(f"📋 Available templates: {list(templates.keys())}")
        
        await manager.close()
    
    asyncio.run(test_workflow_manager())
