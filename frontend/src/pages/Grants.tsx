/**
 * Grants Page - Milestone-Based Funding System
 * ============================================
 * 
 * 🚀 VITALIK-GRADE GRANT SYSTEM
 * - Milestone-based funding with community review
 * - Category-based grants (Development, Research, Community, etc.)
 * - Grantee reputation and profile system
 * - Expert reviewer network
 * - Dispute resolution mechanism
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Award,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Calendar,
  BarChart3,
  Star,
  Crown,
  Filter,
  Search,
  Code,
  Beaker,
  Megaphone,
  Wrench,
  ArrowRight,
  Eye,
  ChevronRight,
  Badge,
  FileText,
  MapPin,
  Sparkles,
  User
} from 'lucide-react';
import { useEnhancedWeb3, GrantInfo } from '../contexts/EnhancedWeb3Context';

interface GrantCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  maxFunding: string;
  totalAllocated: string;
  activeGrants: number;
}

interface Milestone {
  id: number;
  title: string;
  description: string;
  amount: string;
  deadline: number;
  status: 'pending' | 'in_progress' | 'submitted' | 'approved' | 'rejected';
  deliverables: string[];
}

interface GrantWithDetails extends GrantInfo {
  description: string;
  proposalHash: string;
  milestones: Milestone[];
  granteeProfile: {
    name: string;
    reputation: number;
    completedGrants: number;
    isVerified: boolean;
  };
}

const Grants: React.FC = () => {
  const navigate = useNavigate();
  const { account, isConnected, connectWallet, getGrants, proposeGrant } = useEnhancedWeb3();

  // State
  const [grants, setGrants] = useState<GrantWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'explore' | 'my-grants' | 'reviews'>('explore');

  // Grant categories
  const categories: GrantCategory[] = [
    {
      id: 'development',
      name: 'Development',
      description: 'Technical development and protocol improvements',
      icon: Code,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20 border-blue-500/30',
      maxFunding: '1,000,000',
      totalAllocated: '650,000',
      activeGrants: 12
    },
    {
      id: 'research',
      name: 'Research',
      description: 'Research initiatives and academic studies',
      icon: Beaker,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20 border-purple-500/30',
      maxFunding: '500,000',
      totalAllocated: '280,000',
      activeGrants: 8
    },
    {
      id: 'community',
      name: 'Community',
      description: 'Community building and engagement programs',
      icon: Users,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20 border-green-500/30',
      maxFunding: '200,000',
      totalAllocated: '120,000',
      activeGrants: 15
    },
    {
      id: 'marketing',
      name: 'Marketing',
      description: 'Marketing and awareness campaigns',
      icon: Megaphone,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20 border-yellow-500/30',
      maxFunding: '300,000',
      totalAllocated: '180,000',
      activeGrants: 6
    },
    {
      id: 'infrastructure',
      name: 'Infrastructure',
      description: 'Infrastructure and tooling development',
      icon: Wrench,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20 border-red-500/30',
      maxFunding: '800,000',
      totalAllocated: '420,000',
      activeGrants: 9
    }
  ];

  // Load grants data
  useEffect(() => {
    if (isConnected) {
      loadGrants();
    }
  }, [isConnected]);

  const loadGrants = async () => {
    try {
      setLoading(true);
      const grantData = await getGrants();
      
      // Mock enhanced grant data for demo
      const enhancedGrants: GrantWithDetails[] = [
        {
          id: 1,
          grantee: '0x1234567890123456789012345678901234567890',
          title: 'Cross-Chain Bridge Development',
          category: 'development',
          totalAmount: '150000',
          releasedAmount: '50000',
          status: 1, // Active
          milestoneIds: [1, 2, 3],
          description: 'Develop a secure and efficient cross-chain bridge to enable seamless asset transfers between Ethereum and Layer 2 solutions.',
          proposalHash: 'QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx',
          milestones: [
            {
              id: 1,
              title: 'Technical Specification & Architecture',
              description: 'Complete technical specification document and system architecture design',
              amount: '30000',
              deadline: Date.now() / 1000 + 86400 * 30,
              status: 'approved',
              deliverables: ['Technical spec document', 'Architecture diagrams', 'Security analysis']
            },
            {
              id: 2,
              title: 'Smart Contract Development',
              description: 'Develop and test core bridge smart contracts',
              amount: '70000',
              deadline: Date.now() / 1000 + 86400 * 60,
              status: 'in_progress',
              deliverables: ['Bridge contracts', 'Unit tests', 'Integration tests']
            },
            {
              id: 3,
              title: 'Frontend Interface & Documentation',
              description: 'Build user interface and comprehensive documentation',
              amount: '50000',
              deadline: Date.now() / 1000 + 86400 * 90,
              status: 'pending',
              deliverables: ['Web interface', 'User documentation', 'API documentation']
            }
          ],
          granteeProfile: {
            name: 'DeFi Builders',
            reputation: 95,
            completedGrants: 8,
            isVerified: true
          }
        },
        {
          id: 2,
          grantee: '0x2345678901234567890123456789012345678901',
          title: 'AI Governance Research Study',
          category: 'research',
          totalAmount: '80000',
          releasedAmount: '80000',
          status: 3, // Completed
          milestoneIds: [4, 5],
          description: 'Research the effectiveness of AI-powered governance systems and their impact on DAO decision-making processes.',
          proposalHash: 'QmYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYy',
          milestones: [
            {
              id: 4,
              title: 'Data Collection & Analysis',
              description: 'Collect governance data and perform statistical analysis',
              amount: '40000',
              deadline: Date.now() / 1000 - 86400 * 30,
              status: 'approved',
              deliverables: ['Dataset', 'Analysis report', 'Statistical models']
            },
            {
              id: 5,
              title: 'Research Paper & Recommendations',
              description: 'Publish research findings and governance recommendations',
              amount: '40000',
              deadline: Date.now() / 1000 - 86400 * 7,
              status: 'approved',
              deliverables: ['Research paper', 'Recommendations', 'Presentation']
            }
          ],
          granteeProfile: {
            name: 'Governance Research Lab',
            reputation: 88,
            completedGrants: 5,
            isVerified: true
          }
        },
        {
          id: 3,
          grantee: '0x3456789012345678901234567890123456789012',
          title: 'Community Ambassador Program',
          category: 'community',
          totalAmount: '60000',
          releasedAmount: '20000',
          status: 1, // Active
          milestoneIds: [6, 7, 8],
          description: 'Establish a global ambassador program to increase community engagement and protocol adoption.',
          proposalHash: 'QmZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZz',
          milestones: [
            {
              id: 6,
              title: 'Ambassador Recruitment',
              description: 'Recruit and onboard community ambassadors worldwide',
              amount: '20000',
              deadline: Date.now() / 1000 - 86400 * 15,
              status: 'approved',
              deliverables: ['Ambassador list', 'Onboarding materials', 'Communication channels']
            },
            {
              id: 7,
              title: 'Educational Content Creation',
              description: 'Create educational content and training materials',
              amount: '25000',
              deadline: Date.now() / 1000 + 86400 * 15,
              status: 'in_progress',
              deliverables: ['Video tutorials', 'Written guides', 'Interactive workshops']
            },
            {
              id: 8,
              title: 'Community Events & Engagement',
              description: 'Organize community events and engagement activities',
              amount: '15000',
              deadline: Date.now() / 1000 + 86400 * 45,
              status: 'pending',
              deliverables: ['Event reports', 'Engagement metrics', 'Community feedback']
            }
          ],
          granteeProfile: {
            name: 'Community Builders DAO',
            reputation: 92,
            completedGrants: 12,
            isVerified: true
          }
        }
      ];

      setGrants(enhancedGrants);
    } catch (error) {
      console.error('Failed to load grants:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGrants = grants.filter(grant => {
    const matchesCategory = selectedCategory === 'all' || grant.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || grant.status.toString() === selectedStatus;
    const matchesSearch = grant.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         grant.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const getStatusInfo = (status: number) => {
    switch (status) {
      case 0: return { label: 'Proposed', color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: Clock };
      case 1: return { label: 'Active', color: 'text-green-400', bg: 'bg-green-500/20', icon: Target };
      case 2: return { label: 'Completed', color: 'text-blue-400', bg: 'bg-blue-500/20', icon: CheckCircle };
      case 3: return { label: 'Canceled', color: 'text-red-400', bg: 'bg-red-500/20', icon: AlertTriangle };
      default: return { label: 'Unknown', color: 'text-gray-400', bg: 'bg-gray-500/20', icon: AlertTriangle };
    }
  };

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-gray-400 bg-gray-500/20';
      case 'in_progress': return 'text-yellow-400 bg-yellow-500/20';
      case 'submitted': return 'text-blue-400 bg-blue-500/20';
      case 'approved': return 'text-green-400 bg-green-500/20';
      case 'rejected': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId) || categories[0];
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Award className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Grant Funding System
          </h1>
          <p className="text-gray-300 mb-8 max-w-md">
            Access milestone-based funding for projects that advance the protocol ecosystem
          </p>
          <button
            onClick={connectWallet}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
          >
            Connect Wallet to Access Grants
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-900/50 to-emerald-900/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-4">
                Grant Funding
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl">
                Milestone-based funding system with community review, expert oversight, and transparent progress tracking
              </p>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="hidden lg:block"
            >
              <button
                onClick={() => navigate('/create-grant')}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                <span>Propose Grant</span>
              </button>
            </motion.div>
          </motion.div>

          {/* Category Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
            {categories.map((category) => {
              const Icon = category.icon;
              const utilizationRate = (parseFloat(category.totalAllocated) / parseFloat(category.maxFunding)) * 100;
              
              return (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg mx-auto mb-3 ${category.bgColor} border`}>
                    <Icon className={`w-5 h-5 ${category.color}`} />
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${category.color}`}>{category.name}</div>
                    <div className="text-sm text-gray-400">{category.activeGrants} active</div>
                    <div className="mt-2">
                      <div className="text-xs text-gray-400 mb-1">
                        {category.totalAllocated} / {category.maxFunding} MIND
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1">
                        <div 
                          className={`h-1 rounded-full bg-gradient-to-r ${category.color.replace('text-', 'from-').replace('-400', '-500')} to-${category.color.replace('text-', '').replace('-400', '-600')}`}
                          style={{ width: `${Math.min(utilizationRate, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/5 backdrop-blur-sm rounded-xl p-1 w-fit">
            {[
              { id: 'explore', label: 'Explore Grants', icon: Search },
              { id: 'my-grants', label: 'My Grants', icon: User },
              { id: 'reviews', label: 'Review Queue', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  selectedTab === tab.id
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {selectedTab === 'explore' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Filters */}
              <div className="flex flex-col lg:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search grants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                  />
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-500"
                >
                  <option value="all">All Status</option>
                  <option value="0">Proposed</option>
                  <option value="1">Active</option>
                  <option value="2">Completed</option>
                  <option value="3">Canceled</option>
                </select>
              </div>

              {/* Grants List */}
              <div className="space-y-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
                    <p className="text-gray-400 mt-2">Loading grants...</p>
                  </div>
                ) : filteredGrants.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Award className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-medium text-white mb-2">No Grants Found</h3>
                    <p>Try adjusting your filters or propose a new grant</p>
                  </div>
                ) : (
                  filteredGrants.map((grant) => {
                    const categoryInfo = getCategoryInfo(grant.category);
                    const statusInfo = getStatusInfo(grant.status);
                    const CategoryIcon = categoryInfo.icon;
                    const StatusIcon = statusInfo.icon;
                    const completedMilestones = grant.milestones.filter(m => m.status === 'approved').length;
                    const progressPercent = (completedMilestones / grant.milestones.length) * 100;
                    
                    return (
                      <motion.div
                        key={grant.id}
                        whileHover={{ scale: 1.01 }}
                        className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
                      >
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Main Content */}
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${categoryInfo.bgColor} border`}>
                                <CategoryIcon className={`w-4 h-4 ${categoryInfo.color}`} />
                                <span className={`text-sm font-medium ${categoryInfo.color}`}>
                                  {categoryInfo.name}
                                </span>
                              </div>
                              
                              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${statusInfo.bg}`}>
                                <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                                <span className={`text-sm font-medium ${statusInfo.color}`}>
                                  {statusInfo.label}
                                </span>
                              </div>
                              
                              {grant.granteeProfile.isVerified && (
                                <div className="flex items-center space-x-1 px-2 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">
                                  <Badge className="w-3 h-3 text-blue-400" />
                                  <span className="text-xs text-blue-400">Verified</span>
                                </div>
                              )}
                            </div>
                            
                            <h3 className="text-xl font-bold text-white mb-2">{grant.title}</h3>
                            <p className="text-gray-300 mb-4 line-clamp-2">{grant.description}</p>
                            
                            {/* Grant Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <div className="text-sm text-gray-400">Total Funding</div>
                                <div className="text-green-400 font-bold">
                                  {parseFloat(grant.totalAmount).toLocaleString()} MIND
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-sm text-gray-400">Released</div>
                                <div className="text-white font-medium">
                                  {parseFloat(grant.releasedAmount).toLocaleString()} MIND
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-sm text-gray-400">Grantee</div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-white font-medium">{grant.granteeProfile.name}</span>
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-3 h-3 text-yellow-400" />
                                    <span className="text-xs text-yellow-400">{grant.granteeProfile.reputation}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="mb-4">
                              <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                                <span>Milestone Progress</span>
                                <span>{completedMilestones} / {grant.milestones.length} completed</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div 
                                  className="h-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-300"
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => navigate(`/grant/${grant.id}`)}
                                className="flex items-center space-x-2 px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-all duration-300"
                              >
                                <Eye className="w-4 h-4" />
                                <span>View Details</span>
                              </button>
                              
                              {grant.granteeProfile.isVerified && (
                                <div className="flex items-center space-x-2 px-3 py-2 bg-green-500/20 rounded-lg border border-green-500/30">
                                  <Crown className="w-4 h-4 text-green-400" />
                                  <span className="text-sm text-green-400">Verified Grantee</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Milestones Preview */}
                          <div className="lg:w-80">
                            <h4 className="text-lg font-semibold text-white mb-3">Milestones</h4>
                            <div className="space-y-3">
                              {grant.milestones.slice(0, 3).map((milestone, index) => (
                                <div key={milestone.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-white font-medium text-sm">{milestone.title}</span>
                                    <div className={`px-2 py-1 rounded-full text-xs ${getMilestoneStatusColor(milestone.status)}`}>
                                      {milestone.status.replace('_', ' ')}
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">
                                      {parseFloat(milestone.amount).toLocaleString()} MIND
                                    </span>
                                    <span className="text-gray-400">
                                      {new Date(milestone.deadline * 1000).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              ))}
                              
                              {grant.milestones.length > 3 && (
                                <div className="text-center">
                                  <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1 mx-auto">
                                    <span>View all {grant.milestones.length} milestones</span>
                                    <ChevronRight className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}

          {selectedTab === 'my-grants' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12 text-gray-400"
            >
              <Award className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium text-white mb-2">No Active Grants</h3>
              <p>You haven't received any grants yet. Propose a project to get started!</p>
              <button
                onClick={() => navigate('/create-grant')}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
              >
                Propose Grant
              </button>
            </motion.div>
          )}

          {selectedTab === 'reviews' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12 text-gray-400"
            >
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium text-white mb-2">No Reviews Pending</h3>
              <p>There are no grant milestones waiting for your review at this time.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Create Button */}
        <div className="lg:hidden fixed bottom-6 right-6">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <button
              onClick={() => navigate('/create-grant')}
              className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
            >
              <Plus className="w-6 h-6" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Grants;
