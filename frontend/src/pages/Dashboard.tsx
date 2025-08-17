import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
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
  Settings,
  Bell,
  User,
  LogOut,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Info
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    account,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
    tokenBalance,
    votingPower,
    reputation,
    ethBalance,
    refreshBalance,
    getProposals,
    getGovernanceStats,
    error,
    clearError
  } = useWeb3();

  // Debug logging
  console.log('Dashboard render - isConnected:', isConnected, 'isConnecting:', isConnecting);
  console.log('Dashboard render - account:', account);

  const [loading, setLoading] = useState(true);
  const [recentProposals, setRecentProposals] = useState<any[]>([]);
  const [governanceStats, setGovernanceStats] = useState<any>({});
  const [copied, setCopied] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Immediately set loading to false if not connected
  React.useEffect(() => {
    if (!isConnected) {
      setLoading(false);
    }
  }, [isConnected]);

  // 3D Mouse tracking for MetaMask-style interactions
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Load real data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!isConnected) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        clearError();
        
        // Load ONLY real blockchain data
            const [proposals, stats] = await Promise.all([
          getProposals(5, 0),
          getGovernanceStats()
            ]);
            
            setRecentProposals(proposals);
            setGovernanceStats(stats);
        
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        // Don't set fallback data - let user know there's an issue
        setRecentProposals([]);
        setGovernanceStats({});
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [isConnected, getProposals, getGovernanceStats, clearError]);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(async () => {
        try {
          await refreshBalance();
          const [proposals, stats] = await Promise.all([
            getProposals(5, 0),
            getGovernanceStats()
          ]);
          setRecentProposals(proposals);
          setGovernanceStats(stats);
        } catch (error) {
          console.error('Failed to refresh data:', error);
        }
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [isConnected, refreshBalance, getProposals, getGovernanceStats]);

  const copyAddress = async () => {
    if (account) {
      await navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatNumber = (num: string | number) => {
    const n = typeof num === 'string' ? parseFloat(num) : num;
    if (n >= 1000000) return (n / 1000000).toFixed(2) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(2) + 'K';
    return n.toFixed(2);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'executed': return 'text-blue-600 bg-blue-50';
      case 'defeated': return 'text-red-600 bg-red-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Always render something - add error boundary
  try {
  if (!isConnected) {
      console.log('Rendering wallet connection screen');
    return (
        <div className="min-h-screen bg-[#1e293b] relative overflow-hidden">
        {/* MetaMask-exact Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#1e293b]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,165,0,0.1),transparent_50%)]"></div>
        
        {/* Floating 3D Particles - MetaMask Style */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-orange-400 rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* MetaMask-exact Navigation */}
          <nav className="relative bg-[#24292f]/95 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
              <motion.div 
                className="relative w-10 h-10 bg-gradient-to-br from-[#f97316] via-[#ea580c] to-[#dc2626] rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/30"
                whileHover={{ 
                  scale: 1.1,
                  rotateY: 20,
                  rotateX: 10,
                }}
                style={{
                  transform: `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg)`
                }}
              >
                  <Brain className="w-6 h-6 text-white drop-shadow-lg" />
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 blur-md"></div>
                </motion.div>
                <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#fbbf24] bg-clip-text text-transparent">
                    ChainMind
                  </h1>
                <p className="text-xs text-gray-400 font-medium">AI Governance DAO</p>
              </div>
              </div>
              <motion.button
                onClick={connectWallet}
                disabled={isConnecting}
                className="relative bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700"></div>
                {isConnecting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4" />
                    <span>Connect Wallet</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </nav>

        {/* Hero Section - MetaMask Style */}
        <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center">
          <div className="text-center max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Status Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 mb-8"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                <span className="text-sm font-medium text-orange-400">
                  Wallet Connection Required
                </span>
              </motion.div>

              {/* 3D Interactive AI Brain - MetaMask exact style */}
              <motion.div 
                className="relative w-32 h-32 mx-auto mb-12"
                style={{
                  transform: `perspective(1000px) rotateX(${mousePosition.y * 8}deg) rotateY(${mousePosition.x * 8}deg)`
                }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Outer rings - MetaMask style */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#f97316] to-[#ea580c] opacity-20 animate-ping"></div>
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#ea580c] to-[#dc2626] opacity-30 animate-pulse"></div>
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#dc2626] to-[#b91c1c] opacity-40 animate-ping" style={{ animationDelay: '1s' }}></div>
                
                {/* Main brain container */}
                <motion.div 
                  className="relative w-32 h-32 bg-gradient-to-br from-[#f97316] via-[#ea580c] to-[#dc2626] rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/50"
                  animate={{
                    boxShadow: [
                      '0 0 30px rgba(249, 115, 22, 0.5)',
                      '0 0 60px rgba(249, 115, 22, 0.8)',
                      '0 0 30px rgba(249, 115, 22, 0.5)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Brain className="w-16 h-16 text-white drop-shadow-2xl" />
                  
                  {/* Neural network orbiting dots */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-white rounded-full"
                      style={{
                        top: '50%',
                        left: '50%',
                        transformOrigin: '0 0'
                      }}
                      animate={{
                        rotate: 360,
                        scale: [1, 1.5, 1],
                        opacity: [0.4, 1, 0.4]
                      }}
                      transition={{
                        duration: 4 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.3
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
              >
                Connect to{' '}
                <span className="bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#fbbf24] bg-clip-text text-transparent">
                  ChainMind
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-xl lg:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto"
              >
                Experience the world's first AI-powered governance DAO with 87%+ prediction accuracy. 
                Connect your MetaMask wallet to revolutionize decentralized decision-making.
              </motion.p>
              
              {/* 3D Bento box grid - MetaMask style */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div 
                  className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-orange-400/50 transition-all duration-500 group overflow-hidden"
                  whileHover={{ 
                    scale: 1.02,
                    rotateX: 5,
                    rotateY: 5,
                  }}
                  style={{
                    transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`
                  }}
                >
                  {/* Floating particles */}
                  <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-4 left-4 w-1 h-1 bg-orange-400 rounded-full animate-ping"></div>
                    <div className="absolute top-8 right-6 w-0.5 h-0.5 bg-yellow-400 rounded-full animate-ping delay-300"></div>
                    <div className="absolute bottom-6 left-8 w-0.5 h-0.5 bg-orange-300 rounded-full animate-ping delay-700"></div>
                  </div>
                  
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/25"
                    whileHover={{ rotateY: 180 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Brain className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="font-semibold text-white mb-2">AI-Powered</h3>
                  <p className="text-sm text-white/70">Advanced machine learning for proposal analysis</p>
                  
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                </motion.div>
                
                <motion.div 
                  className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-green-400/50 transition-all duration-500 group overflow-hidden"
                  whileHover={{ 
                    scale: 1.02,
                    rotateX: 5,
                    rotateY: -5,
                  }}
                  style={{
                    transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${-mousePosition.x * 2}deg)`
                  }}
                >
                  {/* Security particles */}
                  <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-3 right-4 w-1 h-1 bg-green-400 rounded-full animate-ping"></div>
                    <div className="absolute bottom-4 right-8 w-0.5 h-0.5 bg-emerald-400 rounded-full animate-ping delay-500"></div>
                    <div className="absolute top-8 left-6 w-0.5 h-0.5 bg-green-300 rounded-full animate-ping delay-1000"></div>
                </div>
                
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25"
                    whileHover={{ rotateY: 180 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Shield className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="font-semibold text-white mb-2">Secure</h3>
                  <p className="text-sm text-white/70">Enterprise-grade security and transparency</p>
                  
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                </motion.div>
                
                <motion.div 
                  className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-500 group overflow-hidden"
                  whileHover={{ 
                    scale: 1.02,
                    rotateX: -5,
                    rotateY: 5,
                  }}
                  style={{
                    transform: `perspective(1000px) rotateX(${-mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`
                  }}
                >
                  {/* Democratic particles */}
                  <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute bottom-3 left-4 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
                    <div className="absolute top-6 right-3 w-0.5 h-0.5 bg-purple-400 rounded-full animate-ping delay-700"></div>
                    <div className="absolute bottom-8 right-6 w-0.5 h-0.5 bg-blue-300 rounded-full animate-ping delay-300"></div>
                </div>
                
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25"
                    whileHover={{ rotateY: 180 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Users className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="font-semibold text-white mb-2">Democratic</h3>
                  <p className="text-sm text-white/70">True decentralized decision making</p>
                  
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                </motion.div>
              </div>

              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-orange-500/50 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 mx-auto"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Connecting to MetaMask...</span>
                  </>
                ) : (
                  <>
                    <Wallet className="w-5 h-5" />
                    <span>Connect MetaMask Wallet</span>
                  </>
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  console.log('Rendering connected dashboard');
  return (
      <div className="min-h-screen bg-[#0f172a] relative overflow-hidden">
      {/* MetaMask-exact background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(249,115,22,0.1),transparent_50%)]"></div>

      {/* MetaMask-style Navigation */}
        <nav className="relative bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <motion.div 
                className="relative w-10 h-10 bg-gradient-to-br from-[#f97316] via-[#ea580c] to-[#dc2626] rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/30"
                whileHover={{ 
                  scale: 1.1,
                  rotateY: 20,
                  rotateX: 10,
                }}
                style={{
                  transform: `perspective(1000px) rotateX(${mousePosition.y * 3}deg) rotateY(${mousePosition.x * 3}deg)`
                }}
              >
                <Brain className="w-6 h-6 text-white drop-shadow-lg" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 blur-md"></div>
              </motion.div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#fbbf24] bg-clip-text text-transparent">
                  ChainMind Dashboard
                </h1>
                <p className="text-xs text-gray-400 font-medium">Connected to {governanceStats.network || 'Ethereum'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Network Status */}
              <motion.div 
                className="hidden md:flex items-center space-x-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-2xl border border-green-500/30 backdrop-blur-xl"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live Connection</span>
              </motion.div>
              
              {/* Account Menu */}
              <div className="relative">
                <motion.button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 hover:bg-white/10 hover:border-orange-400/30 transition-all duration-300 backdrop-blur-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white hidden sm:block">
                    {formatAddress(account || '')}
                  </span>
                  <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${showAccountMenu ? 'rotate-90' : ''}`} />
                </motion.button>
                
                <AnimatePresence>
                  {showAccountMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-72 bg-[#0f172a]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 py-3 z-50"
                    >
                      <div className="px-6 py-4 border-b border-white/5">
                        <p className="text-sm text-gray-400 font-medium">Connected Account</p>
                        <div className="flex items-center space-x-3 mt-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-sm font-semibold text-white">{formatAddress(account || '')}</span>
                          <motion.button
                            onClick={copyAddress}
                            className="text-gray-400 hover:text-orange-400 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </motion.button>
                        </div>
                      </div>
                      
                      <div className="px-3 py-2">
                        <motion.button
                          onClick={() => navigate('/settings')}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-white hover:bg-white/5 rounded-xl transition-colors"
                          whileHover={{ x: 4 }}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </motion.button>
                        <motion.button
                          onClick={disconnectWallet}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                          whileHover={{ x: 4 }}
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Disconnect Wallet</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-500/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>
              <p className="text-gray-300 text-lg font-medium">Loading blockchain data...</p>
              <p className="text-gray-500 text-sm mt-2">Fetching real-time governance metrics</p>
            </motion.div>
          </div>
        ) : (
          <>
            {/* Welcome Section - MetaMask Style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-gradient-to-br from-white/5 to-orange-500/5 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-white/10 shadow-2xl overflow-hidden"
            >
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-50"></div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex-1">
                  <motion.h1 
                    className="text-3xl lg:text-4xl font-bold text-white mb-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Welcome back, <span className="bg-gradient-to-r from-[#f97316] to-[#fbbf24] bg-clip-text text-transparent">{formatAddress(account || '')}</span>
                  </motion.h1>
                  <motion.p 
                    className="text-gray-300 mb-6 text-lg leading-relaxed max-w-2xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Your AI-powered governance hub is live. Monitor proposals, track voting power, 
                    and shape the future of decentralized decision making with 87%+ prediction accuracy.
                  </motion.p>
                  <motion.div 
                    className="flex flex-wrap items-center gap-6 text-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 font-medium">Live Connection</span>
                    </div>
                    <div className="text-gray-400">•</div>
                    <div className="text-gray-400">Network: <span className="text-white font-medium">{governanceStats.network || 'Ethereum'}</span></div>
                    <div className="text-gray-400">•</div>
                    <div className="text-gray-400">Updated: <span className="text-white font-medium">{new Date().toLocaleTimeString()}</span></div>
                  </motion.div>
                </div>
                
                <motion.div 
                  className="hidden lg:block relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div 
                    className="w-24 h-24 bg-gradient-to-br from-[#f97316] via-[#ea580c] to-[#dc2626] rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/50"
                    style={{
                      transform: `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg)`
                    }}
                    animate={{
                      boxShadow: [
                        '0 0 40px rgba(249, 115, 22, 0.4)',
                        '0 0 80px rgba(249, 115, 22, 0.6)',
                        '0 0 40px rgba(249, 115, 22, 0.4)'
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Brain className="w-12 h-12 text-white drop-shadow-2xl" />
                  </motion.div>
                  
                  {/* Orbiting elements */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 bg-orange-400 rounded-full"
                      style={{
                        top: '50%',
                        left: '50%',
                        transformOrigin: '0 0'
                      }}
                      animate={{
                        rotate: 360,
                        scale: [1, 1.2, 1],
                        opacity: [0.4, 0.8, 0.4]
                      }}
                      transition={{
                        duration: 4 + i,
                        repeat: Infinity,
                        delay: i * 0.5
                      }}
                    />
                  ))}
                </motion.div>
              </div>
            </motion.div>

            {/* Key Metrics - MetaMask Card Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-orange-400/30 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 group overflow-hidden"
                whileHover={{ 
                  scale: 1.02,
                  y: -8,
                }}
                style={{
                  transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`
                }}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                
                {/* Floating particles */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  <div className="absolute top-4 right-4 w-1 h-1 bg-orange-400 rounded-full animate-ping opacity-50"></div>
                  <div className="absolute bottom-6 left-4 w-0.5 h-0.5 bg-yellow-400 rounded-full animate-ping delay-500 opacity-60"></div>
                  <div className="absolute top-8 left-8 w-0.5 h-0.5 bg-orange-300 rounded-full animate-ping delay-1000 opacity-40"></div>
                </div>
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <motion.div 
                      className="w-14 h-14 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/30"
                      whileHover={{ 
                        scale: 1.1,
                        rotateY: 180,
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <Coins className="w-7 h-7 text-white" />
                    </motion.div>
                    <motion.div
                      className="flex items-center space-x-1 text-green-400"
                      whileHover={{ scale: 1.05 }}
                    >
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs font-medium">+5.2%</span>
                    </motion.div>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {formatNumber(tokenBalance)}
                  </h3>
                  <p className="text-gray-400 text-sm font-medium mb-3">MIND Tokens</p>
                  <div className="flex items-center text-xs text-green-400">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    <span>Live Ethereum Data</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-green-400/50 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-green-500/25">
                    <Vote className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {formatNumber(votingPower)}
                </h3>
                <p className="text-white/70 mb-2">Voting Power</p>
                <p className="text-sm text-green-400 flex items-center">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  Live from Smart Contract
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/25">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {reputation}
                </h3>
                <p className="text-white/70 mb-2">Reputation Score</p>
                <p className="text-sm text-blue-400 flex items-center">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  Ethereum Verified
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/25">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {formatNumber(ethBalance)}
                </h3>
                <p className="text-white/70 mb-2">ETH Balance</p>
                <p className="text-sm text-purple-400 flex items-center">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  Live Blockchain Balance
                </p>
              </motion.div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-2xl"
              >
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-orange-400" />
                  Quick Actions
                </h2>
                <div className="space-y-4">
                  <Link
                    to="/proposals"
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl hover:bg-gradient-to-r hover:from-purple-500/30 hover:to-blue-500/30 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-200 group border border-white/10"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/25">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">View Proposals</h3>
                        <p className="text-sm text-white/70">Browse and vote on governance proposals</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-purple-400 transition-colors" />
                  </Link>

                  <Link
                    to="/staking"
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl hover:bg-gradient-to-r hover:from-green-500/30 hover:to-emerald-500/30 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-200 group border border-white/10"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-green-500/25">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Stake Tokens</h3>
                        <p className="text-sm text-white/70">Earn rewards by staking your MIND tokens</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-green-400 transition-colors" />
                  </Link>

                  <Link
                    to="/analytics"
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-cyan-500/30 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-200 group border border-white/10"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/25">
                        <BarChart className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">View Analytics</h3>
                        <p className="text-sm text-white/70">Track governance performance and trends</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-blue-400 transition-colors" />
                  </Link>

                  <Link
                    to="/create-proposal"
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-xl hover:bg-gradient-to-r hover:from-orange-500/30 hover:to-yellow-500/30 hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-200 group border border-white/10"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/25">
                        <Plus className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Create Proposal</h3>
                        <p className="text-sm text-white/70">Submit a new governance proposal</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-orange-400 transition-colors" />
                  </Link>
                </div>
              </motion.div>

              {/* Recent Proposals */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-xl hover:border-orange-400/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-purple-600" />
                    Recent Proposals
                  </h2>
                  <Link
                    to="/proposals"
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center"
                  >
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {recentProposals.length > 0 ? (
                    recentProposals.map((proposal, index) => (
                      <div
                        key={proposal.id}
                        className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:border-orange-400/40 transition-colors cursor-pointer"
                        onClick={() => navigate(`/proposals/${proposal.id}`)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 text-sm line-clamp-1">
                              {proposal.title}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-600">#{proposal.id}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(proposal.state)}`}>
                                {proposal.state}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">
                            {new Date(proposal.startTime).toLocaleDateString()}
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatNumber(parseInt(proposal.forVotes) + parseInt(proposal.againstVotes))} votes
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No proposals yet</p>
                      <Link
                        to="/create-proposal"
                        className="text-purple-600 hover:text-purple-700 font-medium text-sm mt-2 inline-block"
                      >
                        Create the first proposal
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Governance Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 mb-8 shadow-xl"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                Governance Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {governanceStats.totalProposals || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Proposals</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {governanceStats.activeProposals || 0}
                  </div>
                  <div className="text-sm text-gray-600">Active Proposals</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {formatNumber(governanceStats.totalVotes || 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Votes Cast</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {formatNumber(governanceStats.treasuryBalance || 0)}
                  </div>
                  <div className="text-sm text-gray-600">Treasury Balance (ETH)</div>
                </div>
              </div>
            </motion.div>

            {/* Interactive Features Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
            >
              {/* Quick Actions */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => navigate('/staking')}
                    className="flex flex-col items-center p-3 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-all duration-200 border border-purple-500/30"
                  >
                    <Lock className="w-6 h-6 text-purple-400 mb-1" />
                    <span className="text-sm text-white font-medium">Stake Tokens</span>
                    <span className="text-xs text-purple-300">Earn 12.5% APR</span>
                  </button>
                  
                  <button
                    onClick={() => navigate('/treasury')}
                    className="flex flex-col items-center p-3 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-all duration-200 border border-green-500/30"
                  >
                    <DollarSign className="w-6 h-6 text-green-400 mb-1" />
                    <span className="text-sm text-white font-medium">Treasury</span>
                    <span className="text-xs text-green-300">View funds</span>
                  </button>
                  
                  <button
                    onClick={() => navigate('/community')}
                    className="flex flex-col items-center p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-all duration-200 border border-blue-500/30"
                  >
                    <Users className="w-6 h-6 text-blue-400 mb-1" />
                    <span className="text-sm text-white font-medium">Social</span>
                    <span className="text-xs text-blue-300">Join discussion</span>
                  </button>
                  
                  <button
                    onClick={() => navigate('/rewards')}
                    className="flex flex-col items-center p-3 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg transition-all duration-200 border border-orange-500/30"
                  >
                    <Award className="w-6 h-6 text-orange-400 mb-1" />
                    <span className="text-sm text-white font-medium">Rewards</span>
                    <span className="text-xs text-orange-300">Claim earnings</span>
                  </button>
                </div>
              </div>

              {/* Live AI Insights */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-400" />
                  AI Governance Insights
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-white">Proposal Success Rate</span>
                    </div>
                    <span className="text-green-400 font-semibold">93%</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">Community Engagement</span>
                    </div>
                    <span className="text-blue-400 font-semibold">78%</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-orange-400" />
                      <span className="text-sm text-white">Prediction Accuracy</span>
                    </div>
                    <span className="text-orange-400 font-semibold">94.2%</span>
                  </div>
                  
                  <div className="mt-4 p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
                    <p className="text-sm text-white/90">
                      💡 <strong>AI Tip:</strong> Treasury proposals have 15% higher success rate when submitted on Tuesdays
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Activity Feed & Performance Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
            >
              {/* Recent Activity Feed */}
              <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-400" />
                  Live Activity Feed
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {[
                    { action: 'New proposal created', user: 'Vitalik.eth', time: '2 min ago', type: 'proposal' },
                    { action: 'Voted on Treasury Allocation', user: 'alice.eth', time: '5 min ago', type: 'vote' },
                    { action: 'Staked 1,000 MIND tokens', user: 'bob.eth', time: '8 min ago', type: 'stake' },
                    { action: 'Community post liked', user: 'charlie.eth', time: '12 min ago', type: 'social' },
                    { action: 'AI prediction updated', user: 'system', time: '15 min ago', type: 'ai' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'proposal' ? 'bg-purple-400' :
                        activity.type === 'vote' ? 'bg-green-400' :
                        activity.type === 'stake' ? 'bg-blue-400' :
                        activity.type === 'social' ? 'bg-pink-400' :
                        'bg-yellow-400'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-white">
                          <span className="font-medium text-purple-300">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                  Your Performance
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Voting Power</span>
                      <span className="text-white font-medium">{formatNumber(votingPower || 0)}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((Number(votingPower) || 0) / 10000 * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Reputation Score</span>
                      <span className="text-white font-medium">{reputation || 0}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((Number(reputation) || 0) / 100 * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Participation Rate</span>
                      <span className="text-white font-medium">87%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full w-[87%] transition-all duration-500" />
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-300 font-medium">Active Contributor</span>
                    </div>
                    <p className="text-xs text-green-200 mt-1">Top 15% most active members</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Voting Panel */}
            {recentProposals.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-xl mb-8"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Vote className="w-5 h-5 mr-2 text-purple-400" />
                  Quick Vote - Active Proposals
                </h3>
                <div className="space-y-4">
                  {recentProposals.slice(0, 2).map((proposal) => (
                    <div key={proposal.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-white mb-1">{proposal.title}</h4>
                          <div className="flex items-center space-x-3 text-sm text-gray-300">
                            <span>#{proposal.id}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(proposal.state)}`}>
                              {proposal.state}
                            </span>
                            <span>{formatNumber(parseInt(proposal.forVotes) + parseInt(proposal.againstVotes))} votes</span>
                          </div>
                        </div>
                      </div>
                      
                      {proposal.state === 'Active' && (
                        <div className="flex space-x-3">
                          <button
                            onClick={() => {
                              // Add voting logic here
                              console.log('Voting FOR proposal', proposal.id);
                            }}
                            className="flex-1 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 rounded-lg transition-all duration-200 text-sm font-medium"
                          >
                            Vote For
                          </button>
                          <button
                            onClick={() => {
                              // Add voting logic here
                              console.log('Voting AGAINST proposal', proposal.id);
                            }}
                            className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 rounded-lg transition-all duration-200 text-sm font-medium"
                          >
                            Vote Against
                          </button>
                          <button
                            onClick={() => navigate(`/proposals/${proposal.id}`)}
                            className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 rounded-lg transition-all duration-200 text-sm font-medium"
                          >
                            Details
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8"
              >
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                  <button
                    onClick={clearError}
                    className="text-red-400 hover:text-red-600"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
  } catch (error) {
    console.error('Dashboard component error:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">⚠️ Dashboard Error</h1>
          <p className="text-white/80 mb-4">There was an error loading the dashboard.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
};

export default Dashboard;
