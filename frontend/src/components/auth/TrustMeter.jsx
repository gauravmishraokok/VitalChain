import React from 'react';

const TrustMeter = ({ value = 0 }) => {
  // value is trust_overhead_ms. Normal ~75ms.
  const percentage = Math.min((value / 200) * 100, 100);
  
  const getColor = () => {
    if (value < 80) return 'var(--accent-green)';
    if (value < 150) return 'var(--accent-amber)';
    return 'var(--accent-red)';
  };

  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full transition-all duration-500"
          style={{ width: `${percentage}%`, backgroundColor: getColor() }}
        />
      </div>
      <span className="text-[10px] font-mono font-bold" style={{ color: getColor() }}>
        {value.toFixed(1)}ms
      </span>
    </div>
  );
};

export default TrustMeter;
