import React, { useState } from 'react';
import { Flag, X, AlertTriangle } from 'lucide-react';
import ModalPortal from './ModalPortal';

interface ReviewFlagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitFlag: (reason: string) => void;
  reviewAuthor: string;
  reviewText: string;
}

const ReviewFlagModal: React.FC<ReviewFlagModalProps> = ({
  isOpen,
  onClose,
  onSubmitFlag,
  reviewAuthor,
  reviewText
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const flagReasons = [
    'Inappropriate content',
    'Spam or fake review',
    'Offensive language',
    'Misleading information',
    'Harassment or bullying',
    'Copyright violation',
    'Off-topic content',
    'Other (please specify)'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedReason) {
      console.error('Please select a reason for reporting');
      return;
    }

    setIsSubmitting(true);

    const finalReason = selectedReason === 'Other (please specify)'
      ? customReason.trim()
      : selectedReason;

    if (!finalReason || finalReason.length === 0) {
      console.error('Please provide a reason for reporting');
      setIsSubmitting(false);
      return;
    }

    if (finalReason.length > 500) {
      console.error('Reason is too long (max 500 characters)');
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmitFlag(finalReason);
      // Reset form
      setSelectedReason('');
      setCustomReason('');
      onClose();
    } catch (error) {
      console.error('Error submitting flag:', error);
      // Don't close modal on error so user can try again
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedReason('');
    setCustomReason('');
    onClose();
  };

  return (
    <ModalPortal isOpen={isOpen}>
      <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-md mx-auto overflow-hidden">
        {/* Header */}
        <div className="p-6 text-center bg-gradient-to-r from-red-500/10 to-orange-500/10 border-b border-red-500/30">
          <div className="flex justify-end mb-4">
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <Flag className="h-8 w-8 text-red-400" />
          </div>

          <h2 className="text-2xl font-bold text-red-400 mb-2">
            Report Review
          </h2>

          <p className="text-gray-300 text-sm">
            Help us maintain quality by reporting inappropriate content
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Review Preview */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h3 className="font-semibold text-white mb-2">Review by {reviewAuthor}:</h3>
              <p className="text-gray-300 text-sm line-clamp-3">
                {reviewText.length > 150 
                  ? `${reviewText.substring(0, 150)}...` 
                  : reviewText
                }
              </p>
            </div>

            {/* Flag Reasons */}
            <div className="space-y-4">
              <h3 className="font-semibold text-white">Why are you reporting this review?</h3>
              
              <div className="space-y-2">
                {flagReasons.map((reason) => (
                  <label
                    key={reason}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-gray-700 hover:bg-gray-800/50 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="flagReason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="text-red-500 focus:ring-red-500 focus:ring-2"
                    />
                    <span className="text-gray-300 text-sm">{reason}</span>
                  </label>
                ))}
              </div>

              {/* Custom Reason Input */}
              {selectedReason === 'Other (please specify)' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Please specify the reason:
                  </label>
                  <textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    required
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none resize-none"
                    placeholder="Please provide more details about why you're reporting this review..."
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {customReason.length}/500 characters
                  </p>
                </div>
              )}
            </div>

            {/* Warning */}
            <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-400 text-sm">Important</h4>
                  <p className="text-gray-300 text-xs mt-1">
                    False reports may result in restrictions on your account. 
                    Please only report content that genuinely violates our community guidelines.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              <button
                type="submit"
                disabled={!selectedReason || isSubmitting || (selectedReason === 'Other (please specify)' && !customReason.trim())}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-lg hover:from-orange-500 hover:to-red-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Flag className="h-4 w-4" />
                <span>{isSubmitting ? 'Submitting Report...' : 'Submit Report'}</span>
              </button>
              
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
};

export default ReviewFlagModal;
