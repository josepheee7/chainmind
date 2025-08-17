@echo off
echo Starting Hardhat node and deploying contracts...

REM Start Hardhat node in background
start /B npx hardhat node > hardhat.log 2>&1

REM Wait for node to start
timeout /t 5 /nobreak > nul

REM Deploy contracts
npx hardhat run quick-deploy.js --network localhost

echo Deployment complete!
pause
