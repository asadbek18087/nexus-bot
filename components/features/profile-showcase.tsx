"use client";

import { motion } from 'framer-motion';
import { Award, Shield, Star, Crown, Zap, Flame } from 'lucide-react';
import { QuantumCard } from '../quantum-effects';

interface Badge {
  id: string;
  icon: any;
  name: string;
  color: string;
  unlocked: boolean;
}

export default function ProfileShowcase() {
  const badges: Badge[] = [
    { id: '1', icon: Crown, name: 'King of Nexus', color: 'text-yellow-400', unlocked: true },
    { id: '2', icon: Zap, name: 'Speedster', color: 'text-blue-400', unlocked: true },
    { id: '3', icon: Flame, name: 'Streak Master', color: 'text-orange-400', unlocked: true },
    { id: '4', icon: Shield, name: 'Guardian', color: 'text-green-400', unlocked: false },
    { id: '5', icon: Star, name: 'Rising Star', color: 'text-purple-400', unlocked: true },
    { id: '6', icon: Award, name: 'Scholar', color: 'text-pink-400', unlocked: false },
  ];

  return (
    <QuantumCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-400" />
          Trophy Room
        </h3>
        <span className="text-xs text-slate-400">4/6 Unlocked</span>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          {/* Animated Profile Frame */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-1 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 blur-sm opacity-70"
          />
          <div className="relative w-24 h-24 rounded-full bg-slate-800 border-2 border-yellow-400/50 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
              <span className="text-2xl font-bold text-slate-500">USER</span>
            </div>
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Legendary
          </div>
        </div>
        <h4 className="mt-4 text-white font-bold">Nexus Commander</h4>
        <p className="text-xs text-slate-400">Level 42 • Grandmaster</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {badges.map((badge) => (
          <motion.div
            key={badge.id}
            whileHover={{ scale: 1.05 }}
            className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 border ${
              badge.unlocked 
                ? 'bg-slate-800/50 border-slate-700' 
                : 'bg-slate-900/30 border-slate-800 opacity-50 grayscale'
            }`}
          >
            <badge.icon className={`w-6 h-6 mb-1 ${badge.unlocked ? badge.color : 'text-slate-600'}`} />
            <span className="text-[10px] text-center text-slate-400 leading-tight">
              {badge.name}
            </span>
          </motion.div>
        ))}
      </div>
    </QuantumCard>
  );
}
