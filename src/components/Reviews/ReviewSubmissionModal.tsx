import React, { useState } from 'react';
import { X, Star, Send, CheckCircle } from 'lucide-react';
import { reviewsService } from '../../services/reviewsService';
import { useAuth } from '../../contexts/AuthContext';

interface ReviewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseName: string;
  onReviewSubmitted: () => void;
}

const ReviewSubmissionModal: React.FC<ReviewSubmissionModalProps> = ({
  isOpen,
  onClose,
  courseId,
  courseName,
  onReviewSubmitted
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [learningGoalsMet, setLearningGoalsMet] = useState<boolean | null>(null);
  const [instructorRating, setInstructorRating] = useState(0);
  const [contentQualityRating, setContentQualityRating] = useState(0);
  const [valueForMoneyRating, setValueForMoneyRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || rating === 0 || !reviewText.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await reviewsService.submitReview({
        courseId,
        userId: user.id,
        userEmail: user.email,
        userName: user.displayName || user.email.split('@')[0],
        userAvatar: user.photoURL,
        rating,
        reviewText: reviewText.trim(),
        reviewTitle: reviewTitle.trim() || undefined,
        isVerifiedPurchase: true, // Assuming enrolled users are verified
        wouldRecommend: wouldRecommend || undefined,
        learningGoalsMet: learningGoalsMet || undefined,
        instructorRating: instructorRating || undefined,
        contentQualityRating: contentQualityRating || undefined,
        valueForMoneyRating: valueForMoneyRating || undefined,
        completedCourse: false, // This would come from course progress
        courseProgress: 0 // This would come from actual progress
      });

      setSubmitted(true);
      setTimeout(() => {
        onReviewSubmitted();
        onClose();
      }, 2000);
    } catch (error: any) {
      console.error('Error submitting review:', error);
      alert(error.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating: React.FC<{
    rating: number;
    onRatingChange: (rating: number) => void;
    hoverRating?: number;
    onHoverChange?: (rating: number) => void;
    label: string;
  }> = ({ rating, onRatingChange, hoverRating = 0, onHoverChange, label }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            onMouseEnter={() => onHoverChange?.(star)}
            onMouseLeave={() => onHoverChange?.(0)}
            className="transition-colors"
          >
            <Star
              className={`h-6 w-6 ${
                star <= (hoverRating || rating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-400'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  if (!isOpen) return null;

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl border border-gray-700 max-w-md w-full p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Review Submitted!</h2>
          <p className="text-gray-300">
            Thank you for your feedback. Your review will be published after moderation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">Write a Review</h2>
            <p className="text-gray-400 text-sm mt-1">{courseName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Overall Rating */}
          <div>
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              hoverRating={hoverRating}
              onHoverChange={setHoverRating}
              label="Overall Rating *"
            />
            {rating > 0 && (
              <p className="text-sm text-gray-400 mt-1">
                {rating === 1 && "Poor - Not what I expected"}
                {rating === 2 && "Fair - Some issues but okay"}
                {rating === 3 && "Good - Met my expectations"}
                {rating === 4 && "Very Good - Exceeded expectations"}
                {rating === 5 && "Excellent - Outstanding course!"}
              </p>
            )}
          </div>

          {/* Review Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Review Title (Optional)
            </label>
            <input
              type="text"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none"
              placeholder="Summarize your experience..."
              maxLength={100}
            />
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Review *
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none resize-none"
              placeholder="Share your experience with this course. What did you like? What could be improved?"
              maxLength={1000}
            />
            <p className="text-xs text-gray-400 mt-1">
              {reviewText.length}/1000 characters
            </p>
          </div>

          {/* Additional Ratings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StarRating
              rating={instructorRating}
              onRatingChange={setInstructorRating}
              label="Instructor"
            />
            <StarRating
              rating={contentQualityRating}
              onRatingChange={setContentQualityRating}
              label="Content Quality"
            />
            <StarRating
              rating={valueForMoneyRating}
              onRatingChange={setValueForMoneyRating}
              label="Value for Money"
            />
          </div>

          {/* Yes/No Questions */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Would you recommend this course to others?
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setWouldRecommend(true)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    wouldRecommend === true
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setWouldRecommend(false)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    wouldRecommend === false
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Did this course meet your learning goals?
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setLearningGoalsMet(true)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    learningGoalsMet === true
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setLearningGoalsMet(false)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    learningGoalsMet === false
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0 || !reviewText.trim()}
              className="px-6 py-3 bg-gradient-to-r from-neon-magenta to-neon-pink text-white font-bold rounded-lg hover:from-neon-pink hover:to-neon-magenta transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Review'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewSubmissionModal;
