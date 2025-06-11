# Authentication Data Documentation

This document outlines the data we receive from Google and GitHub OAuth authentication in our application.

## Overview

Our application uses Firebase Authentication with Google and GitHub OAuth providers. When users sign in or sign up, we receive comprehensive profile data that gets stored in our user system.

## Google OAuth Data

### Basic Data (Always Available)
- **`id`** - Firebase UID (unique identifier)
- **`email`** - User's email address
- **`name`** - Full display name
- **`picture`** - Profile photo URL (Gravatar/Google profile image)
- **`provider`** - Always "google"
- **`emailVerified`** - Boolean indicating if email is verified

### Enhanced Data (Available during initial authentication)
- **`googleId`** - Google's unique user ID
- **`firstName`** - Given name from Google profile
- **`lastName`** - Family name from Google profile
- **`locale`** - User's locale/language preference
- **`rawProfile`** - Complete Google profile object for debugging

### Google OAuth Scopes Requested
```javascript
- 'email'
- 'profile'
- 'https://www.googleapis.com/auth/userinfo.profile'
- 'https://www.googleapis.com/auth/userinfo.email'
```

## GitHub OAuth Data

### Basic Data (Always Available)
- **`id`** - Firebase UID (unique identifier)
- **`email`** - User's email address
- **`name`** - Full display name or GitHub username
- **`picture`** - GitHub avatar URL
- **`provider`** - Always "github"
- **`emailVerified`** - Boolean indicating if email is verified

### Enhanced Data (Available during initial authentication)
- **`githubId`** - GitHub's unique user ID (number)
- **`githubLogin`** - GitHub username
- **`username`** - Same as githubLogin
- **`firstName`** - Extracted from full name or username
- **`lastName`** - Extracted from full name (if available)
- **`bio`** - User's GitHub bio
- **`company`** - Company information
- **`location`** - User's location
- **`blog`** - Personal website/blog URL
- **`website`** - Same as blog field
- **`publicRepos`** - Number of public repositories
- **`followers`** - Number of followers
- **`following`** - Number of users following
- **`hireable`** - Boolean indicating if user is hireable
- **`createdAt`** - GitHub account creation date
- **`updatedAt`** - Last profile update date
- **`rawProfile`** - Complete GitHub profile object for debugging

### GitHub OAuth Scopes Requested
```javascript
- 'user:email'
- 'read:user'
- 'user:follow'
```

## Data Storage and Usage

### User Profile Structure
The authentication data is converted to our internal `User` format:
```typescript
interface User {
  id: string;           // Firebase UID
  email: string;        // User email
  phone?: string;       // Phone number (if provided)
  name: string;         // Display name
  avatar?: string;      // Profile picture URL
  createdAt: string;    // Account creation timestamp
  lastLogin?: string;   // Last login timestamp
}
```

### Profile Picture Usage
- **Google**: Uses Google profile photo or Gravatar
- **GitHub**: Uses GitHub avatar image
- **Fallback**: Generic user icon if image fails to load
- **Implementation**: Navbar and dashboard components now display actual user avatars

## Data Availability Notes

### Initial Authentication vs. Subsequent Logins
- **First-time authentication**: Full profile data available via `additionalUserInfo.profile`
- **Subsequent logins**: Only basic Firebase user data available
- **Enhanced data**: Stored in Firestore during first authentication for future use

### Mobile vs. Desktop
- **Desktop**: Uses popup authentication (preferred)
- **Mobile**: Falls back to redirect authentication
- **Data consistency**: Same data available regardless of authentication method

## Privacy and Security

### Data Handling
- Only necessary profile data is stored
- Raw profile data is logged for debugging but not permanently stored
- User can control profile visibility through application settings

### Data Sources
- **Google**: Official Google OAuth API
- **GitHub**: Official GitHub OAuth API
- **Verification**: Email verification status tracked for both providers

## Implementation Files

### Key Components
- `src/services/firebaseAuthService.ts` - Authentication logic
- `src/contexts/AuthContext.tsx` - User state management
- `src/components/Navbar.tsx` - Profile display in navigation
- `src/pages/Dashboard.tsx` - User dashboard with profile info

### Profile Image Implementation
The navbar now displays actual user profile images with fallback:
```typescript
{user?.avatar ? (
  <img 
    src={user.avatar} 
    alt={user.name || 'User'} 
    className="w-8 h-8 rounded-full object-cover border-2 border-neon-cyan/30"
    onError={(e) => {
      // Fallback to icon if image fails to load
      e.currentTarget.style.display = 'none';
      e.currentTarget.nextElementSibling?.classList.remove('hidden');
    }}
  />
) : null}
<div className={`w-8 h-8 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-full flex items-center justify-center ${user?.avatar ? 'hidden' : ''}`}>
  <User className="h-4 w-4 text-white" />
</div>
```

## Future Enhancements

### Potential Additional Data
- **Google**: Calendar access, Drive files, YouTube data
- **GitHub**: Repository access, commit history, organization memberships
- **LinkedIn**: Professional profile data (if LinkedIn OAuth is added)

### Data Synchronization
- Periodic profile updates from OAuth providers
- User-initiated profile refresh functionality
- Automatic avatar updates when changed on provider platforms
