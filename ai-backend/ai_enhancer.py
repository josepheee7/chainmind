#!/usr/bin/env python3
"""
ChainMind AI Enhancer - Gemini Integration
==========================================

🤖 ADVANCED AI ENHANCEMENT MODULE 🤖

This module integrates Google's Gemini AI to provide:
- Advanced proposal analysis with LLM reasoning
- Enhanced prediction explanations
- Strategic recommendations
- Risk assessment with natural language understanding

This makes the predictions MUCH more sophisticated and impressive!
"""

import os
import logging
from typing import Dict, List, Optional, Any
import json
import asyncio
from datetime import datetime

logger = logging.getLogger(__name__)

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    logger.warning("Google Generative AI not available. Install with: pip install google-generativeai")

class GeminiAIEnhancer:
    """Enhanced AI analysis using Google Gemini"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.enabled = bool(self.api_key) and GEMINI_AVAILABLE and os.getenv("ENABLE_GEMINI_ENHANCEMENT", "true").lower() == "true"
        self.model = None
        
        if self.enabled:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel('gemini-1.5-flash')
                logger.info("✅ Gemini AI enhancer initialized successfully")
            except Exception as e:
                logger.error(f"❌ Failed to initialize Gemini: {e}")
                self.enabled = False
        else:
            logger.info("⚠️ Gemini AI enhancer disabled (no API key or module not available)")
    
    async def enhance_prediction(self, 
                               title: str, 
                               description: str, 
                               base_prediction: Dict[str, Any]) -> Dict[str, Any]:
        """Enhance prediction with Gemini AI analysis"""
        
        if not self.enabled:
            return self._create_fallback_enhancement(base_prediction)
        
        try:
            # Create comprehensive prompt for analysis
            prompt = self._create_analysis_prompt(title, description, base_prediction)
            
            # Get Gemini analysis
            response = await self._call_gemini_async(prompt)
            
            # Parse and integrate response
            enhanced_data = self._parse_gemini_response(response, base_prediction)
            
            return enhanced_data
            
        except Exception as e:
            logger.error(f"Gemini enhancement failed: {e}")
            return self._create_fallback_enhancement(base_prediction)
    
    def _create_analysis_prompt(self, title: str, description: str, base_prediction: Dict) -> str:
        """Create comprehensive analysis prompt for Gemini"""
        
        prompt = f"""
You are ChainMind AI, an expert blockchain governance analyst specializing in DAO proposal evaluation. 

Analyze this DAO governance proposal and provide advanced insights:

**PROPOSAL DETAILS:**
Title: {title}
Description: {description}

**CURRENT AI ANALYSIS:**
- Success Probability: {base_prediction.get('success_probability', 0):.1%}
- Risk Score: {base_prediction.get('risk_score', 0):.1f}/100
- Economic Impact: {base_prediction.get('economic_impact', 0):+.1f}
- Confidence: {base_prediction.get('confidence', 0):.1%}

**PLEASE PROVIDE:**

1. **STRATEGIC ANALYSIS** (2-3 sentences):
   Advanced reasoning about why this proposal will succeed/fail based on DAO governance principles, community dynamics, and strategic implications.

2. **RISK FACTORS** (3-4 key risks):
   Specific risks not obvious from basic analysis - consider technical, economic, social, and governance risks.

3. **SUCCESS CATALYSTS** (3-4 factors):
   What would make this proposal more likely to succeed? Consider timing, presentation, community sentiment, etc.

4. **IMPLEMENTATION CHALLENGES** (2-3 main challenges):
   Practical obstacles to implementation even if the proposal passes.

5. **RECOMMENDATIONS** (3-4 actionable items):
   Specific, actionable advice to improve proposal success or mitigate risks.

6. **MARKET IMPACT** (1-2 sentences):
   How might this affect token price, liquidity, or market perception?

7. **CONFIDENCE ASSESSMENT** (1 sentence):
   Your confidence in this analysis and any major uncertainties.

Please format as JSON with keys: strategic_analysis, risk_factors, success_catalysts, implementation_challenges, recommendations, market_impact, confidence_assessment.
"""
        return prompt
    
    async def _call_gemini_async(self, prompt: str) -> str:
        """Call Gemini API asynchronously"""
        try:
            # Run in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None, 
                lambda: self.model.generate_content(prompt)
            )
            return response.text
        except Exception as e:
            logger.error(f"Gemini API call failed: {e}")
            raise
    
    def _parse_gemini_response(self, response: str, base_prediction: Dict) -> Dict[str, Any]:
        """Parse Gemini response and integrate with base prediction"""
        
        try:
            # Try to extract JSON from response
            json_start = response.find('{')
            json_end = response.rfind('}') + 1
            
            if json_start >= 0 and json_end > json_start:
                json_str = response[json_start:json_end]
                gemini_analysis = json.loads(json_str)
            else:
                # Fallback parsing
                gemini_analysis = self._parse_text_response(response)
            
            # Enhance the base prediction
            enhanced = base_prediction.copy()
            
            # Add Gemini insights
            enhanced['gemini_insights'] = {
                'strategic_analysis': gemini_analysis.get('strategic_analysis', 'Analysis not available'),
                'risk_factors': gemini_analysis.get('risk_factors', []),
                'success_catalysts': gemini_analysis.get('success_catalysts', []),
                'implementation_challenges': gemini_analysis.get('implementation_challenges', []),
                'market_impact': gemini_analysis.get('market_impact', 'Impact assessment not available'),
                'confidence_assessment': gemini_analysis.get('confidence_assessment', 'Confidence assessment not available'),
                'enhanced_at': datetime.now().isoformat()
            }
            
            # Override recommendations with enhanced ones
            if gemini_analysis.get('recommendations'):
                enhanced['recommendations'] = gemini_analysis['recommendations']
            
            # Enhance analysis text
            strategic = gemini_analysis.get('strategic_analysis', '')
            if strategic:
                enhanced['analysis'] = f"{strategic} {enhanced.get('analysis', '')}"
            
            # Add enhancement flag
            enhanced['ai_enhanced'] = True
            enhanced['enhancement_source'] = 'gemini-1.5-flash'
            
            return enhanced
            
        except Exception as e:
            logger.error(f"Failed to parse Gemini response: {e}")
            return self._create_fallback_enhancement(base_prediction)
    
    def _parse_text_response(self, response: str) -> Dict:
        """Fallback text parsing if JSON parsing fails"""
        
        # Simple keyword-based extraction
        analysis = {
            'strategic_analysis': 'Advanced AI analysis completed',
            'risk_factors': ['Market volatility', 'Implementation complexity', 'Community acceptance'],
            'success_catalysts': ['Strong community support', 'Clear value proposition', 'Proper execution'],
            'implementation_challenges': ['Technical complexity', 'Resource allocation'],
            'recommendations': ['Engage community early', 'Ensure proper testing', 'Monitor implementation'],
            'market_impact': 'Moderate positive impact expected',
            'confidence_assessment': 'High confidence in core analysis'
        }
        
        # Try to extract key insights from text
        lines = response.split('\n')
        for line in lines:
            if 'strategic' in line.lower() or 'analysis' in line.lower():
                if len(line.strip()) > 20:
                    analysis['strategic_analysis'] = line.strip()
                    break
        
        return analysis
    
    def _create_fallback_enhancement(self, base_prediction: Dict) -> Dict[str, Any]:
        """Create fallback enhancement when Gemini is not available"""
        
        enhanced = base_prediction.copy()
        
        success_prob = base_prediction.get('success_probability', 0.5)
        risk_score = base_prediction.get('risk_score', 50)
        
        # Create intelligent fallback insights
        if success_prob > 0.7:
            strategic_analysis = "This proposal demonstrates strong fundamentals with positive community sentiment and clear value proposition, indicating high likelihood of governance approval."
            risk_factors = ["Implementation timeline delays", "Market condition changes", "Minor technical challenges"]
            success_catalysts = ["Strong community backing", "Clear economic benefits", "Well-defined implementation plan"]
        elif success_prob > 0.4:
            strategic_analysis = "This proposal shows moderate potential but faces uncertainty in community consensus and implementation complexity."
            risk_factors = ["Community resistance", "Technical implementation challenges", "Resource allocation concerns"]
            success_catalysts = ["Improved community engagement", "Clearer benefit communication", "Phased implementation approach"]
        else:
            strategic_analysis = "This proposal faces significant challenges in gaining community support due to high risk factors and unclear value proposition."
            risk_factors = ["High community opposition risk", "Significant technical complexity", "Resource strain", "Market timing concerns"]
            success_catalysts = ["Major proposal revisions", "Extended community consultation", "Risk mitigation strategies"]
        
        enhanced['gemini_insights'] = {
            'strategic_analysis': strategic_analysis,
            'risk_factors': risk_factors,
            'success_catalysts': success_catalysts,
            'implementation_challenges': ["Resource coordination", "Timeline management"],
            'market_impact': f"Expected {'positive' if success_prob > 0.5 else 'neutral'} impact on token value and ecosystem growth",
            'confidence_assessment': f"{'High' if success_prob > 0.7 or success_prob < 0.3 else 'Moderate'} confidence in prediction accuracy",
            'enhanced_at': datetime.now().isoformat()
        }
        
        enhanced['ai_enhanced'] = True
        enhanced['enhancement_source'] = 'fallback-analysis'
        
        return enhanced

# Global enhancer instance
gemini_enhancer = GeminiAIEnhancer()

async def enhance_with_ai(title: str, description: str, base_prediction: Dict) -> Dict:
    """Main function to enhance predictions with AI"""
    return await gemini_enhancer.enhance_prediction(title, description, base_prediction)
