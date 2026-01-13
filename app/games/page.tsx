"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Gamepad2, Trophy, Zap, Coins, Star } from 'lucide-react';
import Link from 'next/link';
import Game2048 from '@/components/game-2048';
import { QuantumCard, QuantumButton } from '@/components/quantum-effects';
import BackgroundAudio from '@/components/background-audio';
import EyeTrackingEffect from '@/components/eye-tracking-effect';

export default function GamesPage() {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [userStats, setUserStats] = useState({
    level: 24,
    xp: 8420,
    gold: 1250,
    highScore: 12580
  });

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
  };

  const handleGameOver = (finalScore: number) => {
    setGameOver(true);
    if (finalScore > userStats.highScore) {
      setUserStats(prev => ({ ...prev, highScore: finalScore }));
    }
    // Calculate rewards
    const xpReward = Math.floor(finalScore / 10);
    const goldReward = Math.floor(finalScore / 5);
    setUserStats(prev => ({
      ...prev,
      xp: prev.xp + xpReward,
      gold: prev.gold + goldReward
    }));
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/20 to-purple-950/20" />
      <div className="absolute inset-0">
        {mounted && Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.2
            }}
          />
        ))}
      </div>

      {/* Audio and Visual Effects */}
      <BackgroundAudio />
      <EyeTrackingEffect />

      {/* Header */}
      <header className="relative z-20 bg-slate-900/80 backdrop-blur-lg border-b border-blue-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 text-blue-400 hover:text-blue-300 transition-colors">
              <ArrowLeft className="w-6 h-6" />
              <span>Back to Home</span>
            </Link>
            
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Gaming Arena
            </h1>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="font-bold">{userStats.xp.toLocaleString()} XP</span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-400" />
                <span className="font-bold">{userStats.gold.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-purple-400" />
                <span className="font-bold">{userStats.highScore.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Game Area */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Gamepad2 className="w-8 h-8 text-blue-400" />
                  <h2 className="text-xl font-bold">2048 Quantum</h2>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Current Score</p>
                    <p className="text-2xl font-bold text-blue-400">{score.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <Game2048 
                onScoreChange={handleScoreChange}
                onGameOver={handleGameOver}
              />
            </motion.div>

            {/* Game Over Modal */}
            {gameOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
              >
                <QuantumCard glowColor="blue" className="p-8 text-center max-w-md">
                  <Trophy className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
                  <h3 className="text-3xl font-bold mb-2">Game Over!</h3>
                  <p className="text-slate-400 mb-4">Final Score: {score.toLocaleString()}</p>
                  {score === userStats.highScore && (
                    <p className="text-green-400 font-bold mb-4">New High Score!</p>
                  )}
                  <QuantumButton 
                    onClick={() => {
                      setGameOver(false);
                      window.location.reload();
                    }}
                    className="w-full"
                  >
                    Play Again
                  </QuantumButton>
                </QuantumCard>
              </motion.div>
            )}
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Player Stats */}
            <QuantumCard glowColor="purple" className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-400" />
                Your Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Level</span>
                  <span className="font-bold">{userStats.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total XP</span>
                  <span className="font-bold">{userStats.xp.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Gold</span>
                  <span className="font-bold text-yellow-400">{userStats.gold.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">High Score</span>
                  <span className="font-bold text-purple-400">{userStats.highScore.toLocaleString()}</span>
                </div>
              </div>
            </QuantumCard>

            {/* Achievements */}
            <QuantumCard glowColor="green" className="p-6">
              <h3 className="text-lg font-bold mb-4">Achievements</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: '🏆', unlocked: true },
                  { icon: '⚡', unlocked: true },
                  { icon: '🎯', unlocked: true },
                  { icon: '🔥', unlocked: false },
                  { icon: '💎', unlocked: false },
                  { icon: '🌟', unlocked: false }
                ].map((achievement, i) => (
                  <div
                    key={i}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-br from-yellow-500 to-orange-500' 
                        : 'bg-slate-800 opacity-50'
                    }`}
                  >
                    {achievement.icon}
                  </div>
                ))}
              </div>
            </QuantumCard>

            {/* Power-ups */}
            <QuantumCard glowColor="red" className="p-6">
              <h3 className="text-lg font-bold mb-4">Power-ups</h3>
              <div className="space-y-2">
                <button className="w-full p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition-colors text-left">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="text-xl">⚡</span>
                      <span>Double Points</span>
                    </span>
                    <span className="text-xs text-red-400">5 left</span>
                  </div>
                </button>
                <button className="w-full p-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 transition-colors text-left">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="text-xl">🔄</span>
                      <span>Undo Move</span>
                    </span>
                    <span className="text-xs text-blue-400">3 left</span>
                  </div>
                </button>
              </div>
            </QuantumCard>
          </div>
        </div>
      </main>
    </div>
  );
}
