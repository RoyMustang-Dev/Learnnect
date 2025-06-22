# 📱📧 OTP Verification Setup Guide for Learnnect

This guide will help you set up production-ready OTP verification using MSG91 for SMS and Gmail API for email.

## 📱 **MSG91 SMS OTP Setup**

### Step 1: Create MSG91 Account
1. Go to [https://msg91.com/](https://msg91.com/)
2. Sign up for a new account
3. Complete email verification
4. Add your business details

### Step 2: Get API Credentials
1. Login to MSG91 dashboard
2. Go to **"API"** section in the sidebar
3. Note down your **Auth Key** (keep this secure)

### Step 3: Create OTP Template
1. Go to **"SMS"** → **"Templates"**
2. Click **"Create Template"**
3. Template content example:
   ```
   Your Learnnect OTP is ##OTP##. Valid for 10 minutes. Do not share with anyone. - LRNECT
   ```
4. Set **Template Type**: `OTP`
5. Set **Sender ID**: `LRNECT` (6 characters max)
6. Submit for approval
7. Once approved, note down the **Template ID**

### Step 4: Add Environment Variables
Add these to your `.env` file:
```env
VITE_MSG91_AUTH_KEY=your_actual_auth_key_here
VITE_MSG91_TEMPLATE_ID=your_actual_template_id_here
VITE_MSG91_SENDER_ID=LRNECT
```

---

## 📧 **Gmail API Email OTP Setup**

### Step 1: Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your existing project `learnnect-gdrive` or create new one
3. Enable **Gmail API**:
   - Go to **APIs & Services** → **Library**
   - Search for "Gmail API"
   - Click **Enable**

### Step 2: Create Service Account
1. Go to **IAM & Admin** → **Service Accounts**
2. Click **Create Service Account**
3. Name: `learnnect-email-service`
4. Description: `Service account for sending OTP emails`
5. Click **Create and Continue**
6. Skip role assignment for now
7. Click **Done**

### Step 3: Generate Service Account Key
1. Click on the created service account
2. Go to **Keys** tab
3. Click **Add Key** → **Create new key**
4. Select **JSON** format
5. Download the JSON file (keep it secure)

### Step 4: Enable Domain-wide Delegation
1. In the service account details, check **Enable Google Workspace Domain-wide Delegation**
2. Note down the **Client ID** from the JSON file

### Step 5: Configure Google Workspace (if using business email)
1. Go to [Google Admin Console](https://admin.google.com/)
2. Go to **Security** → **API Controls** → **Domain-wide Delegation**
3. Click **Add new**
4. Enter the **Client ID** from step 4
5. Add OAuth scopes:
   ```
   https://www.googleapis.com/auth/gmail.send
   https://www.googleapis.com/auth/gmail.compose
   ```
6. Click **Authorize**

### Step 6: Add Environment Variables
From your downloaded JSON file, add these to your `.env`:
```env
VITE_GMAIL_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
VITE_GMAIL_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----
VITE_GMAIL_PROJECT_ID=learnnect-gdrive
```

---

## 🚀 **Backend API Endpoint Setup**

Since Gmail API requires server-side implementation, you need to create a backend endpoint.

### Create `/api/send-otp-email` endpoint on your Render backend:

```javascript
// Example Node.js/Express endpoint
const { google } = require('googleapis');

app.post('/api/send-otp-email', async (req, res) => {
  try {
    const { to, subject, htmlContent } = req.body;
    
    // Configure Gmail API
    const auth = new google.auth.JWT(
      process.env.GMAIL_SERVICE_ACCOUNT_EMAIL,
      null,
      process.env.GMAIL_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/gmail.send'],
      'support@learnnect.com' // Impersonate this email
    );

    const gmail = google.gmail({ version: 'v1', auth });

    // Create email
    const email = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/html; charset=utf-8',
      '',
      htmlContent
    ].join('\n');

    const encodedEmail = Buffer.from(email).toString('base64');

    // Send email
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedEmail
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
```

---

## 🔧 **Environment Variables for Production**

### Netlify Frontend Environment Variables:
```env
VITE_MSG91_AUTH_KEY=your_msg91_auth_key
VITE_MSG91_TEMPLATE_ID=your_msg91_template_id
VITE_MSG91_SENDER_ID=LRNECT
VITE_GMAIL_SERVICE_ACCOUNT_EMAIL=your_service_account@project.iam.gserviceaccount.com
VITE_GMAIL_PRIVATE_KEY=your_private_key
VITE_GMAIL_PROJECT_ID=learnnect-gdrive
```

### Render Backend Environment Variables:
```env
GMAIL_SERVICE_ACCOUNT_EMAIL=your_service_account@project.iam.gserviceaccount.com
GMAIL_PRIVATE_KEY=your_private_key_here
GMAIL_PROJECT_ID=learnnect-gdrive
```

---

## 📋 **Testing Checklist**

### MSG91 SMS Testing:
- [ ] Account created and verified
- [ ] Auth Key obtained
- [ ] OTP template created and approved
- [ ] Template ID noted
- [ ] Environment variables added
- [ ] Test SMS sent successfully

### Gmail API Testing:
- [ ] Google Cloud project configured
- [ ] Gmail API enabled
- [ ] Service account created
- [ ] JSON key downloaded
- [ ] Domain-wide delegation configured
- [ ] Backend endpoint created
- [ ] Environment variables added
- [ ] Test email sent successfully

---

## ❓ **Questions for You**

Please provide the following information:

### MSG91 Configuration:
1. **Auth Key**: (from MSG91 dashboard)
2. **Template ID**: (after template approval)
3. **Preferred OTP length**: 4 or 6 digits?
4. **OTP validity**: 5, 10, or 15 minutes?

### Gmail API Configuration:
1. **Google Cloud Project**: Use existing `learnnect-gdrive` or create new?
2. **Service Account Email**: (from JSON file)
3. **Private Key**: (from JSON file)
4. **Domain Admin Access**: Do you have admin access to support@learnnect.com domain?

### Template Preferences:
1. **SMS Template**: What message format do you prefer?
2. **Email Template**: Any specific branding requirements?
3. **Sender Name**: How should emails appear (from name)?

---

## 🔒 **Security Notes**

1. **Never commit** API keys or private keys to version control
2. **Use environment variables** for all sensitive data
3. **Rotate keys** regularly for security
4. **Monitor usage** to detect unusual activity
5. **Set up alerts** for failed API calls

---

## 📞 **Support**

If you encounter any issues:
1. Check the console logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure API services are enabled in Google Cloud Console
4. Contact MSG91 support for SMS-related issues
5. Check Google Cloud Console for Gmail API quotas and errors
