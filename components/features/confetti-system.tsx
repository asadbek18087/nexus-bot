"use client";

import { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiSystemProps {
  trigger: boolean;
  duration?: number;
}

export default function ConfettiSystem({ trigger, duration = 3000 }: ConfettiSystemProps) {
  const [isActive, setIsActive] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    if (trigger) {
      setIsActive(true);
      const timer = setTimeout(() => setIsActive(false), duration);
      return () => clearTimeout(timer);
    }
  }, [trigger, duration]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      <ReactConfetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={500}
        gravity={0.3}
      />
    </div>
  );
}
