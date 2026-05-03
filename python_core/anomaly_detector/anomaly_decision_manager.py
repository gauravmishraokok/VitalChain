from .mmae_ecg import MMAEECGDetector
from .svm_detector import MultiModalSVMDetector
from datetime import datetime
import uuid
import time

class AnomalyDecisionManager:
    def __init__(self):
        self.mmae = MMAEECGDetector()
        self.svm = MultiModalSVMDetector()
        
    def analyze(self, bundle, intrusion_flag=False) -> dict:
        hr = bundle.get("heart_rate", 0)
        spo2 = bundle.get("spo2", 0)
        temp = bundle.get("temperature", 0)
        ecg = bundle.get("ecg_samples", [])
        
        mmae_res = self.mmae.analyze(ecg)
        svm_res = self.svm.analyze(hr, spo2, temp)
        
        # High-level fusion
        is_anomaly = mmae_res["is_anomaly"] or svm_res["is_anomaly"]
        
        # Alert level logic
        alert_level = 0 # Normal
        if is_anomaly:
            alert_level = 1 # Info/Warning
            if hr > 140 or hr < 40 or spo2 < 85:
                alert_level = 2 # Critical
                
        return {
            "alert_id": str(uuid.uuid4()),
            "timestamp": datetime.now().isoformat(),
            "is_anomaly": is_anomaly,
            "alert_level": alert_level,
            "alert_label": "CRITICAL_ARRHYTHMIA" if alert_level == 2 else "VITAL_DRIFT" if is_anomaly else "NORMAL",
            "is_trusted": not intrusion_flag,
            "mmae_result": mmae_res,
            "svm_result": svm_res,
            "vitals_snapshot": {
                "hr": hr,
                "spo2": spo2,
                "temp": temp
            }
        }
