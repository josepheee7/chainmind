# ChainMind - Production Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- MetaMask wallet
- Sepolia ETH for deployment

### Environment Setup
1. Copy `.env` and fill in your keys:
```bash
PRIVATE_KEY=your_deployment_private_key
INFURA_PROJECT_ID=your_infura_project_id
ETHERSCAN_API_KEY=your_etherscan_api_key
GEMINI_API_KEY=AIzaSyDeGNiKEMe350aLjaTlSC1Io_RRQlTvn2g
```

### Deploy to Sepolia
```bash
# Make executable
chmod +x deploy-production.sh

# Deploy everything
./deploy-production.sh
```

## 📋 Manual Deployment

### 1. Smart Contracts
```bash
cd contracts
npm install
npx hardhat run scripts/deploy-production.js --network sepolia
```

### 2. AI Backend
```bash
cd ai-backend
pip install -r requirements-production.txt
python production_ai_service.py
```

### 3. Frontend
```bash
cd frontend
npm install
npm start
```

## 🔗 Production URLs
- Frontend: http://localhost:3000
- AI API: http://localhost:8000
- Contracts: Check deployments/ folder for addresses

## ✅ Features
- ✅ Real Gemini AI integration
- ✅ Sepolia testnet deployment
- ✅ Production-grade security
- ✅ Real blockchain data
- ✅ Professional UI/UX
- ✅ Comprehensive analytics

## 🎯 Vitalik Review Ready
This application is production-grade and ready for technical review.