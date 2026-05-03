import React, { useState, useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket';
import AnimatedNumber from '../shared/AnimatedNumber';

const SystemStats = () => {
  const [stats, setStats] = useState({ tps: 0, queue_depth: 0, anomaly_rate: 0 });
  const { on } = useSocket();

  useEffect(() => {
    const unsubscribe = on('system:stats', (newStats) => {
      setStats(newStats);
    });
    return () => unsubscribe();
  }, [on]);

  return (
    <div className="hidden md:flex gap-8 items-center">
      <div className="flex flex-col">
        <span className="text-[8px] text-text-muted uppercase font-bold tracking-widest">Throughput (TPS)</span>
        <div className="flex items-center gap-1">
            <AnimatedNumber value={stats.tps} className="text-sm font-black text-accent-cyan" />
            <div className="w-1 h-1 rounded-full bg-accent-cyan animate-pulse" />
        </div>
      </div>
      
      <div className="flex flex-col border-l border-white/10 pl-8">
        <span className="text-[8px] text-text-muted uppercase font-bold tracking-widest">Buffer Depth</span>
        <div className="flex items-center gap-1">
            <AnimatedNumber value={stats.queue_depth} className="text-sm font-black text-accent-amber" />
            <span className="text-[9px] text-text-muted uppercase">msgs</span>
        </div>
      </div>

      <div className="flex flex-col border-l border-white/10 pl-8">
        <span className="text-[8px] text-text-muted uppercase font-bold tracking-widest">Anomaly Rate</span>
        <div className="flex items-center gap-1">
            <AnimatedNumber value={stats.anomaly_rate * 100} className="text-sm font-black text-accent-red" />
            <span className="text-[9px] text-text-muted">%</span>
        </div>
      </div>
    </div>
  );
};

export default SystemStats;
