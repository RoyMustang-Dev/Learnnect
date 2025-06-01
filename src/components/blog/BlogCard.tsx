import React from 'react';
import { Calendar, User, Eye, Heart, MessageCircle, Clock, ArrowRight } from 'lucide-react';
import { BlogPost } from '../../types/blog';
import { Link } from 'react-router-dom';

interface BlogCardProps {
  post: BlogPost;
  viewMode: 'grid' | 'list';
}

const BlogCard: React.FC<BlogCardProps> = ({ post, viewMode }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Technology': 'from-neon-cyan to-neon-blue',
      'Programming': 'from-neon-blue to-neon-magenta',
      'Design': 'from-neon-magenta to-neon-pink',
      'Business': 'from-neon-pink to-neon-cyan',
      'Tutorial': 'from-neon-cyan to-neon-magenta',
      'News': 'from-neon-blue to-neon-pink',
      'default': 'from-neon-cyan to-neon-blue'
    };
    return colors[category] || colors.default;
  };

  if (viewMode === 'list') {
    return (
      <article className="group">
        <div 
          className="relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:border-neon-cyan/30"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Featured Image */}
            {post.featuredImage && (
              <div className="md:w-1/3 flex-shrink-0">
                <div className="relative h-48 md:h-full rounded-xl overflow-hidden">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 space-y-4">
              {/* Category & Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className={`px-3 py-1 rounded-full text-white font-medium bg-gradient-to-r ${getCategoryColor(post.category)}`}>
                  {post.category}
                </span>
                <div className="flex items-center text-cyan-400 space-x-4">
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.publishedAt)}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime} min read</span>
                  </span>
                </div>
              </div>

              {/* Title & Excerpt */}
              <div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors">
                  <Link to={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
                <p className="text-cyan-200/80 line-clamp-2">
                  {post.excerpt}
                </p>
              </div>

              {/* Author & Stats */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-cyan-400">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{post.author}</span>
                </div>

                <div className="flex items-center space-x-4 text-cyan-400 text-sm">
                  <span className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{post.views}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </span>
                  <Link 
                    to={`/blog/${post.slug}`}
                    className="flex items-center space-x-1 text-neon-cyan hover:text-cyan-300 transition-colors"
                  >
                    <span>Read more</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs rounded-md bg-white/10 text-cyan-300 border border-white/20"
                    >
                      #{tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="px-2 py-1 text-xs rounded-md bg-white/10 text-cyan-300 border border-white/20">
                      +{post.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Grid view
  return (
    <article className="group">
      <div 
        className="relative h-full p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:border-neon-cyan/30 hover:transform hover:scale-105"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r ${getCategoryColor(post.category)}`}>
                {post.category}
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="space-y-4">
          {/* Meta Info */}
          <div className="flex items-center justify-between text-sm text-cyan-400">
            <span className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.publishedAt)}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{post.readTime} min</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white group-hover:text-neon-cyan transition-colors line-clamp-2">
            <Link to={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="text-cyan-200/80 line-clamp-3">
            {post.excerpt}
          </p>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded-md bg-white/10 text-cyan-300 border border-white/20"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center space-x-2 text-cyan-400 text-sm">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>

            <div className="flex items-center space-x-3 text-cyan-400 text-sm">
              <span className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{post.views}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Heart className="h-4 w-4" />
                <span>{post.likes}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
