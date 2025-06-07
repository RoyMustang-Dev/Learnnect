"""
Enhanced Conversation Memory System
Python-based alternative to Redis for conversation context and memory
"""

import json
import os
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import threading
import pickle
from dataclasses import dataclass, asdict
from pathlib import Path

@dataclass
class ConversationTurn:
    """Single conversation turn"""
    timestamp: str
    user_message: str
    bot_response: str
    confidence: float
    sources: List[str]
    page_context: str
    processing_time: float

@dataclass
class UserSession:
    """User session data"""
    user_id: str
    session_id: str
    created_at: str
    last_active: str
    conversation_history: List[ConversationTurn]
    user_preferences: Dict[str, Any]
    context_summary: str
    total_interactions: int

class ConversationMemory:
    """Enhanced conversation memory system"""
    
    def __init__(self, storage_dir: str = "memory_storage"):
        self.storage_dir = Path(storage_dir)
        self.storage_dir.mkdir(exist_ok=True)
        
        # In-memory cache for active sessions
        self.active_sessions: Dict[str, UserSession] = {}
        self.session_lock = threading.Lock()
        
        # Configuration
        self.max_history_length = 50  # Keep last 50 interactions
        self.session_timeout = timedelta(hours=24)  # 24 hour session timeout
        self.auto_save_interval = 300  # Auto-save every 5 minutes
        
        # Load existing sessions
        self._load_sessions()
        
        # Start background cleanup task
        self._start_cleanup_task()
    
    def get_session(self, user_id: str, session_id: str) -> UserSession:
        """Get or create user session"""
        
        session_key = f"{user_id}_{session_id}"
        
        with self.session_lock:
            if session_key in self.active_sessions:
                session = self.active_sessions[session_key]
                session.last_active = datetime.now().isoformat()
                return session
            
            # Try to load from disk
            session_file = self.storage_dir / f"{session_key}.pkl"
            if session_file.exists():
                try:
                    with open(session_file, 'rb') as f:
                        session = pickle.load(f)
                    session.last_active = datetime.now().isoformat()
                    self.active_sessions[session_key] = session
                    return session
                except Exception as e:
                    print(f"Error loading session {session_key}: {e}")
            
            # Create new session
            session = UserSession(
                user_id=user_id,
                session_id=session_id,
                created_at=datetime.now().isoformat(),
                last_active=datetime.now().isoformat(),
                conversation_history=[],
                user_preferences={},
                context_summary="",
                total_interactions=0
            )
            
            self.active_sessions[session_key] = session
            return session
    
    def add_conversation_turn(
        self,
        user_id: str,
        session_id: str,
        user_message: str,
        bot_response: str,
        confidence: float,
        sources: List[str],
        page_context: str,
        processing_time: float
    ):
        """Add a new conversation turn"""
        
        session = self.get_session(user_id, session_id)
        
        turn = ConversationTurn(
            timestamp=datetime.now().isoformat(),
            user_message=user_message,
            bot_response=bot_response,
            confidence=confidence,
            sources=sources,
            page_context=page_context,
            processing_time=processing_time
        )
        
        with self.session_lock:
            session.conversation_history.append(turn)
            session.total_interactions += 1
            session.last_active = datetime.now().isoformat()
            
            # Trim history if too long
            if len(session.conversation_history) > self.max_history_length:
                session.conversation_history = session.conversation_history[-self.max_history_length:]
            
            # Update context summary
            self._update_context_summary(session)
    
    def get_conversation_context(self, user_id: str, session_id: str, last_n: int = 5) -> List[Dict]:
        """Get recent conversation context"""
        
        session = self.get_session(user_id, session_id)
        
        recent_turns = session.conversation_history[-last_n:] if session.conversation_history else []
        
        context = []
        for turn in recent_turns:
            context.extend([
                {"role": "user", "content": turn.user_message},
                {"role": "assistant", "content": turn.bot_response}
            ])
        
        return context
    
    def get_user_preferences(self, user_id: str, session_id: str) -> Dict[str, Any]:
        """Get user preferences"""
        session = self.get_session(user_id, session_id)
        return session.user_preferences.copy()
    
    def update_user_preferences(self, user_id: str, session_id: str, preferences: Dict[str, Any]):
        """Update user preferences"""
        session = self.get_session(user_id, session_id)
        
        with self.session_lock:
            session.user_preferences.update(preferences)
            session.last_active = datetime.now().isoformat()
    
    def get_session_stats(self, user_id: str, session_id: str) -> Dict[str, Any]:
        """Get session statistics"""
        session = self.get_session(user_id, session_id)
        
        return {
            "total_interactions": session.total_interactions,
            "session_duration": self._calculate_session_duration(session),
            "most_common_topics": self._get_common_topics(session),
            "average_confidence": self._calculate_average_confidence(session),
            "pages_visited": self._get_pages_visited(session)
        }
    
    def save_session(self, user_id: str, session_id: str):
        """Save session to disk"""
        session_key = f"{user_id}_{session_id}"
        
        if session_key in self.active_sessions:
            session = self.active_sessions[session_key]
            session_file = self.storage_dir / f"{session_key}.pkl"
            
            try:
                with open(session_file, 'wb') as f:
                    pickle.dump(session, f)
            except Exception as e:
                print(f"Error saving session {session_key}: {e}")
    
    def save_all_sessions(self):
        """Save all active sessions to disk"""
        with self.session_lock:
            for session_key in self.active_sessions:
                user_id, session_id = session_key.split('_', 1)
                self.save_session(user_id, session_id)
    
    def _load_sessions(self):
        """Load sessions from disk"""
        for session_file in self.storage_dir.glob("*.pkl"):
            try:
                with open(session_file, 'rb') as f:
                    session = pickle.load(f)
                
                session_key = f"{session.user_id}_{session.session_id}"
                
                # Check if session is still valid
                last_active = datetime.fromisoformat(session.last_active)
                if datetime.now() - last_active < self.session_timeout:
                    self.active_sessions[session_key] = session
                else:
                    # Remove expired session file
                    session_file.unlink()
                    
            except Exception as e:
                print(f"Error loading session from {session_file}: {e}")
    
    def _update_context_summary(self, session: UserSession):
        """Update context summary for the session"""
        if not session.conversation_history:
            return
        
        # Simple context summary based on recent interactions
        recent_topics = []
        recent_pages = set()
        
        for turn in session.conversation_history[-10:]:  # Last 10 turns
            recent_pages.add(turn.page_context)
            # Extract key topics from user messages (simple keyword extraction)
            words = turn.user_message.lower().split()
            topics = [word for word in words if len(word) > 4 and word.isalpha()]
            recent_topics.extend(topics)
        
        # Create summary
        common_topics = list(set(recent_topics))[:5]  # Top 5 unique topics
        pages_visited = list(recent_pages)
        
        session.context_summary = f"Recent topics: {', '.join(common_topics)}. Pages visited: {', '.join(pages_visited)}"
    
    def _calculate_session_duration(self, session: UserSession) -> str:
        """Calculate session duration"""
        try:
            created = datetime.fromisoformat(session.created_at)
            last_active = datetime.fromisoformat(session.last_active)
            duration = last_active - created
            return str(duration)
        except:
            return "Unknown"
    
    def _get_common_topics(self, session: UserSession) -> List[str]:
        """Get most common topics from conversation"""
        all_words = []
        for turn in session.conversation_history:
            words = turn.user_message.lower().split()
            all_words.extend([word for word in words if len(word) > 4 and word.isalpha()])
        
        # Simple frequency count
        word_count = {}
        for word in all_words:
            word_count[word] = word_count.get(word, 0) + 1
        
        # Return top 5 most common words
        return sorted(word_count.keys(), key=lambda x: word_count[x], reverse=True)[:5]
    
    def _calculate_average_confidence(self, session: UserSession) -> float:
        """Calculate average confidence score"""
        if not session.conversation_history:
            return 0.0
        
        total_confidence = sum(turn.confidence for turn in session.conversation_history)
        return total_confidence / len(session.conversation_history)
    
    def _get_pages_visited(self, session: UserSession) -> List[str]:
        """Get unique pages visited in session"""
        pages = set()
        for turn in session.conversation_history:
            pages.add(turn.page_context)
        return list(pages)
    
    def _start_cleanup_task(self):
        """Start background cleanup task"""
        def cleanup():
            while True:
                time.sleep(self.auto_save_interval)
                self._cleanup_expired_sessions()
                self.save_all_sessions()
        
        cleanup_thread = threading.Thread(target=cleanup, daemon=True)
        cleanup_thread.start()
    
    def _cleanup_expired_sessions(self):
        """Remove expired sessions from memory"""
        current_time = datetime.now()
        expired_sessions = []
        
        with self.session_lock:
            for session_key, session in self.active_sessions.items():
                last_active = datetime.fromisoformat(session.last_active)
                if current_time - last_active > self.session_timeout:
                    expired_sessions.append(session_key)
            
            for session_key in expired_sessions:
                del self.active_sessions[session_key]
    
    def get_memory_stats(self) -> Dict[str, Any]:
        """Get memory system statistics"""
        with self.session_lock:
            total_sessions = len(self.active_sessions)
            total_interactions = sum(session.total_interactions for session in self.active_sessions.values())
            
            return {
                "active_sessions": total_sessions,
                "total_interactions": total_interactions,
                "storage_directory": str(self.storage_dir),
                "session_timeout_hours": self.session_timeout.total_seconds() / 3600,
                "max_history_length": self.max_history_length
            }
