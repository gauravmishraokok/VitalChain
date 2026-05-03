const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    patient_alias: { type: String, unique: true },
    age: Number,
    gender: String,
    condition: String,
    device_id: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', PatientSchema);
