import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, Flag, CheckCircle, Award, Edit, Trash2 } from 'lucide-react';
import { reviewsService, CourseReview, ReviewStats } from '../../services/reviewsService';
import { useAuth } from '../../contexts/AuthContext';
import ReviewFlagModal from '../Modals/ReviewFlagModal';
import ReviewFlagSuccessModal from '../Modals/ReviewFlagSuccessModal';

interface ReviewsDisplayProps {
  courseId: string;
  onWriteReview: () => void;
  onEditReview?: (review: CourseReview) => void;
}

const ReviewsDisplay: React.FC<ReviewsDisplayProps> = ({ courseId, onWriteReview, onEditReview }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flaggingReview, setFlaggingReview] = useState<CourseReview | null>(null);
  const [showFlagSuccessModal, setShowFlagSuccessModal] = useState(false);
  const [votingLoading, setVotingLoading] = useState<string | null>(null);

  useEffect(() => {
    loadReviews();
  }, [courseId]);

  const loadReviews = async () => {
    setLoading(true);
    console.log('🔍 Loading reviews for course:', courseId);
    try {
      const [reviewsData, statsData] = await Promise.all([
        reviewsService.getCourseReviews(courseId, 20),
        reviewsService.getCourseReviewStats(courseId)
      ]);

      console.log('📊 Reviews loaded:', reviewsData);
      console.log('📈 Stats loaded:', statsData);

      setReviews(reviewsData);
      setStats(statsData);
    } catch (error) {
      console.error('❌ Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHelpfulVote = async (reviewId: string) => {
    if (!reviewId) return;
    
    setVotingLoading(reviewId);
    try {
      await reviewsService.voteHelpful(reviewId);
      // Refresh reviews to show updated vote count
      await loadReviews();
    } catch (error) {
      console.error('Error voting helpful:', error);
    } finally {
      setVotingLoading(null);
    }
  };

  const handleReportReview = (review: CourseReview) => {
    setFlaggingReview(review);
    setShowFlagModal(true);
  };

  const handleSubmitFlag = async (reason: string) => {
    if (!flaggingReview?.id) {
      console.error('No review selected for flagging');
      return;
    }

    if (!reason || reason.trim().length === 0) {
      console.error('Flag reason is required');
      return;
    }

    try {
      await reviewsService.reportReview(flaggingReview.id, reason.trim());
      // Show success modal
      setShowFlagModal(false);
      setFlaggingReview(null);
      setShowFlagSuccessModal(true);
      console.log('✅ Review flagged successfully');
    } catch (error: any) {
      console.error('❌ Error reporting review:', error);

      // Show specific error message
      const errorMessage = error.message || 'Failed to report review. Please try again.';
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!reviewId) return;

    const confirmed = window.confirm('Are you sure you want to delete this review? This action cannot be undone.');
    if (!confirmed) return;

    try {
      await reviewsService.deleteReview(reviewId);
      alert('Review deleted successfully.');
      await loadReviews(); // Refresh the reviews list
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review. Please try again.');
    }
  };

  const handleEditReview = (review: CourseReview) => {
    if (onEditReview) {
      onEditReview(review);
    }
  };

  const getProfileImage = (review: CourseReview) => {
    // Priority: User's uploaded profile picture > Firebase photoURL > Generated avatar

    // First check if user has uploaded a custom profile picture
    if (review.userAvatar) {
      return review.userAvatar;
    }

    // Check if this is the current user and they have a photoURL
    if (user && user.email === review.userEmail && (user as any).photoURL) {
      return (user as any).photoURL;
    }

    // Generate a consistent avatar using the email as seed
    const email = review.userEmail.toLowerCase().trim();

    // Use DiceBear API for consistent, attractive avatars
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=80`;
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'sm') => {
    const sizeClass = size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-6 w-6';
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Recently';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Recently';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-24"></div>
                    <div className="h-3 bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Review Statistics */}
      {stats && stats.totalReviews > 0 && (
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-yellow-400/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                {stats.averageRating.toFixed(1)}
              </div>
              {renderStars(Math.round(stats.averageRating), 'lg')}
              <div className="text-gray-400 text-sm mt-2">
                Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
              </div>
              {stats.verifiedPurchaseCount > 0 && (
                <div className="text-green-400 text-xs mt-1">
                  {stats.verifiedPurchaseCount} verified enrollment{stats.verifiedPurchaseCount !== 1 ? 's' : ''}
                </div>
              )}
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-3">
                  <span className="text-sm text-gray-400 w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${stats.totalReviews > 0 ? (stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution] / stats.totalReviews) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-400 w-8">
                    {stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Write Review Button */}
      {user && (
        <div className="text-center">
          <button
            onClick={onWriteReview}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg hover:from-orange-500 hover:to-yellow-500 transition-all duration-300"
          >
            {reviews.length === 0 ? 'Be the first to Review' : 'Write a Review'}
          </button>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white">Student Reviews</h3>
          
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {/* Profile Picture */}
                  <img
                    src={getProfileImage(review)}
                    alt={review.userName}
                    className="w-12 h-12 rounded-full border-2 border-gray-600"
                    onError={(e) => {
                      // Fallback to default avatar if image fails to load
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName)}&background=random&color=fff&size=80`;
                    }}
                  />
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-white">{review.userName}</h4>
                      {review.isVerifiedPurchase && (
                        <div title="Verified Enrollment">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        </div>
                      )}
                      {review.completedCourse && (
                        <div title="Course Completed">
                          <Award className="h-4 w-4 text-yellow-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3 mt-1">
                      {renderStars(review.rating)}
                      <span className="text-gray-400 text-sm">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Review Actions Menu */}
                <div className="relative">
                  {user && user.email === review.userEmail ? (
                    // User's own review - show edit/delete options
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditReview(review)}
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                        title="Edit review"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id!)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete review"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    // Other user's review - show report option
                    <button
                      onClick={() => handleReportReview(review)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                      title="Report review"
                    >
                      <Flag className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Review Title */}
              {review.reviewTitle && (
                <h5 className="font-semibold text-white mb-2">{review.reviewTitle}</h5>
              )}

              {/* Review Text */}
              <p className="text-gray-300 leading-relaxed mb-4">{review.reviewText}</p>

              {/* Additional Ratings */}
              {(review.instructorRating || review.contentQualityRating || review.valueForMoneyRating) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-700/30 rounded-lg">
                  {review.instructorRating && (
                    <div className="text-center">
                      <div className="text-sm text-gray-400 mb-1">Instructor</div>
                      {renderStars(review.instructorRating)}
                    </div>
                  )}
                  {review.contentQualityRating && (
                    <div className="text-center">
                      <div className="text-sm text-gray-400 mb-1">Content</div>
                      {renderStars(review.contentQualityRating)}
                    </div>
                  )}
                  {review.valueForMoneyRating && (
                    <div className="text-center">
                      <div className="text-sm text-gray-400 mb-1">Value</div>
                      {renderStars(review.valueForMoneyRating)}
                    </div>
                  )}
                </div>
              )}

              {/* Recommendations */}
              {(review.wouldRecommend !== undefined || review.learningGoalsMet !== undefined) && (
                <div className="flex flex-wrap gap-4 mb-4">
                  {review.wouldRecommend !== undefined && (
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      review.wouldRecommend 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {review.wouldRecommend ? '👍 Recommends' : '👎 Doesn\'t recommend'}
                    </div>
                  )}
                  {review.learningGoalsMet !== undefined && (
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      review.learningGoalsMet 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                        : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    }`}>
                      {review.learningGoalsMet ? '🎯 Goals met' : '🎯 Goals not met'}
                    </div>
                  )}
                </div>
              )}

              {/* Review Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <button
                  onClick={() => handleHelpfulVote(review.id!)}
                  disabled={votingLoading === review.id}
                  className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors disabled:opacity-50"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>
                    Helpful ({review.helpfulVotes || 0})
                    {votingLoading === review.id && ' ...'}
                  </span>
                </button>

                {review.courseProgress !== undefined && (
                  <div className="text-sm text-gray-400">
                    Course progress: {review.courseProgress}%
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : stats && stats.totalReviews === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Star className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
            <p>Be the first to share your experience with this course!</p>
          </div>
        </div>
      ) : null}

      {/* Review Flag Modal */}
      <ReviewFlagModal
        isOpen={showFlagModal}
        onClose={() => {
          setShowFlagModal(false);
          setFlaggingReview(null);
        }}
        onSubmitFlag={handleSubmitFlag}
        reviewAuthor={flaggingReview?.userName || ''}
        reviewText={flaggingReview?.reviewText || ''}
      />

      {/* Review Flag Success Modal */}
      <ReviewFlagSuccessModal
        isOpen={showFlagSuccessModal}
        onClose={() => setShowFlagSuccessModal(false)}
      />
    </div>
  );
};

export default ReviewsDisplay;
