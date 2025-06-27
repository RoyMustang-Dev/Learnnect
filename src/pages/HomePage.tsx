import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import PromoBanner from '../components/PromoBanner';
import CourseCard from '../components/CourseCard';
import TestimonialCard from '../components/TestimonialCard';
import FeatureCard from '../components/FeatureCard';
import USPSection from '../components/USPSection';
import StatsSection from '../components/StatsSection';
import SEOHead from '../components/SEO/SEOHead';

import { ArrowRight, BookOpen, Users, Award, Clock, ChevronLeft, ChevronRight, Database, Brain, Sparkles, Code, Zap, Cpu, Play, GraduationCap, Rocket, Target, Bot, Briefcase, TrendingUp } from 'lucide-react';
import { paidCourses, freeCourses } from '../data/coursesData';

// Create course categories from paid courses data (excluding BI & Data Visualization)
const courseCategories = paidCourses.map((course, index) => {
  const icons = [
    <Database className="h-6 w-6 sm:h-8 sm:w-8" />,
    <Brain className="h-6 w-6 sm:h-8 sm:w-8" />,
    <Sparkles className="h-6 w-6 sm:h-8 sm:w-8" />,
    <Code className="h-6 w-6 sm:h-8 sm:w-8" />,
    <Zap className="h-6 w-6 sm:h-8 sm:w-8" />,
    <Cpu className="h-6 w-6 sm:h-8 sm:w-8" />
  ];

  const colors = [
    {
      gradient: 'from-neon-cyan/10 to-neon-blue/5',
      borderColor: 'border-neon-cyan/30 hover:border-neon-cyan/60',
      iconBg: 'bg-neon-cyan/20',
      iconBorder: 'border-neon-cyan/40',
      textColor: 'text-neon-cyan',
      hoverColor: 'group-hover:text-neon-blue',
      glowColor: 'rgba(0,255,255,0.2)',
      iconGlow: 'rgba(0,255,255,0.3)',
      hoverGradient: 'from-neon-cyan/5 to-transparent'
    },
    {
      gradient: 'from-neon-magenta/10 to-neon-pink/5',
      borderColor: 'border-neon-magenta/30 hover:border-neon-magenta/60',
      iconBg: 'bg-neon-magenta/20',
      iconBorder: 'border-neon-magenta/40',
      textColor: 'text-neon-magenta',
      hoverColor: 'group-hover:text-neon-pink',
      glowColor: 'rgba(255,0,255,0.2)',
      iconGlow: 'rgba(255,0,255,0.3)',
      hoverGradient: 'from-neon-magenta/5 to-transparent'
    },
    {
      gradient: 'from-neon-blue/10 to-neon-purple/5',
      borderColor: 'border-neon-blue/30 hover:border-neon-blue/60',
      iconBg: 'bg-neon-blue/20',
      iconBorder: 'border-neon-blue/40',
      textColor: 'text-neon-blue',
      hoverColor: 'group-hover:text-neon-purple',
      glowColor: 'rgba(0,245,255,0.2)',
      iconGlow: 'rgba(0,245,255,0.3)',
      hoverGradient: 'from-neon-blue/5 to-transparent'
    },
    {
      gradient: 'from-green-500/10 to-emerald-500/5',
      borderColor: 'border-green-400/30 hover:border-green-400/60',
      iconBg: 'bg-green-400/20',
      iconBorder: 'border-green-400/40',
      textColor: 'text-green-400',
      hoverColor: 'group-hover:text-emerald-400',
      glowColor: 'rgba(34,197,94,0.2)',
      iconGlow: 'rgba(34,197,94,0.3)',
      hoverGradient: 'from-green-400/5 to-transparent'
    },
    {
      gradient: 'from-purple-500/10 to-violet-500/5',
      borderColor: 'border-purple-400/30 hover:border-purple-400/60',
      iconBg: 'bg-purple-400/20',
      iconBorder: 'border-purple-400/40',
      textColor: 'text-purple-400',
      hoverColor: 'group-hover:text-violet-400',
      glowColor: 'rgba(168,85,247,0.2)',
      iconGlow: 'rgba(168,85,247,0.3)',
      hoverGradient: 'from-purple-400/5 to-transparent'
    },
    {
      gradient: 'from-orange-500/10 to-red-500/5',
      borderColor: 'border-orange-400/30 hover:border-orange-400/60',
      iconBg: 'bg-orange-400/20',
      iconBorder: 'border-orange-400/40',
      textColor: 'text-orange-400',
      hoverColor: 'group-hover:text-red-400',
      glowColor: 'rgba(251,146,60,0.2)',
      iconGlow: 'rgba(251,146,60,0.3)',
      hoverGradient: 'from-orange-400/5 to-transparent'
    }
  ];

  return {
    id: course.courseId,
    title: course.courseDisplayName,
    description: course.description,
    icon: icons[index % icons.length],
    link: `/courses/${course.courseId}`,
    courseData: course,
    ...colors[index % colors.length]
  };
});

// Featured courses now use Free/Freemium courses with proper image naming convention
const featuredCourses = freeCourses.map(course => ({
  id: course.id,
  title: course.courseDisplayName,
  instructor: course.instructor || 'Learnnect Expert',
  description: course.description,
  image: `/assets/featured_section_images/${course.courseId}+${course.courseName.replace(/\s+/g, '')}.jpg`,
  price: course.price,
  category: course.category,
  level: course.level,
  duration: course.duration,
  courseData: course
}));

const learningBenefits = [
  {
    id: '1',
    title: 'AI-Powered Learning',
    role: 'Personalized Experience',
    content: 'Our advanced AI algorithms adapt to your learning style, creating personalized paths that maximize your potential and accelerate skill development.',
    icon: <Bot className="h-6 w-6" />,
    iconColor: 'border-neon-cyan/50 bg-neon-cyan/10'
  },
  {
    id: '2',
    title: 'Industry-Ready Projects',
    role: 'Real-World Application',
    content: 'Build a portfolio with hands-on projects that mirror actual industry challenges. Practice with the same tools and technologies used by leading companies.',
    icon: <Briefcase className="h-6 w-6" />,
    iconColor: 'border-neon-magenta/50 bg-neon-magenta/10'
  },
  {
    id: '3',
    title: 'Future-Proof Skills',
    role: 'Cutting-Edge Technology',
    content: 'Master emerging technologies in AI, machine learning, and data science. Stay ahead of the curve with curriculum designed for tomorrow\'s job market.',
    icon: <TrendingUp className="h-6 w-6" />,
    iconColor: 'border-neon-blue/50 bg-neon-blue/10'
  }
];

const features = [
  {
    id: '1',
    title: 'Expert Instructors',
    description: 'Learn from industry professionals and academics with years of experience in data science and AI.',
    icon: <Users className="h-10 w-10 text-neon-cyan" />
  },
  {
    id: '2',
    title: 'Hands-on Projects',
    description: 'Apply your knowledge through real-world projects that build your portfolio and enhance your skills.',
    icon: <BookOpen className="h-10 w-10 text-neon-magenta" />
  },
  {
    id: '3',
    title: 'Flexible Learning',
    description: 'Study at your own pace with lifetime access to course materials and regular updates.',
    icon: <Clock className="h-10 w-10 text-neon-blue" />
  },
  {
    id: '4',
    title: 'Certification',
    description: 'Earn industry-recognized certificates upon course completion to showcase your expertise.',
    icon: <Award className="h-10 w-10 text-neon-pink" />
  }
];

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const itemsPerSlide = 3; // Show 3 items at a time on desktop
  const totalSlides = Math.ceil(courseCategories.length / itemsPerSlide);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6000); // Increased interval for better performance

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <>
      <SEOHead
        title="Learnnect | Master AI, ML, Data Science & Generative AI - Transform Your Career"
        description="Transform your career with Learnnect's industry-ready courses in Data Science, AI/ML, and Generative AI. Join 10,000+ successful learners with 95% placement rate and ₹8.5L average package."
        keywords="Data Science course, AI course, ML course, Generative AI course, online learning, career transformation, tech skills, programming, Python, machine learning, artificial intelligence, data analytics, career change, tech jobs, placement guarantee"
        url="https://learnnect.com"
        type="website"
        image="https://learnnect.com/assets/learnnect-og-image.png"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": "Learnnect",
          "description": "Leading EdTech platform for AI, ML, Data Science and Generative AI courses",
          "url": "https://learnnect.com",
          "logo": "https://learnnect.com/assets/learnnect-logo_gradient.png",
          "foundingDate": "2024",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Wave City Sector 2",
            "addressLocality": "Ghaziabad",
            "postalCode": "201002",
            "addressCountry": "IN"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-7007788926",
            "contactType": "customer service",
            "email": "support@learnnect.com"
          },
          "sameAs": [
            "https://facebook.com/learnnect",
            "https://x.com/learnnect",
            "https://instagram.com/learnnect",
            "https://linkedin.com/company/learnnect",
            "https://youtube.com/@learnnect"
          ]
        }}
      />
      <div className="flex flex-col min-h-screen">
        <HeroSection />

      {/* Promo Banner */}
      <PromoBanner />

      {/* USP Section */}
      <USPSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Categories Carousel section */}
      <section className="py-16 sm:py-20 px-3 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-br from-neon-black via-gray-900 to-neon-black relative overflow-hidden">
        {/* Enhanced Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-neon-magenta/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta mb-3 sm:mb-4" style={{textShadow: '0 0 20px rgba(0,255,255,0.5)'}}>
              Transform Your Career Path 🚀
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-cyan-100/80 max-w-3xl mx-auto px-4">
              From zero to hero - choose your adventure in the most exciting tech domains that are literally reshaping the world
            </p>
          </div>

          {/* Carousel Container */}
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 border border-neon-cyan/50 text-neon-cyan hover:border-neon-cyan hover:bg-neon-cyan/10 transition-all duration-300 backdrop-blur-sm shadow-lg"
              style={{boxShadow: '0 0 20px rgba(0,255,255,0.3)'}}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-gradient-to-r from-neon-magenta/20 to-neon-pink/20 border border-neon-magenta/50 text-neon-magenta hover:border-neon-magenta hover:bg-neon-magenta/10 transition-all duration-300 backdrop-blur-sm shadow-lg"
              style={{boxShadow: '0 0 20px rgba(255,0,255,0.3)'}}
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Carousel Content */}
            <div className="overflow-hidden mx-8 sm:mx-12 py-4">
              <div
                className="flex transition-transform duration-500 ease-in-out relative z-10"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`
                }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 px-6">
                      {courseCategories
                        .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                        .map((category) => (
                          <div
                            key={category.id}
                            className="group relative transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2 hover:z-20"
                          >
                            <Link
                              to={category.link}
                              className={`block relative bg-gradient-to-br ${category.gradient} rounded-xl p-6 sm:p-8 border ${category.borderColor} backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-opacity-100 shadow-lg hover:shadow-2xl`}
                            >
                              {/* Subtle glow effect contained within the card */}
                              <div className={`absolute inset-0 bg-gradient-to-br ${category.hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl`}></div>

                              {/* Inner glow border effect */}
                              <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`}
                                   style={{boxShadow: `inset 0 0 20px ${category.glowColor}`}}></div>

                              <div className="relative z-10">
                                <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full ${category.iconBg} flex items-center justify-center mb-4 border ${category.iconBorder} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                  <div className={`${category.textColor} transition-all duration-300 group-hover:brightness-110`}>
                                    {category.icon}
                                  </div>
                                </div>
                                <h3 className={`text-lg sm:text-xl font-bold ${category.textColor} mb-3 transition-all duration-300 group-hover:brightness-110`}>
                                  {category.title}
                                </h3>
                                <p className="text-sm sm:text-base text-cyan-200/80 mb-4 leading-relaxed transition-all duration-300 group-hover:text-cyan-100/90">
                                  {category.description}
                                </p>
                                <div className={`flex items-center text-sm sm:text-base ${category.textColor} font-medium transition-all duration-300 group-hover:brightness-110`}>
                                  Explore courses
                                  <ArrowRight className="ml-2 h-4 w-4 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110" />
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center mt-8 space-x-3">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-neon-cyan shadow-lg scale-125'
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  style={{
                    boxShadow: index === currentSlide ? '0 0 10px rgba(0,255,255,0.8)' : 'none'
                  }}
                />
              ))}
            </div>

            {/* Auto-play indicator */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                  isAutoPlaying
                    ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50'
                    : 'bg-gray-700 text-gray-400 border border-gray-600'
                }`}
              >
                {isAutoPlaying ? 'Auto-play ON' : 'Auto-play OFF'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured courses section - Redesigned */}
      <section className="py-12 sm:py-16 px-3 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-neon-black to-gray-900 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-32 right-20 w-96 h-96 bg-neon-magenta/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 left-20 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-magenta to-neon-cyan mb-3 sm:mb-4" style={{textShadow: '0 0 20px rgba(255,0,255,0.5)'}}>
              Start Your Journey - Zero Cost, Maximum Impact 🎯
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-cyan-100/80 max-w-3xl mx-auto px-4">
              Dip your toes in the data ocean with our handpicked starter courses - because every expert was once a beginner
            </p>
          </div>

          {/* Learning Path Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Free Courses */}
            <div className="group relative bg-gradient-to-br from-slate-900/80 to-slate-800/60 rounded-2xl border border-green-400/30 p-8 hover:border-green-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-green-400/20 rounded-xl border border-green-400/30 mr-4">
                  <Play className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-400 mb-1">Free Courses</h3>
                  <p className="text-green-300/70 text-sm">Start your journey today</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {freeCourses.filter(course => course.type === 'Free').slice(0, 3).map((course, index) => (
                  <div key={course.id} className="flex items-start p-4 bg-green-400/5 rounded-lg hover:bg-green-400/10 transition-all duration-200 border border-green-400/10">
                    <div className="w-8 h-8 bg-green-400/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <BookOpen className="h-4 w-4 text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm mb-1 leading-tight">{course.courseDisplayName}</h4>
                      <p className="text-green-300/60 text-xs">{course.category}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <div className="bg-green-400/10 rounded-lg p-4 border border-green-400/20">
                  <p className="text-green-200 text-sm font-medium mb-2">Perfect for beginners</p>
                  <p className="text-green-300/80 text-xs">Build foundational skills with our carefully crafted free courses. No commitment required.</p>
                </div>
              </div>

              <Link
                to="/courses?type=free"
                className="w-full bg-green-400/20 hover:bg-green-400/30 text-green-400 py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center group-hover:scale-105"
              >
                Explore Free Courses
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            {/* Foundation Courses */}
            <div className="group relative bg-gradient-to-br from-slate-900/80 to-slate-800/60 rounded-2xl border border-yellow-400/30 p-8 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-yellow-400/20 rounded-xl border border-yellow-400/30 mr-4">
                  <GraduationCap className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-1">Foundation Courses</h3>
                  <p className="text-yellow-300/70 text-sm">Build strong fundamentals</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {freeCourses.filter(course => course.type === 'Freemium').slice(0, 3).map((course, index) => (
                  <div key={course.id} className="flex items-start p-4 bg-yellow-400/5 rounded-lg hover:bg-yellow-400/10 transition-all duration-200 border border-yellow-400/10">
                    <div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <Target className="h-4 w-4 text-yellow-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm mb-1 leading-tight">{course.courseDisplayName}</h4>
                      <div className="flex items-center justify-between">
                        <p className="text-yellow-300/60 text-xs">{course.category}</p>
                        <span className="text-yellow-400 font-bold text-xs">₹{course.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <div className="bg-yellow-400/10 rounded-lg p-4 border border-yellow-400/20">
                  <p className="text-yellow-200 text-sm font-medium mb-2">Project-based learning</p>
                  <p className="text-yellow-300/80 text-xs">Hands-on implementation with real-world case studies. Build your portfolio while learning.</p>
                </div>
              </div>

              <Link
                to="/courses?type=foundation"
                className="w-full bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-400 py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center group-hover:scale-105"
              >
                Explore Foundation Courses
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            {/* Learning Philosophy */}
            <div className="group relative bg-gradient-to-br from-slate-900/80 to-slate-800/60 rounded-2xl border border-neon-cyan/30 p-8 hover:border-neon-cyan/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-neon-cyan/20 rounded-xl border border-neon-cyan/30 mr-4">
                  <Rocket className="h-6 w-6 text-neon-cyan" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neon-cyan mb-1">WWH Learning</h3>
                  <p className="text-cyan-300/70 text-sm">What • Why • How</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start p-4 bg-neon-cyan/5 rounded-lg border border-neon-cyan/10">
                  <div className="w-8 h-8 bg-neon-cyan/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-neon-cyan font-bold text-sm">W</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm mb-1">What to Learn</h4>
                    <p className="text-cyan-300/60 text-xs">Carefully curated curriculum for employable skills</p>
                  </div>
                </div>

                <div className="flex items-start p-4 bg-neon-cyan/5 rounded-lg border border-neon-cyan/10">
                  <div className="w-8 h-8 bg-neon-cyan/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-neon-cyan font-bold text-sm">W</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm mb-1">Why to Learn</h4>
                    <p className="text-cyan-300/60 text-xs">Industry relevance and career impact</p>
                  </div>
                </div>

                <div className="flex items-start p-4 bg-neon-cyan/5 rounded-lg border border-neon-cyan/10">
                  <div className="w-8 h-8 bg-neon-cyan/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-neon-cyan font-bold text-sm">H</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm mb-1">How to Learn</h4>
                    <p className="text-cyan-300/60 text-xs">Project-based implementation approach</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-neon-cyan/10 rounded-lg p-4 border border-neon-cyan/20">
                  <p className="text-cyan-200 text-sm font-medium mb-2">Our unique philosophy</p>
                  <p className="text-cyan-300/80 text-xs">3-phase learning: Foundations → Core + Advanced → Interview Prep</p>
                </div>
              </div>

              <Link
                to="/courses"
                className="w-full bg-neon-cyan/20 hover:bg-neon-cyan/30 text-neon-cyan py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center group-hover:scale-105"
              >
                Explore All Courses
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>



      {/* Testimonials section */}
      <section className="py-12 sm:py-16 px-3 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-neon-black to-gray-900 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-40 left-10 w-96 h-96 bg-neon-cyan/6 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 right-10 w-96 h-96 bg-neon-magenta/6 rounded-full blur-3xl"></div>
          <div className="absolute top-20 right-1/3 w-64 h-64 bg-neon-blue/6 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-magenta to-neon-cyan" style={{textShadow: '0 0 20px rgba(255,0,255,0.5)'}}>
              Level Up Your Future 🚀
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-cyan-100/80 max-w-3xl mx-auto px-4">
              No cap - we're literally building the main character energy you need to dominate tomorrow's tech world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {learningBenefits.map(benefit => (
              <TestimonialCard key={benefit.id} testimonial={benefit} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-12 sm:py-16 px-3 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-r from-neon-black via-gray-900 to-neon-black relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-neon-magenta/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-magenta mb-4 sm:mb-6" style={{textShadow: '0 0 30px rgba(0,255,255,0.5)'}}>
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-cyan-100/90 mb-6 sm:mb-8 max-w-3xl mx-auto px-4" style={{textShadow: '0 0 10px rgba(0,255,255,0.3)'}}>
            Join thousands of students who are already advancing their careers with <span className="text-neon-cyan font-semibold">Learnnect's</span> expert-led courses.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Link to="/courses" className="px-8 py-3 sm:px-10 sm:py-4 bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 text-neon-cyan border-2 border-neon-cyan/50 rounded-xl font-bold hover:border-neon-cyan hover:bg-neon-cyan/10 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base" style={{boxShadow: '0 0 30px rgba(0,255,255,0.4)', textShadow: '0 0 10px rgba(0,255,255,0.8)'}}>
              Browse Courses
            </Link>
            <Link to="/auth?signup=true" className="px-8 py-3 sm:px-10 sm:py-4 bg-gradient-to-r from-neon-magenta/20 to-neon-pink/20 text-neon-magenta border-2 border-neon-magenta/50 rounded-xl font-bold hover:border-neon-magenta hover:bg-neon-magenta/10 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base" style={{boxShadow: '0 0 30px rgba(255,0,255,0.4)', textShadow: '0 0 10px rgba(255,0,255,0.8)'}}>
              Sign Up Free
            </Link>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default HomePage;