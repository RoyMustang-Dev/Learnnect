"""
Learnnect Storage API - Backend Implementation
Uses Learnnect's Google Drive service account to store user resumes
"""

import os
import json
import uuid
from datetime import datetime
from typing import Dict, List, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
from dotenv import load_dotenv
import io

# Load environment variables
load_dotenv('.env.storage')  # Development
load_dotenv('.env')  # Production fallback

app = FastAPI(title="Learnnect Storage API")

# CORS middleware - Get allowed origins from environment
import ast
cors_origins = os.getenv('CORS_ORIGINS', '["http://localhost:3000", "http://localhost:5173"]')
try:
    allowed_origins = ast.literal_eval(cors_origins)
except:
    allowed_origins = ["http://localhost:3000", "http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Google Drive Service Account Configuration
# Get the directory of this script to find the service account file
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SERVICE_ACCOUNT_FILE = os.getenv('GOOGLE_SERVICE_ACCOUNT_KEY_PATH',
                                os.path.join(SCRIPT_DIR, 'service-account-key.json'))
SCOPES = ['https://www.googleapis.com/auth/drive']
LEARNNECT_FOLDER_ID = os.getenv('LEARNNECT_DRIVE_FOLDER_ID', '1w-7EywK43Pn1GkwRqzScE1qbnh8GUwdd')

class LearnnectStorageService:
    def __init__(self):
        self.service = None
        self.initialize_drive_service()
    
    def initialize_drive_service(self):
        """Initialize Google Drive service with service account"""
        try:
            credentials = service_account.Credentials.from_service_account_file(
                SERVICE_ACCOUNT_FILE, scopes=SCOPES
            )
            self.service = build('drive', 'v3', credentials=credentials)
            print("✅ Google Drive service initialized with service account")
        except Exception as e:
            print(f"❌ Failed to initialize Google Drive service: {e}")
            raise e
    
    def create_user_folder(self, user_id: str, user_email: str) -> str:
        """Create or get user folder in Learnnect's Google Drive"""
        # Use email prefix + unique key for consistent folder naming
        email_prefix = user_email.split('@')[0].replace('.', '_').replace('-', '_')
        folder_name = f"Learnnect_{email_prefix}_{user_id[-8:]}"

        # Check if folder exists
        query = f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder' and trashed=false and '{LEARNNECT_FOLDER_ID}' in parents"
        results = self.service.files().list(q=query, fields='files(id)').execute()

        if results['files']:
            return results['files'][0]['id']

        # Create folder
        folder_metadata = {
            'name': folder_name,
            'mimeType': 'application/vnd.google-apps.folder',
            'parents': [LEARNNECT_FOLDER_ID]
        }
        
        folder = self.service.files().create(body=folder_metadata, fields='id').execute()
        print(f"✅ Created user folder: {folder_name}")
        return folder.get('id')

    def upload_resume(self, user_id: str, user_email: str, file: UploadFile, file_name: str) -> Dict:
        """Upload resume to user's folder in Learnnect's Google Drive"""
        try:
            print(f"🔄 Starting upload process:")
            print(f"   - user_id: {user_id}")
            print(f"   - user_email: {user_email}")
            print(f"   - file_name: {file_name}")

            # Get or create user folder
            print(f"📁 Creating/getting user folder...")
            folder_id = self.create_user_folder(user_id, user_email)
            print(f"📁 User folder ID: {folder_id}")
            
            # Prepare file metadata
            file_metadata = {
                'name': file_name,
                'parents': [folder_id]
            }
            
            # Upload file
            media = MediaIoBaseUpload(
                io.BytesIO(file.file.read()),
                mimetype=file.content_type,
                resumable=True
            )
            
            uploaded_file = self.service.files().create(
                body=file_metadata,
                media_body=media,
                fields='id'
            ).execute()
            
            file_id = uploaded_file.get('id')
            
            # Make file accessible (optional - depends on your security requirements)
            # self.service.permissions().create(
            #     fileId=file_id,
            #     body={'role': 'reader', 'type': 'anyone'}
            # ).execute()
            
            download_url = f"https://drive.google.com/file/d/{file_id}/view"
            
            print(f"✅ Resume uploaded: {file_name}")
            return {
                'success': True,
                'fileId': file_id,
                'downloadURL': download_url,
                'fileName': file_name
            }
            
        except Exception as e:
            print(f"❌ Upload failed: {e}")
            return {'success': False, 'error': str(e)}
    
    def get_user_resumes(self, user_id: str, user_email: str) -> List[Dict]:
        """Get all resumes for a user"""
        try:
            # Use same naming convention as create_user_folder
            email_prefix = user_email.split('@')[0].replace('.', '_').replace('-', '_')
            folder_name = f"Learnnect_{email_prefix}_{user_id[-8:]}"
            
            # Find user folder
            query = f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder' and trashed=false and '{LEARNNECT_FOLDER_ID}' in parents"
            results = self.service.files().list(q=query, fields='files(id)').execute()
            
            if not results['files']:
                return []
            
            folder_id = results['files'][0]['id']
            
            # Get files in folder
            query = f"'{folder_id}' in parents and trashed=false"
            results = self.service.files().list(
                q=query,
                fields='files(id, name, size, mimeType, createdTime)',
                orderBy='createdTime desc'
            ).execute()
            
            files = []
            for file in results['files']:
                files.append({
                    'id': file['id'],
                    'name': file['name'],
                    'size': int(file.get('size', 0)),
                    'mimeType': file['mimeType'],
                    'createdTime': file['createdTime'],
                    'downloadURL': f"https://drive.google.com/file/d/{file['id']}/view"
                })
            
            return files
            
        except Exception as e:
            print(f"❌ Failed to get user resumes: {e}")
            return []
    
    def delete_resume(self, file_id: str) -> bool:
        """Delete resume from Google Drive"""
        try:
            self.service.files().delete(fileId=file_id).execute()
            print(f"✅ Resume deleted: {file_id}")
            return True
        except Exception as e:
            print(f"❌ Failed to delete resume: {e}")
            return False

# Initialize storage service
print(f"🔧 Initializing storage service with folder ID: {LEARNNECT_FOLDER_ID}")
storage_service = LearnnectStorageService()

@app.get("/api/storage/health")
async def health_check():
    """Check if storage service is operational"""
    try:
        # Simple check - try to access the service
        if storage_service.service:
            return {"success": True, "status": "connected", "message": "Learnnect storage is operational"}
        else:
            raise HTTPException(status_code=503, detail="Storage service not available")
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Storage service error: {str(e)}")

@app.post("/api/storage/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    userId: str = Form(...),
    userEmail: str = Form(...),
    fileName: str = Form(...)
):
    """Upload resume to Learnnect storage"""
    try:
        print(f"🔄 Upload request received:")
        print(f"   - userId: {userId}")
        print(f"   - userEmail: {userEmail}")
        print(f"   - fileName: {fileName}")
        print(f"   - file.filename: {file.filename}")
        print(f"   - file.content_type: {file.content_type}")
        # Validate file type
        allowed_types = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Invalid file type. Only PDF, DOC, DOCX allowed.")
        
        # Validate file size (10MB limit)
        file.file.seek(0, 2)  # Seek to end
        file_size = file.file.tell()
        file.file.seek(0)  # Reset to beginning
        
        if file_size > 10 * 1024 * 1024:  # 10MB
            raise HTTPException(status_code=400, detail="File too large. Maximum size is 10MB.")
        
        result = storage_service.upload_resume(userId, userEmail, file, fileName)
        
        if result['success']:
            return result
        else:
            raise HTTPException(status_code=500, detail=result['error'])
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.get("/api/storage/user-resumes")
async def get_user_resumes(userId: str, userEmail: str):
    """Get all resumes for a user"""
    try:
        files = storage_service.get_user_resumes(userId, userEmail)
        return {"success": True, "files": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get resumes: {str(e)}")

@app.delete("/api/storage/delete-resume")
async def delete_resume(request: Dict):
    """Delete a resume"""
    try:
        file_id = request.get('fileId')
        user_id = request.get('userId')  # For verification/logging
        
        if not file_id:
            raise HTTPException(status_code=400, detail="File ID required")
        
        success = storage_service.delete_resume(file_id)
        
        if success:
            return {"success": True, "message": "Resume deleted successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to delete resume")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")

@app.get("/api/storage/download-url")
async def get_download_url(fileId: str, userId: str):
    """Get download URL for a resume"""
    try:
        # Simple implementation - just return the Google Drive view URL
        download_url = f"https://drive.google.com/file/d/{fileId}/view"
        return {"success": True, "downloadURL": download_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get download URL: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv('PORT', 8001))
    host = os.getenv('HOST', '0.0.0.0')
    debug = os.getenv('DEBUG', 'true').lower() == 'true'

    print(f"🚀 Starting server on {host}:{port}")
    uvicorn.run(app, host=host, port=port, debug=debug)
