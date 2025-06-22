import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { userActivityService } from '../services/userActivityService';
import { useAuth } from '../contexts/AuthContext';
import { allCourses as coursesData, courseCategories } from '../data/coursesData';

// Convert course data to the format expected by CourseCard
const allCourses = coursesData.map(course => ({
  id: course.id,
  title: course.courseDisplayName,
  instructor: course.instructor || 'Learnnect Expert',
  description: course.description,
  image: course.image || `https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`,
  price: course.price,
  category: course.category,
  level: course.level,
  duration: course.duration,
  courseData: course
}));


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
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    searchParams.get('type') ? [searchParams.get('type')!] : []
  );
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);

  // Update selectedCategories and selectedTypes when URL parameters change
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || '';
    const typeFromUrl = searchParams.get('type') || '';

    if (categoryFromUrl && !selectedCategories.includes(categoryFromUrl)) {
      setSelectedCategories([categoryFromUrl]);
      // Clear other filters when category changes to ensure clean filtering
      setSelectedTypes([]);
      setSelectedLevels([]);
      setSelectedPriceRanges([]);
      setSearchTerm('');
    } else if (!categoryFromUrl && selectedCategories.length > 0) {
      setSelectedCategories([]);
    }

    if (typeFromUrl && !selectedTypes.includes(typeFromUrl)) {
      setSelectedTypes([typeFromUrl]);
      // Clear other filters when type changes to ensure clean filtering
      setSelectedCategories([]);
      setSelectedLevels([]);
      setSelectedPriceRanges([]);
      setSearchTerm('');
    } else if (!typeFromUrl && selectedTypes.length > 0) {
      setSelectedTypes([]);
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
      filtered = filtered.filter(course => {
        return selectedCategories.includes(course.category);
      });
    }

    // Filter by course types (multiple selection)
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(course => {
        const courseType = course.courseData.type;
        return selectedTypes.some(type => {
          switch (type) {
            case 'premium':
              return courseType === 'Paid/Premium';
            case 'foundation':
              return courseType === 'Freemium';
            case 'free':
              return courseType === 'Free';
            default:
              return false;
          }
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
            case 'freemium':
              return course.price === 199;
            case 'premium':
              return course.price >= 3000;
            default:
              return false;
          }
        });
      });
    }

    setFilteredCourses(filtered);
  }, [searchTerm, selectedCategories, selectedTypes, selectedLevels, selectedPriceRanges, searchParams]);

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

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
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
    setSelectedTypes([]);
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-neon-cyan mb-4 text-sm sm:text-base" style={{textShadow: '0 0 10px rgba(0,255,255,0.5)'}}>
                    📚 Category
                  </h3>
                  <div className="space-y-3">
                    {courseCategories.filter(cat => cat !== 'All').map((category) => {
                      const categoryIcons: {[key: string]: string} = {
                        'Data Science': '📊',
                        'Data Analytics': '📈',
                        'Machine Learning': '🤖',
                        'Generative AI': '✨',
                        'Programming': '🐍',
                        'Business Intelligence': '💼',
                        'Database': '🗄️',
                        'Web Development': '🌐',
                        'Cloud Computing': '☁️',
                        'Development Tools': '🔧',
                        'Automation': '⚙️'
                      };

                      return (
                        <label key={category} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={() => handleCategoryToggle(category)}
                            className="h-4 w-4 text-neon-cyan bg-gray-800/50 border-neon-cyan/50 rounded focus:ring-neon-cyan/50 focus:ring-2"
                          />
                          <span className="ml-3 text-cyan-200 text-sm sm:text-base group-hover:text-neon-cyan transition-colors flex items-center">
                            <span className="mr-2">{categoryIcons[category] || '📚'}</span>
                            {category}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-neon-magenta mb-4 text-sm sm:text-base" style={{textShadow: '0 0 10px rgba(255,0,255,0.5)'}}>
                    🎓 Course Type
                  </h3>
                  <div className="space-y-3">
                    {[
                      { value: 'premium', label: 'Premium Courses', icon: '💎' },
                      { value: 'foundation', label: 'Foundation Courses', icon: '🎯' },
                      { value: 'free', label: 'Free Courses', icon: '🚀' }
                    ].map((type) => (
                      <label key={type.value} className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(type.value)}
                          onChange={() => handleTypeToggle(type.value)}
                          className="h-4 w-4 text-neon-magenta bg-gray-800/50 border-neon-magenta/50 rounded focus:ring-neon-magenta/50 focus:ring-2"
                        />
                        <span className="ml-3 text-cyan-200 text-sm sm:text-base group-hover:text-neon-magenta transition-colors flex items-center">
                          <span className="mr-2">{type.icon}</span>
                          {type.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-neon-blue mb-4 text-sm sm:text-base" style={{textShadow: '0 0 10px rgba(0,150,255,0.5)'}}>
                    🎯 Level
                  </h3>
                  <div className="space-y-3">
                    {[
                      { value: 'Beginner', label: 'Beginner', icon: '🌱' },
                      { value: 'Intermediate', label: 'Intermediate', icon: '📈' },
                      { value: 'Advanced', label: 'Advanced', icon: '🚀' },
                      { value: 'Expert', label: 'Expert', icon: '🏆' }
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
                  <h3 className="font-semibold text-green-400 mb-4 text-sm sm:text-base" style={{textShadow: '0 0 10px rgba(34,197,94,0.5)'}}>
                    💰 Price
                  </h3>
                  <div className="space-y-3">
                    {[
                      { value: 'free', label: 'Free', icon: '🆓' },
                      { value: 'freemium', label: 'Freemium (₹199)', icon: '💵' },
                      { value: 'premium', label: 'Premium (₹3000+)', icon: '💎' }
                    ].map((price) => (
                      <label key={price.value} className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedPriceRanges.includes(price.value)}
                          onChange={() => handlePriceRangeToggle(price.value)}
                          className="h-4 w-4 text-green-400 bg-gray-800/50 border-green-400/50 rounded focus:ring-green-400/50 focus:ring-2"
                        />
                        <span className="ml-3 text-cyan-200 text-sm sm:text-base group-hover:text-green-400 transition-colors flex items-center">
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
          {(selectedCategories.length > 0 || selectedTypes.length > 0 || selectedLevels.length > 0 || selectedPriceRanges.length > 0) && (
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

              {selectedTypes.map((type) => (
                <div key={type} className="px-3 py-1 bg-gradient-to-r from-neon-magenta/20 to-neon-pink/20 text-neon-magenta border border-neon-magenta/30 rounded-full text-sm flex items-center backdrop-blur-sm">
                  🎓 {
                    type === 'premium' ? 'Premium Courses' :
                    type === 'foundation' ? 'Foundation Courses' :
                    'Free Courses'
                  }
                  <button
                    onClick={() => handleTypeToggle(type)}
                    className="ml-2 text-neon-magenta/70 hover:text-neon-magenta"
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