#!/usr/bin/env python3
"""
Test AI Backend Service
"""
import requests
import json

def test_ai_service():
    base_url = "http://localhost:8000"
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health", timeout=5)
        print(f"✅ Health check: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False
    
    # Test analysis endpoint
    try:
        test_proposal = {
            "proposal_id": 1,
            "title": "Deploy on Arbitrum",
            "description": "Deploy ChainMind protocol on Arbitrum to reduce gas costs",
            "proposal_type": "STANDARD",
            "treasury_impact": 150000,
            "proposer_address": "0x1234567890123456789012345678901234567890"
        }
        
        response = requests.post(f"{base_url}/analyze", json=test_proposal, timeout=30)
        print(f"✅ Analysis test: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"Success Probability: {result['success_probability']:.1%}")
            print(f"Recommendation: {result['recommendation']}")
            return True
        else:
            print(f"❌ Analysis failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Analysis test failed: {e}")
        return False

if __name__ == "__main__":
    print("🧠 Testing AI Backend Service...")
    success = test_ai_service()
    if success:
        print("✅ AI Backend is working!")
    else:
        print("❌ AI Backend test failed")