import React, { useEffect, useState } from 'react';
import { useAlerts } from '../../hooks/useAlerts';
import { AlertTriangle } from 'lucide-react';

const CriticalOverlay = () => {
  const { criticalAlert, clearCritical } = useAlerts();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (criticalAlert) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        clearCritical();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [criticalAlert, clearCritical]);

  if (!visible || !criticalAlert) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center bg-accent-red/20 animate-critical-flash">
      <div className="text-center p-8 glass-panel border-accent-red bg-bg-deep/80 animate-shake pointer-events-auto">
        <AlertTriangle className="w-16 h-16 text-accent-red mx-auto mb-4" />
        <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Critical Alert Detected</h2>
        <p className="text-accent-red font-bold text-lg mb-4">{criticalAlert.device_id}</p>
        <p className="text-text-primary opacity-80 max-w-md mx-auto">{criticalAlert.clinical_note}</p>
      </div>
    </div>
  );
};

export default CriticalOverlay;
