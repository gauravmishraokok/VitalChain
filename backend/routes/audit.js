const express = require('express');
const router = express.Router();
const BlockchainLog = require('../models/BlockchainLog');
const Alert = require('../models/Alert');
const auth = require('../middleware/authMiddleware');
const blockchainService = require('../services/blockchainService');

// GET /api/audit/logs
router.get('/logs', auth, async (req, res) => {
    try {
        const { limit = 50, skip = 0 } = req.query;
        const logs = await BlockchainLog.find()
            .sort({ timestamp: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));
        res.json(logs);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// GET /api/audit/verify/:merkle_root
router.get('/verify/:merkle_root', auth, async (req, res) => {
    try {
        const result = await blockchainService.verifyRoot(req.params.merkle_root);
        const dbLog = await BlockchainLog.findOne({ merkle_root: req.params.merkle_root });
        
        res.json({
            exists: result.exists,
            on_chain_timestamp: result.timestamp,
            block_number: dbLog ? dbLog.block_number : null,
            ipfs_cid: dbLog ? dbLog.ipfs_cid : null
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// GET /api/audit/proof/:alert_id
router.get('/proof/:alert_id', auth, async (req, res) => {
    try {
        const alert = await Alert.findOne({ alert_id: req.params.alert_id });
        if (!alert) return res.status(404).json({ msg: 'Alert not found' });
        
        // In a real scenario, we'd fetch the batch from IPFS and re-build the tree
        // Here we mock the return for frontend visualization
        res.json({
            root: "0x" + Math.random().toString(16).slice(2, 66),
            proof: [
                { hash: "0x" + Math.random().toString(16).slice(2, 66), position: "right" },
                { hash: "0x" + Math.random().toString(16).slice(2, 66), position: "left" }
            ],
            leaf_index: 0
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;
