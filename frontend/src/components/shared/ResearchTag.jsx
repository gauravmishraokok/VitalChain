import React from 'react';

const ResearchTag = ({ label }) => {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold tracking-tighter bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 uppercase">
      {label}
    </span>
  );
};

export default ResearchTag;
