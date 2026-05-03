import numpy as np
import json
import time
import uuid
import math
import paho.mqtt.client as mqtt
from datetime import datetime
from dataclasses import dataclass, asdict
from typing import Optional, List, Tuple
import os

# CONFIG CONSTANTS
MQTT_HOST = "localhost"
MQTT_PORT = 1883
TOPIC_TEMPLATE = "medichain/vitals/{device_id}/bundle"

@dataclass
class VitalBundle:
    device_id: str
    timestamp: float
    heart_rate: float
    spo2: float
    temperature: float
    ecg_samples: List[float]
    generation_method: str
    dp_noise_applied: bool

class VitalSimulator:
    def __init__(self, device_count=3):
        self.device_ids = self._load_or_create_devices(device_count)
        self.client = mqtt.Client(callback_api_version=mqtt.CallbackAPIVersion.VERSION2)
        
        # Load Auth State (VCs for devices)
        auth_state_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "auth_state.json")
        with open(auth_state_path, "r") as f:
            self.auth_state = json.load(f)

    def _load_or_create_devices(self, count):
        path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "device_ids.json")
        if os.path.exists(path):
            with open(path, "r") as f:
                return json.load(f)
        
        ids = [f"device_{uuid.uuid4().hex[:8]}" for _ in range(count)]
        with open(path, "w") as f:
            json.dump(ids, f)
        return ids

    def _generate_ecg(self, hr):
        # Mock ECG: Sine wave with some harmonics
        t = np.linspace(0, 1, 100)
        freq = hr / 60.0
        wave = np.sin(2 * np.pi * freq * t) + 0.5 * np.sin(4 * np.pi * freq * t)
        return (wave + np.random.normal(0, 0.05, 100)).tolist()

    def _get_vitals(self, device_id):
        # GAN Mock for HR (Normal 60-100)
        hr = np.random.normal(75, 5)
        # VAE Mock for Temp (36.5-37.5)
        temp = np.random.normal(37.0, 0.2)
        # Beta for SpO2 (95-100)
        spo2 = 95 + np.random.beta(5, 2) * 5
        
        # Random anomaly injection (5% chance)
        is_anomaly = np.random.random() < 0.05
        if is_anomaly:
            hr += np.random.choice([40, -30])
            spo2 -= 10
            
        return hr, spo2, temp

    def run(self):
        self.client.connect(MQTT_HOST, MQTT_PORT, 60)
        print(f"Connected to MQTT broker at {MQTT_HOST}:{MQTT_PORT}")
        
        while True:
            for d_id in self.device_ids:
                hr, spo2, temp = self._get_vitals(d_id)
                ecg = self._generate_ecg(hr)
                
                # SSI Auth Wrapper
                device_auth = self.auth_state["devices"].get(d_id, {})
                
                bundle = {
                    "device_id": d_id,
                    "timestamp": time.time(),
                    "heart_rate": round(hr, 2),
                    "spo2": round(spo2, 2),
                    "temperature": round(temp, 2),
                    "ecg_samples": ecg,
                    "generation_method": "GAN_MOCK",
                    "dp_noise_applied": True,
                    "auth": {
                        "device_did": device_auth.get("did"),
                        "vc": device_auth.get("vc")
                    }
                }
                
                topic = TOPIC_TEMPLATE.format(device_id=d_id)
                self.client.publish(topic, json.dumps(bundle))
                # print(f"Published to {topic}")
                
            time.sleep(1)

if __name__ == "__main__":
    sim = VitalSimulator()
    sim.run()
