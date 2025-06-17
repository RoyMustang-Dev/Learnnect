# 📋 Learnnect Deployment Reference Card

## 🔗 URLs & Endpoints

### Production URLs
- **Frontend**: https://learnnect.com
- **Backend**: https://learnnect-backend.onrender.com
- **Admin Email**: support@learnnect.com

### API Endpoints
- Health Check: `GET /api/storage/health`
- Upload Resume: `POST /api/storage/upload-resume`
- Get User Resumes: `GET /api/storage/user-resumes`
- Delete Resume: `DELETE /api/storage/delete-resume`
- Download URL: `GET /api/storage/download-url`

## 🔧 Service Configuration

### Render (Backend)
```
Service Name: learnnect-backend
Environment: Python 3.11
Build Command: pip install -r requirements.txt
Start Command: python -m uvicorn learnnect_storage_api:app --host 0.0.0.0 --port $PORT
Root Directory: backend
```

### Netlify (Frontend)
```
Build Command: npm run build:prod
Publish Directory: dist
Node Version: 18
```

## 🌍 Environment Variables

### Backend (Render)
```
HOST=0.0.0.0
DEBUG=false
ENVIRONMENT=production
LEARNNECT_DRIVE_FOLDER_ID=1w-7EywK43Pn1GkwRqzScE1qbnh8GUwdd
CORS_ORIGINS=["https://learnnect.com", "https://www.learnnect.com", "https://learnnect.netlify.app"]
GOOGLE_SERVICE_ACCOUNT_JSON={...your service account JSON...}
```

### Frontend (Netlify)
```
REACT_APP_API_URL=https://learnnect-backend.onrender.com/api
VITE_API_BASE_URL=https://learnnect-backend.onrender.com
REACT_APP_ENVIRONMENT=production
VITE_FIREBASE_API_KEY=AIzaSyCse04obta35yfdwiBlwzULk7-tCPlrUNo
VITE_FIREBASE_AUTH_DOMAIN=learnnect-platform.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=learnnect-platform
VITE_FIREBASE_STORAGE_BUCKET=learnnect-platform.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=161279819125
VITE_FIREBASE_APP_ID=1:161279819125:web:9212bfa93fd6e5d3fca73c
VITE_FIREBASE_MEASUREMENT_ID=G-RQNF1VWZ5B
VITE_GROQ_API_KEY=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
LEARNNECT_DRIVE_FOLDER_ID=1w-7EywK43Pn1GkwRqzScE1qbnh8GUwdd
```

## 🔒 Security Checklist

- ✅ Service account key removed from repository
- ✅ Environment variables set in deployment platforms
- ✅ CORS configured for production domains
- ✅ HTTPS enabled on both frontend and backend
- ✅ Sensitive files added to .gitignore

## 🚀 Deployment Commands

### Local Testing
```bash
# Backend
cd backend
python -m uvicorn learnnect_storage_api:app --reload

# Frontend
npm run dev
```

### Production Build
```bash
# Frontend
npm run build:prod

# Backend (automatic on Render)
pip install -r requirements.txt
```

## 📞 Support Contacts

### Google Workspace
- Email: support@learnnect.com
- Aliases: welcome@, tech-support@, sales@learnnect.com

### Domain & Hosting
- Domain: Hostinger (learnnect.com)
- Frontend: Netlify
- Backend: Render

### Services
- Database: Firebase
- Storage: Google Drive
- AI: Groq API

## 🔄 Update Process

1. **Code Changes**: Push to GitHub main branch
2. **Backend**: Auto-deploys on Render
3. **Frontend**: Auto-deploys on Netlify
4. **Environment**: Update via platform dashboards

## 📊 Monitoring

### Health Checks
- Backend: `curl https://learnnect-backend.onrender.com/api/storage/health`
- Frontend: Visit https://learnnect.com

### Logs
- Render: Dashboard → Service → Logs
- Netlify: Dashboard → Site → Functions/Deploy logs

## 🆘 Emergency Contacts

- **Google Cloud Issues**: Google Cloud Support
- **Domain Issues**: Hostinger Support
- **Deployment Issues**: Check platform status pages
  - Render: https://status.render.com
  - Netlify: https://status.netlify.com
