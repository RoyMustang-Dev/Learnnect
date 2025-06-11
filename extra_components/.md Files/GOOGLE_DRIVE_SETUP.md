# 🚀 Google Drive Resume Storage Setup Guide

## 🚨 QUICK FIX for "Not a valid origin" Error

If you're seeing the error: **"Not a valid origin for the client"**

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Navigate to**: APIs & Services → Credentials
3. **Click on your OAuth 2.0 Client ID**
4. **In "Authorized JavaScript origins", add EXACTLY**:
   ```
   http://localhost:5173
   ```
5. **Save** and **refresh your browser**

## 🎯 Overview

Your Learnnect platform now supports **Google Drive** for resume storage! This provides:

✅ **15GB free storage** per Google account
✅ **Automatic folder creation** for each user
✅ **No billing required** - completely free
✅ **Better reliability** than Firebase Storage
✅ **User-specific folders**: `Learnnect_FirstName_LastName_UniqueID`

## 📋 Step 1: Google Cloud Console Setup

### 1.1 Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "New Project" or select existing project
3. Name it: `learnnect-drive-api`

### 1.2 Enable Google Drive API
1. Go to **APIs & Services** → **Library**
2. Search for "Google Drive API"
3. Click **Enable**

### 1.3 Create OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Choose **Web application**
4. Name: `Learnnect Resume Storage`
5. **Authorized JavaScript origins** - Add these EXACT URLs:
   ```
   http://localhost:5173
   ```
   (For production, add your domain like `https://yourdomain.com`)
6. **Authorized redirect URIs**: (leave empty)
7. Click **Create**
8. **Copy the Client ID** (you'll need this)

**⚠️ IMPORTANT**: The origin must be EXACTLY `http://localhost:5173` (no trailing slash, no extra characters)

### 1.4 Create API Key
1. Click **+ CREATE CREDENTIALS** → **API key**
2. **Restrict the key**:
   - **API restrictions** → Select "Google Drive API"
   - **Website restrictions** → Add your domains
3. **Copy the API Key** (you'll need this)

## 📋 Step 2: Environment Configuration

### 2.1 Update .env file
Create/update your `.env` file with:

```bash
# Google Drive API Configuration
VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=your_api_key
```

### 2.2 Example values:
```bash
VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=AIzaSyABC123DEF456GHI789JKL012MNO345PQR
```

## 📋 Step 3: Test the Integration

### 3.1 Start your development server
```bash
npm run dev
```

### 3.2 Test Google Drive connection
1. Go to your **Profile page**
2. Click **"Import from Resume"**
3. You should see **"Connect Google Drive"** section
4. Click **"Connect Google Drive"**
5. Sign in with your Google account
6. Grant permissions for Drive access

### 3.3 Test resume upload
1. After connecting, upload a PDF/DOC resume
2. Check your Google Drive - you should see:
   - New folder: `Learnnect_YourName_UniqueID`
   - Resume file inside the folder
3. Your profile should be updated with resume data

## 🔧 How It Works

### Folder Structure
```
Google Drive/
└── Learnnect_John_Doe_a1b2c3d4/
    ├── Resume_2024-01-15T10-30-00.pdf
    ├── Resume_2024-01-20T14-45-00.docx
    └── Resume_2024-01-25T09-15-00.pdf
```

### User Experience
1. **First time**: User connects Google Drive
2. **Upload**: System creates user folder automatically
3. **Storage**: Resume stored in user's personal folder
4. **Parsing**: Text extracted and profile updated
5. **Access**: User can access files anytime in their Drive

### Security
- **OAuth 2.0**: Secure authentication
- **Limited scope**: Only file creation/read access
- **User control**: Users can revoke access anytime
- **Private folders**: Each user has their own folder

## 🚨 Troubleshooting

### Common Issues

#### 1. "Google Drive API not enabled"
- Go to Google Cloud Console → APIs & Services → Library
- Search "Google Drive API" and enable it

#### 2. "Invalid client ID"
- Check your `.env` file has correct `VITE_GOOGLE_CLIENT_ID`
- Ensure client ID ends with `.apps.googleusercontent.com`

#### 3. "Origin not allowed"
- Add `http://localhost:5173` to authorized origins in Google Cloud Console
- For production, add your actual domain

#### 4. "API key restrictions"
- Ensure API key has Google Drive API enabled
- Check website restrictions match your domain

#### 5. "Permission denied"
- User needs to grant Drive access during sign-in
- Check if user revoked permissions in Google Account settings

### Debug Tools

Open browser console and run:
```javascript
// Check if Google Drive is connected
googleDriveService.isSignedIn()

// Test connection
googleDriveService.signIn()

// Check user folders
googleDriveService.getUserResumes('user_id', 'Full Name')
```

## 🎯 Production Deployment

### Update environment variables:
```bash
VITE_GOOGLE_CLIENT_ID=your_production_client_id
VITE_GOOGLE_API_KEY=your_production_api_key
```

### Update OAuth origins:
- Add your production domain to Google Cloud Console
- Remove localhost origins for security

## 🔄 Fallback Strategy

The system automatically falls back to:
1. **Google Drive** (primary) - if user is signed in
2. **Firebase Storage** (secondary) - if Google Drive fails
3. **Local Storage** (tertiary) - if both fail

This ensures resume uploads always work! 🚀

## 📞 Support

If you encounter issues:
1. Check browser console for error messages
2. Verify all environment variables are set
3. Test with a fresh Google account
4. Check Google Cloud Console quotas

Your resume storage is now powered by Google Drive! 🎉
