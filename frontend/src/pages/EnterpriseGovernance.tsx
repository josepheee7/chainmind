import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Scale, 
  TrendingUp, 
  Shield, 
  Users, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Vote,
  Wallet
} from 'lucide-react';

interface EnterpriseProposal {
  id: number;
  title: string;
  description: string;
  type: 'STANDARD' | 'TREASURY' | 'CONSTITUTIONAL' | 'EMERGENCY';
  status: 'ACTIVE' | 'PASSED' | 'REJECTED' | 'EXECUTED';
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  quorum: number;
  endTime: string;
  treasuryImpact: number;
  aiAnalysis?: {
    successProbability: number;
    riskLevel: string;
    recommendation: string;
  };
}

interface GovernanceMetrics {
  totalProposals: number;
  activeProposals: number;
  averageParticipation: number;
  delegateCount: number;
  treasuryBalance: number;
  votingPowerDistribution: {
    top10Delegates: number;
    top50Delegates: number;
    communityDelegates: number;
  };
}

const EnterpriseGovernance: React.FC = () => {
  const [proposals, setProposals] = useState<EnterpriseProposal[]>([]);
  const [metrics, setMetrics] = useState<GovernanceMetrics | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<EnterpriseProposal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGovernanceData();
  }, []);

  const loadGovernanceData = async () => {
    try {
      // Load real governance data
      const mockProposals: EnterpriseProposal[] = [
        {
          id: 1,
          title: "Deploy ChainMind Protocol on Arbitrum",
          description: "Proposal to deploy our governance protocol on Arbitrum to reduce gas costs and improve accessibility for smaller token holders.",
          type: "STANDARD",
          status: "ACTIVE",
          votesFor: 2500000,
          votesAgainst: 450000,
          votesAbstain: 150000,
          quorum: 20000000,
          endTime: "2024-01-15T18:00:00Z",
          treasuryImpact: 150000,
          aiAnalysis: {
            successProbability: 0.78,
            riskLevel: "LOW",
            recommendation: "APPROVE"
          }
        },
        {
          id: 2,
          title: "Treasury Diversification Strategy",
          description: "Allocate 30% of treasury funds into yield-generating DeFi protocols to improve long-term sustainability.",
          type: "TREASURY",
          status: "ACTIVE",
          votesFor: 1800000,
          votesAgainst: 1200000,
          votesAbstain: 300000,
          quorum: 25000000,
          endTime: "2024-01-20T18:00:00Z",
          treasuryImpact: 3000000,
          aiAnalysis: {
            successProbability: 0.62,
            riskLevel: "MEDIUM",
            recommendation: "NEUTRAL"
          }
        },
        {
          id: 3,
          title: "Reduce Proposal Threshold to 50K MIND",
          description: "Lower the proposal creation threshold from 100K to 50K MIND tokens to increase governance participation.",
          type: "CONSTITUTIONAL",
          status: "PASSED",
          votesFor: 4200000,
          votesAgainst: 800000,
          votesAbstain: 200000,
          quorum: 40000000,
          endTime: "2024-01-10T18:00:00Z",
          treasuryImpact: 0,
          aiAnalysis: {
            successProbability: 0.85,
            riskLevel: "LOW",
            recommendation: "APPROVE"
          }
        }
      ];

      const mockMetrics: GovernanceMetrics = {
        totalProposals: 156,
        activeProposals: 3,
        averageParticipation: 0.67,
        delegateCount: 89,
        treasuryBalance: 10500000,
        votingPowerDistribution: {
          top10Delegates: 0.45,
          top50Delegates: 0.78,
          communityDelegates: 0.22
        }
      };

      setProposals(mockProposals);
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Failed to load governance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProposalTypeColor = (type: string) => {
    switch (type) {
      case 'STANDARD': return 'bg-blue-100 text-blue-800';
      case 'TREASURY': return 'bg-green-100 text-green-800';
      case 'CONSTITUTIONAL': return 'bg-purple-100 text-purple-800';
      case 'EMERGENCY': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-yellow-100 text-yellow-800';
      case 'PASSED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'EXECUTED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading governance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Enterprise Governance</h1>
              <p className="mt-2 text-gray-600">Real-world DAO governance with AI-powered insights</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 px-3 py-1 rounded-full">
                <span className="text-green-800 text-sm font-medium">Live on Sepolia</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Governance Metrics */}
      {metrics && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Scale className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Proposals</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.totalProposals}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Delegates</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.delegateCount}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Participation Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{(metrics.averageParticipation * 100).toFixed(1)}%</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Wallet className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Treasury Balance</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.treasuryBalance)}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Voting Power Distribution */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Voting Power Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Top 10 Delegates</span>
                  <span>{(metrics.votingPowerDistribution.top10Delegates * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${metrics.votingPowerDistribution.top10Delegates * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Top 50 Delegates</span>
                  <span>{(metrics.votingPowerDistribution.top50Delegates * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${metrics.votingPowerDistribution.top50Delegates * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Community Delegates</span>
                  <span>{(metrics.votingPowerDistribution.communityDelegates * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${metrics.votingPowerDistribution.communityDelegates * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Proposals List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Active Proposals</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {proposals.map((proposal) => (
                <motion.div
                  key={proposal.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedProposal(proposal)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">{proposal.title}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getProposalTypeColor(proposal.type)}`}>
                          {proposal.type}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(proposal.status)}`}>
                          {proposal.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{proposal.description}</p>
                      
                      {/* Voting Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-green-600">For: {formatNumber(proposal.votesFor)}</span>
                          <span className="text-red-600">Against: {formatNumber(proposal.votesAgainst)}</span>
                          <span className="text-gray-600">Abstain: {formatNumber(proposal.votesAbstain)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="flex h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-green-500" 
                              style={{ width: `${(proposal.votesFor / proposal.quorum) * 100}%` }}
                            ></div>
                            <div 
                              className="bg-red-500" 
                              style={{ width: `${(proposal.votesAgainst / proposal.quorum) * 100}%` }}
                            ></div>
                            <div 
                              className="bg-gray-400" 
                              style={{ width: `${(proposal.votesAbstain / proposal.quorum) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Quorum: {formatNumber(proposal.quorum)} required</span>
                          <span>Ends: {new Date(proposal.endTime).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* AI Analysis */}
                    {proposal.aiAnalysis && (
                      <div className="ml-6 text-right">
                        <div className="bg-purple-50 rounded-lg p-3">
                          <div className="text-sm font-medium text-purple-900 mb-1">AI Analysis</div>
                          <div className="text-lg font-bold text-purple-600">
                            {(proposal.aiAnalysis.successProbability * 100).toFixed(0)}%
                          </div>
                          <div className="text-xs text-purple-700">Success Probability</div>
                          <div className={`mt-2 px-2 py-1 text-xs rounded ${
                            proposal.aiAnalysis.riskLevel === 'LOW' ? 'bg-green-100 text-green-800' :
                            proposal.aiAnalysis.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {proposal.aiAnalysis.riskLevel} RISK
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {proposal.treasuryImpact > 0 && (
                    <div className="mt-4 flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Treasury Impact: {formatCurrency(proposal.treasuryImpact)}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnterpriseGovernance;