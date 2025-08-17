import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useWeb3 } from '../../contexts/Web3Context';
import { MetaMask3DIcon, MetaMask3DContainer, FloatingParticles } from '../MetaMask3D';
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
  Smartphone,
  Crown,
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
  Settings,
  LogOut,
  User,
  Bell,
  Menu,
  X,
  Home,

  Gift,
  MessageSquare,
  Building
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  id: string;
  name: string;
  path: string;
  icon: any;
  gradient: string;
  description: string;
  badge?: string;
  comingSoon?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { 
    account, 
    isConnected, 
    disconnectWallet,
    tokenBalance,
    ethBalance,
    displayName
  } = useWeb3();
  
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [copied, setCopied] = useState(false);

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

  // Navigation items with Perfect Vitalik-Grade Organization
  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      path: '/dashboard',
      icon: Home,
      gradient: 'from-purple-600 to-indigo-600',
      description: 'AI-powered overview'
    },
    {
      id: 'proposals',
      name: 'Proposals',
      path: '/proposals',
      icon: Vote,
      gradient: 'from-purple-500 to-pink-500',
      description: 'Governance proposals'
    },
    {
      id: 'governance-staking',
      name: 'Governance Staking',
      path: '/governance-staking',
      icon: Target,
      gradient: 'from-purple-500 to-violet-500',
      description: 'Enhanced voting power'
    },
    {
      id: 'grants',
      name: 'Grant System',
      path: '/grants',
      icon: Award,
      gradient: 'from-purple-400 to-pink-400',
      description: 'Milestone funding'
    },
    {
      id: 'forums',
      name: 'Forums',
      path: '/forums',
      icon: MessageSquare,
      gradient: 'from-violet-500 to-purple-500',
      description: 'Pre-vote discussions'
    },
    {
      id: 'reputation',
      name: 'Reputation',
      path: '/reputation',
      icon: Crown,
      gradient: 'from-yellow-500 to-orange-500',
      description: 'Achievement system'
    },
    {
      id: 'snapshot',
      name: 'Snapshot Voting',
      path: '/snapshot',
      icon: Zap,
      gradient: 'from-purple-500 to-pink-500',
      description: 'Gas-free governance'
    },
    {
      id: 'mobile',
      name: 'Mobile Governance',
      path: '/mobile',
      icon: Smartphone,
      gradient: 'from-blue-500 to-purple-500',
      description: 'On-the-go voting'
    },
    {
      id: 'cross-chain',
      name: 'Cross-Chain',
      path: '/cross-chain',
      icon: Globe,
      gradient: 'from-cyan-500 to-blue-500',
      description: 'Multi-chain governance'
    }
  ];

  const secondaryNavItems: NavItem[] = [
    {
      id: 'analytics',
      name: 'Analytics',
      path: '/analytics',
      icon: BarChart3,
      gradient: 'from-indigo-500 to-purple-500',
      description: 'Performance insights'
    },
    {
      id: 'treasury',
      name: 'Treasury',
      path: '/treasury',
      icon: Lock,
      gradient: 'from-emerald-500 to-green-500',
      description: 'Fund management'
    },
    {
      id: 'rewards',
      name: 'Rewards',
      path: '/rewards',
      icon: Gift,
      gradient: 'from-orange-500 to-red-500',
      description: 'Claim earnings'
    },
    {
      id: 'community',
      name: 'Community',
      path: '/community',
      icon: Users,
      gradient: 'from-cyan-500 to-blue-500',
      description: 'Connect with members'
    },
    {
      id: 'settings',
      name: 'Settings',
      path: '/settings',
      icon: Settings,
      gradient: 'from-purple-500 to-violet-500',
      description: 'Account preferences'
    }
  ];

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyAddress = async () => {
    if (account) {
      await navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return num.toFixed(4);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden">
      {/* MetaMask-exact background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(249,115,22,0.1),transparent_50%)]"></div>
      
      {/* Floating Particles */}
      <FloatingParticles count={15} color="orange-400" speed={0.5} />

      {/* Desktop Sidebar */}
      <AnimatePresence>
        {desktopSidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed left-0 top-0 bottom-0 w-70 bg-[#0f172a]/80 backdrop-blur-xl border-r border-white/5 z-50 hidden lg:block"
          >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#fbbf24] bg-clip-text text-transparent">
                    ChainMind
                  </h1>
                  <p className="text-xs text-gray-400 font-medium">AI Governance DAO</p>
                </div>
              </div>
              
              {/* Desktop Close Button */}
              <motion.button
                onClick={() => setDesktopSidebarOpen(false)}
                className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Close Sidebar"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-white" />
              </motion.button>
            </div>
          </div>

          {/* Account Info */}
          {isConnected && (
            <div className="p-6 border-b border-white/5">
              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium text-sm truncate">
                      {displayName || formatAddress(account || '')}
                    </div>
                    <div className="text-orange-300 text-xs">{displayName ? formatAddress(account || '') : 'Connected'}</div>
                  </div>
                  <motion.button
                    onClick={copyAddress}
                    className="text-gray-400 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </motion.button>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-gray-400">ETH Balance</div>
                    <div className="text-white font-medium">{formatBalance(ethBalance || '0')}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">MIND Tokens</div>
                    <div className="text-white font-medium">{formatBalance(tokenBalance || '0')}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Main Navigation
            </div>
            
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <motion.div key={item.id} whileHover={{ x: 4 }}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                      isActive
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {/* Hover glow effect */}
                    {!isActive && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl`}></div>
                    )}
                    
                    <div className="relative z-10 flex items-center space-x-3 flex-1">
                      <item.icon className="w-5 h-5" />
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className={`text-xs ${isActive ? 'text-white/70' : 'text-gray-500'}`}>
                          {item.description}
                        </div>
                      </div>
                      {item.badge && (
                        <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}

            <div className="pt-6 mt-6 border-t border-white/5">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Account
              </div>
              
              {secondaryNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                
                return (
                  <motion.div key={item.id} whileHover={{ x: 4 }}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 group ${
                        isActive
                          ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className={`text-xs ${isActive ? 'text-white/70' : 'text-gray-500'}`}>
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
              
              {isConnected && (
                <motion.button
                  onClick={disconnectWallet}
                  className="flex items-center space-x-3 p-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 w-full group"
                  whileHover={{ x: 4 }}
                >
                  <LogOut className="w-5 h-5" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">Disconnect</div>
                    <div className="text-xs text-red-400/70">Sign out of wallet</div>
                  </div>
                </motion.button>
              )}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-white/5">
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-2">ChainMind v1.0.0</div>
              <div className="text-xs text-gray-500">AI-Powered Governance</div>
            </div>
          </div>
        </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-[#f97316] to-[#fbbf24] bg-clip-text text-transparent">
                ChainMind
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {isConnected && (
              <div className="text-right">
                <div className="text-sm font-medium text-white">
                  {displayName || formatAddress(account || '')}
                </div>
                <div className="text-xs text-gray-400">{displayName ? formatAddress(account || '') : 'Connected'}</div>
              </div>
            )}
            
            <motion.button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {sidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setSidebarOpen(false)}
            />
            
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-70 bg-[#0f172a]/95 backdrop-blur-xl border-r border-white/10 z-50"
            >
              <div className="flex flex-col h-full">
                {/* Mobile nav content - same as desktop but with close functionality */}
                <div className="p-6 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#fbbf24] bg-clip-text text-transparent">
                          ChainMind
                        </h1>
                        <p className="text-xs text-gray-400 font-medium">AI Governance DAO</p>
                      </div>
                    </div>
                    
                    <motion.button
                      onClick={() => setSidebarOpen(false)}
                      className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                      whileHover={{ scale: 1.05 }}
                    >
                      <X className="w-4 h-4 text-white" />
                    </motion.button>
                  </div>
                </div>

                {/* Mobile Navigation - same structure as desktop */}
                <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <Link
                        key={item.id}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                          isActive
                            ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className={`text-xs ${isActive ? 'text-white/70' : 'text-gray-500'}`}>
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Floating Sidebar Open Button (Desktop) */}
      {!desktopSidebarOpen && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setDesktopSidebarOpen(true)}
          className="hidden lg:flex fixed left-4 top-4 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 z-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Open Sidebar"
        >
          <Menu className="w-6 h-6 text-white" />
        </motion.button>
      )}

      {/* Main Content */}
      <main className={`transition-all duration-300 min-h-screen pt-16 lg:pt-0 ${desktopSidebarOpen ? 'lg:ml-70' : 'lg:ml-0'}`}>
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;