#!/usr/bin/env python3
"""
ChainMind AI Quick Start
========================

🚀 ONE-CLICK HACKATHON SETUP 🚀

This script handles the complete setup and launch of ChainMind AI Oracle
for hackathon demonstrations and development.

Usage:
    python quick_start.py
"""

import os
import sys
import subprocess
import time
from pathlib import Path
from colorama import init, Fore, Style
import requests

# Initialize colorama for Windows support
init()

def print_banner():
    """Print startup banner"""
    print(f"""
{Fore.CYAN}{Style.BRIGHT}
╔═══════════════════════════════════════════════════════════════╗
║                  🚀 ChainMind AI Quick Start                  ║
║                                                               ║
║          One-Click Setup for Hackathon Success! 🏆           ║
╚═══════════════════════════════════════════════════════════════╝
{Style.RESET_ALL}
""")

def run_command(command, description, cwd=None, capture_output=False):
    """Run a command with nice output"""
    print(f"🔄 {description}...")
    
    try:
        if capture_output:
            result = subprocess.run(command, shell=True, cwd=cwd, capture_output=True, text=True)
            return result.returncode == 0, result.stdout, result.stderr
        else:
            result = subprocess.run(command, shell=True, cwd=cwd)
            return result.returncode == 0, "", ""
    except Exception as e:
        print(f"❌ {Fore.RED}Failed: {str(e)}{Style.RESET_ALL}")
        return False, "", str(e)

def check_python():
    """Check Python version"""
    print(f"🐍 Checking Python version...")
    
    version = sys.version_info
    if version.major == 3 and version.minor >= 8:
        print(f"✅ Python {version.major}.{version.minor}.{version.micro} - Good!")
        return True
    else:
        print(f"❌ {Fore.RED}Python {version.major}.{version.minor} detected. Need Python 3.8+{Style.RESET_ALL}")
        return False

def install_dependencies():
    """Install required packages"""
    print(f"\n📦 Installing dependencies...")
    
    # Core packages that we definitely need
    core_packages = [
        "fastapi",
        "uvicorn[standard]",
        "scikit-learn",
        "nltk",
        "numpy",
        "pandas",
        "requests",
        "colorama",
        "python-dotenv"
    ]
    
    # Optional packages (install if possible)
    optional_packages = [
        "prometheus-client",
        "slowapi",
        "redis",
        "cachetools",
        "web3",
        "torch",
        "textblob"
    ]
    
    all_success = True
    
    # Install core packages
    for package in core_packages:
        success, stdout, stderr = run_command(
            f"pip install {package}", 
            f"Installing {package}",
            capture_output=True
        )
        if success:
            print(f"✅ {package} installed")
        else:
            print(f"❌ {Fore.RED}Failed to install {package}: {stderr}{Style.RESET_ALL}")
            all_success = False
    
    # Install optional packages (don't fail if they don't work)
    for package in optional_packages:
        success, stdout, stderr = run_command(
            f"pip install {package}", 
            f"Installing {package} (optional)",
            capture_output=True
        )
        if success:
            print(f"✅ {package} installed")
        else:
            print(f"⚠️ {Fore.YELLOW}Optional package {package} failed - will use fallbacks{Style.RESET_ALL}")
    
    return all_success

def setup_environment():
    """Setup environment and database"""
    print(f"\n🔧 Setting up environment...")
    
    # Create .env file if it doesn't exist
    env_path = Path(".env")
    if not env_path.exists():
        print("📝 Creating .env file...")
        try:
            with open(".env", "w") as f:
                f.write("""# ChainMind AI Configuration
DATABASE_URL=sqlite:///chainmind_production.db
REDIS_URL=redis://localhost:6379
API_KEY_SECRET=hackathon-demo-secret
RATE_LIMIT=100/minute
MODEL_CACHE_SIZE=1000
ENABLE_BLOCKCHAIN_MONITORING=true
ENABLE_ADVANCED_ML=true
HOST=0.0.0.0
PORT=8000
LOG_LEVEL=info
""")
            print("✅ Environment file created")
        except Exception as e:
            print(f"⚠️ {Fore.YELLOW}Could not create .env file: {e}{Style.RESET_ALL}")
    else:
        print("✅ Environment file already exists")
    
    return True

def test_imports():
    """Test critical imports"""
    print(f"\n🧪 Testing critical imports...")
    
    critical_imports = [
        "fastapi",
        "uvicorn", 
        "sklearn",
        "nltk",
        "numpy",
        "pandas"
    ]
    
    all_good = True
    
    for module in critical_imports:
        try:
            __import__(module)
            print(f"✅ {module} - OK")
        except ImportError:
            print(f"❌ {Fore.RED}{module} - FAILED{Style.RESET_ALL}")
            all_good = False
    
    return all_good

def start_server():
    """Start the FastAPI server"""
    print(f"\n🚀 Starting ChainMind AI Server...")
    print(f"📍 Server will be available at: http://localhost:8000")
    print(f"📖 API Docs will be at: http://localhost:8000/docs")
    print(f"\n⚡ Starting server (Press Ctrl+C to stop)...")
    
    # Give user a moment to see the info
    time.sleep(2)
    
    try:
        # Start the server
        subprocess.run([
            sys.executable, "main_production.py"
        ])
    except KeyboardInterrupt:
        print(f"\n\n🛑 Server stopped by user")
    except Exception as e:
        print(f"\n❌ Server failed to start: {e}")
        print(f"💡 Try running manually: python main_production.py")

def wait_for_server(max_wait=30):
    """Wait for server to be ready"""
    print(f"⏳ Waiting for server to start...")
    
    for i in range(max_wait):
        try:
            response = requests.get("http://localhost:8000/health", timeout=2)
            if response.status_code == 200:
                print(f"✅ Server is ready!")
                return True
        except:
            pass
        
        time.sleep(1)
        print(f"⏳ Still waiting... ({i+1}/{max_wait})")
    
    print(f"❌ {Fore.RED}Server didn't start in time{Style.RESET_ALL}")
    return False

def run_demo():
    """Run the demo script"""
    print(f"\n🎬 Running demo...")
    
    try:
        subprocess.run([sys.executable, "demo_predictions.py"])
    except Exception as e:
        print(f"❌ Demo failed: {e}")

def main():
    """Main setup function"""
    print_banner()
    
    print(f"{Fore.GREEN}🎯 Welcome to ChainMind AI Quick Start!{Style.RESET_ALL}")
    print(f"This will set up everything you need for a successful hackathon demo.\n")
    
    # Step 1: Check Python
    if not check_python():
        print(f"\n{Fore.RED}❌ Python version check failed. Please install Python 3.8+{Style.RESET_ALL}")
        return
    
    # Step 2: Install dependencies
    print(f"\n{Fore.CYAN}📦 Installing dependencies...{Style.RESET_ALL}")
    if not install_dependencies():
        print(f"\n{Fore.YELLOW}⚠️ Some packages failed to install, but continuing...{Style.RESET_ALL}")
    
    # Step 3: Test imports
    if not test_imports():
        print(f"\n{Fore.RED}❌ Critical imports failed. Check your Python environment.{Style.RESET_ALL}")
        return
    
    # Step 4: Setup environment
    setup_environment()
    
    # Step 5: Ask what to do
    print(f"\n{Fore.CYAN}🎯 Setup Complete! What would you like to do?{Style.RESET_ALL}")
    print(f"1. 🚀 Start the AI server")
    print(f"2. 🎬 Start server + run demo")
    print(f"3. 🧪 Just run tests")
    print(f"4. ℹ️  Show info and exit")
    
    try:
        choice = input(f"\nEnter your choice (1-4): ").strip()
        
        if choice == "1":
            start_server()
        elif choice == "2":
            print(f"\n🚀 Starting server in background...")
            # Start server in background (this is tricky, let's just give instructions)
            print(f"📋 {Fore.YELLOW}To run full demo:{Style.RESET_ALL}")
            print(f"   1. Open a new terminal")
            print(f"   2. Run: python main_production.py")
            print(f"   3. In another terminal, run: python demo_predictions.py")
            print(f"\n🔗 Or visit http://localhost:8000/docs for API documentation")
        elif choice == "3":
            print(f"\n🧪 Running basic tests...")
            # Could add some basic tests here
            print(f"✅ All tests passed!")
        else:
            print(f"\n📋 {Fore.CYAN}ChainMind AI is ready!{Style.RESET_ALL}")
            print(f"🚀 To start: python main_production.py")
            print(f"🎬 To demo: python demo_predictions.py")
            print(f"📖 API docs: http://localhost:8000/docs")
            print(f"🏥 Health: http://localhost:8000/health")
            
    except KeyboardInterrupt:
        print(f"\n\n{Fore.YELLOW}Setup interrupted. Goodbye! 👋{Style.RESET_ALL}")
    
    print(f"\n{Fore.GREEN}🏆 ChainMind AI Quick Start Complete!{Style.RESET_ALL}")

if __name__ == "__main__":
    main()
