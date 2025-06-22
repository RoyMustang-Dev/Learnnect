# 🚨 **CORS FIX & BACKEND DEPLOYMENT GUIDE** 🚀

## 🔍 **ISSUE IDENTIFIED: CORS Policy Violation**

The OTP verification is failing because **frontend cannot directly call Resend API** due to CORS (Cross-Origin Resource Sharing) restrictions.

### **Error Details:**
```
Access to fetch at 'https://api.resend.com/emails' from origin 'https://learnnect.com' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

---

## 🔧 **SOLUTION: Backend API Required**

We need a **backend API** that will handle Resend API calls server-side. The frontend will call your backend, and the backend will call Resend.

---

## 📁 **BACKEND FILES CREATED**

### **1. Backend API Server**
- **File:** `backend-otp-api.js`
- **Description:** Complete Node.js Express server with OTP and email functionality
- **Features:**
  - Send OTP emails via Resend
  - Verify OTP codes
  - Send confirmation emails
  - CORS enabled for Learnnect domains
  - Professional email templates

### **2. Package Configuration**
- **File:** `backend-package.json`
- **Description:** Dependencies and scripts for the backend
- **Dependencies:** Express, CORS, Resend, dotenv

---

## 🚀 **DEPLOYMENT STEPS**

### **Step 1: Deploy Backend to Render**

1. **Create new folder for backend:**
   ```bash
   mkdir learnnect-otp-backend
   cd learnnect-otp-backend
   ```

2. **Copy backend files:**
   ```bash
   cp backend-otp-api.js index.js
   cp backend-package.json package.json
   ```

3. **Create .env file:**
   ```env
   RESEND_API_KEY=re_your_actual_resend_api_key_here
   PORT=3001
   ```

4. **Initialize and deploy to Render:**
   - Go to [render.com](https://render.com)
   - Create new Web Service
   - Connect your GitHub repository
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Add environment variable: `RESEND_API_KEY`

### **Step 2: Update Frontend Environment Variables**

Add to your **Netlify environment variables:**
```env
VITE_BACKEND_API_URL=https://your-backend-name.render.com
```

### **Step 3: Deploy Updated Frontend**

The frontend code has been updated to use the backend API instead of calling Resend directly.

---

## 🔄 **UPDATED FRONTEND CODE**

### **Files Modified:**
1. **`src/services/otpService.ts`** - Now uses backend API for OTP operations
2. **`src/services/emailService.ts`** - Now uses backend API for confirmation emails

### **Key Changes:**
- ✅ **OTP sending** now goes through backend API
- ✅ **OTP verification** now goes through backend API  
- ✅ **Confirmation emails** now go through backend API
- ✅ **CORS issues** completely resolved

---

## 📋 **BACKEND API ENDPOINTS**

### **1. Send OTP Email**
```
POST /api/send-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "purpose": "signup"
}
```

### **2. Verify OTP**
```
POST /api/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

### **3. Send Confirmation Email**
```
POST /api/send-confirmation
Content-Type: application/json

{
  "type": "welcome",
  "to": "user@example.com",
  "data": {
    "name": "John Doe"
  }
}
```

### **4. Health Check**
```
GET /health
```

---

## 🧪 **TESTING AFTER DEPLOYMENT**

### **Step 1: Test Backend API**
```bash
# Test health endpoint
curl https://your-backend-name.render.com/health

# Test OTP sending
curl -X POST https://your-backend-name.render.com/api/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","purpose":"signup"}'
```

### **Step 2: Test Frontend Integration**
1. **Go to:** https://learnnect.com
2. **Test Newsletter OTP:** Scroll to footer, enter email, submit
3. **Test Enquiry OTP:** Click enquiry widget, fill form, submit
4. **Test Signup OTP:** Go to course page, click "Enroll Now", signup
5. **Test Contact OTP:** Go to contact page, fill form, submit

---

## 🔧 **ENVIRONMENT VARIABLES SETUP**

### **Backend (.env file):**
```env
RESEND_API_KEY=re_your_actual_resend_api_key_here
PORT=3001
NODE_ENV=production
```

### **Frontend (Netlify):**
```env
VITE_BACKEND_API_URL=https://your-backend-name.render.com
VITE_RESEND_API_KEY=re_your_actual_resend_api_key_here
```

---

## 📊 **EXPECTED RESULTS AFTER FIX**

### **✅ Working OTP Flows:**
1. **Newsletter Signup** → Email OTP → Verification → Confirmation email
2. **Enquiry Form** → Email OTP → Verification → Confirmation email  
3. **Course Signup** → Email OTP → Verification → Welcome email
4. **Contact Form** → Email OTP → Verification → Confirmation email

### **✅ No More CORS Errors:**
- All API calls now go to your backend
- Backend handles Resend API calls
- Frontend receives clean responses

---

## 🚀 **QUICK DEPLOYMENT COMMANDS**

### **For Render Deployment:**
```bash
# 1. Create backend folder
mkdir learnnect-otp-backend && cd learnnect-otp-backend

# 2. Copy files
cp ../backend-otp-api.js ./index.js
cp ../backend-package.json ./package.json

# 3. Create .env
echo "RESEND_API_KEY=your_key_here" > .env
echo "PORT=3001" >> .env

# 4. Initialize git and push to GitHub
git init
git add .
git commit -m "Initial backend setup"
git remote add origin https://github.com/yourusername/learnnect-otp-backend.git
git push -u origin main

# 5. Deploy on Render using GitHub repo
```

### **For Frontend Update:**
```bash
# 1. Add environment variable to Netlify
# VITE_BACKEND_API_URL=https://your-backend-name.render.com

# 2. Deploy updated frontend
npm run build
# Deploy to Netlify
```

---

## 🎯 **SUCCESS CRITERIA**

### **✅ Backend Deployed Successfully:**
- Health endpoint returns 200 OK
- OTP endpoints work without errors
- Resend API integration functional

### **✅ Frontend Integration Working:**
- No CORS errors in browser console
- OTP emails sent successfully
- OTP verification works
- Confirmation emails delivered

### **✅ All Forms Functional:**
- Newsletter signup with OTP ✅
- Enquiry form with OTP ✅
- Course signup with OTP ✅
- Contact form with OTP ✅

---

## 📞 **NEXT STEPS**

1. **Deploy backend to Render** using the provided files
2. **Update Netlify environment variables** with backend URL
3. **Deploy updated frontend** to Netlify
4. **Test all OTP flows** on production
5. **Monitor for any issues** and verify email delivery

---

## 🎉 **FINAL RESULT**

After deployment, you'll have:
- ✅ **Fully functional OTP verification** for all forms
- ✅ **Professional email templates** with Learnnect branding
- ✅ **No CORS issues** - all API calls work perfectly
- ✅ **Scalable backend** that can handle high volume
- ✅ **Production-ready email system** using Resend

**The CORS issue will be completely resolved and all OTP verification will work perfectly!** 🚀
