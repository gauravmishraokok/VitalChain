import time
from typing import Dict, List, Set, Optional

class NetworkMonitor:
    def __init__(self, adm):
        self.adm = adm
        self.message_counts = {}
        self.suspicious_devices = set()

    def analyze_traffic(self, device_id, bundle):
        now = time.time()
        timestamps = self.message_counts.get(device_id, [])
        timestamps = [t for t in timestamps if now - t < 1]
        timestamps.append(now)
        self.message_counts[device_id] = timestamps
        
        if len(timestamps) > 10:
            self.suspicious_devices.add(device_id)
            print(f'[NET] Suspicious activity: Rate limit exceeded for {device_id}')

    def is_suspicious(self, device_id):
        return device_id in self.suspicious_devices
