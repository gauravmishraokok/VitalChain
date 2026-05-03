const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
    alert_id: { type: String, required: true, unique: true },
    device_id: String,
    device_did: String,
    timestamp: Date,
    alert_level: { type: Number, enum: [1, 2, 3] },
    alert_label: { type: String, enum: ["CRITICAL", "WARNING", "INFO"] },
    is_anomaly: Boolean,
    is_trusted: { type: Boolean, default: true },
    anomaly_type: String,
    clinical_note: String,
    vitals_snapshot: {
        hr: Number,
        spo2: Number,
        temp: Number
    },
    mmae_score: Number,
    svm_score: Number,
    acknowledged: { type: Boolean, default: false },
    acknowledged_by: String,
    blockchain_tx: String,   // tx hash when logged
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', AlertSchema);
