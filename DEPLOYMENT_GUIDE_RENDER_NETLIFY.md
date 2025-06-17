# 🚀 Complete Learnnect Deployment Guide - Render + Netlify

## 🔴 CRITICAL: Fix Google Cloud Security Issue FIRST

### Step 1: Secure Your Service Account Key

**IMMEDIATE ACTION REQUIRED:**

1. **Remove the service account key from your repository:**
   ```bash
   # Navigate to your project directory
   cd "d:\WorkSpace\Company\Website Templates\Learnnect"
   
   # Remove the service account key file
   del backend\service-account-key.json
   
   # Add to git and commit the removal
   git add .
   git commit -m "Remove service account key for security"
   git push origin main
   ```

2. **Copy your service account key content:**
   - Before deleting, open `backend/service-account-key.json`
   - Copy the ENTIRE JSON content (it should look like this):
   ```json
   {
     "type": "service_account",
     "project_id": "learnnect-gdrive",
     "private_key_id": "...",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
     "client_email": "...",
     "client_id": "...",
     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
     "token_uri": "https://oauth2.googleapis.com/token",
     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
     "client_x509_cert_url": "..."
   }
   ```
   - **SAVE THIS JSON CONTENT** - you'll need it for deployment

3. **Contact Google Cloud Support:**
   - Go to: https://console.cloud.google.com/support
   - Create a support ticket explaining:
     - "I accidentally committed a service account key to GitHub"
     - "I have removed it from the repository"
     - "Please reactivate my project: learnnect-gdrive"
   - Provide the abuse notification details you received

## 📋 Prerequisites Checklist

- ✅ Google Workspace setup (support@learnnect.com)
- ✅ Domain verified (learnnect.com)
- ✅ Render account created
- ✅ Netlify account created
- ✅ Service account JSON content saved securely
- ✅ GitHub repository with latest code

## 🔧 Backend Deployment (Render)

### Step 1: Prepare Backend for Deployment

1. **Verify backend structure:**
   ```
   backend/
   ├── learnnect_storage_api.py
   ├── requirements.txt
   ├── runtime.txt
   └── .env.production
   ```

2. **Create runtime.txt if missing:**
   ```bash
   echo "python-3.11.0" > backend/runtime.txt
   ```

### Step 2: Deploy to Render

1. **Login to Render Dashboard:**
   - Go to: https://dashboard.render.com
   - Connect your GitHub account

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your Learnnect repository

3. **Configure Service Settings:**
   ```
   Name: learnnect-backend
   Environment: Python 3
   Region: Oregon (US West) or closest to your users
   Branch: main
   Root Directory: backend
   Build Command: pip install -r requirements.txt
   Start Command: python -m uvicorn learnnect_storage_api:app --host 0.0.0.0 --port $PORT
   ```

4. **Set Environment Variables:**
   Click "Environment" tab and add:
   ```
   HOST=0.0.0.0
   DEBUG=false
   ENVIRONMENT=production
   LEARNNECT_DRIVE_FOLDER_ID=1w-7EywK43Pn1GkwRqzScE1qbnh8GUwdd
   CORS_ORIGINS=["https://learnnect.netlify.app", "https://learnnect.com", "https://www.learnnect.com"]
   GOOGLE_SERVICE_ACCOUNT_JSON=<PASTE_YOUR_ENTIRE_JSON_HERE>
   ```

   **IMPORTANT:** For `GOOGLE_SERVICE_ACCOUNT_JSON`:
   - Paste the ENTIRE JSON content you saved earlier
   - Make sure it's properly formatted as a single line
   - Include all quotes and escape characters

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Note your backend URL: `https://learnnect-backend.onrender.com`

### Step 3: Test Backend

1. **Health Check:**
   ```bash
   curl https://learnnect-backend.onrender.com/api/storage/health
   ```
   Should return: `{"success": true, "status": "connected", "message": "Learnnect storage is operational"}`

## 🌐 Frontend Deployment (Netlify)

### Step 1: Update Frontend Configuration

1. **Update environment variables:**
   - Open `.env.production`
   - Replace `https://learnnect-backend.onrender.com` with your actual Render URL

2. **Build the frontend:**
   ```bash
   npm run build:prod
   ```

### Step 2: Deploy to Netlify

1. **Login to Netlify:**
   - Go to: https://app.netlify.com
   - Connect your GitHub account

2. **Create New Site:**
   - Click "New site from Git"
   - Choose GitHub
   - Select your Learnnect repository

3. **Configure Build Settings:**
   ```
   Branch: main
   Build command: npm run build:prod
   Publish directory: dist
   ```

4. **Set Environment Variables:**
   Go to Site Settings → Environment Variables and add all variables from `.env.production`:
   ```
   REACT_APP_API_URL=https://learnnect-backend.onrender.com/api
   VITE_API_BASE_URL=https://learnnect-backend.onrender.com
   REACT_APP_ENVIRONMENT=production
   VITE_FIREBASE_API_KEY=AIzaSyCse04obta35yfdwiBlwzULk7-tCPlrUNo
   VITE_FIREBASE_AUTH_DOMAIN=learnnect-platform.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=learnnect-platform
   VITE_FIREBASE_STORAGE_BUCKET=learnnect-platform.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=161279819125
   VITE_FIREBASE_APP_ID=1:161279819125:web:9212bfa93fd6e5d3fca73c
   VITE_FIREBASE_MEASUREMENT_ID=G-RQNF1VWZ5B
   VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbw9xXohrm_MxSy6b1JPXLNj5PNW58ubYsjDNYspB6wLHWt6EzegF6ULo5HPimFPXcBL/exec
   REACT_APP_GOOGLE_SHEET_ID=1spLInABQhq_kW0BXm2qlyYEzSK4WM_SXyyW40ElLm_8
   REACT_APP_GOOGLE_SHEETS_API_KEY=AIzaSyC1RfJo6kguKaR8fSl1wgyKTjfhHfiJ0eQ
   VITE_GOOGLE_DRIVE_CLIENT_ID=1070762412354-0h9rmire8kd8jc9d1om4umathhevqrcd.apps.googleusercontent.com
   VITE_GOOGLE_API_KEY=AIzaSyDJQ3Q5gFGK2SCYSS0XN4FJ6AIZ16WCKbY
   VITE_GROQ_API_KEY=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
   LEARNNECT_DRIVE_FOLDER_ID=1w-7EywK43Pn1GkwRqzScE1qbnh8GUwdd
   ```

5. **Deploy:**
   - Click "Deploy site"
   - Wait for deployment (3-5 minutes)
   - Note your frontend URL: `https://amazing-site-name.netlify.app`

### Step 3: Configure Custom Domain

1. **Add Custom Domain:**
   - Go to Site Settings → Domain management
   - Click "Add custom domain"
   - Enter: `learnnect.com`

2. **Update DNS Records:**
   In your Hostinger DNS settings, add:
   ```
   Type: CNAME
   Name: www
   Value: amazing-site-name.netlify.app

   Type: A
   Name: @
   Value: 75.2.60.5 (Netlify's IP)
   ```

3. **Enable HTTPS:**
   - Netlify will automatically provision SSL certificate
   - Wait 24-48 hours for DNS propagation

## 🔄 Update CORS Configuration

After deployment, update your backend CORS settings:

1. **Update Render Environment Variables:**
   ```
   CORS_ORIGINS=["https://learnnect.com", "https://www.learnnect.com", "https://learnnect.netlify.app"]
   ```

2. **Redeploy backend** (Render will auto-redeploy)

## ✅ Final Testing Checklist

1. **Backend Health Check:**
   ```bash
   curl https://learnnect-backend.onrender.com/api/storage/health
   ```

2. **Frontend Access:**
   - Visit: https://learnnect.com
   - Test user registration
   - Test file upload functionality

3. **Google Drive Integration:**
   - Upload a test resume
   - Verify it appears in your Google Drive folder

## 🔒 Security Best Practices

1. **Never commit sensitive files:**
   - Service account keys
   - Environment files with secrets
   - Database files

2. **Use environment variables for:**
   - API keys
   - Database credentials
   - Service account information

3. **Regular security audits:**
   - Review access logs
   - Update dependencies
   - Monitor for security alerts

## 🆘 Troubleshooting

### Common Issues:

1. **"Service account not found" error:**
   - Verify `GOOGLE_SERVICE_ACCOUNT_JSON` is properly set
   - Check JSON formatting (no extra spaces/newlines)

2. **CORS errors:**
   - Update `CORS_ORIGINS` with correct frontend URLs
   - Redeploy backend after changes

3. **Build failures:**
   - Check build logs in Render/Netlify
   - Verify all dependencies are listed
   - Check Node.js/Python versions

## 📞 Support

If you encounter issues:
1. Check deployment logs in Render/Netlify dashboards
2. Test API endpoints individually
3. Verify environment variables are set correctly
4. Contact support if Google Cloud issues persist

---

**🎉 Congratulations! Your Learnnect platform is now live!**

- Frontend: https://learnnect.com
- Backend: https://learnnect-backend.onrender.com
- Admin Email: support@learnnect.com
