#!/bin/bash
# ChainMind Production Deployment Script
# This script deploys the entire ChainMind application to production

set -e  # Exit on any error

echo "🚀 ChainMind Production Deployment"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm"
        exit 1
    fi
    
    # Check Hardhat
    if ! command -v npx &> /dev/null; then
        print_error "npx is not installed. Please install npx"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install smart contract dependencies
    cd contracts
    npm install
    print_success "Smart contract dependencies installed"
    
    # Install frontend dependencies
    cd ../frontend
    npm install
    print_success "Frontend dependencies installed"
    
    cd ..
}

# Compile smart contracts
compile_contracts() {
    print_status "Compiling smart contracts..."
    
    cd contracts
    npx hardhat compile
    print_success "Smart contracts compiled successfully"
    cd ..
}

# Deploy smart contracts
deploy_contracts() {
    print_status "Deploying smart contracts..."
    
    cd contracts
    
    # Check if we're deploying to a testnet or mainnet
    if [ "$NETWORK" = "localhost" ]; then
        print_status "Deploying to local Hardhat network..."
        npx hardhat run deploy_production.js --network hardhat
    elif [ "$NETWORK" = "sepolia" ]; then
        print_status "Deploying to Sepolia testnet..."
        npx hardhat run deploy_production.js --network sepolia
    elif [ "$NETWORK" = "mainnet" ]; then
        print_warning "Deploying to Ethereum mainnet..."
        read -p "Are you sure you want to deploy to mainnet? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            npx hardhat run deploy_production.js --network mainnet
        else
            print_error "Mainnet deployment cancelled"
            exit 1
        fi
    else
        print_error "Invalid network specified. Use: localhost, sepolia, or mainnet"
        exit 1
    fi
    
    print_success "Smart contracts deployed successfully"
    cd ..
}

# Build frontend
build_frontend() {
    print_status "Building frontend for production..."
    
    cd frontend
    
    # Set production environment
    export NODE_ENV=production
    export REACT_APP_NETWORK=$NETWORK
    
    # Build the application
    npm run build
    
    print_success "Frontend built successfully"
    cd ..
}

# Start services
start_services() {
    print_status "Starting ChainMind services..."
    
    # Start local blockchain if needed
    if [ "$NETWORK" = "localhost" ]; then
        print_status "Starting local Hardhat network..."
        cd contracts
        npx hardhat node &
        HARDHAT_PID=$!
        cd ..
        
        # Wait for blockchain to start
        sleep 5
        print_success "Local blockchain started (PID: $HARDHAT_PID)"
    fi
    
    # Start frontend development server
    print_status "Starting frontend development server..."
    cd frontend
    npm start &
    FRONTEND_PID=$!
    cd ..
    
    print_success "Frontend started (PID: $FRONTEND_PID)"
}

# Display deployment information
show_deployment_info() {
    echo
    echo "🎉 ChainMind Deployment Complete!"
    echo "================================"
    echo
    echo "🌐 Frontend URL: http://localhost:3000"
    echo "🔗 Blockchain: $NETWORK"
    echo
    echo "📋 Contract Addresses:"
    echo "   ChainMindToken: 0x5FbDB2315678afecb367f032d93F642f64180aa3"
    echo "   ChainMindDAO: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
    echo "   AIOracle: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    echo "   ChainMindStaking: 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
    echo
    echo "🔧 Next Steps:"
    echo "   1. Open http://localhost:3000 in your browser"
    echo "   2. Connect your MetaMask wallet"
    echo "   3. Import test accounts from Hardhat output"
    echo "   4. Start exploring ChainMind governance!"
    echo
    echo "📚 Documentation: README.md"
    echo "🐛 Issues: GitHub Issues"
    echo
    echo "🛑 To stop services:"
    echo "   - Frontend: Ctrl+C in the frontend terminal"
    echo "   - Blockchain: kill $HARDHAT_PID (if running locally)"
    echo
}

# Cleanup function
cleanup() {
    print_status "Cleaning up..."
    
    # Kill background processes
    if [ ! -z "$HARDHAT_PID" ]; then
        kill $HARDHAT_PID 2>/dev/null || true
        print_status "Hardhat network stopped"
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
        print_status "Frontend server stopped"
    fi
}

# Set up signal handlers
trap cleanup EXIT
trap cleanup SIGINT

# Main deployment function
main() {
    # Parse command line arguments
    NETWORK=${1:-localhost}
    
    echo "Deploying ChainMind to: $NETWORK"
    echo
    
    # Run deployment steps
    check_prerequisites
    install_dependencies
    compile_contracts
    deploy_contracts
    build_frontend
    start_services
    show_deployment_info
    
    # Keep the script running
    print_status "ChainMind is running. Press Ctrl+C to stop."
    wait
}

# Show usage
show_usage() {
    echo "Usage: $0 [network]"
    echo
    echo "Networks:"
    echo "  localhost  - Deploy to local Hardhat network (default)"
    echo "  sepolia    - Deploy to Sepolia testnet"
    echo "  mainnet    - Deploy to Ethereum mainnet"
    echo
    echo "Examples:"
    echo "  $0              # Deploy to localhost"
    echo "  $0 sepolia      # Deploy to Sepolia testnet"
    echo "  $0 mainnet      # Deploy to mainnet (requires confirmation)"
    echo
}

# Check if help is requested
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    show_usage
    exit 0
fi

# Run main function
main "$@"
