import numpy as np
from sklearn.svm import OneClassSVM
from sklearn.preprocessing import StandardScaler
import pickle
import os

class MultiModalSVMDetector:
    def __init__(self, nu=0.05, kernel="rbf", gamma="auto"):
        self.model = OneClassSVM(nu=nu, kernel=kernel, gamma=gamma)
        self.scaler = StandardScaler()
        self.is_trained = False
        self.buffer = []
        self.train_threshold = 200

    def analyze(self, hr, spo2, temp) -> dict:
        features = np.array([[hr, spo2, temp]])
        
        if not self.is_trained:
            self.buffer.append([hr, spo2, temp])
            if len(self.buffer) >= self.train_threshold:
                X = np.array(self.buffer)
                self.scaler.fit(X)
                self.model.fit(self.scaler.transform(X))
                self.is_trained = True
                print("[SVM] Model trained on 200 samples.")
            return {"decision_score": 0.0, "is_anomaly": False, "method": "SVM_COLLECTING"}

        X_scaled = self.scaler.transform(features)
        score = self.model.decision_function(X_scaled)[0]
        prediction = self.model.predict(X_scaled)[0] # -1 for anomaly
        
        return {
            "decision_score": float(score),
            "is_anomaly": bool(prediction == -1),
            "method": "OC-SVM"
        }
