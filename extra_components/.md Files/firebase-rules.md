# 🔥 Firebase Rules for Learnnect Platform

## 📋 Firestore Database Rules

Replace your current Firestore rules with these production-ready rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can read/write their own profile data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their own resumes
    match /resumes/{resumeId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Users can read/write their own analytics
    match /profile_analytics/{analyticsId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Messages: users can read/write messages they're part of
    match /messages/{messageId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.senderId || 
         request.auth.uid == resource.data.receiverId);
    }
    
    // Conversations: users can read/write conversations they're part of
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
    }
    
    // Connections: users can read/write their own connections
    match /connections/{connectionId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.senderId || 
         request.auth.uid == resource.data.receiverId);
    }
    
    // Notifications: users can read/write their own notifications
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // View events: users can write their own view events, read any
    match /view_events/{eventId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.auth.uid == request.resource.data.viewerUserId;
    }
    
    // Public course data (read-only for all authenticated users)
    match /courses/{courseId} {
      allow read: if request.auth != null;
      allow write: if false; // Only admins should write courses
    }
    
    // Test documents (for debugging - remove in production)
    match /test/{testId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 📋 Firebase Storage Rules

Go to Firebase Console → Storage → Rules and replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Resume uploads: users can upload/read their own resumes
    match /resumes/{userId}_{timestamp}.{extension} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Profile pictures: users can upload/read their own profile pictures
    match /profile-pictures/{userId}_{timestamp}.{extension} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Test files (for debugging - remove in production)
    match /test/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🔧 CORS Configuration

### Method 1: Google Cloud Console (No Billing Required)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to **Cloud Storage** → **Browser**
4. Click on your storage bucket name
5. Click **"Edit bucket permissions"** or **"Permissions"** tab
6. Add CORS configuration

### Method 2: Firebase Console (Easier)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Storage** → **Files**
4. Click the **"Rules"** tab
5. Make sure your rules allow authenticated access

## 💰 Billing Requirements

**Good News: You DON'T need billing enabled for:**
- Firebase Authentication
- Firestore Database (free tier: 50K reads, 20K writes per day)
- Firebase Storage (free tier: 1GB storage, 10GB transfer per month)
- Firebase Hosting

**You only need billing for:**
- Exceeding free tier limits
- Using Google Cloud services beyond Firebase
- Advanced features like Cloud Functions (but we're not using those)

## 🚀 Quick Fix for Your Current Issue

**Step 1:** Update your Firestore rules (copy from above)
**Step 2:** Update your Storage rules (copy from above)
**Step 3:** Test with the Firebase Debug component

Your current rules are actually fine for development, but the Storage CORS issue is separate from Firestore rules.
