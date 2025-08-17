#!/bin/bash

echo "🛑 Stopping ChainMind DAO Demo Services..."

if [ -f .demo_pids ]; then
    source .demo_pids
    
    echo "Stopping AI Backend (PID: $AI_PID)..."
    kill $AI_PID 2>/dev/null
    
    echo "Stopping Hardhat Node (PID: $HARDHAT_PID)..."
    kill $HARDHAT_PID 2>/dev/null
    
    echo "Stopping Frontend (PID: $FRONTEND_PID)..."
    kill $FRONTEND_PID 2>/dev/null
    
    rm .demo_pids
    echo "✅ All services stopped"
else
    echo "❌ No PID file found. Manually kill processes on ports 3000, 8000, 8545"
    echo "Use: lsof -ti:3000,8000,8545 | xargs kill -9"
fi
