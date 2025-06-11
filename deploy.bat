@echo off
echo 🚀 Learnnect Deployment Script
echo ================================

echo.
echo 📦 Step 1: Installing dependencies...
call npm install

echo.
echo 🧹 Step 2: Cleaning previous build...
if exist dist rmdir /s /q dist

echo.
echo 🔨 Step 3: Building for production...
call npm run build:prod

echo.
echo ✅ Build completed successfully!
echo.
echo 📁 Your production files are in the 'dist' folder
echo.
echo 🌐 Next steps:
echo 1. Deploy backend to Railway/Render/Heroku
echo 2. Upload 'dist' folder to Netlify/Vercel/Wix
echo 3. Update environment variables with production URLs
echo.
echo 📖 See WIX_DEPLOYMENT_GUIDE.md for detailed instructions
echo.
pause
