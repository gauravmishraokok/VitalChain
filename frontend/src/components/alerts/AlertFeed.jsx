import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldAlert, CheckCircle } from 'lucide-react';
import axios from 'axios';

const AlertCard = ({ alert }) => {
  const handleAcknowledge = async () => {
    try {
      await axios.patch(`/api/alerts/${alert.alert_id}/acknowledge`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    } catch (err) {
      console.error('Failed to acknowledge alert', err);
    }
  };

  const getBorderColor = () => {
    if (alert.alert_level === 1) return 'border-accent-red';
    if (alert.alert_level === 2) return 'border-accent-amber';
    return 'border-accent-cyan/30';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`p-4 mb-3 glass-panel border-l-4 ${getBorderColor()} ${alert.alert_level === 1 ? 'animate-shake' : ''}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{alert.device_id}</span>
          <h4 className={`text-sm font-black ${alert.alert_level === 1 ? 'text-accent-red' : 'text-text-primary'}`}>
            {alert.alert_label}
          </h4>
        </div>
        <span className="text-[10px] text-text-muted">{new Date(alert.timestamp).toLocaleTimeString()}</span>
      </div>
      
      <p className="text-xs text-text-primary/80 mb-3 leading-relaxed">{alert.clinical_note}</p>
      
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
        <div className="flex gap-2 items-center">
            {alert.is_trusted ? (
                <span className="flex items-center gap-1 text-[9px] font-bold text-accent-green bg-accent-green/10 px-1.5 py-0.5 rounded">
                    <Shield className="w-2.5 h-2.5" /> TRUSTED
                </span>
            ) : (
                <span className="flex items-center gap-1 text-[9px] font-bold text-accent-red bg-accent-red/10 px-1.5 py-0.5 rounded animate-pulse">
                    <ShieldAlert className="w-2.5 h-2.5" /> NON-TRUSTED
                </span>
            )}
        </div>
        
        {!alert.acknowledged && (
            <button 
                onClick={handleAcknowledge}
                disabled={!alert.is_trusted}
                className={`text-[9px] font-bold uppercase tracking-tighter px-3 py-1 rounded transition-all
                    ${alert.is_trusted ? 'bg-accent-cyan/20 text-accent-cyan hover:bg-accent-cyan/40' : 'bg-white/5 text-text-muted cursor-not-allowed'}
                `}
            >
                Acknowledge
            </button>
        )}
        {alert.acknowledged && (
            <span className="text-[9px] text-accent-green flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> ACKNOWLEDGED
            </span>
        )}
      </div>
    </motion.div>
  );
};

const AlertFeed = ({ alerts }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-xs font-black text-text-primary uppercase tracking-widest">Incident Response Feed</h3>
        <span className="text-[10px] text-text-muted bg-white/5 px-2 py-0.5 rounded-full">{alerts.length} events</span>
      </div>
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence initial={false}>
          {alerts.map(alert => (
            <AlertCard key={alert.alert_id} alert={alert} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AlertFeed;
