import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Clock, Star, Users, Zap, TrendingUp, Lightbulb} from 'lucide-react';

const PromoBanner: React.FC = () => {
  const OFF_TIME_MINUTES = 30; // The duration the offer is 'off' for
  const OFFER_DURATION_HOURS = 48; // The duration the offer is 'on' for

  // Function to calculate the target time for the offer to end
  const calculateOfferEndTime = () => {
    const now = new Date();
    return new Date(now.getTime() + OFFER_DURATION_HOURS * 60 * 60 * 1000);
  };

  // Function to calculate the target time for the offer to restart (after the off-period)
  const calculateRestartTime = () => {
    const now = new Date();
    return new Date(now.getTime() + OFF_TIME_MINUTES * 60 * 1000);
  };

  const [targetTime, setTargetTime] = useState(calculateOfferEndTime);
  const [isOfferActive, setIsOfferActive] = useState(true); // State to track if offer is active
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetTime.getTime() - now;

      if (distance > 0) {
        // Offer is active and counting down
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
        setIsOfferActive(true); // Ensure offer is marked as active
      } else {
        // Timer has hit zero
        if (isOfferActive) {
          // Offer just ended, start the 30-minute break
          setIsOfferActive(false);
          setTargetTime(calculateRestartTime()); // Set target for offer to restart
          setTimeLeft({ hours: 0, minutes: OFF_TIME_MINUTES, seconds: 0 }); // Display 30 min countdown for 'off' period
        } else {
          // 30-minute break has ended, restart the offer
          setIsOfferActive(true);
          setTargetTime(calculateOfferEndTime()); // Set target for new offer period
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime, isOfferActive]); // Add isOfferActive to dependencies

  // ... (rest of your component code for bannerItems, refs, etc.)

  const bannerItems = [
    {
      icon: <Star className="h-4 w-4" />,
      text: "New Batches: Transformative Data Science: MLOps & Generative AI",
      highlight: "40% OFF Early Bird + 100% Job Assistance" // Combines offer with key benefit
    },
    {
      icon: <TrendingUp className="h-4 w-4" />,
      text: "Launch Your AI Career: Applied AI Engineer: Machine Learning & Generative AI",
      highlight: "Real-World Projects + Guaranteed Placement Focus" // Emphasizes outcomes
    },
    {
      icon: <Lightbulb className="h-4 w-4" />,
      text: "Innovate & Deploy: Prompt to Product: Mastering Generative AI",
      highlight: "Build Your Portfolio + Dual Certified Skillset" // Highlights tangible output & certification
    },
    {
      icon: <Zap className="h-4 w-4" />,
      text: "Power Your Decisions: Augmented Data Analyst: Python & Gen AI",
      highlight: "In-Class Projects + Batches Tue, Fri, Sat!" // Focuses on hands-on and flexibility
    },
    // Optional: You can keep these general items or replace them with more specific course highlights if you want to diversify
    {
      icon: <Users className="h-4 w-4" />,
      text: "Lifetime Support for Placed Candidates: Your Success is Our Mission!",
      highlight: "Academic & Job Support Guaranteed"
    },
    {
      icon: <Clock className="h-4 w-4" />, // Re-using clock icon here for doubt solving
      text: "Dedicated Doubt Solving: Every Saturday for All Learners",
      highlight: "Your Questions, Our Priority!"
    }
  ];

  const scrollContentRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);

  // Use a separate ref for just one set of items for accurate measurement
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (measureRef.current) {
      setContentWidth(measureRef.current.scrollWidth);
    }
  }, [bannerItems.length]); // Recalculate if the number of items changes

  // Add an effect to re-calculate width on window resize
  useEffect(() => {
    const handleResize = () => {
      if (measureRef.current) {
        setContentWidth(measureRef.current.scrollWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial calculation

    return () => window.removeEventListener('resize', handleResize);
  }, [bannerItems.length]);

  return (
    <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border-y border-neon-cyan/20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 via-neon-magenta/5 to-neon-blue/5"></div>
      <div className="absolute top-0 left-1/4 w-32 h-full bg-neon-cyan/10 blur-xl"></div>
      <div className="absolute top-0 right-1/4 w-32 h-full bg-neon-magenta/10 blur-xl"></div>

      <div className="relative z-10 py-3 sm:py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-4">
          {/* Countdown Timer */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-neon-cyan animate-pulse" />
              <span className="text-neon-cyan font-bold text-xs sm:text-sm">
                {isOfferActive ? "Offer Expires:" : "Offer Resumes In:"}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="bg-neon-cyan/20 border border-neon-cyan/40 rounded px-1.5 py-0.5 sm:px-2 sm:py-1">
                <span className="text-white font-bold text-xs">{String(timeLeft.hours).padStart(2, '0')}</span>
              </div>
              <span className="text-neon-cyan font-bold text-xs">:</span>
              <div className="bg-neon-magenta/20 border border-neon-magenta/40 rounded px-1.5 py-0.5 sm:px-2 sm:py-1">
                <span className="text-white font-bold text-xs">{String(timeLeft.minutes).padStart(2, '0')}</span>
              </div>
              <span className="text-neon-magenta font-bold text-xs">:</span>
              <div className="bg-neon-blue/20 border border-neon-blue/40 rounded px-1.5 py-0.5 sm:px-2 sm:py-1">
                <span className="text-white font-bold text-xs">{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>
            </div>
          </div>

          {/* Scrolling Banner Content */}
          <div className="flex-1 mx-4 sm:mx-8 overflow-hidden relative">
            <motion.div
              className="flex items-center whitespace-nowrap"
              ref={scrollContentRef}
              animate={{
                x: contentWidth ? [0, -contentWidth] : 0
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: bannerItems.length * 4,
                  ease: "linear",
                },
              }}
            >
              <div ref={measureRef} className="absolute inset-y-0 left-0 flex items-center whitespace-nowrap opacity-0 pointer-events-none">
                 {bannerItems.map((item, index) => (
                    <div key={`measure-${index}`} className="flex items-center space-x-3 mr-8 sm:mr-12">
                      <div className="h-4 w-4 flex-shrink-0"></div>
                      <span className="text-sm sm:text-base font-medium">{item.text}</span>
                      <span className="px-3 py-1 rounded-full text-xs font-bold flex-shrink-0">{item.highlight}</span>
                      <div className="w-2 h-2 rounded-full mx-4 flex-shrink-0"></div>
                    </div>
                  ))}
              </div>

              {/* Only show banner items if offer is active */}
              {isOfferActive ? (
                bannerItems.concat(bannerItems).map((item, index) => (
                  <div key={`visible-${index}`} className="flex items-center space-x-3 mr-8 sm:mr-12">
                    <div className="text-neon-cyan flex-shrink-0">
                      {item.icon}
                    </div>
                    <span className="text-white text-sm sm:text-base font-medium">
                      {item.text}
                    </span>
                    <span className="bg-gradient-to-r from-neon-magenta to-neon-pink text-white px-3 py-1 rounded-full text-xs font-bold flex-shrink-0">
                      {item.highlight}
                    </span>
                    <div className="w-2 h-2 bg-neon-cyan/50 rounded-full mx-4 flex-shrink-0"></div>
                  </div>
                ))
              ) : (
                // Display a static message when the offer is inactive
                <div className="flex items-center justify-center w-full text-white text-base sm:text-lg font-semibold">
                  Offer temporarily unavailable. Please check back soon!
                </div>
              )}
            </motion.div>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block flex-shrink-0">
            <button
              className={`bg-gradient-to-r from-neon-cyan to-neon-blue text-white px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 shadow-lg ${isOfferActive ? 'hover:from-cyan-400 hover:to-blue-400 hover:shadow-neon-cyan/50 hover:scale-105' : 'opacity-50 cursor-not-allowed'}`}
              onClick={() => { /* See functionality below */ }}
              disabled={!isOfferActive}
            >
              Claim Offer
            </button>
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="lg:hidden mt-3 text-center">
          <button
            className={`bg-gradient-to-r from-neon-cyan to-neon-blue text-white px-6 py-2 rounded-lg font-bold text-sm transition-all duration-300 shadow-lg ${isOfferActive ? 'hover:from-cyan-400 hover:to-blue-400' : 'opacity-50 cursor-not-allowed'}`}
            onClick={() => { /* See functionality below */ }}
            disabled={!isOfferActive}
          >
            Claim Limited Time Offer
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;