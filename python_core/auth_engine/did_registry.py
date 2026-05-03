import json
import os
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization

class DIDRegistry:
    def __init__(self, registry_path='did_registry.json', keys_dir='keys'):
        self.base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.registry_path = os.path.join(self.base_path, registry_path)
        self.keys_dir = os.path.join(self.base_path, keys_dir)
        os.makedirs(self.keys_dir, exist_ok=True)
        self.data = self._load()

    def _load(self):
        if os.path.exists(self.registry_path):
            with open(self.registry_path, 'r') as f: return json.load(f)
        return {}

    def save(self):
        with open(self.registry_path, 'w') as f: json.dump(self.data, f, indent=2)

    def generate_keys(self, did):
        private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        pem = private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        )
        with open(os.path.join(self.keys_dir, f'{did.replace(":", "_")}.pem'), 'wb') as f: f.write(pem)
        return private_key

    def resolve_did(self, did):
        return self.data.get(did)
