"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Hammer, Zap, Gem, Timer, Coins, Loader2 } from 'lucide-react';
import { QuantumButton, QuantumCard, QuantumProgressBar } from '@/components/quantum-effects';
import { motion, AnimatePresence } from 'framer-motion';
import { useSecureEconomyStore } from '@/stores/secureEconomyStore';
import { getMiningFarm, upgradeMiningFarm } from '@/actions/content';

export default function MiningPage() {
  const router = useRouter();
  const { coins, refreshBalance } = useSecureEconomyStore();
  const [farm, setFarm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMining, setIsMining] = useState(false);
  const [minedItems, setMinedItems] = useState<Array<{id: number, x: number, y: number, value: number}>>([]);
  const [minutesLeft, setMinutesLeft] = useState(0);

  // Fetch Farm Data
  useEffect(() => {
    async function loadFarm() {
      try {
        const data = await getMiningFarm("123456789"); // TODO: Use real Telegram ID
        setFarm(data);
      } catch (error) {
        console.error("Failed to load mining farm:", error);
      } finally {
        setLoading(false);
      }
    }
    loadFarm();
  }, []);

  // Passive mining calculation
  useEffect(() => {
    if (!farm?.lastCollected) return;

    const interval = setInterval(() => {
      const now = new Date();
      const last = new Date(farm.lastCollected);
      const diff = Math.floor((now.getTime() - last.getTime()) / (1000 * 60));
      
      // Example: 1 hour cycle
      if (diff >= 60) {
        setMinutesLeft(0);
      } else {
        setMinutesLeft(60 - diff);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [farm]);

  const handleUpgrade = async () => {
    if (!farm) return;
    const cost = farm.level * 100;
    if (coins < cost) return;

    try {
      const res = await upgradeMiningFarm("123456789");
      if (res.success) {
        refreshBalance("123456789");
        // Reload farm
        const updated = await getMiningFarm("123456789");
        setFarm(updated);
      }
    } catch (error) {
      console.error("Upgrade failed:", error);
    }
  };

  const handleMine = async (e: React.MouseEvent) => {
    // Visual effect only for now, real claiming is passive or via API
    setIsMining(true);
    setTimeout(() => setIsMining(false), 200);

    // Click effect
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newItem = { id: Date.now(), x, y, value: 1 };
    setMinedItems(prev => [...prev, newItem]);
    setTimeout(() => {
      setMinedItems(prev => prev.filter(item => item.id !== newItem.id));
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 pb-20 md:pb-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pt-4 container mx-auto max-w-4xl">
        <QuantumButton onClick={() => router.back()} size="sm" variant="secondary">
          <ChevronLeft className="w-5 h-5" />
        </QuantumButton>
        <h1 className="text-2xl font-bold text-white">Crystal Mining</h1>
      </div>

      <div className="container mx-auto max-w-lg text-center">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <QuantumCard glowColor="purple" className="p-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Gem className="w-5 h-5 text-purple-400" />
              <span className="text-2xl font-bold text-white">{farm?.totalCollected || 0}</span>
            </div>
            <p className="text-xs text-slate-400">Total Mined</p>
          </QuantumCard>
          <QuantumCard glowColor="blue" className="p-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-blue-400" />
              <span className="text-2xl font-bold text-white">{farm?.level || 1}</span>
            </div>
            <p className="text-xs text-slate-400">Farm Level</p>
            <div className="mt-2 text-xs text-slate-500">
              {farm?.xpPerHour || 10} XP/Hour
            </div>
          </QuantumCard>
        </div>

        {/* Mining Area */}
        <div className="relative mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-64 h-64 mx-auto bg-slate-900/50 rounded-full border-4 border-purple-500/30 flex items-center justify-center cursor-pointer relative overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.2)]"
            onClick={handleMine}
          >
            {/* Crystal Rock */}
            <div className={`relative z-10 transition-transform duration-100 ${isMining ? 'scale-95' : ''}`}>
              <Gem className="w-32 h-32 text-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
            </div>
            
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 animate-pulse" />
          </motion.div>

          {/* Floating Numbers */}
          <AnimatePresence>
            {minedItems.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 1, y: 0, x: 0 }}
                animate={{ opacity: 0, y: -100 }}
                exit={{ opacity: 0 }}
                className="absolute left-1/2 top-1/2 pointer-events-none text-2xl font-bold text-white z-20"
                style={{ marginLeft: (Math.random() - 0.5) * 100, marginTop: -50 }}
              >
                +{item.value}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Upgrades */}
        <div className="text-left">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Hammer className="w-5 h-5 text-yellow-400" />
            Upgrades
          </h3>
          <div className="space-y-3">
            <QuantumCard className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white">Upgrade Farm</h4>
                <p className="text-xs text-slate-400">Level {farm?.level + 1} (+10 XP/hr)</p>
              </div>
              <QuantumButton 
                size="sm" 
                onClick={handleUpgrade}
                disabled={coins < (farm?.level * 100)}
              >
                Buy ({farm?.level * 100} <Coins className="w-3 h-3 inline ml-1"/>)
              </QuantumButton>
            </QuantumCard>
          </div>
        </div>
      </div>
    </div>
  );
}
