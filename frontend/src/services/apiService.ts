// Real API service connecting to our AI backend
const API_BASE_URL = 'http://localhost:5000/api';

export class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request('/health');
  }

  // Proposals
  async getProposals(): Promise<any[]> {
    return this.request('/proposals');
  }

  async createProposal(proposal: {
    title: string;
    description: string;
    category: string;
    creator: string;
  }): Promise<{ success: boolean; proposal_id: number; ai_analysis: any }> {
    return this.request('/proposals', {
      method: 'POST',
      body: JSON.stringify(proposal),
    });
  }

  async voteOnProposal(proposalId: number, vote: 'for' | 'against'): Promise<{ success: boolean; vote: string }> {
    return this.request(`/proposals/${proposalId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ vote }),
    });
  }

  // AI Services
  async analyzeProposal(proposalId: number): Promise<any> {
    return this.request(`/ai/analyze/${proposalId}`);
  }

  async getMarketPrediction(symbol: string = 'MIND'): Promise<any> {
    return this.request(`/ai/market-prediction?symbol=${symbol}`);
  }

  async getSentiment(): Promise<any> {
    return this.request('/ai/sentiment');
  }

  // Dashboard
  async getDashboardStats(): Promise<any> {
    return this.request('/dashboard/stats');
  }
}

export const apiService = new ApiService();
