"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { QuantumButton } from '../quantum-effects';

interface ZenModeProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export default function ZenMode({ isEnabled, onToggle }: ZenModeProps) {
  // Floating toggle button logic
  return (
    <div className="fixed bottom-4 right-4 z-[60]">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onToggle(!isEnabled)}
        className={`p-3 rounded-full shadow-lg backdrop-blur-md transition-all ${
          isEnabled 
            ? 'bg-purple-500 text-white shadow-purple-500/50' 
            : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700'
        }`}
      >
        {isEnabled ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
      </motion.button>
      
      <AnimatePresence>
        {isEnabled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950 z-[50] pointer-events-none"
            style={{ 
              maskImage: 'radial-gradient(circle at center, transparent 100px, black 100%)',
              WebkitMaskImage: 'radial-gradient(circle at center, transparent 100px, black 100%)'
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
