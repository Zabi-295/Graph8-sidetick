import React from 'react';

interface Graph8LogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const Graph8Logo: React.FC<Graph8LogoProps> = ({ 
  className = '', 
  size = 24, 
  glow = false 
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center select-none flex-shrink-0 group ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Animated Gradient Glow */}
      {glow && (
        <div 
          className="absolute -inset-1 rounded-full opacity-60 blur-md animate-pulse-subtle pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.45) 0%, rgba(155, 81, 224, 0.45) 50%, rgba(255, 42, 133, 0.45) 100%)'
          }}
        />
      )}
      
      {/* Exact Graph8 Logo Image */}
      <img
        src="/graph8-logo.png"
        alt="Graph8"
        className="relative z-10 w-full h-full object-contain filter drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
      />
    </div>
  );
};
