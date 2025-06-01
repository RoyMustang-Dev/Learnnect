import React from 'react';
import { Link } from 'react-router-dom';
import { X, UserPlus, AlertCircle } from 'lucide-react';

interface SocialLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: string;
}

const SocialLoginModal: React.FC<SocialLoginModalProps> = ({ isOpen, onClose, provider }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl border border-white/20 p-6 sm:p-8"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-cyan-300 hover:text-white transition-colors rounded-lg hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-white" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta mb-3">
            Account Not Found
          </h3>

          {/* Message */}
          <p className="text-cyan-100/80 text-sm mb-6 leading-relaxed">
            We couldn't find an account associated with your {provider} profile.
            Please create an account first to access our premium learning content and LMS dashboard.
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => {
                onClose();
                window.location.href = '/auth?signup=true';
              }}
              className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-neon-cyan to-neon-blue hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
              style={{
                boxShadow: '0 0 20px rgba(0,255,255,0.3)',
              }}
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Create Account
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 px-4 text-cyan-200 hover:text-white border border-white/20 rounded-xl hover:bg-white/10 transition-all duration-200"
            >
              Cancel
            </button>
          </div>

          {/* Additional info */}
          <p className="text-cyan-300/60 text-xs mt-4">
            After creating an account, you can link your {provider} profile for easy login.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SocialLoginModal;
