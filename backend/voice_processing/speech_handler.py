"""
Speech Processing Module for Learnnect AI Chatbot
Handles Speech-to-Text (Whisper) and Text-to-Speech (Festival/eSpeak)
"""

import asyncio
import base64
import io
import logging
import os
import subprocess
import tempfile
import wave
from typing import Optional, Dict, Any
import whisper
import torch
from pydub import AudioSegment
from googletrans import Translator

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SpeechHandler:
    def __init__(self):
        """Initialize speech processing components"""
        
        # Initialize Whisper model
        self.whisper_model = None
        self.load_whisper_model()
        
        # Initialize language translator
        self.translator = Translator()
        
        # TTS settings
        self.tts_engine = "espeak"  # or "festival"
        self.default_voice = "en"
        self.speech_rate = 150  # words per minute
        
        logger.info("🎤 Speech Handler initialized")
    
    def load_whisper_model(self):
        """Load Whisper model for speech recognition"""
        try:
            # Use smaller model for faster processing
            model_size = "base"  # Options: tiny, base, small, medium, large
            
            logger.info(f"📥 Loading Whisper model: {model_size}")
            self.whisper_model = whisper.load_model(model_size)
            
            # Check if CUDA is available
            device = "cuda" if torch.cuda.is_available() else "cpu"
            logger.info(f"🖥️ Using device: {device}")
            
        except Exception as e:
            logger.error(f"❌ Failed to load Whisper model: {e}")
            self.whisper_model = None
    
    async def speech_to_text(self, audio_data: str, language: str = "auto") -> Optional[str]:
        """Convert speech to text using Whisper"""
        
        if not self.whisper_model:
            logger.error("❌ Whisper model not loaded")
            return None
        
        try:
            # Decode base64 audio data
            audio_bytes = base64.b64decode(audio_data)
            
            # Create temporary file
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
                temp_file.write(audio_bytes)
                temp_file_path = temp_file.name
            
            try:
                # Process audio with Whisper
                logger.info("🎤 Transcribing audio with Whisper...")
                
                # Transcribe audio
                result = self.whisper_model.transcribe(
                    temp_file_path,
                    language=None if language == "auto" else language,
                    task="transcribe"
                )
                
                transcribed_text = result["text"].strip()
                detected_language = result.get("language", "unknown")
                
                logger.info(f"📝 Transcribed ({detected_language}): {transcribed_text[:100]}...")
                
                # Translate to English if needed
                if detected_language != "en" and detected_language != "unknown":
                    try:
                        translated = self.translator.translate(transcribed_text, dest="en")
                        logger.info(f"🌐 Translated: {translated.text[:100]}...")
                        return translated.text
                    except Exception as e:
                        logger.warning(f"⚠️ Translation failed: {e}")
                        return transcribed_text
                
                return transcribed_text
                
            finally:
                # Clean up temporary file
                os.unlink(temp_file_path)
                
        except Exception as e:
            logger.error(f"❌ Speech-to-text error: {e}")
            return None
    
    async def text_to_speech(self, text: str, voice: str = "en", speed: int = 150) -> Optional[str]:
        """Convert text to speech using eSpeak/Festival"""
        
        try:
            logger.info(f"🔊 Converting text to speech: {text[:50]}...")
            
            # Clean text for TTS
            clean_text = self.clean_text_for_tts(text)
            
            # Generate speech based on available TTS engine
            if self.tts_engine == "espeak":
                audio_data = await self.generate_speech_espeak(clean_text, voice, speed)
            else:
                audio_data = await self.generate_speech_festival(clean_text, voice, speed)
            
            if audio_data:
                # Convert to base64 for transmission
                audio_base64 = base64.b64encode(audio_data).decode('utf-8')
                logger.info("✅ Text-to-speech conversion successful")
                return audio_base64
            
            return None
            
        except Exception as e:
            logger.error(f"❌ Text-to-speech error: {e}")
            return None
    
    def clean_text_for_tts(self, text: str) -> str:
        """Clean text for better TTS output"""
        
        # Remove emojis and special characters
        import re
        
        # Remove emojis
        emoji_pattern = re.compile("["
                                 u"\U0001F600-\U0001F64F"  # emoticons
                                 u"\U0001F300-\U0001F5FF"  # symbols & pictographs
                                 u"\U0001F680-\U0001F6FF"  # transport & map symbols
                                 u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
                                 "]+", flags=re.UNICODE)
        
        clean_text = emoji_pattern.sub('', text)
        
        # Replace common symbols with words
        replacements = {
            "&": "and",
            "@": "at",
            "#": "hashtag",
            "$": "dollars",
            "%": "percent",
            "🚀": "rocket",
            "✨": "sparkles",
            "💪": "strong",
            "🎯": "target",
            "🔥": "fire",
            "💡": "idea",
            "🌟": "star"
        }
        
        for symbol, word in replacements.items():
            clean_text = clean_text.replace(symbol, word)
        
        # Remove extra whitespace
        clean_text = ' '.join(clean_text.split())
        
        return clean_text
    
    async def generate_speech_espeak(self, text: str, voice: str, speed: int) -> Optional[bytes]:
        """Generate speech using eSpeak"""
        
        try:
            # Create temporary file for output
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
                temp_file_path = temp_file.name
            
            try:
                # Build eSpeak command
                cmd = [
                    "espeak",
                    "-v", voice,
                    "-s", str(speed),
                    "-w", temp_file_path,
                    text
                ]
                
                # Run eSpeak
                result = subprocess.run(
                    cmd,
                    capture_output=True,
                    text=True,
                    timeout=30
                )
                
                if result.returncode == 0:
                    # Read generated audio file
                    with open(temp_file_path, "rb") as audio_file:
                        audio_data = audio_file.read()
                    
                    return audio_data
                else:
                    logger.error(f"❌ eSpeak error: {result.stderr}")
                    return None
                    
            finally:
                # Clean up temporary file
                if os.path.exists(temp_file_path):
                    os.unlink(temp_file_path)
                
        except subprocess.TimeoutExpired:
            logger.error("❌ eSpeak timeout")
            return None
        except FileNotFoundError:
            logger.error("❌ eSpeak not found. Please install espeak: sudo apt-get install espeak")
            return None
        except Exception as e:
            logger.error(f"❌ eSpeak generation error: {e}")
            return None
    
    async def generate_speech_festival(self, text: str, voice: str, speed: int) -> Optional[bytes]:
        """Generate speech using Festival"""
        
        try:
            # Create temporary files
            with tempfile.NamedTemporaryFile(mode='w', suffix=".txt", delete=False) as text_file:
                text_file.write(text)
                text_file_path = text_file.name
            
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as audio_file:
                audio_file_path = audio_file.name
            
            try:
                # Build Festival command
                cmd = [
                    "text2wave",
                    "-o", audio_file_path,
                    text_file_path
                ]
                
                # Run Festival
                result = subprocess.run(
                    cmd,
                    capture_output=True,
                    text=True,
                    timeout=30
                )
                
                if result.returncode == 0:
                    # Read generated audio file
                    with open(audio_file_path, "rb") as audio_file:
                        audio_data = audio_file.read()
                    
                    return audio_data
                else:
                    logger.error(f"❌ Festival error: {result.stderr}")
                    return None
                    
            finally:
                # Clean up temporary files
                if os.path.exists(text_file_path):
                    os.unlink(text_file_path)
                if os.path.exists(audio_file_path):
                    os.unlink(audio_file_path)
                
        except subprocess.TimeoutExpired:
            logger.error("❌ Festival timeout")
            return None
        except FileNotFoundError:
            logger.error("❌ Festival not found. Please install festival: sudo apt-get install festival")
            return None
        except Exception as e:
            logger.error(f"❌ Festival generation error: {e}")
            return None
    
    async def detect_language(self, audio_data: str) -> Optional[str]:
        """Detect language from audio using Whisper"""
        
        if not self.whisper_model:
            return None
        
        try:
            # Decode audio
            audio_bytes = base64.b64decode(audio_data)
            
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
                temp_file.write(audio_bytes)
                temp_file_path = temp_file.name
            
            try:
                # Detect language
                audio = whisper.load_audio(temp_file_path)
                audio = whisper.pad_or_trim(audio)
                
                mel = whisper.log_mel_spectrogram(audio).to(self.whisper_model.device)
                _, probs = self.whisper_model.detect_language(mel)
                
                detected_language = max(probs, key=probs.get)
                confidence = probs[detected_language]
                
                logger.info(f"🌐 Detected language: {detected_language} (confidence: {confidence:.2f})")
                
                return detected_language if confidence > 0.5 else None
                
            finally:
                os.unlink(temp_file_path)
                
        except Exception as e:
            logger.error(f"❌ Language detection error: {e}")
            return None
    
    async def get_available_voices(self) -> Dict[str, Any]:
        """Get available TTS voices"""
        
        voices = {
            "espeak": [],
            "festival": []
        }
        
        # Get eSpeak voices
        try:
            result = subprocess.run(
                ["espeak", "--voices"],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if result.returncode == 0:
                lines = result.stdout.strip().split('\n')[1:]  # Skip header
                for line in lines:
                    parts = line.split()
                    if len(parts) >= 4:
                        voices["espeak"].append({
                            "code": parts[1],
                            "name": parts[3],
                            "language": parts[1][:2]
                        })
                        
        except Exception as e:
            logger.warning(f"⚠️ Could not get eSpeak voices: {e}")
        
        # Get Festival voices (basic list)
        voices["festival"] = [
            {"code": "en", "name": "English", "language": "en"},
            {"code": "es", "name": "Spanish", "language": "es"},
            {"code": "fr", "name": "French", "language": "fr"}
        ]
        
        return voices
    
    async def process_audio_file(self, file_path: str) -> Optional[str]:
        """Process uploaded audio file"""
        
        try:
            # Convert audio to WAV format if needed
            audio = AudioSegment.from_file(file_path)
            
            # Convert to mono, 16kHz (Whisper's preferred format)
            audio = audio.set_channels(1).set_frame_rate(16000)
            
            # Export to temporary WAV file
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
                audio.export(temp_file.name, format="wav")
                temp_file_path = temp_file.name
            
            try:
                # Transcribe with Whisper
                result = self.whisper_model.transcribe(temp_file_path)
                return result["text"].strip()
                
            finally:
                os.unlink(temp_file_path)
                
        except Exception as e:
            logger.error(f"❌ Audio file processing error: {e}")
            return None

# Example usage and testing
if __name__ == "__main__":
    async def test_speech_handler():
        handler = SpeechHandler()
        
        # Test TTS
        audio_data = await handler.text_to_speech("Hello! Welcome to Learnnect! 🚀")
        if audio_data:
            print("✅ TTS test successful")
        else:
            print("❌ TTS test failed")
        
        # Get available voices
        voices = await handler.get_available_voices()
        print(f"📢 Available voices: {voices}")
    
    asyncio.run(test_speech_handler())
