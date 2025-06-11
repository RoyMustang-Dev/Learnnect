# 🔧 Google Drive Service Account Setup Guide

## Overview
This guide will help you set up Learnnect's Google Drive service account for centralized resume storage.

## 📋 Prerequisites
- Google Cloud Console access
- Admin rights to create service accounts
- Google Drive access for Learnnect organization

## 🚀 Step-by-Step Setup

### 1. Create Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Learnnect Google account

2. **Create New Project**
   ```
   Project Name: Learnnect Storage
   Project ID: learnnect-storage-project (or auto-generated)
   Organization: Your organization (if applicable)
   ```

3. **Note Down Project Details**
   ```
   Project ID: learnnect-storage-project
   Project Number: 123456789012 (example)
   ```

### 2. Enable Google Drive API

1. **Navigate to APIs & Services**
   - Go to: APIs & Services > Library
   - Search for "Google Drive API"
   - Click "Enable"

2. **Verify API is Enabled**
   - Go to: APIs & Services > Enabled APIs
   - Confirm "Google Drive API" is listed

### 3. Create Service Account

1. **Navigate to Service Accounts**
   - Go to: IAM & Admin > Service Accounts
   - Click "Create Service Account"

2. **Service Account Details**
   ```
   Service Account Name: Learnnect Storage Service
   Service Account ID: learnnect-storage-service
   Description: Service account for Learnnect resume storage
   ```

3. **Grant Roles (Optional)**
   - Skip this step for now (we'll use Drive folder permissions)

4. **Create Key**
   - Click on the created service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create New Key"
   - Choose "JSON" format
   - Download the key file

5. **Save the Key File**
   ```bash
   # Rename and move to your backend directory
   mv ~/Downloads/learnnect-storage-project-*.json ./backend/service-account-key.json
   ```

### 4. Set Up Google Drive Folder

1. **Create Main Learnnect Folder**
   - Go to Google Drive (drive.google.com)
   - Create a new folder named "Learnnect Resume Storage"
   - Right-click folder > "Get link" > Copy folder ID from URL

2. **Extract Folder ID**
   ```
   URL: https://drive.google.com/drive/folders/1ABC2DEF3GHI4JKL5MNO6PQR7STU8VWX9YZ
   Folder ID: 1ABC2DEF3GHI4JKL5MNO6PQR7STU8VWX9YZ
   ```

3. **Share Folder with Service Account**
   - Right-click folder > "Share"
   - Add the service account email (from the JSON key file)
   - Grant "Editor" permissions
   - Service account email format: `learnnect-storage-service@learnnect-storage-project.iam.gserviceaccount.com`

### 5. Configure Backend Environment

1. **Copy Environment Template**
   ```bash
   cp backend/.env.example backend/.env
   ```

2. **Fill in the Values**
   ```bash
   # Edit backend/.env with your actual values:
   
   # Google Service Account Configuration
   GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./service-account-key.json
   LEARNNECT_DRIVE_FOLDER_ID=1ABC2DEF3GHI4JKL5MNO6PQR7STU8VWX9YZ
   
   # Google Cloud Project Configuration
   GOOGLE_CLOUD_PROJECT_ID=learnnect-storage-project
   GOOGLE_CLOUD_PROJECT_NUMBER=123456789012
   
   # Update other settings as needed
   CORS_ORIGINS=http://localhost:3000,http://localhost:5173,https://yourdomain.com
   API_SECRET_KEY=your-super-secret-key-change-in-production
   ```

## 🔍 How to Get Each Value

### GOOGLE_SERVICE_ACCOUNT_KEY_PATH
- **What**: Path to the JSON key file
- **How to get**: Download from Google Cloud Console > Service Accounts > Keys
- **Example**: `./service-account-key.json`

### LEARNNECT_DRIVE_FOLDER_ID
- **What**: Google Drive folder ID where resumes will be stored
- **How to get**: 
  1. Create folder in Google Drive
  2. Right-click > Get link
  3. Extract ID from URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
- **Example**: `1ABC2DEF3GHI4JKL5MNO6PQR7STU8VWX9YZ`

### GOOGLE_CLOUD_PROJECT_ID
- **What**: Your Google Cloud project identifier
- **How to get**: Google Cloud Console > Project dropdown > Copy project ID
- **Example**: `learnnect-storage-project`

### GOOGLE_CLOUD_PROJECT_NUMBER
- **What**: Numeric project identifier
- **How to get**: Google Cloud Console > Home > Project info widget
- **Example**: `123456789012`

### Service Account Email
- **What**: Email address of the service account
- **How to get**: Open the JSON key file, look for "client_email" field
- **Example**: `learnnect-storage-service@learnnect-storage-project.iam.gserviceaccount.com`

## 🧪 Testing the Setup

1. **Install Dependencies**
   ```bash
   cd backend
   pip install fastapi uvicorn google-api-python-client google-auth python-multipart
   ```

2. **Test Connection**
   ```bash
   python -c "
   from google.oauth2 import service_account
   from googleapiclient.discovery import build
   
   credentials = service_account.Credentials.from_service_account_file(
       'service-account-key.json',
       scopes=['https://www.googleapis.com/auth/drive']
   )
   service = build('drive', 'v3', credentials=credentials)
   
   # Test folder access
   folder_id = 'YOUR_FOLDER_ID_HERE'
   result = service.files().get(fileId=folder_id).execute()
   print(f'✅ Successfully accessed folder: {result[\"name\"]}')
   "
   ```

3. **Run Backend API**
   ```bash
   python learnnect_storage_api.py
   ```

4. **Test Health Endpoint**
   ```bash
   curl http://localhost:8001/api/storage/health
   ```

## 🔒 Security Best Practices

1. **Protect Service Account Key**
   - Never commit the JSON key file to version control
   - Add `service-account-key.json` to `.gitignore`
   - Use environment variables in production

2. **Limit Permissions**
   - Only grant necessary Drive permissions
   - Use folder-level sharing instead of domain-wide delegation

3. **Monitor Usage**
   - Enable Google Cloud logging
   - Set up alerts for unusual activity
   - Regular audit of service account usage

## 🚨 Troubleshooting

### Common Issues:

1. **"Service account key not found"**
   - Check file path in GOOGLE_SERVICE_ACCOUNT_KEY_PATH
   - Ensure file exists and is readable

2. **"Folder not accessible"**
   - Verify folder ID is correct
   - Check service account has access to folder
   - Ensure folder is not in Trash

3. **"API not enabled"**
   - Enable Google Drive API in Google Cloud Console
   - Wait a few minutes for propagation

4. **"Permission denied"**
   - Share the folder with service account email
   - Grant "Editor" permissions
   - Check service account email is correct

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Test the service account connection independently
4. Check Google Cloud Console for any error messages
