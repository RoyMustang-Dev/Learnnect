import React, { ReactNode } from 'react';

interface FeatureProps {
  feature: {
    id: string;
    title: string;
    description: string;
    icon: ReactNode;
  };
}

const FeatureCard: React.FC<FeatureProps> = ({ feature }) => {
  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-neon-black/80 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-neon-cyan/30 hover:border-neon-cyan/60 transition-all duration-300 hover:scale-105 backdrop-blur-sm relative group h-full" style={{boxShadow: '0 0 15px rgba(0,255,255,0.2)'}}>
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-neon-magenta/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg sm:rounded-xl"></div>

      <div className="relative z-10">
        <div className="mb-3 sm:mb-4 flex justify-center">
          <div className="p-2.5 sm:p-3 rounded-full bg-neon-cyan/20 border border-neon-cyan/40" style={{boxShadow: '0 0 15px rgba(0,255,255,0.3)'}}>
            {feature.icon}
          </div>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-neon-cyan mb-2 text-center" style={{textShadow: '0 0 10px rgba(0,255,255,0.5)'}}>{feature.title}</h3>
        <p className="text-sm sm:text-base text-cyan-200/80 text-center leading-relaxed">{feature.description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;