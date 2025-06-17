# 🚨 IMMEDIATE ACTION REQUIRED - Security Fix

## ⚠️ **CRITICAL SECURITY ISSUE**

Your `backend/service-account-key.json` file contains sensitive Google Cloud credentials and is currently exposed in your repository. This is a **MAJOR SECURITY RISK**.

---

## 🔥 **URGENT STEPS - Do This NOW**

### **Step 1: Secure Your Service Account Key**

1. **Copy the service account key content**:
   - Open `backend/service-account-key.json`
   - Copy the ENTIRE content (all lines from `{` to `}`)
   - Save this in a secure location (you'll need it for Render)

2. **Remove from Git immediately**:
   ```bash
   git rm backend/service-account-key.json
   git add backend/.gitignore
   git commit -m "🔒 SECURITY: Remove sensitive service account key"
   git push
   ```

### **Step 2: Generate Secure API Keys**

Run this command:
```bash
cd backend
python generate_api_keys.py
```

Copy the generated keys - you'll need them for Render.

---

## 🚀 **DEPLOYMENT STEPS**

### **Backend Deployment (Render)**

1. **Go to Render**: https://dashboard.render.com
2. **Create Web Service**:
   - Connect GitHub repository
   - Name: `learnnect-backend`
   - Environment: Python 3
   - Build Command: `cd backend && pip install -r requirements.txt`
   - Start Command: `cd backend && python -m uvicorn learnnect_storage_api:app --host 0.0.0.0 --port $PORT`

3. **Set Environment Variables** (CRITICAL):
   ```bash
   # Paste your service account JSON here (from Step 1)
   GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
   
   # Google Drive
   LEARNNECT_DRIVE_FOLDER_ID=1w-7EywK43Pn1GkwRqzScE1qbnh8GUwdd
   
   # Server
   HOST=0.0.0.0
   DEBUG=false
   ENVIRONMENT=production
   PYTHON_VERSION=3.11.0
   
   # Security (from Step 2)
   API_SECRET_KEY=your-generated-key
   JWT_SECRET_KEY=your-generated-jwt-key
   
   # CORS
   CORS_ORIGINS=["https://learnnect.netlify.app", "https://learnnect.com", "https://www.learnnect.com"]
   ```

4. **Deploy and Test**:
   - Click "Create Web Service"
   - Wait for deployment
   - Test: `https://your-app.onrender.com/api/storage/health`

### **Frontend Deployment (Netlify)**

1. **Go to Netlify**: https://app.netlify.com
2. **Create Site**:
   - Import from GitHub
   - Build command: `npm run build:prod`
   - Publish directory: `dist`

3. **Set Environment Variables**:
   ```bash
   # Firebase
   VITE_FIREBASE_API_KEY=AIzaSyCse04obta35yfdwiBlwzULk7-tCPlrUNo
   VITE_FIREBASE_AUTH_DOMAIN=learnnect-platform.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=learnnect-platform
   VITE_FIREBASE_STORAGE_BUCKET=learnnect-platform.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=161279819125
   VITE_FIREBASE_APP_ID=1:161279819125:web:9212bfa93fd6e5d3fca73c
   VITE_FIREBASE_MEASUREMENT_ID=G-RQNF1VWZ5B
   
   # Backend API (use your Render URL)
   VITE_API_URL=https://your-render-app.onrender.com/api
   ```

4. **Deploy and Test**:
   - Click "Deploy site"
   - Test the site functionality

### **Domain Configuration**

1. **Add Custom Domain in Netlify**:
   - Domain settings → Add custom domain
   - Enter: `learnnect.com`

2. **Configure DNS at Hostinger**:
   - Add CNAME record: `www` → `your-site.netlify.app`
   - Add A record: `@` → `75.2.60.5`

3. **Update CORS in Render**:
   - Update `CORS_ORIGINS` to include `https://learnnect.com`
   - Redeploy backend

---

## ✅ **Success Checklist**

After deployment, verify:
- [ ] Backend health check works
- [ ] Frontend loads without errors
- [ ] User registration works
- [ ] File upload works
- [ ] Files appear in Google Drive
- [ ] Custom domain resolves
- [ ] HTTPS is enabled

---

## 📞 **Need Help?**

If you encounter issues:
1. Check `COMPLETE_DEPLOYMENT_GUIDE.md` for detailed instructions
2. Check `DEPLOYMENT_CHECKLIST.md` for step-by-step guide
3. Run `deployment-setup.bat` for automated checks

**Start with the security fix immediately!** The service account key exposure is a critical security vulnerability that needs to be addressed before deployment.
