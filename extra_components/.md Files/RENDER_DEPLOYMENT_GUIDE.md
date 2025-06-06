# Render Deployment Guide for Learnnect OAuth Server

## 🚀 Quick Fix for Session Store Warning

The warning you're seeing occurs because the default memory session store is not suitable for production. This guide will help you set up Redis for session storage on Render.

## 📋 Required Environment Variables on Render

### Current Variables (Already Set)
- `PORT` = `3001`
- `FRONTEND_URL` = `https://learnnect-git-main-roymustang-devs-projects.vercel.app/`
- `SESSION_SECRET` = `your-generated-key`

### New Variables to Add

#### 1. Production Environment
```
NODE_ENV=production
```

#### 2. Backend URL (for OAuth redirects)
```
BACKEND_URL=https://learnnect-oauth-server.onrender.com
```

#### 3. Google OAuth Credentials
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### 4. Redis Configuration (Choose Option A or B)

**Option A: Use Render's Redis Add-on (Recommended)**
1. Go to your Render dashboard
2. Click on your service
3. Go to "Environment" tab
4. Add Redis add-on
5. Render will automatically provide `REDIS_URL`

**Option B: Use External Redis Service**
```
REDIS_URL=redis://username:password@host:port
```

## 🔧 Step-by-Step Setup

### Step 1: Add Redis to Your Render Service

1. **Login to Render Dashboard**
   - Go to https://render.com
   - Navigate to your `learnnect-oauth-server` service

2. **Add Redis Add-on**
   - Click on your service
   - Go to "Environment" tab
   - Click "Add Environment Variable"
   - Or use Render's Redis add-on (recommended)

3. **Add Environment Variables**
   Add these new environment variables:
   ```
   NODE_ENV=production
   BACKEND_URL=https://learnnect-oauth-server.onrender.com
   GOOGLE_CLIENT_ID=your-actual-google-client-id
   GOOGLE_CLIENT_SECRET=your-actual-google-client-secret
   ```

### Step 2: Update Google OAuth Settings

1. **Go to Google Cloud Console**
   - Visit https://console.cloud.google.com
   - Select your project

2. **Update OAuth Redirect URIs**
   - Go to "APIs & Services" > "Credentials"
   - Click on your OAuth 2.0 Client ID
   - Add this redirect URI:
     ```
     https://learnnect-oauth-server.onrender.com/api/auth/google/callback
     ```

### Step 3: Deploy Updated Code

1. **Install Dependencies**
   The updated `package.json` includes:
   - `redis`: Redis client for Node.js
   - `connect-redis`: Redis session store for Express

2. **Deploy**
   - Push your changes to your repository
   - Render will automatically redeploy

## 🔍 Verification

After deployment, check the logs in Render dashboard. You should see:

✅ **Success Messages:**
```
✅ Connected to Redis
✅ Redis client ready
✅ Redis session store initialized
✅ Using Redis session store
🚀 OAuth server running on http://localhost:3001
🗄️  Session Store: Redis
🌍 Environment: production
```

❌ **If Redis fails:**
```
⚠️  Redis connection failed, falling back to memory store
⚠️  Using memory session store (not recommended for production)
```

## 🛠️ Troubleshooting

### Issue: Redis Connection Failed
**Solutions:**
1. Verify `REDIS_URL` environment variable is set
2. Check Redis service is running
3. Verify network connectivity

### Issue: OAuth Redirect Mismatch
**Solutions:**
1. Ensure `BACKEND_URL` matches your Render service URL
2. Update Google OAuth redirect URIs
3. Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

### Issue: CORS Errors
**Solutions:**
1. Verify `FRONTEND_URL` is correct
2. Check cookie settings in production

## 📊 Benefits of This Fix

1. **No More Memory Leaks** - Redis stores sessions externally
2. **Scalable** - Works with multiple server instances
3. **Persistent** - Sessions survive server restarts
4. **Production Ready** - Follows best practices

## 🔄 Fallback Behavior

The code includes automatic fallback:
- **Primary**: Tries to connect to Redis
- **Fallback**: Uses memory store if Redis fails
- **Graceful**: No service interruption

## 📝 Next Steps

1. Add the environment variables to Render
2. Set up Redis (add-on or external)
3. Update Google OAuth settings
4. Redeploy the service
5. Monitor logs for successful Redis connection

The session store warning should disappear once Redis is properly configured!
