"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Wallet, ArrowUpRight } from 'lucide-react';
import { QuantumCard, QuantumButton } from '../quantum-effects';

export default function StakingSimulator() {
  const [balance, setBalance] = useState(1000);
  const [staked, setStaked] = useState(0);
  const [apy, setApy] = useState(5.0);
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    // Dynamic APY simulation
    const interval = setInterval(() => {
      setApy(prev => Math.max(2, Math.min(15, prev + (Math.random() - 0.5))));
    }, 3000);

    // Earnings calculation
    const earningInterval = setInterval(() => {
      if (staked > 0) {
        setEarnings(prev => prev + (staked * (apy / 100) / 365 / 24 / 60)); // Per minute earnings simulation
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(earningInterval);
    };
  }, [staked, apy]);

  const handleStake = () => {
    if (balance >= 100) {
      setBalance(prev => prev - 100);
      setStaked(prev => prev + 100);
    }
  };

  const handleUnstake = () => {
    if (staked >= 100) {
      setStaked(prev => prev - 100);
      setBalance(prev => prev + 100);
    }
  };

  const handleClaim = () => {
    setBalance(prev => prev + earnings);
    setEarnings(0);
  };

  return (
    <QuantumCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold flex items-center gap-2">
          <Wallet className="w-5 h-5 text-green-400" />
          Nexus Vault
        </h3>
        <div className="flex items-center gap-1 px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-bold">
          <TrendingUp className="w-3 h-3" />
          {apy.toFixed(2)}% APY
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 text-center">
          <p className="text-xs text-slate-400 mb-1">Available</p>
          <p className="text-xl font-bold text-white">{Math.floor(balance)}</p>
        </div>
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/5" />
          <p className="text-xs text-slate-400 mb-1">Staked</p>
          <p className="text-xl font-bold text-blue-400">{staked}</p>
        </div>
      </div>

      <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">Pending Earnings</p>
          <p className="text-lg font-bold text-yellow-400">+{earnings.toFixed(4)}</p>
        </div>
        <QuantumButton size="sm" onClick={handleClaim} disabled={earnings < 0.01}>
          Claim
        </QuantumButton>
      </div>

      <div className="flex gap-3">
        <QuantumButton 
          variant="secondary" 
          className="flex-1"
          onClick={handleUnstake}
          disabled={staked < 100}
        >
          Unstake
        </QuantumButton>
        <QuantumButton 
          variant="primary" 
          className="flex-1"
          onClick={handleStake}
          disabled={balance < 100}
        >
          Stake (+100)
        </QuantumButton>
      </div>
    </QuantumCard>
  );
}
