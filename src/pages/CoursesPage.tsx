import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { userActivityService } from '../services/userActivityService';
import { useAuth } from '../contexts/AuthContext';

// Mock data for courses
const allCourses = [
  {
    id: '1',
    title: 'Introduction to Data Science',
    instructor: 'Dr. Sarah Johnson',
    description: 'Learn the fundamentals of data science, including data visualization, statistical analysis, and machine learning basics.',
    image: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 0,
    category: 'Data Science',
    level: 'Beginner',
    duration: '6 weeks'
  },
  {
    id: '2',
    title: 'Machine Learning Fundamentals',
    instructor: 'Prof. David Chen',
    description: 'Master the core concepts of machine learning, including supervised and unsupervised learning, model evaluation, and deployment.',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 79.99,
    category: 'AI & ML',
    level: 'Intermediate',
    duration: '8 weeks'
  },
  {
    id: '3',
    title: 'Generative AI with Python',
    instructor: 'Dr. Michael Lee',
    description: 'Explore the exciting world of generative AI, including GANs, VAEs, and diffusion models to create innovative AI-generated content.',
    image: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 99.99,
    category: 'Generative AI',
    level: 'Advanced',
    duration: '10 weeks'
  },
  {
    id: '4',
    title: 'Data Visualization Mastery',
    instructor: 'Jennifer Wu, PhD',
    description: 'Create compelling data visualizations using Python libraries like Matplotlib, Seaborn, and interactive dashboards with Plotly and Dash.',
    image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 59.99,
    category: 'Data Science',
    level: 'Intermediate',
    duration: '5 weeks'
  },
  {
    id: '5',
    title: 'Deep Learning Specialization',
    instructor: 'Prof. Alex Morgan',
    description: 'Dive deep into neural networks architecture, CNNs, RNNs, and transformer models for advanced AI applications.',
    image: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 119.99,
    category: 'AI & ML',
    level: 'Advanced',
    duration: '12 weeks'
  },
  {
    id: '6',
    title: 'Stable Diffusion for Creatives',
    instructor: 'Sophia Rodriguez',
    description: 'Learn to use and fine-tune Stable Diffusion models to generate stunning artwork and design assets for creative projects.',
    image: 'https://images.pexels.com/photos/4050288/pexels-photo-4050288.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 89.99,
    category: 'Generative AI',
    level: 'Intermediate',
    duration: '6 weeks'
  },
  {
    id: '7',
    title: 'SQL for Data Analysis',
    instructor: 'Richard Taylor',
    description: 'Master SQL queries and database operations essential for data analysis and business intelligence roles.',
    image: 'https://images.pexels.com/photos/11035482/pexels-photo-11035482.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 49.99,
    category: 'Data Science',
    level: 'Beginner',
    duration: '4 weeks'
  },
  {
    id: '8',
    title: 'Natural Language Processing',
    instructor: 'Dr. Priya Sharma',
    description: 'Build powerful NLP applications using modern techniques for text classification, sentiment analysis, and language generation.',
    image: 'https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 89.99,
    category: 'AI & ML',
    level: 'Intermediate',
    duration: '8 weeks'
  },
  {
    id: '9',
    title: 'LLM Fine-tuning Workshop',
    instructor: 'James Wilson, PhD',
    description: 'Learn the practical techniques for fine-tuning large language models for specific applications and domains.',
    image: 'https://images.pexels.com/photos/7511608/pexels-photo-7511608.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 149.99,
    category: 'Generative AI',
    level: 'Advanced',
    duration: '4 weeks'
  },
  {
    id: '10',
    title: 'Python for Data Science Mastery',
    instructor: 'Dr. Emily Rodriguez',
    description: 'Master Python programming specifically for data science applications, including pandas, numpy, matplotlib, and scikit-learn.',
    image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 89.99,
    category: 'Python with Data Science',
    level: 'Intermediate',
    duration: '12 weeks'
  },
  {
    id: '11',
    title: 'Python Data Analysis Bootcamp',
    instructor: 'Mark Thompson',
    description: 'Comprehensive Python course focused on data manipulation, analysis, and visualization using real-world datasets.',
    image: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 79.99,
    category: 'Python with Data Science',
    level: 'Beginner',
    duration: '8 weeks'
  },
  {
    id: '12',
    title: 'Advanced Python for Data Scientists',
    instructor: 'Dr. Lisa Chen',
    description: 'Advanced Python techniques for data science including optimization, parallel processing, and advanced analytics.',
    image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 129.99,
    category: 'Python with Data Science',
    level: 'Advanced',
    duration: '10 weeks'
  },
  {
    id: '13',
    title: 'Advanced Data Science with Generative AI',
    instructor: 'Prof. Alex Thompson',
    description: 'Combine traditional data science techniques with cutting-edge generative AI to solve complex real-world problems.',
    image: 'https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 149.99,
    category: 'Data Science with Gen AI',
    level: 'Advanced',
    duration: '14 weeks'
  },
  {
    id: '14',
    title: 'Generative AI for Data Analytics',
    instructor: 'Dr. Sarah Kim',
    description: 'Learn to leverage generative AI models for enhanced data analysis, synthetic data generation, and predictive modeling.',
    image: 'https://images.pexels.com/photos/8386427/pexels-photo-8386427.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 119.99,
    category: 'Data Science with Gen AI',
    level: 'Intermediate',
    duration: '12 weeks'
  },
  {
    id: '15',
    title: 'AI-Powered Data Science Pipeline',
    instructor: 'Prof. Michael Zhang',
    description: 'Build end-to-end data science pipelines enhanced with generative AI for automated insights and decision making.',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 179.99,
    category: 'Data Science with Gen AI',
    level: 'Expert',
    duration: '16 weeks'
  },
  {
    id: '16',
    title: 'Complete Machine Learning with Generative AI',
    instructor: 'Dr. Marcus Kim',
    description: 'Comprehensive course covering traditional ML algorithms enhanced with generative AI techniques for next-generation solutions.',
    image: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 199.99,
    category: 'Complete ML with Gen AI',
    level: 'Expert',
    duration: '16 weeks'
  },
  {
    id: '17',
    title: 'ML Engineering with Generative Models',
    instructor: 'Dr. Jennifer Wu',
    description: 'Learn to build and deploy machine learning systems that incorporate generative AI for production environments.',
    image: 'https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 169.99,
    category: 'Complete ML with Gen AI',
    level: 'Advanced',
    duration: '14 weeks'
  },
  {
    id: '18',
    title: 'Generative AI for Machine Learning',
    instructor: 'Prof. David Rodriguez',
    description: 'Master the integration of generative AI techniques with traditional machine learning for enhanced model performance.',
    image: 'https://images.pexels.com/photos/8386427/pexels-photo-8386427.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 139.99,
    category: 'Complete ML with Gen AI',
    level: 'Intermediate',
    duration: '12 weeks'
  }
];

const CoursesPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredCourses, setFilteredCourses] = useState(allCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter states - Updated to support multiple selections
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category') ? [searchParams.get('category')!] : []
  );
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);

  // Update selectedCategories when URL parameters change
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || '';
    if (categoryFromUrl && !selectedCategories.includes(categoryFromUrl)) {
      setSelectedCategories([categoryFromUrl]);
      // Clear other filters when category changes to ensure clean filtering
      setSelectedLevels([]);
      setSelectedPriceRanges([]);
      setSearchTerm('');
    } else if (!categoryFromUrl && selectedCategories.length > 0) {
      setSelectedCategories([]);
    }
  }, [searchParams]);

  useEffect(() => {
    let filtered = [...allCourses];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by categories (multiple selection)
    if (selectedCategories.length > 0) {
      const categoryMap: {[key: string]: string} = {
        'data-science': 'Data Science',
        'ai-ml': 'AI & ML',
        'generative-ai': 'Generative AI',
        'python-data-science': 'Python with Data Science',
        'data-science-gen-ai': 'Data Science with Gen AI',
        'ml-gen-ai': 'Complete ML with Gen AI'
      };

      filtered = filtered.filter(course => {
        return selectedCategories.some(category => {
          const displayCategory = categoryMap[category] || category;
          return course.category === displayCategory;
        });
      });
    }

    // Filter by levels (multiple selection)
    if (selectedLevels.length > 0) {
      filtered = filtered.filter(course => selectedLevels.includes(course.level));
    }

    // Filter by price ranges (multiple selection)
    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter(course => {
        return selectedPriceRanges.some(range => {
          switch (range) {
            case 'free':
              return course.price === 0;
            case 'paid':
              return course.price > 0;
            case 'under50':
              return course.price > 0 && course.price < 50;
            case 'under100':
              return course.price > 0 && course.price < 100;
            default:
              return false;
          }
        });
      });
    }

    setFilteredCourses(filtered);
  }, [searchTerm, selectedCategories, selectedLevels, selectedPriceRanges, searchParams]);

  // Handler functions for multiple selections
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleLevelToggle = (level: string) => {
    setSelectedLevels(prev => {
      if (prev.includes(level)) {
        return prev.filter(l => l !== level);
      } else {
        return [...prev, level];
      }
    });
  };

  const handlePriceRangeToggle = (range: string) => {
    setSelectedPriceRanges(prev => {
      if (prev.includes(range)) {
        return prev.filter(r => r !== range);
      } else {
        return [...prev, range];
      }
    });
  };

  // Legacy handler for URL-based category changes (from navbar)
  const handleCategoryChange = (category: string) => {
    if (category) {
      setSelectedCategories([category]);
    } else {
      setSelectedCategories([]);
    }
    // Clear other filters when changing category
    setSelectedLevels([]);
    setSelectedPriceRanges([]);
    setSearchTerm('');

    // Create new URLSearchParams to avoid mutation issues
    const newSearchParams = new URLSearchParams();
    if (category) {
      newSearchParams.set('category', category);
    }
    setSearchParams(newSearchParams);
  };

  const applyFilters = () => {
    setShowFilters(false);
    // Update URL with current filters
    const newSearchParams = new URLSearchParams();
    if (selectedCategories.length === 1) {
      newSearchParams.set('category', selectedCategories[0]);
    }
    setSearchParams(newSearchParams);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Track search activity
    if (searchTerm && user?.email) {
      userActivityService.trackSearch(searchTerm, user.email);
    }
    // Search is already handled by useEffect
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedLevels([]);
    setSelectedPriceRanges([]);
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neon-black via-gray-900 to-neon-black pt-20 sm:pt-24 pb-12 sm:pb-16 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta mb-3 sm:mb-4" style={{textShadow: '0 0 20px rgba(0,255,255,0.5)'}}>
            Explore Our Courses
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-cyan-100/80 max-w-3xl mx-auto px-4">
            Discover specialized courses designed to help you master the most in-demand skills in tech
          </p>
        </div>

        {/* Search and filters */}
        <div className="mb-6 sm:mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pl-10 pr-4 text-cyan-100 bg-gray-900/50 border border-neon-cyan/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-neon-cyan backdrop-blur-sm placeholder-cyan-300/50"
                style={{boxShadow: '0 0 15px rgba(0,255,255,0.2)'}}
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-neon-cyan/70" />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-3 border border-neon-magenta/50 text-neon-magenta rounded-lg hover:bg-neon-magenta/10 hover:border-neon-magenta transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
              style={{boxShadow: '0 0 15px rgba(255,0,255,0.3)', textShadow: '0 0 5px rgba(255,0,255,0.8)'}}
            >
              <SlidersHorizontal className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Filters
            </button>
          </form>

          {/* Enhanced Filters panel */}
          {showFilters && (
            <div className="bg-gradient-to-br from-gray-900/90 to-neon-black/90 p-4 sm:p-6 rounded-xl border border-neon-cyan/30 backdrop-blur-sm mb-4 sm:mb-6" style={{boxShadow: '0 0 25px rgba(0,255,255,0.2)'}}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-neon-cyan mb-4 text-sm sm:text-base" style={{textShadow: '0 0 10px rgba(0,255,255,0.5)'}}>
                    📚 Category
                  </h3>
                  <div className="space-y-3">
                    {[
                      { value: 'data-science', label: 'Data Science', icon: '📊' },
                      { value: 'ai-ml', label: 'AI & Machine Learning', icon: '🤖' },
                      { value: 'generative-ai', label: 'Generative AI', icon: '✨' },
                      { value: 'python-data-science', label: 'Python with Data Science', icon: '🐍' },
                      { value: 'data-science-gen-ai', label: 'Data Science with Gen AI', icon: '⚡' },
                      { value: 'ml-gen-ai', label: 'Complete ML with Gen AI', icon: '🔥' }
                    ].map((category) => (
                      <label key={category.value} className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.value)}
                          onChange={() => handleCategoryToggle(category.value)}
                          className="h-4 w-4 text-neon-cyan bg-gray-800/50 border-neon-cyan/50 rounded focus:ring-neon-cyan/50 focus:ring-2"
                        />
                        <span className="ml-3 text-cyan-200 text-sm sm:text-base group-hover:text-neon-cyan transition-colors flex items-center">
                          <span className="mr-2">{category.icon}</span>
                          {category.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-neon-magenta mb-4 text-sm sm:text-base" style={{textShadow: '0 0 10px rgba(255,0,255,0.5)'}}>
                    🎯 Level
                  </h3>
                  <div className="space-y-3">
                    {[
                      { value: 'Beginner', label: 'Beginner', icon: '🌱' },
                      { value: 'Intermediate', label: 'Intermediate', icon: '📈' },
                      { value: 'Advanced', label: 'Advanced', icon: '🚀' }
                    ].map((level) => (
                      <label key={level.value} className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedLevels.includes(level.value)}
                          onChange={() => handleLevelToggle(level.value)}
                          className="h-4 w-4 text-neon-magenta bg-gray-800/50 border-neon-magenta/50 rounded focus:ring-neon-magenta/50 focus:ring-2"
                        />
                        <span className="ml-3 text-cyan-200 text-sm sm:text-base group-hover:text-neon-magenta transition-colors flex items-center">
                          <span className="mr-2">{level.icon}</span>
                          {level.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-neon-blue mb-4 text-sm sm:text-base" style={{textShadow: '0 0 10px rgba(0,150,255,0.5)'}}>
                    💰 Price
                  </h3>
                  <div className="space-y-3">
                    {[
                      { value: 'free', label: 'Free', icon: '🆓' },
                      { value: 'under50', label: 'Under $50', icon: '💵' },
                      { value: 'under100', label: 'Under $100', icon: '💸' },
                      { value: 'paid', label: 'Premium', icon: '💎' }
                    ].map((price) => (
                      <label key={price.value} className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedPriceRanges.includes(price.value)}
                          onChange={() => handlePriceRangeToggle(price.value)}
                          className="h-4 w-4 text-neon-blue bg-gray-800/50 border-neon-blue/50 rounded focus:ring-neon-blue/50 focus:ring-2"
                        />
                        <span className="ml-3 text-cyan-200 text-sm sm:text-base group-hover:text-neon-blue transition-colors flex items-center">
                          <span className="mr-2">{price.icon}</span>
                          {price.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Filter Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neon-cyan/20">
                <button
                  onClick={applyFilters}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 text-neon-cyan border border-neon-cyan/50 rounded-lg hover:from-neon-cyan/30 hover:to-neon-blue/30 hover:border-neon-cyan transition-all duration-300 backdrop-blur-sm font-semibold text-sm sm:text-base"
                  style={{boxShadow: '0 0 15px rgba(0,255,255,0.3)', textShadow: '0 0 5px rgba(0,255,255,0.8)'}}
                >
                  Apply Filters
                </button>
                <button
                  onClick={resetFilters}
                  className="flex items-center justify-center px-6 py-3 text-red-300 border border-red-500/50 rounded-lg hover:bg-red-500/10 hover:text-red-200 hover:border-red-400 transition-all duration-300 backdrop-blur-sm font-medium text-sm sm:text-base"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All
                </button>
              </div>
            </div>
          )}

          {/* Enhanced Active filters */}
          {(selectedCategories.length > 0 || selectedLevels.length > 0 || selectedPriceRanges.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategories.map((category) => (
                <div key={category} className="px-3 py-1 bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 text-neon-cyan border border-neon-cyan/30 rounded-full text-sm flex items-center backdrop-blur-sm">
                  📚 {category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  <button
                    onClick={() => handleCategoryToggle(category)}
                    className="ml-2 text-neon-cyan/70 hover:text-neon-cyan"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {selectedLevels.map((level) => (
                <div key={level} className="px-3 py-1 bg-gradient-to-r from-neon-magenta/20 to-neon-pink/20 text-neon-magenta border border-neon-magenta/30 rounded-full text-sm flex items-center backdrop-blur-sm">
                  🎯 {level}
                  <button
                    onClick={() => handleLevelToggle(level)}
                    className="ml-2 text-neon-magenta/70 hover:text-neon-magenta"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {selectedPriceRanges.map((range) => (
                <div key={range} className="px-3 py-1 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 text-neon-blue border border-neon-blue/30 rounded-full text-sm flex items-center backdrop-blur-sm">
                  💰 {
                    range === 'free' ? 'Free' :
                    range === 'under50' ? 'Under $50' :
                    range === 'under100' ? 'Under $100' : 'Premium'
                  }
                  <button
                    onClick={() => handlePriceRangeToggle(range)}
                    className="ml-2 text-neon-blue/70 hover:text-neon-blue"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              <button
                onClick={resetFilters}
                className="px-3 py-1 border border-red-500/50 text-red-300 rounded-full text-sm hover:bg-red-500/10 hover:text-red-200 transition-all duration-300 backdrop-blur-sm"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mb-4 sm:mb-6">
          <p className="text-cyan-200/80 text-sm sm:text-base">
            Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
          </p>
        </div>

        {/* Course grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <p className="text-cyan-200/80 mb-4 text-sm sm:text-base">No courses found matching your criteria.</p>
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 text-neon-cyan border border-neon-cyan/50 rounded-lg hover:bg-neon-cyan/10 hover:border-neon-cyan transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
              style={{boxShadow: '0 0 15px rgba(0,255,255,0.3)', textShadow: '0 0 5px rgba(0,255,255,0.8)'}}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;