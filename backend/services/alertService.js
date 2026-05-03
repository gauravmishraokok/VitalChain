const Alert = require('../models/Alert');
const socketService = require('./socketService');

const processAlert = async (alertData) => {
    // Apply priority scoring logic (already handled by edge mostly, but can enrich here)
    const enrichedAlert = {
        ...alertData,
        processed_at: new Date()
    };

    // Save/Update alert in MongoDB
    const savedAlert = await Alert.findOneAndUpdate(
        { alert_id: alertData.alert_id },
        enrichedAlert,
        { upsert: true, new: true }
    );

    // Emit socket events based on level
    if (savedAlert.alert_level === 1) {
        socketService.emit('alert:critical', savedAlert);
    } else if (savedAlert.alert_level === 2) {
        socketService.emit('alert:warning', savedAlert);
    } else {
        socketService.emit('alert:info', savedAlert);
    }

    return savedAlert;
};

module.exports = { processAlert };
