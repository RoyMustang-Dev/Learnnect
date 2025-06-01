const express = require('express');
const cors = require('cors');
const session = require('express-session');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Google OAuth Configuration
const GOOGLE_CONFIG = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: `http://localhost:${PORT}/api/auth/google/callback`,
  scope: 'openid email profile'
};

// Utility function to generate OAuth URL
function getGoogleAuthUrl(state) {
  const params = new URLSearchParams({
    client_id: GOOGLE_CONFIG.clientId,
    redirect_uri: GOOGLE_CONFIG.redirectUri,
    response_type: 'code',
    scope: GOOGLE_CONFIG.scope,
    access_type: 'offline',
    prompt: 'consent',
    state: state
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'OAuth server is running',
    timestamp: new Date().toISOString()
  });
});

// Start Google OAuth flow
app.get('/api/auth/google', (req, res) => {
  try {
    // Generate state for security
    const state = uuidv4();
    req.session.oauthState = state;

    // Generate Google OAuth URL
    const authUrl = getGoogleAuthUrl(state);

    console.log('Starting Google OAuth flow...');
    console.log('Redirecting to:', authUrl);

    // Redirect to Google
    res.redirect(authUrl);
  } catch (error) {
    console.error('Error starting OAuth flow:', error);
    res.redirect(`${process.env.FRONTEND_URL}/auth?error=oauth_start_failed`);
  }
});

// Handle Google OAuth callback
app.get('/api/auth/google/callback', async (req, res) => {
  try {
    const { code, state, error } = req.query;

    console.log('Google OAuth callback received');
    console.log('Code:', code ? 'Present' : 'Missing');
    console.log('State:', state);
    console.log('Error:', error);

    // Check for OAuth error
    if (error) {
      console.error('OAuth error from Google:', error);
      return res.redirect(`${process.env.FRONTEND_URL}/auth?error=${error}`);
    }

    // Verify state parameter
    if (!state || state !== req.session.oauthState) {
      console.error('Invalid state parameter');
      return res.redirect(`${process.env.FRONTEND_URL}/auth?error=invalid_state`);
    }

    // Clear state from session
    delete req.session.oauthState;

    if (!code) {
      console.error('No authorization code received');
      return res.redirect(`${process.env.FRONTEND_URL}/auth?error=no_code`);
    }

    // Exchange code for tokens
    console.log('Exchanging code for tokens...');
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: GOOGLE_CONFIG.clientId,
      client_secret: GOOGLE_CONFIG.clientSecret,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: GOOGLE_CONFIG.redirectUri
    });

    const { access_token, id_token } = tokenResponse.data;

    // Get user information
    console.log('Getting user information...');
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    const googleUser = userResponse.data;
    console.log('User info received:', { email: googleUser.email, name: googleUser.name });

    // Store user in session (in production, save to database)
    req.session.user = {
      id: googleUser.id,
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
      provider: 'google',
      verified_email: googleUser.verified_email
    };

    // Generate a simple token for frontend
    const userToken = uuidv4();
    req.session.userToken = userToken;

    // Redirect to frontend with success
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/google/success?token=${userToken}`;
    console.log('Redirecting to frontend:', redirectUrl);
    
    res.redirect(redirectUrl);

  } catch (error) {
    console.error('Error in OAuth callback:', error);
    res.redirect(`${process.env.FRONTEND_URL}/auth?error=oauth_callback_failed`);
  }
});

// Get user info endpoint
app.get('/api/auth/user', (req, res) => {
  const { token } = req.query;

  if (!token || token !== req.session.userToken) {
    return res.status(401).json({ error: 'Invalid or missing token' });
  }

  if (!req.session.user) {
    return res.status(401).json({ error: 'No user session found' });
  }

  res.json({
    success: true,
    user: req.session.user,
    token: req.session.userToken
  });
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 OAuth server running on http://localhost:${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`🔐 Google Client ID: ${GOOGLE_CONFIG.clientId ? 'Configured' : 'Missing'}`);
  console.log(`🔑 Google Client Secret: ${GOOGLE_CONFIG.clientSecret ? 'Configured' : 'Missing'}`);
});
