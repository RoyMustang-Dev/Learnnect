# 🚀 New Firebase Project Setup for Learnnect Authentication

## Overview

This guide will help you create a dedicated Firebase project for Learnnect's user authentication and data storage system.

## 🎯 Why Create a New Project?

- **Dedicated User Management**: Store user profiles, learning progress, and course data
- **Better Organization**: Separate authentication from blog/content management
- **Scalability**: Dedicated resources for user-related features
- **Security**: Isolated user data with proper access controls

## 📋 Step-by-Step Setup

### Step 1: Create New Firebase Project

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Click "Create a project"**
3. **Project Configuration:**
   ```
   Project name: Learnnect Platform
   Project ID: learnnect-platform-[random] (auto-generated)
   ```
4. **Google Analytics:** Enable (recommended for user insights)
5. **Click "Create project"**

### Step 2: Enable Authentication

1. **In your new project, navigate to Authentication**
2. **Click "Get started"**
3. **Go to "Sign-in method" tab**
4. **Enable Google Provider:**
   - Toggle "Google" to enabled
   - Add your support email
   - Click "Save"

### Step 3: Set Up Firestore Database

1. **Go to Firestore Database**
2. **Click "Create database"**
3. **Security Rules:** Start in test mode (we'll secure later)
4. **Location:** Choose closest to your users (e.g., us-central1)
5. **Click "Done"**

### Step 4: Configure Web App

1. **Go to Project Settings** (gear icon)
2. **Scroll to "Your apps" section**
3. **Click the web icon `</>`**
4. **App Configuration:**
   ```
   App nickname: Learnnect Web App
   Firebase Hosting: No (for now)
   ```
5. **Click "Register app"**
6. **Copy the configuration object**

### Step 5: Update Your Environment

1. **Create `.env` file in your project root:**
   ```bash
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your-actual-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-actual-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-actual-sender-id
   VITE_FIREBASE_APP_ID=your-actual-app-id
   VITE_FIREBASE_MEASUREMENT_ID=your-actual-measurement-id
   ```

2. **Update `src/config/firebase.ts`** with your new config values

3. **Restart your development server:**
   ```bash
   npm run dev
   ```

### Step 6: Configure OAuth Consent Screen

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Select your Firebase project**
3. **Navigate to APIs & Services → OAuth consent screen**
4. **Configure:**
   ```
   App name: Learnnect
   User support email: your-email@domain.com
   App domain: your-domain.com (if you have one)
   Developer contact: your-email@domain.com
   ```
5. **Add authorized domains:**
   - `your-project-id.firebaseapp.com`
   - Your custom domain (if any)

### Step 7: Set Up Firestore Security Rules

1. **Go to Firestore Database → Rules**
2. **Replace with these secure rules:**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can read/write their own profile
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Public read access for courses (if needed)
       match /courses/{courseId} {
         allow read: if true;
         allow write: if request.auth != null && 
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
       }
     }
   }
   ```
3. **Click "Publish"**

## 🔧 What This Setup Provides

### User Data Storage
- **User Profiles**: Complete user information in Firestore
- **Learning Progress**: Track course completion and progress
- **Preferences**: User settings and preferences
- **Enrollment Data**: Course enrollments and certificates

### Authentication Features
- **Google Sign-in**: Seamless Google authentication
- **Session Management**: Automatic session handling
- **Security**: Firebase handles all security aspects
- **Scalability**: Handles thousands of users

### Database Structure
```
users/
  {userId}/
    - uid: string
    - email: string
    - displayName: string
    - photoURL: string
    - provider: 'google'
    - enrolledCourses: string[]
    - completedCourses: string[]
    - learningProgress: object
    - preferences: object
    - createdAt: timestamp
    - lastLoginAt: timestamp
    - role: 'student' | 'instructor' | 'admin'
```

## 🧪 Testing Your Setup

1. **Run the diagnostic tool:**
   ```javascript
   // In browser console
   window.firebaseConfigChecker.runAllChecks()
   ```

2. **Test Google sign-in:**
   - Go to `/auth` page
   - Click Google sign-in button
   - Complete authentication
   - Check Firestore for user data

3. **Verify user data:**
   - Check Firebase Console → Firestore
   - Look for new user document in `users` collection
   - Verify all user fields are populated

## 🔒 Security Considerations

### Firestore Rules
- Users can only access their own data
- Admin roles for course management
- Public read access for course catalog

### Authentication
- Google OAuth handles security
- Firebase manages tokens and sessions
- Automatic token refresh

### Data Privacy
- User data stored securely in Firestore
- GDPR compliant with Firebase
- User can delete their own data

## 🚀 Next Steps

After setup is complete:

1. **Test authentication flow**
2. **Verify user data storage**
3. **Add course enrollment features**
4. **Implement learning progress tracking**
5. **Add user profile management**

## 🆘 Troubleshooting

### Common Issues:
- **"unauthorized-domain"**: Add localhost to authorized domains
- **"operation-not-allowed"**: Enable Google provider in Firebase
- **Firestore permission denied**: Check security rules
- **Config errors**: Verify environment variables

### Getting Help:
1. Check Firebase Console for error logs
2. Use browser console diagnostic tools
3. Verify all configuration steps
4. Check Firestore security rules

## 📊 Monitoring & Analytics

With Firebase Analytics enabled, you can track:
- User sign-ups and logins
- Course engagement
- Learning progress
- User retention
- Feature usage

Access analytics in Firebase Console → Analytics.

---

**🎉 Congratulations!** You now have a dedicated Firebase project for Learnnect's user authentication and data management system.
