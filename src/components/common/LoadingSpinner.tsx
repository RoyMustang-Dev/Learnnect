import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text = 'Loading...'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="min-h-[60vh] bg-gradient-to-br from-neon-black via-gray-900 to-neon-black flex items-center justify-center">
      {/* Enhanced Background effects matching HomePage */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-neon-magenta/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-4">
        {/* Spinner */}
        <div className="relative">
          <div
            className={`${sizeClasses[size]} border-4 border-white/20 border-t-neon-cyan rounded-full animate-spin`}
          ></div>
          <div
            className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-r-neon-magenta rounded-full animate-spin`}
            style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
          ></div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <p className="text-neon-cyan font-medium">{text}</p>
          <div className="flex space-x-1 mt-2">
            <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-neon-magenta rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
