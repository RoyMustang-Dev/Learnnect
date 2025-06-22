import React from 'react';
import { CheckCircle, XCircle, Mail, MessageCircle, ArrowRight, X } from 'lucide-react';
import ModalPortal from './ModalPortal';

interface EnrollmentStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'success' | 'error';
  courseName: string;
  coursePrice: number;
  message?: string;
  onGoToDashboard?: () => void;
}

const EnrollmentStatusModal: React.FC<EnrollmentStatusModalProps> = ({
  isOpen,
  onClose,
  status,
  courseName,
  coursePrice,
  message,
  onGoToDashboard
}) => {
  if (!isOpen) return null;

  const isSuccess = status === 'success';

  return (
    <ModalPortal isOpen={isOpen}>
      <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-md mx-auto overflow-hidden">
        {/* Header */}
        <div className={`p-6 text-center ${isSuccess ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b border-green-500/30' : 'bg-gradient-to-r from-red-500/10 to-orange-500/10 border-b border-red-500/30'}`}>
          <div className="flex justify-end mb-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isSuccess ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            {isSuccess ? (
              <CheckCircle className="h-8 w-8 text-green-400" />
            ) : (
              <XCircle className="h-8 w-8 text-red-400" />
            )}
          </div>

          <h2 className={`text-2xl font-bold mb-2 ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
            {isSuccess ? 'Enrollment Successful! 🎉' : 'Enrollment Failed 😞'}
          </h2>

          <p className="text-gray-300 text-lg">
            {isSuccess ? 'Welcome to your learning journey!' : 'Something went wrong with your enrollment'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="space-y-6">
              {/* Course Details */}
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h3 className="font-semibold text-white mb-2">Course Enrolled:</h3>
                <p className="text-neon-cyan font-medium">{courseName}</p>
                <p className="text-gray-400 text-sm mt-1">
                  {coursePrice === 0 ? 'FREE Course' : `₹${coursePrice}`}
                </p>
              </div>

              {/* What's Next */}
              <div className="space-y-4">
                <h3 className="font-semibold text-white">What's Next?</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Mail className="h-5 w-5 text-blue-400" />
                    <span>Check your email for course details</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <MessageCircle className="h-5 w-5 text-green-400" />
                    <span>WhatsApp confirmation sent</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <ArrowRight className="h-5 w-5 text-purple-400" />
                    <span>Access your course in the dashboard</span>
                  </div>
                </div>
              </div>

              {/* Motivational Message */}
              <div className="bg-gradient-to-r from-neon-cyan/10 to-neon-magenta/10 rounded-lg p-4 border border-neon-cyan/30">
                <p className="text-center text-gray-300 italic">
                  "Every expert was once a beginner. Your journey to mastery starts now! 🚀"
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3">
                <button
                  onClick={onGoToDashboard}
                  className="w-full py-3 bg-gradient-to-r from-neon-magenta to-neon-pink text-white font-bold rounded-lg hover:from-neon-pink hover:to-neon-magenta transition-all duration-300"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Error Details */}
              <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
                <h3 className="font-semibold text-red-400 mb-2">Error Details:</h3>
                <p className="text-gray-300 text-sm">
                  {message || 'An unexpected error occurred during enrollment. Please try again.'}
                </p>
              </div>

              {/* Course Details */}
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h3 className="font-semibold text-white mb-2">Attempted Course:</h3>
                <p className="text-gray-300">{courseName}</p>
                <p className="text-gray-400 text-sm mt-1">
                  {coursePrice === 0 ? 'FREE Course' : `₹${coursePrice}`}
                </p>
              </div>

              {/* Troubleshooting */}
              <div className="space-y-4">
                <h3 className="font-semibold text-white">What you can do:</h3>
                <div className="space-y-2 text-gray-300 text-sm">
                  <p>• Check your internet connection</p>
                  <p>• Refresh the page and try again</p>
                  <p>• Clear your browser cache</p>
                  <p>• Contact support if the issue persists</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3">
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-lg hover:from-orange-500 hover:to-red-500 transition-all duration-300"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.href = 'mailto:support@learnnect.com'}
                  className="w-full py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Contact Support
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ModalPortal>
  );
};

export default EnrollmentStatusModal;
