// Blog service for Firebase operations
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  increment,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { BlogPost, BlogComment, BlogLike, BlogCategory } from '../types/blog';

// Blog Posts
export const blogService = {
  // Get all published blog posts - Simplified to avoid index issues
  async getAllPosts(): Promise<BlogPost[]> {
    try {
      console.log('📚 Public: Fetching published posts...');

      // Simple query without complex ordering to avoid index requirements
      const querySnapshot = await getDocs(collection(db, 'blogPosts'));

      const allPosts = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          publishedAt: data.publishedAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date()
        };
      }) as BlogPost[];

      // Filter published posts in JavaScript
      const publishedPosts = allPosts.filter(post => post.status === 'published');

      // Sort by published date in JavaScript
      publishedPosts.sort((a, b) => {
        const dateA = a.publishedAt || a.createdAt || new Date(0);
        const dateB = b.publishedAt || b.createdAt || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

      console.log('✅ Public: Published posts fetched:', publishedPosts.length);
      return publishedPosts;
    } catch (error) {
      console.error('❌ Public: Error fetching blog posts:', error);
      throw error;
    }
  },

  // Get blog post by slug - Simplified to avoid index issues
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      console.log('🔍 Public: Fetching post by slug:', slug);

      // Get all posts and filter in JavaScript
      const querySnapshot = await getDocs(collection(db, 'blogPosts'));

      const matchingPost = querySnapshot.docs.find(doc => {
        const data = doc.data();
        return data.slug === slug && data.status === 'published';
      });

      if (!matchingPost) {
        console.log('❌ Public: Post not found for slug:', slug);
        return null;
      }

      const data = matchingPost.data();
      const post = {
        id: matchingPost.id,
        ...data,
        publishedAt: data.publishedAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as BlogPost;

      console.log('✅ Public: Post found:', post.title);
      return post;
    } catch (error) {
      console.error('❌ Public: Error fetching blog post:', error);
      throw error;
    }
  },

  // Get posts by category - Simplified to avoid index issues
  async getPostsByCategory(category: string): Promise<BlogPost[]> {
    try {
      console.log('📂 Public: Fetching posts by category:', category);

      // Get all posts and filter in JavaScript
      const querySnapshot = await getDocs(collection(db, 'blogPosts'));

      const allPosts = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          publishedAt: data.publishedAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      }) as BlogPost[];

      // Filter by category and published status in JavaScript
      const categoryPosts = allPosts.filter(post =>
        post.category === category && post.status === 'published'
      );

      // Sort by published date
      categoryPosts.sort((a, b) => {
        const dateA = a.publishedAt || new Date(0);
        const dateB = b.publishedAt || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

      console.log('✅ Public: Category posts fetched:', categoryPosts.length);
      return categoryPosts;
    } catch (error) {
      console.error('❌ Public: Error fetching posts by category:', error);
      throw error;
    }
  },

  // Increment post views
  async incrementViews(postId: string): Promise<void> {
    try {
      const postRef = doc(db, 'blogPosts', postId);
      await updateDoc(postRef, {
        views: increment(1)
      });
    } catch (error) {
      console.error('Error incrementing views:', error);
      throw error;
    }
  },

  // Get featured posts - Simplified to avoid index issues
  async getFeaturedPosts(limitCount: number = 3): Promise<BlogPost[]> {
    try {
      console.log('⭐ Public: Fetching featured posts...');

      // Get all posts and filter in JavaScript
      const querySnapshot = await getDocs(collection(db, 'blogPosts'));

      const allPosts = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          publishedAt: data.publishedAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          likes: data.likes || 0
        };
      }) as BlogPost[];

      // Filter published posts and sort by likes in JavaScript
      const publishedPosts = allPosts.filter(post => post.status === 'published');

      publishedPosts.sort((a, b) => (b.likes || 0) - (a.likes || 0));

      const featuredPosts = publishedPosts.slice(0, limitCount);

      console.log('✅ Public: Featured posts fetched:', featuredPosts.length);
      return featuredPosts;
    } catch (error) {
      console.error('❌ Public: Error fetching featured posts:', error);
      throw error;
    }
  }
};

// Comments Service
export const commentService = {
  // Get comments for a post
  async getCommentsByPostId(postId: string): Promise<BlogComment[]> {
    try {
      const q = query(
        collection(db, 'blogComments'),
        where('postId', '==', postId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as BlogComment[];
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  // Add a comment
  async addComment(comment: Omit<BlogComment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'blogComments'), {
        ...comment,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        likes: 0
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Delete a comment
  async deleteComment(commentId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'blogComments', commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },

  // Update a comment
  async updateComment(commentId: string, content: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'blogComments', commentId), {
        content,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  }
};

// Likes Service
export const likeService = {
  // Toggle like on a post
  async togglePostLike(postId: string, userId: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, 'blogLikes'),
        where('postId', '==', postId),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Add like
        await addDoc(collection(db, 'blogLikes'), {
          postId,
          userId,
          createdAt: serverTimestamp()
        });

        // Increment post likes
        await updateDoc(doc(db, 'blogPosts', postId), {
          likes: increment(1)
        });

        return true;
      } else {
        // Remove like
        await deleteDoc(querySnapshot.docs[0].ref);

        // Decrement post likes
        await updateDoc(doc(db, 'blogPosts', postId), {
          likes: increment(-1)
        });

        return false;
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  },

  // Check if user liked a post
  async hasUserLikedPost(postId: string, userId: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, 'blogLikes'),
        where('postId', '==', postId),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking like status:', error);
      return false;
    }
  }
};

// Admin Service for CRUD operations
export const adminBlogService = {
  // Create a new blog post
  async createPost(post: Omit<BlogPost, 'id' | 'publishedAt' | 'updatedAt' | 'likes' | 'views'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'blogPosts'), {
        ...post,
        publishedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        likes: 0,
        views: 0
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  },

  // Update a blog post
  async updatePost(postId: string, updates: Partial<BlogPost>): Promise<void> {
    try {
      await updateDoc(doc(db, 'blogPosts', postId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  },

  // Delete a blog post
  async deletePost(postId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'blogPosts', postId));

      // Also delete all comments for this post
      const commentsQuery = query(
        collection(db, 'blogComments'),
        where('postId', '==', postId)
      );
      const commentsSnapshot = await getDocs(commentsQuery);

      const deletePromises = commentsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Delete all likes for this post
      const likesQuery = query(
        collection(db, 'blogLikes'),
        where('postId', '==', postId)
      );
      const likesSnapshot = await getDocs(likesQuery);

      const deleteLikesPromises = likesSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deleteLikesPromises);
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  },

  // Get all posts (including drafts) for admin - Simplified to avoid index issues
  async getAllPostsForAdmin(): Promise<BlogPost[]> {
    try {
      console.log('📚 Admin: Fetching all posts...');

      // Simple query without ordering to avoid index requirements
      const querySnapshot = await getDocs(collection(db, 'blogPosts'));

      const posts = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          publishedAt: data.publishedAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date()
        };
      }) as BlogPost[];

      // Sort in JavaScript instead of Firestore to avoid index issues
      posts.sort((a, b) => {
        const dateA = a.updatedAt || a.publishedAt || a.createdAt || new Date(0);
        const dateB = b.updatedAt || b.publishedAt || b.createdAt || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

      console.log('✅ Admin: Posts fetched successfully:', posts.length);
      return posts;
    } catch (error) {
      console.error('❌ Admin: Error fetching posts:', error);
      throw error;
    }
  },

  // Get post by ID for admin
  async getPostById(postId: string): Promise<BlogPost | null> {
    try {
      const docRef = doc(db, 'blogPosts', postId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          publishedAt: docSnap.data().publishedAt?.toDate(),
          updatedAt: docSnap.data().updatedAt?.toDate(),
        } as BlogPost;
      }
      return null;
    } catch (error) {
      console.error('Error fetching post by ID:', error);
      throw error;
    }
  }
};

// Categories Service
export const categoryService = {
  // Get all categories
  async getAllCategories(): Promise<BlogCategory[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'blogCategories'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogCategory[];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Create a category
  async createCategory(category: Omit<BlogCategory, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'blogCategories'), category);
      return docRef.id;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }
};