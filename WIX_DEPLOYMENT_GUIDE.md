# 🚀 Complete Wix Deployment Guide for Learnnect

## ⚠️ IMPORTANT: Wix Deployment Options

Wix has different deployment options for custom React applications:

### Option 1: Wix Velo (Recommended for Custom Apps)
- **Best for**: Custom React applications with backend
- **Limitations**: Some restrictions on external APIs
- **Cost**: Requires paid Wix plan ($14+/month)

### Option 2: Wix Headless (Advanced)
- **Best for**: Full React applications with complete control
- **Limitations**: More complex setup
- **Cost**: Requires Business plan ($23+/month)

### Option 3: Alternative Hosting (Recommended)
- **Netlify/Vercel**: Free tier available, better for React apps
- **Custom Domain**: Can point to Wix later

## 📋 Pre-Deployment Checklist

✅ **Frontend Build Ready**: Production build created successfully
✅ **Backend API**: Python FastAPI backend ready
✅ **Environment Variables**: Production configs created
✅ **Firebase**: Already configured and working
✅ **Google Drive**: Service account configured

---

## 🎯 DEPLOYMENT STEPS

### STEP 1: Prepare Backend for Deployment

#### 1.1 Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### 1.2 Test Backend Locally
```bash
cd backend
python learnnect_storage_api.py
```
Should show: "✅ Google Drive service initialized with service account"

#### 1.3 Create Backend Deployment Package
```bash
# Create deployment folder
mkdir backend-deploy
cp learnnect_storage_api.py backend-deploy/
cp requirements.txt backend-deploy/
cp service-account-key.json backend-deploy/
cp .env.production backend-deploy/.env
```

### STEP 2: Deploy Backend (Choose One Option)

#### Option A: Deploy to Railway (Recommended - Free Tier)
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Upload your `backend-deploy` folder
5. Set environment variables in Railway dashboard
6. Note your Railway URL (e.g., `https://your-app.railway.app`)

#### Option B: Deploy to Render (Free Tier)
1. Go to [Render.com](https://render.com)
2. Sign up and create "New Web Service"
3. Upload backend files
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `python learnnect_storage_api.py`
6. Note your Render URL

#### Option C: Deploy to Heroku
1. Install Heroku CLI
2. Create `Procfile` in backend folder:
   ```
   web: python learnnect_storage_api.py
   ```
3. Deploy to Heroku
4. Note your Heroku URL

### STEP 3: Update Frontend Configuration

#### 3.1 Update Production Environment
Edit `.env.production` with your deployed backend URL:
```env
# Replace with your actual backend URL
VITE_API_BASE_URL=https://your-backend-url.com
REACT_APP_API_URL=https://your-backend-url.com/api
```

#### 3.2 Update CORS in Backend
Update `backend/.env.production`:
```env
CORS_ORIGINS=["https://your-wix-site.com", "https://www.your-wix-site.com"]
```

### STEP 4: Build Frontend for Production

```bash
# Clean and build
npm run deploy:build
```

This creates a `dist` folder with your production-ready website.

### STEP 5: Deploy Frontend to Wix

#### Option A: Wix Velo Deployment

1. **Create Wix Site**
   - Go to [Wix.com](https://wix.com)
   - Create account and new site
   - Choose "Blank Template"

2. **Enable Wix Velo**
   - In Wix Editor, click "Dev Mode" 
   - Enable Velo development environment

3. **Upload React Build**
   - In Velo, go to "Public" folder
   - Upload all files from your `dist` folder
   - Maintain folder structure

4. **Configure Routing**
   - Create `router.js` in Velo backend:
   ```javascript
   import { ok, notFound } from 'wix-router';
   
   export function siteRouter_Router(request) {
     // Serve React app for all routes
     return ok("index.html");
   }
   ```

#### Option B: Wix Headless (Advanced)

1. **Setup Wix Headless**
   - Go to Wix Headless dashboard
   - Create new project
   - Get API keys

2. **Deploy Static Files**
   - Upload `dist` folder contents
   - Configure custom domain

### STEP 6: Configure Custom Domain (After Deployment)

1. **Purchase Domain** (if not already owned)
2. **Point Domain to Wix**
   - In Wix dashboard, go to "Domains"
   - Add your custom domain
   - Follow DNS configuration steps

3. **Update Environment Variables**
   - Update all URLs in production configs
   - Redeploy backend with new CORS settings

---

## 🔧 ALTERNATIVE: Deploy to Netlify/Vercel (Easier Option)

### Netlify Deployment (Recommended Alternative)

1. **Build for Production**
   ```bash
   npm run build:prod
   ```

2. **Deploy to Netlify**
   - Go to [Netlify.com](https://netlify.com)
   - Drag and drop your `dist` folder
   - Or connect GitHub repo for auto-deployment

3. **Configure Environment Variables**
   - In Netlify dashboard, go to "Environment Variables"
   - Add all variables from `.env.production`

4. **Configure Redirects**
   Create `dist/_redirects` file:
   ```
   /*    /index.html   200
   ```

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables**
   - In Vercel dashboard, add environment variables

---

## 📱 POST-DEPLOYMENT STEPS

### 1. Test All Functionality
- [ ] User registration/login
- [ ] Profile creation/editing
- [ ] Resume upload
- [ ] Course browsing
- [ ] Contact forms
- [ ] All API endpoints

### 2. Update Firebase Configuration
- Add your production domain to Firebase authorized domains
- Update Firebase security rules if needed

### 3. Update Google APIs
- Add production domain to Google API console
- Update OAuth redirect URIs

### 4. Configure Analytics
- Add Google Analytics to production site
- Set up error monitoring

### 5. SSL Certificate
- Ensure HTTPS is enabled
- Test all secure connections

---

## 🚨 TROUBLESHOOTING

### Common Issues:

1. **CORS Errors**
   - Update backend CORS settings
   - Add production domain to allowed origins

2. **Environment Variables Not Loading**
   - Check variable names (VITE_ prefix for frontend)
   - Verify deployment platform environment settings

3. **API Endpoints Not Working**
   - Verify backend deployment URL
   - Check backend logs for errors

4. **Firebase Errors**
   - Add production domain to Firebase console
   - Check Firebase configuration

### Debug Commands:
```bash
# Test backend health
curl https://your-backend-url.com/api/storage/health

# Check frontend build
npm run preview

# Verify environment variables
echo $VITE_API_BASE_URL
```

---

## 💰 COST BREAKDOWN

### Free Option (Recommended):
- **Netlify/Vercel**: Free tier (100GB bandwidth)
- **Railway/Render**: Free tier backend
- **Firebase**: Free tier (generous limits)
- **Total**: $0/month

### Wix Option:
- **Wix Business Plan**: $23/month
- **Custom Domain**: $15/year
- **Total**: $23/month + $15/year

---

## 📞 SUPPORT

If you encounter issues:
1. Check the troubleshooting section
2. Verify all environment variables
3. Test backend endpoints individually
4. Check browser console for errors

---

## 🎯 QUICK START DEPLOYMENT (Recommended)

### Option 1: Netlify + Railway (Easiest & Free)

1. **Deploy Backend to Railway**
   ```bash
   cd backend
   deploy-backend.bat
   ```
   - Go to [Railway.app](https://railway.app)
   - Upload `backend-deploy` folder
   - Note your Railway URL

2. **Deploy Frontend to Netlify**
   ```bash
   deploy.bat
   ```
   - Go to [Netlify.com](https://netlify.com)
   - Drag `dist` folder to deploy
   - Note your Netlify URL

3. **Update Configuration**
   - Update `.env.production` with Railway URL
   - Rebuild and redeploy frontend
   - Update backend CORS with Netlify URL

### Option 2: Vercel + Render

1. **Deploy Backend to Render**
   - Upload `backend-deploy` folder to Render
   - Set start command: `python learnnect_storage_api.py`

2. **Deploy Frontend to Vercel**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

---

## 📋 FINAL DEPLOYMENT CHECKLIST

### Before Going Live:
- [ ] Backend deployed and accessible
- [ ] Frontend built and deployed
- [ ] Environment variables updated
- [ ] CORS configured correctly
- [ ] Firebase domains updated
- [ ] Google API domains updated
- [ ] SSL certificates active
- [ ] All features tested

### Post-Launch:
- [ ] Monitor error logs
- [ ] Set up analytics
- [ ] Configure backups
- [ ] Document API endpoints
- [ ] Set up monitoring alerts

**Next Steps**: Choose your deployment option and follow the corresponding steps above!
