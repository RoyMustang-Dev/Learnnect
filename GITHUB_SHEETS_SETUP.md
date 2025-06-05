# GitHub Authentication & Google Sheets Database Setup Guide

## 🎯 Overview

This guide will help you set up:
1. **Firebase GitHub Authentication** - Allow users to sign up/login with GitHub
2. **Google Sheets Database** - Store user data in a Google Sheet for easy management
3. **Complete Authentication Flow** - Same duplicate detection logic as Google auth

## 🔥 Part 1: Firebase GitHub Authentication Setup

### Step 1: Create GitHub OAuth App

1. **Go to GitHub Settings**
   - Visit: https://github.com/settings/developers
   - Click "OAuth Apps" → "New OAuth App"

2. **Configure OAuth App**

   **Option A: Fixed Port (Recommended)**

   The app is configured to always use port 5173 via `vite.config.ts`:
   ```
   Application name: Learnnect (Local)
   Homepage URL: http://localhost:5173
   Authorization callback URL: https://your-project.firebaseapp.com/__/auth/handler
   ```

   **Option B: Multiple Ports (Flexible)**

   Create separate OAuth apps for different ports:
   ```
   App 1: Learnnect (Local 5173)
   Homepage URL: http://localhost:5173

   App 2: Learnnect (Local 5174)
   Homepage URL: http://localhost:5174

   App 3: Learnnect (Local 3000)
   Homepage URL: http://localhost:3000
   ```
   All use the same callback: `https://your-project.firebaseapp.com/__/auth/handler`

   **For Production:**
   ```
   Application name: Learnnect
   Homepage URL: https://your-domain.com
   Authorization callback URL: https://your-project.firebaseapp.com/__/auth/handler
   ```

   **Note:** The Authorization callback URL always uses your Firebase domain, even for local testing. Firebase handles the OAuth flow and then redirects back to your local app.

3. **Get Credentials**
   - Copy the **Client ID** and **Client Secret**

### Step 2: Configure Firebase

1. **Open Firebase Console**
   - Go to: https://console.firebase.google.com/
   - Select your project

2. **Enable GitHub Authentication**
   - Go to Authentication → Sign-in method
   - Click "GitHub" → Enable
   - Paste your GitHub **Client ID** and **Client Secret**
   - Save

### Step 3: Test GitHub Authentication

The GitHub authentication is now ready! Users can:
- Sign up with GitHub (with duplicate detection)
- Login with GitHub
- Get the same "Account Exists" modal if they try to signup with existing email

## 📊 Part 2: Google Sheets Database Setup

### Step 1: Create Google Sheet

1. **Create New Sheet**
   - Go to: https://sheets.google.com/
   - Create a new spreadsheet
   - Name it: "Learnnect User Database"

2. **Set Up Headers** (Row 1)
   ```
   A1: Platform Name
   B1: User Name  
   C1: User Email
   D1: Mobile
   E1: User ID
   F1: Created At
   G1: Last Login
   H1: Profile Picture
   I1: GitHub Username
   ```

3. **Get Sheet ID**
   - Copy the Sheet ID from URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

### Step 2: Enable Google Sheets API

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your Firebase project (or create new one)

2. **Enable Sheets API**
   - Go to APIs & Services → Library
   - Search "Google Sheets API"
   - Click "Enable"

3. **Create API Key**
   - Go to APIs & Services → Credentials
   - Click "Create Credentials" → "API Key"
   - Copy the API key

4. **Restrict API Key** (Recommended)
   - Click on your API key
   - Under "API restrictions" → Select "Google Sheets API"
   - Under "Website restrictions" → Add your domain

### Step 3: Configure Sheet Permissions

**Option A: Public Sheet (Easier)**
```
1. Click "Share" on your Google Sheet
2. Change to "Anyone with the link can view"
3. Copy the link
```

**Option B: Service Account (More Secure)**
```
1. Create a service account in Google Cloud Console
2. Download the JSON key file
3. Share the sheet with the service account email
4. Use service account authentication (requires backend)
```

### Step 4: Add Environment Variables

Add to your `.env` file:
```env
REACT_APP_GOOGLE_SHEET_ID=your_sheet_id_here
REACT_APP_GOOGLE_SHEETS_API_KEY=your_api_key_here
```

## 🧪 Part 3: Testing the Complete System

### Test GitHub Authentication

1. **Test Signup Flow**
   ```
   1. Go to signup page
   2. Click "Sign up with GitHub"
   3. Complete GitHub OAuth
   4. Should create account and add to Google Sheets
   ```

2. **Test Duplicate Detection**
   ```
   1. Logout
   2. Go to signup page again
   3. Click "Sign up with GitHub" with same account
   4. Should show "Account Exists" modal
   5. Click "Switch to Login"
   6. Should redirect to login page
   7. Click "Login with GitHub"
   8. Should login successfully
   ```

### Verify Google Sheets Integration

Check your Google Sheet after each signup:
- New row should be added with user data
- Platform Name should show "GitHub"
- All user information should be populated
- Last Login should update on subsequent logins

## 📋 Part 4: Data Structure

### Google Sheets Columns

| Column | Description | Example |
|--------|-------------|---------|
| Platform Name | Authentication method | Google, GitHub, LinkedIn, Form |
| User Name | Display name | John Doe |
| User Email | Email address | john@example.com |
| Mobile | Phone number | +1234567890 |
| User ID | Firebase UID | abc123xyz789 |
| Created At | Account creation | 2024-01-15T10:30:00Z |
| Last Login | Last login time | 2024-01-16T14:20:00Z |
| Profile Picture | Avatar URL | https://github.com/user.jpg |
| GitHub Username | GitHub handle | johndoe |

### Firebase User Data

Users are stored in both:
- **Firestore** (for app functionality)
- **Google Sheets** (for easy management/reporting)

## 🔧 Part 5: Customization

### Adding More Platforms

To add other platforms:

1. **Add to Firebase Auth Service**
   ```typescript
   // Add new provider
   private newProvider: NewAuthProvider;
   ```

2. **Add to AuthContext**
   ```typescript
   signUpWithNewProvider: () => Promise<void>;
   loginWithNewProvider: () => Promise<void>;
   ```

3. **Update Google Sheets**
   - Platform Name will automatically show the new provider name

### Custom Sheet Columns

To add more columns:

1. **Update UserSheetData interface**
   ```typescript
   export interface UserSheetData {
     // ... existing fields
     customField?: string;
   }
   ```

2. **Update addUserToSheet method**
   ```typescript
   const rowData = [
     // ... existing data
     userData.customField || ''
   ];
   ```

## 🚀 Part 6: Production Deployment

### Security Checklist

- [ ] API key restrictions configured
- [ ] Sheet permissions properly set
- [ ] Firebase security rules configured
- [ ] Environment variables secured
- [ ] HTTPS enabled for OAuth callbacks

### Monitoring

- Monitor Firebase Authentication usage
- Check Google Sheets API quotas
- Set up error tracking for failed authentications
- Monitor sheet write operations

## 📞 Support

If you encounter issues:

1. **Check Firebase Console** for authentication errors
2. **Check Browser Console** for JavaScript errors  
3. **Verify API Keys** are correctly configured
4. **Test Sheet Permissions** manually
5. **Check Network Tab** for failed API calls

The system is now ready for production use with GitHub authentication and Google Sheets database integration! 🎉
