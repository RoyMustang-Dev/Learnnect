import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, ChevronRight, Search, User, LogOut, BookOpen, Crown, Building2, Gift, GraduationCap, Brain, Code, Sparkles, Database, Zap, Cpu, BarChart3, Bot, Lightbulb, Cloud, GitBranch, FileSpreadsheet, Wrench, Workflow, Star, Trophy, Gem, Award, Target, Rocket, Briefcase, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo.tsx';
import { userActivityService } from '../services/userActivityService';
import { allCourses, paidCourses, freeCourses } from '../data/coursesData';

interface SearchResult {
  id: string;
  title: string;
  category: string;
  type: 'course' | 'blog';
  courseType?: 'Paid/Premium' | 'Free' | 'Freemium';
  price?: number;
  description?: string;
}

// Blog data for search
const blogData: SearchResult[] = [
  { id: 'blog-1', title: 'Getting Started with Machine Learning in 2024', category: 'Machine Learning', type: 'blog', description: 'A comprehensive guide to starting your ML journey' },
  { id: 'blog-2', title: 'Top 10 Data Science Tools Every Analyst Should Know', category: 'Data Science', type: 'blog', description: 'Essential tools for modern data analysis' },
  { id: 'blog-3', title: 'Generative AI: Transforming Industries', category: 'Generative AI', type: 'blog', description: 'How Gen AI is revolutionizing business processes' },
  { id: 'blog-4', title: 'Python vs R: Which is Better for Data Science?', category: 'Programming', type: 'blog', description: 'Comparing the two most popular data science languages' },
  { id: 'blog-5', title: 'Career Roadmap: From Beginner to Data Scientist', category: 'Career', type: 'blog', description: 'Step-by-step guide to becoming a data scientist' },
  { id: 'blog-6', title: 'Understanding Large Language Models (LLMs)', category: 'Generative AI', type: 'blog', description: 'Deep dive into how LLMs work and their applications' },
  { id: 'blog-7', title: 'MLOps Best Practices for Production', category: 'MLOps', type: 'blog', description: 'Essential practices for deploying ML models' },
  { id: 'blog-8', title: 'Data Analytics vs Data Science: Key Differences', category: 'Data Analytics', type: 'blog', description: 'Understanding the distinction between these fields' },
];

// Convert course data to search format
const getCourseSearchData = (): SearchResult[] => {
  return allCourses.map(course => ({
    id: course.courseId,
    title: course.courseDisplayName,
    category: course.category,
    type: 'course' as const,
    courseType: course.type,
    price: course.price,
    description: course.description
  }));
};

// Helper function to get course icon based on category
const getCourseIcon = (category: string) => {
  const iconMap: { [key: string]: JSX.Element } = {
    'Data Science': <Database className="h-4 w-4" />,
    'Machine Learning': <Brain className="h-4 w-4" />,
    'Generative AI': <Sparkles className="h-4 w-4" />,
    'Programming': <Code className="h-4 w-4" />,
    'Data Analytics': <BarChart3 className="h-4 w-4" />,
    'Business Intelligence': <Lightbulb className="h-4 w-4" />,
    'Database': <Database className="h-4 w-4" />,
    'Web Development': <Code className="h-4 w-4" />,
    'Cloud Computing': <Cloud className="h-4 w-4" />,
    'Development Tools': <GitBranch className="h-4 w-4" />,
    'Data Analysis': <FileSpreadsheet className="h-4 w-4" />,
    'Automation': <Workflow className="h-4 w-4" />,
  };
  return iconMap[category] || <BookOpen className="h-4 w-4" />;
};

// Get courses by type
const getPremiumCourses = () => paidCourses;
const getFoundationCourses = () => freeCourses.filter(course => course.type === 'Freemium');
const getFreeCourses = () => freeCourses.filter(course => course.type === 'Free');

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [premiumDropdownOpen, setPremiumDropdownOpen] = useState(false);
  const [foundationDropdownOpen, setFoundationDropdownOpen] = useState(false);
  const [freeDropdownOpen, setFreeDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const coursesDropdownRef = useRef<HTMLDivElement>(null);

  // Helper function to track navigation clicks
  const trackNavClick = (linkName: string, destination: string) => {
    if (user?.email) {
      userActivityService.trackButtonClick(`nav_${linkName}`, user.email);
      userActivityService.trackActivity('navigation', `Clicked: ${linkName} -> ${destination}`, user.email);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside to close search (improved to avoid navbar conflicts)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Don't close if clicking on the search button or navbar elements
      if (searchRef.current &&
          !searchRef.current.contains(target) &&
          !(target as Element).closest('button[aria-label="Search"]') &&
          !(target as Element).closest('header')) {
        setSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };

    if (searchOpen) {
      // Use a slight delay to avoid immediate closure
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchOpen]);

  // Dynamic search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Simulate API call delay
    const searchTimeout = setTimeout(() => {
      const courseData = getCourseSearchData();
      const allSearchData = [...courseData, ...blogData];

      const filteredResults = allSearchData.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.courseType && item.courseType.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      // Sort results: courses first, then blogs
      const sortedResults = filteredResults.sort((a, b) => {
        if (a.type === 'course' && b.type === 'blog') return -1;
        if (a.type === 'blog' && b.type === 'course') return 1;
        return 0;
      });

      setSearchResults(sortedResults);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  // Handle escape key to close search
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };

    if (searchOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [searchOpen]);

  // TEMPORARILY DISABLED - Click outside to close user menu
  // useEffect(() => {
  //   if (!userMenuOpen) return;

  //   const handleClickOutside = (event: MouseEvent) => {
  //     const target = event.target as Element;

  //     // Don't close if clicking inside the dropdown container
  //     if (userMenuRef.current && !userMenuRef.current.contains(target)) {
  //       console.log('🔄 Click outside user menu detected, closing...');
  //       setUserMenuOpen(false);
  //     }
  //   };

  //   // Add a longer delay to ensure the dropdown is fully rendered and stable
  //   const timeoutId = setTimeout(() => {
  //     document.addEventListener('mousedown', handleClickOutside);
  //     console.log('🔄 Click outside handler attached for user menu (delayed)');
  //   }, 500); // Longer delay

  //   return () => {
  //     clearTimeout(timeoutId);
  //     document.removeEventListener('mousedown', handleClickOutside);
  //     console.log('🔄 Click outside handler removed for user menu');
  //   };
  // }, [userMenuOpen]);

  // Click outside to close courses dropdown (desktop only)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only apply to desktop dropdown, not mobile menu
      if (coursesDropdownRef.current &&
          !coursesDropdownRef.current.contains(event.target as Node)) {
        setCoursesDropdownOpen(false);
      }
    };

    if (coursesDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [coursesDropdownOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Close courses dropdown when mobile menu is closed
    if (isOpen) {
      setCoursesDropdownOpen(false);
    }
  };

  const toggleSearch = () => {
    if (!searchOpen) {
      // Opening search
      setSearchOpen(true);
      setIsOpen(false); // Close mobile menu if open
      setCoursesDropdownOpen(false); // Close courses dropdown if open
    } else {
      // Closing search
      setSearchOpen(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  // Close all dropdowns when clicking outside or navigating
  const closeAllDropdowns = () => {
    setCoursesDropdownOpen(false);
    setPremiumDropdownOpen(false);
    setFoundationDropdownOpen(false);
    setFreeDropdownOpen(false);
    setUserMenuOpen(false);
    setIsOpen(false);
  };

  // Close sub-dropdowns when main dropdown closes
  const closeSubDropdowns = () => {
    setPremiumDropdownOpen(false);
    setFoundationDropdownOpen(false);
    setFreeDropdownOpen(false);
  };

  return (
    <header
      className={`fixed w-full h-[10%] sm:h-auto transition-all duration-500 ease-out overflow-visible ${
        searchOpen ? 'z-[100]' : 'z-[90]'
      } ${
        scrolled
        ? 'bg-white/5 backdrop-blur-2xl backdrop-saturate-200'
        : ''
      }`}
      style={{
        backdropFilter: scrolled ? 'blur(10.3px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(10.3px) saturate(180%)' : 'none',
        background: scrolled
          ? 'rgba(189,189,189,0.14)'
          : 'none',
        boxShadow: scrolled
          ? '0 4px 30px rgba(0,0,0,0.1)'
          : 'none',
        border: 'none',
        margin: 0,
        padding: 0
      }}
    >
      <nav className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 w-full">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex-shrink-0"
              onClick={() => {
                closeAllDropdowns();
                trackNavClick('logo', '/');
              }}
            >
              <Logo size="sm" className="sm:hidden" />
              <Logo size="md" className="hidden sm:block" />
            </Link>
            <div className="hidden lg:block ml-10">
              <div className="flex items-center space-x-4">
                {/* Enhanced Multi-level Courses dropdown - Desktop Only */}
                <div className="relative" ref={coursesDropdownRef}>
                  <button
                    onClick={() => {
                      setCoursesDropdownOpen(!coursesDropdownOpen);
                      if (!coursesDropdownOpen) closeSubDropdowns();
                    }}
                    onMouseEnter={() => setCoursesDropdownOpen(true)}
                    className="group relative px-3 py-2 text-white hover:text-neon-cyan transition-all duration-300 transform hover:scale-105 flex items-center"
                  >
                    <span className="relative z-10">Courses</span>
                    <ChevronDown className={`ml-1 w-4 h-4 transition-all duration-300 ${coursesDropdownOpen ? 'rotate-180 text-neon-cyan' : 'rotate-0'}`} />
                    {/* Hover background effect */}
                    <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div>
                  </button>

                  {/* Main Dropdown menu */}
                  <div
                    className={`absolute left-0 mt-2 w-72 rounded-xl shadow-2xl backdrop-blur-2xl backdrop-saturate-200 ring-1 ring-white/20 z-[95] transition-all duration-300 transform origin-top ${
                      coursesDropdownOpen
                        ? 'opacity-100 visible scale-100 translate-y-0'
                        : 'opacity-0 invisible scale-95 -translate-y-2'
                    }`}
                    style={{
                      background: 'linear-gradient(135deg, rgba(15,15,26,0.95) 0%, rgba(15,15,26,0.98) 100%)',
                      boxShadow: '0 25px 50px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,255,255,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
                    }}
                    onMouseLeave={() => {
                      setCoursesDropdownOpen(false);
                      closeSubDropdowns();
                    }}
                  >
                    <div className="py-3" role="menu" aria-orientation="vertical">
                      {/* All Courses Link */}
                      <Link
                        to="/courses"
                        className="block px-4 py-3 text-white font-medium hover:bg-gradient-to-r hover:from-neon-cyan/20 hover:to-neon-blue/10 hover:text-neon-cyan transition-all duration-200 rounded-lg mx-2 group"
                        role="menuitem"
                        onClick={() => {
                          setCoursesDropdownOpen(false);
                          closeSubDropdowns();
                        }}
                      >
                        <div className="flex items-center">
                          <BookOpen className="h-5 w-5 mr-3 text-neon-cyan" />
                          <div>
                            <div className="font-semibold">All Courses</div>
                            <div className="text-xs text-cyan-300/70 group-hover:text-neon-cyan/80">Browse our complete catalog</div>
                          </div>
                        </div>
                      </Link>

                      <div className="my-2 mx-4 border-t border-white/10"></div>

                      {/* Premium Courses with Sub-dropdown */}
                      <div className="relative">
                        <div
                          className="flex items-center justify-between px-4 py-3 text-cyan-100 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-violet-500/10 hover:text-purple-400 transition-all duration-200 rounded-lg mx-2 group cursor-pointer"
                          onMouseEnter={() => setPremiumDropdownOpen(true)}
                          onMouseLeave={() => setPremiumDropdownOpen(false)}
                        >
                          <Link
                            to="/courses?type=premium"
                            className="flex items-center flex-1"
                            onClick={() => {
                              setCoursesDropdownOpen(false);
                              closeSubDropdowns();
                            }}
                          >
                            <Gem className="h-5 w-5 mr-3 text-purple-400" />
                            <div>
                              <div className="font-medium">Premium Courses</div>
                              <div className="text-xs text-cyan-300/70 group-hover:text-purple-400/80">Advanced professional programs</div>
                            </div>
                          </Link>
                          <ChevronRight className="h-4 w-4 text-purple-400" />
                        </div>

                        {/* Premium Courses Sub-dropdown */}
                        <div
                          className={`absolute left-full top-0 ml-2 w-80 max-h-96 rounded-xl shadow-2xl backdrop-blur-2xl backdrop-saturate-200 ring-1 ring-white/20 z-[96] transition-all duration-300 transform origin-top-left overflow-hidden ${
                            premiumDropdownOpen
                              ? 'opacity-100 visible scale-100 translate-x-0'
                              : 'opacity-0 invisible scale-95 -translate-x-2'
                          }`}
                          style={{
                            background: 'linear-gradient(135deg, rgba(15,15,26,0.95) 0%, rgba(15,15,26,0.98) 100%)',
                            boxShadow: '0 25px 50px rgba(0,0,0,0.25), 0 0 0 1px rgba(147,51,234,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                          }}
                          onMouseEnter={() => setPremiumDropdownOpen(true)}
                          onMouseLeave={() => setPremiumDropdownOpen(false)}
                        >
                          <div className="py-3">
                            <div className="px-4 py-2 border-b border-purple-400/20 mb-2 bg-purple-500/5">
                              <h4 className="text-purple-400 font-semibold text-sm">Premium Courses</h4>
                              <p className="text-purple-300/60 text-xs">Professional certification programs ({getPremiumCourses().length} courses)</p>
                            </div>
                            <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400/30 scrollbar-track-transparent">
                              {getPremiumCourses().map((course) => (
                                <Link
                                  key={course.courseId}
                                  to={`/courses/${course.courseId}`}
                                  className="block px-4 py-3 text-cyan-100 hover:bg-purple-500/20 hover:text-purple-300 transition-all duration-200 rounded-lg mx-2 group"
                                  onClick={() => {
                                    setCoursesDropdownOpen(false);
                                    closeSubDropdowns();
                                  }}
                                >
                                  <div className="flex items-center">
                                    {getCourseIcon(course.category)}
                                    <div className="ml-3 flex-1">
                                      <div className="font-medium text-sm leading-tight">{course.courseDisplayName}</div>
                                      <div className="text-xs text-purple-300/60 group-hover:text-purple-300/80 flex items-center justify-between mt-1">
                                        <span>{course.category}</span>
                                        <span className="font-bold text-purple-400">₹{course.price}</span>
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Foundation Courses with Sub-dropdown */}
                      <div className="relative">
                        <div
                          className="flex items-center justify-between px-4 py-3 text-cyan-100 hover:bg-gradient-to-r hover:from-yellow-500/20 hover:to-orange-500/10 hover:text-yellow-400 transition-all duration-200 rounded-lg mx-2 group cursor-pointer"
                          onMouseEnter={() => setFoundationDropdownOpen(true)}
                          onMouseLeave={() => setFoundationDropdownOpen(false)}
                        >
                          <Link
                            to="/courses?type=foundation"
                            className="flex items-center flex-1"
                            onClick={() => {
                              setCoursesDropdownOpen(false);
                              closeSubDropdowns();
                            }}
                          >
                            <Target className="h-5 w-5 mr-3 text-yellow-400" />
                            <div>
                              <div className="font-medium">Foundation Courses</div>
                              <div className="text-xs text-cyan-300/70 group-hover:text-yellow-400/80">Build your fundamentals</div>
                            </div>
                          </Link>
                          <ChevronRight className="h-4 w-4 text-yellow-400" />
                        </div>

                        {/* Foundation Courses Sub-dropdown */}
                        <div
                          className={`absolute left-full top-0 ml-2 w-80 max-h-96 rounded-xl shadow-2xl backdrop-blur-2xl backdrop-saturate-200 ring-1 ring-white/20 z-[96] transition-all duration-300 transform origin-top-left overflow-hidden ${
                            foundationDropdownOpen
                              ? 'opacity-100 visible scale-100 translate-x-0'
                              : 'opacity-0 invisible scale-95 -translate-x-2'
                          }`}
                          style={{
                            background: 'linear-gradient(135deg, rgba(15,15,26,0.95) 0%, rgba(15,15,26,0.98) 100%)',
                            boxShadow: '0 25px 50px rgba(0,0,0,0.25), 0 0 0 1px rgba(234,179,8,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                          }}
                          onMouseEnter={() => setFoundationDropdownOpen(true)}
                          onMouseLeave={() => setFoundationDropdownOpen(false)}
                        >
                          <div className="py-3">
                            <div className="px-4 py-2 border-b border-yellow-400/20 mb-2 bg-yellow-500/5">
                              <h4 className="text-yellow-400 font-semibold text-sm">Foundation Courses</h4>
                              <p className="text-yellow-300/60 text-xs">Essential skills for beginners ({getFoundationCourses().length} courses)</p>
                            </div>
                            <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-400/30 scrollbar-track-transparent">
                              {getFoundationCourses().map((course) => (
                                <Link
                                  key={course.courseId}
                                  to={`/courses/${course.courseId}`}
                                  className="block px-4 py-3 text-cyan-100 hover:bg-yellow-500/20 hover:text-yellow-300 transition-all duration-200 rounded-lg mx-2 group"
                                  onClick={() => {
                                    setCoursesDropdownOpen(false);
                                    closeSubDropdowns();
                                  }}
                                >
                                  <div className="flex items-center">
                                    {getCourseIcon(course.category)}
                                    <div className="ml-3 flex-1">
                                      <div className="font-medium text-sm leading-tight">{course.courseDisplayName}</div>
                                      <div className="text-xs text-yellow-300/60 group-hover:text-yellow-300/80 flex items-center justify-between mt-1">
                                        <span>{course.category}</span>
                                        <span className="font-bold text-yellow-400">₹{course.price}</span>
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Free Courses with Sub-dropdown */}
                      <div className="relative">
                        <div
                          className="flex items-center justify-between px-4 py-3 text-cyan-100 hover:bg-gradient-to-r hover:from-green-500/20 hover:to-emerald-500/10 hover:text-green-400 transition-all duration-200 rounded-lg mx-2 group cursor-pointer"
                          onMouseEnter={() => setFreeDropdownOpen(true)}
                          onMouseLeave={() => setFreeDropdownOpen(false)}
                        >
                          <Link
                            to="/courses?type=free"
                            className="flex items-center flex-1"
                            onClick={() => {
                              setCoursesDropdownOpen(false);
                              closeSubDropdowns();
                            }}
                          >
                            <Rocket className="h-5 w-5 mr-3 text-green-400" />
                            <div>
                              <div className="font-medium">Free Courses</div>
                              <div className="text-xs text-cyan-300/70 group-hover:text-green-400/80">Start learning today</div>
                            </div>
                          </Link>
                          <ChevronRight className="h-4 w-4 text-green-400" />
                        </div>

                        {/* Free Courses Sub-dropdown */}
                        <div
                          className={`absolute left-full top-0 ml-2 w-80 max-h-96 rounded-xl shadow-2xl backdrop-blur-2xl backdrop-saturate-200 ring-1 ring-white/20 z-[96] transition-all duration-300 transform origin-top-left overflow-hidden ${
                            freeDropdownOpen
                              ? 'opacity-100 visible scale-100 translate-x-0'
                              : 'opacity-0 invisible scale-95 -translate-x-2'
                          }`}
                          style={{
                            background: 'linear-gradient(135deg, rgba(15,15,26,0.95) 0%, rgba(15,15,26,0.98) 100%)',
                            boxShadow: '0 25px 50px rgba(0,0,0,0.25), 0 0 0 1px rgba(34,197,94,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                          }}
                          onMouseEnter={() => setFreeDropdownOpen(true)}
                          onMouseLeave={() => setFreeDropdownOpen(false)}
                        >
                          <div className="py-3">
                            <div className="px-4 py-2 border-b border-green-400/20 mb-2 bg-green-500/5">
                              <h4 className="text-green-400 font-semibold text-sm">Free Courses</h4>
                              <p className="text-green-300/60 text-xs">Start your learning journey ({getFreeCourses().length} courses)</p>
                            </div>
                            <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-green-400/30 scrollbar-track-transparent">
                              {getFreeCourses().map((course) => (
                                <Link
                                  key={course.courseId}
                                  to={`/courses/${course.courseId}`}
                                  className="block px-4 py-3 text-cyan-100 hover:bg-green-500/20 hover:text-green-300 transition-all duration-200 rounded-lg mx-2 group"
                                  onClick={() => {
                                    setCoursesDropdownOpen(false);
                                    closeSubDropdowns();
                                  }}
                                >
                                  <div className="flex items-center">
                                    {getCourseIcon(course.category)}
                                    <div className="ml-3 flex-1">
                                      <div className="font-medium text-sm leading-tight">{course.courseDisplayName}</div>
                                      <div className="text-xs text-green-300/60 group-hover:text-green-300/80 flex items-center justify-between mt-1">
                                        <span>{course.category}</span>
                                        <span className="font-bold text-green-400">Free</span>
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>


                    </div>
                  </div>
                </div>
                {/* Blog link with hover animation */}
                <Link to="/blog" className="group relative px-3 py-2 text-white hover:text-neon-magenta transition-all duration-300 transform hover:scale-105">
                  <span className="relative z-10">Blog</span>
                  <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div>
                </Link>

                {/* About link with hover animation */}
                <Link to="/about" className="group relative px-3 py-2 text-white hover:text-neon-cyan transition-all duration-300 transform hover:scale-105">
                  <span className="relative z-10">About</span>
                  <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div>
                </Link>

                {/* Contact link with hover animation */}
                <Link to="/contact" className="group relative px-3 py-2 text-white hover:text-neon-cyan transition-all duration-300 transform hover:scale-105">
                  <span className="relative z-10">Contact</span>
                  <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div>
                </Link>
              </div>
            </div>

            {/* Tablet-specific navigation (md screens only) */}
            <div className="hidden md:block lg:hidden ml-10">
              <div className="flex items-center space-x-4">
                <div className="relative" ref={coursesDropdownRef}>
                  <button
                    onClick={() => setCoursesDropdownOpen(!coursesDropdownOpen)}
                    className="group relative px-3 py-2 text-white hover:text-neon-cyan transition-all duration-300 transform hover:scale-105 flex items-center"
                  >
                    <span className="relative z-10 text-sm">Courses</span>
                    <ChevronDown className={`ml-1 w-3 h-3 transition-all duration-300 ${coursesDropdownOpen ? 'rotate-180 text-neon-cyan' : 'rotate-0'}`} />
                    <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div>
                  </button>

                  {/* Tablet dropdown - more compact */}
                  <div
                    className={`absolute left-0 mt-2 w-56 rounded-lg shadow-2xl backdrop-blur-xl ring-1 ring-white/20 z-[95] transition-all duration-300 transform origin-top ${
                      coursesDropdownOpen
                        ? 'opacity-100 visible scale-100 translate-y-0'
                        : 'opacity-0 invisible scale-95 -translate-y-2'
                    }`}
                    style={{
                      background: 'linear-gradient(135deg, rgba(15,15,26,0.92) 0%, rgba(15,15,26,0.96) 100%)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,255,255,0.15)'
                    }}
                  >
                    <div className="py-2">
                      <Link
                        to="/courses"
                        className="flex items-center px-3 py-2 text-white text-sm hover:bg-neon-cyan/20 hover:text-neon-cyan transition-all duration-200 rounded mx-2"
                        onClick={() => {
                          setCoursesDropdownOpen(false);
                          closeSubDropdowns();
                        }}
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        All Courses
                      </Link>
                      <div className="my-1 mx-3 border-t border-white/10"></div>
                      <Link
                        to="/courses?type=premium"
                        className="flex items-center px-3 py-2 text-cyan-100 text-sm hover:bg-purple-500/20 hover:text-purple-400 transition-all duration-200 rounded mx-2"
                        onClick={() => {
                          setCoursesDropdownOpen(false);
                          closeSubDropdowns();
                        }}
                      >
                        <Gem className="h-4 w-4 mr-2" />
                        Premium Courses
                      </Link>
                      <Link
                        to="/courses?type=foundation"
                        className="flex items-center px-3 py-2 text-cyan-100 text-sm hover:bg-yellow-500/20 hover:text-yellow-400 transition-all duration-200 rounded mx-2"
                        onClick={() => {
                          setCoursesDropdownOpen(false);
                          closeSubDropdowns();
                        }}
                      >
                        <Target className="h-4 w-4 mr-2" />
                        Foundation Courses
                      </Link>
                      <Link
                        to="/courses?type=free"
                        className="flex items-center px-3 py-2 text-cyan-100 text-sm hover:bg-green-500/20 hover:text-green-400 transition-all duration-200 rounded mx-2"
                        onClick={() => {
                          setCoursesDropdownOpen(false);
                          closeSubDropdowns();
                        }}
                      >
                        <Rocket className="h-4 w-4 mr-2" />
                        Free Courses
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Blog link for tablet */}
                <Link to="/blog" className="group relative px-3 py-2 text-white hover:text-neon-magenta transition-all duration-300 transform hover:scale-105">
                  <span className="relative z-10 text-sm">Blog</span>
                  <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div>
                </Link>

                {/* About link for tablet */}
                <Link to="/about" className="group relative px-3 py-2 text-white hover:text-neon-cyan transition-all duration-300 transform hover:scale-105">
                  <span className="relative z-10 text-sm">About</span>
                  <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div>
                </Link>

                {/* Contact link for tablet */}
                <Link to="/contact" className="group relative px-3 py-2 text-white hover:text-neon-cyan transition-all duration-300 transform hover:scale-105">
                  <span className="relative z-10 text-sm">Contact</span>
                  <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div>
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={toggleSearch}
              className="p-2 rounded-full text-white hover:text-neon-cyan transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('🔄 User menu button clicked (desktop), current state:', userMenuOpen);
                    setUserMenuOpen(!userMenuOpen);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 text-white hover:text-neon-cyan transition-colors"
                >
                  {(user?.avatar || user?.originalAvatar) ? (
                    <img
                      src={user.avatar || user.originalAvatar || ''}
                      alt={user.name || 'User'}
                      className="w-8 h-8 rounded-full object-cover border-2 border-neon-cyan/30"
                      onError={(e) => {
                        // Fallback to icon if image fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-8 h-8 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-full flex items-center justify-center ${(user?.avatar || user?.originalAvatar) ? 'hidden' : ''}`}>
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm">{user?.name || 'User'}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-xl shadow-2xl bg-white/10 backdrop-blur-2xl backdrop-saturate-200 ring-1 ring-white/20 z-[95]"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('🔄 Dropdown clicked, preventing close');
                    }}
                  >
                    <div className="py-2">
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-cyan-100 hover:bg-white/10 hover:text-neon-cyan transition-all duration-200 rounded-lg mx-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('🔄 Home link clicked');
                          setUserMenuOpen(false);
                        }}
                      >
                        Home
                      </Link>
                      <Link
                        to="/lms"
                        className="block px-4 py-2 text-sm text-cyan-100 hover:bg-white/10 hover:text-neon-magenta transition-all duration-200 rounded-lg mx-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('🔄 LMS link clicked');
                          setUserMenuOpen(false);
                        }}
                      >
                        LMS
                      </Link>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-cyan-100 hover:bg-white/10 hover:text-neon-cyan transition-all duration-200 rounded-lg mx-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('🔄 Profile link clicked');
                          setUserMenuOpen(false);
                        }}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-cyan-100 hover:bg-white/10 hover:text-neon-magenta transition-all duration-200 rounded-lg mx-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('🔄 Settings link clicked');
                          setUserMenuOpen(false);
                        }}
                      >
                        Settings
                      </Link>
                      <hr className="my-2 border-white/10" />
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          console.log('🔄 Logout button clicked (desktop)');
                          try {
                            setUserMenuOpen(false); // Close dropdown first
                            await logout();
                            console.log('✅ Logout completed successfully');
                          } catch (error) {
                            console.error('❌ Logout failed:', error);
                          }
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all duration-200 rounded-lg mx-2 flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="px-4 py-2 text-neon-cyan/90 hover:text-neon-cyan border border-neon-cyan/30 hover:border-neon-cyan/60 rounded-lg transition-all duration-300 hover:bg-neon-cyan/10 font-medium"
                  style={{boxShadow: '0 0 10px rgba(0,255,255,0.2)'}}
                >
                  Log in
                </Link>
                <Link to="/auth?signup=true" className="px-4 py-2 bg-gradient-to-r from-magenta-600 to-neon-magenta text-white rounded-md hover:from-magenta-500 hover:to-magenta-400 transition-colors" style={{boxShadow: '0 0 10px rgba(255,0,255,0.4)'}}>
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Tablet-specific right side (md screens only) */}
          <div className="hidden md:flex lg:hidden items-center space-x-3">
            <button
              onClick={toggleSearch}
              className="p-2 rounded-full text-white hover:text-neon-cyan transition-colors"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-2 py-1 text-white hover:text-neon-cyan transition-colors"
                >
                  {(user?.avatar || user?.originalAvatar) ? (
                    <img
                      src={user.avatar || user.originalAvatar || ''}
                      alt={user.name || 'User'}
                      className="w-7 h-7 rounded-full object-cover border-2 border-neon-cyan/30"
                      onError={(e) => {
                        // Fallback to icon if image fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-7 h-7 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-full flex items-center justify-center ${(user?.avatar || user?.originalAvatar) ? 'hidden' : ''}`}>
                    <User className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-xs">{user?.name || 'User'}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-lg shadow-2xl bg-white/10 backdrop-blur-xl ring-1 ring-white/20 z-[95]"
                       style={{
                         background: 'linear-gradient(135deg, rgba(15,15,26,0.92) 0%, rgba(15,15,26,0.96) 100%)',
                         boxShadow: '0 20px 40px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,255,255,0.15)'
                       }}>
                    <div className="py-2">
                      <Link to="/dashboard" className="block px-3 py-2 text-xs text-cyan-100 hover:bg-white/10 hover:text-neon-cyan transition-all duration-200 rounded mx-2">
                        Home
                      </Link>
                      <Link to="/lms" className="block px-3 py-2 text-xs text-cyan-100 hover:bg-white/10 hover:text-neon-magenta transition-all duration-200 rounded mx-2">
                        LMS
                      </Link>
                      <Link to="/profile" className="block px-3 py-2 text-xs text-cyan-100 hover:bg-white/10 hover:text-neon-blue transition-all duration-200 rounded mx-2">
                        Profile
                      </Link>
                      <Link to="/settings" className="block px-3 py-2 text-xs text-cyan-100 hover:bg-white/10 hover:text-neon-purple transition-all duration-200 rounded mx-2">
                        Settings
                      </Link>
                      <hr className="my-1 border-white/10" />
                      <button
                        onClick={async () => {
                          console.log('🔄 Logout button clicked (tablet)');
                          try {
                            setUserMenuOpen(false);
                            await logout();
                            console.log('✅ Logout completed successfully');
                          } catch (error) {
                            console.error('❌ Logout failed:', error);
                          }
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all duration-200 rounded mx-2 flex items-center space-x-2"
                      >
                        <LogOut className="h-3 w-3" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="px-3 py-1 text-neon-cyan/90 hover:text-neon-cyan border border-neon-cyan/30 hover:border-neon-cyan/60 rounded-md transition-all duration-300 hover:bg-neon-cyan/10 font-medium text-sm"
                  style={{boxShadow: '0 0 8px rgba(0,255,255,0.2)'}}
                >
                  Log in
                </Link>
                <Link to="/auth?signup=true" className="px-3 py-1 bg-gradient-to-r from-magenta-600 to-neon-magenta text-white rounded text-sm hover:from-magenta-500 hover:to-magenta-400 transition-colors" style={{boxShadow: '0 0 8px rgba(255,0,255,0.3)'}}>
                  Sign up
                </Link>
              </>
            )}
          </div>

          <div className="flex md:hidden items-center space-x-1">
            {/* Mobile search button */}
            <button
              onClick={toggleSearch}
              className="p-3 rounded-xl text-white hover:text-neon-cyan hover:bg-white/10 transition-all duration-200 active:scale-95"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Mobile user menu for authenticated users */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('🔄 Mobile user menu button clicked, current state:', userMenuOpen);
                    setUserMenuOpen(!userMenuOpen);
                  }}
                  className="p-2 rounded-xl text-white hover:text-neon-cyan hover:bg-white/10 transition-all duration-200 active:scale-95"
                  aria-label="User menu"
                >
                  {(user?.avatar || user?.originalAvatar) ? (
                    <img
                      src={user.avatar || user.originalAvatar || ''}
                      alt={user.name || 'User'}
                      className="w-7 h-7 rounded-full object-cover border-2 border-neon-cyan/30"
                      onError={(e) => {
                        // Fallback to icon if image fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-7 h-7 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-full flex items-center justify-center ${(user?.avatar || user?.originalAvatar) ? 'hidden' : ''}`}>
                    <User className="h-4 w-4 text-white" />
                  </div>
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-48 rounded-xl shadow-2xl bg-white/10 backdrop-blur-2xl backdrop-saturate-200 ring-1 ring-white/20 z-[95]"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('🔄 Mobile dropdown clicked, preventing close');
                    }}
                  >
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-white/10">
                        <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                        <p className="text-xs text-cyan-200/60 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-3 text-sm text-cyan-100 hover:bg-white/10 hover:text-neon-cyan transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('🔄 Home link clicked (mobile)');
                          setUserMenuOpen(false);
                        }}
                      >
                        🏠 Home
                      </Link>
                      <Link
                        to="/lms"
                        className="block px-4 py-3 text-sm text-cyan-100 hover:bg-white/10 hover:text-neon-magenta transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('🔄 LMS link clicked (mobile)');
                          setUserMenuOpen(false);
                        }}
                      >
                        📚 LMS
                      </Link>
                      <Link
                        to="/profile"
                        className="block px-4 py-3 text-sm text-cyan-100 hover:bg-white/10 hover:text-neon-cyan transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('🔄 Profile link clicked (mobile)');
                          setUserMenuOpen(false);
                        }}
                      >
                        👤 Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-3 text-sm text-cyan-100 hover:bg-white/10 hover:text-neon-magenta transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('🔄 Settings link clicked (mobile)');
                          setUserMenuOpen(false);
                        }}
                      >
                        ⚙️ Settings
                      </Link>
                      <hr className="my-2 border-white/10" />
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          console.log('🔄 Logout button clicked (mobile dropdown)');
                          try {
                            setUserMenuOpen(false);
                            await logout();
                            console.log('✅ Logout completed successfully');
                          } catch (error) {
                            console.error('❌ Logout failed:', error);
                          }
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all duration-200 flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile hamburger menu */}
            <button
              onClick={toggleMenu}
              className="p-3 rounded-xl text-white hover:text-neon-cyan hover:bg-white/10 transition-all duration-200 active:scale-95"
              aria-expanded={isOpen}
              aria-label="Toggle main menu"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Enhanced Mobile menu with better organization */}
      <div className={`md:hidden transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="mx-3 mt-2 rounded-2xl overflow-hidden"
             style={{
               background: 'linear-gradient(135deg, rgba(15,15,26,0.95) 0%, rgba(15,15,26,0.98) 100%)',
               backdropFilter: 'blur(25px) saturate(180%)',
               WebkitBackdropFilter: 'blur(25px) saturate(180%)',
               boxShadow: '0 25px 50px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,255,255,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
               border: '1px solid rgba(0,255,255,0.1)'
             }}>
          <div className="px-4 pt-6 pb-4 space-y-2">
            {/* Mobile Navigation Header */}
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta">
                Navigation Menu
              </h3>
              <div className="w-16 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-magenta mx-auto mt-2 rounded-full"></div>
            </div>

            {/* Enhanced Mobile Courses Section */}
            <div className="space-y-2">
              <button
                onClick={() => setCoursesDropdownOpen(!coursesDropdownOpen)}
                className="flex items-center justify-between w-full px-5 py-4 text-white font-semibold bg-gradient-to-r from-neon-cyan/10 to-neon-blue/5 border border-neon-cyan/20 hover:from-neon-cyan/20 hover:to-neon-blue/10 hover:text-neon-cyan rounded-xl transition-all duration-300 active:scale-98"
                style={{boxShadow: '0 4px 15px rgba(0,255,255,0.1)'}}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 rounded-lg flex items-center justify-center mr-4">
                    <GraduationCap className="h-5 w-5 text-neon-cyan" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Courses</div>
                    <div className="text-xs text-cyan-300/70">Explore our programs</div>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 transition-all duration-300 ${coursesDropdownOpen ? 'rotate-180 text-neon-cyan' : 'rotate-0 text-cyan-300'}`} />
              </button>

              {/* Mobile Course Categories - Enhanced Collapsible */}
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${coursesDropdownOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="ml-6 mr-2 space-y-2 pt-2 pb-3">
                  <Link
                    to="/courses"
                    onClick={() => {
                      setIsOpen(false);
                      setCoursesDropdownOpen(false);
                    }}
                    className="flex items-center px-4 py-3 text-white text-sm bg-gradient-to-r from-neon-cyan/15 to-neon-blue/10 border border-neon-cyan/30 hover:from-neon-cyan/25 hover:to-neon-blue/15 hover:text-neon-cyan rounded-lg transition-all duration-200 active:scale-98"
                    style={{boxShadow: '0 2px 10px rgba(0,255,255,0.15)'}}
                  >
                    <div className="w-8 h-8 bg-neon-cyan/20 rounded-lg flex items-center justify-center mr-3">
                      <BookOpen className="h-4 w-4 text-neon-cyan" />
                    </div>
                    <div>
                      <div className="font-semibold">All Courses</div>
                      <div className="text-xs text-cyan-300/80">Complete catalog</div>
                    </div>
                  </Link>

                  <Link
                    to="/courses?type=premium"
                    onClick={() => {
                      setIsOpen(false);
                      setCoursesDropdownOpen(false);
                    }}
                    className="flex items-center px-4 py-3 text-cyan-200 text-sm hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-violet-500/5 hover:text-purple-400 rounded-lg transition-all duration-200 active:scale-98"
                  >
                    <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center mr-3">
                      <Gem className="h-4 w-4 text-purple-400" />
                    </div>
                    <div>
                      <div className="font-medium">Premium Courses</div>
                      <div className="text-xs text-cyan-300/70">Professional programs</div>
                    </div>
                  </Link>

                  <Link
                    to="/courses?type=foundation"
                    onClick={() => {
                      setIsOpen(false);
                      setCoursesDropdownOpen(false);
                    }}
                    className="flex items-center px-4 py-3 text-cyan-200 text-sm hover:bg-gradient-to-r hover:from-yellow-500/10 hover:to-orange-500/5 hover:text-yellow-400 rounded-lg transition-all duration-200 active:scale-98"
                  >
                    <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex items-center justify-center mr-3">
                      <Target className="h-4 w-4 text-yellow-400" />
                    </div>
                    <div>
                      <div className="font-medium">Foundation Courses</div>
                      <div className="text-xs text-cyan-300/70">Build fundamentals</div>
                    </div>
                  </Link>

                  <Link
                    to="/courses?type=free"
                    onClick={() => {
                      setIsOpen(false);
                      setCoursesDropdownOpen(false);
                    }}
                    className="flex items-center px-4 py-3 text-cyan-200 text-sm hover:bg-gradient-to-r hover:from-green-500/10 hover:to-emerald-500/5 hover:text-green-400 rounded-lg transition-all duration-200 active:scale-98"
                  >
                    <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center mr-3">
                      <Rocket className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <div className="font-medium">Free Courses</div>
                      <div className="text-xs text-cyan-300/70">Start learning today</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Other Navigation Items */}
            <div className="space-y-2">
              <Link
                to="/blog"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-5 py-4 text-white font-medium bg-gradient-to-r from-white/5 to-white/10 border border-white/10 hover:from-neon-magenta/10 hover:to-neon-pink/5 hover:text-neon-magenta rounded-xl transition-all duration-300 active:scale-98"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-neon-magenta/10 to-neon-pink/10 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-xl">📝</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold">Blog</div>
                  <div className="text-xs text-cyan-300/70">Latest insights</div>
                </div>
              </Link>

              <Link
                to="/about"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-5 py-4 text-white font-medium bg-gradient-to-r from-white/5 to-white/10 border border-white/10 hover:from-neon-cyan/10 hover:to-neon-blue/5 hover:text-neon-cyan rounded-xl transition-all duration-300 active:scale-98"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-neon-cyan/10 to-neon-blue/10 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-xl">ℹ️</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold">About</div>
                  <div className="text-xs text-cyan-300/70">Learn about us</div>
                </div>
              </Link>

              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-5 py-4 text-white font-medium bg-gradient-to-r from-white/5 to-white/10 border border-white/10 hover:from-neon-magenta/10 hover:to-neon-pink/5 hover:text-neon-magenta rounded-xl transition-all duration-300 active:scale-98"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-neon-magenta/10 to-neon-pink/10 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-xl">📞</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold">Contact</div>
                  <div className="text-xs text-cyan-300/70">Get in touch</div>
                </div>
              </Link>
            </div>
            {/* Enhanced Mobile Auth Section */}
            <div className="pt-6 pb-3 mt-6 border-t border-gradient-to-r from-neon-cyan/20 to-neon-magenta/20">
              {isAuthenticated ? (
                <div className="space-y-4">
                  {/* Enhanced User info in mobile menu */}
                  <div className="flex items-center px-5 py-4 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-xl">
                    {(user?.avatar || user?.originalAvatar) ? (
                      <img
                        src={user.avatar || user.originalAvatar || ''}
                        alt={user.name || 'User'}
                        className="w-12 h-12 rounded-full object-cover border-2 border-neon-cyan/30 mr-4 shadow-lg"
                        onError={(e) => {
                          // Fallback to icon if image fails to load
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-12 h-12 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-full flex items-center justify-center mr-4 shadow-lg ${(user?.avatar || user?.originalAvatar) ? 'hidden' : ''}`}>
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
                      <p className="text-xs text-cyan-300/80 truncate">{user?.email}</p>
                    </div>
                  </div>

                  {/* Enhanced Quick Dashboard access */}
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center w-full px-5 py-4 text-white font-semibold bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 border border-neon-cyan/30 rounded-xl hover:from-neon-cyan/30 hover:to-neon-blue/30 transition-all duration-300 active:scale-98"
                    style={{boxShadow: '0 4px 15px rgba(0,255,255,0.15)'}}
                  >
                    <div className="w-10 h-10 bg-neon-cyan/20 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-xl">🏠</span>
                    </div>
                    <span className="flex-1 text-left">Go to Dashboard</span>
                  </Link>

                  <button
                    onClick={async () => {
                      console.log('🔄 Logout button clicked (mobile menu)');
                      try {
                        setIsOpen(false);
                        await logout();
                        console.log('✅ Logout completed successfully');
                      } catch (error) {
                        console.error('❌ Logout failed:', error);
                      }
                    }}
                    className="flex items-center w-full px-5 py-4 text-red-300 font-medium border border-red-500/30 rounded-xl hover:bg-red-500/10 hover:text-red-200 transition-all duration-300 active:scale-98"
                  >
                    <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center mr-4">
                      <LogOut className="h-5 w-5" />
                    </div>
                    <span className="flex-1 text-left">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h4 className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta">
                      Join Our Community
                    </h4>
                    <div className="w-20 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-magenta mx-auto mt-2 rounded-full"></div>
                  </div>

                  <Link
                    to="/auth"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center w-full px-6 py-4 text-neon-cyan font-semibold bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 border border-neon-cyan/40 hover:from-neon-cyan/30 hover:to-neon-blue/30 hover:text-white hover:border-neon-cyan/60 rounded-xl transition-all duration-300 active:scale-98"
                    style={{boxShadow: '0 4px 20px rgba(0,255,255,0.25)'}}
                  >
                    <div className="w-8 h-8 bg-neon-cyan/30 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-lg">🔑</span>
                    </div>
                    <span>Log in</span>
                  </Link>

                  <Link
                    to="/auth?signup=true"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center w-full px-6 py-4 text-white font-bold bg-gradient-to-r from-neon-magenta to-neon-pink hover:from-neon-magenta/90 hover:to-neon-pink/90 rounded-xl transition-all duration-300 active:scale-98"
                    style={{boxShadow: '0 6px 20px rgba(255,0,119,0.3)'}}
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-lg">✨</span>
                    </div>
                    <span>Sign up</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search overlay with dynamic results */}
      {searchOpen && (
        <div
          ref={searchRef}
          className="absolute top-full left-0 w-full z-[105] shadow-2xl mt-2"
          style={{
            background: 'linear-gradient(135deg, rgba(15,15,26,0.98) 0%, rgba(15,15,26,0.99) 100%)',
            backdropFilter: 'blur(25px) saturate(180%)',
            WebkitBackdropFilter: 'blur(25px) saturate(180%)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,255,255,0.2)',
            borderTop: '2px solid rgba(0,255,255,0.3)',
            borderRadius: '0 0 16px 16px'
          }}
        >
          <div className="max-w-4xl mx-auto p-3 sm:p-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, instructors, topics..."
                className="w-full p-3 sm:p-5 pl-12 sm:pl-14 pr-12 sm:pr-16 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan text-white placeholder-cyan-300/70 text-sm sm:text-lg transition-all duration-200"
                style={{
                  backdropFilter: 'blur(10px)',
                  boxShadow: 'inset 0 0 20px rgba(0,255,255,0.1)',
                  letterSpacing: '0.025em',
                }}
                autoFocus
              />
              <Search className="absolute left-3 sm:left-5 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
              {isSearching && (
                <div className="absolute right-10 sm:right-12 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-neon-cyan"></div>
                </div>
              )}
              <button
                onClick={toggleSearch}
                className="absolute right-3 sm:right-5 top-1/2 transform -translate-y-1/2 text-cyan-400 hover:text-neon-cyan transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            {/* Search Results */}
            {searchQuery && (
              <div className="mt-3 sm:mt-4 max-h-80 sm:max-h-96 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-cyan-200/60 text-xs sm:text-sm px-2">
                      {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                    </p>
                    {searchResults.map((result) => (
                      <Link
                        key={result.id}
                        to={result.type === 'course' ? `/courses/${result.id}` : `/blog/${result.id}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                        className="block p-3 sm:p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200 group active:scale-95"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0 mr-3">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-lg">
                                {result.type === 'course' ? '📚' : '📝'}
                              </span>
                              <h4 className="text-white font-medium group-hover:text-neon-cyan transition-colors text-sm sm:text-base truncate">
                                {result.title}
                              </h4>
                            </div>
                            <p className="text-cyan-200/60 text-xs sm:text-sm truncate">{result.category}</p>
                            {result.description && (
                              <p className="text-cyan-200/40 text-xs mt-1 line-clamp-2">{result.description}</p>
                            )}
                            {result.type === 'course' && result.price !== undefined && (
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  result.courseType === 'Free' ? 'bg-green-500/20 text-green-400' :
                                  result.courseType === 'Freemium' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-purple-500/20 text-purple-400'
                                }`}>
                                  {result.courseType}
                                </span>
                                <span className="text-neon-cyan text-xs font-bold">
                                  {result.price === 0 ? 'Free' : `₹${result.price}`}
                                </span>
                              </div>
                            )}
                          </div>
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium flex-shrink-0 ${
                            result.type === 'course' ? 'bg-neon-cyan/20 text-neon-cyan' :
                            'bg-neon-magenta/20 text-neon-magenta'
                          }`}>
                            {result.type}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : !isSearching && (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">🔍</div>
                    <p className="text-cyan-200/60">No results found for "{searchQuery}"</p>
                    <p className="text-cyan-200/40 text-sm mt-1">Try searching for courses, blogs, or topics</p>
                  </div>
                )}
              </div>
            )}

            {/* Quick suggestions when no query */}
            {!searchQuery && (
              <div className="mt-3 sm:mt-4">
                <p className="text-cyan-200/60 text-xs sm:text-sm mb-2 sm:mb-3 px-2">Popular searches:</p>
                <div className="flex flex-wrap gap-2">
                  {['Machine Learning', 'Data Science', 'Python', 'Generative AI', 'MLOps', 'Free Courses', 'Premium Courses'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-3 py-2 bg-white/10 hover:bg-neon-cyan/20 text-cyan-200 hover:text-neon-cyan rounded-lg text-xs sm:text-sm transition-all duration-200 active:scale-95"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;