@echo off
echo ========================================
echo    Learnnect Deployment Setup Script
echo ========================================
echo.

echo [1/5] Checking project structure...
if not exist "backend\learnnect_storage_api.py" (
    echo ERROR: Backend API file not found!
    pause
    exit /b 1
)

if not exist "backend\requirements.txt" (
    echo ERROR: Requirements file not found!
    pause
    exit /b 1
)

echo ✅ Project structure verified

echo.
echo [2/5] Creating runtime.txt for Python version...
echo python-3.11.0 > backend\runtime.txt
echo ✅ Runtime file created

echo.
echo [3/5] Building frontend for production...
call npm run build:prod
if errorlevel 1 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)
echo ✅ Frontend built successfully

echo.
echo [4/5] Checking environment files...
if not exist ".env.production" (
    echo WARNING: .env.production not found
) else (
    echo ✅ Production environment file found
)

if not exist "backend\.env.production" (
    echo WARNING: backend\.env.production not found
) else (
    echo ✅ Backend production environment file found
)

echo.
echo [5/5] Security check...
if exist "backend\service-account-key.json" (
    echo.
    echo ⚠️  CRITICAL SECURITY WARNING ⚠️
    echo Service account key file detected!
    echo This file should NOT be committed to version control.
    echo.
    echo Please:
    echo 1. Copy the content of backend\service-account-key.json
    echo 2. Save it securely for deployment
    echo 3. Delete the file from your repository
    echo 4. Add it to .gitignore (already done)
    echo.
    pause
) else (
    echo ✅ No service account key file found (good for security)
)

echo.
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Follow the DEPLOYMENT_GUIDE_RENDER_NETLIFY.md
echo 2. Deploy backend to Render
echo 3. Deploy frontend to Netlify
echo 4. Configure custom domain
echo.
echo Files ready for deployment:
echo - Backend: backend/ folder
echo - Frontend: dist/ folder
echo - Config: render.yaml, netlify.toml
echo.
pause
