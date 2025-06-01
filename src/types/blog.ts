// Blog-related type definitions

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  authorId: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  publishedAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published';
  likes: number;
  views: number;
  readTime: number; // in minutes
  slug: string;
}

export interface BlogComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userEmail: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  replies?: BlogComment[];
  parentId?: string;
}

export interface BlogLike {
  id: string;
  postId: string;
  userId: string;
  createdAt: Date;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super-admin';
  createdAt: Date;
  lastLogin: Date;
}

export interface BlogStats {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  popularPosts: BlogPost[];
  recentPosts: BlogPost[];
}
