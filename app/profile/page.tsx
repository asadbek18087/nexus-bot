"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, User, Trophy, Zap, Target, Star, Shield, Settings, Award, TrendingUp, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { QuantumCard, QuantumButton, QuantumProgressBar } from '@/components/quantum-effects';
import BackgroundAudio from '@/components/background-audio';
import EyeTrackingEffect from '@/components/eye-tracking-effect';

interface UserStats {
  username: string;
  level: number;
  xp: number;
  xpToNext: number;
  gold: number;
  energy: number;
  maxEnergy: number;
  rank: string;
  avatar: string;
  joinDate: string;
  totalPlayTime: string;
  achievements: number;
  totalAchievements: number;
  subscription: string;
  referralCode: string;
  downloadsToday: number;
  aiUsageToday: number;
  limits: {
    downloads: number;
    ai: number;
  };
  dna: {
    agility: number;
    intelligence: number;
    charisma: number;
    luck: number;
    wisdom: number;
  };
  stats: {
    gamesPlayed: number;
    quizzesCompleted: number;
    battlesWon: number;
    socialConnections: number;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const [userStats, setUserStats] = useState<UserStats>({
    username: 'QuantumPlayer',
    level: 24,
    xp: 8420,
    xpToNext: 1000,
    gold: 1250,
    energy: 85,
    maxEnergy: 100,
    rank: 'Diamond',
    avatar: '👤',
    joinDate: '2024-01-15',
    totalPlayTime: '142h 35m',
    achievements: 28,
    totalAchievements: 50,
    subscription: 'Standard',
    referralCode: 'NEXUS-8842',
    downloadsToday: 2,
    aiUsageToday: 5,
    limits: {
      downloads: 10,
      ai: 20
    },
    dna: {
      agility: 75,
      intelligence: 88,
      charisma: 62,
      luck: 45,
      wisdom: 91
    },
    stats: {
      gamesPlayed: 342,
      quizzesCompleted: 156,
      battlesWon: 127,
      socialConnections: 89
    }
  });

  const [activeSection, setActiveSection] = useState<'overview' | 'achievements' | 'dna'>('overview');

  const achievements = [
    { id: 1, name: 'First Victory', description: 'Win your first battle', icon: '🏆', unlocked: true },
    { id: 2, name: 'Quiz Master', description: 'Complete 100 quizzes', icon: '🧠', unlocked: true },
    { id: 3, name: 'Social Butterfly', description: 'Make 50 friends', icon: '🦋', unlocked: true },
    { id: 4, name: 'Speed Demon', description: 'Complete a game in under 1 minute', icon: '⚡', unlocked: false },
    { id: 5, name: 'Perfectionist', description: 'Get 100% accuracy in a quiz', icon: '💯', unlocked: false },
    { id: 6, name: 'Legend', description: 'Reach level 50', icon: '👑', unlocked: false }
  ];

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-cyan-950/20 to-blue-950/20" />
      <div className="absolute inset-0">
        {mounted && Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
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
      <header className="relative z-20 bg-slate-900/80 backdrop-blur-lg border-b border-cyan-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <QuantumButton onClick={() => router.back()} size="sm" variant="secondary">
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden md:inline ml-1">Back</span>
            </QuantumButton>
            
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Profile Center
            </h1>

            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Settings className="w-6 h-6 text-slate-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <QuantumCard glowColor="blue" className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-4xl shadow-lg shadow-cyan-500/30">
                  {userStats.avatar}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold mb-2">{userStats.username}</h2>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-400 mb-2">
                    <span className="flex items-center gap-1 bg-slate-800/50 px-3 py-1 rounded-full">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      {userStats.rank}
                    </span>
                    <span className="bg-slate-800/50 px-3 py-1 rounded-full">Level {userStats.level}</span>
                    <span className="bg-slate-800/50 px-3 py-1 rounded-full">ID: {userStats.referralCode}</span>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs">
                    <span className={`px-2 py-0.5 rounded border ${userStats.subscription === 'Premium' ? 'border-yellow-500 text-yellow-400' : 'border-slate-600 text-slate-400'}`}>
                      {userStats.subscription} Plan
                    </span>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <div className="text-3xl font-bold text-cyan-400 mb-1">{userStats.xp.toLocaleString()}</div>
                  <div className="text-sm text-slate-400">Total XP</div>
                </div>
              </div>

              {/* XP Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Level Progress</span>
                  <span>{userStats.xp} / {userStats.xpToNext}</span>
                </div>
                <QuantumProgressBar value={userStats.xp} max={userStats.xpToNext} color="blue" height={6} />
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center bg-slate-800/30 p-3 rounded-xl border border-slate-700/50">
                  <div className="text-2xl font-bold text-yellow-400">{userStats.gold.toLocaleString()}</div>
                  <div className="text-xs text-slate-400">Gold Balance</div>
                </div>
                <div className="text-center bg-slate-800/30 p-3 rounded-xl border border-slate-700/50">
                  <div className="text-2xl font-bold text-blue-400">{userStats.energy}/{userStats.maxEnergy}</div>
                  <div className="text-xs text-slate-400">Energy</div>
                </div>
                <div className="text-center bg-slate-800/30 p-3 rounded-xl border border-slate-700/50">
                  <div className="text-2xl font-bold text-green-400">{userStats.downloadsToday}/{userStats.limits.downloads}</div>
                  <div className="text-xs text-slate-400">Daily Downloads</div>
                </div>
                <div className="text-center bg-slate-800/30 p-3 rounded-xl border border-slate-700/50">
                  <div className="text-2xl font-bold text-purple-400">{userStats.aiUsageToday}/{userStats.limits.ai}</div>
                  <div className="text-xs text-slate-400">AI Credits</div>
                </div>
              </div>
            </QuantumCard>
          </motion.div>

          {/* Section Tabs */}
          <div className="flex gap-4 mb-8">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'achievements', label: 'Achievements', icon: Award },
              { id: 'dna', label: 'DNA Stats', icon: Zap }
            ].map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeSection === section.id
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800/80'
                }`}
              >
                <section.icon className="w-5 h-5" />
                {section.label}
              </button>
            ))}
          </div>

          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Activity Stats */}
              <QuantumCard glowColor="blue" className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Activity Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Games Played</span>
                    <span className="font-bold text-xl">{userStats.stats.gamesPlayed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Quizzes Completed</span>
                    <span className="font-bold text-xl">{userStats.stats.quizzesCompleted}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Battles Won</span>
                    <span className="font-bold text-xl">{userStats.stats.battlesWon}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Social Connections</span>
                    <span className="font-bold text-xl">{userStats.stats.socialConnections}</span>
                  </div>
                </div>
              </QuantumCard>

              {/* Recent Achievements */}
              <QuantumCard glowColor="purple" className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-400" />
                  Recent Achievements
                </h3>
                <div className="space-y-3">
                  {achievements.filter(a => a.unlocked).slice(0, 3).map(achievement => (
                    <div key={achievement.id} className="flex items-center gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <p className="font-medium">{achievement.name}</p>
                        <p className="text-sm text-slate-400">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </QuantumCard>

              {/* Performance Metrics */}
              <QuantumCard glowColor="green" className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-400" />
                  Performance
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Win Rate</span>
                      <span>74%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '74%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Quiz Accuracy</span>
                      <span>87%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Daily Goal</span>
                      <span>92%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>
                </div>
              </QuantumCard>

              {/* Rank Progress */}
              <QuantumCard glowColor="gold" className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-yellow-400" />
                  Rank Progress
                </h3>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-yellow-400 mb-2">{userStats.rank}</div>
                  <p className="text-slate-400">Current Rank</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Next Rank: Master</span>
                    <span>2,580 XP to go</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>
              </QuantumCard>
            </div>
          )}

          {/* Achievements Section */}
          {activeSection === 'achievements' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map(achievement => (
                <QuantumCard 
                  key={achievement.id}
                  glowColor={achievement.unlocked ? 'gold' : 'red'}
                  className={`p-6 ${achievement.unlocked ? '' : 'opacity-50'}`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{achievement.icon}</div>
                    <h4 className="font-bold mb-2">{achievement.name}</h4>
                    <p className="text-sm text-slate-400 mb-3">{achievement.description}</p>
                    {achievement.unlocked ? (
                      <span className="text-green-400 font-medium">✓ Unlocked</span>
                    ) : (
                      <span className="text-slate-500 font-medium">🔒 Locked</span>
                    )}
                  </div>
                </QuantumCard>
              ))}
            </div>
          )}

          {/* DNA Stats Section */}
          {activeSection === 'dna' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <QuantumCard glowColor="blue" className="p-8">
                <h3 className="text-xl font-bold mb-6 text-center">DNA Analysis</h3>
                <div className="space-y-6">
                  {Object.entries(userStats.dna).map(([stat, value]) => (
                    <div key={stat}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="capitalize font-medium flex items-center gap-2">
                          {stat === 'agility' && <Target className="w-4 h-4 text-red-400" />}
                          {stat === 'intelligence' && <Zap className="w-4 h-4 text-blue-400" />}
                          {stat === 'charisma' && <Star className="w-4 h-4 text-purple-400" />}
                          {stat === 'luck' && <Trophy className="w-4 h-4 text-yellow-400" />}
                          {stat === 'wisdom' && <Shield className="w-4 h-4 text-green-400" />}
                          {stat}
                        </span>
                        <span className="font-bold">{value}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            stat === 'agility' ? 'bg-red-500' :
                            stat === 'intelligence' ? 'bg-blue-500' :
                            stat === 'charisma' ? 'bg-purple-500' :
                            stat === 'luck' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </QuantumCard>

              {/* DNA Traits */}
              <QuantumCard glowColor="purple" className="p-8">
                <h3 className="text-xl font-bold mb-6 text-center">Trait Analysis</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <h4 className="font-bold text-blue-400 mb-2">Intellectual Type</h4>
                    <p className="text-sm text-slate-400">
                      Your exceptional intelligence and wisdom scores indicate a strategic mind. 
                      You excel at puzzles and complex challenges.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <h4 className="font-bold text-red-400 mb-2">Combat Style</h4>
                    <p className="text-sm text-slate-400">
                      High agility with balanced defense makes you a versatile fighter. 
                      Quick reflexes are your greatest asset.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <h4 className="font-bold text-purple-400 mb-2">Social Profile</h4>
                    <p className="text-sm text-slate-400">
                      Moderate charisma suggests you&apos;re selective in social interactions. 
                      Your luck could use some improvement!
                    </p>
                  </div>
                </div>
              </QuantumCard>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
