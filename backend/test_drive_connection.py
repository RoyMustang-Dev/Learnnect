#!/usr/bin/env python3
"""
Test Google Drive Connection for Learnnect Storage
This script tests the Google Drive API connection independently
"""

import os
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.storage')
load_dotenv('.env')

def test_drive_connection():
    """Test Google Drive API connection"""
    print("🔍 Testing Google Drive Connection")
    print("=" * 40)
    
    # Get service account JSON
    service_account_json = os.getenv('GOOGLE_SERVICE_ACCOUNT_JSON')
    folder_id = os.getenv('LEARNNECT_DRIVE_FOLDER_ID', '1w-7EywK43Pn1GkwRqzScE1qbnh8GUwdd')
    
    if not service_account_json:
        print("❌ GOOGLE_SERVICE_ACCOUNT_JSON not found in environment")
        return False
    
    try:
        # Parse and fix JSON
        print("📋 Parsing service account JSON...")
        service_account_info = json.loads(service_account_json)
        
        # Fix private key formatting if needed
        if 'private_key' in service_account_info:
            private_key = service_account_info['private_key']
            if '\\n' in private_key:
                service_account_info['private_key'] = private_key.replace('\\n', '\n')
                print("🔧 Fixed private key formatting")
        
        print(f"📧 Service Account: {service_account_info.get('client_email', 'Unknown')}")
        print(f"🆔 Project ID: {service_account_info.get('project_id', 'Unknown')}")
        
        # Create credentials
        print("🔑 Creating credentials...")
        scopes = ['https://www.googleapis.com/auth/drive']
        credentials = service_account.Credentials.from_service_account_info(
            service_account_info, scopes=scopes
        )
        
        # Build service
        print("🔨 Building Drive service...")
        service = build('drive', 'v3', credentials=credentials)
        
        # Test connection
        print("🌐 Testing API connection...")
        about = service.about().get(fields='user').execute()
        user_email = about.get('user', {}).get('emailAddress', 'Service Account')
        print(f"✅ Connected successfully as: {user_email}")
        
        # Test folder access
        print(f"📁 Testing folder access (ID: {folder_id})...")
        try:
            folder = service.files().get(fileId=folder_id, fields='id,name,permissions').execute()
            print(f"✅ Folder accessible: {folder.get('name', 'Unknown')}")
            
            # List some files in the folder
            print("📄 Listing files in folder...")
            results = service.files().list(
                q=f"'{folder_id}' in parents and trashed=false",
                fields='files(id,name,mimeType)',
                pageSize=5
            ).execute()
            
            files = results.get('files', [])
            if files:
                print(f"📋 Found {len(files)} files:")
                for file in files:
                    print(f"   - {file['name']} ({file['mimeType']})")
            else:
                print("📋 No files found in folder (this is normal for a new setup)")
                
        except Exception as folder_error:
            print(f"❌ Folder access failed: {folder_error}")
            print("💡 Make sure the service account has access to the folder")
            return False
        
        print("\n✅ All tests passed! Google Drive connection is working.")
        return True
        
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON format: {e}")
        return False
    except Exception as e:
        error_str = str(e)
        print(f"❌ Connection test failed: {e}")
        
        # Provide specific guidance
        if 'invalid_grant' in error_str and 'Invalid JWT Signature' in error_str:
            print("\n💡 JWT Signature error solutions:")
            print("1. Check if private key has proper newline formatting")
            print("2. Verify system clock is synchronized")
            print("3. Regenerate service account key if needed")
        elif 'invalid_grant' in error_str:
            print("\n💡 Invalid grant solutions:")
            print("1. Check service account key validity")
            print("2. Verify service account permissions")
            print("3. Make sure Google Drive API is enabled")
        elif 'forbidden' in error_str.lower():
            print("\n💡 Permission denied solutions:")
            print("1. Enable Google Drive API in Google Cloud Console")
            print("2. Grant service account access to the Drive folder")
            print("3. Check service account roles and permissions")
        
        return False

def main():
    success = test_drive_connection()
    
    if success:
        print("\n🎉 Google Drive is ready for Learnnect Storage!")
    else:
        print("\n❌ Google Drive connection failed. Please fix the issues above.")
        print("\nFor help:")
        print("1. Run: python fix_service_account.py")
        print("2. Check Google Cloud Console for API settings")
        print("3. Verify service account permissions")

if __name__ == "__main__":
    main()
