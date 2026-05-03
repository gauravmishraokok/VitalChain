const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const Device = require('../models/Device');
const BlockchainLog = require('../models/BlockchainLog');
const socketService = require('../services/socketService');
const alertService = require('../services/alertService');

// POST /api/gateway/ingest
// Internal service call - NO JWT REQUIRED
router.post('/ingest', async (req, res) => {
    console.log(`[INGEST] Data received from device: ${req.body.bundle?.device_id}`);
    try {
        const { bundle, alert, auth, processing_ms } = req.body;

        // Process and save alert (emits socket events internally)
        const savedAlert = await alertService.processAlert({
            ...alert,
            device_id: bundle.device_id,
            device_did: auth.device_did,
            vitals_snapshot: alert.vitals_snapshot,
            mmae_score: alert.mmae_result.anomaly_score,
            svm_score: alert.svm_result.decision_score
        });

        // Update Device last_seen
        await Device.findOneAndUpdate(
            { device_id: bundle.device_id },
            { 
                last_seen: new Date(),
                device_did: auth.device_did
            },
            { upsert: true }
        );

        // Emit vitals update
        socketService.emit('vitals:update', {
            device_id: bundle.device_id,
            vitals: {
                hr: bundle.heart_rate,
                spo2: bundle.spo2,
                temp: bundle.temperature,
                ecg_samples: bundle.ecg_samples
            },
            alert: savedAlert,
            auth: auth,
            timestamp: bundle.timestamp
        });

        // Emit auth event
        socketService.emit('auth:event', {
            device_id: bundle.device_id,
            trust_overhead_ms: auth.trust_overhead_ms,
            status: auth.valid ? 'verified' : 'denied'
        });

        res.json({ status: "ok", saved: true });
    } catch (err) {
        console.error('Ingest error:', err);
        res.status(500).json({ status: "error", message: err.message });
    }
});

// POST /api/gateway/blockchain-event
// Internal service call - NO JWT REQUIRED
router.post('/blockchain-event', async (req, res) => {
    try {
        const logData = req.body;
        
        if (logData.error) {
            console.warn('[BACKEND] Blockchain OFFLINE, skipping log:', logData.error);
            // Still emit a degraded event so the UI shows something
            socketService.emit('blockchain:commit', {
                tx_hash: null,
                merkle_root: logData.merkle_root,
                ipfs_cid: logData.ipfs_cid,
                batch_size: logData.batch_size,
                status: 'offline'
            });
            return res.status(200).json({ status: "blockchain_offline" });
        }

        // Only save to DB if we have a valid tx_hash
        if (!logData.tx_hash) {
            return res.status(200).json({ status: "skipped_no_tx_hash" });
        }

        // Save BlockchainLog to MongoDB
        const newLog = new BlockchainLog({
            tx_hash: logData.tx_hash,
            block_number: logData.block_number,
            merkle_root: logData.merkle_root,
            ipfs_cid: logData.ipfs_cid,
            device_did: logData.device_did,
            batch_size: logData.batch_size,
            gas_used: logData.gas_used,
            timestamp: logData.timestamp ? new Date(logData.timestamp * 1000) : new Date()
        });
        await newLog.save();

        // Emit socket event
        socketService.emit('blockchain:commit', newLog);

        res.json({ status: "ok" });
    } catch (err) {
        console.error('Blockchain event error:', err);
        res.status(500).json({ status: "error", message: err.message });
    }
});

module.exports = router;
