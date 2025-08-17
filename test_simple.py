import requests

def test_ai():
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        print(f"AI Backend Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return True
    except Exception as e:
        print(f"AI Backend Error: {e}")
        return False

if __name__ == "__main__":
    print("Testing AI Backend...")
    if test_ai():
        print("AI Backend is working!")
    else:
        print("AI Backend failed")