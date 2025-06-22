import React, { useState, useEffect } from 'react';
import { X, Star, Send, CheckCircle } from 'lucide-react';
import { reviewsService } from '../../services/reviewsService';
import { useAuth } from '../../contexts/AuthContext';
import ReviewErrorModal from '../Modals/ReviewErrorModal';
import ModalPortal from '../Modals/ModalPortal';

interface ReviewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseName: string;
  onReviewSubmitted: () => void;
  editingReview?: any; // Review being edited (null for new review)
}

const ReviewSubmissionModal: React.FC<ReviewSubmissionModalProps> = ({
  isOpen,
  onClose,
  courseId,
  courseName,
  onReviewSubmitted,
  editingReview
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
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const isEditing = !!editingReview;

  // Populate form when editing
  useEffect(() => {
    if (editingReview && isOpen) {
      setRating(editingReview.rating || 0);
      setReviewTitle(editingReview.reviewTitle || '');
      setReviewText(editingReview.reviewText || '');
      setWouldRecommend(editingReview.wouldRecommend ?? null);
      setLearningGoalsMet(editingReview.learningGoalsMet ?? null);
      setInstructorRating(editingReview.instructorRating || 0);
      setContentQualityRating(editingReview.contentQualityRating || 0);
      setValueForMoneyRating(editingReview.valueForMoneyRating || 0);
    } else if (!editingReview && isOpen) {
      // Reset form for new review
      setRating(0);
      setReviewTitle('');
      setReviewText('');
      setWouldRecommend(null);
      setLearningGoalsMet(null);
      setInstructorRating(0);
      setContentQualityRating(0);
      setValueForMoneyRating(0);
    }
  }, [editingReview, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || rating === 0 || !reviewText.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing) {
        // Update existing review
        const updates: any = {
          rating,
          reviewText: reviewText.trim(),
        };

        // Add optional fields only if they have values
        if (reviewTitle.trim()) {
          updates.reviewTitle = reviewTitle.trim();
        }
        if (wouldRecommend !== null) {
          updates.wouldRecommend = wouldRecommend;
        }
        if (learningGoalsMet !== null) {
          updates.learningGoalsMet = learningGoalsMet;
        }
        if (instructorRating > 0) {
          updates.instructorRating = instructorRating;
        }
        if (contentQualityRating > 0) {
          updates.contentQualityRating = contentQualityRating;
        }
        if (valueForMoneyRating > 0) {
          updates.valueForMoneyRating = valueForMoneyRating;
        }

        await reviewsService.updateReview(editingReview.id, updates);
      } else {
        // Create new review
        const reviewData = {
          courseId,
          userId: user.id,
          userEmail: user.email,
          userName: user.name || user.email.split('@')[0],
          userAvatar: user.photoURL || null,
          rating,
          reviewText: reviewText.trim(),
          isVerifiedPurchase: true, // Assuming enrolled users are verified
          completedCourse: false, // This would come from course progress
          courseProgress: 0 // This would come from actual progress
        };

        // Add optional fields only if they have values
        if (reviewTitle.trim()) {
          reviewData.reviewTitle = reviewTitle.trim();
        }
        if (wouldRecommend !== null) {
          reviewData.wouldRecommend = wouldRecommend;
        }
        if (learningGoalsMet !== null) {
          reviewData.learningGoalsMet = learningGoalsMet;
        }
        if (instructorRating > 0) {
          reviewData.instructorRating = instructorRating;
        }
        if (contentQualityRating > 0) {
          reviewData.contentQualityRating = contentQualityRating;
        }
        if (valueForMoneyRating > 0) {
          reviewData.valueForMoneyRating = valueForMoneyRating;
        }

        await reviewsService.submitReview(reviewData);
      }

      setSubmitted(true);
      setTimeout(() => {
        onReviewSubmitted();
        onClose();
      }, 2000);
    } catch (error: any) {
      console.error('Error submitting review:', error);
      setErrorMessage(error.message || 'Failed to submit review. Please try again.');
      setShowErrorModal(true);
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

  const handleEditExisting = async () => {
    try {
      // Get the existing review and populate the form
      const existingReview = await reviewsService.getUserReviewForCourse(user.id, courseId);
      if (existingReview) {
        // Populate form with existing review data
        setRating(existingReview.rating || 0);
        setReviewTitle(existingReview.reviewTitle || '');
        setReviewText(existingReview.reviewText || '');
        setWouldRecommend(existingReview.wouldRecommend ?? null);
        setLearningGoalsMet(existingReview.learningGoalsMet ?? null);
        setInstructorRating(existingReview.instructorRating || 0);
        setContentQualityRating(existingReview.contentQualityRating || 0);
        setValueForMoneyRating(existingReview.valueForMoneyRating || 0);

        // Close error modal and continue with editing
        setShowErrorModal(false);
        setErrorMessage('');
      }
    } catch (error) {
      console.error('Error loading existing review:', error);
    }
  };

  if (!isOpen) return null;

  if (submitted) {
    return (
      <ModalPortal isOpen={isOpen}>
        <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-md mx-auto p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Review Submitted!</h2>
          <p className="text-gray-300">
            Thank you for your feedback. Your review will be published after moderation.
          </p>
        </div>
      </ModalPortal>
    );
  }

  return (
    <ModalPortal isOpen={isOpen}>
      <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-2xl mx-auto max-h-[calc(100vh-8rem)] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {isEditing ? 'Edit Review' : 'Write a Review'}
            </h2>
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
              <span>
                {isSubmitting
                  ? (isEditing ? 'Updating...' : 'Submitting...')
                  : (isEditing ? 'Update Review' : 'Submit Review')
                }
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Error Modal */}
      <ReviewErrorModal
        isOpen={showErrorModal}
        onClose={() => {
          setShowErrorModal(false);
          setErrorMessage('');
        }}
        onEditExisting={handleEditExisting}
        errorMessage={errorMessage}
        courseName={courseName}
      />
    </ModalPortal>
  );
};

export default ReviewSubmissionModal;
