# Blog System Setup Guide

## Overview
This guide will help you set up the complete blog system with Firebase backend, admin authentication, and all required functionality.

## 🔥 Firebase Setup

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `learnnect-blog` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Firestore Database
1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (we'll configure security rules later)
4. Select a location closest to your users
5. Click "Done"

### Step 3: Enable Authentication
1. Go to "Authentication" in Firebase Console
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

### Step 4: Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (</>) to add a web app
4. Register your app with name "Learnnect Blog"
5. Copy the Firebase configuration object

### Step 5: Update Firebase Config
Replace the placeholder values in `src/config/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

## 👤 Admin Setup

### Step 1: Create Admin Account
1. Go to Firebase Authentication
2. Click "Add user"
3. Enter email: `admin@learnnect.com`
4. Enter a secure password
5. Click "Add user"

### Step 2: Update Admin Emails (Optional)
Edit `src/services/adminAuthService.ts` to add more admin emails:

```typescript
const ADMIN_EMAILS = [
  'admin@learnnect.com',
  'superadmin@learnnect.com',
  'your-email@domain.com'  // Add your email here
];
```

## 🗄️ Database Structure

The system will automatically create these Firestore collections:

### Collections:
- **blogPosts**: Blog post documents
- **blogComments**: Comment documents
- **blogLikes**: Like documents
- **blogCategories**: Category documents
- **adminUsers**: Admin user profiles

### Sample Data
You can add sample categories manually in Firestore:

```json
// blogCategories collection
{
  "name": "Technology",
  "slug": "technology",
  "description": "Latest tech trends and insights",
  "color": "#00FFFF"
}
```

## 🔐 Security Rules

Update Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Blog posts - read by all, write by admin only
    match /blogPosts/{postId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.email in ['admin@learnnect.com', 'superadmin@learnnect.com'];
    }
    
    // Comments - read by all, write by authenticated users
    match /blogComments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         request.auth.token.email in ['admin@learnnect.com']);
    }
    
    // Likes - read by all, write by authenticated users
    match /blogLikes/{likeId} {
      allow read: if true;
      allow create, delete: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Categories - read by all, write by admin only
    match /blogCategories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.email in ['admin@learnnect.com', 'superadmin@learnnect.com'];
    }
    
    // Admin users - admin only
    match /adminUsers/{userId} {
      allow read, write: if request.auth != null && 
        request.auth.token.email in ['admin@learnnect.com', 'superadmin@learnnect.com'];
    }
  }
}
```

## 🚀 Features Implemented

### For Regular Users:
- ✅ View all published blog posts
- ✅ Search and filter posts
- ✅ Read individual posts
- ✅ Like/unlike posts
- ✅ Comment on posts
- ✅ Edit/delete their own comments
- ✅ Responsive design with neon cyber theme

### For Admins:
- ✅ Separate admin authentication
- ✅ Create new blog posts
- ✅ Edit existing posts
- ✅ Delete posts
- ✅ Manage post status (draft/published)
- ✅ View analytics and stats
- ✅ Moderate comments

### Additional Pages:
- ✅ Privacy Policy
- ✅ Terms of Service
- ✅ Cookie Policy
- ✅ All linked in footer and navbar

## 🎨 Theme Integration
All components match your neon cyber theme with:
- Consistent color scheme (cyan, magenta, blue)
- Glass morphism effects
- Animated backgrounds
- Responsive design
- Professional styling

## 📱 Usage

### Accessing the Blog:
- Public blog: `/blog`
- Admin login: Create separate admin login page or use existing auth with admin email

### Admin Functions:
1. Login with admin email
2. Access admin dashboard
3. Create/edit/delete posts
4. Manage categories
5. Monitor engagement

## 🔧 Customization

### Adding New Categories:
```typescript
// Use categoryService in your admin panel
await categoryService.createCategory({
  name: "AI & Machine Learning",
  slug: "ai-ml",
  description: "Artificial Intelligence insights",
  color: "#FF00FF"
});
```

### Customizing Admin Emails:
Edit the `ADMIN_EMAILS` array in `adminAuthService.ts`

## 🚨 Important Notes

1. **Security**: Always use the provided security rules
2. **Admin Access**: Only emails in ADMIN_EMAILS can perform admin functions
3. **Authentication**: Users must be logged in to comment/like
4. **Responsive**: All components are mobile-first responsive
5. **Performance**: Firestore queries are optimized for performance

## 📞 Support

If you need help with setup:
1. Check Firebase Console for any errors
2. Verify your configuration in `firebase.ts`
3. Ensure admin emails are correctly set
4. Test with sample data first

The blog system is now ready for production use! 🎉
