# 🚀 Complete Learnnect Deployment Guide
**Frontend: Netlify | Backend: Render**

## 🚨 **CRITICAL: Fix Security Issue First**

### **Problem**: Service Account Key Exposed
Your `backend/service-account-key.json` file contains sensitive Google Cloud credentials and should NEVER be in version control.

### **Solution**: Use Environment Variables

1. **Copy the service account key content**:
   ```bash
   # Copy the entire content of backend/service-account-key.json
   # We'll paste this as an environment variable in Render
   ```

2. **Remove the file from git** (if committed):
   ```bash
   git rm backend/service-account-key.json
   git commit -m "Remove sensitive service account key"
   ```

3. **Add to .gitignore** (already done):
   - The file `backend/.gitignore` has been created to prevent future commits

---

## 📋 **Prerequisites Checklist**

✅ **Completed**:
- [x] Google Workspace setup (support@learnnect.com)
- [x] Domain verification (learnnect.com)
- [x] Hostinger domain purchase
- [x] Render account created
- [x] Netlify account created

🔄 **To Complete**:
- [ ] Fix service account key security issue
- [ ] Deploy backend to Render
- [ ] Deploy frontend to Netlify
- [ ] Configure environment variables
- [ ] Test the complete system

---

## 🎯 **Deployment Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Users         │    │   Netlify       │    │   Render        │
│   (Frontend)    │───▶│   (Static Site) │───▶│   (Backend API) │
│                 │    │                 │    │                 │
│ learnnect.com   │    │ CDN + Hosting   │    │ Python FastAPI  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │ Google Drive    │
                                              │ (File Storage)  │
                                              └─────────────────┘
```

---

## 🔧 **Step 1: Prepare Environment Variables**

### **Backend Environment Variables** (for Render)

Create these environment variables in Render dashboard:

```bash
# Google Service Account (CRITICAL - Use JSON content)
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"learnnect-gdrive",...}

# Google Drive Configuration
LEARNNECT_DRIVE_FOLDER_ID=1w-7EywK43Pn1GkwRqzScE1qbnh8GUwdd

# Server Configuration
HOST=0.0.0.0
PORT=10000
DEBUG=false
ENVIRONMENT=production
PYTHON_VERSION=3.11.0

# CORS Origins (Update with your actual domains)
CORS_ORIGINS=["https://learnnect.netlify.app", "https://learnnect.com", "https://www.learnnect.com"]

# Security Keys (Generate new ones)
API_SECRET_KEY=your-super-secure-api-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
```

### **Frontend Environment Variables** (for Netlify)

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyCse04obta35yfdwiBlwzULk7-tCPlrUNo
VITE_FIREBASE_AUTH_DOMAIN=learnnect-platform.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=learnnect-platform
VITE_FIREBASE_STORAGE_BUCKET=learnnect-platform.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=161279819125
VITE_FIREBASE_APP_ID=1:161279819125:web:9212bfa93fd6e5d3fca73c
VITE_FIREBASE_MEASUREMENT_ID=G-RQNF1VWZ5B

# Backend API URL (Update after backend deployment)
VITE_API_URL=https://your-render-app-name.onrender.com/api
```

---

## 🐍 **Step 2: Deploy Backend to Render**

### **2.1 Connect Repository**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the repository: `Learnnect`

### **2.2 Configure Service**
```yaml
Name: learnnect-backend
Environment: Python 3
Region: Oregon (US West) or closest to your users
Branch: main (or your main branch)

Build Command: cd backend && pip install -r requirements.txt
Start Command: cd backend && python -m uvicorn learnnect_storage_api:app --host 0.0.0.0 --port $PORT

Instance Type: Free (for testing) or Starter ($7/month for production)
```

### **2.3 Set Environment Variables**
In Render dashboard, go to Environment tab and add ALL the backend environment variables listed above.

**🚨 CRITICAL**: For `GOOGLE_SERVICE_ACCOUNT_JSON`, copy the ENTIRE content of your `service-account-key.json` file as a single line JSON string.

### **2.4 Deploy**
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Note your backend URL: `https://your-app-name.onrender.com`

---

## 🌐 **Step 3: Deploy Frontend to Netlify**

### **3.1 Connect Repository**
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository

### **3.2 Configure Build Settings**
```yaml
Base directory: (leave empty - root directory)
Build command: npm run build:prod
Publish directory: dist
```

### **3.3 Set Environment Variables**
1. Go to Site settings → Environment variables
2. Add all frontend environment variables listed above
3. **Update `VITE_API_URL`** with your Render backend URL

### **3.4 Deploy**
1. Click "Deploy site"
2. Wait for deployment (3-5 minutes)
3. Note your frontend URL: `https://random-name.netlify.app`

---

## 🔗 **Step 4: Configure Custom Domain**

### **4.1 Update Netlify Domain**
1. In Netlify dashboard → Domain settings
2. Add custom domain: `learnnect.com`
3. Follow DNS configuration instructions
4. Enable HTTPS (automatic with Let's Encrypt)

### **4.2 Update CORS Origins**
1. Go back to Render dashboard
2. Update `CORS_ORIGINS` environment variable:
   ```bash
   CORS_ORIGINS=["https://learnnect.com", "https://www.learnnect.com", "https://learnnect.netlify.app"]
   ```
3. Redeploy the backend service

---

## ✅ **Step 5: Test Deployment**

### **5.1 Backend Health Check**
Visit: `https://your-render-app.onrender.com/api/storage/health`

Expected response:
```json
{
  "success": true,
  "status": "connected",
  "message": "Learnnect storage is operational"
}
```

### **5.2 Frontend Test**
1. Visit: `https://learnnect.com`
2. Test user registration/login
3. Test file upload functionality
4. Check browser console for errors

### **5.3 Integration Test**
1. Register a new user
2. Upload a resume
3. Verify file appears in Google Drive
4. Test file download

---

## 🔧 **Step 6: Production Optimizations**

### **6.1 Render Optimizations**
- Upgrade to Starter plan ($7/month) for better performance
- Enable auto-deploy from main branch
- Set up health checks and monitoring

### **6.2 Netlify Optimizations**
- Configure redirects for SPA routing
- Enable form handling (if needed)
- Set up branch deploys for staging

### **6.3 Security Enhancements**
- Rotate API keys regularly
- Set up monitoring and alerts
- Configure rate limiting
- Enable CORS properly

---

## 🚨 **Troubleshooting Common Issues**

### **🔐 Security Issues**
**Problem**: "service-account-key.json flagged by Google"
**Solution**:
1. Remove file from repository: `git rm backend/service-account-key.json`
2. Copy JSON content to Render environment variable `GOOGLE_SERVICE_ACCOUNT_JSON`
3. Ensure backend/.gitignore includes `service-account-key.json`

### **🐍 Backend Issues**
**Problem**: Service Account Error
**Solution**:
- Ensure JSON is properly formatted in environment variable
- Check that service account has Drive API permissions
- Verify folder ID is correct

**Problem**: CORS Error
**Solution**:
- Check CORS_ORIGINS includes your frontend domain
- Update after domain changes
- Redeploy backend after CORS changes

**Problem**: Port/Connection Error
**Solution**:
- Render uses PORT environment variable automatically
- Check health endpoint: `/api/storage/health`
- Verify start command in render.yaml

### **🌐 Frontend Issues**
**Problem**: Firebase Auth Error
**Solution**:
- Check all Firebase environment variables are set
- Verify Firebase project is active
- Check browser console for specific errors

**Problem**: API Connection Error
**Solution**:
- Verify VITE_API_URL points to correct Render URL
- Check network tab in browser dev tools
- Ensure backend is deployed and running

**Problem**: Build Error
**Solution**:
- Check all environment variables are set in Netlify
- Verify Node.js version compatibility
- Check build logs for specific errors

### **🔗 Domain Issues**
**Problem**: DNS not resolving
**Solution**:
- DNS propagation can take up to 48 hours
- Use DNS checker tools to verify propagation
- Ensure correct DNS records at Hostinger

**Problem**: SSL Certificate Issues
**Solution**:
- Netlify handles SSL automatically
- Wait for certificate provisioning (can take 24 hours)
- Check domain verification status

**Problem**: Redirect Issues
**Solution**:
- Check netlify.toml configuration
- Verify SPA routing redirects
- Test direct URL access to routes

---

## 📞 **Support & Next Steps**

After deployment, you should have:
- ✅ Frontend: `https://learnnect.com`
- ✅ Backend: `https://your-app.onrender.com`
- ✅ Secure file storage in Google Drive
- ✅ User authentication with Firebase

**Need help?** Check the troubleshooting section or create an issue in your repository.
