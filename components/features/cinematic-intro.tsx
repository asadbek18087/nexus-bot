"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CinematicIntro() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if intro has been shown this session
    const hasShown = sessionStorage.getItem('nexus_intro_shown');
    if (hasShown) {
      setIsVisible(false);
      return;
    }

    // Play intro
    const timer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('nexus_intro_shown', 'true');
    }, 4000); // 4 seconds intro

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
      >
        <div className="relative">
          {/* Main Logo Animation */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 tracking-tighter"
          >
            NEXUS
          </motion.div>
          
          {/* Scanning Line Effect */}
          <motion.div 
            initial={{ left: '-100%' }}
            animate={{ left: '200%' }}
            transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
            className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
          />

          {/* Subtitle */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="text-center mt-4 text-slate-400 tracking-[1em] text-sm md:text-xl font-light uppercase"
          >
            Quantum Apex
          </motion.div>
        </div>

        {/* Background Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              scale: 0 
            }}
            animate={{ 
              y: [null, Math.random() * window.innerHeight],
              scale: [0, Math.random() * 2, 0],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2 
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
