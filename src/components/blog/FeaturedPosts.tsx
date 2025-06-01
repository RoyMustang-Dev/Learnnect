import React from 'react';
import { Calendar, User, Eye, Heart, Clock, ArrowRight } from 'lucide-react';
import { BlogPost } from '../../types/blog';
import { Link } from 'react-router-dom';

interface FeaturedPostsProps {
  posts: BlogPost[];
}

const FeaturedPosts: React.FC<FeaturedPostsProps> = ({ posts }) => {
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

  if (posts.length === 0) return null;

  const [mainPost, ...otherPosts] = posts;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Featured Post */}
      <div className="lg:col-span-2">
        <article className="group relative h-full">
          <div 
            className="relative h-96 lg:h-full rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm hover:border-neon-cyan/30 transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            }}
          >
            {/* Background Image */}
            {mainPost.featuredImage && (
              <div className="absolute inset-0">
                <img
                  src={mainPost.featuredImage}
                  alt={mainPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
              </div>
            )}

            {/* Content Overlay */}
            <div className="relative h-full flex flex-col justify-end p-8">
              {/* Category Badge */}
              <div className="mb-4">
                <span className={`inline-block px-4 py-2 rounded-full text-white font-medium bg-gradient-to-r ${getCategoryColor(mainPost.category)}`}>
                  {mainPost.category}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 group-hover:text-neon-cyan transition-colors">
                <Link to={`/blog/${mainPost.slug}`}>
                  {mainPost.title}
                </Link>
              </h2>

              {/* Excerpt */}
              <p className="text-cyan-100/90 text-lg mb-6 line-clamp-2">
                {mainPost.excerpt}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-cyan-200 text-sm">
                <span className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{mainPost.author}</span>
                </span>
                <span className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(mainPost.publishedAt)}</span>
                </span>
                <span className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{mainPost.readTime} min read</span>
                </span>
                <span className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>{mainPost.views}</span>
                </span>
                <span className="flex items-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <span>{mainPost.likes}</span>
                </span>
              </div>

              {/* Read More Link */}
              <div className="mt-6">
                <Link 
                  to={`/blog/${mainPost.slug}`}
                  className="inline-flex items-center space-x-2 text-neon-cyan hover:text-cyan-300 transition-colors font-medium"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>

      {/* Secondary Featured Posts */}
      <div className="space-y-6">
        {otherPosts.map((post) => (
          <article key={post.id} className="group">
            <div 
              className="relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:border-neon-cyan/30"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              }}
            >
              {/* Featured Image */}
              {post.featuredImage && (
                <div className="relative h-32 mb-4 rounded-xl overflow-hidden">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 rounded-full text-white text-xs font-medium bg-gradient-to-r ${getCategoryColor(post.category)}`}>
                      {post.category}
                    </span>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="space-y-3">
                {/* Title */}
                <h3 className="text-lg font-bold text-white group-hover:text-neon-cyan transition-colors line-clamp-2">
                  <Link to={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>

                {/* Excerpt */}
                <p className="text-cyan-200/80 text-sm line-clamp-2">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-cyan-400">
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(post.publishedAt)}</span>
                  </span>
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{post.views}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Heart className="h-3 w-3" />
                      <span>{post.likes}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default FeaturedPosts;
