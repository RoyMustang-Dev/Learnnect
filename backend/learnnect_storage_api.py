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
cors_origins = os.getenv('CORS_ORIGINS', '["http://localhost:3000", "http://localhost:5173", "https://learnnect.com", "https://www.learnnect.com"]')
try:
    allowed_origins = ast.literal_eval(cors_origins)
except:
    allowed_origins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://learnnect.com",
        "https://www.learnnect.com"
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Google Drive Service Account Configuration
# Use environment variables for service account credentials
GOOGLE_SERVICE_ACCOUNT_JSON = os.getenv('GOOGLE_SERVICE_ACCOUNT_JSON')
SCOPES = ['https://www.googleapis.com/auth/drive']
LEARNNECT_FOLDER_ID = os.getenv('LEARNNECT_DRIVE_FOLDER_ID', '1OvFZ4qRHP2GrTs8Af-34qMcrGzoMbWE8')

class LearnnectStorageService:
    def __init__(self):
        self.service = None
        self.initialize_drive_service()
    
    def initialize_drive_service(self):
        """Initialize Google Drive service with service account"""
        try:
            credentials = None

            # Try JSON string from environment variable first (production)
            if GOOGLE_SERVICE_ACCOUNT_JSON:
                try:
                    print("🔧 Using service account JSON from environment variable")
                    print(f"📏 JSON length: {len(GOOGLE_SERVICE_ACCOUNT_JSON)} characters")
                    service_account_info = json.loads(GOOGLE_SERVICE_ACCOUNT_JSON)

                    # Validate required fields
                    required_fields = ['type', 'project_id', 'private_key_id', 'private_key', 'client_email']
                    missing_fields = [field for field in required_fields if field not in service_account_info]
                    if missing_fields:
                        raise Exception(f"Service account JSON missing required fields: {missing_fields}")

                    # Fix common private key formatting issues
                    if 'private_key' in service_account_info:
                        private_key = service_account_info['private_key']
                        print(f"🔍 Private key starts with: {repr(private_key[:80])}")
                        print(f"🔍 Private key ends with: {repr(private_key[-80:])}")

                        # Handle various newline encoding issues
                        original_key = private_key

                        # Case 1: Double-escaped newlines (\\n)
                        if '\\\\n' in private_key:
                            private_key = private_key.replace('\\\\n', '\n')
                            print("🔧 Fixed double-escaped newlines (\\\\n -> \\n)")

                        # Case 2: Single-escaped newlines (\n) but no actual newlines
                        elif '\\n' in private_key and '\n' not in private_key:
                            private_key = private_key.replace('\\n', '\n')
                            print("🔧 Fixed escaped newlines (\\n -> actual newlines)")

                        # Case 3: JSON-escaped newlines from environment variable
                        elif private_key.count('\\n') > private_key.count('\n'):
                            private_key = private_key.replace('\\n', '\n')
                            print("🔧 Fixed JSON-escaped newlines")

                        # Ensure proper format
                        if not private_key.startswith('-----BEGIN PRIVATE KEY-----'):
                            print("❌ Private key doesn't start with proper header")

                        if not private_key.strip().endswith('-----END PRIVATE KEY-----'):
                            print("❌ Private key doesn't end with proper footer")

                        # Ensure final newline
                        if not private_key.endswith('\n'):
                            private_key = private_key + '\n'
                            print("🔧 Added missing final newline")

                        service_account_info['private_key'] = private_key

                        if private_key != original_key:
                            print("✅ Private key formatting was fixed")
                        else:
                            print("✅ Private key formatting was already correct")

                    # Try to create credentials
                    try:
                        credentials = service_account.Credentials.from_service_account_info(
                            service_account_info, scopes=SCOPES
                        )
                        print(f"✅ Service account loaded: {service_account_info.get('client_email', 'unknown')}")
                    except Exception as cred_error:
                        print(f"❌ Failed to create credentials: {cred_error}")
                        # If it's a JWT signature error, try one more fix
                        if 'Invalid JWT Signature' in str(cred_error):
                            print("🔧 Attempting additional private key fix...")
                            # Try to reconstruct the private key properly
                            private_key = service_account_info['private_key']
                            # Remove all existing newlines and re-add them properly
                            key_lines = private_key.replace('\n', '').replace('\\n', '')
                            # Split at the standard points
                            if '-----BEGIN PRIVATE KEY----------' in key_lines:
                                key_lines = key_lines.replace('-----BEGIN PRIVATE KEY----------', '-----BEGIN PRIVATE KEY-----\n')
                                key_lines = key_lines.replace('-----END PRIVATE KEY-----', '\n-----END PRIVATE KEY-----\n')
                                # Add newlines every 64 characters in the middle
                                parts = key_lines.split('\n')
                                if len(parts) >= 2:
                                    middle = parts[1].replace('-----END PRIVATE KEY-----', '')
                                    formatted_middle = '\n'.join([middle[i:i+64] for i in range(0, len(middle), 64)])
                                    service_account_info['private_key'] = f"{parts[0]}\n{formatted_middle}\n-----END PRIVATE KEY-----\n"
                                    print("🔧 Reconstructed private key with proper formatting")

                                    credentials = service_account.Credentials.from_service_account_info(
                                        service_account_info, scopes=SCOPES
                                    )
                                    print("✅ Service account loaded after key reconstruction")
                                else:
                                    raise cred_error
                            else:
                                raise cred_error
                        else:
                            raise cred_error
                except json.JSONDecodeError as e:
                    raise Exception(f"Invalid JSON in GOOGLE_SERVICE_ACCOUNT_JSON: {e}")
                except Exception as e:
                    print(f"❌ Failed to load service account from JSON: {e}")
                    raise e
            else:
                # Fallback to local file for development
                service_account_file = os.path.join(os.path.dirname(__file__), 'service-account-key.json')
                if os.path.exists(service_account_file):
                    print(f"🔧 Using service account file: {service_account_file}")
                    credentials = service_account.Credentials.from_service_account_file(
                        service_account_file, scopes=SCOPES
                    )
                    print("✅ Service account loaded from file")
                else:
                    raise Exception(
                        "No service account credentials found. "
                        "Set GOOGLE_SERVICE_ACCOUNT_JSON environment variable or "
                        "place service-account-key.json in backend directory."
                    )

            if not credentials:
                raise Exception("Failed to create service account credentials")

            # Build the service
            self.service = build('drive', 'v3', credentials=credentials)

            # Test the connection with more detailed checks
            try:
                # Test 1: Basic API access
                about = self.service.about().get(fields='user').execute()
                user_email = about.get('user', {}).get('emailAddress', 'Service Account')
                print(f"✅ Google Drive API connection successful")
                print(f"   👤 Connected as: {user_email}")

                # Test 2: Check folder access
                try:
                    folder = self.service.files().get(fileId=LEARNNECT_FOLDER_ID, fields='id,name').execute()
                    print(f"✅ Learnnect folder accessible: {folder.get('name', 'Unknown')}")
                except Exception as folder_error:
                    print(f"⚠️ Cannot access Learnnect folder: {folder_error}")
                    print(f"   Folder ID: {LEARNNECT_FOLDER_ID}")
                    print("   Make sure the service account has access to this folder")

            except Exception as test_error:
                error_str = str(test_error)
                print(f"❌ Google Drive API connection failed: {test_error}")

                # Provide specific guidance for common errors
                if 'invalid_grant' in error_str and 'Invalid JWT Signature' in error_str:
                    print("💡 JWT Signature error solutions:")
                    print("   1. Regenerate service account key in Google Cloud Console")
                    print("   2. Check system clock synchronization")
                    print("   3. Verify private key formatting in environment variable")
                elif 'invalid_grant' in error_str:
                    print("💡 Invalid grant error - check service account permissions and key validity")
                elif 'forbidden' in error_str.lower():
                    print("💡 Permission denied - enable Google Drive API and grant folder access")

                # Don't raise exception to allow API to start
                self.service = None

        except Exception as e:
            print(f"❌ Failed to initialize Google Drive service: {e}")
            self.service = None
            # Don't raise the exception to allow the API to start without Google Drive
            # raise e
    
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

    def create_subfolder(self, parent_folder_id: str, subfolder_name: str) -> str:
        """Create or get subfolder within user's folder"""
        try:
            # Check if subfolder already exists
            query = f"name='{subfolder_name}' and parents in '{parent_folder_id}' and mimeType='application/vnd.google-apps.folder' and trashed=false"
            results = self.service.files().list(q=query, fields='files(id, name)').execute()
            folders = results.get('files', [])

            if folders:
                print(f"📁 Subfolder exists: {subfolder_name}")
                return folders[0]['id']

            # Create new subfolder
            folder_metadata = {
                'name': subfolder_name,
                'parents': [parent_folder_id],
                'mimeType': 'application/vnd.google-apps.folder'
            }

            folder = self.service.files().create(body=folder_metadata, fields='id').execute()
            folder_id = folder.get('id')

            print(f"📁 Created subfolder: {subfolder_name} (ID: {folder_id})")
            return folder_id

        except Exception as e:
            print(f"❌ Error creating subfolder: {e}")
            raise Exception(f"Failed to create subfolder: {str(e)}")

    def cleanup_old_files(self, folder_id: str, file_prefix: str, keep_count: int = 3):
        """Keep only the latest N files with given prefix in folder"""
        try:
            # Get all files with the prefix, sorted by creation time (newest first)
            query = f"parents in '{folder_id}' and name contains '{file_prefix}' and trashed=false"
            results = self.service.files().list(
                q=query,
                fields='files(id, name, createdTime)',
                orderBy='createdTime desc'
            ).execute()
            files = results.get('files', [])

            # Delete files beyond the keep_count
            if len(files) > keep_count:
                files_to_delete = files[keep_count:]
                for file in files_to_delete:
                    try:
                        self.service.files().delete(fileId=file['id']).execute()
                        print(f"🗑️ Deleted old file: {file['name']}")
                    except Exception as e:
                        print(f"⚠️ Failed to delete file {file['name']}: {e}")

                print(f"✅ Cleaned up {len(files_to_delete)} old files, kept {keep_count} latest")
            else:
                print(f"✅ No cleanup needed, {len(files)} files (≤ {keep_count})")

        except Exception as e:
            print(f"⚠️ Error during cleanup: {e}")
            # Don't raise exception - cleanup failure shouldn't break upload

    def upload_resume(self, user_id: str, user_email: str, file: UploadFile, file_name: str) -> Dict:
        """Upload resume to user's folder in Learnnect's Google Drive"""
        try:
            print(f"🔄 Starting upload process:")
            print(f"   - user_id: {user_id}")
            print(f"   - user_email: {user_email}")
            print(f"   - file_name: {file_name}")

            # Get or create user folder
            print(f"📁 Creating/getting user folder...")
            user_folder_id = self.create_user_folder(user_id, user_email)
            print(f"📁 User folder ID: {user_folder_id}")

            # Create Resume subfolder
            print(f"📁 Creating/getting Resume subfolder...")
            resume_folder_id = self.create_subfolder(user_folder_id, "Profile-Resume")
            print(f"📁 Resume folder ID: {resume_folder_id}")

            # Prepare file metadata
            file_metadata = {
                'name': file_name,
                'parents': [resume_folder_id]
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
            error_str = str(e)
            print(f"❌ Upload failed: {e}")

            # Provide user-friendly error messages
            if 'invalid_grant' in error_str and 'Invalid JWT Signature' in error_str:
                user_error = "Storage service authentication error. Please contact support."
            elif 'invalid_grant' in error_str:
                user_error = "Storage service permission error. Please contact support."
            elif 'forbidden' in error_str.lower():
                user_error = "Storage service access denied. Please contact support."
            elif 'quota' in error_str.lower():
                user_error = "Storage quota exceeded. Please contact support."
            else:
                user_error = "Upload failed due to a technical error. Please try again or contact support."

            return {'success': False, 'error': user_error, 'technical_error': error_str}

    def upload_profile_image(self, user_id: str, user_email: str, file: UploadFile, file_name: str, image_type: str) -> Dict:
        """Upload profile image (profile picture or banner) to user's folder with proper structure"""
        try:
            print(f"🔄 Starting image upload process:")
            print(f"   - user_id: {user_id}")
            print(f"   - user_email: {user_email}")
            print(f"   - file_name: {file_name}")
            print(f"   - image_type: {image_type}")

            # Get or create user folder
            print(f"📁 Creating/getting user folder...")
            user_folder_id = self.create_user_folder(user_id, user_email)
            print(f"📁 User folder ID: {user_folder_id}")

            # Create appropriate subfolder based on image type
            subfolder_name = "Profile-Picture" if image_type == "profile" else "Profile-Banner"
            print(f"📁 Creating/getting subfolder: {subfolder_name}")
            subfolder_id = self.create_subfolder(user_folder_id, subfolder_name)
            print(f"📁 Subfolder ID: {subfolder_id}")

            # Cleanup old files before uploading new one
            file_prefix = "profile_" if image_type == "profile" else "banner_"
            print(f"🧹 Cleaning up old {image_type} images...")
            self.cleanup_old_files(subfolder_id, file_prefix, keep_count=3)

            # Prepare file metadata
            file_metadata = {
                'name': file_name,
                'parents': [subfolder_id]
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

            # Make file publicly viewable for profile images
            try:
                permission_result = self.service.permissions().create(
                    fileId=file_id,
                    body={
                        'role': 'reader',
                        'type': 'anyone',
                        'allowFileDiscovery': False
                    }
                ).execute()
                print(f"✅ Made image publicly viewable: {permission_result}")
            except Exception as perm_error:
                print(f"⚠️ Could not make image public: {perm_error}")

            # Generate direct image URL for better performance
            # Use the thumbnail API which is more reliable for public images
            download_url = f"https://drive.google.com/thumbnail?id={file_id}&sz=w1000"

            # Also provide alternative URLs for debugging
            alt_urls = {
                'thumbnail': f"https://drive.google.com/thumbnail?id={file_id}&sz=w1000",
                'direct': f"https://drive.google.com/uc?export=download&id={file_id}",
                'view': f"https://drive.google.com/file/d/{file_id}/view",
                'simple': f"https://drive.google.com/uc?id={file_id}"
            }
            print(f"📸 Generated URLs for {image_type} image:")
            print(f"   Primary: {download_url}")
            print(f"   Alternatives: {alt_urls}")

            print(f"✅ {image_type.title()} image uploaded: {file_name}")
            return {
                'success': True,
                'fileId': file_id,
                'downloadURL': download_url,
                'fileName': file_name,
                'imageType': image_type
            }

        except Exception as e:
            error_str = str(e)
            print(f"❌ Image upload failed: {e}")

            # Provide user-friendly error messages
            if 'invalid_grant' in error_str and 'Invalid JWT Signature' in error_str:
                user_error = "Storage service authentication error. Please contact support."
            elif 'invalid_grant' in error_str:
                user_error = "Storage service permission error. Please contact support."
            elif 'forbidden' in error_str.lower():
                user_error = "Storage service access denied. Please contact support."
            elif 'quota' in error_str.lower():
                user_error = "Storage quota exceeded. Please contact support."
            else:
                user_error = "Image upload failed due to a technical error. Please try again or contact support."

            return {'success': False, 'error': user_error, 'technical_error': error_str}
    
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

    def delete_profile_image(self, user_id: str, user_email: str, image_type: str) -> Dict:
        """Delete all profile images of a specific type for a user"""
        try:
            print(f"🔄 Starting image deletion process:")
            print(f"   - user_id: {user_id}")
            print(f"   - user_email: {user_email}")
            print(f"   - image_type: {image_type}")

            # Get or create user folder
            user_folder_id = self.create_user_folder(user_id, user_email)

            # Get appropriate subfolder based on image type
            subfolder_name = "Profile-Picture" if image_type == "profile" else "Profile-Banner"
            subfolder_id = self.create_subfolder(user_folder_id, subfolder_name)

            # Get all files in the subfolder
            file_prefix = "profile_" if image_type == "profile" else "banner_"
            query = f"parents in '{subfolder_id}' and name contains '{file_prefix}' and trashed=false"
            results = self.service.files().list(
                q=query,
                fields='files(id, name)',
                orderBy='createdTime desc'
            ).execute()
            files = results.get('files', [])

            # Delete all files
            deleted_count = 0
            for file in files:
                try:
                    self.service.files().delete(fileId=file['id']).execute()
                    print(f"🗑️ Deleted image: {file['name']}")
                    deleted_count += 1
                except Exception as e:
                    print(f"⚠️ Failed to delete file {file['name']}: {e}")

            print(f"✅ Deleted {deleted_count} {image_type} images")
            return {
                'success': True,
                'deletedCount': deleted_count,
                'imageType': image_type
            }

        except Exception as e:
            error_str = str(e)
            print(f"❌ Image deletion failed: {e}")
            return {'success': False, 'error': f"Failed to delete {image_type} images: {error_str}"}

# Initialize storage service
print(f"🔧 Initializing storage service with folder ID: {LEARNNECT_FOLDER_ID}")
storage_service = LearnnectStorageService()

@app.get("/api/storage/health")
async def health_check():
    """Check if storage service is operational"""
    try:
        # Check if service is initialized
        if storage_service.service:
            try:
                # Test actual connection to Google Drive
                about = storage_service.service.about().get(fields='user').execute()
                user_email = about.get('user', {}).get('emailAddress', 'Service Account')
                return {
                    "success": True,
                    "status": "connected",
                    "message": "Learnnect storage is operational",
                    "service_account": user_email,
                    "folder_id": LEARNNECT_FOLDER_ID
                }
            except Exception as drive_error:
                return {
                    "success": False,
                    "status": "service_error",
                    "message": f"Google Drive API error: {str(drive_error)}",
                    "folder_id": LEARNNECT_FOLDER_ID
                }
        else:
            return {
                "success": False,
                "status": "not_initialized",
                "message": "Storage service not initialized - check service account credentials",
                "folder_id": LEARNNECT_FOLDER_ID
            }
    except Exception as e:
        return {
            "success": False,
            "status": "error",
            "message": f"Storage service error: {str(e)}",
            "folder_id": LEARNNECT_FOLDER_ID
        }

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

        # Check if storage service is available
        if not storage_service.service:
            raise HTTPException(
                status_code=503,
                detail="Storage service not available. Please check service account configuration."
            )

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

@app.post("/api/storage/upload-image")
async def upload_image(
    file: UploadFile = File(...),
    userId: str = Form(...),
    userEmail: str = Form(...),
    fileName: str = Form(...),
    imageType: str = Form(...)
):
    """Upload profile image (profile picture or banner) to Learnnect storage"""
    try:
        print(f"🔄 Image upload request received:")
        print(f"   - userId: {userId}")
        print(f"   - userEmail: {userEmail}")
        print(f"   - fileName: {fileName}")
        print(f"   - imageType: {imageType}")
        print(f"   - file.filename: {file.filename}")
        print(f"   - file.content_type: {file.content_type}")

        # Check if storage service is available
        if not storage_service.service:
            raise HTTPException(
                status_code=503,
                detail="Storage service not available. Please check service account configuration."
            )

        # Validate image type
        if imageType not in ['profile', 'banner']:
            raise HTTPException(status_code=400, detail="Invalid image type. Must be 'profile' or 'banner'.")

        # Validate file type
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, and WebP images allowed.")

        # Validate file size (5MB limit for images)
        file.file.seek(0, 2)  # Seek to end
        file_size = file.file.tell()
        file.file.seek(0)  # Reset to beginning

        if file_size > 5 * 1024 * 1024:  # 5MB
            raise HTTPException(status_code=400, detail="File too large. Maximum size is 5MB.")

        result = storage_service.upload_profile_image(userId, userEmail, file, fileName, imageType)

        if result['success']:
            return result
        else:
            raise HTTPException(status_code=500, detail=result['error'])

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")

@app.get("/api/storage/check-existing-image")
async def check_existing_image(
    userId: str,
    userEmail: str,
    imageType: str
):
    """Check if user has existing image of the specified type"""
    try:
        print(f"🔍 Checking existing image:")
        print(f"   - userId: {userId}")
        print(f"   - userEmail: {userEmail}")
        print(f"   - imageType: {imageType}")

        # Check if storage service is available
        if not storage_service.service:
            raise HTTPException(
                status_code=503,
                detail="Storage service not available. Please check service account configuration."
            )

        # Validate image type
        if imageType not in ['profile', 'banner']:
            raise HTTPException(status_code=400, detail="Invalid image type. Must be 'profile' or 'banner'.")

        # Get or create user folder
        user_folder_id = storage_service.create_user_folder(userId, userEmail)

        # Create appropriate subfolder based on image type
        subfolder_name = "Profile-Picture" if imageType == "profile" else "Profile-Banner"
        subfolder_id = storage_service.create_subfolder(user_folder_id, subfolder_name)

        # Check for existing files in the subfolder
        file_prefix = "profile_" if imageType == "profile" else "banner_"

        # List files in the subfolder
        results = storage_service.service.files().list(
            q=f"'{subfolder_id}' in parents and name contains '{file_prefix}' and trashed=false",
            fields="files(id, name, size, createdTime, mimeType)"
        ).execute()

        files = results.get('files', [])

        if files:
            # Return info about the most recent file
            latest_file = max(files, key=lambda f: f['createdTime'])
            return {
                "hasExisting": True,
                "existingInfo": {
                    "name": latest_file['name'],
                    "uploadedAt": latest_file['createdTime'],
                    "size": storage_service.format_file_size(int(latest_file.get('size', 0)))
                }
            }
        else:
            return {"hasExisting": False}

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error checking existing image: {str(e)}")
        return {"hasExisting": False}

@app.delete("/api/storage/delete-image")
async def delete_image(request: Dict):
    """Delete profile image (profile picture or banner)"""
    try:
        user_id = request.get('userId')
        user_email = request.get('userEmail')
        image_type = request.get('imageType')

        if not user_id or not user_email or not image_type:
            raise HTTPException(status_code=400, detail="User ID, email, and image type required")

        if image_type not in ['profile', 'banner']:
            raise HTTPException(status_code=400, detail="Invalid image type. Must be 'profile' or 'banner'.")

        result = storage_service.delete_profile_image(user_id, user_email, image_type)

        if result['success']:
            return result
        else:
            raise HTTPException(status_code=500, detail=result['error'])

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")

@app.get("/api/storage/check-user-folder")
async def check_user_folder(userId: str, userEmail: str):
    """Check if user has existing storage folder"""
    try:
        # Use same naming convention as create_user_folder
        email_prefix = userEmail.split('@')[0].replace('.', '_').replace('-', '_')
        folder_name = f"Learnnect_{email_prefix}_{userId[-8:]}"

        # Find user folder
        query = f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder' and trashed=false and '{LEARNNECT_FOLDER_ID}' in parents"
        results = storage_service.service.files().list(q=query, fields='files(id)').execute()

        has_folder = len(results.get('files', [])) > 0

        return {
            "success": True,
            "hasFolder": has_folder,
            "folderName": folder_name,
            "isFirstTime": not has_folder
        }

    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to check user folder: {str(e)}",
            "isFirstTime": True  # Default to first time on error
        }

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
