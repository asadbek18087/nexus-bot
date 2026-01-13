"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footprints, Trophy, Zap } from 'lucide-react';
import { QuantumCard, QuantumButton } from '../quantum-effects';

export default function StepCounter() {
  const [steps, setSteps] = useState(0);
  const [goal] = useState(10000);
  const [isSupported, setIsSupported] = useState(false);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    // Check if DeviceMotion is supported
    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      setIsSupported(true);
      
      let lastX = 0, lastY = 0, lastZ = 0;
      let sensitivity = 15; // Threshold for step detection

      const handleMotion = (event: DeviceMotionEvent) => {
        const { x, y, z } = event.accelerationIncludingGravity || { x: 0, y: 0, z: 0 };
        if (!x || !y || !z) return;

        const delta = Math.abs(x - lastX) + Math.abs(y - lastY) + Math.abs(z - lastZ);

        if (delta > sensitivity) {
          setSteps(prev => {
            const newSteps = prev + 1;
            // Check for milestones
            if (newSteps % 1000 === 0) {
              setShowReward(true);
              setTimeout(() => setShowReward(false), 3000);
            }
            return newSteps;
          });
        }

        lastX = x;
        lastY = y;
        lastZ = z;
      };

      window.addEventListener('devicemotion', handleMotion);
      return () => window.removeEventListener('devicemotion', handleMotion);
    } else {
      // Simulation for desktop testing
      const interval = setInterval(() => {
        setSteps(prev => prev + Math.floor(Math.random() * 2)); // Simulate occasional steps
      }, 2000);
      return () => clearInterval(interval);
    }
  }, []);

  const progress = Math.min((steps / goal) * 100, 100);

  return (
    <QuantumCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold text-sm">Daily Steps</h3>
        <Footprints className="w-4 h-4 text-blue-400" />
      </div>
      
      <div className="relative mb-3">
        <div className="w-full bg-slate-800 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((steps / goal) * 100, 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-slate-400">{steps.toLocaleString()}</span>
          <span className="text-xs text-slate-400">{goal.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-center">
          <p className="text-lg font-bold text-white">{steps}</p>
          <p className="text-xs text-slate-400">steps</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-green-400">{Math.floor((steps / goal) * 100)}%</p>
          <p className="text-xs text-slate-400">progress</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-yellow-400">{Math.floor((goal - steps) / 100)}</p>
          <p className="text-xs text-slate-400">to go</p>
        </div>
      </div>

      {steps >= goal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-3 p-2 bg-green-500/20 rounded-lg border border-green-500/30"
        >
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-green-300">Goal achieved!</span>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute -top-2 -right-2 bg-yellow-500 text-slate-900 rounded-full p-2"
          >
            <Zap className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-4 flex gap-2">
        <QuantumButton size="sm" variant="secondary" className="flex-1 text-xs">
          <Zap className="w-3 h-3 mr-1" /> Boost
        </QuantumButton>
        <div className="text-xs text-slate-500 flex items-center px-2">
          {isSupported ? 'Tracking Active' : 'Simulation Mode'}
        </div>
      </div>
    </QuantumCard>
  );
}
