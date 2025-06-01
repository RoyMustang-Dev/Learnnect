import React, { useState, useEffect } from 'react';
import { Search, Calendar, User, Eye, Heart, MessageCircle, Filter, Grid, List } from 'lucide-react';
import { BlogPost, BlogCategory } from '../types/blog';
import { blogService, categoryService } from '../services/blogService';
import BlogCard from '../components/blog/BlogCard';
import BlogFilters from '../components/blog/BlogFilters';
import BlogSearch from '../components/blog/BlogSearch';
import FeaturedPosts from '../components/blog/FeaturedPosts';
import LoadingSpinner from '../components/common/LoadingSpinner';

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'oldest'>('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadBlogData();
  }, []);

  useEffect(() => {
    filterAndSortPosts();
  }, [posts, searchTerm, selectedCategory, sortBy]);

  const loadBlogData = async () => {
    try {
      setLoading(true);
      const [postsData, categoriesData, featuredData] = await Promise.all([
        blogService.getAllPosts(),
        categoryService.getAllCategories(),
        blogService.getFeaturedPosts(3)
      ]);

      setPosts(postsData);
      setCategories(categoriesData);
      setFeaturedPosts(featuredData);
    } catch (error) {
      console.error('Error loading blog data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPosts = () => {
    let filtered = [...posts];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'oldest':
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        case 'popular':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });

    setFilteredPosts(filtered);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (sort: 'latest' | 'popular' | 'oldest') => {
    setSortBy(sort);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="relative bg-gradient-to-br from-neon-black via-gray-900 to-neon-black">
      {/* Enhanced Background effects matching HomePage */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-neon-magenta/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-magenta mb-6">
              Learning Hub
            </h1>
            <p className="text-xl text-cyan-100/80 max-w-3xl mx-auto mb-8">
              Discover insights, tutorials, and industry trends to accelerate your learning journey
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <BlogSearch onSearch={handleSearch} />
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-neon-cyan mb-8 text-center">Featured Posts</h2>
              <FeaturedPosts posts={featuredPosts} />
            </div>
          </section>
        )}

        {/* Main Content */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <aside className="lg:w-1/4">
                <div className="sticky top-24 space-y-6">
                  <BlogFilters
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryFilter}
                    sortBy={sortBy}
                    onSortChange={handleSortChange}
                  />
                </div>
              </aside>

              {/* Posts Grid */}
              <main className="lg:w-3/4">
                {/* View Toggle & Results Count */}
                <div className="flex justify-between items-center mb-8">
                  <div className="text-cyan-200">
                    <span className="text-neon-cyan font-semibold">{filteredPosts.length}</span> posts found
                    {searchTerm && (
                      <span className="ml-2">for "<span className="text-neon-cyan">{searchTerm}</span>"</span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-neon-cyan/20 text-neon-cyan'
                          : 'text-cyan-400 hover:text-neon-cyan'
                      }`}
                    >
                      <Grid className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'list'
                          ? 'bg-neon-cyan/20 text-neon-cyan'
                          : 'text-cyan-400 hover:text-neon-cyan'
                      }`}
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Posts */}
                {filteredPosts.length > 0 ? (
                  <div className={`grid gap-8 ${
                    viewMode === 'grid'
                      ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                      : 'grid-cols-1'
                  }`}>
                    {filteredPosts.map((post) => (
                      <BlogCard
                        key={post.id}
                        post={post}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-2xl font-bold text-cyan-200 mb-2">No posts found</h3>
                    <p className="text-cyan-400">
                      {searchTerm || selectedCategory !== 'all'
                        ? 'Try adjusting your search or filters'
                        : 'Check back soon for new content!'}
                    </p>
                  </div>
                )}
              </main>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogPage;
