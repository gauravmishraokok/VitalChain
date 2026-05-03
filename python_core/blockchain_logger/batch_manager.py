from .merkle_tree import MerkleTree
from .ipfs_client import IPFSClient
from .eth_client import EthClient
import time
import threading
import json
import hashlib

class BatchManager:
    def __init__(self, eth_client: EthClient, ipfs_client: IPFSClient, flush_interval=10, batch_size=10):
        self.eth = eth_client
        self.ipfs = ipfs_client
        self.flush_interval = flush_interval
        self.batch_size = batch_size
        self.buffer = []
        self.lock = threading.Lock()
        self._flush_callback = None
        
        # Start flush thread
        self.flush_thread = threading.Thread(target=self._timer_worker, daemon=True)
        self.flush_thread.start()

    def set_flush_callback(self, callback):
        self._flush_callback = callback

    def add_record(self, record):
        with self.lock:
            self.buffer.append(record)
            if len(self.buffer) >= self.batch_size:
                # Trigger immediate flush in a separate thread to not block the caller
                threading.Thread(target=self._flush, daemon=True).start()

    def _timer_worker(self):
        while True:
            time.sleep(self.flush_interval)
            self._flush()

    def _flush(self):
        with self.lock:
            if not self.buffer:
                return
            batch = list(self.buffer)
            self.buffer = []

        # 1. Build Merkle Tree
        tree = MerkleTree(batch)
        merkle_root = tree.get_root()
        
        # 2. Store batch on IPFS (Mock)
        ipfs_cid = self.ipfs.store_batch(batch)
        
        # 3. Anchor to Ethereum
        # Get first device DID from the batch for logging
        device_did = batch[0].get("auth", {}).get("device_did", "unknown")
        
        tx_result = self.eth.log_batch(merkle_root, ipfs_cid, device_did, len(batch))
        
        if "error" in tx_result:
            print(f"[BATCH] BLOCKCHAIN OFFLINE: {tx_result['error']}")
        else:
            print(f"[BATCH] Flushed {len(batch)} records -> root={merkle_root[:16]}... tx={tx_result['tx_hash'][:16]}...")
            
        # Emit event (via callback) with tx_result
        if self._flush_callback:
            self._flush_callback({
                "merkle_root": merkle_root,
                "ipfs_cid": ipfs_cid,
                "tx_hash": tx_result.get("tx_hash"),
                "block_number": tx_result.get("block_number"),
                "gas_used": tx_result.get("gas_used"),
                "batch_size": len(batch),
                "device_did": device_did,
                "timestamp": time.time()
            })
