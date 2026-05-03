import logging
import os
import sys

# Add project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from python_core.edge_gateway.gateway import EdgeGateway

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    print("Starting VitalChain Edge Gateway...")
    gateway = EdgeGateway()
    gateway.start()
