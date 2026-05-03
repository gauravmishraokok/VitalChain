import React, { useState, useEffect } from 'react';

const AnimatedNumber = ({ value, duration = 500, className = '' }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let start = displayValue;
    const end = parseFloat(value);
    if (isNaN(end)) {
        setDisplayValue(value);
        return;
    }
    
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function: easeOutExpo
      const ease = 1 - Math.pow(2, -10 * progress);
      const current = start + (end - start) * ease;
      
      setDisplayValue(current.toFixed(1));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span className={className}>{displayValue}</span>;
};

export default AnimatedNumber;
