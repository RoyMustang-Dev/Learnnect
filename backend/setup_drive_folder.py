#!/usr/bin/env python3
"""
Setup script to create the main Learnnect folder in Google Drive
"""

import os
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Configuration
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SERVICE_ACCOUNT_FILE = os.path.join(SCRIPT_DIR, 'service-account-key.json')
SCOPES = ['https://www.googleapis.com/auth/drive']

def setup_learnnect_folder():
    """Create or find the main Learnnect folder in Google Drive"""
    try:
        # Initialize Google Drive service
        credentials = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE, scopes=SCOPES
        )
        service = build('drive', 'v3', credentials=credentials)
        
        print("✅ Google Drive service initialized")
        
        # Check if Learnnect folder already exists
        folder_name = "Learnnect_Platform_Storage"
        query = f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder' and trashed=false"
        
        print(f"🔍 Searching for folder: {folder_name}")
        results = service.files().list(q=query, fields='files(id, name)').execute()
        
        if results['files']:
            folder_id = results['files'][0]['id']
            print(f"✅ Found existing Learnnect folder: {folder_id}")
        else:
            # Create the main Learnnect folder
            print(f"📁 Creating main Learnnect folder...")
            folder_metadata = {
                'name': folder_name,
                'mimeType': 'application/vnd.google-apps.folder'
            }
            
            folder = service.files().create(body=folder_metadata, fields='id').execute()
            folder_id = folder.get('id')
            print(f"✅ Created Learnnect folder: {folder_id}")
        
        # Update the environment variable
        env_file_path = os.path.join(os.path.dirname(SCRIPT_DIR), '.env')
        
        # Read existing .env file
        env_lines = []
        if os.path.exists(env_file_path):
            with open(env_file_path, 'r') as f:
                env_lines = f.readlines()
        
        # Update or add the folder ID
        updated = False
        for i, line in enumerate(env_lines):
            if line.startswith('LEARNNECT_DRIVE_FOLDER_ID='):
                env_lines[i] = f'LEARNNECT_DRIVE_FOLDER_ID={folder_id}\n'
                updated = True
                break
        
        if not updated:
            env_lines.append(f'\n# Learnnect Google Drive Storage\nLEARNNECT_DRIVE_FOLDER_ID={folder_id}\n')
        
        # Write back to .env file
        with open(env_file_path, 'w') as f:
            f.writelines(env_lines)
        
        print(f"✅ Updated .env file with folder ID: {folder_id}")
        print(f"📁 Learnnect folder URL: https://drive.google.com/drive/folders/{folder_id}")
        
        return folder_id
        
    except Exception as e:
        print(f"❌ Setup failed: {e}")
        return None

if __name__ == "__main__":
    print("🚀 Setting up Learnnect Google Drive folder...")
    folder_id = setup_learnnect_folder()
    
    if folder_id:
        print("\n🎉 Setup completed successfully!")
        print(f"📋 Folder ID: {folder_id}")
        print("🔄 Please restart the storage service to use the new folder ID")
    else:
        print("\n❌ Setup failed. Please check the error messages above.")
