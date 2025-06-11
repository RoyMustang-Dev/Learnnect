#!/usr/bin/env python3
"""
Learnnect Storage Setup Script
Helps configure and test Google Drive service account setup
"""

import os
import json
import sys
from pathlib import Path
from google.oauth2 import service_account
from googleapiclient.discovery import build

def check_service_account_file():
    """Check if service account key file exists and is valid"""
    key_path = os.getenv('GOOGLE_SERVICE_ACCOUNT_KEY_PATH', './service-account-key.json')
    
    if not os.path.exists(key_path):
        print(f"❌ Service account key file not found: {key_path}")
        print("📋 Please download the JSON key file from Google Cloud Console")
        print("   1. Go to Google Cloud Console > IAM & Admin > Service Accounts")
        print("   2. Click on your service account")
        print("   3. Go to Keys tab > Add Key > Create New Key > JSON")
        print(f"   4. Save the file as: {key_path}")
        return False
    
    try:
        with open(key_path, 'r') as f:
            key_data = json.load(f)
        
        required_fields = ['type', 'project_id', 'client_email', 'private_key']
        missing_fields = [field for field in required_fields if field not in key_data]
        
        if missing_fields:
            print(f"❌ Invalid service account key file. Missing fields: {missing_fields}")
            return False
        
        print(f"✅ Service account key file found and valid")
        print(f"   📧 Service account email: {key_data['client_email']}")
        print(f"   🆔 Project ID: {key_data['project_id']}")
        return True
        
    except json.JSONDecodeError:
        print(f"❌ Invalid JSON in service account key file: {key_path}")
        return False
    except Exception as e:
        print(f"❌ Error reading service account key file: {e}")
        return False

def test_drive_connection():
    """Test connection to Google Drive API"""
    try:
        key_path = os.getenv('GOOGLE_SERVICE_ACCOUNT_KEY_PATH', './service-account-key.json')
        
        credentials = service_account.Credentials.from_service_account_file(
            key_path,
            scopes=['https://www.googleapis.com/auth/drive']
        )
        
        service = build('drive', 'v3', credentials=credentials)
        
        # Test basic API access
        about = service.about().get(fields='user').execute()
        print(f"✅ Google Drive API connection successful")
        print(f"   👤 Connected as: {about.get('user', {}).get('emailAddress', 'Service Account')}")
        
        return service
        
    except Exception as e:
        print(f"❌ Failed to connect to Google Drive API: {e}")
        print("📋 Troubleshooting steps:")
        print("   1. Ensure Google Drive API is enabled in Google Cloud Console")
        print("   2. Check service account key file is valid")
        print("   3. Verify service account has necessary permissions")
        return None

def test_folder_access():
    """Test access to the Learnnect storage folder"""
    folder_id = os.getenv('LEARNNECT_DRIVE_FOLDER_ID')
    
    if not folder_id:
        print("❌ LEARNNECT_DRIVE_FOLDER_ID not set in environment")
        print("📋 Please set the folder ID in your .env file")
        print("   1. Create a folder in Google Drive")
        print("   2. Right-click > Get link")
        print("   3. Extract ID from URL: https://drive.google.com/drive/folders/FOLDER_ID")
        return False
    
    service = test_drive_connection()
    if not service:
        return False
    
    try:
        folder = service.files().get(fileId=folder_id).execute()
        print(f"✅ Folder access successful")
        print(f"   📁 Folder name: {folder['name']}")
        print(f"   🆔 Folder ID: {folder_id}")
        
        # Test if we can list files in the folder
        files = service.files().list(
            q=f"'{folder_id}' in parents and trashed=false",
            fields='files(id, name)'
        ).execute()
        
        file_count = len(files.get('files', []))
        print(f"   📄 Files in folder: {file_count}")
        
        return True
        
    except Exception as e:
        print(f"❌ Cannot access folder {folder_id}: {e}")
        print("📋 Troubleshooting steps:")
        print("   1. Verify folder ID is correct")
        print("   2. Share folder with service account email")
        print("   3. Grant 'Editor' permissions to service account")
        return False

def create_test_file():
    """Create a test file to verify upload functionality"""
    service = test_drive_connection()
    folder_id = os.getenv('LEARNNECT_DRIVE_FOLDER_ID')
    
    if not service or not folder_id:
        return False
    
    try:
        # Create a simple test file
        file_metadata = {
            'name': 'learnnect_test_file.txt',
            'parents': [folder_id]
        }
        
        from googleapiclient.http import MediaIoBaseUpload
        import io
        
        test_content = "This is a test file created by Learnnect Storage Setup.\nIf you see this, the setup is working correctly!"
        media = MediaIoBaseUpload(
            io.BytesIO(test_content.encode()),
            mimetype='text/plain',
            resumable=True
        )
        
        file = service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id'
        ).execute()
        
        print(f"✅ Test file upload successful")
        print(f"   📄 File ID: {file.get('id')}")
        print(f"   🔗 View at: https://drive.google.com/file/d/{file.get('id')}/view")
        
        # Clean up test file
        service.files().delete(fileId=file.get('id')).execute()
        print(f"✅ Test file cleaned up")
        
        return True
        
    except Exception as e:
        print(f"❌ Test file upload failed: {e}")
        return False

def check_environment():
    """Check all required environment variables"""
    required_vars = [
        'GOOGLE_SERVICE_ACCOUNT_KEY_PATH',
        'LEARNNECT_DRIVE_FOLDER_ID',
        'GOOGLE_CLOUD_PROJECT_ID'
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"❌ Missing environment variables: {missing_vars}")
        print("📋 Please set these in your .env file")
        return False
    
    print("✅ All required environment variables are set")
    return True

def main():
    """Main setup and test function"""
    print("🚀 Learnnect Storage Setup & Test")
    print("=" * 50)
    
    # Load environment variables from .env.storage file if it exists
    env_file = Path('.env.storage')
    if env_file.exists():
        print("📄 Loading environment from .env.storage file")
        with open(env_file) as f:
            for line in f:
                if '=' in line and not line.startswith('#'):
                    key, value = line.strip().split('=', 1)
                    os.environ[key] = value
    else:
        print("⚠️  No .env.storage file found. Using system environment variables.")
    
    print()
    
    # Run all checks
    checks = [
        ("Environment Variables", check_environment),
        ("Service Account Key", check_service_account_file),
        ("Google Drive Connection", lambda: test_drive_connection() is not None),
        ("Folder Access", test_folder_access),
        ("Upload Test", create_test_file)
    ]
    
    results = []
    for name, check_func in checks:
        print(f"🔍 Checking {name}...")
        try:
            result = check_func()
            results.append((name, result))
        except Exception as e:
            print(f"❌ Error during {name} check: {e}")
            results.append((name, False))
        print()
    
    # Summary
    print("📊 Setup Summary")
    print("=" * 50)
    
    all_passed = True
    for name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} {name}")
        if not passed:
            all_passed = False
    
    print()
    if all_passed:
        print("🎉 All checks passed! Learnnect Storage is ready to use.")
        print("🚀 You can now start the backend API with: python learnnect_storage_api.py")
    else:
        print("⚠️  Some checks failed. Please review the errors above and fix them.")
        print("📖 See GOOGLE_DRIVE_SERVICE_ACCOUNT_SETUP.md for detailed instructions.")
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())
