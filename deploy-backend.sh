#!/bin/bash

# 🚀 Learnnect OTP Backend Deployment Script
# This script sets up and prepares the backend for deployment

echo "🚀 Setting up Learnnect OTP Backend for deployment..."

# Create backend directory
echo "📁 Creating backend directory..."
mkdir -p learnnect-otp-backend
cd learnnect-otp-backend

# Copy backend files
echo "📋 Copying backend files..."
cp ../backend-otp-api.js ./index.js
cp ../backend-package.json ./package.json

# Create .env template
echo "📝 Creating .env template..."
cat > .env << EOF
# Learnnect OTP Backend Environment Variables
RESEND_API_KEY=your_resend_api_key_here
PORT=3001
NODE_ENV=production
EOF

# Create README for backend
echo "📖 Creating backend README..."
cat > README.md << EOF
# Learnnect OTP Backend API

Backend service for handling OTP verification and email sending for Learnnect platform.

## Environment Variables

\`\`\`env
RESEND_API_KEY=your_resend_api_key_here
PORT=3001
NODE_ENV=production
\`\`\`

## Deployment

1. Deploy to Render.com
2. Set environment variables
3. Update frontend VITE_BACKEND_API_URL

## API Endpoints

- POST /api/send-otp - Send OTP email
- POST /api/verify-otp - Verify OTP code  
- POST /api/send-confirmation - Send confirmation emails
- GET /health - Health check

## CORS

Configured for:
- https://learnnect.com
- http://localhost:5173
- https://learnnect-platform.netlify.app
EOF

# Initialize git repository
echo "🔧 Initializing git repository..."
git init
git add --all
git commit -m "Initial Learnnect OTP Backend setup"

echo "✅ Backend setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Push this repository to GitHub"
echo "2. Deploy to Render.com using this GitHub repo"
echo "3. Set RESEND_API_KEY environment variable in Render"
echo "4. Update frontend VITE_BACKEND_API_URL with your Render URL"
echo "5. Deploy updated frontend to Netlify"
echo ""
echo "📁 Backend files are ready in: ./learnnect-otp-backend/"
echo "🔑 Don't forget to update .env with your actual Resend API key!"
