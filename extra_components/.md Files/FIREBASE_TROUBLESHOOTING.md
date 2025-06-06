# Firebase Google Authentication Troubleshooting

## 🚨 "Google sign-in failed. Please try again." Error

This error typically occurs due to Firebase Console configuration issues. Follow these steps to fix it:

## 🔧 Step 1: Check Browser Console

1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Try Google sign-in again
4. Look for specific error codes like:
   - `auth/unauthorized-domain`
   - `auth/operation-not-allowed`
   - `auth/invalid-api-key`
   - `auth/popup-blocked`

## 🔧 Step 2: Run Diagnostic Tool

In your browser console, run:
```javascript
window.firebaseConfigChecker.runAllChecks()
```

This will show you exactly what's wrong with your configuration.

## 🔧 Step 3: Firebase Console Setup

### 3.1 Enable Google Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `learnnect-blogs-75592`
3. Go to **Authentication** → **Sign-in method**
4. Click on **Google** provider
5. Click **Enable**
6. Add your **Web SDK configuration**
7. Click **Save**

### 3.2 Add Authorized Domains
1. In Firebase Console → **Authentication** → **Settings**
2. Go to **Authorized domains** tab
3. Add these domains:
   - `localhost` (for development)
   - `127.0.0.1` (for development)
   - Your production domain (if deploying)

### 3.3 Configure OAuth Consent Screen
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select the same project
3. Go to **APIs & Services** → **OAuth consent screen**
4. Configure the consent screen:
   - App name: `Learnnect`
   - User support email: Your email
   - Developer contact: Your email
5. Add authorized domains:
   - `learnnect-blogs-75592.firebaseapp.com`
   - Your custom domain (if any)

## 🔧 Step 4: Check Environment Variables

Create a `.env` file in your project root with:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyBIMOhHAQcNs5Pk1XXP1Zi0q1i0MxvSACY
VITE_FIREBASE_AUTH_DOMAIN=learnnect-blogs-75592.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=learnnect-blogs-75592
VITE_FIREBASE_STORAGE_BUCKET=learnnect-blogs-75592.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=55385329622
VITE_FIREBASE_APP_ID=1:55385329622:web:421a54d1f9c22b5ae49e77
VITE_FIREBASE_MEASUREMENT_ID=G-YZD54C1G14
```

**Note**: Restart your dev server after adding environment variables!

## 🔧 Step 5: Common Error Solutions

### Error: `auth/unauthorized-domain`
**Solution**: Add your domain to Firebase authorized domains
1. Firebase Console → Authentication → Settings → Authorized domains
2. Add `localhost` and your production domain

### Error: `auth/operation-not-allowed`
**Solution**: Enable Google provider in Firebase
1. Firebase Console → Authentication → Sign-in method
2. Enable Google provider

### Error: `auth/popup-blocked`
**Solution**: Allow popups in your browser
1. Click the popup blocker icon in address bar
2. Allow popups for this site
3. Try sign-in again

### Error: `auth/invalid-api-key`
**Solution**: Check your Firebase configuration
1. Verify API key in Firebase Console
2. Check environment variables
3. Restart dev server

## 🔧 Step 6: Test the Fix

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Clear browser cache and cookies**

3. **Open browser console** and run:
   ```javascript
   window.firebaseConfigChecker.runAllChecks()
   ```

4. **Try Google sign-in again**

5. **Check console for detailed error logs**

## 🔧 Step 7: Alternative Testing

If popups are blocked, try the redirect method:

```javascript
// In browser console
import firebaseAuthService from './src/services/firebaseAuthService.js';
await firebaseAuthService.signInWithGoogleRedirect();
```

## 📱 Mobile Testing

For mobile devices:
1. The app automatically uses redirect instead of popup
2. Make sure your domain is in Firebase authorized domains
3. Test on actual mobile device, not just browser dev tools

## 🆘 Still Having Issues?

1. **Check Firebase project status**: Ensure your Firebase project is active
2. **Verify billing**: Some Firebase features require billing enabled
3. **Check quotas**: Ensure you haven't exceeded Firebase quotas
4. **Try incognito mode**: Rule out browser extension issues
5. **Check network**: Ensure you can access Google services

## 📞 Getting Help

If you're still having issues, provide these details:
1. Exact error message from browser console
2. Output from `window.firebaseConfigChecker.runAllChecks()`
3. Your Firebase project ID
4. Browser and version
5. Operating system

## 🎯 Quick Fix Checklist

- [ ] Firebase project exists and is active
- [ ] Google provider is enabled in Firebase Console
- [ ] Authorized domains include `localhost`
- [ ] Environment variables are set correctly
- [ ] Development server restarted after env changes
- [ ] Browser allows popups for this site
- [ ] OAuth consent screen is configured
- [ ] No browser extensions blocking authentication
