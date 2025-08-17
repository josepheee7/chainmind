/**
 * Production AI Service
 * Integrates with ChainMind AI backend for governance predictions
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Types
export interface GovernanceProposal {
  proposal_id: number;
  title: string;
  description: string;
  category?: string;
  treasury_impact?: number;
  voting_power_required?: number;
}

export interface PredictionResponse {
  proposal_id: number;
  success_probability: number;
  confidence_score: number;
  risk_assessment: string;
  economic_impact: number;
  key_factors: string[];
  recommendation: string;
  analysis_summary: string;
  timestamp: string;
}

export interface HistoricalData {
  dao_name: string;
  proposal_title: string;
  proposal_description: string;
  outcome: number;
  votes_for: number;
  votes_against: number;
  treasury_impact?: number;
}

export interface AnalyticsResponse {
  total_predictions: number;
  recent_predictions: number;
  historical_data_points: number;
  cache_hit_ratio: number;
  ai_service_status: string;
  uptime: string;
}

class ProductionAiService {
  private api: AxiosInstance;
  private baseURL: string;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.baseURL = process.env.REACT_APP_AI_BACKEND_URL || 'http://localhost:8000';
    
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(`🔮 AI Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ AI Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        console.log(`✅ AI Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('❌ AI Response Error:', error.response?.data || error.message);
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Check if AI service is available
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await this.api.get('/health');
      return response.data.status === 'healthy';
    } catch (error) {
      console.error('AI service health check failed:', error);
      return false;
    }
  }

  /**
   * Get service status and information
   */
  async getServiceInfo(): Promise<any> {
    try {
      const response = await this.api.get('/');
      return response.data;
    } catch (error) {
      console.error('Failed to get service info:', error);
      throw error;
    }
  }

  /**
   * Analyze a governance proposal
   */
  async analyzeProposal(proposal: GovernanceProposal): Promise<PredictionResponse> {
    try {
      // Check cache first
      const cacheKey = `proposal_${proposal.proposal_id}_${this.hashString(proposal.title + proposal.description)}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        console.log('📋 Using cached prediction');
        return cached;
      }

      console.log(`🧠 Analyzing proposal: ${proposal.title.substring(0, 50)}...`);
      
      const response: AxiosResponse<PredictionResponse> = await this.api.post('/analyze', proposal);
      
      // Cache the result
      this.setCache(cacheKey, response.data);
      
      console.log(`✅ Analysis complete: ${(response.data.success_probability * 100).toFixed(1)}% success probability`);
      
      return response.data;
    } catch (error) {
      console.error('Proposal analysis failed:', error);
      
      // Return fallback prediction
      return this.getFallbackPrediction(proposal);
    }
  }

  /**
   * Add historical data for model training
   */
  async addHistoricalData(data: HistoricalData): Promise<{ status: string; message: string }> {
    try {
      const response = await this.api.post('/historical-data', data);
      console.log(`📊 Added historical data: ${data.proposal_title.substring(0, 50)}...`);
      return response.data;
    } catch (error) {
      console.error('Failed to add historical data:', error);
      throw error;
    }
  }

  /**
   * Get system analytics
   */
  async getAnalytics(): Promise<AnalyticsResponse> {
    try {
      const cacheKey = 'analytics';
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }

      const response: AxiosResponse<AnalyticsResponse> = await this.api.get('/analytics');
      
      // Cache for shorter time (1 minute)
      this.setCache(cacheKey, response.data, 60 * 1000);
      
      return response.data;
    } catch (error) {
      console.error('Failed to get analytics:', error);
      
      // Return fallback analytics
      return {
        total_predictions: 0,
        recent_predictions: 0,
        historical_data_points: 0,
        cache_hit_ratio: 0,
        ai_service_status: 'unavailable',
        uptime: '0%'
      };
    }
  }

  /**
   * Batch analyze multiple proposals
   */
  async batchAnalyze(proposals: GovernanceProposal[]): Promise<PredictionResponse[]> {
    try {
      console.log(`🔮 Batch analyzing ${proposals.length} proposals...`);
      
      const promises = proposals.map(proposal => this.analyzeProposal(proposal));
      const results = await Promise.allSettled(promises);
      
      const predictions: PredictionResponse[] = [];
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          predictions.push(result.value);
        } else {
          console.error(`Failed to analyze proposal ${proposals[index].proposal_id}:`, result.reason);
          predictions.push(this.getFallbackPrediction(proposals[index]));
        }
      });
      
      console.log(`✅ Batch analysis complete: ${predictions.length} predictions`);
      return predictions;
    } catch (error) {
      console.error('Batch analysis failed:', error);
      throw error;
    }
  }

  /**
   * Get prediction confidence level description
   */
  getConfidenceDescription(confidence: number): string {
    if (confidence >= 0.8) return 'Very High';
    if (confidence >= 0.6) return 'High';
    if (confidence >= 0.4) return 'Medium';
    if (confidence >= 0.2) return 'Low';
    return 'Very Low';
  }

  /**
   * Get risk level color
   */
  getRiskColor(riskLevel: string): string {
    switch (riskLevel.toUpperCase()) {
      case 'LOW': return 'text-green-600';
      case 'MEDIUM': return 'text-yellow-600';
      case 'HIGH': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }

  /**
   * Get recommendation color
   */
  getRecommendationColor(recommendation: string): string {
    switch (recommendation.toUpperCase()) {
      case 'APPROVE': return 'text-green-600';
      case 'REJECT': return 'text-red-600';
      case 'NEUTRAL': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  }

  /**
   * Format success probability as percentage
   */
  formatSuccessProbability(probability: number): string {
    return `${(probability * 100).toFixed(1)}%`;
  }

  /**
   * Format economic impact
   */
  formatEconomicImpact(impact: number): string {
    if (Math.abs(impact) < 1000) {
      return `$${impact.toFixed(2)}`;
    } else if (Math.abs(impact) < 1000000) {
      return `$${(impact / 1000).toFixed(1)}K`;
    } else {
      return `$${(impact / 1000000).toFixed(1)}M`;
    }
  }

  // Private methods

  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.detail || error.response.data?.message || 'AI service error';
      return new Error(`AI Service Error (${error.response.status}): ${message}`);
    } else if (error.request) {
      // Request was made but no response received
      return new Error('AI service is not responding. Please check your connection.');
    } else {
      // Something else happened
      return new Error(`AI service error: ${error.message}`);
    }
  }

  private getFallbackPrediction(proposal: GovernanceProposal): PredictionResponse {
    // Simple heuristic-based fallback
    const titleWords = proposal.title.toLowerCase().split(' ');
    const descWords = proposal.description.toLowerCase().split(' ');
    
    const positiveWords = ['improve', 'enhance', 'increase', 'reward', 'benefit', 'upgrade'];
    const negativeWords = ['reduce', 'decrease', 'risk', 'problem', 'concern', 'cut'];
    
    const positiveCount = [...titleWords, ...descWords].filter(word => 
      positiveWords.some(pos => word.includes(pos))
    ).length;
    
    const negativeCount = [...titleWords, ...descWords].filter(word => 
      negativeWords.some(neg => word.includes(neg))
    ).length;
    
    const baseScore = 0.5;
    const sentimentScore = (positiveCount - negativeCount) * 0.1;
    const successProbability = Math.max(0.1, Math.min(0.9, baseScore + sentimentScore));
    
    return {
      proposal_id: proposal.proposal_id,
      success_probability: successProbability,
      confidence_score: 0.3, // Low confidence for fallback
      risk_assessment: 'MEDIUM',
      economic_impact: proposal.treasury_impact || 0,
      key_factors: ['Fallback analysis', 'AI service unavailable'],
      recommendation: 'NEUTRAL',
      analysis_summary: 'Analysis performed using fallback heuristics due to AI service unavailability. Manual review recommended.',
      timestamp: new Date().toISOString()
    };
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    if (cached) {
      this.cache.delete(key);
    }
    return null;
  }

  private setCache(key: string, data: any, timeout?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    
    // Clean up old cache entries
    if (this.cache.size > 100) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }
}

// Export singleton instance
export const productionAiService = new ProductionAiService();
export default productionAiService;