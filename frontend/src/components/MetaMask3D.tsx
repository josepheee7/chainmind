import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Environment, Box, Cylinder, Torus } from '@react-three/drei';
import * as THREE from 'three';

// MetaMask-exact 3D Container with mouse tracking
interface MetaMask3DContainerProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  perspective?: number;
}

export const MetaMask3DContainer: React.FC<MetaMask3DContainerProps> = ({
  children,
  className = '',
  intensity = 1,
  perspective = 1000
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        setMousePosition({ x: x * intensity, y: y * intensity });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [intensity]);

  return (
    <motion.div
      ref={containerRef}
      className={`transform-gpu ${className}`}
      style={{
        transform: `perspective(${perspective}px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg)`
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
};

// MetaMask-exact 3D Card component
interface MetaMask3DCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  hoverScale?: number;
}

export const MetaMask3DCard: React.FC<MetaMask3DCardProps> = ({
  children,
  className = '',
  glowColor = 'orange-500',
  hoverScale = 1.05
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        setMousePosition({ x, y });
      }
    };

    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 });
    };

    if (cardRef.current) {
      cardRef.current.addEventListener('mousemove', handleMouseMove);
      cardRef.current.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (cardRef.current) {
        cardRef.current.removeEventListener('mousemove', handleMouseMove);
        cardRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className={`relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 group overflow-hidden ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${mousePosition.y * 8}deg) rotateY(${mousePosition.x * 8}deg)`
      }}
      whileHover={{ 
        scale: hoverScale,
        boxShadow: `0 20px 40px rgba(249, 115, 22, 0.3)`
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br from-${glowColor}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}></div>
      
      {/* Shine effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)`,
          transform: `translateX(${mousePosition.x * 50}px) translateY(${mousePosition.y * 50}px)`
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

// MetaMask-exact 3D Icon component
interface MetaMask3DIconProps {
  icon: React.ComponentType<any>;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  gradient?: string;
  glowIntensity?: number;
}

export const MetaMask3DIcon: React.FC<MetaMask3DIconProps> = ({
  icon: Icon,
  className = '',
  size = 'md',
  gradient = 'from-orange-500 to-red-500',
  glowIntensity = 0.3
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const iconRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (iconRef.current) {
        const rect = iconRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      ref={iconRef}
      className={`relative ${sizeClasses[size]} bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-xl ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${mousePosition.y * 10}deg) rotateY(${mousePosition.x * 10}deg)`,
        boxShadow: `0 0 ${20 + mousePosition.x * 10}px rgba(249, 115, 22, ${glowIntensity + Math.abs(mousePosition.x) * 0.2})`
      }}
      whileHover={{ 
        scale: 1.1,
        rotateY: 20,
        rotateX: 10,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Icon className={`${iconSizes[size]} text-white drop-shadow-lg`} />
      
      {/* Glow effect */}
      <div 
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-20 blur-md`}
        style={{
          transform: `scale(${1 + Math.abs(mousePosition.x) * 0.2})`
        }}
      />
    </motion.div>
  );
};

// MetaMask-exact Floating Particles component
interface FloatingParticlesProps {
  count?: number;
  color?: string;
  speed?: number;
  size?: number;
  className?: string;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  count = 20,
  color = 'orange-400',
  speed = 1,
  size = 1,
  className = ''
}) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-${size} h-${size} bg-${color} rounded-full opacity-30`}
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
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// MetaMask-exact 3D Neural Network component
const NeuralNode = ({ position, connections }: { position: [number, number, number]; connections: number[] }) => {
  const meshRef = useRef<any>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  return (
    <Sphere ref={meshRef} args={[0.1, 16, 16]} position={position}>
      <MeshDistortMaterial
        color="#f97316"
        attach="material"
        distort={0.2}
        speed={2}
        roughness={0.1}
        metalness={0.8}
        emissive="#f97316"
        emissiveIntensity={0.5}
      />
    </Sphere>
  );
};

interface MetaMask3DNeuralNetworkProps {
  nodeCount?: number;
  radius?: number;
  connectionDensity?: number;
}

export const MetaMask3DNeuralNetwork: React.FC<MetaMask3DNeuralNetworkProps> = ({
  nodeCount = 12,
  radius = 2,
  connectionDensity = 0.3
}) => {
  const groupRef = useRef<any>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.3;
    }
  });

  // Generate node positions
  const nodes = Array.from({ length: nodeCount }, (_, i) => {
    const angle = (i / nodeCount) * Math.PI * 2;
    const height = (Math.random() - 0.5) * 2;
    return [
      Math.cos(angle) * radius,
      height,
      Math.sin(angle) * radius
    ] as [number, number, number];
  });

  // Generate connections
  const connections = nodes.map((_, i) => 
    Array.from({ length: nodeCount }, (_, j) => 
      Math.random() < connectionDensity && i !== j ? j : -1
    ).filter(j => j !== -1)
  );

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.3} floatIntensity={0.2}>
        {/* Central hub */}
        <Sphere args={[0.3, 32, 32]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#8b5cf6"
            attach="material"
            distort={0.3}
            speed={1.5}
            roughness={0.1}
            metalness={0.9}
            emissive="#8b5cf6"
            emissiveIntensity={0.3}
          />
        </Sphere>
        
        {/* Neural nodes */}
        {nodes.map((position, i) => (
          <NeuralNode key={i} position={position} connections={connections[i]} />
        ))}
        
        {/* Connection lines */}
        {connections.map((nodeConnections, i) =>
          nodeConnections.map((j, k) => (
            <Box
              key={`${i}-${j}-${k}`}
              args={[0.02, 0.02, radius]}
              position={[
                (nodes[i][0] + nodes[j][0]) / 2,
                (nodes[i][1] + nodes[j][1]) / 2,
                (nodes[i][2] + nodes[j][2]) / 2
              ]}
              rotation={[
                Math.atan2(nodes[j][1] - nodes[i][1], Math.sqrt((nodes[j][0] - nodes[i][0]) ** 2 + (nodes[j][2] - nodes[i][2]) ** 2)),
                Math.atan2(nodes[j][2] - nodes[i][2], nodes[j][0] - nodes[i][0]),
                0
              ]}
            >
              <MeshDistortMaterial
                color="#64748b"
                attach="material"
                distort={0.1}
                speed={0.5}
                roughness={0.5}
                metalness={0.3}
                opacity={0.6}
                transparent
              />
            </Box>
          ))
        )}
      </Float>
    </group>
  );
};

// MetaMask-exact 3D Data Visualization
interface DataVisualizationProps {
  data?: number[];
  color?: string;
  animationSpeed?: number;
}

export const MetaMask3DDataVisualization: React.FC<DataVisualizationProps> = ({
  data = [1, 2, 3, 4, 5, 6, 7, 8],
  color = '#10b981',
  animationSpeed = 1
}) => {
  const groupRef = useRef<any>(null);
  const barsRef = useRef<any[]>([]);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
    }
    
    barsRef.current.forEach((bar, index) => {
      if (bar && data[index] !== undefined) {
        const targetHeight = data[index] * 0.5;
        const currentHeight = bar.scale.y;
        bar.scale.y = THREE.MathUtils.lerp(currentHeight, targetHeight, 0.02 * animationSpeed);
        
        // Animate color based on height
        const intensity = (data[index] / Math.max(...data)) * 0.5 + 0.5;
        bar.material.emissiveIntensity = intensity;
      }
    });
  });

  return (
    <group ref={groupRef}>
      <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.1}>
        {data.map((value, index) => {
          const angle = (index / data.length) * Math.PI * 2;
          const radius = 1.5;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          
          return (
            <Box
              key={index}
              ref={(el) => { if (el) barsRef.current[index] = el; }}
              args={[0.2, value * 0.5, 0.2]}
              position={[x, value * 0.25, z]}
            >
              <MeshDistortMaterial
                color={color}
                attach="material"
                distort={0.1}
                speed={1}
                roughness={0.2}
                metalness={0.6}
                emissive={color}
                emissiveIntensity={0.3}
              />
            </Box>
          );
        })}
      </Float>
    </group>
  );
};

// MetaMask-exact Button with 3D effects
interface MetaMask3DButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  loading?: boolean;
}

export const MetaMask3DButton: React.FC<MetaMask3DButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const variants = {
    primary: 'from-[#f97316] to-[#ea580c]',
    secondary: 'from-gray-600 to-gray-700',
    success: 'from-green-500 to-green-600',
    danger: 'from-red-500 to-red-600'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        setMousePosition({ x, y });
      }
    };

    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 });
    };

    if (buttonRef.current) {
      buttonRef.current.addEventListener('mousemove', handleMouseMove);
      buttonRef.current.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (buttonRef.current) {
        buttonRef.current.removeEventListener('mousemove', handleMouseMove);
        buttonRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <motion.button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled || loading}
      className={`relative bg-gradient-to-r ${variants[variant]} text-white ${sizes[size]} rounded-2xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 overflow-hidden ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg)`,
        boxShadow: `0 ${10 + Math.abs(mousePosition.y) * 10}px ${20 + Math.abs(mousePosition.x) * 10}px rgba(249, 115, 22, 0.3)`
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Shine effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700"
        style={{
          transform: `translateX(${mousePosition.x * 20 - 100}%) skewX(-12deg)`
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex items-center space-x-2">
        {loading && (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}
        {children}
      </div>
    </motion.button>
  );
};

// MetaMask-exact Loading Spinner with 3D effects
interface MetaMask3DSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export const MetaMask3DSpinner: React.FC<MetaMask3DSpinnerProps> = ({
  size = 'md',
  color = 'orange-500',
  className = ''
}) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <motion.div
      className={`${sizes[size]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <div className={`w-full h-full border-4 border-${color}/30 border-t-${color} rounded-full shadow-lg shadow-${color}/30`} />
    </motion.div>
  );
};

// Export all components
export default {
  MetaMask3DContainer,
  MetaMask3DCard,
  MetaMask3DIcon,
  FloatingParticles,
  MetaMask3DNeuralNetwork,
  MetaMask3DDataVisualization,
  MetaMask3DButton,
  MetaMask3DSpinner
};