import React, { useRef, useEffect, useState, Suspense } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Environment, Html } from '@react-three/drei';
import { Link, useNavigate } from 'react-router-dom';
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
  ChevronRight,
  Play,
  ExternalLink,
  Menu,
  X,
  Download,
  Github,
  Twitter
} from 'lucide-react';
import { useWeb3 } from '../contexts/Web3Context';

// 3D Fallback Component
const FallbackBrain = () => (
  <Html center>
    <div className="flex flex-col items-center justify-center p-8 bg-black/20 backdrop-blur-xl rounded-2xl border border-orange-500/30">
      <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mb-4 animate-pulse shadow-xl shadow-orange-500/50"></div>
      <div className="text-white text-lg font-semibold mb-2">AI Brain Loading...</div>
      <div className="text-orange-400 text-sm">Initializing Neural Network</div>
    </div>
  </Html>
);

// MetaMask-exact 3D Brain Component
const AIBrain3D = () => {
  const meshRef = useRef<any>(null);
  
  useEffect(() => {
    console.log('AIBrain3D component mounted');
  }, []);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.2;
    }
  });

  try {
    return (
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <Sphere ref={meshRef} args={[1.2, 64, 64]} scale={1.5}>
          <MeshDistortMaterial
            color="#f97316"
            attach="material"
            distort={0.3}
            speed={2}
            roughness={0.1}
            metalness={0.8}
          />
        </Sphere>
        {/* Neural network connections */}
        {[...Array(8)].map((_, i) => (
          <Sphere key={i} args={[0.05, 16, 16]} 
            position={[
              Math.cos((i / 8) * Math.PI * 2) * 2,
              Math.sin((i / 8) * Math.PI * 2) * 2,
              Math.random() * 2 - 1
            ]}>
            <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" />
          </Sphere>
        ))}
      </Float>
    );
  } catch (error) {
    console.error('Error rendering AIBrain3D:', error);
    return <FallbackBrain />;
  }
};

const Landing: React.FC = () => {
  const { connectWallet, isConnected, isConnecting } = useWeb3();
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

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

  // Scroll detection for navigation
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'features', 'ecosystem', 'community'];
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && scrollPosition >= element.offsetTop) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isConnected) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden">
      {/* MetaMask-exact background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(249,115,22,0.15),transparent_50%)]"></div>
      
      {/* Animated grid background - MetaMask style */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }}></div>
      </div>

      {/* MetaMask-exact Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
            >
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
                  ChainMind
                </h1>
                <p className="text-xs text-gray-400 font-medium">AI Governance DAO</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { name: 'Home', id: 'home' },
                { name: 'Features', id: 'features' },
                { name: 'Ecosystem', id: 'ecosystem' },
                { name: 'Community', id: 'community' }
              ].map((item) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`text-sm font-medium transition-colors duration-200 relative ${
                    activeSection === item.id 
                      ? 'text-orange-400' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                  whileHover={{ y: -1 }}
                >
                  {item.name}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center space-x-4">
                <motion.button
                  onClick={connectWallet}
                disabled={isConnecting}
                className="relative bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700"></div>
                {isConnecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4" />
                    <span>Launch App</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            </div>
          </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0f172a]/95 backdrop-blur-xl border-t border-white/5"
            >
              <div className="px-4 py-6 space-y-4">
                {[
                  { name: 'Home', id: 'home' },
                  { name: 'Features', id: 'features' },
                  { name: 'Ecosystem', id: 'ecosystem' },
                  { name: 'Community', id: 'community' }
                ].map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-gray-300 hover:text-white font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="w-full bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white px-6 py-3 rounded-2xl font-semibold flex items-center justify-center space-x-2"
                >
                  {isConnecting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4" />
                      <span>Launch App</span>
                    </>
                  )}
                </button>
        </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section - MetaMask Homepage Exact */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 mb-6"
              >
                <Sparkles className="w-4 h-4 text-orange-400 mr-2" />
                <span className="text-sm font-medium text-orange-400">
                  AI-Powered Governance Platform
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-5xl lg:text-7xl font-bold leading-tight mb-6"
              >
                <span className="text-white">The Future of</span>
                <br />
                <span className="bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#fbbf24] bg-clip-text text-transparent">
                  AI Governance
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-xl text-gray-300 mb-8 max-w-2xl"
              >
                Experience the world's first AI-powered governance DAO with 87%+ prediction accuracy. 
                Revolutionizing decentralized decision-making through advanced machine learning.
              </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <motion.button
                    onClick={connectWallet}
                  disabled={isConnecting}
                  className="relative bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 flex items-center justify-center space-x-3 overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  {isConnecting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Connecting to MetaMask...</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="w-5 h-5" />
                      <span>Launch ChainMind</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>

                <motion.button
                  onClick={() => navigate('/demo')}
                  className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-3 backdrop-blur-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </motion.button>
              </motion.div>
              
              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/10"
              >
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white mb-1">87.3%</div>
                  <div className="text-sm text-gray-400">AI Accuracy</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white mb-1">$2.5M+</div>
                  <div className="text-sm text-gray-400">Assets Managed</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white mb-1">10K+</div>
                  <div className="text-sm text-gray-400">Active Users</div>
              </div>
            </motion.div>
            </motion.div>

            {/* Right 3D Content */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative h-[600px] lg:h-[700px]"
              style={{ y }}
            >
              <Canvas 
                camera={{ position: [0, 0, 5], fov: 75 }}
                style={{ width: '100%', height: '100%' }}
                dpr={[1, 2]}
                gl={{ alpha: true, antialias: true }}
                onCreated={({ gl }) => {
                  console.log('Canvas created successfully');
                  gl.setClearColor('#000000', 0);
                }}
              >
                <Suspense fallback={<FallbackBrain />}>
                  <ambientLight intensity={0.8} />
                  <pointLight position={[10, 10, 10]} intensity={1.5} />
                  <directionalLight position={[-10, -10, -5]} intensity={0.5} />
                  <AIBrain3D />
                  <Environment preset="night" />
                </Suspense>
              </Canvas>

              {/* Floating UI Elements */}
            <motion.div 
                className="absolute top-20 left-10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-blue-500/30 rounded-xl p-4"
                animate={{
                  y: [0, -10, 0],
                  rotateX: [0, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white text-sm font-medium">AI Prediction: 94%</span>
              </div>
            </motion.div>
            
            <motion.div 
                className="absolute bottom-32 right-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-500/30 rounded-xl p-4"
                animate={{
                  y: [0, 10, 0],
                  rotateX: [0, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <div className="flex items-center space-x-3">
                  <Vote className="w-4 h-4 text-purple-400" />
                  <span className="text-white text-sm font-medium">Live Governance</span>
              </div>
            </motion.div>
            
            <motion.div 
                className="absolute top-1/2 right-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-xl border border-orange-500/30 rounded-xl p-4"
                animate={{
                  x: [0, -15, 0],
                  rotateY: [0, 10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
              >
                <div className="flex items-center space-x-3">
                  <Shield className="w-4 h-4 text-orange-400" />
                  <span className="text-white text-sm font-medium">Secure & Audited</span>
              </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section - MetaMask Style */}
      <section id="features" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Powered by <span className="bg-gradient-to-r from-[#f97316] to-[#fbbf24] bg-clip-text text-transparent">Advanced AI</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              ChainMind revolutionizes governance with cutting-edge artificial intelligence, 
              providing unprecedented accuracy in decision-making predictions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI-Powered Predictions",
                description: "87.3% accuracy in proposal outcome forecasting using advanced machine learning algorithms.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "Audited smart contracts with zero-knowledge proofs ensuring maximum security and privacy.",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: Vote,
                title: "Democratic Governance",
                description: "True decentralized decision-making with reputation-weighted voting and transparent processes.",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: BarChart3,
                title: "Real-time Analytics",
                description: "Comprehensive governance insights with live data and predictive trend analysis.",
                gradient: "from-orange-500 to-red-500"
              },
              {
                icon: Lock,
                title: "Staking & Rewards",
                description: "Earn up to 25% APY through multiple staking pools with flexible lock periods.",
                gradient: "from-indigo-500 to-blue-500"
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Sub-second transaction processing with optimized gas fees and Layer 2 integration.",
                gradient: "from-yellow-500 to-orange-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  rotateX: 5
                }}
                className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 group overflow-hidden"
                style={{
                  transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`
                }}
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
                
                <motion.div
                  className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg`}
                  whileHover={{ 
                    scale: 1.1,
                    rotateY: 180
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </motion.div>
                
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                
                {/* Hover arrow */}
                <motion.div
                  className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ x: 5 }}
                >
                  <ArrowRight className="w-5 h-5 text-white" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section id="ecosystem" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Complete <span className="bg-gradient-to-r from-[#f97316] to-[#fbbf24] bg-clip-text text-transparent">Ecosystem</span>
              </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From proposal creation to treasury management, ChainMind provides 
              all tools needed for effective decentralized governance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {[
                {
                  icon: FileText,
                  title: "Smart Proposals",
                  description: "AI-assisted proposal creation with automated impact analysis and success predictions."
                },
                {
                  icon: Users,
                  title: "Community Driven",
                  description: "Reputation-based voting system ensuring quality participation and fair representation."
                },
                {
                  icon: Coins,
                  title: "Treasury Management",
                  description: "Transparent fund allocation with real-time tracking and automated distribution."
                },
                {
                  icon: Target,
                  title: "Performance Tracking",
                  description: "Comprehensive analytics dashboard with KPIs and governance effectiveness metrics."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/25">
                    <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-300">{item.description}</p>
                    </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-blue-500/30">
                    <div className="text-2xl font-bold text-white mb-1">142</div>
                    <div className="text-sm text-blue-300">Active Proposals</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30">
                    <div className="text-2xl font-bold text-white mb-1">89.2%</div>
                    <div className="text-sm text-green-300">Participation Rate</div>
                </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
                    <div className="text-2xl font-bold text-white mb-1">$2.5M</div>
                    <div className="text-sm text-purple-300">Treasury Value</div>
              </div>
                  <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-orange-500/30">
                    <div className="text-2xl font-bold text-white mb-1">24.7%</div>
                    <div className="text-sm text-orange-300">Staking APY</div>
              </div>
            </div>
          </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Join the <span className="bg-gradient-to-r from-[#f97316] to-[#fbbf24] bg-clip-text text-transparent">Revolution</span>
          </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Be part of the future of governance. Connect with thousands of innovators 
              building the next generation of decentralized organizations.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {[
                { name: 'Discord', icon: Users, members: '15K+', link: '#' },
                { name: 'Twitter', icon: Twitter, members: '25K+', link: '#' },
                { name: 'GitHub', icon: Github, members: '2K+', link: '#' }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.link}
                  className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-xl px-6 py-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <social.icon className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">{social.name}</span>
                  <span className="text-gray-400 text-sm">{social.members}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.button
                onClick={connectWallet}
              disabled={isConnecting}
              className="relative bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white px-12 py-6 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 flex items-center justify-center space-x-4 mx-auto overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              {isConnecting ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Connecting to MetaMask...</span>
                </>
              ) : (
                <>
                  <Rocket className="w-6 h-6" />
                  <span>Start Your Governance Journey</span>
                  <ArrowRight className="w-6 h-6" />
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              className="flex items-center justify-center space-x-3 mb-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#f97316] to-[#fbbf24] bg-clip-text text-transparent">
                ChainMind
              </span>
            </motion.div>
            <p className="text-gray-400 mb-4">
              The future of AI-powered governance, built for the decentralized world.
            </p>
            <p className="text-gray-500 text-sm">
              © 2024 ChainMind. AI-Powered Governance Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>
    </div>
  );
};

export default Landing;
