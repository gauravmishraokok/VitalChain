const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const Device = require('../models/Device');
const auth = require('../middleware/authMiddleware');
const socketService = require('../services/socketService');

// GET /api/alerts
router.get('/', auth, async (req, res) => {
    try {
        const { device_id, alert_level, limit = 50, skip = 0 } = req.query;
        let query = {};
        if (device_id) query.device_id = device_id;
        if (alert_level) query.alert_level = alert_level;

        const alerts = await Alert.find(query)
            .sort({ timestamp: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));
        
        res.json(alerts);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// GET /api/alerts/stats
// Live-computed stats
router.get('/stats', auth, async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const [
            totalToday,
            criticalToday,
            warningToday,
            totalAnomalies,
            totalTrusted,
            activeDevices
        ] = await Promise.all([
            Alert.countDocuments({ createdAt: { $gte: startOfDay } }),
            Alert.countDocuments({ createdAt: { $gte: startOfDay }, alert_level: 1 }),
            Alert.countDocuments({ createdAt: { $gte: startOfDay }, alert_level: 2 }),
            Alert.countDocuments({ is_anomaly: true }),
            Alert.countDocuments({ is_trusted: true }),
            Device.countDocuments({ last_seen: { $gte: new Date(Date.now() - 3600000) } }) // seen in last hour
        ]);

        const totalAlerts = await Alert.countDocuments();
        const anomalyRate = totalAlerts > 0 ? (totalAnomalies / totalAlerts) * 100 : 0;
        const trustedPercent = totalAlerts > 0 ? (totalTrusted / totalAlerts) * 100 : 100;

        res.json({
            total_today: totalToday,
            critical_today: criticalToday,
            warning_today: warningToday,
            anomaly_rate_percent: anomalyRate,
            trusted_percent: trustedPercent,
            devices_active: activeDevices
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// PATCH /api/alerts/:alert_id/acknowledge
router.patch('/:alert_id/acknowledge', auth, async (req, res) => {
    try {
        const alert = await Alert.findOneAndUpdate(
            { alert_id: req.params.alert_id },
            { 
                acknowledged: true, 
                acknowledged_by: req.user.id 
            },
            { new: true }
        );

        if (!alert) return res.status(404).json({ msg: 'Alert not found' });

        socketService.emit('alert:acknowledged', alert);
        res.json(alert);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;
