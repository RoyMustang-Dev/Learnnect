import React from 'react';
import { AlertCircle, Edit, X } from 'lucide-react';
import ModalPortal from './ModalPortal';

interface ReviewErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditExisting: () => void;
  errorMessage: string;
  courseName: string;
}

const ReviewErrorModal: React.FC<ReviewErrorModalProps> = ({
  isOpen,
  onClose,
  onEditExisting,
  errorMessage,
  courseName
}) => {
  if (!isOpen) return null;

  const isAlreadyReviewedError = errorMessage.includes('already reviewed');

  return (
    <ModalPortal isOpen={isOpen}>
      <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-md mx-auto overflow-hidden">
        {/* Header */}
        <div className="p-6 text-center bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b border-orange-500/30">
          <div className="flex justify-end mb-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/20 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-orange-400" />
          </div>

          <h2 className="text-2xl font-bold text-orange-400 mb-2">
            {isAlreadyReviewedError ? 'Review Already Exists' : 'Review Error'}
          </h2>

          <p className="text-gray-300 text-lg">
            {isAlreadyReviewedError 
              ? 'You have already reviewed this course' 
              : 'Unable to submit review'
            }
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Course Details */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h3 className="font-semibold text-white mb-2">Course:</h3>
              <p className="text-gray-300">{courseName}</p>
            </div>

            {isAlreadyReviewedError ? (
              <div className="space-y-4">
                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                  <h3 className="font-semibold text-blue-400 mb-2">What you can do:</h3>
                  <div className="space-y-2 text-gray-300 text-sm">
                    <p>• Edit your existing review to update it</p>
                    <p>• Delete your current review and write a new one</p>
                    <p>• View your review in the reviews section</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={onEditExisting}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit Existing Review</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Error Details */}
                <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
                  <h3 className="font-semibold text-red-400 mb-2">Error Details:</h3>
                  <p className="text-gray-300 text-sm">{errorMessage}</p>
                </div>

                {/* Troubleshooting */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-white">What you can try:</h3>
                  <div className="space-y-2 text-gray-300 text-sm">
                    <p>• Check your internet connection</p>
                    <p>• Refresh the page and try again</p>
                    <p>• Make sure you're enrolled in the course</p>
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
      </div>
    </ModalPortal>
  );
};

export default ReviewErrorModal;
