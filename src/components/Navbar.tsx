import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo.tsx';

interface SearchResult {
  id: string;
  title: string;
  category: string;
  type: 'course' | 'instructor' | 'topic';
}

// Mock search data - In real app, this would come from API
const mockSearchData: SearchResult[] = [
  { id: '1', title: 'Introduction to Data Science', category: 'Data Science', type: 'course' },
  { id: '2', title: 'Machine Learning Fundamentals', category: 'AI & ML', type: 'course' },
  { id: '3', title: 'Deep Learning with Python', category: 'AI & ML', type: 'course' },
  { id: '4', title: 'Data Visualization', category: 'Data Science', type: 'course' },
  { id: '5', title: 'Generative AI Basics', category: 'Generative AI', type: 'course' },
  { id: '6', title: 'Dr. Sarah Chen', category: 'AI Expert', type: 'instructor' },
  { id: '7', title: 'Neural Networks', category: 'AI & ML', type: 'topic' },
];

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
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const coursesDropdownRef = useRef<HTMLDivElement>(null);

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
      const filteredResults = mockSearchData.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredResults);
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
          !coursesDropdownRef.current.contains(event.target as Node) &&
          window.innerWidth >= 1024) { // lg breakpoint
        setCoursesDropdownOpen(false);
      }
    };

    if (coursesDropdownOpen && window.innerWidth >= 1024) {
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
    setUserMenuOpen(false);
    setIsOpen(false);
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
      <nav className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0" onClick={closeAllDropdowns}>
              <Logo size="sm" className="sm:hidden" />
              <Logo size="md" className="hidden sm:block" />
            </Link>
            <div className="hidden lg:block ml-10">
              <div className="flex items-center space-x-4">
                {/* Enhanced Courses dropdown with JavaScript control - Desktop Only */}
                <div className="relative" ref={coursesDropdownRef}>
                  <button
                    onClick={() => setCoursesDropdownOpen(!coursesDropdownOpen)}
                    onMouseEnter={() => setCoursesDropdownOpen(true)}
                    className="group relative px-3 py-2 text-white hover:text-neon-cyan transition-all duration-300 transform hover:scale-105 flex items-center"
                  >
                    <span className="relative z-10">Courses</span>
                    <ChevronDown className={`ml-1 w-4 h-4 transition-all duration-300 ${coursesDropdownOpen ? 'rotate-180 text-neon-cyan' : 'rotate-0'}`} />
                    {/* Hover background effect */}
                    <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div>
                  </button>

                  {/* Enhanced Dropdown menu with creative animations */}
                  <div
                    className={`absolute left-0 mt-2 w-64 rounded-xl shadow-2xl backdrop-blur-2xl backdrop-saturate-200 ring-1 ring-white/20 z-[95] transition-all duration-300 transform origin-top ${
                      coursesDropdownOpen
                        ? 'opacity-100 visible scale-100 translate-y-0'
                        : 'opacity-0 invisible scale-95 -translate-y-2'
                    }`}
                    style={{
                      background: 'linear-gradient(135deg, rgba(15,15,26,0.95) 0%, rgba(15,15,26,0.98) 100%)',
                      boxShadow: '0 25px 50px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,255,255,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
                    }}
                    onMouseLeave={() => setCoursesDropdownOpen(false)}
                  >
                    <div className="py-3" role="menu" aria-orientation="vertical">
                      {/* All Courses Link */}
                      <Link
                        to="/courses"
                        className="block px-4 py-3 text-white font-medium hover:bg-gradient-to-r hover:from-neon-cyan/20 hover:to-neon-blue/10 hover:text-neon-cyan transition-all duration-200 rounded-lg mx-2 group"
                        role="menuitem"
                        onClick={() => setCoursesDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <span className="text-lg mr-3">📚</span>
                          <div>
                            <div className="font-semibold">All Courses</div>
                            <div className="text-xs text-cyan-300/70 group-hover:text-neon-cyan/80">Browse our complete catalog</div>
                          </div>
                        </div>
                      </Link>

                      <div className="my-2 mx-4 border-t border-white/10"></div>

                      {/* Course Categories with enhanced styling */}
                      <Link
                        to="/courses?category=data-science"
                        className="block px-4 py-3 text-cyan-100 hover:bg-gradient-to-r hover:from-neon-cyan/20 hover:to-neon-blue/10 hover:text-neon-cyan transition-all duration-200 rounded-lg mx-2 group"
                        role="menuitem"
                        onClick={() => setCoursesDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <span className="text-lg mr-3">📊</span>
                          <div>
                            <div className="font-medium">Data Science</div>
                            <div className="text-xs text-cyan-300/70 group-hover:text-neon-cyan/80">Analytics, visualization & insights</div>
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/courses?category=ai-ml"
                        className="block px-4 py-3 text-cyan-100 hover:bg-gradient-to-r hover:from-neon-magenta/20 hover:to-neon-pink/10 hover:text-neon-magenta transition-all duration-200 rounded-lg mx-2 group"
                        role="menuitem"
                        onClick={() => setCoursesDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <span className="text-lg mr-3">🤖</span>
                          <div>
                            <div className="font-medium">AI & Machine Learning</div>
                            <div className="text-xs text-cyan-300/70 group-hover:text-neon-magenta/80">Build intelligent systems</div>
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/courses?category=generative-ai"
                        className="block px-4 py-3 text-cyan-100 hover:bg-gradient-to-r hover:from-neon-blue/20 hover:to-neon-purple/10 hover:text-neon-blue transition-all duration-200 rounded-lg mx-2 group"
                        role="menuitem"
                        onClick={() => setCoursesDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <span className="text-lg mr-3">✨</span>
                          <div>
                            <div className="font-medium">Generative AI</div>
                            <div className="text-xs text-cyan-300/70 group-hover:text-neon-blue/80">Create with AI models</div>
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/courses?category=python-data-science"
                        className="block px-4 py-3 text-cyan-100 hover:bg-gradient-to-r hover:from-green-500/20 hover:to-emerald-500/10 hover:text-green-400 transition-all duration-200 rounded-lg mx-2 group"
                        role="menuitem"
                        onClick={() => setCoursesDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <span className="text-lg mr-3">🐍</span>
                          <div>
                            <div className="font-medium">Python with Data Science</div>
                            <div className="text-xs text-cyan-300/70 group-hover:text-green-400/80">Python for data analysis</div>
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/courses?category=data-science-gen-ai"
                        className="block px-4 py-3 text-cyan-100 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-violet-500/10 hover:text-purple-400 transition-all duration-200 rounded-lg mx-2 group"
                        role="menuitem"
                        onClick={() => setCoursesDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <span className="text-lg mr-3">⚡</span>
                          <div>
                            <div className="font-medium">Data Science with Gen AI</div>
                            <div className="text-xs text-cyan-300/70 group-hover:text-purple-400/80">Advanced data science</div>
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/courses?category=ml-gen-ai"
                        className="block px-4 py-3 text-cyan-100 hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-500/10 hover:text-orange-400 transition-all duration-200 rounded-lg mx-2 group"
                        role="menuitem"
                        onClick={() => setCoursesDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <span className="text-lg mr-3">🔥</span>
                          <div>
                            <div className="font-medium">Complete ML with Gen AI</div>
                            <div className="text-xs text-cyan-300/70 group-hover:text-orange-400/80">Comprehensive ML course</div>
                          </div>
                        </div>
                      </Link>
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
                      <Link to="/courses" className="block px-3 py-2 text-white text-sm hover:bg-neon-cyan/20 hover:text-neon-cyan transition-all duration-200 rounded mx-2" onClick={() => setCoursesDropdownOpen(false)}>
                        📚 All Courses
                      </Link>
                      <div className="my-1 mx-3 border-t border-white/10"></div>
                      <Link to="/courses?category=data-science" className="block px-3 py-2 text-cyan-100 text-sm hover:bg-neon-cyan/20 hover:text-neon-cyan transition-all duration-200 rounded mx-2" onClick={() => setCoursesDropdownOpen(false)}>
                        📊 Data Science
                      </Link>
                      <Link to="/courses?category=ai-ml" className="block px-3 py-2 text-cyan-100 text-sm hover:bg-neon-magenta/20 hover:text-neon-magenta transition-all duration-200 rounded mx-2" onClick={() => setCoursesDropdownOpen(false)}>
                        🤖 AI & ML
                      </Link>
                      <Link to="/courses?category=generative-ai" className="block px-3 py-2 text-cyan-100 text-sm hover:bg-neon-blue/20 hover:text-neon-blue transition-all duration-200 rounded mx-2" onClick={() => setCoursesDropdownOpen(false)}>
                        ✨ Generative AI
                      </Link>
                      <Link to="/courses?category=python-data-science" className="block px-3 py-2 text-cyan-100 text-sm hover:bg-green-500/20 hover:text-green-400 transition-all duration-200 rounded mx-2" onClick={() => setCoursesDropdownOpen(false)}>
                        🐍 Python with Data Science
                      </Link>
                      <Link to="/courses?category=data-science-gen-ai" className="block px-3 py-2 text-cyan-100 text-sm hover:bg-purple-500/20 hover:text-purple-400 transition-all duration-200 rounded mx-2" onClick={() => setCoursesDropdownOpen(false)}>
                        ⚡ Data Science with Gen AI
                      </Link>
                      <Link to="/courses?category=ml-gen-ai" className="block px-3 py-2 text-cyan-100 text-sm hover:bg-orange-500/20 hover:text-orange-400 transition-all duration-200 rounded mx-2" onClick={() => setCoursesDropdownOpen(false)}>
                        🔥 Complete ML with Gen AI
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
                  <div className="w-8 h-8 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-full flex items-center justify-center">
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
                <Link to="/auth" className="px-4 py-2 text-white hover:text-neon-cyan transition-colors">
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
                  <div className="w-7 h-7 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-full flex items-center justify-center">
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
                <Link to="/auth" className="px-3 py-1 text-white hover:text-neon-cyan transition-colors text-sm">
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
                  <div className="w-7 h-7 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-full flex items-center justify-center">
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
                    <span className="text-xl">📚</span>
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
                      <span className="text-sm">🎯</span>
                    </div>
                    <div>
                      <div className="font-semibold">All Courses</div>
                      <div className="text-xs text-cyan-300/80">Complete catalog</div>
                    </div>
                  </Link>

                  <Link
                    to="/courses?category=data-science"
                    onClick={() => {
                      setIsOpen(false);
                      setCoursesDropdownOpen(false);
                    }}
                    className="flex items-center px-4 py-3 text-cyan-200 text-sm hover:bg-gradient-to-r hover:from-neon-cyan/10 hover:to-neon-blue/5 hover:text-neon-cyan rounded-lg transition-all duration-200 active:scale-98"
                  >
                    <div className="w-8 h-8 bg-neon-cyan/10 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-sm">📊</span>
                    </div>
                    <div>
                      <div className="font-medium">Data Science</div>
                      <div className="text-xs text-cyan-300/70">Analytics & insights</div>
                    </div>
                  </Link>

                  <Link
                    to="/courses?category=ai-ml"
                    onClick={() => {
                      setIsOpen(false);
                      setCoursesDropdownOpen(false);
                    }}
                    className="flex items-center px-4 py-3 text-cyan-200 text-sm hover:bg-gradient-to-r hover:from-neon-magenta/10 hover:to-neon-pink/5 hover:text-neon-magenta rounded-lg transition-all duration-200 active:scale-98"
                  >
                    <div className="w-8 h-8 bg-neon-magenta/10 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-sm">🤖</span>
                    </div>
                    <div>
                      <div className="font-medium">AI & Machine Learning</div>
                      <div className="text-xs text-cyan-300/70">Intelligent systems</div>
                    </div>
                  </Link>

                  <Link
                    to="/courses?category=generative-ai"
                    onClick={() => {
                      setIsOpen(false);
                      setCoursesDropdownOpen(false);
                    }}
                    className="flex items-center px-4 py-3 text-cyan-200 text-sm hover:bg-gradient-to-r hover:from-neon-blue/10 hover:to-neon-purple/5 hover:text-neon-blue rounded-lg transition-all duration-200 active:scale-98"
                  >
                    <div className="w-8 h-8 bg-neon-blue/10 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-sm">✨</span>
                    </div>
                    <div>
                      <div className="font-medium">Generative AI</div>
                      <div className="text-xs text-cyan-300/70">Create with AI</div>
                    </div>
                  </Link>

                  <Link
                    to="/courses?category=python-data-science"
                    onClick={() => {
                      setIsOpen(false);
                      setCoursesDropdownOpen(false);
                    }}
                    className="flex items-center px-4 py-3 text-cyan-200 text-sm hover:bg-gradient-to-r hover:from-green-500/10 hover:to-emerald-500/5 hover:text-green-400 rounded-lg transition-all duration-200 active:scale-98"
                  >
                    <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-sm">🐍</span>
                    </div>
                    <div>
                      <div className="font-medium">Python with Data Science</div>
                      <div className="text-xs text-cyan-300/70">Python for data analysis</div>
                    </div>
                  </Link>

                  <Link
                    to="/courses?category=data-science-gen-ai"
                    onClick={() => {
                      setIsOpen(false);
                      setCoursesDropdownOpen(false);
                    }}
                    className="flex items-center px-4 py-3 text-cyan-200 text-sm hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-violet-500/5 hover:text-purple-400 rounded-lg transition-all duration-200 active:scale-98"
                  >
                    <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-sm">⚡</span>
                    </div>
                    <div>
                      <div className="font-medium">Data Science with Gen AI</div>
                      <div className="text-xs text-cyan-300/70">Advanced data science</div>
                    </div>
                  </Link>

                  <Link
                    to="/courses?category=ml-gen-ai"
                    onClick={() => {
                      setIsOpen(false);
                      setCoursesDropdownOpen(false);
                    }}
                    className="flex items-center px-4 py-3 text-cyan-200 text-sm hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-red-500/5 hover:text-orange-400 rounded-lg transition-all duration-200 active:scale-98"
                  >
                    <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-sm">🔥</span>
                    </div>
                    <div>
                      <div className="font-medium">Complete ML with Gen AI</div>
                      <div className="text-xs text-cyan-300/70">Comprehensive ML course</div>
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
                    <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-full flex items-center justify-center mr-4 shadow-lg">
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
                    className="flex items-center justify-center w-full px-6 py-4 text-white font-semibold bg-gradient-to-r from-neon-cyan/15 to-neon-blue/15 border border-neon-cyan/30 hover:from-neon-cyan/25 hover:to-neon-blue/25 hover:text-neon-cyan rounded-xl transition-all duration-300 active:scale-98"
                    style={{boxShadow: '0 4px 15px rgba(0,255,255,0.15)'}}
                  >
                    <div className="w-8 h-8 bg-neon-cyan/20 rounded-lg flex items-center justify-center mr-3">
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
                        to={result.type === 'course' ? `/courses/${result.id}` : '/courses'}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                        className="block p-3 sm:p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200 group active:scale-95"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0 mr-3">
                            <h4 className="text-white font-medium group-hover:text-neon-cyan transition-colors text-sm sm:text-base truncate">
                              {result.title}
                            </h4>
                            <p className="text-cyan-200/60 text-xs sm:text-sm truncate">{result.category}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium flex-shrink-0 ${
                            result.type === 'course' ? 'bg-neon-cyan/20 text-neon-cyan' :
                            result.type === 'instructor' ? 'bg-neon-magenta/20 text-neon-magenta' :
                            'bg-neon-blue/20 text-neon-blue'
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
                    <p className="text-cyan-200/40 text-sm mt-1">Try searching for courses, instructors, or topics</p>
                  </div>
                )}
              </div>
            )}

            {/* Quick suggestions when no query */}
            {!searchQuery && (
              <div className="mt-3 sm:mt-4">
                <p className="text-cyan-200/60 text-xs sm:text-sm mb-2 sm:mb-3 px-2">Popular searches:</p>
                <div className="flex flex-wrap gap-2">
                  {['Machine Learning', 'Data Science', 'Python', 'AI', 'Deep Learning'].map((term) => (
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