#!/usr/bin/env python3
import os
import google.generativeai as genai
import json

# Configure Gemini
GEMINI_API_KEY = "AIzaSyDeGNiKEMe350aLjaTlSC1Io_RRQlTvn2g"
genai.configure(api_key=GEMINI_API_KEY)

def test_gemini():
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = """
        Analyze this DAO proposal and return ONLY valid JSON:
        
        Title: "Deploy on Arbitrum"
        Description: "Deploy protocol on Arbitrum to reduce gas costs"
        Treasury Impact: $150,000
        
        Return this exact JSON format:
        {
            "success_probability": 0.75,
            "confidence": 0.85,
            "recommendation": "APPROVE",
            "detailed_analysis": "This proposal shows strong technical merit...",
            "key_risks": ["gas optimization", "bridge security"],
            "key_benefits": ["lower costs", "better UX"]
        }
        """
        
        response = model.generate_content(prompt)
        
        if response and response.text:
            print("Gemini Response:")
            print(response.text)
            
            # Try to parse JSON
            try:
                text = response.text.strip()
                if text.startswith('```json'):
                    text = text[7:-3]
                elif text.startswith('```'):
                    text = text[3:-3]
                
                data = json.loads(text)
                print("JSON Parsed Successfully!")
                return data
            except:
                print("JSON Parse Failed")
                return None
        else:
            print("No response from Gemini")
            return None
            
    except Exception as e:
        print(f"Gemini Error: {e}")
        return None

if __name__ == "__main__":
    print("Testing Gemini AI...")
    result = test_gemini()
    if result:
        print("Gemini is working!")
    else:
        print("Gemini failed!")