"""
Voice Processing System
Handles speech-to-text and text-to-speech functionality
"""

import os
import io
import base64
import tempfile
import logging
from typing import Optional, Dict, Any
from pathlib import Path
import asyncio

# Import speech processing libraries
import whisper
from gtts import gTTS
import pygame
from pydub import AudioSegment
from pydub.playback import play

logger = logging.getLogger(__name__)

class VoiceProcessor:
    """Enhanced voice processing system"""
    
    def __init__(self):
        self.whisper_model = None
        self.supported_languages = [
            'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'hi', 'ar'
        ]
        self.default_language = 'en'
        self.temp_dir = Path(tempfile.gettempdir()) / "learnnect_voice"
        self.temp_dir.mkdir(exist_ok=True)
        
        # Initialize pygame for audio playback
        try:
            pygame.mixer.init()
            self.pygame_available = True
        except:
            self.pygame_available = False
            logger.warning("Pygame not available for audio playback")
    
    async def initialize_whisper(self, model_size: str = "base"):
        """Initialize Whisper model for speech recognition"""
        try:
            logger.info(f"Loading Whisper model: {model_size}")
            self.whisper_model = whisper.load_model(model_size)
            logger.info("✅ Whisper model loaded successfully")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to load Whisper model: {e}")
            return False
    
    async def speech_to_text(
        self, 
        audio_data: bytes, 
        language: Optional[str] = None,
        audio_format: str = "wav"
    ) -> Dict[str, Any]:
        """Convert speech to text using Whisper"""
        
        if not self.whisper_model:
            await self.initialize_whisper()
        
        if not self.whisper_model:
            return {
                "success": False,
                "error": "Whisper model not available",
                "text": "",
                "confidence": 0.0,
                "language": None
            }
        
        try:
            # Save audio data to temporary file
            temp_audio_file = self.temp_dir / f"temp_audio_{os.getpid()}.{audio_format}"
            
            with open(temp_audio_file, 'wb') as f:
                f.write(audio_data)
            
            # Transcribe audio
            logger.info("🎤 Transcribing audio...")
            
            if language and language in self.supported_languages:
                result = self.whisper_model.transcribe(str(temp_audio_file), language=language)
            else:
                result = self.whisper_model.transcribe(str(temp_audio_file))
            
            # Clean up temporary file
            temp_audio_file.unlink(missing_ok=True)
            
            # Extract results
            text = result.get("text", "").strip()
            detected_language = result.get("language", "unknown")
            
            # Calculate confidence (Whisper doesn't provide direct confidence, so we estimate)
            segments = result.get("segments", [])
            if segments:
                avg_confidence = sum(segment.get("no_speech_prob", 0.5) for segment in segments) / len(segments)
                confidence = 1.0 - avg_confidence  # Convert no_speech_prob to confidence
            else:
                confidence = 0.8 if text else 0.0
            
            logger.info(f"✅ Transcription complete: '{text[:50]}...'")
            
            return {
                "success": True,
                "text": text,
                "confidence": confidence,
                "language": detected_language,
                "duration": result.get("duration", 0),
                "segments": len(segments)
            }
            
        except Exception as e:
            logger.error(f"❌ Speech-to-text error: {e}")
            return {
                "success": False,
                "error": str(e),
                "text": "",
                "confidence": 0.0,
                "language": None
            }
    
    async def text_to_speech(
        self, 
        text: str, 
        language: str = "en",
        slow: bool = False,
        voice_style: str = "friendly"
    ) -> Dict[str, Any]:
        """Convert text to speech using gTTS"""
        
        try:
            logger.info(f"🔊 Converting text to speech: '{text[:50]}...'")
            
            # Validate language
            if language not in self.supported_languages:
                language = self.default_language
            
            # Create TTS object
            tts = gTTS(
                text=text,
                lang=language,
                slow=slow
            )
            
            # Save to temporary file
            temp_audio_file = self.temp_dir / f"tts_output_{os.getpid()}.mp3"
            tts.save(str(temp_audio_file))
            
            # Read audio data
            with open(temp_audio_file, 'rb') as f:
                audio_data = f.read()
            
            # Convert to base64 for web transmission
            audio_base64 = base64.b64encode(audio_data).decode('utf-8')
            
            # Clean up temporary file
            temp_audio_file.unlink(missing_ok=True)
            
            logger.info("✅ Text-to-speech conversion complete")
            
            return {
                "success": True,
                "audio_data": audio_base64,
                "audio_format": "mp3",
                "language": language,
                "text_length": len(text),
                "estimated_duration": len(text) * 0.1  # Rough estimate
            }
            
        except Exception as e:
            logger.error(f"❌ Text-to-speech error: {e}")
            return {
                "success": False,
                "error": str(e),
                "audio_data": None
            }
    
    async def process_audio_file(self, file_path: str) -> Dict[str, Any]:
        """Process uploaded audio file"""
        
        try:
            file_path = Path(file_path)
            
            if not file_path.exists():
                return {
                    "success": False,
                    "error": "Audio file not found"
                }
            
            # Read audio file
            with open(file_path, 'rb') as f:
                audio_data = f.read()
            
            # Get file extension
            audio_format = file_path.suffix.lower().lstrip('.')
            
            # Convert to supported format if needed
            if audio_format not in ['wav', 'mp3', 'flac', 'm4a']:
                try:
                    # Convert using pydub
                    audio = AudioSegment.from_file(str(file_path))
                    temp_wav_file = self.temp_dir / f"converted_{os.getpid()}.wav"
                    audio.export(str(temp_wav_file), format="wav")
                    
                    with open(temp_wav_file, 'rb') as f:
                        audio_data = f.read()
                    
                    audio_format = "wav"
                    temp_wav_file.unlink(missing_ok=True)
                    
                except Exception as e:
                    return {
                        "success": False,
                        "error": f"Audio conversion failed: {e}"
                    }
            
            # Process with speech-to-text
            result = await self.speech_to_text(audio_data, audio_format=audio_format)
            
            return result
            
        except Exception as e:
            logger.error(f"❌ Audio file processing error: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def get_supported_languages(self) -> Dict[str, str]:
        """Get supported languages for voice processing"""
        
        language_names = {
            'en': 'English',
            'es': 'Spanish',
            'fr': 'French',
            'de': 'German',
            'it': 'Italian',
            'pt': 'Portuguese',
            'ru': 'Russian',
            'ja': 'Japanese',
            'ko': 'Korean',
            'zh': 'Chinese',
            'hi': 'Hindi',
            'ar': 'Arabic'
        }
        
        return language_names
    
    def get_voice_stats(self) -> Dict[str, Any]:
        """Get voice processing statistics"""
        
        return {
            "whisper_model_loaded": self.whisper_model is not None,
            "supported_languages": len(self.supported_languages),
            "pygame_available": self.pygame_available,
            "temp_directory": str(self.temp_dir),
            "supported_formats": ["wav", "mp3", "flac", "m4a", "ogg"]
        }
    
    async def cleanup_temp_files(self):
        """Clean up temporary audio files"""
        
        try:
            for temp_file in self.temp_dir.glob("*"):
                if temp_file.is_file():
                    # Remove files older than 1 hour
                    if (temp_file.stat().st_mtime < (os.time() - 3600)):
                        temp_file.unlink()
            
            logger.info("🧹 Temporary audio files cleaned up")
            
        except Exception as e:
            logger.error(f"❌ Cleanup error: {e}")

# Global voice processor instance
voice_processor = VoiceProcessor()

async def initialize_voice_system():
    """Initialize the voice processing system"""
    logger.info("🎤 Initializing voice processing system...")
    
    success = await voice_processor.initialize_whisper("base")
    
    if success:
        logger.info("✅ Voice processing system ready")
    else:
        logger.warning("⚠️ Voice processing system partially available")
    
    return success
