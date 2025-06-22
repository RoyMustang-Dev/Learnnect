import React from 'react';
import { CheckCircle, X, Shield } from 'lucide-react';
import ModalPortal from './ModalPortal';

interface ReviewFlagSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReviewFlagSuccessModal: React.FC<ReviewFlagSuccessModalProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <ModalPortal isOpen={isOpen}>
      <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-md mx-auto overflow-hidden">
        {/* Header */}
        <div className="p-6 text-center bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b border-green-500/30">
          <div className="flex justify-end mb-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>

          <h2 className="text-2xl font-bold text-green-400 mb-2">
            Report Submitted
          </h2>

          <p className="text-gray-300 text-lg">
            Thank you for helping maintain quality
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Success Message */}
            <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-green-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-400 text-sm">Report Received</h3>
                  <p className="text-gray-300 text-sm mt-1">
                    Your report has been successfully submitted to our moderation team. 
                    We'll review the content and take appropriate action if necessary.
                  </p>
                </div>
              </div>
            </div>

            {/* What Happens Next */}
            <div className="space-y-4">
              <h3 className="font-semibold text-white">What happens next?</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 text-gray-300 text-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <span>Our moderation team will review the reported content</span>
                </div>
                <div className="flex items-start space-x-3 text-gray-300 text-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <span>If the content violates our guidelines, it will be removed</span>
                </div>
                <div className="flex items-start space-x-3 text-gray-300 text-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <span>Repeat offenders may face account restrictions</span>
                </div>
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
              <h4 className="font-semibold text-blue-400 text-sm mb-2">Community Guidelines</h4>
              <p className="text-gray-300 text-xs">
                We're committed to maintaining a respectful and helpful learning environment. 
                Your reports help us ensure all reviews are constructive and appropriate.
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:from-emerald-500 hover:to-green-500 transition-all duration-300"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default ReviewFlagSuccessModal;
