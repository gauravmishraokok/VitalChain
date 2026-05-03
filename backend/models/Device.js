const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
    device_id: { type: String, unique: true },
    device_did: String,
    entity_type: { type: String, default: "device" },
    patient_alias: String,   // anonymized, e.g. "Patient-A1"
    is_active: { type: Boolean, default: true },
    last_seen: Date,
    vc_issued: { type: Boolean, default: false },
    registered_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Device', DeviceSchema);
