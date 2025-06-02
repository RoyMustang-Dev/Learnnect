import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import firebaseAuthService from '../services/firebaseAuthService';
import { useAuth } from '../contexts/AuthContext';

const GoogleCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing Google authentication...');

  useEffect(() => {
    const handleFirebaseRedirectResult = async () => {
      try {
        setStatus('loading');
        setMessage('Processing Google authentication...');

        // Check for Firebase redirect result (mobile flow)
        const result = await firebaseAuthService.getRedirectResult();

        if (result) {
          setMessage('Google authentication successful!');
          setStatus('success');
          setMessage('Authentication successful! Redirecting to dashboard...');

          setTimeout(() => {
            navigate('/lms');
          }, 2000);
        } else if (user) {
          // User is already authenticated (from AuthContext)
          setStatus('success');
          setMessage('Already authenticated! Redirecting to dashboard...');

          setTimeout(() => {
            navigate('/lms');
          }, 1000);
        } else {
          // No redirect result and no user, redirect to auth page
          setMessage('No authentication result found. Redirecting to login...');
          setTimeout(() => {
            navigate('/auth');
          }, 2000);
        }

      } catch (error: unknown) {
        console.error('Firebase redirect result error:', error);
        setStatus('error');
        if (error instanceof Error) {
          setMessage(error.message || 'Authentication failed. Please try again.');
        } else {
          setMessage('Authentication failed. Please try again.');
        }

        // Redirect to auth page after error
        setTimeout(() => {
          navigate('/auth');
        }, 3000);
      }
    };

    handleFirebaseRedirectResult();
  }, [navigate, user]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <div
          className="rounded-2xl border border-white/20 p-8 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)'
          }}
        >
          {/* Status Icon */}
          <div className="mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center">
            {status === 'loading' && (
              <div className="bg-gradient-to-r from-neon-cyan to-neon-blue rounded-full p-4">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
            )}
            {status === 'success' && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            )}
            {status === 'error' && (
              <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-full p-4">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta mb-4">
            {status === 'loading' && 'Authenticating...'}
            {status === 'success' && 'Success!'}
            {status === 'error' && 'Authentication Failed'}
          </h2>

          {/* Message */}
          <p className="text-cyan-100/80 text-sm leading-relaxed mb-6">
            {message}
          </p>

          {/* Progress indicator for loading */}
          {status === 'loading' && (
            <div className="w-full bg-white/10 rounded-full h-2 mb-4">
              <div
                className="bg-gradient-to-r from-neon-cyan to-neon-blue h-2 rounded-full transition-all duration-1000"
                style={{ width: '60%' }}
              />
            </div>
          )}

          {/* Action button for error state */}
          {status === 'error' && (
            <button
              onClick={() => navigate('/auth')}
              className="w-full py-3 px-4 bg-gradient-to-r from-neon-cyan to-neon-blue hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
              style={{
                boxShadow: '0 0 20px rgba(0,255,255,0.3)',
              }}
            >
              Back to Login
            </button>
          )}

          {/* Powered by Google */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-cyan-300/60 text-xs flex items-center justify-center">
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Secured by Google
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleCallback;
