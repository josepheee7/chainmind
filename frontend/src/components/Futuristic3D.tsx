/**
 * Futuristic 3D Components - Vitalik Grade
 * ========================================
 * 
 * 🌟 MIND-BLOWING 3D VISUALS FOR HACKATHON DEMO
 * - Holographic data cubes with particle effects
 * - Rotating neural network spheres
 * - Futuristic treasury vault with energy streams
 * - Real-time data visualization with neon effects
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

// Futuristic Data Cube for Analytics
export const FuturisticDataCube: React.FC<{ 
  data: any; 
  size?: number; 
  glowColor?: string;
  rotationSpeed?: number;
}> = ({ 
  data, 
  size = 200, 
  glowColor = '#00ff88', 
  rotationSpeed = 1 
}) => {
  const [rotation, setRotation] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => prev + rotationSpeed);
    }, 16);
    return () => clearInterval(interval);
  }, [rotationSpeed]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left - rect.width / 2) / rect.width,
      y: (e.clientY - rect.top - rect.height / 2) / rect.height
    });
  };

  return (
    <div 
      className="relative"
      style={{ width: size, height: size }}
      onMouseMove={handleMouseMove}
    >
      {/* Holographic Base */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gray-900/20 to-gray-800/40 backdrop-blur-xl border border-cyan-500/30">
        
        {/* Rotating Outer Ring */}
        <motion.div
          className="absolute inset-2 border-2 border-cyan-400/50 rounded-xl"
          animate={{ rotate: rotation }}
          style={{
            boxShadow: `0 0 20px ${glowColor}40`,
          }}
        />
        
        {/* Inner Cube */}
        <motion.div
          className="absolute inset-6 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg border border-cyan-300/40"
          animate={{ 
            rotateX: rotation * 0.7 + mousePos.y * 30,
            rotateY: rotation * 0.5 + mousePos.x * 30,
          }}
          style={{
            transformStyle: 'preserve-3d',
            boxShadow: `inset 0 0 30px ${glowColor}60`,
          }}
        >
          {/* Data Streams */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px bg-gradient-to-t from-transparent via-cyan-400 to-transparent opacity-70"
              style={{
                height: '100%',
                left: `${15 + i * 15}%`,
                top: 0,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                height: ['50%', '100%', '50%'],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
          
          {/* Central Data Core */}
          <div className="absolute inset-4 bg-gradient-radial from-cyan-400/40 to-transparent rounded-full">
            <motion.div
              className="w-full h-full bg-cyan-400/20 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>
        
        {/* Floating Particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: `${20 + (i % 3) * 30}%`,
              top: `${20 + Math.floor(i / 3) * 30}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2 + (i * 0.2),
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
      
      {/* Holographic Glow */}
      <div 
        className="absolute inset-0 rounded-xl opacity-60 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${glowColor}20 0%, transparent 70%)`,
          filter: 'blur(8px)',
        }}
      />
    </div>
  );
};

// Neural Network Sphere for AI Predictions
export const NeuralNetworkSphere: React.FC<{ 
  accuracy?: number; 
  predictionCount?: number;
  isActive?: boolean;
}> = ({ 
  accuracy = 85, 
  predictionCount = 1247,
  isActive = true 
}) => {
  const [nodes] = useState(() => 
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      angle: (i * 360) / 12,
      radius: 80 + Math.random() * 40,
      pulseDelay: i * 0.2,
    }))
  );

  return (
    <div className="relative w-64 h-64">
      {/* Central Core */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-24 h-24 bg-gradient-to-br from-purple-500/40 to-pink-500/40 rounded-full border-2 border-purple-400/60"
          animate={isActive ? {
            scale: [1, 1.1, 1],
            boxShadow: [
              '0 0 20px rgba(168, 85, 247, 0.4)',
              '0 0 40px rgba(168, 85, 247, 0.8)',
              '0 0 20px rgba(168, 85, 247, 0.4)',
            ],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="absolute inset-2 bg-gradient-radial from-purple-300/60 to-transparent rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
            {accuracy}%
          </div>
        </motion.div>
      </div>

      {/* Neural Nodes */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute w-4 h-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full"
          style={{
            left: '50%',
            top: '50%',
            transformOrigin: '50% 50%',
          }}
          animate={{
            x: Math.cos((node.angle * Math.PI) / 180) * node.radius - 8,
            y: Math.sin((node.angle * Math.PI) / 180) * node.radius - 8,
            scale: [0.8, 1.2, 0.8],
            boxShadow: [
              '0 0 5px rgba(34, 211, 238, 0.4)',
              '0 0 15px rgba(34, 211, 238, 0.8)',
              '0 0 5px rgba(34, 211, 238, 0.4)',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: node.pulseDelay,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Neural Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {nodes.map((node, i) => {
          const nextNode = nodes[(i + 1) % nodes.length];
          const x1 = 128 + Math.cos((node.angle * Math.PI) / 180) * node.radius;
          const y1 = 128 + Math.sin((node.angle * Math.PI) / 180) * node.radius;
          const x2 = 128 + Math.cos((nextNode.angle * Math.PI) / 180) * nextNode.radius;
          const y2 = 128 + Math.sin((nextNode.angle * Math.PI) / 180) * nextNode.radius;
          
          return (
            <motion.line
              key={`connection-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="url(#neural-gradient)"
              strokeWidth="1"
              opacity="0.6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          );
        })}
        <defs>
          <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>

      {/* Info Display */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-xs text-cyan-400 font-mono">
          {predictionCount.toLocaleString()} predictions
        </div>
      </div>
    </div>
  );
};

// Futuristic Treasury Vault
export const FuturisticTreasuryVault: React.FC<{ 
  balance?: number; 
  currency?: string;
  isUnlocked?: boolean;
}> = ({ 
  balance = 15420000, 
  currency = 'MIND',
  isUnlocked = true 
}) => {
  const [energyLevel, setEnergyLevel] = useState(75);

  useEffect(() => {
    const interval = setInterval(() => {
      setEnergyLevel(prev => 70 + Math.sin(Date.now() / 1000) * 10);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-80 h-80">
      {/* Vault Base */}
      <div className="absolute inset-4 bg-gradient-to-br from-gray-900/60 to-gray-700/80 rounded-2xl border-2 border-amber-500/40 backdrop-blur-xl">
        
        {/* Energy Streams */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-gradient-to-t from-amber-500/60 to-orange-400/60 rounded-full"
            style={{
              width: '4px',
              height: `${energyLevel}%`,
              left: `${20 + i * 20}%`,
              bottom: '10%',
            }}
            animate={{
              height: [`${energyLevel - 10}%`, `${energyLevel + 10}%`],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 1.5 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Central Vault Door */}
        <motion.div
          className="absolute inset-8 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-xl border border-amber-300/50"
          animate={isUnlocked ? {
            boxShadow: [
              '0 0 30px rgba(245, 158, 11, 0.4)',
              '0 0 60px rgba(245, 158, 11, 0.8)',
              '0 0 30px rgba(245, 158, 11, 0.4)',
            ],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Lock Mechanism */}
          <div className="absolute inset-4 flex items-center justify-center">
            <motion.div
              className={`w-16 h-16 rounded-full border-4 ${
                isUnlocked 
                  ? 'border-green-400 bg-green-400/20' 
                  : 'border-red-400 bg-red-400/20'
              }`}
              animate={{
                rotate: isUnlocked ? 360 : 0,
              }}
              transition={{
                duration: 2,
                ease: "easeInOut"
              }}
            >
              <div className="absolute inset-2 bg-gradient-radial from-current to-transparent rounded-full opacity-40" />
              {isUnlocked ? (
                <div className="absolute inset-0 flex items-center justify-center text-green-400 text-xl">
                  ✓
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-red-400 text-xl">
                  🔒
                </div>
              )}
            </motion.div>
          </div>
          
          {/* Balance Display */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-amber-400 font-bold text-lg">
              {balance.toLocaleString()} {currency}
            </div>
            <div className="text-amber-300/60 text-xs">
              Treasury Balance
            </div>
          </div>
        </motion.div>
        
        {/* Security Grid */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-full h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"
              style={{
                top: `${15 + i * 15}%`,
              }}
              animate={{
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 3,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Holographic Projections */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-amber-400/60 rounded-full"
          style={{
            left: `${30 + i * 30}%`,
            top: '10%',
          }}
          animate={{
            y: [0, -30, -60, -30, 0],
            opacity: [0, 0.8, 1, 0.8, 0],
            scale: [0.5, 1, 1.2, 1, 0.5],
          }}
          transition={{
            duration: 4,
            delay: i * 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Energy Field */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-40 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, rgba(245, 158, 11, 0.2) 0%, transparent 70%)`,
          filter: 'blur(15px)',
        }}
      />
    </div>
  );
};

// Quantum Staking Portal
export const QuantumStakingPortal: React.FC<{ 
  stakedAmount?: number; 
  rewards?: number;
  apr?: number;
}> = ({ 
  stakedAmount = 5000, 
  rewards = 125.67,
  apr = 12.5
}) => {
  const [portalActive, setPortalActive] = useState(true);

  return (
    <div className="relative w-72 h-72">
      {/* Portal Ring */}
      <motion.div
        className="absolute inset-0 border-4 border-purple-500/60 rounded-full"
        animate={portalActive ? {
          rotate: 360,
          boxShadow: [
            '0 0 20px rgba(147, 51, 234, 0.4)',
            '0 0 40px rgba(147, 51, 234, 0.8)',
            '0 0 20px rgba(147, 51, 234, 0.4)',
          ],
        } : {}}
        transition={{
          rotate: { duration: 8, repeat: Infinity, ease: "linear" },
          boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      />
      
      {/* Inner Portal */}
      <div className="absolute inset-8 bg-gradient-radial from-purple-600/20 via-pink-500/20 to-transparent rounded-full border border-purple-400/40">
        
        {/* Quantum Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"
            style={{
              left: '50%',
              top: '50%',
            }}
            animate={{
              x: Math.cos((i * 30 * Math.PI) / 180) * (60 + Math.sin(Date.now() / 1000 + i) * 20) - 4,
              y: Math.sin((i * 30 * Math.PI) / 180) * (60 + Math.sin(Date.now() / 1000 + i) * 20) - 4,
              scale: [0.5, 1.5, 0.5],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 3,
              delay: i * 0.1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Central Staking Core */}
        <div className="absolute inset-4 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full border border-purple-300/50 flex flex-col items-center justify-center">
          <motion.div
            className="text-purple-300 font-bold text-lg"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {stakedAmount.toLocaleString()}
          </motion.div>
          <div className="text-purple-400/80 text-xs">MIND Staked</div>
          
          <div className="mt-2 text-pink-300 font-semibold">
            +{rewards.toFixed(2)}
          </div>
          <div className="text-pink-400/80 text-xs">Rewards</div>
          
          <div className="mt-1 text-purple-200 text-sm font-mono">
            {apr}% APR
          </div>
        </div>
      </div>
      
      {/* Energy Waves */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 border border-purple-400/30 rounded-full"
          animate={{
            scale: [1, 1.5, 2],
            opacity: [0.6, 0.3, 0],
          }}
          transition={{
            duration: 3,
            delay: i * 1,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};

export default {
  FuturisticDataCube,
  NeuralNetworkSphere,
  FuturisticTreasuryVault,
  QuantumStakingPortal,
};
