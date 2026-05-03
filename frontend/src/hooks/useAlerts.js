import { useState, useEffect } from 'react';
import { useSocket } from './useSocket';

export const useAlerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [criticalAlert, setCriticalAlert] = useState(null);
    const { on } = useSocket();

    useEffect(() => {
        const cleanupCritical = on('alert:critical', (alert) => {
            setAlerts(prev => [alert, ...prev].slice(0, 50));
            setCriticalAlert(alert);
            // Audio alert for critical events could go here
        });

        const cleanupWarning = on('alert:warning', (alert) => {
            setAlerts(prev => [alert, ...prev].slice(0, 50));
        });

        const cleanupInfo = on('alert:info', (alert) => {
            setAlerts(prev => [alert, ...prev].slice(0, 50));
        });

        const cleanupAck = on('alert:acknowledged', (ackAlert) => {
            setAlerts(prev => prev.map(a => 
                a.alert_id === ackAlert.alert_id ? { ...a, acknowledged: true } : a
            ));
        });

        return () => {
            cleanupCritical();
            cleanupWarning();
            cleanupInfo();
            cleanupAck();
        };
    }, [on]);

    const clearCritical = () => setCriticalAlert(null);

    return { alerts, criticalAlert, clearCritical };
};
