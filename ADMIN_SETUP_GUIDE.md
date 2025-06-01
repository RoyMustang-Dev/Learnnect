# 🔐 Admin Setup Guide

## Quick Setup Steps

### Step 1: Add Your Email to Admin List
1. **Edit the admin emails file**: `src/services/adminAuthService.ts`
2. **Add your email** to the `ADMIN_EMAILS` array:

```typescript
const ADMIN_EMAILS = [
  'admin@learnnect.com',
  'superadmin@learnnect.com',
  'your-email@domain.com'  // Add your email here
];
```

### Step 2: Create Admin Account in Firebase
1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**
3. **Go to Authentication** → Users tab
4. **Click "Add user"**
5. **Enter your email and password**
6. **Click "Add user"**

### Step 3: Test Admin Access
1. **Visit**: `http://localhost:3000/admin/blog`
2. **Login with your credentials**
3. **You should see the admin dashboard**

## Alternative: Quick Admin Account Creation

### Option A: Use Firebase Auth Emulator (Development)
```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Start auth emulator
firebase emulators:start --only auth
```

### Option B: Create via Code (One-time setup)
Add this temporary code to your app (remove after creating admin):

```typescript
// Temporary admin creation function
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './config/firebase';

const createAdminAccount = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      'admin@learnnect.com', 
      'your-secure-password'
    );
    console.log('Admin account created:', userCredential.user.email);
  } catch (error) {
    console.error('Error creating admin:', error);
  }
};

// Call this function once, then remove it
// createAdminAccount();
```

## Testing the System

### 1. Admin Login Test
- Visit: `http://localhost:3000/admin/blog`
- Should show login form
- Enter admin credentials
- Should redirect to dashboard

### 2. Create First Blog Post
- Click "New Post"
- Fill in the form:
  - **Title**: "Welcome to Our Blog"
  - **Excerpt**: "This is our first blog post"
  - **Content**: "# Welcome!\n\nThis is our first blog post!"
  - **Author**: "Admin"
  - **Category**: "News"
  - **Status**: "Published"
- Click "Create Post"

### 3. View Blog
- Visit: `http://localhost:3000/blog`
- Should see your new post

## Troubleshooting

### "Access Denied" Error
**Cause**: Email not in admin list or not logged in
**Solution**: 
1. Check email is in `ADMIN_EMAILS` array
2. Ensure you're logged in with correct email
3. Clear browser cache and try again

### "Firebase Auth Error"
**Cause**: Firebase configuration issue
**Solution**:
1. Check `src/config/firebase.ts` has correct config
2. Verify Firebase project is active
3. Check Authentication is enabled in Firebase Console

### "Cannot Create Posts"
**Cause**: Firestore permissions or service issue
**Solution**:
1. Check Firestore rules allow admin writes
2. Verify `blogService.ts` is working
3. Check browser console for errors

## Security Notes

### Production Setup
1. **Remove test emails** from admin list
2. **Use strong passwords** for admin accounts
3. **Enable 2FA** in Firebase Console
4. **Set proper Firestore rules**:

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Blog posts - read public, write admin only
    match /blogPosts/{postId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.email in [
          'admin@learnnect.com',
          'your-admin@domain.com'
        ];
    }
    
    // Admin users - admin only
    match /adminUsers/{userId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
    }
  }
}
```

## Quick Commands

### Start Development Server
```bash
npm start
```

### Access Points
- **Public Blog**: http://localhost:3000/blog
- **Admin Panel**: http://localhost:3000/admin/blog
- **Firebase Console**: https://console.firebase.google.com/

### Admin Emails (Current)
- admin@learnnect.com
- superadmin@learnnect.com

**Remember to add your email to this list!**

## Next Steps
1. ✅ Add your email to admin list
2. ✅ Create admin account in Firebase
3. ✅ Test login at `/admin/blog`
4. ✅ Create your first blog post
5. ✅ View blog at `/blog`
6. 🚀 Start creating content!

---

**Need help?** Check the browser console for error messages or contact support.
