"""
Advanced RAG (Retrieval-Augmented Generation) System for Learnnect
Combines ChromaDB knowledge base with Ollama/Groq LLMs
"""

import asyncio
import json
import logging
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
import redis
import ollama
from groq import Groq
from sentence_transformers import SentenceTransformer

from knowledge_base.learnnect_knowledge import LearnnectKnowledgeBase

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AdvancedRAGSystem:
    def __init__(self, 
                 groq_api_key: Optional[str] = None,
                 redis_host: str = "localhost",
                 redis_port: int = 6379,
                 redis_db: int = 0):
        """Initialize the Advanced RAG System"""
        
        # Initialize knowledge base
        self.knowledge_base = LearnnectKnowledgeBase()
        
        # Initialize LLMs
        self.groq_client = Groq(api_key=groq_api_key) if groq_api_key else None
        
        # Initialize Redis for memory/context
        try:
            self.redis_client = redis.Redis(
                host=redis_host, 
                port=redis_port, 
                db=redis_db,
                decode_responses=True
            )
            self.redis_client.ping()
            logger.info("✅ Redis connected successfully")
        except Exception as e:
            logger.warning(f"⚠️ Redis connection failed: {e}")
            self.redis_client = None
        
        # Initialize embedding model for query enhancement
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        logger.info("🚀 Advanced RAG System initialized")
    
    async def process_query(self, 
                          user_query: str,
                          user_id: str,
                          session_id: str,
                          current_page: str = "/",
                          conversation_history: List[Dict] = None) -> Dict[str, Any]:
        """Main RAG processing pipeline"""
        
        start_time = datetime.now()
        
        try:
            # Step 1: Enhance query with context
            enhanced_query = await self.enhance_query(
                user_query, user_id, session_id, current_page, conversation_history
            )
            
            # Step 2: Retrieve relevant knowledge
            relevant_knowledge = await self.retrieve_knowledge(enhanced_query, current_page)
            
            # Step 3: Generate response using LLM
            response = await self.generate_response(
                user_query, enhanced_query, relevant_knowledge, current_page, conversation_history
            )
            
            # Step 4: Update memory/context
            await self.update_context(user_id, session_id, user_query, response)
            
            processing_time = (datetime.now() - start_time).total_seconds()
            
            return {
                "response": response["content"],
                "confidence": response["confidence"],
                "sources": response["sources"],
                "knowledge_used": len(relevant_knowledge),
                "processing_time": processing_time,
                "model_used": response["model"],
                "enhanced_query": enhanced_query,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"❌ RAG processing error: {e}")
            return await self.get_fallback_response(user_query, current_page)
    
    async def enhance_query(self, 
                          user_query: str,
                          user_id: str,
                          session_id: str,
                          current_page: str,
                          conversation_history: List[Dict] = None) -> str:
        """Enhance user query with context and intent"""
        
        # Get conversation context from Redis
        context = await self.get_conversation_context(session_id)
        
        # Analyze query intent
        intent = self.analyze_intent(user_query)
        
        # Add page context
        page_context = self.get_page_context(current_page)
        
        # Build enhanced query
        enhanced_parts = [user_query]
        
        if intent:
            enhanced_parts.append(f"Intent: {intent}")
        
        if page_context:
            enhanced_parts.append(f"Page context: {page_context}")
        
        if context and context.get("last_topic"):
            enhanced_parts.append(f"Previous topic: {context['last_topic']}")
        
        enhanced_query = " | ".join(enhanced_parts)
        
        logger.info(f"🔍 Enhanced query: {enhanced_query}")
        return enhanced_query
    
    async def retrieve_knowledge(self, query: str, current_page: str) -> List[Dict[str, Any]]:
        """Retrieve relevant knowledge from ChromaDB"""
        
        # Determine search filters based on query and page
        filters = self.build_search_filters(query, current_page)
        
        # Search knowledge base
        results = self.knowledge_base.search_knowledge(
            query=query,
            n_results=5,
            filter_metadata=filters
        )
        
        # Rank and filter results
        ranked_results = self.rank_knowledge_results(results, query)
        
        logger.info(f"📚 Retrieved {len(ranked_results)} knowledge pieces")
        return ranked_results
    
    def build_search_filters(self, query: str, current_page: str) -> Optional[Dict]:
        """Build search filters based on query and context"""
        
        query_lower = query.lower()
        filters = {}
        
        # Page-based filtering
        if current_page == "/courses" or "course" in query_lower:
            filters["source"] = "courses"
        elif current_page == "/contact" or any(word in query_lower for word in ["contact", "support", "help"]):
            filters["source"] = {"$in": ["contact", "support"]}
        elif "price" in query_lower or "cost" in query_lower or "payment" in query_lower:
            filters["source"] = "pricing"
        elif current_page == "/about" or "about" in query_lower:
            filters["source"] = "about"
        
        # Intent-based filtering
        if "beginner" in query_lower:
            filters["level"] = "beginner"
        elif "advanced" in query_lower:
            filters["level"] = "advanced"
        
        return filters if filters else None
    
    def rank_knowledge_results(self, results: List[Dict], query: str) -> List[Dict]:
        """Rank knowledge results by relevance"""
        
        # Simple ranking based on distance and content relevance
        ranked = sorted(results, key=lambda x: x.get('distance', 1.0))
        
        # Filter out low-confidence results
        filtered = [r for r in ranked if r.get('distance', 1.0) < 0.8]
        
        return filtered[:3]  # Return top 3 most relevant
    
    async def generate_response(self, 
                              original_query: str,
                              enhanced_query: str,
                              knowledge: List[Dict],
                              current_page: str,
                              conversation_history: List[Dict] = None) -> Dict[str, Any]:
        """Generate response using LLM with retrieved knowledge"""
        
        # Build context-aware prompt
        prompt = self.build_rag_prompt(original_query, knowledge, current_page, conversation_history)
        
        # Try Ollama first (local, fast)
        try:
            response = await self.generate_with_ollama(prompt)
            if response:
                return {
                    "content": response,
                    "confidence": 0.85,
                    "sources": [k.get('id', 'unknown') for k in knowledge],
                    "model": "ollama"
                }
        except Exception as e:
            logger.warning(f"⚠️ Ollama failed: {e}")
        
        # Fallback to Groq (cloud, high-quality)
        try:
            if self.groq_client:
                response = await self.generate_with_groq(prompt)
                if response:
                    return {
                        "content": response,
                        "confidence": 0.9,
                        "sources": [k.get('id', 'unknown') for k in knowledge],
                        "model": "groq"
                    }
        except Exception as e:
            logger.warning(f"⚠️ Groq failed: {e}")
        
        # Final fallback
        return await self.get_fallback_response(original_query, current_page)
    
    def build_rag_prompt(self, 
                        query: str,
                        knowledge: List[Dict],
                        current_page: str,
                        conversation_history: List[Dict] = None) -> str:
        """Build RAG prompt with knowledge context"""
        
        # System prompt
        system_prompt = """You are Connect Bot, Learnnect's AI learning assistant. You're helpful, friendly, and use Gen-Z friendly language with emojis.

IMPORTANT GUIDELINES:
- Use the provided knowledge to answer questions accurately
- If knowledge doesn't contain the answer, say so honestly
- Be enthusiastic about learning and technology
- Use emojis and modern language appropriately
- Keep responses concise but informative
- Always encourage learning and growth"""
        
        # Add knowledge context
        knowledge_context = ""
        if knowledge:
            knowledge_context = "\n\nRELEVANT KNOWLEDGE:\n"
            for i, k in enumerate(knowledge, 1):
                knowledge_context += f"{i}. {k['content'][:500]}...\n"
        
        # Add page context
        page_context = f"\nCURRENT PAGE: {current_page}"
        
        # Add conversation history
        history_context = ""
        if conversation_history:
            history_context = "\n\nRECENT CONVERSATION:\n"
            for msg in conversation_history[-3:]:  # Last 3 messages
                role = "User" if msg.get('role') == 'user' else "Assistant"
                history_context += f"{role}: {msg.get('content', '')}\n"
        
        # Build final prompt
        prompt = f"""{system_prompt}{knowledge_context}{page_context}{history_context}

USER QUESTION: {query}

Please provide a helpful, accurate response based on the knowledge provided:"""
        
        return prompt
    
    async def generate_with_ollama(self, prompt: str) -> Optional[str]:
        """Generate response using Ollama"""
        try:
            response = ollama.generate(
                model='llama2:7b-chat',
                prompt=prompt,
                options={
                    'temperature': 0.7,
                    'top_p': 0.9,
                    'max_tokens': 250
                }
            )
            
            content = response.get('response', '').strip()
            return content if len(content) > 10 else None
            
        except Exception as e:
            logger.error(f"❌ Ollama generation error: {e}")
            return None
    
    async def generate_with_groq(self, prompt: str) -> Optional[str]:
        """Generate response using Groq"""
        try:
            response = self.groq_client.chat.completions.create(
                model="llama3-8b-8192",
                messages=[
                    {"role": "system", "content": "You are Connect Bot, Learnnect's helpful AI assistant."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=250
            )
            
            content = response.choices[0].message.content.strip()
            return content if len(content) > 10 else None
            
        except Exception as e:
            logger.error(f"❌ Groq generation error: {e}")
            return None
    
    async def get_fallback_response(self, query: str, current_page: str) -> Dict[str, Any]:
        """Generate fallback response when LLMs fail"""
        
        fallback_responses = {
            "pricing": "I'd love to help with pricing info! Our courses range from FREE (like Intro to Data Science) to premium courses. We offer payment plans too! Check out our pricing page or ask me about specific courses! 💰✨",
            "courses": "We have amazing courses in Data Science, AI, Machine Learning, and more! From beginner-friendly FREE courses to advanced specializations. What area interests you most? 🚀📚",
            "contact": "You can reach us at support@learnnect.com or call +1 (555) 123-4567! We're here Monday-Friday, 8am-5pm PST. Live chat is also available 24/7! 📞💬",
            "about": "Learnnect is transforming tech education! We're passionate about helping people build careers in Data Science and AI. With expert instructors and hands-on projects, we're here to help you succeed! 🌟",
            "general": "I'm here to help with anything about Learnnect! Whether it's courses, pricing, support, or just chatting about your learning journey - what can we explore together? ✨🤗"
        }
        
        # Determine response type
        query_lower = query.lower()
        if any(word in query_lower for word in ["price", "cost", "payment"]):
            response_type = "pricing"
        elif any(word in query_lower for word in ["course", "learn", "study"]):
            response_type = "courses"
        elif any(word in query_lower for word in ["contact", "support", "help"]):
            response_type = "contact"
        elif any(word in query_lower for word in ["about", "company", "mission"]):
            response_type = "about"
        else:
            response_type = "general"
        
        return {
            "content": fallback_responses[response_type],
            "confidence": 0.6,
            "sources": ["fallback"],
            "model": "fallback"
        }
    
    def analyze_intent(self, query: str) -> str:
        """Analyze user intent from query"""
        
        query_lower = query.lower()
        
        intents = {
            "pricing": ["price", "cost", "fee", "payment", "plan", "money"],
            "course_info": ["course", "learn", "study", "program", "training"],
            "enrollment": ["enroll", "register", "sign up", "join"],
            "support": ["help", "support", "problem", "issue", "question"],
            "contact": ["contact", "reach", "call", "email"],
            "about": ["about", "company", "mission", "vision"],
            "greeting": ["hello", "hi", "hey", "good morning", "good afternoon"]
        }
        
        for intent, keywords in intents.items():
            if any(keyword in query_lower for keyword in keywords):
                return intent
        
        return "general"
    
    def get_page_context(self, current_page: str) -> str:
        """Get context based on current page"""
        
        page_contexts = {
            "/": "homepage - main landing page",
            "/courses": "courses page - browsing available courses",
            "/about": "about page - learning about company",
            "/contact": "contact page - looking for contact information",
            "/auth": "authentication page - signing up or logging in"
        }
        
        return page_contexts.get(current_page, "unknown page")
    
    async def get_conversation_context(self, session_id: str) -> Optional[Dict]:
        """Get conversation context from Redis"""
        
        if not self.redis_client:
            return None
        
        try:
            context_key = f"conversation:{session_id}"
            context_data = self.redis_client.get(context_key)
            
            if context_data:
                return json.loads(context_data)
            
        except Exception as e:
            logger.error(f"❌ Redis get error: {e}")
        
        return None
    
    async def update_context(self, user_id: str, session_id: str, query: str, response: Dict):
        """Update conversation context in Redis"""
        
        if not self.redis_client:
            return
        
        try:
            context_key = f"conversation:{session_id}"
            
            context = {
                "user_id": user_id,
                "last_query": query,
                "last_response": response["content"],
                "last_topic": self.analyze_intent(query),
                "timestamp": datetime.now().isoformat(),
                "model_used": response.get("model", "unknown")
            }
            
            # Store with 1 hour expiration
            self.redis_client.setex(
                context_key,
                3600,  # 1 hour
                json.dumps(context)
            )
            
        except Exception as e:
            logger.error(f"❌ Redis set error: {e}")

# Example usage
if __name__ == "__main__":
    async def test_rag():
        rag = AdvancedRAGSystem()
        
        result = await rag.process_query(
            user_query="What are your course prices?",
            user_id="test_user",
            session_id="test_session",
            current_page="/courses"
        )
        
        print(json.dumps(result, indent=2))
    
    asyncio.run(test_rag())
