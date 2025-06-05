interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'glow' | 'minimal';
  className?: string;
  animated?: boolean;
}

const Logo = ({ size = 'md', variant = 'glow', className = '', animated = false }: LogoProps) => {
  const sizeClasses = {
    sm: 'h-8 w-auto sm:h-9',
    md: 'h-10 w-auto sm:h-12',
    lg: 'h-12 w-auto sm:h-16',
    xl: 'h-16 w-auto sm:h-20'
  };

  // Enhanced styling for the updated logo
  const getLogoStyle = () => {
    const baseStyle = {
      imageRendering: 'crisp-edges' as const,
      transition: 'all 0.3s ease',
    };

    // If animated, let CSS handle the filter effects
    if (animated) {
      return baseStyle;
    }

    switch (variant) {
      case 'glow':
        return {
          ...baseStyle,
          filter: `
            brightness(1.1)
            contrast(1.15)
            saturate(1.2)
            drop-shadow(0 0 8px rgba(0, 200, 255, 0.6))
            drop-shadow(0 0 16px rgba(255, 0, 119, 0.4))
            drop-shadow(0 0 24px rgba(0, 245, 255, 0.3))
          `,
        };
      case 'minimal':
        return {
          ...baseStyle,
          filter: `
            brightness(1.05)
            contrast(1.1)
            saturate(1.1)
            drop-shadow(0 2px 8px rgba(0, 200, 255, 0.4))
          `,
        };
      default:
        return {
          ...baseStyle,
          filter: 'brightness(1.05) contrast(1.05) saturate(1.05)',
        };
    }
  };

  const getContainerStyle = () => {
    if (animated) {
      return {
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      };
    }
    return {};
  };

  return (
    <div
      className={`flex items-center ${className}`}
      style={getContainerStyle()}
    >
      <img
        src="/assets/learnnect-logo_gradient.png"
        alt="Learnnect"
        className={`${sizeClasses[size]} transition-all duration-300 hover:scale-105 cursor-pointer ${animated ? 'animate-logo-glow' : ''}`}
        style={getLogoStyle()}
        onError={(e) => {
          console.error('Logo failed to load:', e);
          // Fallback to text if image fails
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
};

export default Logo;