import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, Eye, Heart, MessageCircle, Clock, ArrowLeft, Share2 } from 'lucide-react';
import { BlogPost } from '../types/blog';
import { blogService } from '../services/blogService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadPost(slug);
    }
  }, [slug]);

  const loadPost = async (postSlug: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 BlogPostPage: Loading post with slug:', postSlug);
      
      const postData = await blogService.getPostBySlug(postSlug);
      
      if (postData) {
        setPost(postData);
        // Increment view count
        await blogService.incrementViews(postData.id);
        console.log('✅ BlogPostPage: Post loaded successfully:', postData.title);
      } else {
        setError('Post not found');
        console.log('❌ BlogPostPage: Post not found for slug:', postSlug);
      }
    } catch (error) {
      console.error('❌ BlogPostPage: Error loading post:', error);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neon-black via-gray-900 to-neon-black">
        <div className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-3xl font-bold text-white mb-4">
              {error === 'Post not found' ? 'Post Not Found' : 'Error Loading Post'}
            </h1>
            <p className="text-cyan-200 mb-8">
              {error === 'Post not found' 
                ? 'The blog post you\'re looking for doesn\'t exist or has been removed.'
                : 'There was an error loading the blog post. Please try again.'}
            </p>
            <div className="space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 rounded-xl hover:bg-neon-cyan/30 transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Go Back</span>
              </button>
              <Link
                to="/blog"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta/30 rounded-xl hover:bg-neon-magenta/30 transition-all"
              >
                <span>Browse All Posts</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neon-black via-gray-900 to-neon-black">
      <div className="relative z-10">
        {/* Header */}
        <header className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center space-x-2 text-neon-cyan hover:text-cyan-300 transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Blog</span>
            </button>

            {/* Category */}
            {post.category && (
              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-sm font-medium bg-neon-cyan/20 text-neon-cyan rounded-full">
                  {post.category}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-magenta mb-6">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-cyan-100/80 mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-t border-b border-white/10">
              <div className="flex items-center space-x-6 text-cyan-400">
                <span className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{post.author}</span>
                </span>
                <span className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.publishedAt)}</span>
                </span>
                <span className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime} min read</span>
                </span>
              </div>

              <div className="flex items-center space-x-4">
                {/* Stats */}
                <div className="flex items-center space-x-4 text-cyan-400">
                  <span className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{post.views}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </span>
                </div>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-4 py-2 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 rounded-lg hover:bg-neon-cyan/30 transition-all"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <article className="prose prose-lg prose-invert max-w-none">
              <div 
                className="text-cyan-100 leading-relaxed"
                style={{ 
                  fontSize: '1.125rem',
                  lineHeight: '1.75',
                }}
                dangerouslySetInnerHTML={{ 
                  __html: post.content.replace(/\n/g, '<br />') 
                }}
              />
            </article>
          </div>
        </main>

        {/* Footer Actions */}
        <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-white/10">
          <div className="max-w-4xl mx-auto text-center">
            <Link
              to="/blog"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta/30 rounded-xl hover:bg-neon-magenta/30 transition-all"
            >
              <span>Browse More Posts</span>
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default BlogPostPage;
