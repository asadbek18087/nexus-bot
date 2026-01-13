"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Swords, Target, Trophy, Users, Zap, Timer, Shield, Heart } from 'lucide-react';
import Link from 'next/link';
import { QuantumButton, QuantumCard, QuantumProgressBar } from '@/components/quantum-effects';
import BackgroundAudio from '@/components/background-audio';
import EyeTrackingEffect from '@/components/eye-tracking-effect';
import { motion, AnimatePresence } from 'framer-motion';

export default function BattlePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'challenges' | 'arena'>('challenges');
  const [findingMatch, setFindingMatch] = useState(false);
  const [battleStarted, setBattleStarted] = useState(false);
  const [currentTurn, setCurrentTurn] = useState<'player' | 'enemy'>('player');
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [playerStats, setPlayerStats] = useState({ health: 100, energy: 100, attack: 25, defense: 15 });
  const [enemyStats, setEnemyStats] = useState({ health: 100, energy: 100, attack: 20, defense: 10 });
  const [battleResult, setBattleResult] = useState<'victory' | 'defeat' | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const dailyChallenges = [
    { id: 1, title: 'Speed Reader', description: 'Read 3 articles in Library', progress: 1, total: 3, reward: '50 XP', icon: '📚' },
    { id: 2, title: 'Quiz Whiz', description: 'Score 100% in a Hard Quiz', progress: 0, total: 1, reward: '100 XP', icon: '🧠' },
    { id: 3, title: 'Socialite', description: 'Refer 1 new operative', progress: 0, total: 1, reward: '200 Gold', icon: '🤝' },
  ];

  const handleFindMatch = () => {
    setFindingMatch(true);
    setTimeout(() => {
      setFindingMatch(false);
      setBattleStarted(true);
    }, 2000);
  };

  const addToBattleLog = (message: string) => {
    setBattleLog(prev => [...prev, message]);
  };

  const handleAttack = () => {
    if (currentTurn !== 'player' || playerStats.energy < 20) return;
    const damage = Math.max(1, playerStats.attack - enemyStats.defense + Math.floor(Math.random() * 10));
    const newEnemyHealth = Math.max(0, enemyStats.health - damage);
    setEnemyStats(prev => ({ ...prev, health: newEnemyHealth }));
    setPlayerStats(prev => ({ ...prev, energy: prev.energy - 20 }));
    addToBattleLog(`You dealt ${damage} damage!`);
    if (newEnemyHealth === 0) handleVictory();
    else {
      setCurrentTurn('enemy');
      setTimeout(enemyAttack, 1500);
    }
  };

  const enemyAttack = () => {
    const damage = Math.max(1, enemyStats.attack - playerStats.defense + Math.floor(Math.random() * 8));
    const newPlayerHealth = Math.max(0, playerStats.health - damage);
    setPlayerStats(prev => ({ ...prev, health: newPlayerHealth }));
    setEnemyStats(prev => ({ ...prev, energy: Math.min(100, prev.energy + 15) }));
    addToBattleLog(`Enemy dealt ${damage} damage!`);
    if (newPlayerHealth === 0) handleDefeat();
    else setCurrentTurn('player');
  };

  const handleVictory = () => setBattleResult('victory');
  const handleDefeat = () => setBattleResult('defeat');
  const resetBattle = () => {
    setBattleStarted(false);
    setBattleResult(null);
    setPlayerStats({ health: 100, energy: 100, attack: 25, defense: 15 });
    setEnemyStats({ health: 100, energy: 100, attack: 20, defense: 10 });
    setBattleLog([]);
    setCurrentTurn('player');
  };

  if (battleStarted) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-4">
        {/* Battle Interface (simplified from previous version) */}
        <div className="max-w-4xl mx-auto pt-8">
          <div className="flex justify-between items-center mb-8">
             <QuantumButton onClick={() => setBattleStarted(false)} size="sm" variant="secondary"><ChevronLeft className="w-4 h-4"/> Retreat</QuantumButton>
             <h1 className="text-2xl font-bold text-red-500">Battle In Progress</h1>
             <div/>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Player */}
             <QuantumCard glowColor="blue" className="p-6">
                <h3 className="text-xl font-bold mb-4 text-blue-400">You</h3>
                <div className="mb-2">Health: {playerStats.health}/100</div>
                <QuantumProgressBar value={playerStats.health} max={100} color="green" height={8} />
                <div className="mt-4 grid grid-cols-2 gap-2">
                   <QuantumButton onClick={handleAttack} disabled={currentTurn !== 'player' || playerStats.energy < 20}>Attack</QuantumButton>
                   <QuantumButton variant="secondary" disabled>Defend</QuantumButton>
                </div>
             </QuantumCard>

             {/* Enemy */}
             <QuantumCard glowColor="red" className="p-6">
                <h3 className="text-xl font-bold mb-4 text-red-400">Enemy</h3>
                <div className="mb-2">Health: {enemyStats.health}/100</div>
                <QuantumProgressBar value={enemyStats.health} max={100} color="red" height={8} />
             </QuantumCard>
          </div>

          <div className="mt-8 bg-slate-900/50 p-4 rounded-xl h-48 overflow-y-auto border border-slate-800">
             {battleLog.map((log, i) => <div key={i} className="text-slate-400 text-sm mb-1">{log}</div>)}
          </div>

          {battleResult && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
               <QuantumCard className="p-8 text-center">
                  <h2 className="text-4xl font-bold mb-4">{battleResult === 'victory' ? 'Victory!' : 'Defeat'}</h2>
                  <QuantumButton onClick={resetBattle}>Return to Arena</QuantumButton>
               </QuantumCard>
            </div>
          )}
        </div>
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
        <h1 className="text-2xl font-bold text-white">Battle Arena</h1>
      </div>

      <div className="container mx-auto max-w-4xl">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('challenges')}
            className={`pb-4 px-4 font-medium transition-colors relative ${
              activeTab === 'challenges' ? 'text-red-500' : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Daily Ops
            </div>
            {activeTab === 'challenges' && (
              <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('arena')}
            className={`pb-4 px-4 font-medium transition-colors relative ${
              activeTab === 'arena' ? 'text-red-500' : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Swords className="w-5 h-5" />
              PvP Arena
            </div>
            {activeTab === 'arena' && (
              <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
            )}
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'challenges' && (
            <motion.div
              key="challenges"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 p-6 rounded-2xl border border-red-500/20 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">Daily Operations</h2>
                    <p className="text-slate-400 text-sm">Complete tasks to earn rewards</p>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-700">
                    <Timer className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-mono text-yellow-500">14:32:45</span>
                  </div>
                </div>
                <QuantumProgressBar value={1} max={3} color="red" height={8} />
                <p className="text-right text-xs text-red-400 mt-2">1/3 Completed</p>
              </div>

              <div className="grid gap-4">
                {dailyChallenges.map((challenge) => (
                  <QuantumCard key={challenge.id} className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-2xl">
                      {challenge.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white">{challenge.title}</h3>
                      <p className="text-sm text-slate-400">{challenge.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-yellow-400 font-bold text-sm block mb-1">{challenge.reward}</span>
                      <div className="w-24">
                        <QuantumProgressBar value={challenge.progress} max={challenge.total} color="blue" height={4} />
                      </div>
                    </div>
                  </QuantumCard>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'arena' && (
            <motion.div
              key="arena"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center py-8"
            >
              <div className="mb-12">
                <div className="w-32 h-32 mx-auto bg-red-500/10 rounded-full flex items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" />
                  <Swords className="w-16 h-16 text-red-500 relative z-10" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Live PvP Battles</h2>
                <p className="text-slate-400 max-w-md mx-auto">
                  Challenge other operatives in real-time quiz battles. Wager gold and climb the global ranks.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
                <QuantumCard className="p-6">
                  <Trophy className="w-8 h-8 text-yellow-500 mb-4" />
                  <h3 className="font-bold text-white mb-1">Ranked Match</h3>
                  <p className="text-xs text-slate-400">Compete for seasonal rewards</p>
                </QuantumCard>
                <QuantumCard className="p-6">
                  <Users className="w-8 h-8 text-blue-500 mb-4" />
                  <h3 className="font-bold text-white mb-1">Friend Duel</h3>
                  <p className="text-xs text-slate-400">Challenge a specific user</p>
                </QuantumCard>
                <QuantumCard className="p-6">
                  <Shield className="w-8 h-8 text-green-500 mb-4" />
                  <h3 className="font-bold text-white mb-1">Practice</h3>
                  <p className="text-xs text-slate-400">Train with AI opponents</p>
                </QuantumCard>
              </div>

              <QuantumButton 
                size="lg" 
                className="w-full md:w-auto px-12 py-4 text-lg"
                onClick={handleFindMatch}
                disabled={findingMatch}
              >
                {findingMatch ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Scanning Sector...
                  </span>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Find Opponent
                  </>
                )}
              </QuantumButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
