import React from 'react';
import AnimatedNumber from '../shared/AnimatedNumber';
import ResearchTag from '../shared/ResearchTag';

const VitalCard = ({ label, value, unit, is_anomaly, method, color = 'var(--accent-cyan)' }) => {
  return (
    <div className={`relative p-3 rounded-lg border border-white/5 bg-white/5 ${is_anomaly ? 'animate-critical-flash border-accent-red/50' : ''}`}>
      <div className="flex justify-between items-start mb-1">
        <span className="text-text-muted text-[10px] uppercase font-bold tracking-wider">{label}</span>
        {is_anomaly && (
          <div className="w-2 h-2 rounded-full bg-accent-red animate-pulse-ring" />
        )}
      </div>
      
      <div className="flex items-baseline gap-1">
        <AnimatedNumber 
          value={value} 
          className={`text-2xl font-black ${is_anomaly ? 'text-accent-red' : 'text-text-primary'}`}
        />
        <span className="text-text-muted text-xs font-medium">{unit}</span>
      </div>
      
      {method && (
        <div className="mt-2">
          <ResearchTag label={method} />
        </div>
      )}
    </div>
  );
};

export default VitalCard;
