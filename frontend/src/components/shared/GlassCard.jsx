import React from 'react';

const GlassCard = ({ children, className = '', glowColor = 'var(--accent-cyan)', animate = false }) => {
  return (
    <div 
      className={`glass-panel p-4 relative overflow-hidden transition-all duration-300 ${animate ? 'animate-cascade-in' : ''} ${className}`}
      style={{
        '--glow-color': glowColor,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }}
    >
      {/* Corner Accent */}
      <div 
        className="absolute top-0 right-0 w-16 h-16 opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle at top right, ${glowColor}, transparent 70%)`
        }}
      />
      
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Dynamic Glow Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-5 transition-opacity duration-500"
        style={{ backgroundColor: glowColor }}
      />
    </div>
  );
};

export default GlassCard;
