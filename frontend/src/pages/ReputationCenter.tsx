/**
 * Reputation Center - Governance Gamification System
 * =================================================
 * 
 * 🚀 VITALIK-GRADE ACHIEVEMENT SYSTEM
 * - Comprehensive reputation tracking
 * - Achievement badges and milestones
 * - Governance participation rewards
 * - Leaderboards and rankings
 * - NFT badge minting system
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  Star,
  Trophy,
  Crown,
  Badge,
  Target,
  TrendingUp,
  Clock,
  Vote,
  MessageSquare,
  Users,
  Zap,
  Shield,
  Brain,
  Sparkles,
  Gift,
  ChevronRight,
  ExternalLink,
  Download,
  Share,
  Lock,
  Unlock,
  Calendar,
  BarChart3,
  Medal,
  Gem,
  Flame,
  ArrowUp,
  CheckCircle,
  Plus
} from 'lucide-react';
import { useEnhancedWeb3 } from '../contexts/EnhancedWeb3Context';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'voting' | 'proposals' | 'staking' | 'community' | 'expert' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  requirement: {
    type: string;
    value: number;
    description: string;
  };
  unlockedAt?: number;
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
  nftMinted?: boolean;
}

interface UserProfile {
  address: string;
  name: string;
  totalReputation: number;
  rank: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  badges: Achievement[];
  streaks: {
    voting: number;
    proposals: number;
    forum: number;
  };
  stats: {
    totalVotes: number;
    proposalsCreated: number;
    forumPosts: number;
    stakedAmount: string;
    delegatedPower: string;
    correctPredictions: number;
    communityContributions: number;
  };
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
}

const ReputationCenter: React.FC = () => {
  const navigate = useNavigate();
  const { account, isConnected, connectWallet, reputation, votingPower } = useEnhancedWeb3();

  // State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [leaderboard, setLeaderboard] = useState<UserProfile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTab, setSelectedTab] = useState<'profile' | 'achievements' | 'leaderboard'>('profile');
  const [loading, setLoading] = useState(true);

  // Achievement definitions
  const achievementDefinitions: Achievement[] = [
    {
      id: 'first_vote',
      name: 'First Voice',
      description: 'Cast your first governance vote',
      icon: Vote,
      category: 'voting',
      rarity: 'common',
      points: 50,
      requirement: { type: 'votes_cast', value: 1, description: 'Cast 1 vote' },
      isUnlocked: true,
      progress: 1,
      maxProgress: 1,
      unlockedAt: Date.now() - 86400000
    },
    {
      id: 'active_voter',
      name: 'Active Voter',
      description: 'Participate in 10 governance votes',
      icon: Trophy,
      category: 'voting',
      rarity: 'rare',
      points: 200,
      requirement: { type: 'votes_cast', value: 10, description: 'Cast 10 votes' },
      isUnlocked: true,
      progress: 10,
      maxProgress: 10,
      unlockedAt: Date.now() - 172800000
    },
    {
      id: 'democracy_champion',
      name: 'Democracy Champion',
      description: 'Cast 100 governance votes',
      icon: Crown,
      category: 'voting',
      rarity: 'epic',
      points: 1000,
      requirement: { type: 'votes_cast', value: 100, description: 'Cast 100 votes' },
      isUnlocked: false,
      progress: 42,
      maxProgress: 100
    },
    {
      id: 'proposal_creator',
      name: 'Proposal Creator',
      description: 'Create your first governance proposal',
      icon: Star,
      category: 'proposals',
      rarity: 'rare',
      points: 300,
      requirement: { type: 'proposals_created', value: 1, description: 'Create 1 proposal' },
      isUnlocked: true,
      progress: 1,
      maxProgress: 1,
      unlockedAt: Date.now() - 259200000,
      nftMinted: true
    },
    {
      id: 'visionary',
      name: 'Visionary',
      description: 'Create 5 successful proposals',
      icon: Brain,
      category: 'proposals',
      rarity: 'epic',
      points: 1500,
      requirement: { type: 'successful_proposals', value: 5, description: 'Create 5 successful proposals' },
      isUnlocked: false,
      progress: 2,
      maxProgress: 5
    },
    {
      id: 'staking_pioneer',
      name: 'Staking Pioneer',
      description: 'Stake tokens for governance power',
      icon: Lock,
      category: 'staking',
      rarity: 'common',
      points: 100,
      requirement: { type: 'tokens_staked', value: 1000, description: 'Stake 1,000 MIND tokens' },
      isUnlocked: true,
      progress: 5000,
      maxProgress: 1000,
      unlockedAt: Date.now() - 345600000
    },
    {
      id: 'diamond_hands',
      name: 'Diamond Hands',
      description: 'Maintain staking for 1 year',
      icon: Gem,
      category: 'staking',
      rarity: 'legendary',
      points: 5000,
      requirement: { type: 'staking_duration', value: 365, description: 'Stake for 365 days' },
      isUnlocked: false,
      progress: 127,
      maxProgress: 365
    },
    {
      id: 'community_builder',
      name: 'Community Builder',
      description: 'Create 25 forum discussions',
      icon: Users,
      category: 'community',
      rarity: 'rare',
      points: 400,
      requirement: { type: 'forum_posts', value: 25, description: 'Create 25 forum posts' },
      isUnlocked: false,
      progress: 18,
      maxProgress: 25
    },
    {
      id: 'ai_oracle',
      name: 'AI Oracle',
      description: 'Align with AI predictions 20 times',
      icon: Brain,
      category: 'expert',
      rarity: 'epic',
      points: 2000,
      requirement: { type: 'ai_alignment', value: 20, description: 'Vote aligned with AI 20 times' },
      isUnlocked: false,
      progress: 14,
      maxProgress: 20
    },
    {
      id: 'delegate_expert',
      name: 'Delegate Expert',
      description: 'Become a verified expert delegate',
      icon: Crown,
      category: 'expert',
      rarity: 'legendary',
      points: 10000,
      requirement: { type: 'expert_verification', value: 1, description: 'Become verified expert' },
      isUnlocked: false,
      progress: 0,
      maxProgress: 1
    },
    {
      id: 'genesis_member',
      name: 'Genesis Member',
      description: 'Early adopter of ChainMind DAO',
      icon: Sparkles,
      category: 'special',
      rarity: 'legendary',
      points: 5000,
      requirement: { type: 'early_adopter', value: 1, description: 'Join before block 1000' },
      isUnlocked: true,
      progress: 1,
      maxProgress: 1,
      unlockedAt: Date.now() - 2592000000, // 30 days ago
      nftMinted: true
    },
    {
      id: 'whale_staker',
      name: 'Whale Staker',
      description: 'Stake over 100,000 MIND tokens',
      icon: Trophy,
      category: 'staking',
      rarity: 'epic',
      points: 3000,
      requirement: { type: 'tokens_staked', value: 100000, description: 'Stake 100,000 MIND tokens' },
      isUnlocked: false,
      progress: 25000,
      maxProgress: 100000
    }
  ];

  // Load user data
  useEffect(() => {
    if (isConnected && account) {
      loadUserProfile();
      loadLeaderboard();
    }
  }, [isConnected, account]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      
      // Mock user profile for demo
      const profile: UserProfile = {
        address: account || '',
        name: 'Governance Enthusiast',
        totalReputation: reputation || 1247,
        rank: 23,
        level: 8,
        xp: 3420,
        xpToNextLevel: 1580,
        badges: achievementDefinitions.filter(a => a.isUnlocked),
        streaks: {
          voting: 7,
          proposals: 3,
          forum: 12
        },
        stats: {
          totalVotes: 42,
          proposalsCreated: 3,
          forumPosts: 18,
          stakedAmount: '25000',
          delegatedPower: '0',
          correctPredictions: 14,
          communityContributions: 8
        },
        tier: 'gold'
      };

      setUserProfile(profile);
      setAchievements(achievementDefinitions);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async () => {
    try {
      // Mock leaderboard data
      const mockLeaderboard: UserProfile[] = [
        {
          address: '0x1111111111111111111111111111111111111111',
          name: 'DAO Master',
          totalReputation: 15420,
          rank: 1,
          level: 25,
          xp: 0,
          xpToNextLevel: 0,
          badges: [],
          streaks: { voting: 45, proposals: 12, forum: 38 },
          stats: { totalVotes: 324, proposalsCreated: 28, forumPosts: 156, stakedAmount: '500000', delegatedPower: '1200000', correctPredictions: 89, communityContributions: 45 },
          tier: 'diamond'
        },
        {
          address: '0x2222222222222222222222222222222222222222',
          name: 'Governance Guru',
          totalReputation: 12890,
          rank: 2,
          level: 22,
          xp: 0,
          xpToNextLevel: 0,
          badges: [],
          streaks: { voting: 38, proposals: 8, forum: 29 },
          stats: { totalVotes: 298, proposalsCreated: 19, forumPosts: 134, stakedAmount: '350000', delegatedPower: '890000', correctPredictions: 76, communityContributions: 32 },
          tier: 'diamond'
        },
        {
          address: '0x3333333333333333333333333333333333333333',
          name: 'Protocol Pioneer',
          totalReputation: 9567,
          rank: 3,
          level: 18,
          xp: 0,
          xpToNextLevel: 0,
          badges: [],
          streaks: { voting: 29, proposals: 15, forum: 22 },
          stats: { totalVotes: 234, proposalsCreated: 22, forumPosts: 98, stakedAmount: '280000', delegatedPower: '650000', correctPredictions: 67, communityContributions: 28 },
          tier: 'platinum'
        }
      ];

      setLeaderboard(mockLeaderboard);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      case 'rare': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'epic': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      case 'legendary': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'text-orange-400 bg-orange-500/20';
      case 'silver': return 'text-gray-300 bg-gray-500/20';
      case 'gold': return 'text-yellow-400 bg-yellow-500/20';
      case 'platinum': return 'text-blue-300 bg-blue-500/20';
      case 'diamond': return 'text-cyan-400 bg-cyan-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'voting': return Vote;
      case 'proposals': return Star;
      case 'staking': return Lock;
      case 'community': return Users;
      case 'expert': return Crown;
      case 'special': return Sparkles;
      default: return Award;
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    return selectedCategory === 'all' || achievement.category === selectedCategory;
  });

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
              <Trophy className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Reputation Center
          </h1>
          <p className="text-gray-300 mb-8 max-w-md">
            Track your governance achievements, earn badges, and climb the leaderboard
          </p>
          <button
            onClick={connectWallet}
            className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-700 transition-all duration-300"
          >
            Connect Wallet to View Profile
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-yellow-900/50 to-orange-900/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-4">
              Reputation Center
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Gamified governance participation with achievements, badges, and rewards
            </p>
          </motion.div>

          {/* User Level Card */}
          {userProfile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mt-8 max-w-2xl mx-auto"
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                    <Crown className="w-10 h-10 text-white" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 px-2 py-1 rounded-full text-xs font-bold ${getTierColor(userProfile.tier)}`}>
                    {userProfile.tier.toUpperCase()}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-2xl font-bold text-white">{userProfile.name}</h3>
                    <div className="px-3 py-1 bg-yellow-500/20 rounded-full border border-yellow-500/30">
                      <span className="text-yellow-400 font-medium">Level {userProfile.level}</span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Experience Points</span>
                      <span>{userProfile.xp} / {userProfile.xp + userProfile.xpToNextLevel} XP</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full"
                        style={{ width: `${(userProfile.xp / (userProfile.xp + userProfile.xpToNextLevel)) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white">{userProfile.totalReputation}</div>
                      <div className="text-xs text-gray-400">Reputation</div>
                    </div>
                    
                    <div>
                      <div className="text-2xl font-bold text-white">#{userProfile.rank}</div>
                      <div className="text-xs text-gray-400">Global Rank</div>
                    </div>
                    
                    <div>
                      <div className="text-2xl font-bold text-white">{userProfile.badges.length}</div>
                      <div className="text-xs text-gray-400">Badges Earned</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/5 backdrop-blur-sm rounded-xl p-1 w-fit">
            {[
              { id: 'profile', label: 'Profile', icon: Users },
              { id: 'achievements', label: 'Achievements', icon: Award },
              { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  selectedTab === tab.id
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white'
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
          {selectedTab === 'profile' && userProfile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Stats */}
              <div className="lg:col-span-2 space-y-6">
                {/* Activity Stats */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6">Governance Activity</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                        <Vote className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white">{userProfile.stats.totalVotes}</div>
                      <div className="text-sm text-gray-400">Total Votes</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white">{userProfile.stats.proposalsCreated}</div>
                      <div className="text-sm text-gray-400">Proposals Created</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white">{userProfile.stats.forumPosts}</div>
                      <div className="text-sm text-gray-400">Forum Posts</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white">{userProfile.stats.correctPredictions}</div>
                      <div className="text-sm text-gray-400">AI Alignments</div>
                    </div>
                  </div>
                </div>

                {/* Recent Achievements */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6">Recent Achievements</h3>
                  
                  <div className="space-y-4">
                    {userProfile.badges.slice(0, 3).map((achievement) => {
                      const Icon = achievement.icon;
                      return (
                        <div key={achievement.id} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getRarityColor(achievement.rarity)} border`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-white">{achievement.name}</h4>
                              <div className={`px-2 py-1 rounded text-xs ${getRarityColor(achievement.rarity)}`}>
                                {achievement.rarity}
                              </div>
                            </div>
                            <p className="text-sm text-gray-400">{achievement.description}</p>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-yellow-400 font-bold">+{achievement.points} XP</div>
                            {achievement.unlockedAt && (
                              <div className="text-xs text-gray-400">
                                {new Date(achievement.unlockedAt).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Streaks */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4">Current Streaks</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Flame className="w-5 h-5 text-orange-400" />
                        <span className="text-white">Voting Streak</span>
                      </div>
                      <div className="text-orange-400 font-bold">{userProfile.streaks.voting} days</div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 text-blue-400" />
                        <span className="text-white">Proposal Streak</span>
                      </div>
                      <div className="text-blue-400 font-bold">{userProfile.streaks.proposals} weeks</div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-5 h-5 text-purple-400" />
                        <span className="text-white">Forum Streak</span>
                      </div>
                      <div className="text-purple-400 font-bold">{userProfile.streaks.forum} days</div>
                    </div>
                  </div>
                </div>

                {/* Next Level Preview */}
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-yellow-500/30">
                  <h3 className="text-lg font-bold text-white mb-4">Next Level Benefits</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">Exclusive badge collection</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">NFT minting privileges</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">Enhanced forum features</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400">Special voting weight bonus</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg">
                    <div className="text-xs text-yellow-400 mb-1">
                      {userProfile.xpToNextLevel} XP needed for Level {userProfile.level + 1}
                    </div>
                    <div className="w-full bg-yellow-600/20 rounded-full h-2">
                      <div 
                        className="h-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full"
                        style={{ width: `${(userProfile.xp / (userProfile.xp + userProfile.xpToNextLevel)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === 'achievements' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Category Filters */}
              <div className="mb-8">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      selectedCategory === 'all'
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    All Categories
                  </button>
                  
                  {['voting', 'proposals', 'staking', 'community', 'expert', 'special'].map((category) => {
                    const Icon = getCategoryIcon(category);
                    return (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          selectedCategory === category
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white'
                            : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="capitalize">{category}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Achievements Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAchievements.map((achievement) => {
                  const Icon = achievement.icon;
                  const progressPercent = (achievement.progress / achievement.maxProgress) * 100;
                  
                  return (
                    <motion.div
                      key={achievement.id}
                      whileHover={{ scale: 1.02 }}
                      className={`rounded-xl p-6 border transition-all duration-300 ${
                        achievement.isUnlocked
                          ? 'bg-white/5 border-white/10 hover:border-white/20'
                          : 'bg-white/[0.02] border-white/5 opacity-75'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${getRarityColor(achievement.rarity)} border`}>
                          <Icon className="w-8 h-8" />
                        </div>
                        
                        <div className="text-right">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                            {achievement.rarity}
                          </div>
                          {achievement.isUnlocked && (
                            <div className="mt-1">
                              <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-2">{achievement.name}</h3>
                      <p className="text-sm text-gray-400 mb-4">{achievement.description}</p>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{achievement.progress} / {achievement.maxProgress}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              achievement.isUnlocked 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                                : 'bg-gradient-to-r from-gray-600 to-gray-500'
                            }`}
                            style={{ width: `${Math.min(progressPercent, 100)}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-yellow-400 font-bold">+{achievement.points} XP</div>
                        
                        {achievement.isUnlocked && achievement.nftMinted && (
                          <div className="flex items-center space-x-1 text-purple-400">
                            <Gem className="w-4 h-4" />
                            <span className="text-xs">NFT Minted</span>
                          </div>
                        )}
                        
                        {achievement.isUnlocked && !achievement.nftMinted && (
                          <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center space-x-1">
                            <Plus className="w-3 h-3" />
                            <span>Mint NFT</span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {selectedTab === 'leaderboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-xl font-bold text-white">Global Leaderboard</h3>
                  <p className="text-gray-400">Top governance participants ranked by reputation</p>
                </div>
                
                <div className="divide-y divide-white/10">
                  {leaderboard.map((user, index) => (
                    <div key={user.address} className="p-6 hover:bg-white/5 transition-colors">
                      <div className="flex items-center space-x-4">
                        {/* Rank */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center">
                          <span className="text-white font-bold">#{user.rank}</span>
                        </div>
                        
                        {/* User Info */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-white">{user.name}</h4>
                            <div className={`px-2 py-1 rounded-full text-xs ${getTierColor(user.tier)}`}>
                              {user.tier}
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-400">
                            Level {user.level} • {user.address.slice(0, 6)}...{user.address.slice(-4)}
                          </div>
                        </div>
                        
                        {/* Stats */}
                        <div className="grid grid-cols-4 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-white">{user.totalReputation.toLocaleString()}</div>
                            <div className="text-xs text-gray-400">Reputation</div>
                          </div>
                          
                          <div>
                            <div className="text-lg font-bold text-white">{user.stats.totalVotes}</div>
                            <div className="text-xs text-gray-400">Votes</div>
                          </div>
                          
                          <div>
                            <div className="text-lg font-bold text-white">{user.stats.proposalsCreated}</div>
                            <div className="text-xs text-gray-400">Proposals</div>
                          </div>
                          
                          <div>
                            <div className="text-lg font-bold text-white">{user.streaks.voting}</div>
                            <div className="text-xs text-gray-400">Streak</div>
                          </div>
                        </div>
                        
                        {/* View Profile */}
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReputationCenter;
