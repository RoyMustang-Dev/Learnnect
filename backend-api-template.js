// Backend API Template for Learnnect OTP Services
// Deploy this on your Render backend

const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();

// Middleware
app.use(cors({
  origin: ['https://learnnect.com', 'https://learnnect-platform.netlify.app', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Environment variables (set these in Render dashboard)
const GMAIL_SERVICE_ACCOUNT_EMAIL = process.env.GMAIL_SERVICE_ACCOUNT_EMAIL;
const GMAIL_PRIVATE_KEY = process.env.GMAIL_PRIVATE_KEY?.replace(/\\n/g, '\n');
const GMAIL_PROJECT_ID = process.env.GMAIL_PROJECT_ID;
const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;

// Gmail API Configuration
const createGmailAuth = () => {
  return new google.auth.JWT(
    GMAIL_SERVICE_ACCOUNT_EMAIL,
    null,
    GMAIL_PRIVATE_KEY,
    ['https://www.googleapis.com/auth/gmail.send'],
    'support@learnnect.com' // Impersonate this email
  );
};

// Send OTP Email via Gmail API
app.post('/api/send-otp-email', async (req, res) => {
  try {
    const { to, subject, htmlContent, purpose } = req.body;

    if (!to || !subject || !htmlContent) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, subject, htmlContent'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    if (!GMAIL_SERVICE_ACCOUNT_EMAIL || !GMAIL_PRIVATE_KEY) {
      console.log('Gmail API not configured, simulating email send');
      return res.json({
        success: true,
        message: 'Email sent (demo mode)',
        messageId: 'demo_' + Date.now()
      });
    }

    // Create Gmail API client
    const auth = createGmailAuth();
    const gmail = google.gmail({ version: 'v1', auth });

    // Create email message
    const email = [
      `To: ${to}`,
      `From: Learnnect <support@learnnect.com>`,
      `Subject: ${subject}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      '',
      htmlContent
    ].join('\n');

    // Encode email in base64
    const encodedEmail = Buffer.from(email)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // Send email
    const result = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedEmail
      }
    });

    console.log('✅ Email sent successfully:', {
      to,
      messageId: result.data.id,
      purpose
    });

    res.json({
      success: true,
      message: 'Email sent successfully',
      messageId: result.data.id
    });

  } catch (error) {
    console.error('❌ Gmail API Error:', error);
    
    // Handle specific Gmail API errors
    if (error.code === 403) {
      return res.status(403).json({
        success: false,
        error: 'Gmail API access denied. Check domain-wide delegation settings.'
      });
    }

    if (error.code === 401) {
      return res.status(401).json({
        success: false,
        error: 'Gmail API authentication failed. Check service account credentials.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to send email',
      details: error.message
    });
  }
});

// Send SMS via MSG91 (optional backend route)
app.post('/api/send-sms-otp', async (req, res) => {
  try {
    const { phone, otp, templateId } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: phone, otp'
      });
    }

    if (!MSG91_AUTH_KEY) {
      console.log('MSG91 not configured, simulating SMS send');
      return res.json({
        success: true,
        message: 'SMS sent (demo mode)',
        requestId: 'demo_' + Date.now()
      });
    }

    // Format phone number
    const formattedPhone = phone.startsWith('91') ? phone : `91${phone}`;

    // MSG91 API call
    const response = await fetch('https://api.msg91.com/api/v5/otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authkey': MSG91_AUTH_KEY
      },
      body: JSON.stringify({
        template_id: templateId,
        mobile: formattedPhone,
        authkey: MSG91_AUTH_KEY,
        otp: otp,
        otp_expiry: 10
      })
    });

    const result = await response.json();

    if (response.ok && result.type === 'success') {
      console.log('✅ SMS sent successfully:', {
        phone: formattedPhone,
        requestId: result.request_id
      });

      res.json({
        success: true,
        message: 'SMS sent successfully',
        requestId: result.request_id
      });
    } else {
      throw new Error(result.message || 'MSG91 API error');
    }

  } catch (error) {
    console.error('❌ MSG91 API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send SMS',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      gmail: !!GMAIL_SERVICE_ACCOUNT_EMAIL && !!GMAIL_PRIVATE_KEY,
      msg91: !!MSG91_AUTH_KEY
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Learnnect OTP API Server running on port ${PORT}`);
  console.log('📧 Gmail API configured:', !!GMAIL_SERVICE_ACCOUNT_EMAIL);
  console.log('📱 MSG91 configured:', !!MSG91_AUTH_KEY);
});

module.exports = app;

/*
DEPLOYMENT INSTRUCTIONS FOR RENDER:

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following environment variables in Render dashboard:

   GMAIL_SERVICE_ACCOUNT_EMAIL=your_service_account@your_project.iam.gserviceaccount.com
   GMAIL_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----
   GMAIL_PROJECT_ID=learnnect-gdrive
   MSG91_AUTH_KEY=your_msg91_auth_key

4. Set build command: npm install
5. Set start command: node server.js (or whatever you name this file)
6. Deploy and test the endpoints

PACKAGE.JSON DEPENDENCIES:
{
  "dependencies": {
    "express": "^4.18.2",
    "googleapis": "^126.0.1",
    "cors": "^2.8.5",
    "node-fetch": "^2.6.7"
  }
}
*/
