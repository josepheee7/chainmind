import axios from 'axios';

// VITALIK-GRADE AI BACKEND CONNECTION
const AI_BACKEND_URL = 'http://localhost:8000'; // Direct connection to our running AI backend

export interface PredictionRequest {
  proposal_id: number;
  title: string;
  description: string;
  requester_address?: string;
}

export interface PredictionResponse {
  proposal_id: number;
  success_probability: number;  // 0-100
  economic_impact: number;     // -1000 to 1000 (scaled)
  risk_score: number;         // 0-100
  confidence: number;         // 0.0-1.0
  analysis: string;
  factors: {
    sentiment: number;
    economic_mentions: number;
    risk_mentions: number;
    technical_complexity: number;
    urgency_score: number;
  };
}

export interface RevolutionaryPredictionResponse {
  proposal_id: number;
  success_probability: number;
  vitalik_approval_probability: number;
  technical_complexity_score: number;
  innovation_score: number;
  economic_impact_score: number;
  security_risk_score: number;
  community_sentiment_score: number;
  decentralization_score: number;
  scalability_impact_score: number;
  overall_confidence: number;
  detailed_analysis: string;
  key_concerns: string[];
  recommendation: string;
  vitalik_would_approve: boolean;
  hackathon_innovation_score: number;
  silicon_valley_level: string;
  ethereum_ecosystem_impact: number;
  data_freshness_score: number;
}

export interface NetworkMetrics {
  block_number: number;
  gas_price_gwei: number;
  network_utilization: number;
  pending_transactions: number;
  validators: {
    total_validators: number;
    active_validators: number;
    total_staked_eth: number;
    staking_apr: number;
  };
}

export interface GovernanceOverview {
  governance_protocols: any;
  recent_eips: Array<{
    number: number;
    title: string;
    status: string;
    type: string;
    author: string;
  }>;
  governance_health: {
    total_active_proposals: number;
    average_success_rate: number;
    community_participation: number;
    governance_decentralization: number;
  };
}

export interface HistoricalData {
  dao_name: string;
  proposal_title: string;
  proposal_description: string;
  outcome: number;  // 1 for success, 0 for failure
  votes_for: number;
  votes_against: number;
  treasury_impact: number;
}

export interface ServiceStats {
  total_predictions: number;
  historical_data_points: number;
  average_success_probability: number;
  model_accuracy: number;
  service_uptime: string;
}

class AIService {
  private apiClient = axios.create({
    baseURL: AI_BACKEND_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  constructor() {
    // Add request interceptor for API key if needed
    this.apiClient.interceptors.request.use((config) => {
      const apiKey = process.env.REACT_APP_AI_API_KEY;
      if (apiKey) {
        config.headers.Authorization = `Bearer ${apiKey}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('AI Service Error:', error.response?.data || error.message);
        throw error;
      }
    );
  }

  /**
   * Check if AI service is healthy
   */
  async healthCheck(): Promise<any> {
    try {
      const response = await this.apiClient.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('AI Service is not available');
    }
  }

  /**
   * Get AI prediction for a proposal
   */
  async getPrediction(request: PredictionRequest): Promise<PredictionResponse> {
    try {
      const response = await this.apiClient.post('/predict', request);
      return response.data;
    } catch (error: any) {
      console.error('Failed to get AI prediction:', error);
      throw new Error(error.response?.data?.detail || 'Failed to generate prediction');
    }
  }

  /**
   * Get stored prediction for a proposal
   */
  async getStoredPrediction(proposalId: number): Promise<any> {
    try {
      const response = await this.apiClient.get(`/predictions/${proposalId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // Prediction not found
      }
      throw new Error('Failed to retrieve prediction');
    }
  }

  /**
   * Add historical data for model training
   */
  async addHistoricalData(data: HistoricalData): Promise<void> {
    try {
      await this.apiClient.post('/historical-data', data);
    } catch (error) {
      throw new Error('Failed to add historical data');
    }
  }

  /**
   * Get service statistics
   */
  async getStatistics(): Promise<ServiceStats> {
    try {
      const response = await this.apiClient.get('/statistics');
      return response.data;
    } catch (error) {
      throw new Error('Failed to get service statistics');
    }
  }

  /**
   * Trigger model retraining
   */
  async retrainModel(): Promise<void> {
    try {
      await this.apiClient.post('/retrain');
    } catch (error) {
      throw new Error('Failed to retrain model');
    }
  }

  /**
   * Get mock prediction for demo purposes (when AI service is not available)
   */
  getMockPrediction(title: string, description: string): PredictionResponse {
    // Simple heuristic-based mock prediction
    const text = (title + ' ' + description).toLowerCase();
    
    // Calculate mock values based on keywords
    const positiveWords = ['increase', 'improve', 'enhance', 'optimize', 'reward', 'incentive', 'growth'];
    const negativeWords = ['decrease', 'reduce', 'cut', 'penalty', 'risk', 'danger', 'problem'];
    const economicWords = ['treasury', 'fund', 'allocation', 'budget', 'cost', 'fee', 'reward'];
    const riskWords = ['risk', 'danger', 'security', 'audit', 'vulnerability', 'attack'];
    
    const positiveCount = positiveWords.filter(word => text.includes(word)).length;
    const negativeCount = negativeWords.filter(word => text.includes(word)).length;
    const economicCount = economicWords.filter(word => text.includes(word)).length;
    const riskCount = riskWords.filter(word => text.includes(word)).length;
    
    // Calculate success probability (30-90%)
    const baseProbability = 60;
    const sentiment = (positiveCount - negativeCount) * 10;
    const successProbability = Math.max(30, Math.min(90, baseProbability + sentiment));
    
    // Calculate economic impact (-500 to 500)
    const economicImpact = (positiveCount - negativeCount) * 100 + economicCount * 50;
    
    // Calculate risk score (10-80%)
    const riskScore = Math.max(10, Math.min(80, 30 + riskCount * 20 + negativeCount * 10));
    
    // Mock analysis
    let analysis = '';
    if (successProbability > 70) {
      analysis = 'This proposal has a high likelihood of success based on positive sentiment and clear benefits. ';
    } else if (successProbability > 50) {
      analysis = 'This proposal shows moderate potential but may face some challenges in implementation. ';
    } else {
      analysis = 'This proposal faces significant hurdles and may not achieve community consensus. ';
    }
    
    if (economicImpact > 100) {
      analysis += 'Expected positive economic impact on the DAO treasury. ';
    } else if (economicImpact < -100) {
      analysis += 'May have negative economic implications that require careful consideration. ';
    }
    
    if (riskScore > 60) {
      analysis += 'HIGH RISK: This proposal contains significant risk factors.';
    } else if (riskScore > 40) {
      analysis += 'MODERATE RISK: Some risk factors identified.';
    } else {
      analysis += 'LOW RISK: Minimal risk factors detected.';
    }

    return {
      proposal_id: 0,
      success_probability: successProbability,
      economic_impact: economicImpact,
      risk_score: riskScore,
      confidence: 0.75,
      analysis,
      factors: {
        sentiment: (positiveCount - negativeCount) / Math.max(1, positiveCount + negativeCount),
        economic_mentions: economicCount,
        risk_mentions: riskCount,
        technical_complexity: text.includes('smart contract') || text.includes('protocol') ? 2 : 1,
        urgency_score: text.includes('urgent') || text.includes('immediate') ? 1 : 0
      }
    };
  }

  /**
   * Get revolutionary AI prediction with Vitalik alignment
   */
  async getRevolutionaryPrediction(request: PredictionRequest): Promise<RevolutionaryPredictionResponse> {
    try {
      const response = await this.apiClient.post('/analyze', {
        proposal_id: request.proposal_id,
        title: request.title,
        description: request.description,
        proposal_type: 'EIP'
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to get revolutionary prediction:', error);
      throw new Error(error.response?.data?.detail || 'Failed to generate revolutionary prediction');
    }
  }

  /**
   * Get live Ethereum network metrics
   */
  async getNetworkMetrics(): Promise<NetworkMetrics> {
    try {
      const response = await this.apiClient.get('/ethereum/network');
      return response.data;
    } catch (error) {
      throw new Error('Failed to get network metrics');
    }
  }

  /**
   * Get Ethereum governance overview
   */
  async getGovernanceOverview(): Promise<GovernanceOverview> {
    try {
      const response = await this.apiClient.get('/governance/overview');
      return response.data;
    } catch (error) {
      throw new Error('Failed to get governance overview');
    }
  }

  /**
   * Get AI performance metrics
   */
  async getAIPerformance(): Promise<any> {
    try {
      const response = await this.apiClient.get('/ai/performance');
      return response.data;
    } catch (error) {
      throw new Error('Failed to get AI performance metrics');
    }
  }

  /**
   * Get system status
   */
  async getSystemStatus(): Promise<any> {
    try {
      const response = await this.apiClient.get('/system/status');
      return response.data;
    } catch (error) {
      throw new Error('Failed to get system status');
    }
  }

  /**
   * Demo Vitalik proposal analysis
   */
  async getDemoVitalikProposal(): Promise<RevolutionaryPredictionResponse> {
    try {
      const response = await this.apiClient.get('/demo/vitalik-proposal');
      return response.data;
    } catch (error) {
      throw new Error('Failed to get demo Vitalik proposal');
    }
  }

  /**
   * Get prediction with fallback to mock
   */
  async getPredictionWithFallback(request: PredictionRequest): Promise<PredictionResponse> {
    try {
      // Try to get revolutionary prediction first
      const revolutionaryResult = await this.getRevolutionaryPrediction(request);
      
      // Convert to standard format
      return {
        proposal_id: revolutionaryResult.proposal_id,
        success_probability: Math.round(revolutionaryResult.success_probability * 100),
        economic_impact: Math.round(revolutionaryResult.economic_impact_score * 1000),
        risk_score: Math.round(revolutionaryResult.security_risk_score * 100),
        confidence: revolutionaryResult.overall_confidence,
        analysis: revolutionaryResult.detailed_analysis,
        factors: {
          sentiment: revolutionaryResult.community_sentiment_score,
          economic_mentions: Math.round(revolutionaryResult.economic_impact_score * 5),
          risk_mentions: Math.round(revolutionaryResult.security_risk_score * 3),
          technical_complexity: Math.round(revolutionaryResult.technical_complexity_score * 5),
          urgency_score: 0
        }
      };
    } catch (error) {
      console.warn('Revolutionary AI service unavailable, trying standard prediction');
      try {
        return await this.getPrediction(request);
      } catch (standardError) {
        console.warn('Standard AI service unavailable, using mock prediction');
        // Fall back to mock prediction
        const mockPrediction = this.getMockPrediction(request.title, request.description);
        mockPrediction.proposal_id = request.proposal_id;
        return mockPrediction;
      }
    }
  }
}

export const aiService = new AIService();
export default aiService;
