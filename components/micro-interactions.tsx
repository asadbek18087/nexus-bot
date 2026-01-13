"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MicroInteractionProps {
  children: React.ReactNode;
  type?: 'hover' | 'click' | 'focus' | 'loading';
  scale?: number;
  glow?: boolean;
  sound?: boolean;
}

export function MicroInteraction({ 
  children, 
  type = 'hover', 
  scale = 1.05,
  glow = true,
  sound = false 
}: MicroInteractionProps) {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    if (sound) {
      // Play click sound
      const audio = new Audio('/sounds/click.mp3');
      audio.volume = 0.1;
      audio.play().catch(() => {});
    }
    
    // Ripple effect
    setIsActive(true);
    setTimeout(() => setIsActive(false), 600);
  };

  const variants = {
    hover: {
      whileHover: { scale: scale },
      whileTap: { scale: 0.95 },
      transition: { type: "spring", stiffness: 400, damping: 17 }
    },
    click: {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
      onClick: handleClick,
      transition: { type: "spring", stiffness: 400, damping: 17 }
    },
    focus: {
      whileFocus: { scale: scale },
      transition: { type: "spring", stiffness: 400, damping: 17 }
    },
    loading: {
      animate: { scale: [1, 1.05, 1] },
      transition: { duration: 2, repeat: Infinity }
    }
  };

  return (
    <motion.div
      {...variants[type]}
      className={`relative ${isActive ? 'animate-pulse' : ''}`}
    >
      {glow && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-xl -z-10" />
      )}
      {children}
      {isActive && (
        <motion.span
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0 rounded-lg bg-white"
        />
      )}
    </motion.div>
  );
}

// Loading skeleton with shimmer effect
export function ShimmerSkeleton({ 
  width = '100%', 
  height = '20px', 
  className = '' 
}: {
  width?: string;
  height?: string;
  className?: string;
}) {
  return (
    <div 
      className={`relative overflow-hidden bg-slate-800 rounded-lg ${className}`}
      style={{ width, height }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-600 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

// Smooth page transition component
export function PageTransition({ 
  children, 
  direction = 'forward' 
}: { 
  children: React.ReactNode; 
  direction?: 'forward' | 'backward';
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={direction}
        initial={{ 
          opacity: 0, 
          x: direction === 'forward' ? 20 : -20,
          filter: 'blur(4px)'
        }}
        animate={{ 
          opacity: 1, 
          x: 0,
          filter: 'blur(0px)'
        }}
        exit={{ 
          opacity: 0, 
          x: direction === 'forward' ? -20 : 20,
          filter: 'blur(4px)'
        }}
        transition={{ 
          duration: 0.3,
          ease: "easeInOut"
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Floating action button with magnet effect
export function FloatingActionButton({ 
  icon, 
  onClick, 
  position = 'bottom-right' 
}: {
  icon: React.ReactNode;
  onClick: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}) {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  return (
    <motion.button
      onClick={onClick}
      className={`fixed ${positionClasses[position]} z-50 w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg flex items-center justify-center text-white`}
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {icon}
    </motion.button>
  );
}

// Progress ring with animated fill
export function ProgressRing({ 
  progress, 
  size = 120, 
  strokeWidth = 8,
  color = 'purple'
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const colors = {
    purple: '#a855f7',
    blue: '#3b82f6',
    green: '#10b981',
    yellow: '#eab308'
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-slate-700"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors[color as keyof typeof colors] || colors.purple}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeInOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-white">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}

// Magnetic button that follows cursor slightly
export function MagneticButton({ 
  children, 
  onClick, 
  className = '' 
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.2;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.2;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.5 }}
      />
    </motion.button>
  );
}
