import uuid
import time
from .did_registry import DIDRegistry
from .regulator import Regulator

class AuthClient:
    def __init__(self, server_did: str, server_vc: dict, registry: DIDRegistry, regulator: Regulator):
        self.server_did = server_did
        self.server_vc = server_vc
        self.registry = registry
        self.regulator = regulator

    def authenticate_device(self, device_did: str, device_vc: dict):
        start = time.time()
        is_valid, _ = self.regulator.verify_credential(device_vc)
        trust_overhead_ms = (time.time() - start) * 1000
        return is_valid, trust_overhead_ms
