const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const auth = require('../middleware/authMiddleware');

// GET /api/devices
router.get('/', auth, async (req, res) => {
    try {
        const devices = await Device.find().sort({ last_seen: -1 });
        res.json(devices);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// GET /api/devices/:id
router.get('/:id', auth, async (req, res) => {
    try {
        const device = await Device.findOne({ device_id: req.params.id });
        if (!device) return res.status(404).json({ msg: 'Device not found' });
        res.json(device);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;
