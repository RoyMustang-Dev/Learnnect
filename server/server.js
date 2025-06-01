const express = require('express');
const cors = require('cors');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Redis configuration
let redisClient;
let sessionStore;

async function initializeRedis() {
  try {
    // Create Redis client
    const redisUrl = process.env.REDIS_URL || process.env.REDISCLOUD_URL || 'redis://localhost:6379';
    console.log('🔗 Attempting to connect to Redis...');

    redisClient = createClient({
      url: redisUrl,
      socket: {
        connectTimeout: 10000, // 10 seconds timeout
        lazyConnect: true,
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            console.log('❌ Redis reconnection attempts exhausted');
            return false; // Stop reconnecting
          }
          console.log(`🔄 Redis reconnection attempt ${retries}`);
          return Math.min(retries * 1000, 3000); // Max 3 second delay
        }
      },
      // Remove retry_strategy as it's deprecated, use socket.reconnectStrategy instead
    });

    redisClient.on('error', (err) => {
      console.log('❌ Redis Client Error:', err.message);
    });

    redisClient.on('connect', () => {
      console.log('✅ Connected to Redis');
    });

    redisClient.on('ready', () => {
      console.log('✅ Redis client ready');
    });

    redisClient.on('end', () => {
      console.log('❌ Redis connection ended');
    });

    redisClient.on('reconnecting', () => {
      console.log('🔄 Redis reconnecting...');
    });

    // Add timeout to connection attempt
    const connectPromise = redisClient.connect();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Redis connection timeout after 15 seconds')), 15000);
    });

    await Promise.race([connectPromise, timeoutPromise]);

    // Test the connection with a simple ping
    await redisClient.ping();
    console.log('✅ Redis ping successful');

    // Create Redis store
    sessionStore = new RedisStore({
      client: redisClient,
      prefix: 'learnnect:sess:',
    });

    console.log('✅ Redis session store initialized');
    return true;
  } catch (error) {
    console.warn('⚠️  Redis connection failed, falling back to memory store:', error.message);
    if (redisClient) {
      try {
        await redisClient.quit();
      } catch (quitError) {
        // Ignore quit errors
      }
    }
    return false;
  }
}

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Initialize session middleware (will be set up after Redis initialization)
let sessionMiddleware;

function setupSessionMiddleware(useRedis = false) {
  const isProduction = process.env.NODE_ENV === 'production';

  const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: false,
    name: 'learnnect.sid',
    cookie: {
      secure: isProduction, // Use secure cookies in production (HTTPS)
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: isProduction ? 'none' : 'lax' // Allow cross-site cookies in production
    }
  };

  if (useRedis && sessionStore) {
    sessionConfig.store = sessionStore;
    console.log('✅ Using Redis session store');
  } else {
    console.log('⚠️  Using memory session store (not recommended for production)');
  }

  sessionMiddleware = session(sessionConfig);
  app.use(sessionMiddleware);
}

// Google OAuth Configuration
const GOOGLE_CONFIG = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.NODE_ENV === 'production'
    ? `${process.env.BACKEND_URL || 'https://learnnect-oauth-server.onrender.com'}/api/auth/google/callback`
    : `http://localhost:${PORT}/api/auth/google/callback`,
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

// Start server with Redis initialization
async function startServer() {
  try {
    // Try to initialize Redis
    const redisConnected = await initializeRedis();

    // Setup session middleware
    setupSessionMiddleware(redisConnected);

    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 OAuth server running on http://localhost:${PORT}`);
      console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL}`);
      console.log(`🔐 Google Client ID: ${GOOGLE_CONFIG.clientId ? 'Configured' : 'Missing'}`);
      console.log(`🔑 Google Client Secret: ${GOOGLE_CONFIG.clientSecret ? 'Configured' : 'Missing'}`);
      console.log(`🗄️  Session Store: ${redisConnected ? 'Redis' : 'Memory (not recommended for production)'}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🔄 SIGTERM received, shutting down gracefully...');
  if (redisClient) {
    await redisClient.quit();
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔄 SIGINT received, shutting down gracefully...');
  if (redisClient) {
    await redisClient.quit();
  }
  process.exit(0);
});

// Start the server
startServer();
