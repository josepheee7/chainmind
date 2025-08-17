/**
 * Mobile Governance - Mobile-First Interface with Push Notifications
 * =================================================================
 * 
 * 🚀 VITALIK-GRADE MOBILE GOVERNANCE
 * - Mobile-optimized voting interface
 * - Push notification system
 * - Quick vote with gesture controls
 * - Offline-first with sync
 * - Progressive Web App features
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  BellRing,
  Vote,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Smartphone,
  Zap,
  Download,
  Wifi,
  WifiOff,
  Battery,
  Signal,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  Star,
  MessageSquare,
  Users,
  BarChart3,
  Settings,
  Home,
  Sparkles,
  Crown,
  Target,
  TrendingUp,
  Heart,
  Share
} from 'lucide-react';
import { useEnhancedWeb3, ProposalInfo, ProposalState } from '../contexts/EnhancedWeb3Context';
import toast from 'react-hot-toast';

interface PushNotification {
  id: string;
  title: string;
  body: string;
  icon: string;
  timestamp: number;
  proposalId?: number;
  category: 'proposal' | 'vote' | 'result' | 'emergency' | 'general';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  read: boolean;
  action?: {
    type: 'vote' | 'view' | 'delegate';
    label: string;
    data: any;
  };
}

interface QuickVoteProposal {
  id: number;
  title: string;
  description: string;
  category: string;
  timeRemaining: number;
  currentVotes: {
    for: number;
    against: number;
    abstain: number;
  };
  aiPrediction: {
    success: number;
    risk: number;
    impact: number;
  };
  userCanVote: boolean;
  isUrgent: boolean;
}

const MobileGovernance: React.FC = () => {
  const navigate = useNavigate();
  const { account, isConnected, connectWallet, castVote, votingPower } = useEnhancedWeb3();

  // State
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [quickVoteProposals, setQuickVoteProposals] = useState<QuickVoteProposal[]>([]);
  const [currentProposalIndex, setCurrentProposalIndex] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'vote' | 'notifications' | 'activity'>('vote');
  const [isDragging, setIsDragging] = useState(false);
  const [votingInProgress, setVotingInProgress] = useState(false);

  // Load data
  useEffect(() => {
    if (isConnected) {
      loadNotifications();
      loadQuickVoteProposals();
      checkNotificationPermission();
    }

    // Listen for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isConnected]);

  const loadNotifications = async () => {
    // Mock notifications for demo
    const mockNotifications: PushNotification[] = [
      {
        id: '1',
        title: '🗳️ New Proposal: Staking Rewards',
        body: 'Vote on increasing governance staking rewards by 25%',
        icon: '🗳️',
        timestamp: Date.now() - 300000, // 5 minutes ago
        proposalId: 1,
        category: 'proposal',
        priority: 'high',
        read: false,
        action: {
          type: 'vote',
          label: 'Vote Now',
          data: { proposalId: 1 }
        }
      },
      {
        id: '2',
        title: '⚡ Quick Vote Reminder',
        body: 'Treasury diversification proposal ends in 2 hours',
        icon: '⚡',
        timestamp: Date.now() - 600000, // 10 minutes ago
        proposalId: 2,
        category: 'vote',
        priority: 'urgent',
        read: false,
        action: {
          type: 'vote',
          label: 'Quick Vote',
          data: { proposalId: 2 }
        }
      },
      {
        id: '3',
        title: '✅ Proposal Passed',
        body: 'Cross-chain governance proposal has been approved!',
        icon: '✅',
        timestamp: Date.now() - 900000, // 15 minutes ago
        proposalId: 3,
        category: 'result',
        priority: 'normal',
        read: true
      },
      {
        id: '4',
        title: '👑 Expert Delegate Available',
        body: 'New DeFi expert joined for delegation',
        icon: '👑',
        timestamp: Date.now() - 1800000, // 30 minutes ago
        category: 'general',
        priority: 'normal',
        read: false,
        action: {
          type: 'delegate',
          label: 'View Expert',
          data: { expertId: 'defi-expert-1' }
        }
      },
      {
        id: '5',
        title: '🚨 Emergency Proposal',
        body: 'Critical security update requires immediate attention',
        icon: '🚨',
        timestamp: Date.now() - 3600000, // 1 hour ago
        proposalId: 4,
        category: 'emergency',
        priority: 'urgent',
        read: true
      }
    ];

    setNotifications(mockNotifications);
  };

  const loadQuickVoteProposals = async () => {
    // Mock quick vote proposals
    const mockProposals: QuickVoteProposal[] = [
      {
        id: 1,
        title: 'Increase Governance Staking Rewards',
        description: 'Proposal to increase staking rewards by 25% to incentivize long-term participation',
        category: 'Parameter',
        timeRemaining: 518400, // 6 days
        currentVotes: {
          for: 45230,
          against: 18950,
          abstain: 3420
        },
        aiPrediction: {
          success: 78,
          risk: 25,
          impact: 85
        },
        userCanVote: true,
        isUrgent: false
      },
      {
        id: 2,
        title: 'Treasury Diversification Strategy',
        description: 'Diversify 30% of treasury into blue-chip DeFi protocols for yield generation',
        category: 'Treasury',
        timeRemaining: 7200, // 2 hours
        currentVotes: {
          for: 89450,
          against: 34200,
          abstain: 8950
        },
        aiPrediction: {
          success: 85,
          risk: 35,
          impact: 92
        },
        userCanVote: true,
        isUrgent: true
      },
      {
        id: 3,
        title: 'Community Grant Program',
        description: 'Launch $500k grant program for ecosystem development projects',
        category: 'Funding',
        timeRemaining: 259200, // 3 days
        currentVotes: {
          for: 67800,
          against: 23100,
          abstain: 5600
        },
        aiPrediction: {
          success: 82,
          risk: 20,
          impact: 78
        },
        userCanVote: true,
        isUrgent: false
      }
    ];

    setQuickVoteProposals(mockProposals);
  };

  const checkNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = Notification.permission;
      setNotificationsEnabled(permission === 'granted');
    }
  };

  const enableNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
      
      if (permission === 'granted') {
        // Register service worker for push notifications
        if ('serviceWorker' in navigator) {
          try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered:', registration);
            toast.success('Push notifications enabled!');
          } catch (error) {
            console.error('Service Worker registration failed:', error);
          }
        }
      }
    }
  };

  const handleQuickVote = async (proposalId: number, choice: number) => {
    if (!isConnected) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      setVotingInProgress(true);
      
      // Haptic feedback if available
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      await castVote(proposalId, choice);
      
      // Success haptic
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 50, 50]);
      }
      
      toast.success('Vote cast successfully!');
      await loadQuickVoteProposals();
      
    } catch (error: any) {
      console.error('Vote failed:', error);
      toast.error(error.message || 'Failed to cast vote');
      
      // Error haptic
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
    } finally {
      setVotingInProgress(false);
    }
  };

  const handleSwipeVote = (proposalId: number, direction: 'left' | 'right' | 'up') => {
    let choice: number;
    switch (direction) {
      case 'left':
        choice = 0; // Against
        break;
      case 'right':
        choice = 1; // For
        break;
      case 'up':
        choice = 2; // Abstain
        break;
      default:
        return;
    }
    
    handleQuickVote(proposalId, choice);
  };

  const formatTimeRemaining = (seconds: number) => {
    if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes}m`;
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return `${hours}h`;
    } else {
      const days = Math.floor(seconds / 86400);
      return `${days}d`;
    }
  };

  const getCurrentProposal = () => {
    return quickVoteProposals[currentProposalIndex] || null;
  };

  const nextProposal = () => {
    setCurrentProposalIndex((prev) => 
      prev < quickVoteProposals.length - 1 ? prev + 1 : 0
    );
  };

  const previousProposal = () => {
    setCurrentProposalIndex((prev) => 
      prev > 0 ? prev - 1 : quickVoteProposals.length - 1
    );
  };

  const currentProposal = getCurrentProposal();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm mx-auto"
        >
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Smartphone className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Mobile Governance
          </h1>
          <p className="text-gray-300 mb-8">
            Vote on-the-go with push notifications and gesture controls
          </p>
          <button
            onClick={connectWallet}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            Connect Wallet
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Smartphone className="w-6 h-6 text-blue-400" />
            <h1 className="text-lg font-bold text-white">Mobile Governance</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {isOnline ? (
                <Wifi className="w-4 h-4 text-green-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-400" />
              )}
              <Signal className="w-4 h-4 text-white" />
              <Battery className="w-4 h-4 text-white" />
            </div>
            
            <button
              onClick={enableNotifications}
              className={`p-2 rounded-lg transition-all ${
                notificationsEnabled 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-gray-500/20 text-gray-400 hover:text-white'
              }`}
            >
              {notificationsEnabled ? <BellRing className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-gray-800/50 border-b border-white/10">
        {[
          { id: 'vote', label: 'Quick Vote', icon: Vote },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'activity', label: 'Activity', icon: BarChart3 }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 transition-all ${
              selectedTab === tab.id
                ? 'bg-blue-500/20 text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedTab === 'vote' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-4"
          >
            {/* Quick Vote Instructions */}
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 mb-6 border border-blue-500/30">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-medium">Quick Vote</span>
              </div>
              <div className="text-sm text-gray-300 space-y-1">
                <div>👈 Swipe left for Against</div>
                <div>👉 Swipe right for For</div>
                <div>👆 Swipe up for Abstain</div>
              </div>
            </div>

            {/* Current Proposal Card */}
            {currentProposal && (
              <motion.div
                key={currentProposal.id}
                drag="x"
                dragConstraints={{ left: -100, right: 100 }}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={(event: any, info: any) => {
                  setIsDragging(false);
                  
                  if (Math.abs(info.offset.x) > 100) {
                    const direction = info.offset.x > 0 ? 'right' : 'left';
                    handleSwipeVote(currentProposal.id, direction);
                  } else if (info.offset.y < -100) {
                    handleSwipeVote(currentProposal.id, 'up');
                  }
                }}
                className="relative bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
                style={{
                  rotateZ: isDragging ? '5deg' : '0deg'
                }}
              >
                {/* Urgent Badge */}
                {currentProposal.isUrgent && (
                  <div className="absolute top-4 right-4 z-10 px-2 py-1 bg-red-500/20 rounded-full border border-red-500/30">
                    <span className="text-red-400 text-xs font-medium">URGENT</span>
                  </div>
                )}

                <div className="p-6">
                  {/* Proposal Header */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="px-2 py-1 bg-blue-500/20 rounded text-xs text-blue-400 border border-blue-500/30">
                        {currentProposal.category}
                      </div>
                      <div className="text-sm text-gray-400">
                        {formatTimeRemaining(currentProposal.timeRemaining)} left
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2">
                      {currentProposal.title}
                    </h3>
                    
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {currentProposal.description}
                    </p>
                  </div>

                  {/* AI Predictions */}
                  <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-lg p-4 mb-4 border border-purple-500/20">
                    <div className="flex items-center space-x-2 mb-3">
                      <Star className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-medium text-purple-400">AI Analysis</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-400">
                          {currentProposal.aiPrediction.success}%
                        </div>
                        <div className="text-xs text-gray-400">Success</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-400">
                          {currentProposal.aiPrediction.risk}%
                        </div>
                        <div className="text-xs text-gray-400">Risk</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-400">
                          {currentProposal.aiPrediction.impact}%
                        </div>
                        <div className="text-xs text-gray-400">Impact</div>
                      </div>
                    </div>
                  </div>

                  {/* Current Votes */}
                  <div className="mb-6">
                    <div className="text-sm text-gray-400 mb-2">Current Results</div>
                    
                    <div className="space-y-2">
                      {[
                        { label: 'For', votes: currentProposal.currentVotes.for, color: 'green' },
                        { label: 'Against', votes: currentProposal.currentVotes.against, color: 'red' },
                        { label: 'Abstain', votes: currentProposal.currentVotes.abstain, color: 'gray' }
                      ].map((option) => {
                        const total = currentProposal.currentVotes.for + currentProposal.currentVotes.against + currentProposal.currentVotes.abstain;
                        const percentage = total > 0 ? (option.votes / total) * 100 : 0;
                        
                        return (
                          <div key={option.label} className="flex items-center space-x-3">
                            <div className="w-12 text-xs text-gray-400">{option.label}</div>
                            <div className="flex-1 bg-gray-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full bg-${option.color}-500`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <div className="w-16 text-right text-xs text-white">
                              {percentage.toFixed(1)}%
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Vote Buttons */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleQuickVote(currentProposal.id, 0)}
                      disabled={votingInProgress || !currentProposal.userCanVote}
                      className="flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 disabled:opacity-50 transition-all duration-300"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span className="text-sm font-medium">Against</span>
                    </button>
                    
                    <button
                      onClick={() => handleQuickVote(currentProposal.id, 2)}
                      disabled={votingInProgress || !currentProposal.userCanVote}
                      className="flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 transition-all duration-300"
                    >
                      <Minus className="w-4 h-4" />
                      <span className="text-sm font-medium">Abstain</span>
                    </button>
                    
                    <button
                      onClick={() => handleQuickVote(currentProposal.id, 1)}
                      disabled={votingInProgress || !currentProposal.userCanVote}
                      className="flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 transition-all duration-300"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm font-medium">For</span>
                    </button>
                  </div>
                </div>

                {/* Swipe Indicators */}
                <div className="absolute inset-y-0 left-0 w-20 flex items-center justify-center opacity-0 group-hover:opacity-50 transition-opacity">
                  <div className="bg-red-500/20 rounded-full p-4">
                    <ThumbsDown className="w-6 h-6 text-red-400" />
                  </div>
                </div>
                
                <div className="absolute inset-y-0 right-0 w-20 flex items-center justify-center opacity-0 group-hover:opacity-50 transition-opacity">
                  <div className="bg-green-500/20 rounded-full p-4">
                    <ThumbsUp className="w-6 h-6 text-green-400" />
                  </div>
                </div>
                
                <div className="absolute top-0 inset-x-0 h-20 flex items-center justify-center opacity-0 group-hover:opacity-50 transition-opacity">
                  <div className="bg-gray-500/20 rounded-full p-4">
                    <Minus className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={previousProposal}
                className="flex items-center space-x-2 px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              
              <div className="text-sm text-gray-400">
                {currentProposalIndex + 1} of {quickVoteProposals.length}
              </div>
              
              <button
                onClick={nextProposal}
                className="flex items-center space-x-2 px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-all"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {selectedTab === 'notifications' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-4"
          >
            {/* Notification Settings */}
            {!notificationsEnabled && (
              <div className="bg-yellow-500/20 rounded-xl p-4 mb-6 border border-yellow-500/30">
                <div className="flex items-center space-x-2 mb-2">
                  <Bell className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-medium">Enable Notifications</span>
                </div>
                <p className="text-sm text-gray-300 mb-3">
                  Get instant alerts for new proposals, voting deadlines, and results
                </p>
                <button
                  onClick={enableNotifications}
                  className="w-full py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg font-medium hover:from-yellow-600 hover:to-orange-700 transition-all"
                >
                  Enable Push Notifications
                </button>
              </div>
            )}

            {/* Notifications List */}
            <div className="space-y-3">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl border transition-all ${
                    notification.read
                      ? 'bg-white/[0.02] border-white/5'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{notification.icon}</div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-white truncate">
                          {notification.title}
                        </h4>
                        
                        {notification.priority === 'urgent' && (
                          <div className="px-1 py-0.5 bg-red-500/20 rounded text-xs text-red-400">
                            URGENT
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-400 mb-2">
                        {notification.body}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {new Date(notification.timestamp).toLocaleString()}
                        </span>
                        
                        {notification.action && (
                          <button className="text-xs text-blue-400 hover:text-blue-300 font-medium">
                            {notification.action.label}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {selectedTab === 'activity' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-4"
          >
            {/* Activity Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                  <Vote className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">Votes Cast</span>
                </div>
                <div className="text-2xl font-bold text-white">42</div>
                <div className="text-sm text-gray-400">This month</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-white font-medium">Streak</span>
                </div>
                <div className="text-2xl font-bold text-white">7</div>
                <div className="text-sm text-gray-400">Days active</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-medium">Reputation</span>
                </div>
                <div className="text-2xl font-bold text-white">1,247</div>
                <div className="text-sm text-gray-400">Governance score</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-medium">Accuracy</span>
                </div>
                <div className="text-2xl font-bold text-white">85%</div>
                <div className="text-sm text-gray-400">AI alignment</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <button
                onClick={() => navigate('/staking')}
                className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">Manage Staking</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
              
              <button
                onClick={() => navigate('/reputation')}
                className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-medium">View Achievements</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
              
              <button
                onClick={() => navigate('/forums')}
                className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-medium">Join Discussions</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PWA Install Prompt */}
      <div className="fixed bottom-4 left-4 right-4">
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-blue-500/30">
          <div className="flex items-center space-x-3">
            <Download className="w-5 h-5 text-blue-400" />
            <div className="flex-1">
              <div className="text-white font-medium">Install App</div>
              <div className="text-xs text-gray-400">Add to home screen for faster access</div>
            </div>
            <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm hover:bg-blue-500/30 transition-all">
              Install
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileGovernance;
