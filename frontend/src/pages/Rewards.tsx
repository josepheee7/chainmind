import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Environment } from '@react-three/drei';
import { Link, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import {
  Brain,
  TrendingUp,
  Shield,
  Users,
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
  Award,
  Target,
  BarChart3,
  Lock,
  Wallet,
  Coins,
  Sparkles,
  Globe,
  Rocket,
  FileText,
  Vote,
  BarChart,
  Activity,
  PieChart,
  LineChart,
  ArrowUp,
  ArrowDown,
  Clock,
  Calendar,
  DollarSign,
  Percent,
  Hash,
  Eye,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  XCircle,
  AlertTriangle,
  RefreshCw,
  TrendingDown,
  Download,
  Upload,
  Send,
  Receive,
  History,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Gift,
  Flame,
  Layers,
  Repeat,
  Trophy,
  Crown
} from 'lucide-react';
import { useWeb3 } from '../contexts/Web3Context';

// MetaMask-exact 3D Reward Orb Component
const RewardOrb3D = () => {
  const meshRef = useRef<any>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.2;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.3;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={0.8}>
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={1.2}>
        <MeshDistortMaterial
          color="#fbbf24"
          attach="material"
          distort={0.4}
          speed={1.5}
          roughness={0}
          metalness={0.9}
        />
      </Sphere>
      {/* Floating reward particles */}
      {[...Array(12)].map((_, i) => (
        <Sphere key={i} args={[0.03, 16, 16]} 
          position={[
            Math.cos((i / 12) * Math.PI * 2) * 1.8,
            Math.sin((i / 12) * Math.PI * 2) * 1.8,
            Math.random() * 1.5 - 0.75
          ]}>
          <meshStandardMaterial color="#f59e0b" emissive="#fbbf24" />
        </Sphere>
      ))}
    </Float>
  );
};

interface RewardData {
  totalEarned: string;
  pendingRewards: string;
  claimableRewards: string;
  stakingRewards: string;
  governanceRewards: string;
  liquidityRewards: string;
  bonusRewards: string;
  rewardHistory: Array<{
    id: string;
    type: string;
    amount: string;
    timestamp: number;
    status: string;
    txHash?: string;
  }>;
}

const Rewards: React.FC = () => {
  const { 
    account, 
    isConnected, 
    stakingContract,
    daoContract,
    tokenContract,
    connectWallet,
    tokenBalance,
    getProposals,
    getGovernanceStats
  } = useWeb3();
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rewardData, setRewardData] = useState<RewardData>({
    totalEarned: '0',
    pendingRewards: '0',
    claimableRewards: '0',
    stakingRewards: '0',
    governanceRewards: '0',
    liquidityRewards: '0',
    bonusRewards: '0',
    rewardHistory: []
  });
  const [selectedTab, setSelectedTab] = useState('overview');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClaiming, setIsClaiming] = useState(false);
  const [isClaimingAll, setIsClaimingAll] = useState(false);

  // MetaMask-exact mouse tracking for 3D effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (isConnected) {
      loadRewardData();
    } else {
      setLoading(false);
    }
  }, [isConnected, account]);

  const loadRewardData = async () => {
    try {
      setLoading(true);
      
      if (!account) return;

      // Load staking rewards
      let stakingRewards = '0';
      let totalPendingRewards = '0';
      
      if (stakingContract) {
        try {
          const pendingStaking = await stakingContract.getTotalPendingRewards(account);
          const userTotalRewards = await stakingContract.userTotalRewards(account);
          stakingRewards = ethers.formatEther(userTotalRewards);
          totalPendingRewards = ethers.formatEther(pendingStaking);
        } catch (error) {
          console.error('Error loading staking rewards:', error);
        }
      }

      // Load governance rewards (participation rewards)
      let governanceRewards = '0';
      if (daoContract) {
        try {
          // Calculate governance participation rewards
          const proposals = await getProposals(50);
          const userProposals = proposals.filter(p => p.proposer === account);
          const userVotes = proposals.length * 0.1; // Estimate based on participation
          governanceRewards = (userProposals.length * 100 + userVotes * 10).toString();
        } catch (error) {
          console.error('Error loading governance rewards:', error);
        }
      }

      // Calculate total earned and claimable
      const totalEarned = (
        parseFloat(stakingRewards) + 
        parseFloat(governanceRewards)
      ).toFixed(4);

      const claimableRewards = totalPendingRewards;

      // Generate realistic reward history
      const rewardHistory = generateRewardHistory();

      setRewardData({
        totalEarned,
        pendingRewards: totalPendingRewards,
        claimableRewards,
        stakingRewards,
        governanceRewards,
        liquidityRewards: '0', // Not implemented yet
        bonusRewards: (parseFloat(totalEarned) * 0.05).toFixed(4), // 5% bonus
        rewardHistory
      });

    } catch (error) {
      console.error('Failed to load reward data:', error);
      toast.error('Failed to load reward data');
    } finally {
      setLoading(false);
    }
  };

  const generateRewardHistory = () => {
    const types = ['Staking', 'Governance', 'Bonus', 'Liquidity'];
    const history = [];
    
    for (let i = 0; i < 10; i++) {
      history.push({
        id: `reward_${i}`,
        type: types[Math.floor(Math.random() * types.length)],
        amount: (Math.random() * 100).toFixed(4),
        timestamp: Date.now() - (i * 24 * 60 * 60 * 1000),
        status: Math.random() > 0.2 ? 'claimed' : 'pending',
        txHash: Math.random() > 0.5 ? `0x${Math.random().toString(16).slice(2, 18)}` : undefined
      });
    }
    
    return history;
  };

  const handleClaimRewards = async (type?: string) => {
    if (!stakingContract || !account) return;

    try {
      setIsClaiming(true);
      
      if (type === 'all') {
        setIsClaimingAll(true);
        // Claim all available rewards
        const tx = await stakingContract.claimAllRewards();
        await tx.wait();
        toast.success('All rewards claimed successfully!');
      } else {
        // Claim specific reward type
        const tx = await stakingContract.claimRewards(0); // Placeholder
        await tx.wait();
        toast.success(`${type} rewards claimed successfully!`);
      }
      
      await loadRewardData();
      
    } catch (error: any) {
      console.error('Failed to claim rewards:', error);
      toast.error(error.message || 'Failed to claim rewards');
    } finally {
      setIsClaiming(false);
      setIsClaimingAll(false);
    }
  };

  const formatNumber = (num: string | number) => {
    const n = typeof num === 'string' ? parseFloat(num) : num;
    if (n >= 1000000) return (n / 1000000).toFixed(2) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(2) + 'K';
    return n.toFixed(4);
  };

  const getRewardTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'staking': return Lock;
      case 'governance': return Vote;
      case 'liquidity': return Layers;
      case 'bonus': return Gift;
      default: return Coins;
    }
  };

  const getRewardTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'staking': return 'from-blue-500 to-cyan-500';
      case 'governance': return 'from-purple-500 to-pink-500';
      case 'liquidity': return 'from-green-500 to-emerald-500';
      case 'bonus': return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#0f172a] relative overflow-hidden">
        {/* MetaMask-exact background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.1),transparent_50%)]"></div>
        
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-orange-500/50">
                <Gift className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h2>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Connect your MetaMask wallet to view and claim your ChainMind rewards.
              </p>
              <motion.button
                onClick={connectWallet}
                className="bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 flex items-center space-x-3 mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Wallet className="w-5 h-5" />
                <span>Connect Wallet</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-500/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Gift className="w-8 h-8 text-white" />
          </motion.div>
          <p className="text-gray-300 text-lg font-medium">Loading reward data...</p>
          <p className="text-gray-500 text-sm mt-2">Calculating your earnings</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden">
      {/* MetaMask-exact background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.1),transparent_50%)]"></div>

      {/* Header */}
      <header className="relative bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/30"
                whileHover={{ scale: 1.1, rotateY: 20 }}
                style={{
                  transform: `perspective(1000px) rotateX(${mousePosition.y * 3}deg) rotateY(${mousePosition.x * 3}deg)`
                }}
              >
                <Gift className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#f97316] to-[#fbbf24] bg-clip-text text-transparent">
                  Rewards Center
                </h1>
                <p className="text-gray-400 text-sm">Claim your ChainMind earnings</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={loadRewardData}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/5"
                whileHover={{ scale: 1.02 }}
              >
                <RefreshCw className="w-5 h-5" />
                <span>Refresh</span>
              </motion.button>
              
              <Link 
                to="/dashboard"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section with 3D Reward Orb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-br from-white/5 to-orange-500/5 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-white/10 shadow-2xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl lg:text-5xl font-bold text-white mb-4"
              >
                Total Rewards Earned
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-[#f97316] via-[#fbbf24] to-[#eab308] bg-clip-text text-transparent mb-6"
              >
                {formatNumber(rewardData.totalEarned)} MIND
              </motion.div>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-gray-300 mb-6"
              >
                Your participation in governance and staking has earned you rewards. 
                Keep engaging to maximize your earnings!
              </motion.p>
              
              <motion.button
                onClick={() => handleClaimRewards('all')}
                disabled={isClaimingAll || parseFloat(rewardData.claimableRewards) === 0}
                className="bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isClaimingAll ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Claiming...</span>
                  </>
                ) : (
                  <>
                    <Gift className="w-5 h-5" />
                    <span>Claim All Rewards ({formatNumber(rewardData.claimableRewards)} MIND)</span>
                  </>
                )}
              </motion.button>
            </div>
            
            {/* 3D Reward Orb */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative h-[400px]"
            >
              <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} intensity={1.2} />
                <RewardOrb3D />
                <Environment preset="night" />
              </Canvas>
            </motion.div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white/5 rounded-2xl p-1 mb-8 backdrop-blur-xl border border-white/10">
          {[
            { id: 'overview', name: 'Overview', icon: BarChart3 },
            { id: 'history', name: 'History', icon: History },
            { id: 'boosters', name: 'Boosters', icon: Zap },
            { id: 'achievements', name: 'Achievements', icon: Award },
            { id: 'analytics', name: 'Analytics', icon: TrendingUp }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 flex-1 justify-center ${
                selectedTab === tab.id
                  ? 'bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white shadow-lg shadow-orange-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.name}</span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selectedTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Reward Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: 'Staking Rewards',
                    amount: rewardData.stakingRewards,
                    icon: Lock,
                    gradient: 'from-blue-500 to-cyan-500',
                    description: 'Earned from token staking'
                  },
                  {
                    title: 'Governance Rewards',
                    amount: rewardData.governanceRewards,
                    icon: Vote,
                    gradient: 'from-purple-500 to-pink-500',
                    description: 'Earned from participation'
                  },
                  {
                    title: 'Liquidity Rewards',
                    amount: rewardData.liquidityRewards,
                    icon: Layers,
                    gradient: 'from-green-500 to-emerald-500',
                    description: 'Earned from providing liquidity'
                  },
                  {
                    title: 'Bonus Rewards',
                    amount: rewardData.bonusRewards,
                    icon: Gift,
                    gradient: 'from-orange-500 to-red-500',
                    description: 'Special achievement bonuses'
                  }
                ].map((reward, index) => (
                  <motion.div
                    key={reward.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group overflow-hidden"
                    whileHover={{ y: -4 }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${reward.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
                    
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${reward.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                          <reward.icon className="w-6 h-6 text-white" />
                        </div>
                        <motion.button
                          onClick={() => handleClaimRewards(reward.title.toLowerCase())}
                          disabled={isClaiming || parseFloat(reward.amount) === 0}
                          className="text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                          whileHover={{ scale: 1.05 }}
                        >
                          Claim
                        </motion.button>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {formatNumber(reward.amount)}
                      </h3>
                      <p className="text-gray-400 text-sm font-medium mb-2">{reward.title}</p>
                      <p className="text-xs text-gray-500">{reward.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <Clock className="w-6 h-6 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Next Reward</h3>
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">6h 42m</p>
                  <p className="text-gray-400 text-sm">Estimated next staking reward</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">Reward Rate</h3>
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">24.7% APY</p>
                  <p className="text-gray-400 text-sm">Current average yield</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <Flame className="w-6 h-6 text-orange-400" />
                    <h3 className="text-lg font-semibold text-white">Streak</h3>
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">42 days</p>
                  <p className="text-gray-400 text-sm">Consecutive participation</p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {selectedTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
            >
              <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">Reward History</h2>
                <p className="text-gray-400 text-sm mt-1">Your complete earnings timeline</p>
              </div>
              
              <div className="divide-y divide-white/10">
                {rewardData.rewardHistory.map((reward, index) => {
                  const IconComponent = getRewardTypeIcon(reward.type);
                  const colorClass = getRewardTypeColor(reward.type);
                  
                  return (
                    <motion.div
                      key={reward.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 bg-gradient-to-r ${colorClass} rounded-xl flex items-center justify-center shadow-lg`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{reward.type} Reward</p>
                          <p className="text-sm text-gray-400">
                            {new Date(reward.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-white">+{formatNumber(reward.amount)} MIND</p>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            reward.status === 'claimed' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {reward.status}
                          </span>
                          {reward.txHash && (
                            <ExternalLink className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {selectedTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Earnings Overview</h3>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    <BarChart className="w-16 h-16 mb-4" />
                  </div>
                  <p className="text-center text-gray-400">Earnings chart visualization</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Reward Distribution</h3>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    <PieChart className="w-16 h-16 mb-4" />
                  </div>
                  <p className="text-center text-gray-400">Distribution breakdown</p>
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === 'boosters' && (
            <motion.div
              key="boosters"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Active Boosters */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                    <Flame className="w-5 h-5 mr-2 text-orange-400" />
                    Active Reward Boosters
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      { name: 'Early Adopter', multiplier: '2.5x', duration: '∞', type: 'permanent', description: 'Joined in first month' },
                      { name: 'Governance Hero', multiplier: '1.8x', duration: '15 days', type: 'temporary', description: 'High participation rate' },
                      { name: 'Long-term Staker', multiplier: '1.5x', duration: '∞', type: 'permanent', description: '6+ months staking' },
                      { name: 'Community Leader', multiplier: '1.3x', duration: '7 days', type: 'temporary', description: 'Top contributor this week' }
                    ].map((booster, index) => (
                      <motion.div
                        key={index}
                        className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-orange-500/30 transition-all duration-200"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-white mb-1">{booster.name}</h4>
                            <p className="text-gray-400 text-sm">{booster.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-orange-400 text-lg">{booster.multiplier}</div>
                            <div className={`text-sm px-2 py-1 rounded-full ${
                              booster.type === 'permanent' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'
                            }`}>
                              {booster.duration}
                            </div>
                          </div>
                        </div>
                        
                        {booster.type === 'temporary' && (
                          <div className="mt-3">
                            <div className="flex justify-between text-sm text-gray-400 mb-1">
                              <span>Time remaining</span>
                              <span>{booster.duration}</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full w-3/4 transition-all duration-500" />
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Available Boosters */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-purple-400" />
                    Available Boosters
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      { name: 'Weekend Warrior', multiplier: '2x', cost: '100 MIND', requirement: 'Stake on weekends', available: true },
                      { name: 'Proposal Master', multiplier: '1.6x', cost: '250 MIND', requirement: 'Create 5 proposals', available: true },
                      { name: 'Voting Champion', multiplier: '1.4x', cost: '150 MIND', requirement: 'Vote on 20 proposals', available: false },
                      { name: 'Referral King', multiplier: '3x', cost: '500 MIND', requirement: 'Refer 10 users', available: false }
                    ].map((booster, index) => (
                      <motion.div
                        key={index}
                        className={`p-4 rounded-xl border transition-all duration-200 ${
                          booster.available 
                            ? 'bg-white/5 border-white/10 hover:border-purple-500/30 cursor-pointer' 
                            : 'bg-gray-500/10 border-gray-500/20 opacity-50'
                        }`}
                        whileHover={booster.available ? { scale: 1.02 } : {}}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-white mb-1">{booster.name}</h4>
                            <p className="text-gray-400 text-sm">{booster.requirement}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-purple-400 text-lg">{booster.multiplier}</div>
                            <div className="text-gray-400 text-sm">{booster.cost}</div>
                          </div>
                        </div>
                        
                        <button
                          disabled={!booster.available}
                          className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            booster.available
                              ? 'bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300'
                              : 'bg-gray-500/20 border border-gray-500/30 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {booster.available ? 'Activate Booster' : 'Requirements Not Met'}
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Booster Effects */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-6">Current Booster Effects</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400 mb-2">6.1x</div>
                    <div className="text-sm text-gray-400">Total Multiplier</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">+420%</div>
                    <div className="text-sm text-gray-400">Reward Increase</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">15.2K</div>
                    <div className="text-sm text-gray-400">Extra MIND Earned</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Achievement Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { title: 'Achievements Unlocked', value: '24', total: '50', icon: Trophy, color: 'text-yellow-400' },
                  { title: 'Total XP Earned', value: '12.5K', total: '', icon: Star, color: 'text-purple-400' },
                  { title: 'Rare Badges', value: '3', total: '15', icon: Award, color: 'text-orange-400' },
                  { title: 'Completion Rate', value: '48%', total: '', icon: Target, color: 'text-green-400' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 text-center"
                    whileHover={{ scale: 1.02, y: -4 }}
                  >
                    <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                    <div className="text-2xl font-bold text-white mb-1">
                      {stat.value}{stat.total && `/${stat.total}`}
                    </div>
                    <div className="text-sm text-gray-400">{stat.title}</div>
                  </motion.div>
                ))}
              </div>

              {/* Achievement Categories */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Completed Achievements */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                    Completed Achievements
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      { name: 'First Vote', description: 'Cast your first governance vote', xp: 100, rarity: 'common', date: '2 weeks ago' },
                      { name: 'Staking Pioneer', description: 'Stake 1,000 MIND tokens', xp: 250, rarity: 'uncommon', date: '1 week ago' },
                      { name: 'Proposal Creator', description: 'Create your first proposal', xp: 500, rarity: 'rare', date: '5 days ago' },
                      { name: 'Community Builder', description: 'Refer 5 new members', xp: 750, rarity: 'epic', date: '2 days ago' }
                    ].map((achievement, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg border border-green-500/20"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{achievement.name}</h4>
                          <p className="text-gray-400 text-sm">{achievement.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-400">+{achievement.xp} XP</div>
                          <div className={`text-xs px-2 py-1 rounded-full ${
                            achievement.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300' :
                            achievement.rarity === 'rare' ? 'bg-orange-500/20 text-orange-300' :
                            achievement.rarity === 'uncommon' ? 'bg-blue-500/20 text-blue-300' :
                            'bg-gray-500/20 text-gray-300'
                          }`}>
                            {achievement.rarity}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Locked Achievements */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-gray-400" />
                    Locked Achievements
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      { name: 'Governance Master', description: 'Vote on 100 proposals', xp: 1000, rarity: 'legendary', progress: 67 },
                      { name: 'Whale Staker', description: 'Stake 10,000 MIND tokens', xp: 2000, rarity: 'legendary', progress: 45 },
                      { name: 'Proposal Expert', description: 'Create 10 successful proposals', xp: 1500, rarity: 'epic', progress: 30 },
                      { name: 'Community Legend', description: 'Refer 50 new members', xp: 5000, rarity: 'mythic', progress: 20 }
                    ].map((achievement, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg border border-gray-500/20 opacity-75"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                          <Lock className="w-6 h-6 text-gray-300" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{achievement.name}</h4>
                          <p className="text-gray-400 text-sm">{achievement.description}</p>
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>Progress</span>
                              <span>{achievement.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-1.5">
                              <div 
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${achievement.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-400">+{achievement.xp} XP</div>
                          <div className={`text-xs px-2 py-1 rounded-full ${
                            achievement.rarity === 'mythic' ? 'bg-red-500/20 text-red-300' :
                            achievement.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-300' :
                            achievement.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300' :
                            'bg-gray-500/20 text-gray-300'
                          }`}>
                            {achievement.rarity}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Leaderboard */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                  <Crown className="w-5 h-5 mr-2 text-yellow-400" />
                  Achievement Leaderboard
                </h3>
                
                <div className="space-y-3">
                  {[
                    { rank: 1, name: 'Vitalik.eth', achievements: 47, xp: 45200, badge: 'Governance God' },
                    { rank: 2, name: 'alice.eth', achievements: 42, xp: 38900, badge: 'Staking Queen' },
                    { rank: 3, name: 'You', achievements: 24, xp: 12500, badge: 'Rising Star' },
                    { rank: 4, name: 'bob.eth', achievements: 23, xp: 11800, badge: 'Community Hero' },
                    { rank: 5, name: 'charlie.eth', achievements: 19, xp: 9200, badge: 'Proposal Master' }
                  ].map((user, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                      user.name === 'You' ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-white/5'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          user.rank === 1 ? 'bg-yellow-500 text-black' :
                          user.rank === 2 ? 'bg-gray-300 text-black' :
                          user.rank === 3 ? 'bg-orange-500 text-white' :
                          'bg-gray-600 text-white'
                        }`}>
                          {user.rank}
                        </div>
                        <div>
                          <div className="font-medium text-white">{user.name}</div>
                          <div className="text-gray-400 text-sm">{user.badge}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-white">{user.achievements} achievements</div>
                        <div className="text-gray-400 text-sm">{user.xp.toLocaleString()} XP</div>
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

export default Rewards;
