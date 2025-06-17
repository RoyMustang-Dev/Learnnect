# 📋 Learnnect Deployment Checklist
**Complete Step-by-Step Guide**

## 🚨 **URGENT: Security Fix Required**

### ❌ **Current Issue**
Your `backend/service-account-key.json` file contains sensitive Google Cloud credentials and is currently exposed in your repository.

### ✅ **Immediate Action Required**

1. **Copy Service Account Key Content**:
   ```bash
   # Open backend/service-account-key.json
   # Copy the ENTIRE content (all lines)
   # Keep this safe - you'll paste it in Render dashboard
   ```

2. **Remove from Git** (if committed):
   ```bash
   git rm backend/service-account-key.json
   git add backend/.gitignore
   git commit -m "🔒 Remove sensitive service account key and add gitignore"
   git push
   ```

---

## 📋 **Pre-Deployment Checklist**

### ✅ **Completed Items**
- [x] Google Workspace setup (support@learnnect.com)
- [x] Domain purchased (learnnect.com from Hostinger)
- [x] Domain verified with Google
- [x] Render account created
- [x] Netlify account created

### 🔄 **Items to Complete**
- [ ] Fix service account security issue
- [ ] Generate secure API keys
- [ ] Deploy backend to Render
- [ ] Deploy frontend to Netlify
- [ ] Configure custom domain
- [ ] Test complete system

---

## 🔐 **Step 1: Generate Secure Keys**

Run this in your backend directory:

```bash
cd backend
python generate_api_keys.py
```

This will create a file with secure keys. **Copy these keys** - you'll need them for Render.

---

## 🐍 **Step 2: Deploy Backend to Render**

### **2.1 Create Web Service**
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect GitHub → Select your repository
4. Configure:
   - **Name**: `learnnect-backend`
   - **Environment**: `Python 3`
   - **Region**: `Oregon (US West)`
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && python -m uvicorn learnnect_storage_api:app --host 0.0.0.0 --port $PORT`

### **2.2 Set Environment Variables**
In Render dashboard, go to "Environment" tab and add:

```bash
# Google Service Account (PASTE YOUR JSON HERE)
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"learnnect-gdrive",...}

# Google Drive
LEARNNECT_DRIVE_FOLDER_ID=1w-7EywK43Pn1GkwRqzScE1qbnh8GUwdd

# Server Config
HOST=0.0.0.0
DEBUG=false
ENVIRONMENT=production
PYTHON_VERSION=3.11.0

# Security (Use generated keys from Step 1)
API_SECRET_KEY=your-generated-api-key
JWT_SECRET_KEY=your-generated-jwt-key

# CORS (Update after frontend deployment)
CORS_ORIGINS=["https://learnnect.netlify.app", "https://learnnect.com", "https://www.learnnect.com"]
```

### **2.3 Deploy**
1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. **Save your backend URL**: `https://your-app-name.onrender.com`

### **2.4 Test Backend**
Visit: `https://your-app-name.onrender.com/api/storage/health`

Expected response:
```json
{"success": true, "status": "connected", "message": "Learnnect storage is operational"}
```

---

## 🌐 **Step 3: Deploy Frontend to Netlify**

### **3.1 Create Site**
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub → Select your repository
4. Configure:
   - **Base directory**: Leave empty
   - **Build command**: `npm run build:prod`
   - **Publish directory**: `dist`

### **3.2 Set Environment Variables**
Go to Site settings → Environment variables and add:

```bash
# Firebase Config
VITE_FIREBASE_API_KEY=AIzaSyCse04obta35yfdwiBlwzULk7-tCPlrUNo
VITE_FIREBASE_AUTH_DOMAIN=learnnect-platform.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=learnnect-platform
VITE_FIREBASE_STORAGE_BUCKET=learnnect-platform.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=161279819125
VITE_FIREBASE_APP_ID=1:161279819125:web:9212bfa93fd6e5d3fca73c
VITE_FIREBASE_MEASUREMENT_ID=G-RQNF1VWZ5B

# Backend API (Use your Render URL from Step 2.3)
VITE_API_URL=https://your-render-app.onrender.com/api
```

### **3.3 Deploy**
1. Click "Deploy site"
2. Wait 3-5 minutes
3. **Save your frontend URL**: `https://random-name.netlify.app`

### **3.4 Test Frontend**
1. Visit your Netlify URL
2. Test user registration
3. Check browser console for errors

---

## 🔗 **Step 4: Configure Custom Domain**

### **4.1 Add Domain to Netlify**
1. In Netlify dashboard → Domain settings
2. Click "Add custom domain"
3. Enter: `learnnect.com`
4. Follow DNS configuration instructions

### **4.2 Configure DNS at Hostinger**
1. Go to Hostinger control panel
2. Navigate to DNS settings for learnnect.com
3. Add these records:
   ```
   Type: CNAME
   Name: www
   Value: your-site-name.netlify.app
   
   Type: A
   Name: @
   Value: 75.2.60.5 (Netlify's IP)
   ```

### **4.3 Update CORS Settings**
1. Go back to Render dashboard
2. Update `CORS_ORIGINS` environment variable:
   ```bash
   CORS_ORIGINS=["https://learnnect.com", "https://www.learnnect.com", "https://learnnect.netlify.app"]
   ```
3. Redeploy backend service

---

## ✅ **Step 5: Final Testing**

### **5.1 Complete System Test**
1. Visit `https://learnnect.com`
2. Register a new user account
3. Login successfully
4. Upload a resume file
5. Verify file appears in Google Drive
6. Test file download

### **5.2 Performance Check**
- [ ] Page loads in under 3 seconds
- [ ] No console errors
- [ ] Mobile responsive
- [ ] All features working

### **5.3 Security Verification**
- [ ] HTTPS enabled on both domains
- [ ] Service account key not in repository
- [ ] Environment variables properly set
- [ ] CORS configured correctly

---

## 🎯 **Success Criteria**

When complete, you should have:
- ✅ **Frontend**: https://learnnect.com (Netlify)
- ✅ **Backend**: https://your-app.onrender.com (Render)
- ✅ **Security**: No sensitive data in repository
- ✅ **Functionality**: Complete user registration and file upload
- ✅ **Integration**: Frontend ↔ Backend ↔ Google Drive

---

## 🆘 **Need Help?**

If you encounter issues:
1. Check the troubleshooting section in COMPLETE_DEPLOYMENT_GUIDE.md
2. Verify all environment variables are set correctly
3. Check browser console and network tab for errors
4. Ensure service account has proper permissions

**Ready to start?** Begin with Step 1 (Security Fix) immediately!
