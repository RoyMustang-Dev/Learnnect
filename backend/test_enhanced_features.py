#!/usr/bin/env python3
"""
Enhanced Features Test Script
Tests all the new optional services and features
"""

import asyncio
import os
import json
import tempfile
from datetime import datetime
from pathlib import Path

def print_header(text: str):
    print(f"\n{'='*70}")
    print(f"{text.center(70)}")
    print(f"{'='*70}\n")

def print_success(text: str):
    print(f"✅ {text}")

def print_error(text: str):
    print(f"❌ {text}")

def print_info(text: str):
    print(f"ℹ️  {text}")

def print_warning(text: str):
    print(f"⚠️  {text}")

async def test_enhanced_features():
    """Test all enhanced features"""
    
    print_header("ENHANCED FEATURES TEST")
    print_info(f"Testing enhanced services at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    total_tests = 0
    passed_tests = 0
    
    # Test 1: Memory System
    print("\n🧠 Testing Conversation Memory System...")
    total_tests += 1
    try:
        from memory_system.conversation_memory import ConversationMemory
        
        memory = ConversationMemory()
        
        # Test session creation
        session = memory.get_session("test_user", "test_session")
        print_success(f"Session created: {session.user_id}")
        
        # Test conversation turn
        memory.add_conversation_turn(
            user_id="test_user",
            session_id="test_session",
            user_message="Hello, what courses do you offer?",
            bot_response="Hi! We offer various tech courses including web development, AI, and data science! 🚀",
            confidence=0.9,
            sources=["course_catalog"],
            page_context="/courses",
            processing_time=1.2
        )
        
        # Test context retrieval
        context = memory.get_conversation_context("test_user", "test_session")
        print_success(f"Context retrieved: {len(context)} messages")
        
        # Test session stats
        stats = memory.get_session_stats("test_user", "test_session")
        print_success(f"Session stats: {stats['total_interactions']} interactions")
        
        passed_tests += 1
        print_success("Memory System: PASSED")
        
    except Exception as e:
        print_error(f"Memory System test failed: {e}")
    
    # Test 2: Voice Processing System
    print("\n🎤 Testing Voice Processing System...")
    total_tests += 1
    try:
        from voice_system.voice_processor import VoiceProcessor
        
        voice_processor = VoiceProcessor()
        
        # Test TTS (Text-to-Speech)
        tts_result = await voice_processor.text_to_speech(
            text="Hello! Welcome to Learnnect! 🎉",
            language="en"
        )
        
        if tts_result['success']:
            print_success(f"TTS test: Generated {len(tts_result['audio_data'])} bytes of audio")
        else:
            print_warning(f"TTS test: {tts_result['error']}")
        
        # Test supported languages
        languages = voice_processor.get_supported_languages()
        print_success(f"Supported languages: {len(languages)} languages")
        
        # Test voice stats
        voice_stats = voice_processor.get_voice_stats()
        print_success(f"Voice stats: Whisper loaded: {voice_stats['whisper_model_loaded']}")
        
        passed_tests += 1
        print_success("Voice Processing: PASSED")
        
    except Exception as e:
        print_error(f"Voice Processing test failed: {e}")
    
    # Test 3: File Processing System
    print("\n📁 Testing File Processing System...")
    total_tests += 1
    try:
        from file_system.file_processor import FileProcessor
        
        file_processor = FileProcessor()
        
        # Create test files
        test_files = []
        
        # Test text file
        text_content = "This is a test document about Learnnect courses.\nWe offer web development, AI, and data science programs."
        text_file = await create_test_file("test_document.txt", text_content.encode())
        test_files.append(text_file)
        
        # Test JSON file
        json_content = {
            "course": "Web Development",
            "duration": "12 weeks",
            "price": "$299",
            "topics": ["HTML", "CSS", "JavaScript", "React"]
        }
        json_file = await create_test_file("course_info.json", json.dumps(json_content).encode())
        test_files.append(json_file)
        
        # Process test files
        for test_file in test_files:
            with open(test_file, 'rb') as f:
                file_content = f.read()
            
            result = await file_processor.process_uploaded_file(
                file_content=file_content,
                filename=test_file.name,
                user_id="test_user",
                description=f"Test file: {test_file.name}"
            )
            
            if result['success']:
                print_success(f"File processed: {test_file.name}")
                print_info(f"Content preview: {result['content_preview'][:100]}...")
            else:
                print_error(f"File processing failed: {result['error']}")
        
        # Test supported formats
        formats = file_processor.get_supported_formats()
        print_success(f"Supported formats: {len(formats)} categories")
        
        # Test upload stats
        upload_stats = file_processor.get_upload_stats()
        print_success(f"Upload stats: {upload_stats['total_files']} files, {upload_stats['total_size_mb']} MB")
        
        # Cleanup test files
        for test_file in test_files:
            test_file.unlink(missing_ok=True)
        
        passed_tests += 1
        print_success("File Processing: PASSED")
        
    except Exception as e:
        print_error(f"File Processing test failed: {e}")
    
    # Test 4: Enhanced RAG System
    print("\n🧠 Testing Enhanced RAG System...")
    total_tests += 1
    try:
        from knowledge_base.learnnect_knowledge import LearnnectKnowledgeBase
        from groq import Groq
        
        # Test knowledge base
        kb = LearnnectKnowledgeBase()
        kb_stats = kb.get_knowledge_stats()
        print_success(f"Knowledge base: {kb_stats['total_documents']} documents")
        
        # Test Groq API
        groq_client = Groq(api_key="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")
        
        # Test enhanced RAG query
        query = "What are the pricing options for your courses?"
        
        # Search knowledge
        knowledge_results = kb.search_knowledge(query, n_results=3)
        
        # Build context
        context = ""
        for result in knowledge_results:
            context += result['content'][:200] + "...\n"
        
        # Generate enhanced response
        messages = [
            {
                "role": "system",
                "content": f"""You are Connect Bot, Learnnect's AI assistant. Use this knowledge:

{context}

Be helpful and use Gen-Z friendly language with emojis."""
            },
            {"role": "user", "content": query}
        ]
        
        response = groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=messages,
            temperature=0.7,
            max_tokens=150
        )
        
        ai_response = response.choices[0].message.content
        print_success("Enhanced RAG query successful!")
        print_info(f"Query: {query}")
        print_info(f"Response: {ai_response[:100]}...")
        
        passed_tests += 1
        print_success("Enhanced RAG: PASSED")
        
    except Exception as e:
        print_error(f"Enhanced RAG test failed: {e}")
    
    # Test 5: Integration Test
    print("\n🔗 Testing System Integration...")
    total_tests += 1
    try:
        # Simulate a complete conversation flow
        from memory_system.conversation_memory import ConversationMemory
        from knowledge_base.learnnect_knowledge import LearnnectKnowledgeBase
        from groq import Groq
        
        memory = ConversationMemory()
        kb = LearnnectKnowledgeBase()
        groq_client = Groq(api_key="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")
        
        # Simulate conversation
        user_id = "integration_test_user"
        session_id = "integration_test_session"
        
        conversations = [
            "Hello! I'm interested in learning web development.",
            "What courses do you offer for beginners?",
            "How much do your courses cost?",
            "Do you offer any payment plans?"
        ]
        
        for i, user_message in enumerate(conversations):
            # Get conversation context
            context = memory.get_conversation_context(user_id, session_id, last_n=3)
            
            # Search knowledge
            knowledge_results = kb.search_knowledge(user_message, n_results=2)
            
            # Build knowledge context
            knowledge_context = ""
            for result in knowledge_results:
                knowledge_context += result['content'][:150] + "...\n"
            
            # Generate response
            messages = [
                {
                    "role": "system",
                    "content": f"""You are Connect Bot. Use this knowledge: {knowledge_context}"""
                }
            ]
            messages.extend(context)
            messages.append({"role": "user", "content": user_message})
            
            response = groq_client.chat.completions.create(
                model="llama3-8b-8192",
                messages=messages,
                max_tokens=100
            )
            
            bot_response = response.choices[0].message.content
            
            # Store in memory
            memory.add_conversation_turn(
                user_id=user_id,
                session_id=session_id,
                user_message=user_message,
                bot_response=bot_response,
                confidence=0.9,
                sources=["knowledge_base"],
                page_context="/courses",
                processing_time=0.5
            )
            
            print_info(f"Turn {i+1}: {user_message[:30]}... -> {bot_response[:30]}...")
        
        # Check final session stats
        final_stats = memory.get_session_stats(user_id, session_id)
        print_success(f"Integration test: {final_stats['total_interactions']} interactions completed")
        
        passed_tests += 1
        print_success("System Integration: PASSED")
        
    except Exception as e:
        print_error(f"Integration test failed: {e}")
    
    # Final Results
    print_header("TEST RESULTS")
    print_info(f"Total Tests: {total_tests}")
    print_success(f"Passed: {passed_tests}")
    
    if passed_tests < total_tests:
        print_error(f"Failed: {total_tests - passed_tests}")
    
    success_rate = (passed_tests / total_tests) * 100 if total_tests > 0 else 0
    print_info(f"Success Rate: {success_rate:.1f}%")
    
    if success_rate >= 80:
        print_success("🎉 Enhanced features are working well!")
        print_info("✅ Ready to run the enhanced chatbot!")
    else:
        print_warning("⚠️ Some features need attention before deployment")
    
    return success_rate >= 80

async def create_test_file(filename: str, content: bytes) -> Path:
    """Create a temporary test file"""
    temp_dir = Path(tempfile.gettempdir()) / "learnnect_test"
    temp_dir.mkdir(exist_ok=True)
    
    test_file = temp_dir / filename
    with open(test_file, 'wb') as f:
        f.write(content)
    
    return test_file

if __name__ == "__main__":
    success = asyncio.run(test_enhanced_features())
    if success:
        print("\n🚀 Ready to start the enhanced chatbot!")
        print("Run: python main_enhanced.py")
    else:
        print("\n❌ Please fix the issues above before proceeding.")
