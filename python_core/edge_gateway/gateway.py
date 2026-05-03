import paho.mqtt.client as mqtt
import json
import requests
import time
import threading
import logging
from queue import Queue, Empty
import os
import sys

# Add project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from python_core.auth_engine.bootstrap import load_auth_state
from python_core.auth_engine.auth_client import AuthClient
from python_core.auth_engine.did_registry import DIDRegistry
from python_core.auth_engine.regulator import Regulator
from python_core.anomaly_detector.anomaly_decision_manager import AnomalyDecisionManager
from python_core.blockchain_logger.batch_manager import BatchManager
from python_core.blockchain_logger.eth_client import EthClient
from python_core.blockchain_logger.ipfs_client import IPFSClient
from .network_monitor import NetworkMonitor

class EdgeGateway:
    def __init__(self):
        self.queue = Queue()
        self.backend_url = os.getenv("BACKEND_URL", "http://localhost:5000")
        
        # Load Auth State
        auth_state = load_auth_state()
        self.registry = DIDRegistry()
        self.regulator = Regulator(self.registry)
        self.auth_client = AuthClient(
            auth_state["server_did"], 
            auth_state["server_vc"],
            self.registry,
            self.regulator
        )
        
        # Init Modules
        self.adm = AnomalyDecisionManager()
        self.net_monitor = NetworkMonitor(self.adm)
        
        # Blockchain Logger
        self.eth = EthClient()
        self.ipfs = IPFSClient()
        self.batcher = BatchManager(self.eth, self.ipfs, flush_interval=10, batch_size=5)
        self.batcher.set_flush_callback(self._on_blockchain_commit)
        
        # MQTT
        self.client = mqtt.Client(callback_api_version=mqtt.CallbackAPIVersion.VERSION2)
        self.client.on_connect = self._on_connect
        self.client.on_message = self._on_message
        
    def _on_connect(self, client, userdata, flags, rc, properties=None):
        print("[GATEWAY] Connected to MQTT Broker")
        client.subscribe("medichain/vitals/+/bundle")

    def _on_message(self, client, userdata, msg):
        try:
            payload = json.loads(msg.payload.decode())
            self.queue.put(payload)
        except Exception as e:
            print(f"[GATEWAY] Payload error: {e}")

    def _on_blockchain_commit(self, result):
        try:
            requests.post(f"{self.backend_url}/api/gateway/blockchain-event", json=result, timeout=5)
        except Exception as e:
            print(f"[GATEWAY] Backend unreachable for blockchain event: {e}")

    def _worker(self):
        while True:
            try:
                bundle = self.queue.get(timeout=1)
                self._process_bundle(bundle)
                self.queue.task_done()
            except Empty:
                continue
            except Exception as e:
                print(f"[GATEWAY] Worker error: {e}")

    def _process_bundle(self, bundle):
        start_time = time.time()
        device_id = bundle.get("device_id")
        
        # 1. Network Monitoring (DDoS/Schema)
        self.net_monitor.analyze_traffic(device_id, bundle)
        
        # 2. Identity Verification
        # In this mock, we assume the bundle includes the VC for simplicity
        vc = bundle.get("auth", {}).get("vc")
        is_valid, trust_ms = self.regulator.verify_credential(vc)
        
        # 3. Anomaly Detection
        # Check if network monitor flagged this as intrusion
        intrusion_flag = self.net_monitor.is_suspicious(device_id)
        analysis = self.adm.analyze(bundle, intrusion_flag=intrusion_flag)
        
        # 4. Prepare for Backend
        payload = {
            "bundle": bundle,
            "alert": analysis,
            "auth": {
                "valid": is_valid,
                "trust_overhead_ms": trust_ms,
                "device_did": bundle.get("auth", {}).get("device_did")
            },
            "processing_ms": (time.time() - start_time) * 1000
        }
        
        # 5. Delivery to Backend
        try:
            resp = requests.post(f"{self.backend_url}/api/gateway/ingest", json=payload, timeout=2)
            if resp.status_code == 200:
                # 6. Anchor to Blockchain on success
                self.batcher.add_record(payload)
        except Exception as e:
            print(f"[GATEWAY] Backend delivery failed (buffering): {e}")

    def start(self):
        # Start Worker Threads
        for _ in range(3):
            t = threading.Thread(target=self._worker, daemon=True)
            t.start()
            
        # Start MQTT
        self.client.connect("localhost", 1883, 60)
        self.client.loop_forever()
