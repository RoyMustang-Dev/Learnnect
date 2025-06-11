@echo off
echo 🐍 Backend Deployment Preparation
echo ==================================

echo.
echo 📦 Step 1: Creating deployment package...
if exist backend-deploy rmdir /s /q backend-deploy
mkdir backend-deploy

echo.
echo 📋 Step 2: Copying files...
copy learnnect_storage_api.py backend-deploy\
copy requirements.txt backend-deploy\
copy service-account-key.json backend-deploy\
copy .env.production backend-deploy\.env
copy Procfile backend-deploy\
copy runtime.txt backend-deploy\

echo.
echo ✅ Backend deployment package ready!
echo.
echo 📁 Files in 'backend-deploy' folder:
dir backend-deploy

echo.
echo 🌐 Next steps:
echo 1. Upload 'backend-deploy' folder to Railway/Render/Heroku
echo 2. Set environment variables on your hosting platform
echo 3. Note your backend URL for frontend configuration
echo.
echo 📖 See WIX_DEPLOYMENT_GUIDE.md for detailed instructions
echo.
pause
