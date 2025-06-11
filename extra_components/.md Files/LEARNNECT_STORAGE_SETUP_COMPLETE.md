# 🚀 Learnnect Storage Setup - Complete Guide

## ✅ Your Configuration Details

### **Google Cloud Project:**
- **Project Name**: Learnnect GDrive
- **Project ID**: `learnnect-gdrive`
- **Project Number**: `1070762412354`

### **Service Account:**
- **Name**: Learnnect EdTech Platform - GDrive
- **Email**: `learnnect-platform-gdrive@learnnect-gdrive.iam.gserviceaccount.com`
- **Unique ID**: `107057812365180331152`
- **Key File**: `service-account-key.json` (already added to backend folder)

### **Google Drive Folder:**
- **URL**: https://drive.google.com/drive/folders/1w-7EywK43Pn1GkwRqzScE1qbnh8GUwdd
- **Folder ID**: `1w-7EywK43Pn1GkwRqzScE1qbnh8GUwdd`

## 🔧 Setup Steps

### 1. **Generate API Keys**
```bash
cd backend
python generate_api_keys.py
```

This will generate secure keys and save them to a file. Copy the generated keys to your `.env.storage` file.

### 2. **Configure Environment**
Your `.env.storage` file is already configured with your values:

```bash
# Google Service Account Configuration
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./service-account-key.json
LEARNNECT_DRIVE_FOLDER_ID=1w-7EywK43Pn1GkwRqzScE1qbnh8GUwdd
GOOGLE_CLOUD_PROJECT_ID=learnnect-gdrive
GOOGLE_CLOUD_PROJECT_NUMBER=1070762412354

# Add the generated API keys here:
API_SECRET_KEY=your_generated_key_here
JWT_SECRET_KEY=your_generated_jwt_key_here
```

### 3. **Share Google Drive Folder**
⚠️ **IMPORTANT**: You need to share the Google Drive folder with your service account:

1. Go to: https://drive.google.com/drive/folders/1w-7EywK43Pn1GkwRqzScE1qbnh8GUwdd
2. Right-click the folder → "Share"
3. Add this email: `learnnect-platform-gdrive@learnnect-gdrive.iam.gserviceaccount.com`
4. Set permissions to "Editor"
5. Click "Send"

### 4. **Install Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

### 5. **Test Setup**
```bash
python setup_storage.py
```

This will verify:
- ✅ Service account key file exists
- ✅ Google Drive API connection works
- ✅ Folder access is granted
- ✅ Upload/download functionality works

### 6. **Start the API**
```bash
python learnnect_storage_api.py
```

The API will be available at: http://localhost:8001

## 🔐 API_SECRET_KEY Explanation

The `API_SECRET_KEY` is used for:
- **Authentication**: Securing API endpoints
- **Encryption**: Protecting sensitive data
- **Session Management**: JWT token signing

### **How to Generate:**

**Option 1: Use our generator (Recommended)**
```bash
python generate_api_keys.py
```

**Option 2: Manual generation**
```python
import secrets
import string

# Generate 64-character secure key
alphabet = string.ascii_letters + string.digits + "!@#$%^&*()_+-="
api_key = ''.join(secrets.choice(alphabet) for _ in range(64))
print(f"API_SECRET_KEY={api_key}")
```

**Option 3: Online generator**
- Visit: https://randomkeygen.com/
- Use "CodeIgniter Encryption Keys" (256-bit)
- Copy the generated key

### **Example Keys:**
```bash
# Example (DO NOT USE THESE IN PRODUCTION):
API_SECRET_KEY=Learnnect2024!SecureAPI#Platform$Storage%Resume&EdTech*Solutions
JWT_SECRET_KEY=LearnnectJWT2024!Auth#Token$Security%Platform&EdTech*JWT
```

## 🧪 Testing the Complete Setup

### 1. **Health Check**
```bash
curl http://localhost:8001/api/storage/health
```

Expected response:
```json
{
  "success": true,
  "status": "connected",
  "message": "Learnnect storage is operational"
}
```

### 2. **Upload Test**
```bash
# Create a test file
echo "Test resume content" > test_resume.txt

# Upload via API
curl -X POST "http://localhost:8001/api/storage/upload-resume" \
  -F "file=@test_resume.txt" \
  -F "userId=test_user_123" \
  -F "fullName=John Doe" \
  -F "fileName=test_resume_$(date +%s).txt"
```

### 3. **Frontend Integration**
Update your frontend `.env` file:
```bash
# Add this to your main .env file:
VITE_API_BASE_URL=http://localhost:8001
```

## 🔍 Verification Checklist

- [ ] Google Cloud project created ✅
- [ ] Google Drive API enabled ✅
- [ ] Service account created ✅
- [ ] Service account key downloaded ✅
- [ ] Google Drive folder created ✅
- [ ] **Folder shared with service account** ⚠️ (DO THIS!)
- [ ] API keys generated
- [ ] `.env.storage` file configured
- [ ] Dependencies installed
- [ ] Setup script passes all tests
- [ ] API starts successfully
- [ ] Health check returns success
- [ ] Upload test works

## 🚨 Common Issues & Solutions

### **"Folder not accessible"**
- **Cause**: Folder not shared with service account
- **Solution**: Share folder with `learnnect-platform-gdrive@learnnect-gdrive.iam.gserviceaccount.com`

### **"Service account key not found"**
- **Cause**: Key file not in correct location
- **Solution**: Ensure `service-account-key.json` is in `backend/` folder

### **"API not enabled"**
- **Cause**: Google Drive API not enabled
- **Solution**: Go to Google Cloud Console → APIs & Services → Enable Google Drive API

### **"Permission denied"**
- **Cause**: Service account lacks permissions
- **Solution**: Grant "Editor" access to the Google Drive folder

## 🎉 Success!

Once all checks pass, your Learnnect Storage system is ready! 

**Next Steps:**
1. Test resume upload from your frontend
2. Verify files appear in Google Drive folder
3. Test download functionality
4. Deploy to production when ready

## 📞 Support

If you encounter issues:
1. Run `python setup_storage.py` for diagnostics
2. Check the troubleshooting section above
3. Verify all environment variables are set correctly
4. Ensure Google Drive folder permissions are correct
