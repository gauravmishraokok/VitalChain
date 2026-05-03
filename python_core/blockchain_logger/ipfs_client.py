import os
import json
import hashlib

class IPFSClient:
    def __init__(self):
        self.base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.mock_dir = os.path.join(self.base, 'ipfs_mock')
        os.makedirs(self.mock_dir, exist_ok=True)

    def store_batch(self, batch):
        content = json.dumps(batch)
        cid = 'Qm' + hashlib.sha256(content.encode()).hexdigest()[:44]
        with open(os.path.join(self.mock_dir, f'{cid}.json'), 'w') as f: f.write(content)
        return cid
