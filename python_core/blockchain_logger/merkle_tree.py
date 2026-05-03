import hashlib
import json

class MerkleTree:
    def __init__(self, data):
        self.leaves = [hashlib.sha256(json.dumps(d, sort_keys=True).encode()).hexdigest() for d in data]
        self.root = self._build(self.leaves)

    def _build(self, nodes):
        if not nodes: return "0" * 64
        if len(nodes) == 1: return nodes[0]
        new_level = []
        for i in range(0, len(nodes), 2):
            n1 = nodes[i]
            n2 = nodes[i+1] if i+1 < len(nodes) else n1
            new_level.append(hashlib.sha256((n1 + n2).encode()).hexdigest())
        return self._build(new_level)

    def get_root(self):
        return self.root
