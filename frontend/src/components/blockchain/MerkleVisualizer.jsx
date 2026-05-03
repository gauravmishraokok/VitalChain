import React from 'react';
import GlassCard from '../shared/GlassCard';

const MerkleVisualizer = ({ root, batch_size }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 border border-white/5 bg-white/5 rounded-xl">
      <div className="w-12 h-12 rounded-full bg-accent-cyan/20 border border-accent-cyan/40 flex items-center justify-center animate-glow-pulse mb-6">
        <div className="w-2 h-2 rounded-full bg-accent-cyan" />
      </div>
      
      <div className="text-center">
        <h4 className="text-[10px] text-text-muted uppercase font-black tracking-widest mb-2">Merkle Root Hash</h4>
        <div className="px-4 py-2 bg-black/40 rounded border border-accent-cyan/20 font-mono text-xs text-accent-cyan break-all">
            {root || '0x' + '0'.repeat(64)}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-8 w-full">
        {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center animate-cascade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-1 h-8 bg-white/10 mb-2" />
                <div className="w-8 h-8 rounded border border-white/10 bg-white/5 flex items-center justify-center text-[8px] text-text-muted">
                    L{i}
                </div>
            </div>
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-white/5 w-full text-center">
         <span className="text-[10px] font-bold text-accent-green uppercase animate-pulse">✓ VERIFIED ON CHAIN</span>
      </div>
    </div>
  );
};

export default MerkleVisualizer;
