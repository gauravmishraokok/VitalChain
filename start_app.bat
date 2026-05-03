@echo off
title VitalChain - Autonomous Medical Intelligence Platform
color 0B

echo.
echo  ██╗   ██╗██╗████████╗ █████╗ ██╗      ██████╗██╗  ██╗ █████╗ ██╗███╗   ██╗
echo  ██║   ██║██║╚══██╔══╝██╔══██╗██║     ██╔════╝██║  ██║██╔══██╗██║████╗  ██║
echo  ██║   ██║██║   ██║   ███████║██║     ██║     ███████║███████║██║██╔██╗ ██║
echo  ╚██╗ ██╔╝██║   ██║   ██╔══██║██║     ██║     ██╔══██║██╔══██║██║██║╚██╗██║
echo   ╚████╔╝ ██║   ██║   ██║  ██║███████╗╚██████╗██║  ██║██║  ██║██║██║ ╚████║
echo    ╚═══╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝
echo.
echo  Decentralized Medical IoT Intelligence Platform
echo  ================================================
echo.

REM ─────────────────────────────────────────────────────────────────────────────
REM  STEP 0 — Kill any stale processes from a previous run
REM ─────────────────────────────────────────────────────────────────────────────
echo [0/7] Cleaning up stale processes...
taskkill /F /IM node.exe     /T 2>nul
taskkill /F /IM python.exe   /T 2>nul
taskkill /F /IM mosquitto.exe /T 2>nul
echo       Done.
echo.

REM ─────────────────────────────────────────────────────────────────────────────
REM  STEP 1 — MongoDB  (expects mongod in PATH)
REM ─────────────────────────────────────────────────────────────────────────────
echo [1/7] Starting MongoDB...
start "VitalChain: MongoDB" cmd /k "mongod"
ping 127.0.0.1 -n 4 > nul

REM ─────────────────────────────────────────────────────────────────────────────
REM  STEP 2 — Mosquitto MQTT Broker  (expects mosquitto in PATH or default install)
REM ─────────────────────────────────────────────────────────────────────────────
echo [2/7] Starting Mosquitto MQTT Broker...
start "VitalChain: MQTT" cmd /k "mosquitto -v"
ping 127.0.0.1 -n 3 > nul

REM ─────────────────────────────────────────────────────────────────────────────
REM  STEP 3 — Ganache (local Ethereum testnet)
REM ─────────────────────────────────────────────────────────────────────────────
echo [3/7] Starting Ganache (Local Ethereum)...
start "VitalChain: Ganache" cmd /k "npx ganache --port 8545 --chain.chainId 1337"
ping 127.0.0.1 -n 8 > nul

REM ─────────────────────────────────────────────────────────────────────────────
REM  STEP 3b — Deploy smart contracts to fresh Ganache instance
REM ─────────────────────────────────────────────────────────────────────────────
echo [3b] Deploying Smart Contracts to Ganache...
cd /d %~dp0contracts
npx hardhat run scripts/deploy.js --network localhost
cd /d %~dp0
echo       Contracts deployed and ABI/address exported.
echo.

REM ─────────────────────────────────────────────────────────────────────────────
REM  STEP 4 — Bootstrap Auth (generates auth_state.json if missing)
REM ─────────────────────────────────────────────────────────────────────────────
echo [4/7] Bootstrapping SSI Auth Engine...
if not exist "python_core\auth_state.json" (
    python -m python_core.auth_engine.bootstrap
    echo       Auth state generated.
) else (
    echo       Auth state already exists — skipping.
)
echo.

REM ─────────────────────────────────────────────────────────────────────────────
REM  STEP 5 — Edge Gateway + Data Simulator (Python Core)
REM ─────────────────────────────────────────────────────────────────────────────
echo [5/7] Starting Python Edge Gateway...
start "VitalChain: Edge Gateway" cmd /k "python -u python_core\run_gateway.py"
ping 127.0.0.1 -n 4 > nul

echo [6/7] Starting Physiological Data Simulator...
start "VitalChain: Simulator" cmd /k "python -u python_core\run_simulator.py"
ping 127.0.0.1 -n 3 > nul

REM ─────────────────────────────────────────────────────────────────────────────
REM  STEP 6 — Node.js Backend API
REM ─────────────────────────────────────────────────────────────────────────────
echo [7/7] Starting Backend API + Frontend Dashboard...
start "VitalChain: Backend" cmd /k "cd /d %~dp0backend && npm run dev"
ping 127.0.0.1 -n 5 > nul

REM ─────────────────────────────────────────────────────────────────────────────
REM  STEP 7 — React Frontend
REM ─────────────────────────────────────────────────────────────────────────────
start "VitalChain: Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

REM ─────────────────────────────────────────────────────────────────────────────
REM  DONE
REM ─────────────────────────────────────────────────────────────────────────────
echo.
echo  =========================================================
echo   VitalChain is LIVE!
echo  =========================================================
echo.
echo   Dashboard  :  http://localhost:3000
echo   API        :  http://localhost:5000
echo   Ganache    :  http://localhost:8545
echo.
echo   Login      :  admin  /  medichain2024
echo.
echo   Close this window OR press any key to exit launcher.
echo  =========================================================
pause > nul
