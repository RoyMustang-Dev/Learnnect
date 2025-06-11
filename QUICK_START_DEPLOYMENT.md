# ⚡ QUICK START: Deploy Learnnect in 10 Minutes

## 🎯 FASTEST DEPLOYMENT PATH

### Step 1: Deploy Backend (3 minutes)
1. Go to [Railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Upload your `backend` folder
4. Railway will auto-detect Python and deploy
5. **Copy your Railway URL** (e.g., `https://your-app.railway.app`)

### Step 2: Update Frontend Config (1 minute)
1. Open `.env.production`
2. Replace `https://your-backend-url.com` with your Railway URL
3. Save the file

### Step 3: Build Frontend (2 minutes)
```bash
# Run this command in your project root
.\deploy.bat
```

### Step 4: Deploy Frontend (3 minutes)
1. Go to [Netlify.com](https://netlify.com) and sign up
2. Drag and drop your `dist` folder onto Netlify
3. **Copy your Netlify URL** (e.g., `https://your-site.netlify.app`)

### Step 5: Update CORS (1 minute)
1. Go back to Railway dashboard
2. Add environment variable: `CORS_ORIGINS` = `["https://your-site.netlify.app"]`
3. Redeploy backend

## ✅ DONE! Your website is live!

---

## 🔗 ALTERNATIVE: One-Click Deployments

### Deploy to Netlify (Frontend)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-repo)

### Deploy to Railway (Backend)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

### Deploy to Vercel (Frontend)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo)

---

## 🆘 NEED HELP?

### Issues?
- **CORS Error**: Update CORS_ORIGINS in Railway
- **Build Error**: Run `npm install` first
- **API Error**: Check Railway URL in .env.production

### Support:
- 📖 Full Guide: `WIX_DEPLOYMENT_GUIDE.md`
- 📋 Summary: `DEPLOYMENT_SUMMARY.md`
- 🔧 Troubleshooting: Check browser console

---

**🎉 Your Learnnect platform will be live in under 10 minutes!**
