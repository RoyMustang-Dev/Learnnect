import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const GoogleAuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing Google authentication...');

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (error) {
          throw new Error(`Authentication error: ${error}`);
        }

        if (!token) {
          throw new Error('No authentication token received');
        }

        setMessage('Verifying authentication...');

        // Get user info from server
        const response = await fetch(`http://localhost:3001/api/auth/user?token=${token}`, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to verify authentication');
        }

        const data = await response.json();

        if (!data.success || !data.user) {
          throw new Error('Invalid authentication response');
        }

        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);

        setStatus('success');
        setMessage('Google authentication successful! Redirecting to dashboard...');

        // Redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard');
          window.location.reload();
        }, 2000);

      } catch (error) {
        console.error('Google auth success handler error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
        setStatus('error');
        setMessage(errorMessage);

        // Redirect back to auth page after error
        setTimeout(() => {
          navigate('/auth');
        }, 3000);
      }
    };

    handleAuthSuccess();
  }, [navigate, searchParams]);

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-8 w-8 animate-spin text-neon-cyan" />;
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-8 w-8 text-red-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-neon-cyan';
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neon-black via-gray-900 to-neon-black flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-cyan/10 via-transparent to-neon-magenta/10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-magenta/5 rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10 max-w-md w-full">
        <div 
          className="relative py-8 px-6 sm:px-10 rounded-2xl border border-white/10"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)'
          }}
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {getIcon()}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta text-center mb-4">
            Google Authentication
          </h1>

          {/* Message */}
          <p className={`text-center mb-6 ${getStatusColor()}`}>
            {message}
          </p>

          {/* Progress indicator for loading */}
          {status === 'loading' && (
            <div className="w-full bg-white/20 rounded-full h-2 mb-4">
              <div className="bg-gradient-to-r from-neon-cyan to-neon-magenta h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
            </div>
          )}

          {/* Error action */}
          {status === 'error' && (
            <div className="text-center">
              <button
                onClick={() => navigate('/auth')}
                className="px-6 py-3 bg-gradient-to-r from-neon-magenta to-neon-pink hover:from-neon-magenta/80 hover:to-neon-pink/80 text-white rounded-xl transition-all duration-200 font-medium"
              >
                Back to Login
              </button>
            </div>
          )}

          {/* Success action */}
          {status === 'success' && (
            <div className="text-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all duration-200 font-medium"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleAuthSuccess;
