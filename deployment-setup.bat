@echo off
echo 🚀 Learnnect Deployment Setup
echo =============================
echo.

echo 🔐 Step 1: Generating secure API keys...
cd backend
python generate_api_keys.py
echo.

echo 📋 Step 2: Checking deployment readiness...
echo.

echo ✅ Checking frontend build...
cd ..
call npm install
call npm run build:prod
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed!
    pause
    exit /b 1
)
echo ✅ Frontend build successful!
echo.

echo 📁 Step 3: Checking required files...
if exist "backend\service-account-key.json" (
    echo ⚠️  WARNING: service-account-key.json found!
    echo    This file contains sensitive data and should NOT be deployed.
    echo    Copy its content to Render environment variables instead.
    echo.
)

if exist "backend\.gitignore" (
    echo ✅ Backend .gitignore exists
) else (
    echo ❌ Backend .gitignore missing
)

if exist "render.yaml" (
    echo ✅ Render configuration exists
) else (
    echo ❌ Render configuration missing
)

if exist "netlify.toml" (
    echo ✅ Netlify configuration exists
) else (
    echo ❌ Netlify configuration missing
)

echo.
echo 🎯 Next Steps:
echo ============
echo.
echo 1. 🔒 SECURITY: Remove service-account-key.json from git:
echo    git rm backend/service-account-key.json
echo    git add backend/.gitignore
echo    git commit -m "🔒 Remove sensitive service account key"
echo    git push
echo.
echo 2. 🐍 BACKEND: Deploy to Render:
echo    - Go to https://dashboard.render.com
echo    - Create new Web Service from your GitHub repo
echo    - Set environment variables (including service account JSON)
echo.
echo 3. 🌐 FRONTEND: Deploy to Netlify:
echo    - Go to https://app.netlify.com
echo    - Import project from GitHub
echo    - Set environment variables
echo.
echo 4. 🔗 DOMAIN: Configure learnnect.com:
echo    - Add custom domain in Netlify
echo    - Update DNS settings in Hostinger
echo.
echo 📖 See DEPLOYMENT_CHECKLIST.md for detailed instructions
echo.
pause
