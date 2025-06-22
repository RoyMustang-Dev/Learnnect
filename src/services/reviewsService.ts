import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface CourseReview {
  id?: string;
  courseId: string;
  userId: string;
  userEmail: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5 stars
  reviewText: string;
  reviewTitle?: string;
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  reportedCount: number;
  reports?: Array<{
    reason: string;
    reportedAt: string; // ISO string timestamp
    reportId: string;
  }>;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
  updatedAt: any;
  // Additional metadata
  courseProgress?: number; // 0-100%
  completedCourse?: boolean;
  wouldRecommend?: boolean;
  learningGoalsMet?: boolean;
  instructorRating?: number;
  contentQualityRating?: number;
  valueForMoneyRating?: number;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  verifiedPurchaseCount: number;
  completedStudentReviews: number;
}

class ReviewsService {
  private readonly reviewsCollection = 'courseReviews';

  // Submit a new review
  async submitReview(reviewData: Omit<CourseReview, 'id' | 'createdAt' | 'updatedAt' | 'helpfulVotes' | 'reportedCount' | 'status'>): Promise<string> {
    try {
      // Check if user already reviewed this course
      const existingReview = await this.getUserReviewForCourse(reviewData.userId, reviewData.courseId);
      if (existingReview) {
        throw new Error('You have already reviewed this course. You can edit your existing review.');
      }

      // Clean the review data to remove undefined values
      const cleanedReviewData = Object.fromEntries(
        Object.entries(reviewData).filter(([_, value]) => value !== undefined)
      );

      const review: Omit<CourseReview, 'id'> = {
        ...cleanedReviewData,
        // Ensure userAvatar is either a string or null, never undefined
        userAvatar: reviewData.userAvatar || null,
        helpfulVotes: 0,
        reportedCount: 0,
        status: 'approved', // Auto-approve for now (TODO: Add moderation system)
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      } as Omit<CourseReview, 'id'>;

      const docRef = await addDoc(collection(db, this.reviewsCollection), review);
      console.log('✅ Review submitted successfully:', docRef.id);
      
      // Also record in Google Sheets for admin review
      await this.recordReviewInSheets(review, docRef.id);
      
      return docRef.id;
    } catch (error) {
      console.error('❌ Error submitting review:', error);
      throw error;
    }
  }

  // Get reviews for a specific course
  async getCourseReviews(courseId: string, limitCount: number = 10): Promise<CourseReview[]> {
    try {
      const q = query(
        collection(db, this.reviewsCollection),
        where('courseId', '==', courseId),
        where('status', '==', 'approved'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const reviews: CourseReview[] = [];

      querySnapshot.forEach((doc) => {
        reviews.push({
          id: doc.id,
          ...doc.data()
        } as CourseReview);
      });

      return reviews;
    } catch (error) {
      console.error('❌ Error fetching course reviews:', error);
      return [];
    }
  }

  // Get review statistics for a course
  async getCourseReviewStats(courseId: string): Promise<ReviewStats> {
    try {
      const q = query(
        collection(db, this.reviewsCollection),
        where('courseId', '==', courseId),
        where('status', '==', 'approved')
      );

      const querySnapshot = await getDocs(q);
      const reviews: CourseReview[] = [];

      querySnapshot.forEach((doc) => {
        reviews.push(doc.data() as CourseReview);
      });

      if (reviews.length === 0) {
        return {
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          verifiedPurchaseCount: 0,
          completedStudentReviews: 0
        };
      }

      // Calculate statistics
      const totalReviews = reviews.length;
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / totalReviews;

      const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      reviews.forEach(review => {
        ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
      });

      const verifiedPurchaseCount = reviews.filter(r => r.isVerifiedPurchase).length;
      const completedStudentReviews = reviews.filter(r => r.completedCourse).length;

      return {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        ratingDistribution,
        verifiedPurchaseCount,
        completedStudentReviews
      };
    } catch (error) {
      console.error('❌ Error calculating review stats:', error);
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        verifiedPurchaseCount: 0,
        completedStudentReviews: 0
      };
    }
  }

  // Get user's review for a specific course
  async getUserReviewForCourse(userId: string, courseId: string): Promise<CourseReview | null> {
    try {
      const q = query(
        collection(db, this.reviewsCollection),
        where('userId', '==', userId),
        where('courseId', '==', courseId)
      );

      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as CourseReview;
    } catch (error) {
      console.error('❌ Error fetching user review:', error);
      return null;
    }
  }

  // Update an existing review
  async updateReview(reviewId: string, updates: Partial<CourseReview>): Promise<void> {
    try {
      const reviewRef = doc(db, this.reviewsCollection, reviewId);
      await updateDoc(reviewRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      console.log('✅ Review updated successfully');
    } catch (error) {
      console.error('❌ Error updating review:', error);
      throw error;
    }
  }

  // Delete a review
  async deleteReview(reviewId: string): Promise<void> {
    try {
      const reviewRef = doc(db, this.reviewsCollection, reviewId);
      await deleteDoc(reviewRef);
      console.log('✅ Review deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting review:', error);
      throw error;
    }
  }

  // Vote helpful on a review
  async voteHelpful(reviewId: string): Promise<void> {
    try {
      const reviewRef = doc(db, this.reviewsCollection, reviewId);
      const reviewDoc = await getDoc(reviewRef);
      
      if (reviewDoc.exists()) {
        const currentVotes = reviewDoc.data().helpfulVotes || 0;
        await updateDoc(reviewRef, {
          helpfulVotes: currentVotes + 1,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('❌ Error voting helpful:', error);
      throw error;
    }
  }

  // Report a review
  async reportReview(reviewId: string, reason: string): Promise<void> {
    try {
      if (!reviewId || !reason) {
        throw new Error('Review ID and reason are required');
      }

      const reviewRef = doc(db, this.reviewsCollection, reviewId);
      const reviewDoc = await getDoc(reviewRef);

      if (!reviewDoc.exists()) {
        throw new Error('Review not found');
      }

      const reviewData = reviewDoc.data();
      const currentReports = reviewData.reportedCount || 0;
      const existingReports = reviewData.reports || [];

      // Add the new report with timestamp and reason
      const newReport = {
        reason: reason.trim(),
        reportedAt: new Date().toISOString(), // Use ISO string instead of serverTimestamp for arrays
        reportId: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      // Update the review with new report
      const updateData: any = {
        reportedCount: currentReports + 1,
        reports: [...existingReports, newReport],
        updatedAt: serverTimestamp()
      };

      // If too many reports, auto-hide the review
      if (currentReports + 1 >= 5) {
        updateData.status = 'rejected';
        console.log('🚫 Review auto-hidden due to multiple reports');
      }

      await updateDoc(reviewRef, updateData);

      // Record the report for admin review
      try {
        await this.recordReportInSheets(reviewId, reason);
      } catch (sheetError) {
        console.warn('⚠️ Failed to record report in sheets:', sheetError);
        // Don't throw here as the main operation succeeded
      }

      console.log('✅ Review reported successfully with reason:', reason);
    } catch (error) {
      console.error('❌ Error reporting review:', error);
      throw error;
    }
  }

  // Check if user can review (must be enrolled and have some progress)
  async canUserReview(userId: string, courseId: string): Promise<{ canReview: boolean; reason?: string }> {
    try {
      // Check if user is enrolled in the course
      // This would integrate with your user enrollment system
      // For now, we'll assume they can review if they're enrolled
      
      const existingReview = await this.getUserReviewForCourse(userId, courseId);
      if (existingReview) {
        return { canReview: false, reason: 'You have already reviewed this course' };
      }

      // Add more checks here:
      // - User must be enrolled
      // - User should have some progress (e.g., >10%)
      // - Course should not be too recently enrolled (e.g., >24 hours)

      return { canReview: true };
    } catch (error) {
      console.error('❌ Error checking review eligibility:', error);
      return { canReview: false, reason: 'Unable to verify eligibility' };
    }
  }

  // Record review in Google Sheets for admin moderation
  private async recordReviewInSheets(review: Omit<CourseReview, 'id'>, reviewId: string): Promise<void> {
    try {
      // This would integrate with your Google Apps Script service
      // to record reviews for admin moderation
      console.log('📊 Recording review in Google Sheets for moderation:', reviewId);
    } catch (error) {
      console.error('❌ Error recording review in sheets:', error);
    }
  }

  // Record review report in Google Sheets
  private async recordReportInSheets(reviewId: string, reason: string): Promise<void> {
    try {
      console.log('📊 Recording review report in Google Sheets:', reviewId, reason);
    } catch (error) {
      console.error('❌ Error recording report in sheets:', error);
    }
  }
}

export const reviewsService = new ReviewsService();
export default reviewsService;
