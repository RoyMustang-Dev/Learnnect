import React from 'react';
import { Quote } from 'lucide-react';

interface TestimonialProps {
  testimonial: {
    id: string;
    title?: string;
    name?: string;
    role: string;
    content: string;
    avatar: string;
  };
}

const TestimonialCard: React.FC<TestimonialProps> = ({ testimonial }) => {
  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-neon-black/80 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-neon-magenta/30 hover:border-neon-magenta/60 transition-all duration-300 hover:scale-105 backdrop-blur-sm relative group h-full" style={{boxShadow: '0 0 15px rgba(255,0,255,0.2)'}}>
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-magenta/5 to-neon-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg sm:rounded-xl"></div>

      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-neon-magenta/30">
        <Quote className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />
      </div>

      <div className="relative z-10">
        <p className="text-sm sm:text-base text-cyan-200/90 mb-4 sm:mb-6 italic leading-relaxed pr-8 sm:pr-12">"{testimonial.content}"</p>

        <div className="flex items-center">
          <img
            src={testimonial.avatar}
            alt={testimonial.title || testimonial.name || 'Learning benefit'}
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover mr-3 sm:mr-4 border-2 border-neon-cyan/50"
            style={{boxShadow: '0 0 10px rgba(0,255,255,0.3)'}}
          />
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-neon-cyan" style={{textShadow: '0 0 10px rgba(0,255,255,0.5)'}}>{testimonial.title || testimonial.name}</h4>
            <p className="text-xs sm:text-sm text-cyan-300/70">{testimonial.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;