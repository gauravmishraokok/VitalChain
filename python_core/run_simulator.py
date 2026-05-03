import logging
import os
import sys

# Add project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from python_core.data_simulator.simulator import VitalSimulator

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    print("Starting VitalChain Data Simulator...")
    simulator = VitalSimulator()
    simulator.run()
