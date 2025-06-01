import { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';
import Spline from '@splinetool/react-spline';

const HeroSection = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0F0F1A]">
      {/* Spline 3D element */}
      <div className="absolute inset-0 w-full h-full">
        <Suspense fallback={<div>Loading...</div>}>
          <Spline
            scene="https://prod.spline.design/m9cHRio-RdMglQ9V/scene.splinecode"
            className="w-full h-full"
          />
        </Suspense>
      </div>

      {/* Content section */}
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-20 pb-12 sm:pt-24 sm:pb-16 md:pt-28 md:pb-20 lg:pt-32 lg:pb-32">
        <div className="w-full lg:w-1/2">
          {/* Badge */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <span className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2 rounded-full bg-gradient-to-r from-neon-magenta/20 to-neon-cyan/20 text-neon-cyan backdrop-blur-sm border border-neon-cyan/50 text-xs sm:text-sm font-medium mb-6 sm:mb-8 hover:border-neon-magenta/50 transition-all duration-300" style={{boxShadow: '0 0 20px rgba(0,255,255,0.3), inset 0 0 20px rgba(255,0,255,0.1)'}}>
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-neon-cyan rounded-full mr-2 sm:mr-3 animate-pulse" style={{boxShadow: '0 0 10px rgba(0,255,255,0.8)'}}></span>
              <span className="hidden sm:inline">Transform Your Future with AI & Data Science</span>
              <span className="sm:hidden">AI & Data Science</span>
            </span>
          </div>

          <h1 className="animate-fade-in-up text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta leading-tight mb-4 sm:mb-6" style={{
            animationDelay: '0.4s',
            textShadow: '0 0 20px rgba(0,255,255,0.6), 0 0 40px rgba(255,0,255,0.4)'
          }}>
            Learn, Connect, Succeed
          </h1>

          <p className="animate-fade-in-up text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-cyan-100/90 mb-8 sm:mb-10 md:mb-12 max-w-3xl leading-relaxed font-light" style={{
            animationDelay: '0.9s',
            textShadow: '0 0 15px rgba(0,255,255,0.3)',
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
          }}>
            Join our <span className="text-neon-cyan font-semibold animate-pulse-glow">community of learners</span> and master cutting-edge skills in
            <span className="text-neon-magenta font-semibold animate-pulse-glow" style={{animationDelay: '0.5s'}}> Data Science</span>,
            <span className="text-neon-blue font-semibold animate-pulse-glow" style={{animationDelay: '1s'}}> Machine Learning</span>, and
            <span className="text-neon-pink font-semibold animate-pulse-glow" style={{animationDelay: '1.5s'}}> Generative AI</span> through immersive, project-based courses.
          </p>

          <div className="animate-fade-in-up flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-10 md:mb-12 pt-20 sm:pt-0" style={{ animationDelay: '0.8s' }}>
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
              <div className="flex -space-x-2 sm:-space-x-3">
                {[
                  'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
                  'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
                  'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
                ].map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Student ${index + 1}`}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-neon-cyan hover:scale-110 hover:border-neon-magenta transition-all duration-300 cursor-pointer"
                    style={{boxShadow: '0 0 15px rgba(0,255,255,0.5)'}}
                  />
                ))}
              </div>
              <div className="text-cyan-100">
                <span className="block font-bold text-neon-cyan text-base sm:text-lg" style={{textShadow: '0 0 10px rgba(0,255,255,0.8)'}}>10,000+ Students</span>
                <div className="flex items-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-neon-blue"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      style={{filter: 'drop-shadow(0 0 5px rgba(0,245,255,0.6))'}}
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-xs sm:text-sm text-cyan-200" style={{textShadow: '0 0 5px rgba(0,255,255,0.5)'}}>4.9/5 Average Rating</span>
                </div>
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