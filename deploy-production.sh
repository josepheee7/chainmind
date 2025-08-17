#!/bin/bash

echo "🚀 ChainMind Production Deployment"
echo "=================================="

# Check environment
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ PRIVATE_KEY not set"
    exit 1
fi

if [ -z "$INFURA_PROJECT_ID" ]; then
    echo "❌ INFURA_PROJECT_ID not set"
    exit 1
fi

# Deploy contracts
echo "📄 Deploying smart contracts to Sepolia..."
cd contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy-production.js --network sepolia

# Start AI backend
echo "🧠 Starting AI backend..."
cd ../ai-backend
pip install -r requirements-production.txt
python production_ai_service.py &

# Build and start frontend
echo "🌐 Building frontend..."
cd ../frontend
npm install
npm run build
npm start

echo "✅ Deployment complete!"
echo "🔗 Frontend: http://localhost:3000"
echo "🧠 AI API: http://localhost:8000"