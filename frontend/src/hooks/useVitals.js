import { useState, useEffect } from 'react';
import { useSocket } from './useSocket';

export const useVitals = () => {
    const [devices, setDevices] = useState({});
    const { on } = useSocket();

    useEffect(() => {
        const unsubscribe = on('vitals:update', (data) => {
            const { device_id, vitals, alert, auth, timestamp } = data;
            
            setDevices(prev => {
                const currentDevice = prev[device_id] || { ecg_buffer: [] };
                
                // Keep a rolling 200-sample buffer for ECG
                const newEcgBuffer = [...currentDevice.ecg_buffer, ...(vitals.ecg_samples || [])].slice(-200);
                
                return {
                    ...prev,
                    [device_id]: {
                        hr: vitals.hr,
                        spo2: vitals.spo2,
                        temp: vitals.temp,
                        ecg_samples: vitals.ecg_samples,
                        ecg_buffer: newEcgBuffer,
                        is_anomaly: alert.is_anomaly,
                        alert_label: alert.alert_label,
                        last_updated: new Date(timestamp),
                        trust_overhead_ms: auth.trust_overhead_ms,
                        device_did: auth.device_did,
                        is_valid: auth.valid,
                        generation_method: data.bundle?.generation_method || "GAN_MOCK"
                    }
                };
            });
        });

        return () => unsubscribe();
    }, [on]);

    return { devices };
};
