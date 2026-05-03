import React, { useRef, useEffect } from 'react';
import { useVitals } from '../hooks/useVitals';
import { useAlerts } from '../hooks/useAlerts';
import DeviceGrid from '../components/dashboard/DeviceGrid';
import AlertFeed from '../components/alerts/AlertFeed';
import SystemStats from '../components/dashboard/SystemStats';
import BlockchainTicker from '../components/blockchain/BlockchainTicker';
import CriticalOverlay from '../components/alerts/CriticalOverlay';
import { Activity, ShieldCheck, Database } from 'lucide-react';

const Dashboard = () => {
  const { devices } = useVitals();
  const { alerts } = useAlerts();
  const canvasRef = useRef(null);

  // Particle Background Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 212, 255, 0.15)';
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.05)';

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-bg-deep overflow-hidden">
      <div className="aura-background" />
      
      {/* Particle Background */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-40" />

      {/* Critical Overlay */}
      <CriticalOverlay />

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Activity className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase leading-none mb-1">
              VitalChain <span className="text-cyan-400">Monitor</span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Real-time Edge Analysis Active</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <SystemStats />
          
          <div className="hidden md:flex gap-4 items-center">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">DID Verified</span>
              </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-84px)]">
        {/* Left Column: Device Grid */}
        <div className="lg:col-span-8 overflow-y-auto pr-2 custom-scrollbar">
          <DeviceGrid devices={devices} />
        </div>

        {/* Right Column: Alert Feed */}
        <div className="lg:col-span-4 h-full overflow-hidden">
          <AlertFeed alerts={alerts} />
        </div>
      </main>

      {/* Footer: Blockchain Ticker */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 h-8 bg-bg-deep/80 backdrop-blur-md border-t border-white/5 flex items-center">
        <div className="flex items-center gap-2 px-4 border-r border-white/10 h-full bg-accent-green/5">
            <Database className="w-3 h-3 text-accent-green" />
            <span className="text-[10px] font-black text-accent-green uppercase whitespace-nowrap">Audit Trail</span>
        </div>
        <BlockchainTicker />
      </footer>
    </div>
  );
};

export default Dashboard;
