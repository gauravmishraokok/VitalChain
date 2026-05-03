import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Database, Share2, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const Navigation = ({ onLogout }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: <LayoutDashboard size={18} />, label: 'Monitor' },
    { path: '/audit', icon: <Database size={18} />, label: 'Audit Trail' },
    { path: '/animation', icon: <Share2 size={18} />, label: 'Architecture' },
  ];

  return (
    <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4 p-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className="relative group"
          >
            <div className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center
              ${isActive ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.5)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              {item.icon}
            </div>
            
            {/* Tooltip */}
            <div className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
              {item.label}
            </div>

            {isActive && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-cyan-500 rounded-xl -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
      
      <div className="h-px bg-white/10 my-2 mx-2" />
      
      <button
        onClick={onLogout}
        className="p-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 flex items-center justify-center group relative"
      >
        <LogOut size={18} />
        <div className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
          Logout
        </div>
      </button>
    </nav>
  );
};

export default Navigation;
