# 🔐 Internal Configuration Reference
**⚠️ CONFIDENTIAL - Internal Use Only**

## 🔥 Firebase Configuration

### Current Firebase Project Details
- **Project ID**: `learnnect-edtech-platform`
- **Project Name**: `Learnnect EdTech Platform`
- **Region**: `us-central1`

### Environment Variables (.env)
```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=learnnect-edtech-platform.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=learnnect-edtech-platform
VITE_FIREBASE_STORAGE_BUCKET=learnnect-edtech-platform.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Firebase Console Access
- **URL**: https://console.firebase.google.com/project/learnnect-edtech-platform
- **Admin Email**: your-admin@email.com
- **Billing Account**: Pay-as-you-go (Blaze Plan)

## 🔗 OAuth Configuration

### Google OAuth
- **Client ID**: `123456789012-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx`
- **Authorized Domains**: 
  - `localhost:5173` (development)
  - `learnnect-app.onrender.com` (production)
- **Redirect URIs**: 
  - `https://learnnect-edtech-platform.firebaseapp.com/__/auth/handler`

### GitHub OAuth
- **Application Name**: `Learnnect EdTech Platform`
- **Client ID**: `Iv1.xxxxxxxxxxxxxxxx`
- **Client Secret**: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Homepage URL**: `https://learnnect-app.onrender.com`
- **Authorization Callback URL**: `https://learnnect-edtech-platform.firebaseapp.com/__/auth/handler`

## 🌐 Deployment Configuration

### Render.com Settings
- **Service Name**: `learnnect-edtech-platform`
- **Repository**: `https://github.com/your-username/learnnect-edtech-platform`
- **Branch**: `main`
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: `18`

### Domain Configuration
- **Production URL**: `https://learnnect-app.onrender.com`
- **Custom Domain**: `learnnect.com` (if configured)
- **SSL**: Auto-managed by Render

## 📊 Google Sheets Integration

### Sheets Configuration
- **Sheet ID**: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`
- **API Key**: `AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Service Account Email**: `learnnect-sheets@learnnect-edtech-platform.iam.gserviceaccount.com`

### Sheet Structure
#### UserSignUps Tab
| Column A | Column B | Column C | Column D | Column E | Column F |
|----------|----------|----------|----------|----------|----------|
| Platform | UserName | UserEmail | Mobile | Timestamp | UserID |

#### ExistingUsers Tab
| Column A | Column B | Column C |
|----------|----------|----------|
| Email | IsActive | LastLogin |

## 🔧 Development Environment

### Required Node.js Version
- **Minimum**: Node.js 18.x
- **Recommended**: Node.js 20.x LTS
- **npm Version**: 9.x or higher

### VS Code Extensions
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "ms-vscode.vscode-json"
  ]
}
```

### Package Versions (Current)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.1",
    "firebase": "^10.7.1",
    "lucide-react": "^0.303.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
```

## 🚀 Quick Setup Commands

### Initial Setup
```bash
# Clone repository
git clone https://github.com/your-username/learnnect-edtech-platform.git
cd learnnect-edtech-platform

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with actual values

# Start development server
npm run dev
```

### Production Deployment
```bash
# Build for production
npm run build

# Test production build locally
npm run preview

# Deploy to Render (automatic on git push to main)
git push origin main
```

## 🔍 Monitoring & Analytics

### Firebase Analytics
- **Measurement ID**: `G-XXXXXXXXXX`
- **Data Retention**: 26 months
- **Enhanced Measurement**: Enabled

### Error Tracking
- **Service**: Firebase Crashlytics
- **Alerts**: Configured for critical errors
- **Reporting**: Weekly summary emails

### Performance Monitoring
- **Service**: Firebase Performance
- **Metrics**: Page load times, API response times
- **Alerts**: Performance degradation alerts

## 🔐 Security Configuration

### Firebase Security Rules
```javascript
// Current Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /courses/{courseId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### CORS Configuration
```json
{
  "origin": [
    "https://learnnect-app.onrender.com",
    "https://learnnect.com",
    "http://localhost:5173"
  ],
  "methods": ["GET", "POST", "PUT", "DELETE"],
  "allowedHeaders": ["Content-Type", "Authorization"]
}
```

## 📱 Mobile App Configuration (Future)

### React Native Setup (Planned)
- **Bundle ID**: `com.learnnect.app`
- **Package Name**: `com.learnnect.app`
- **Firebase iOS Config**: `GoogleService-Info.plist`
- **Firebase Android Config**: `google-services.json`

## 🔄 Backup & Recovery

### Database Backups
- **Frequency**: Daily automated backups
- **Retention**: 30 days
- **Location**: Firebase automatic backups

### Code Repository
- **Primary**: GitHub (main branch)
- **Backup**: GitLab mirror
- **Branches**: main, development, staging

## 📞 Emergency Contacts

### Technical Team
- **Lead Developer**: developer@learnnect.com
- **DevOps Engineer**: devops@learnnect.com
- **System Administrator**: admin@learnnect.com

### Service Providers
- **Firebase Support**: Firebase Console → Support
- **Render Support**: help@render.com
- **GitHub Support**: support@github.com

## 🔄 Update Schedule

### Regular Maintenance
- **Dependencies**: Monthly updates
- **Security Patches**: Immediate
- **Feature Updates**: Bi-weekly releases
- **Major Versions**: Quarterly planning

### Monitoring Schedule
- **Daily**: Error logs review
- **Weekly**: Performance metrics
- **Monthly**: Security audit
- **Quarterly**: Full system review

---

**Last Updated**: December 2024
**Document Version**: 1.0
**Next Review**: January 2025
