import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Code,
  FileText,
  Search,
  ChevronRight,
  ExternalLink,
  Copy,
  Download,
  Github,
  Globe,
  Zap,
  Shield,
  Users,
  Brain,
  TrendingUp
} from 'lucide-react';

const Documentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Zap,
      content: 'Quick start guide and basic setup'
    },
    {
      id: 'api-reference',
      title: 'API Reference',
      icon: Code,
      content: 'Complete API documentation and endpoints'
    },
    {
      id: 'smart-contracts',
      title: 'Smart Contracts',
      icon: Shield,
      content: 'Contract architecture and deployment'
    },
    {
      id: 'ai-integration',
      title: 'AI Integration',
      icon: Brain,
      content: 'AI prediction models and integration'
    },
    {
      id: 'governance',
      title: 'Governance',
      icon: Users,
      content: 'Governance mechanisms and voting'
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: TrendingUp,
      content: 'Analytics and data insights'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Documentation
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Complete guides and API reference for ChainMind
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <a
            href="https://github.com/chainmind/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
                placeholder="Search docs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
        </div>

              <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                    <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeSection === section.id
                        ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div>
                      <div className="font-medium">{section.title}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{section.content}</div>
                      </div>
                    </button>
                );
              })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="prose dark:prose-invert max-w-none"
            >
              {activeSection === 'getting-started' && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    Getting Started with ChainMind
                      </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Welcome to ChainMind, the AI-powered governance platform. This guide will help you get started with the platform and understand its core features.
                  </p>

                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                        🚀 Quick Start
                      </h3>
                      <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300">
                        <li>Connect your Web3 wallet (MetaMask recommended)</li>
                        <li>Stake MIND tokens to earn voting power</li>
                        <li>Browse and vote on governance proposals</li>
                        <li>View AI predictions for informed decision-making</li>
                        <li>Earn rewards for active participation</li>
                      </ol>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                        Key Features
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                          <div className="flex items-center space-x-3 mb-2">
                            <Brain className="w-5 h-5 text-purple-600" />
                            <h4 className="font-medium text-slate-900 dark:text-white">AI Predictions</h4>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Advanced ML models provide 85%+ accurate predictions for proposal outcomes
                          </p>
                        </div>
                        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                          <div className="flex items-center space-x-3 mb-2">
                            <Shield className="w-5 h-5 text-blue-600" />
                            <h4 className="font-medium text-slate-900 dark:text-white">Secure Voting</h4>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            On-chain voting with reputation-based governance mechanisms
                          </p>
                        </div>
                        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                          <div className="flex items-center space-x-3 mb-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <h4 className="font-medium text-slate-900 dark:text-white">Real-time Analytics</h4>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Live governance metrics and performance insights
                          </p>
                        </div>
                        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                          <div className="flex items-center space-x-3 mb-2">
                            <Users className="w-5 h-5 text-orange-600" />
                            <h4 className="font-medium text-slate-900 dark:text-white">Community Driven</h4>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Active community with discussion forums and events
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'api-reference' && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    API Reference
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Complete API documentation for integrating with ChainMind's services.
                  </p>

                  <div className="space-y-6">
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        Base URL
                      </h3>
                      <code className="text-sm bg-white dark:bg-slate-700 px-2 py-1 rounded">
                        https://api.chainmind.io/v1
                      </code>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                        Authentication
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        All API requests require authentication using your API key in the header:
                      </p>
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                        <code className="text-sm">
                          Authorization: Bearer YOUR_API_KEY
                        </code>
                      </div>
                  </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                        Endpoints
                        </h3>
                      <div className="space-y-4">
                        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300 rounded text-xs font-medium">
                              GET
                            </span>
                            <code className="text-sm">/proposals</code>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            Get all governance proposals
                          </p>
                          <div className="bg-slate-50 dark:bg-slate-800 rounded p-2">
                            <code className="text-xs">
                              GET /api/v1/proposals?limit=10&offset=0
                            </code>
                          </div>
                        </div>

                        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 rounded text-xs font-medium">
                              POST
                            </span>
                            <code className="text-sm">/predictions</code>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            Get AI prediction for a proposal
                          </p>
                          <div className="bg-slate-50 dark:bg-slate-800 rounded p-2">
                            <code className="text-xs">
                              POST /api/v1/predictions {"{"}"proposal_id": 123{"}"}
                            </code>
                          </div>
                        </div>

                        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 rounded text-xs font-medium">
                              POST
                              </span>
                            <code className="text-sm">/votes</code>
                            </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            Cast a vote on a proposal
                          </p>
                          <div className="bg-slate-50 dark:bg-slate-800 rounded p-2">
                            <code className="text-xs">
                              POST /api/v1/votes {"{"}"proposal_id": 123, "support": true{"}"}
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                          </div>
                        )}

              {activeSection === 'smart-contracts' && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    Smart Contracts
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Learn about ChainMind's smart contract architecture and deployment.
                  </p>

                      <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <h4 className="font-medium text-slate-900 dark:text-white mb-2">ChainMindDAO</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          Core governance contract
                        </p>
                        <code className="text-xs bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">
                          0x1234...5678
                        </code>
                      </div>
                      <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <h4 className="font-medium text-slate-900 dark:text-white mb-2">ChainMindToken</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          Governance token (MIND)
                        </p>
                        <code className="text-xs bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">
                          0x8765...4321
                                </code>
                              </div>
                      <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <h4 className="font-medium text-slate-900 dark:text-white mb-2">AIOracle</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          AI prediction oracle
                        </p>
                        <code className="text-xs bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">
                          0xabcd...efgh
                        </code>
                      </div>
                            </div>
                            
                                <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                        Contract Functions
                      </h3>
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                        <h4 className="font-medium text-slate-900 dark:text-white mb-2">Governance Functions</h4>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                          <li><code>createProposal(string title, string description)</code> - Create new proposal</li>
                          <li><code>castVote(uint256 proposalId, bool support)</code> - Vote on proposal</li>
                          <li><code>executeProposal(uint256 proposalId)</code> - Execute passed proposal</li>
                          <li><code>getProposal(uint256 proposalId)</code> - Get proposal details</li>
                        </ul>
                      </div>
                    </div>
                                  </div>
                                </div>
                              )}
                              
              {activeSection === 'ai-integration' && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    AI Integration
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Understand how ChainMind's AI system works and how to integrate with it.
                  </p>

                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                        🤖 AI Prediction Models
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white mb-2">BERT/RoBERTa</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Natural language processing for proposal sentiment analysis
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white mb-2">Random Forest</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Ensemble learning for outcome prediction
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white mb-2">Gradient Boosting</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Advanced boosting algorithms for accuracy
                          </p>
                        </div>
                              <div>
                          <h4 className="font-medium text-slate-900 dark:text-white mb-2">Neural Networks</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Deep learning for complex pattern recognition
                          </p>
                        </div>
                                </div>
                              </div>
                              
                              <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                        Integration Guide
                      </h3>
                      <div className="space-y-4">
                        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                          <h4 className="font-medium text-slate-900 dark:text-white mb-2">1. API Integration</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            Use our REST API to get predictions for proposals:
                          </p>
                          <div className="bg-slate-50 dark:bg-slate-800 rounded p-2">
                            <code className="text-xs">
                              curl -X POST https://api.chainmind.io/v1/predictions {"{"}"proposal_id": 123{"}"}
                            </code>
                          </div>
                        </div>

                        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                          <h4 className="font-medium text-slate-900 dark:text-white mb-2">2. WebSocket Stream</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            Subscribe to real-time prediction updates:
                          </p>
                          <div className="bg-slate-50 dark:bg-slate-800 rounded p-2">
                            <code className="text-xs">
                              ws://api.chainmind.io/v1/predictions/stream
                            </code>
                          </div>
                        </div>

                        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                          <h4 className="font-medium text-slate-900 dark:text-white mb-2">3. Smart Contract Integration</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            Call AI predictions directly from smart contracts:
                          </p>
                          <div className="bg-slate-50 dark:bg-slate-800 rounded p-2">
                            <code className="text-xs">
                              AIOracle.getPrediction(proposalId) returns (uint256 probability, uint256 confidence)
                            </code>
                          </div>
                        </div>
                      </div>
                                </div>
                              </div>
                            </div>
              )}

              {activeSection === 'governance' && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    Governance Mechanisms
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Learn about ChainMind's governance system and voting mechanisms.
                  </p>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                          Voting Power
                        </h3>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                          <li>• Staked MIND tokens determine voting power</li>
                          <li>• Lock periods provide voting power multipliers</li>
                          <li>• Reputation system affects vote weight</li>
                          <li>• Quadratic voting for better representation</li>
                        </ul>
                      </div>

                      <div className="p-6 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                          Proposal Lifecycle
                        </h3>
                        <ol className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                          <li>1. Proposal creation and submission</li>
                          <li>2. Community discussion and feedback</li>
                          <li>3. AI prediction and analysis</li>
                          <li>4. Voting period (typically 7 days)</li>
                          <li>5. Execution if passed</li>
                        </ol>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                        Governance Parameters
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <h4 className="font-medium text-slate-900 dark:text-white">Quorum</h4>
                          <p className="text-2xl font-bold text-purple-600">2M MIND</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Minimum votes required</p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <h4 className="font-medium text-slate-900 dark:text-white">Voting Period</h4>
                          <p className="text-2xl font-bold text-blue-600">7 days</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Standard voting duration</p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <h4 className="font-medium text-slate-900 dark:text-white">Execution Delay</h4>
                          <p className="text-2xl font-bold text-green-600">24 hours</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Time before execution</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'analytics' && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    Analytics & Insights
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Understand ChainMind's analytics capabilities and data insights.
                  </p>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                          📊 Key Metrics
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">Total Proposals</span>
                            <span className="font-medium">156</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">Success Rate</span>
                            <span className="font-medium text-green-600">77.6%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">AI Accuracy</span>
                            <span className="font-medium text-blue-600">84.2%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">Participation</span>
                            <span className="font-medium text-purple-600">67.8%</span>
                          </div>
                        </div>
            </div>

                      <div className="p-6 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                          📈 Data Sources
              </h3>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                          <li>• On-chain governance data</li>
                          <li>• Social media sentiment analysis</li>
                          <li>• Market data and DeFi metrics</li>
                          <li>• Community engagement metrics</li>
                          <li>• Historical voting patterns</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                        Analytics API
                      </h3>
                      <div className="space-y-4">
                        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                          <h4 className="font-medium text-slate-900 dark:text-white mb-2">Governance Analytics</h4>
                          <div className="bg-slate-50 dark:bg-slate-800 rounded p-2">
                            <code className="text-xs">
                              GET /api/v1/analytics/governance?timeframe=30d
                            </code>
                          </div>
                        </div>

                        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                          <h4 className="font-medium text-slate-900 dark:text-white mb-2">AI Performance</h4>
                          <div className="bg-slate-50 dark:bg-slate-800 rounded p-2">
                            <code className="text-xs">
                              GET /api/v1/analytics/ai-performance
                            </code>
                          </div>
                        </div>

                        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                          <h4 className="font-medium text-slate-900 dark:text-white mb-2">Community Metrics</h4>
                          <div className="bg-slate-50 dark:bg-slate-800 rounded p-2">
                            <code className="text-xs">
                              GET /api/v1/analytics/community?metric=engagement
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>
              </div>
            </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;