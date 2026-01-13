'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

interface NeuralConnection {
  from: { x: number; y: number };
  to: { x: number; y: number };
  strength: number;
  pulsePhase: number;
}

export const QuantumBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const connectionsRef = useRef<NeuralConnection[]>([]);
  const animationFrameRef = useRef<number>();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      const particles: Particle[] = [];
      const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 15000));

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          id: i,
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          color: `hsl(${Math.random() * 60 + 260}, 70%, 60%)`, // Purple to blue range
          life: Math.random() * 100,
          maxLife: Math.random() * 100 + 100,
        });
      }

      particlesRef.current = particles;
    };

    // Initialize neural connections
    const initConnections = () => {
      const connections: NeuralConnection[] = [];
      const nodeCount = 8;
      const nodes: { x: number; y: number }[] = [];

      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
        });
      }

      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          if (Math.random() > 0.6) {
            connections.push({
              from: nodes[i],
              to: nodes[j],
              strength: Math.random() * 0.5 + 0.5,
              pulsePhase: Math.random() * Math.PI * 2,
            });
          }
        }
      }

      connectionsRef.current = connections;
    };

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach((particle: Particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Reset particle if it exceeds max life
        if (particle.life > particle.maxLife) {
          particle.life = 0;
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
        }

        const opacity = Math.sin((particle.life / particle.maxLife) * Math.PI);
        ctx.globalAlpha = opacity * 0.8;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw neural connections
      const time = Date.now() * 0.001;
      connectionsRef.current.forEach((connection: NeuralConnection) => {
        const pulse = Math.sin(time * 2 + connection.pulsePhase) * 0.5 + 0.5;
        ctx.globalAlpha = connection.strength * pulse * 0.3;
        ctx.strokeStyle = '#8B5CF6';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(connection.from.x, connection.from.y);
        ctx.lineTo(connection.to.x, connection.to.y);
        ctx.stroke();

        // Draw nodes
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = '#3B82F6';
        ctx.beginPath();
        ctx.arc(connection.from.x, connection.from.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(connection.to.x, connection.to.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    initParticles();
    initConnections();
    animate();
    setTimeout(() => {
      setIsLoaded((prev: boolean) => true);
    }, 2000);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
      />
      <div className={`absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
};

export const QuantumLoader: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900"
    >
      <div className="relative">
        <motion.div
          className="w-32 h-32 border-4 border-purple-500 rounded-full"
          style={{
            borderTopColor: 'transparent',
            borderRightColor: 'transparent',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-0 w-32 h-32 border-4 border-blue-500 rounded-full"
          style={{
            borderBottomColor: 'transparent',
            borderLeftColor: 'transparent',
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">{Math.round(progress)}%</div>
            <div className="text-sm text-purple-400">Initializing Quantum Systems</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const QuantumButton: React.FC<{
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent) => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}> = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, loading = false, className = '' }) => {
  const baseClasses = 'relative overflow-hidden font-medium rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95';
  
  const variantClasses: Record<string, string> = {
    primary: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40',
    secondary: 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg shadow-slate-500/25 hover:shadow-slate-500/40',
    danger: 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40',
  };

  const sizeClasses: Record<string, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full hover:translate-x-full transition-transform duration-1000" />
      {loading ? (
        <div className="flex items-center justify-center">
          <motion.div
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};

export const QuantumCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  glowColor?: 'purple' | 'blue' | 'green' | 'gold' | 'red';
}> = ({ children, className = '', glowColor = 'purple' }) => {
  const glowColors: Record<string, string> = {
    purple: 'shadow-purple-500/25 hover:shadow-purple-500/40',
    blue: 'shadow-blue-500/25 hover:shadow-blue-500/40',
    green: 'shadow-green-500/25 hover:shadow-green-500/40',
    gold: 'shadow-yellow-500/25 hover:shadow-yellow-500/40',
    red: 'shadow-red-500/25 hover:shadow-red-500/40',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`relative bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 transition-all duration-300 shadow-lg ${glowColors[glowColor]} ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl pointer-events-none" />
      {children}
    </motion.div>
  );
};

export const QuantumProgressBar: React.FC<{
  value: number;
  max: number;
  label?: string;
  color?: 'purple' | 'blue' | 'green' | 'gold' | 'red';
  showPercentage?: boolean;
  height?: number;
  className?: string;
}> = ({ value, max, label, color = 'purple', showPercentage = true, height = 3, className = '' }) => {
  const percentage = Math.min((value / max) * 100, 100);

  const colorClasses: Record<string, string> = {
    purple: 'bg-gradient-to-r from-purple-500 to-purple-600',
    blue: 'bg-gradient-to-r from-blue-500 to-blue-600',
    green: 'bg-gradient-to-r from-green-500 to-green-600',
    gold: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    red: 'bg-gradient-to-r from-red-500 to-red-600',
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-300">{label}</span>
          {showPercentage && (
            <span className="text-sm text-slate-400">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-slate-700/50 rounded-full overflow-hidden`} style={{ height: `${height * 0.25}rem` }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full ${colorClasses[color]} relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full hover:translate-x-full transition-transform duration-1000" />
        </motion.div>
      </div>
    </div>
  );
};

export const FloatingParticles: React.FC<{ count?: number }> = ({ count = 20 }) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-30"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export const QuantumGlow: React.FC<{
  children: React.ReactNode;
  color?: 'purple' | 'blue' | 'green' | 'gold' | 'red';
  intensity?: 'low' | 'medium' | 'high';
}> = ({ children, color = 'purple', intensity = 'medium' }) => {
  const intensityClasses: Record<string, string> = {
    low: 'shadow-lg',
    medium: 'shadow-2xl',
    high: 'shadow-3xl',
  };

  const colorClasses: Record<string, string> = {
    purple: 'shadow-purple-500/50',
    blue: 'shadow-blue-500/50',
    green: 'shadow-green-500/50',
    gold: 'shadow-yellow-500/50',
    red: 'shadow-red-500/50',
  };

  return (
    <div className={`relative ${intensityClasses[intensity]} ${colorClasses[color]}`}>
      <div className="absolute inset-0 blur-xl opacity-50 bg-gradient-to-r from-purple-500 to-blue-500" />
      <div className="relative">{children}</div>
    </div>
  );
};
