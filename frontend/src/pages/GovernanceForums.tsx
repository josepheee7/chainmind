/**
 * Governance Forums - Pre-vote Discussion Platform
 * ===============================================
 * 
 * 🚀 VITALIK-GRADE DISCUSSION PLATFORM
 * - Pre-vote discussions for all proposals
 * - Expert opinions and community sentiment
 * - Threaded conversations with voting
 * - AI-powered moderation and insights
 * - MetaMask.io design language
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Flag,
  Pin,
  Crown,
  Star,
  Brain,
  TrendingUp,
  Clock,
  Users,
  Filter,
  Search,
  Plus,
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Eye,
  ChevronRight,
  Sparkles,
  Badge,
  AlertTriangle,
  CheckCircle,
  Heart,
  Share,
  Bookmark
} from 'lucide-react';
import { useEnhancedWeb3 } from '../contexts/EnhancedWeb3Context';

interface ForumPost {
  id: string;
  proposalId?: number;
  author: {
    address: string;
    name: string;
    reputation: number;
    isExpert: boolean;
    isVerified: boolean;
    avatar: string;
  };
  title: string;
  content: string;
  category: 'general' | 'proposal' | 'technical' | 'governance' | 'grants';
  timestamp: number;
  upvotes: number;
  downvotes: number;
  replies: number;
  views: number;
  isPinned: boolean;
  tags: string[];
  aiSentiment: 'positive' | 'negative' | 'neutral';
  aiInsights?: {
    keyPoints: string[];
    sentiment: number;
    engagement: number;
  };
}

interface Reply {
  id: string;
  postId: string;
  author: {
    address: string;
    name: string;
    reputation: number;
    isExpert: boolean;
    avatar: string;
  };
  content: string;
  timestamp: number;
  upvotes: number;
  downvotes: number;
  parentReplyId?: string;
}

const GovernanceForums: React.FC = () => {
  const navigate = useNavigate();
  const { account, isConnected, connectWallet, reputation } = useEnhancedWeb3();

  // State
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'trending'>('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const categories = [
    { id: 'all', name: 'All Discussions', icon: MessageSquare, color: 'text-blue-400' },
    { id: 'proposal', name: 'Proposal Discussion', icon: MessageCircle, color: 'text-purple-400' },
    { id: 'technical', name: 'Technical', icon: Brain, color: 'text-cyan-400' },
    { id: 'governance', name: 'Governance', icon: Crown, color: 'text-yellow-400' },
    { id: 'grants', name: 'Grants', icon: Star, color: 'text-green-400' },
    { id: 'general', name: 'General', icon: Users, color: 'text-gray-400' }
  ];

  // Load forum data
  useEffect(() => {
    loadForumPosts();
  }, []);

  const loadForumPosts = async () => {
    try {
      setLoading(true);
      
      // Mock forum data for demo
      const mockPosts: ForumPost[] = [
        {
          id: '1',
          proposalId: 1,
          author: {
            address: '0x742d35Cc6564C59E5D9B7B5d5c8F2B8e4A47F1e3',
            name: 'DeFi Expert',
            reputation: 95,
            isExpert: true,
            isVerified: true,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=expert1'
          },
          title: 'DeFi Integration Research Grant - Technical Discussion',
          content: 'I\'ve reviewed the technical specifications for the proposed DeFi integration research. The approach seems sound, but I have concerns about the cross-chain security assumptions. Here are my detailed thoughts...',
          category: 'proposal',
          timestamp: Date.now() - 3600000, // 1 hour ago
          upvotes: 28,
          downvotes: 3,
          replies: 15,
          views: 245,
          isPinned: true,
          tags: ['defi', 'security', 'cross-chain'],
          aiSentiment: 'positive',
          aiInsights: {
            keyPoints: ['Security concerns raised', 'Technical expertise demonstrated', 'Constructive feedback'],
            sentiment: 75,
            engagement: 88
          }
        },
        {
          id: '2',
          author: {
            address: '0x1234567890123456789012345678901234567890',
            name: 'Community Advocate',
            reputation: 78,
            isExpert: false,
            isVerified: true,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=community1'
          },
          title: 'Governance Staking Multipliers - Community Impact Analysis',
          content: 'The proposed increase in staking multipliers could significantly impact smaller community members. Let\'s discuss how to maintain inclusivity while rewarding long-term commitment...',
          category: 'governance',
          timestamp: Date.now() - 7200000, // 2 hours ago
          upvotes: 42,
          downvotes: 8,
          replies: 23,
          views: 389,
          isPinned: false,
          tags: ['staking', 'community', 'governance'],
          aiSentiment: 'neutral',
          aiInsights: {
            keyPoints: ['Inclusivity concerns', 'Long-term thinking', 'Community focus'],
            sentiment: 65,
            engagement: 92
          }
        },
        {
          id: '3',
          proposalId: 3,
          author: {
            address: '0x9876543210987654321098765432109876543210',
            name: 'Treasury Manager',
            reputation: 89,
            isExpert: true,
            isVerified: true,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=treasury1'
          },
          title: 'Treasury Diversification Strategy - Risk Assessment',
          content: 'I\'ve conducted a thorough risk analysis of the proposed treasury diversification. Here\'s my assessment of the DeFi protocols suggested and alternative approaches we should consider...',
          category: 'proposal',
          timestamp: Date.now() - 10800000, // 3 hours ago
          upvotes: 35,
          downvotes: 5,
          replies: 18,
          views: 298,
          isPinned: false,
          tags: ['treasury', 'defi', 'risk'],
          aiSentiment: 'positive',
          aiInsights: {
            keyPoints: ['Comprehensive analysis', 'Risk mitigation focus', 'Expert opinion'],
            sentiment: 82,
            engagement: 85
          }
        },
        {
          id: '4',
          author: {
            address: '0x5555555555555555555555555555555555555555',
            name: 'Tech Lead',
            reputation: 91,
            isExpert: true,
            isVerified: true,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech1'
          },
          title: 'AI Oracle Accuracy Improvements - Technical Proposal',
          content: 'I\'ve been analyzing our AI oracle\'s prediction accuracy and have identified several areas for improvement. Here\'s a technical deep-dive into potential enhancements...',
          category: 'technical',
          timestamp: Date.now() - 14400000, // 4 hours ago
          upvotes: 56,
          downvotes: 2,
          replies: 31,
          views: 445,
          isPinned: false,
          tags: ['ai', 'oracle', 'technical'],
          aiSentiment: 'positive',
          aiInsights: {
            keyPoints: ['Technical innovation', 'Data-driven approach', 'Improvement focus'],
            sentiment: 89,
            engagement: 94
          }
        },
        {
          id: '5',
          author: {
            address: '0x3333333333333333333333333333333333333333',
            name: 'Grant Reviewer',
            reputation: 84,
            isExpert: false,
            isVerified: true,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reviewer1'
          },
          title: 'Grant Review Process Optimization',
          content: 'Based on my experience reviewing grant proposals, I\'d like to suggest improvements to our milestone evaluation process. Here are specific recommendations...',
          category: 'grants',
          timestamp: Date.now() - 18000000, // 5 hours ago
          upvotes: 29,
          downvotes: 1,
          replies: 12,
          views: 187,
          isPinned: false,
          tags: ['grants', 'process', 'optimization'],
          aiSentiment: 'positive',
          aiInsights: {
            keyPoints: ['Process improvement', 'Experience-based insights', 'Constructive suggestions'],
            sentiment: 78,
            engagement: 76
          }
        }
      ];

      setPosts(mockPosts);
    } catch (error) {
      console.error('Failed to load forum posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return b.timestamp - a.timestamp;
      case 'popular':
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      case 'trending':
        const aEngagement = a.views + a.replies * 2 + a.upvotes * 3;
        const bEngagement = b.views + b.replies * 2 + b.upvotes * 3;
        return bEngagement - aEngagement;
      default:
        return 0;
    }
  });

  // Sort to show pinned posts first
  const finalPosts = sortedPosts.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${Math.floor(diff / (1000 * 60))}m ago`;
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400 bg-green-500/20';
      case 'negative': return 'text-red-400 bg-red-500/20';
      case 'neutral': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
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
            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
              <MessageSquare className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Governance Forums
          </h1>
          <p className="text-gray-300 mb-8 max-w-md">
            Join discussions, share insights, and shape governance decisions with the community
          </p>
          <button
            onClick={connectWallet}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all duration-300"
          >
            Connect Wallet to Join Discussions
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-4">
                Governance Forums
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl">
                Pre-vote discussions, expert insights, and community sentiment analysis powered by AI
              </p>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="hidden lg:block"
            >
              <button
                onClick={() => setShowCreatePost(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                <span>New Discussion</span>
              </button>
            </motion.div>
          </motion.div>

          {/* Community Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{posts.length}</div>
              <div className="text-sm text-gray-400">Active Discussions</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">1,247</div>
              <div className="text-sm text-gray-400">Active Members</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg mx-auto mb-3">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{reputation}</div>
              <div className="text-sm text-gray-400">Your Reputation</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-pink-500 to-red-600 rounded-lg mx-auto mb-3">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">AI</div>
              <div className="text-sm text-gray-400">Moderated</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-6">
              <h3 className="text-lg font-bold text-white mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isActive = selectedCategory === category.id;
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                        isActive
                          ? 'bg-white/10 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : category.color}`} />
                      <span className="font-medium">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-xl p-6 border border-purple-500/30">
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-5 h-5 text-purple-400" />
                <span className="text-white font-medium">AI Forum Insights</span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Community Sentiment</span>
                  <span className="text-green-400 font-medium">78% Positive</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-300">Expert Engagement</span>
                  <span className="text-blue-400 font-medium">High</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-300">Hot Topics</span>
                  <div className="text-right">
                    <div className="text-yellow-400 text-xs">#staking</div>
                    <div className="text-yellow-400 text-xs">#treasury</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value="latest">Latest</option>
                <option value="popular">Most Popular</option>
                <option value="trending">Trending</option>
              </select>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                  <p className="text-gray-400 mt-2">Loading discussions...</p>
                </div>
              ) : finalPosts.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-medium text-white mb-2">No Discussions Found</h3>
                  <p>Start a new discussion or try different filters</p>
                </div>
              ) : (
                finalPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-12 h-12 rounded-full border-2 border-white/20"
                        />
                        {post.author.isExpert && (
                          <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          {post.isPinned && (
                            <Pin className="w-4 h-4 text-yellow-400" />
                          )}
                          
                          {post.proposalId && (
                            <div className="px-2 py-1 bg-blue-500/20 rounded text-xs text-blue-400 border border-blue-500/30">
                              Proposal #{post.proposalId}
                            </div>
                          )}
                          
                          <div className={`px-2 py-1 rounded text-xs ${getSentimentColor(post.aiSentiment)}`}>
                            AI: {post.aiSentiment}
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2 hover:text-purple-400 cursor-pointer">
                          {post.title}
                        </h3>

                        <p className="text-gray-300 mb-3 line-clamp-2">
                          {post.content}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-white/10 text-gray-300 rounded text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Author Info */}
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-medium">{post.author.name}</span>
                            {post.author.isVerified && (
                              <CheckCircle className="w-4 h-4 text-blue-400" />
                            )}
                            {post.author.isExpert && (
                              <Badge className="w-4 h-4 text-yellow-400" />
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400" />
                            <span className="text-xs text-yellow-400">{post.author.reputation}</span>
                          </div>
                          
                          <span className="text-xs text-gray-400">
                            {formatTimeAgo(post.timestamp)}
                          </span>
                        </div>

                        {/* AI Insights */}
                        {post.aiInsights && (
                          <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-lg p-3 border border-purple-500/20 mb-3">
                            <div className="flex items-center space-x-2 mb-2">
                              <Brain className="w-4 h-4 text-purple-400" />
                              <span className="text-sm font-medium text-purple-400">AI Analysis</span>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 text-xs">
                              <div>
                                <div className="text-gray-400">Sentiment</div>
                                <div className="text-white font-medium">{post.aiInsights.sentiment}%</div>
                              </div>
                              
                              <div>
                                <div className="text-gray-400">Engagement</div>
                                <div className="text-white font-medium">{post.aiInsights.engagement}%</div>
                              </div>
                              
                              <div>
                                <div className="text-gray-400">Key Points</div>
                                <div className="text-white font-medium">{post.aiInsights.keyPoints.length}</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <button className="flex items-center space-x-1 text-gray-400 hover:text-green-400 transition-colors">
                              <ThumbsUp className="w-4 h-4" />
                              <span className="text-sm">{post.upvotes}</span>
                            </button>
                            
                            <button className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors">
                              <ThumbsDown className="w-4 h-4" />
                              <span className="text-sm">{post.downvotes}</span>
                            </button>
                            
                            <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors">
                              <MessageCircle className="w-4 h-4" />
                              <span className="text-sm">{post.replies} replies</span>
                            </button>
                            
                            <div className="flex items-center space-x-1 text-gray-400">
                              <Eye className="w-4 h-4" />
                              <span className="text-sm">{post.views} views</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                              <Share className="w-4 h-4" />
                            </button>
                            
                            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                              <Bookmark className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Mobile Create Button */}
        <div className="lg:hidden fixed bottom-6 right-6">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <button
              onClick={() => setShowCreatePost(true)}
              className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full shadow-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300"
            >
              <Plus className="w-6 h-6" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreatePost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreatePost(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full border border-white/10"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">Start New Discussion</h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Discussion title..."
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
                
                <select className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500">
                  <option value="">Select category...</option>
                  {categories.slice(1).map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                
                <textarea
                  placeholder="What would you like to discuss?"
                  rows={6}
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                />
                
                <input
                  type="text"
                  placeholder="Tags (comma separated)..."
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                
                <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all duration-300">
                  Post Discussion
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GovernanceForums;
