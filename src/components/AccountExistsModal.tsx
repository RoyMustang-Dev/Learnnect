import React from 'react';
import { AlertCircle, LogIn, X } from 'lucide-react';

interface AccountExistsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onLoginWithProvider?: () => void;
  email?: string;
  attemptedProvider?: string;
  existingProvider?: string;
  isSignupAttempt?: boolean;
  isOnLoginPage?: boolean;
}

const AccountExistsModal: React.FC<AccountExistsModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
  onLoginWithProvider,
  email,
  attemptedProvider,
  existingProvider,
  isSignupAttempt = false,
  isOnLoginPage = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-2xl backdrop-saturate-200 rounded-2xl border border-white/20 p-6 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Account Already Exists</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          {attemptedProvider && existingProvider ? (
            <>
              <p className="text-gray-300 mb-3">
                You tried to {isSignupAttempt ? 'sign up' : 'sign in'} with <span className="text-neon-cyan font-medium">{attemptedProvider}</span>, but an account with {email ? `"${email}"` : 'this email'} already exists using <span className="text-neon-magenta font-medium">{existingProvider}</span>.
              </p>
              <p className="text-gray-400 text-sm">
                To access your account, please use the <span className="text-neon-cyan">{existingProvider}</span> login option instead.
              </p>
            </>
          ) : (
            <>
              <p className="text-gray-300 mb-3">
                An account with {email ? `the email "${email}"` : 'this email'} already exists in our system.
              </p>
              <p className="text-gray-400 text-sm">
                Please use the login option instead of signing up again.
              </p>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={isOnLoginPage && onLoginWithProvider ? onLoginWithProvider : onSwitchToLogin}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-neon-cyan to-neon-blue text-white rounded-xl hover:from-neon-cyan/80 hover:to-neon-blue/80 transition-all duration-200 font-medium"
          >
            <LogIn className="h-4 w-4" />
            <span>
              {isOnLoginPage && existingProvider
                ? `Login with ${existingProvider}`
                : 'Switch to Login'
              }
            </span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountExistsModal;
