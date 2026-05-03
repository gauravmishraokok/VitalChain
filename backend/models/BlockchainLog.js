const mongoose = require('mongoose');

const BlockchainLogSchema = new mongoose.Schema({
    tx_hash: { type: String, unique: true },
    block_number: Number,
    merkle_root: String,
    ipfs_cid: String,
    device_did: String,
    batch_size: Number,
    gas_used: Number,
    timestamp: Date,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BlockchainLog', BlockchainLogSchema);
