import React from 'react';
import { X, UserPlus, AlertTriangle } from 'lucide-react';

interface NewUserLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
  provider: string;
  email: string;
}

const NewUserLoginModal: React.FC<NewUserLoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToSignup,
  provider,
  email
}) => {
  if (!isOpen) return null;

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'google':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        );
      case 'github':
        return (
          <svg className="h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        );
      default:
        return <UserPlus className="h-5 w-5 text-neon-cyan" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 w-full max-w-md border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">New User Detected</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-6">
          <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
            <div className="flex items-center space-x-3 mb-3">
              {getProviderIcon(provider)}
              <span className="text-white font-medium">{provider} Account</span>
            </div>
            {email && (
              <p className="text-gray-300 text-sm mb-2">{email}</p>
            )}
            <p className="text-orange-200 text-sm">
              This {provider} account doesn't exist in our system yet.
            </p>
          </div>

          <div className="text-center">
            <p className="text-gray-300 text-sm mb-2">
              You tried to <strong>login</strong> with a new account.
            </p>
            <p className="text-gray-400 text-xs">
              New users must sign up first before they can login.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onSwitchToSignup}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-neon-cyan to-neon-blue hover:from-cyan-500 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-200 shadow-lg"
            style={{ boxShadow: '0 0 20px rgba(0,255,255,0.3)' }}
          >
            <UserPlus className="h-4 w-4" />
            <span>Create Account with {provider}</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 px-4 border border-white/20 hover:border-white/30 text-gray-300 hover:text-white font-medium rounded-xl transition-all duration-200"
          >
            Cancel
          </button>
        </div>

        {/* Info */}
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-200 text-xs text-center">
            💡 After signing up, you can login with the same {provider} account anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewUserLoginModal;
