const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');

class BlockchainService {
    constructor() {
        const rpcUrl = process.env.GANACHE_RPC || 'http://127.0.0.1:8545';
        this.web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
        
        // Paths relative to project root (f:\Code\VitalChain\)
        // Since this file is in f:\Code\VitalChain\backend\services\
        // The project root is ../../
        const projectRoot = path.join(__dirname, '..', '..');
        const abiPath = path.join(projectRoot, 'contracts', 'abi', 'MedicalAudit.json');
        const addrPath = path.join(projectRoot, 'contracts', 'deployed_address.json');

        try {
            if (fs.existsSync(abiPath) && fs.existsSync(addrPath)) {
                const abiData = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
                const abi = abiData.abi || abiData; // support both { abi: [...] } and bare arrays
                const addresses = JSON.parse(fs.readFileSync(addrPath, 'utf8'));
                const address = addresses.MedicalAudit;
                this.contract = new this.web3.eth.Contract(abi, address);
                console.log(`Blockchain service connected to contract at ${address}`);
            } else {
                console.warn('Blockchain contract artifacts not found. Deployment required.');
            }
        } catch (err) {
            console.error('Error initializing BlockchainService:', err);
        }
    }

    async verifyRoot(merkleRoot) {
        if (!this.contract) return { error: 'Contract not initialized' };
        
        try {
            // Merkle root must be converted to hex bytes
            const rootHex = merkleRoot.startsWith('0x') ? merkleRoot : '0x' + merkleRoot;
            const result = await this.contract.methods.verifyRoot(rootHex).call();
            
            return {
                exists: result[0],
                timestamp: result[1].toString(),
                logIndex: result[2].toString()
            };
        } catch (err) {
            console.error('Error verifying root:', err);
            return { error: err.message };
        }
    }
}

module.exports = new BlockchainService();
