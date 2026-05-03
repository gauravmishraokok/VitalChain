# VitalChain — Decentralized Wearable Medical IoT Ecosystem

## Research Papers Integrated
- MMAE-ECG (Multi-scale Masking Autoencoder) — anomaly detection
- DID/VC (Decentralized Identity + Verifiable Credentials) — authentication
- GAN/VAE + Differential Privacy — synthetic data generation
- Merkle-tree batching + IPFS — blockchain logging
- Federated Learning with Homomorphic Encryption — (variation 3, mocked)
- Medical Digital Twins — (variation 1, simulated)
- DAO-based triage — (variation 2, local Ethereum)

## Stack
- **Python Core**: data simulation, anomaly detection, auth engine, blockchain logger, edge gateway
- **Backend**: Node.js + Express + MongoDB + Socket.io
- **Frontend**: React + Tailwind (cinematic animated UI)
- **Blockchain**: Ganache (local Ethereum) + Solidity smart contracts
- **Broker**: Mosquitto MQTT

## Quick Start
```bash
# 1. Start Ganache
npx ganache --port 8545

# 2. Deploy contracts
cd contracts && npx hardhat run scripts/deploy.js --network localhost

# 3. Start MQTT broker
mosquitto -c mosquitto.conf

# 4. Start Python edge gateway
cd python_core && python edge_gateway/gateway.py

# 5. Start Python simulators
cd python_core && python data_simulator/simulator.py

# 6. Start backend
cd backend && npm install && npm run dev

# 7. Start frontend
cd frontend && npm install && npm run dev
```

## Module Map
```
MODULE 1: data_simulator     → Synthetic physiological data (GAN/VAE mocked)
MODULE 2: anomaly_detector   → MMAE-ECG + One-Class SVM
MODULE 3: auth_engine        → DID/VC decentralized identity
MODULE 4: blockchain_logger  → Merkle batching + IPFS + Ethereum
MODULE 5: edge_gateway       → MQTT ingestion + orchestration
MODULE 6: backend            → MERN API + Socket.io
MODULE 7: frontend           → Animated React dashboard
MODULE 8: contracts          → Solidity smart contracts
```
