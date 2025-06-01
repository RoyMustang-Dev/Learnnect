import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import CourseCard from '../components/CourseCard';
import TestimonialCard from '../components/TestimonialCard';
import FeatureCard from '../components/FeatureCard';
import { ArrowRight, BookOpen, Users, Award, Clock, ChevronLeft, ChevronRight, Database, Brain, Sparkles, Code, Zap, Cpu } from 'lucide-react';

const courseCategories = [
  {
    id: '1',
    title: 'Data Science',
    description: 'Master data analysis, visualization, and predictive modeling',
    icon: <Database className="h-6 w-6 sm:h-8 sm:w-8" />,
    link: '/courses?category=data-science',
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
    id: '2',
    title: 'AI & Machine Learning',
    description: 'Build intelligent systems and leverage powerful ML algorithms',
    icon: <Brain className="h-6 w-6 sm:h-8 sm:w-8" />,
    link: '/courses?category=ai-ml',
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
    id: '3',
    title: 'Generative AI',
    description: 'Create cutting-edge AI models for generating images, text, and more',
    icon: <Sparkles className="h-6 w-6 sm:h-8 sm:w-8" />,
    link: '/courses?category=generative-ai',
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
    id: '4',
    title: 'Python with Data Science',
    description: 'Master Python programming for data analysis and scientific computing',
    icon: <Code className="h-6 w-6 sm:h-8 sm:w-8" />,
    link: '/courses?category=python-data-science',
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
    id: '5',
    title: 'Data Science with Gen AI',
    description: 'Combine traditional data science with generative AI technologies',
    icon: <Zap className="h-6 w-6 sm:h-8 sm:w-8" />,
    link: '/courses?category=data-science-gen-ai',
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
    id: '6',
    title: 'Complete ML with Gen AI',
    description: 'Comprehensive machine learning enhanced with Gen AI',
    icon: <Cpu className="h-6 w-6 sm:h-8 sm:w-8" />,
    link: '/courses?category=ml-gen-ai',
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

const featuredCourses = [
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
    id: '5',
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
    id: '6',
    title: 'Complete Machine Learning with Generative AI',
    instructor: 'Dr. Marcus Kim',
    description: 'Comprehensive course covering traditional ML algorithms enhanced with generative AI techniques for next-generation solutions.',
    image: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 199.99,
    category: 'Complete ML with Gen AI',
    level: 'Expert',
    duration: '16 weeks'
  }
];

const testimonials = [
  {
    id: '1',
    name: 'Alex Williams',
    role: 'Data Scientist at TechCorp',
    content: 'Learnnect\'s Data Science courses helped me transition from a marketing role to a full-time data scientist position. The hands-on projects and mentorship were invaluable.',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '2',
    name: 'Emily Chen',
    role: 'AI Engineer',
    content: 'After completing the Machine Learning specialization, I landed my dream job. The curriculum was comprehensive and the instructors were experts in their fields.',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '3',
    name: 'Marcus Johnson',
    role: 'Startup Founder',
    content: 'The Generative AI course gave me the skills to build cutting-edge features for my startup. We\'ve since raised our Series A funding!',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
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
    }, 4000); // Change slide every 4 seconds

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
    <div className="flex flex-col min-h-screen">
      <HeroSection />

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
              Explore Our Course Categories
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-cyan-100/80 max-w-3xl mx-auto px-4">
              Discover specialized courses designed to help you master the most in-demand skills in tech
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

      {/* Featured courses section */}
      <section className="py-12 sm:py-16 px-3 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-neon-black to-gray-900 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-32 right-20 w-96 h-96 bg-neon-magenta/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 left-20 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 sm:mb-12">
            <div className="text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-magenta to-neon-cyan" style={{textShadow: '0 0 20px rgba(255,0,255,0.5)'}}>
                Featured Courses
              </h2>
              <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-cyan-100/80 px-4 md:px-0">
                Our most popular courses to jumpstart your learning journey
              </p>
            </div>
            <Link to="/courses" className="hidden md:flex items-center text-neon-cyan font-medium hover:text-neon-magenta transition-colors mt-4 md:mt-0" style={{textShadow: '0 0 10px rgba(0,255,255,0.5)'}}>
              View all courses <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {featuredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          <div className="mt-8 sm:mt-10 text-center md:hidden">
            <Link to="/courses" className="inline-flex items-center px-6 py-3 border-2 border-neon-cyan/50 text-neon-cyan rounded-xl font-medium hover:bg-neon-cyan/10 hover:border-neon-cyan transition-all duration-300 backdrop-blur-sm text-sm sm:text-base" style={{boxShadow: '0 0 15px rgba(0,255,255,0.3)', textShadow: '0 0 10px rgba(0,255,255,0.5)'}}>
              View all courses <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-12 sm:py-16 px-3 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-br from-neon-black via-gray-900 to-neon-black relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-80 h-80 bg-neon-blue/8 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-neon-pink/8 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta" style={{textShadow: '0 0 20px rgba(0,255,255,0.5)'}}>
              Why Choose Learnnect
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-cyan-100/80 max-w-3xl mx-auto px-4">
              We're dedicated to providing the highest quality education in data science and AI
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {features.map(feature => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
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
              What Our Students Say
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-cyan-100/80 max-w-3xl mx-auto px-4">
              Success stories from those who've transformed their careers through our courses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {testimonials.map(testimonial => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
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
  );
};

export default HomePage;