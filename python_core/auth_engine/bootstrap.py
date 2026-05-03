import json
import os
import uuid
from .did_registry import DIDRegistry
from .regulator import Regulator

def get_base_path():
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def load_auth_state() -> dict:
    base_path = get_base_path()
    auth_state_path = os.path.join(base_path, "auth_state.json")
    if not os.path.exists(auth_state_path):
        bootstrap_auth_system()
    with open(auth_state_path, "r") as f:
        return json.load(f)

def bootstrap_auth_system():
    base_path = get_base_path()
    registry = DIDRegistry()
    regulator = Regulator(registry)
    
    devices_path = os.path.join(base_path, "device_ids.json")
    if os.path.exists(devices_path):
        with open(devices_path, "r") as f:
            device_ids = json.load(f)
    else:
        device_ids = [f"device_{uuid.uuid4().hex[:8]}" for _ in range(3)]
        with open(devices_path, "w") as f:
            json.dump(device_ids, f)

    auth_state = {
        "server_did": "did:medichain:server_1",
        "server_vc": {"issuer_did": "did:medichain:regulator", "credentialSubject": {"id": "did:medichain:server_1"}},
        "devices": {}
    }
    
    for d in device_ids:
        did = f"did:medichain:{d}"
        auth_state["devices"][d] = {
            "did": did,
            "vc": {"issuer_did": "did:medichain:regulator", "credentialSubject": {"id": did}}
        }
        
    auth_state_path = os.path.join(base_path, "auth_state.json")
    with open(auth_state_path, "w") as f:
        json.dump(auth_state, f, indent=2)
        
    print(f"Bootstrap complete. Saved to {auth_state_path}")
    return auth_state

if __name__ == "__main__":
    bootstrap_auth_system()
