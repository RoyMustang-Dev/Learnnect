import { Suspense, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, BookOpen, Lightbulb, Cog } from 'lucide-react';
import Spline from '@splinetool/react-spline';

const HeroSection = () => {
  const [shouldLoadSpline, setShouldLoadSpline] = useState(false);

  useEffect(() => {
    // Delay Spline loading for better performance
    const timer = setTimeout(() => {
      setShouldLoadSpline(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0F0F1A]">
      {/* Spline 3D element - Only load on desktop (md and up) and after delay */}
      {shouldLoadSpline && (
        <div className="absolute inset-0 w-full h-full hidden md:block">
          <Suspense fallback={
            <div className="w-full h-full bg-gradient-to-br from-neon-black via-gray-900 to-neon-black flex items-center justify-center">
              <div className="text-neon-cyan">Loading 3D Scene...</div>
            </div>
          }>
            <Spline
              scene="https://prod.spline.design/m9cHRio-RdMglQ9V/scene.splinecode"
              className="w-full h-full"
            />
          </Suspense>
        </div>
      )}

      {/* Mobile fallback background - visible on mobile and tablet (md:hidden) */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-neon-black via-gray-900 to-neon-black md:hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-neon-cyan/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-neon-magenta/5 rounded-full blur-2xl"></div>
      </div>

      {/* Content section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8 pt-16 pb-8 sm:pt-20 sm:pb-12 md:pt-24 md:pb-16 lg:pt-28 lg:pb-20 xl:pt-32 xl:pb-32">
        <div className="w-full lg:w-1/2">
          {/* Badge */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <span className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2 rounded-full bg-gradient-to-r from-neon-magenta/20 to-neon-cyan/20 text-neon-cyan backdrop-blur-sm border border-neon-cyan/50 text-xs sm:text-sm font-medium mb-6 sm:mb-8 hover:border-neon-magenta/50 transition-all duration-300" style={{boxShadow: '0 0 20px rgba(0,255,255,0.3), inset 0 0 20px rgba(255,0,255,0.1)'}}>
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-neon-cyan rounded-full mr-2 sm:mr-3 animate-pulse" style={{boxShadow: '0 0 10px rgba(0,255,255,0.8)'}}></span>
              <span className="hidden sm:inline">Transform Your Future with AI & Data Science</span>
              <span className="sm:hidden">Transform Your Future with AI & Data Science</span>
            </span>
          </div>

          <h1 className="animate-fade-in-up text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-magenta leading-tight mb-4 sm:mb-6" style={{
            animationDelay: '0.4s',
            textShadow: '0 0 30px rgba(0,255,255,0.5)',
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
          }}>
            Master{' '}
            <span className="text-neon-cyan animate-pulse-glow">Data Science</span> &{' '}
            <span className="text-neon-magenta animate-pulse-glow" style={{animationDelay: '0.5s'}}>AI</span>
          </h1>

          <p className="animate-fade-in-up text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-cyan-100/90 mb-8 sm:mb-10 md:mb-12 max-w-3xl leading-relaxed font-light" style={{
            animationDelay: '0.9s',
            textShadow: '0 0 15px rgba(0,255,255,0.3)',
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
          }}>
            Transform your career with industry-focused courses in{' '}
            <span className="text-neon-magenta font-semibold animate-pulse-glow" style={{animationDelay: '0.5s'}}>Data Science</span>,{' '}
            <span className="text-neon-blue font-semibold animate-pulse-glow" style={{animationDelay: '1s'}}>AI & Machine Learning</span>, and{' '}
            <span className="text-neon-pink font-semibold animate-pulse-glow" style={{animationDelay: '1.5s'}}>Generative AI</span>. Master tomorrow's tech skills today with our proven learning methodology.
          </p>

          <div className="animate-fade-in-up flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10 lg:mb-12" style={{ animationDelay: '0.8s' }}>
            <Link
              to="/courses"
              className="group relative px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-4 bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 text-neon-cyan border-2 border-neon-cyan/50 rounded-xl font-bold hover:border-neon-cyan hover:bg-neon-cyan/10 transition-all duration-300 transform hover:scale-105 flex items-center justify-center backdrop-blur-sm text-sm sm:text-base"
              style={{
                boxShadow: '0 0 30px rgba(0,255,255,0.4), inset 0 0 30px rgba(0,255,255,0.1)',
                textShadow: '0 0 10px rgba(0,255,255,0.8)'
              }}
            >
              <span className="group-hover:translate-x-1 transition-transform duration-300 relative z-10">
                Explore Courses
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/0 to-neon-cyan/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <button
              className="group relative px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-4 bg-gradient-to-r from-neon-magenta/20 to-neon-pink/20 text-neon-magenta border-2 border-neon-magenta/50 rounded-xl font-bold hover:border-neon-magenta hover:bg-neon-magenta/10 transition-all duration-300 transform hover:scale-105 flex items-center justify-center backdrop-blur-sm text-sm sm:text-base"
              style={{
                boxShadow: '0 0 30px rgba(255,0,255,0.4), inset 0 0 30px rgba(255,0,255,0.1)',
                textShadow: '0 0 10px rgba(255,0,255,0.8)'
              }}
            >
              <PlayCircle className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform duration-300" />
              <span className="relative z-10">Watch Demo</span>
              <div className="absolute inset-0 bg-gradient-to-r from-neon-magenta/0 to-neon-magenta/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '1s' }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 md:gap-8">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-neon-cyan to-blue-500 flex items-center justify-center hover:scale-110 transition-all duration-300 border border-neon-cyan/30 mb-2 group-hover:rotate-6" style={{boxShadow: '0 0 20px rgba(0,255,255,0.4)'}}>
                    <BookOpen className="text-white h-6 w-6 sm:h-7 sm:w-7 group-hover:scale-110 transition-all duration-300" />
                  </div>
                  <span className="text-xs text-neon-cyan font-semibold group-hover:text-white transition-colors">WHAT</span>
                </div>
                <div className="w-4 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-magenta hidden sm:block animate-pulse"></div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-neon-magenta to-purple-500 flex items-center justify-center hover:scale-110 transition-all duration-300 border border-neon-magenta/30 mb-2 group-hover:rotate-6" style={{boxShadow: '0 0 20px rgba(255,0,255,0.4)'}}>
                    <Lightbulb className="text-white h-6 w-6 sm:h-7 sm:w-7 group-hover:scale-110 transition-all duration-300" />
                  </div>
                  <span className="text-xs text-neon-magenta font-semibold group-hover:text-white transition-colors">WHY</span>
                </div>
                <div className="w-4 h-0.5 bg-gradient-to-r from-neon-magenta to-neon-blue hidden sm:block animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-neon-blue to-purple-600 flex items-center justify-center hover:scale-110 transition-all duration-300 border border-neon-blue/30 mb-2 group-hover:rotate-6" style={{boxShadow: '0 0 20px rgba(0,150,255,0.4)'}}>
                    <Cog className="text-white h-6 w-6 sm:h-7 sm:w-7 group-hover:scale-110 group-hover:rotate-180 transition-all duration-500" />
                  </div>
                  <span className="text-xs text-neon-blue font-semibold group-hover:text-white transition-colors">HOW</span>
                </div>
              </div>
              <div className="text-cyan-100">
                <span className="block font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta text-base sm:text-lg" style={{textShadow: '0 0 10px rgba(0,255,255,0.8)'}}>WWH Learning Philosophy</span>
                <div className="flex items-center mt-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" style={{boxShadow: '0 0 8px rgba(0,255,255,0.8)'}}></div>
                    <div className="w-2 h-2 bg-neon-magenta rounded-full animate-pulse" style={{animationDelay: '0.3s', boxShadow: '0 0 8px rgba(255,0,255,0.8)'}}></div>
                    <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse" style={{animationDelay: '0.6s', boxShadow: '0 0 8px rgba(0,150,255,0.8)'}}></div>
                  </div>
                  <span className="ml-3 text-xs sm:text-sm text-cyan-200" style={{textShadow: '0 0 5px rgba(0,255,255,0.5)'}}>What to Learn → Why to Learn → How to Learn</span>
                </div>
                <p className="text-xs text-gray-300 mt-1 opacity-80">Master the complete learning journey with our proven methodology</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-indigo-900 to-transparent"></div>
    </div>
  );
};

export default HeroSection;