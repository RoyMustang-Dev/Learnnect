import React from 'react';
import { Filter, TrendingUp, Calendar, Clock } from 'lucide-react';
import { BlogCategory } from '../../types/blog';

interface BlogFiltersProps {
  categories: BlogCategory[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: 'latest' | 'popular' | 'oldest';
  onSortChange: (sort: 'latest' | 'popular' | 'oldest') => void;
}

const BlogFilters: React.FC<BlogFiltersProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange
}) => {
  const sortOptions = [
    { value: 'latest', label: 'Latest', icon: Calendar },
    { value: 'popular', label: 'Most Popular', icon: TrendingUp },
    { value: 'oldest', label: 'Oldest', icon: Clock }
  ] as const;

  return (
    <div className="space-y-6">
      {/* Sort Options */}
      <div 
        className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-neon-cyan" />
          <h3 className="text-lg font-semibold text-white">Sort By</h3>
        </div>
        
        <div className="space-y-2">
          {sortOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                  sortBy === option.value
                    ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                    : 'text-cyan-200 hover:bg-white/10 hover:text-neon-cyan'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories */}
      <div 
        className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
        
        <div className="space-y-2">
          {/* All Categories */}
          <button
            onClick={() => onCategoryChange('all')}
            className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                : 'text-cyan-200 hover:bg-white/10 hover:text-neon-cyan'
            }`}
          >
            <span className="text-sm font-medium">All Categories</span>
          </button>

          {/* Individual Categories */}
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.slug)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                selectedCategory === category.slug
                  ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                  : 'text-cyan-200 hover:bg-white/10 hover:text-neon-cyan'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{category.name}</span>
                <span 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                ></span>
              </div>
              {category.description && (
                <p className="text-xs text-cyan-400 mt-1">{category.description}</p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Popular Tags */}
      <div 
        className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        <h3 className="text-lg font-semibold text-white mb-4">Popular Tags</h3>
        
        <div className="flex flex-wrap gap-2">
          {['React', 'TypeScript', 'JavaScript', 'CSS', 'Node.js', 'Python', 'AI', 'Machine Learning'].map((tag) => (
            <button
              key={tag}
              className="px-3 py-1 text-xs rounded-full bg-white/10 text-cyan-300 border border-white/20 hover:bg-neon-cyan/20 hover:text-neon-cyan hover:border-neon-cyan/30 transition-all duration-200"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogFilters;
