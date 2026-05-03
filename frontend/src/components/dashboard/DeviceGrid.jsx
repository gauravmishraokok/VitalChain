import React from 'react';
import GlassCard from '../shared/GlassCard';
import VitalCard from './VitalCard';
import ECGOscilloscope from './ECGOscilloscope';
import TrustMeter from '../auth/TrustMeter';
import ResearchTag from '../shared/ResearchTag';

const DevicePanel = ({ id, data }) => {
  return (
    <GlassCard className="mb-4" glowColor={data.is_anomaly ? 'var(--accent-red)' : 'var(--accent-cyan)'}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-sm font-black text-white">{id}</h3>
          <p className="text-[9px] text-text-muted font-mono truncate max-w-[150px]">{data.device_did}</p>
        </div>
        <div className="text-right">
           <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${data.is_valid ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-red/10 text-accent-red'}`}>
             {data.is_valid ? 'DID VERIFIED' : 'AUTH FAILED'}
           </span>
        </div>
      </div>

      <ECGOscilloscope 
        ecg_buffer={data.ecg_buffer} 
        is_anomaly={data.is_anomaly}
      />

      <div className="grid grid-cols-3 gap-2 mt-4">
        <VitalCard label="Heart Rate" value={data.hr} unit="BPM" is_anomaly={data.alert_label === 'CRITICAL' && data.hr > 150} method="GAN_MOCK" />
        <VitalCard label="SpO2" value={data.spo2} unit="%" is_anomaly={data.spo2 < 90} method="BETA_DIST" />
        <VitalCard label="Temp" value={data.temp} unit="°C" is_anomaly={data.temp > 38} method="VAE_MOCK" />
      </div>

      <div className="mt-4 flex justify-between items-center border-t border-white/5 pt-3">
        <div className="flex flex-col">
            <span className="text-[8px] text-text-muted uppercase font-bold mb-1">Latency Overhead</span>
            <TrustMeter value={data.trust_overhead_ms} />
        </div>
        <div className="flex flex-col items-end">
             <span className="text-[8px] text-text-muted uppercase font-bold mb-1">Methodology</span>
             <ResearchTag label="MMAE-ECG Transformer" />
        </div>
      </div>
    </GlassCard>
  );
};

const DeviceGrid = ({ devices }) => {
  const deviceIds = Object.keys(devices);
  
  if (deviceIds.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-text-muted italic text-sm">
        Waiting for device streams...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {deviceIds.map(id => (
        <DevicePanel key={id} id={id} data={devices[id]} />
      ))}
    </div>
  );
};

export default DeviceGrid;
