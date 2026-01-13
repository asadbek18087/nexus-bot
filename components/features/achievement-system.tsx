"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Trophy, 
  Star, 
  Zap, 
  Lock, 
  Unlock, 
  CheckCircle, 
  Crown,
  Flame,
  Medal,
  Award,
  Gem,
  Rocket
} from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: Date;
  points: number;
  secret?: boolean;
}

const AchievementSystem: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: <Star className="w-8 h-8" />,
      rarity: 'common',
      category: 'Learning',
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      points: 10
    },
    {
      id: '2',
      name: 'Quiz Master',
      description: 'Answer 100 questions correctly',
      icon: <Trophy className="w-8 h-8" />,
      rarity: 'rare',
      category: 'Quiz',
      progress: 76,
      maxProgress: 100,
      unlocked: false,
      points: 50
    },
    {
      id: '3',
      name: 'Speed Demon',
      description: 'Complete a quiz in under 30 seconds',
      icon: <Zap className="w-8 h-8" />,
      rarity: 'epic',
      category: 'Speed',
      progress: 0,
      maxProgress: 1,
      unlocked: false,
      points: 100
    },
    {
      id: '4',
      name: 'Social Butterfly',
      description: 'Connect with 50 friends',
      icon: <Medal className="w-8 h-8" />,
      rarity: 'rare',
      category: 'Social',
      progress: 23,
      maxProgress: 50,
      unlocked: false,
      points: 75
    },
    {
      id: '5',
      name: 'Game Champion',
      description: 'Reach top 3 in 10 different games',
      icon: <Crown className="w-8 h-8" />,
      rarity: 'epic',
      category: 'Gaming',
      progress: 3,
      maxProgress: 10,
      unlocked: false,
      points: 150
    },
    {
      id: '6',
      name: 'Knowledge Seeker',
      description: 'Complete 25 courses',
      icon: <Award className="w-8 h-8" />,
      rarity: 'rare',
      category: 'Learning',
      progress: 18,
      maxProgress: 25,
      unlocked: false,
      points: 60
    },
    {
      id: '7',
      name: 'Legendary Status',
      description: 'Reach level 100',
      icon: <Gem className="w-8 h-8" />,
      rarity: 'legendary',
      category: 'Milestone',
      progress: 42,
      maxProgress: 100,
      unlocked: false,
      points: 500
    },
    {
      id: '8',
      name: 'Streak Master',
      description: 'Maintain a 30-day login streak',
      icon: <Flame className="w-8 h-8" />,
      rarity: 'epic',
      category: 'Daily',
      progress: 15,
      maxProgress: 30,
      unlocked: false,
      points: 200
    },
    {
      id: '9',
      name: 'Secret Achievement',
      description: '?????',
      icon: <Lock className="w-8 h-8" />,
      rarity: 'legendary',
      category: 'Secret',
      progress: 0,
      maxProgress: 1,
      unlocked: false,
      secret: true,
      points: 1000
    },
    {
      id: '10',
      name: 'Early Bird',
      description: 'Complete 5 lessons before 9 AM',
      icon: <Rocket className="w-8 h-8" />,
      rarity: 'common',
      category: 'Daily',
      progress: 2,
      maxProgress: 5,
      unlocked: false,
      points: 25
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUnlocked, setShowUnlocked] = useState<boolean>(true);
  const [showLocked, setShowLocked] = useState<boolean>(true);

  const categories = ['all', 'Learning', 'Quiz', 'Social', 'Gaming', 'Speed', 'Daily', 'Milestone', 'Secret'];

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-800';
      case 'rare': return 'border-blue-400 bg-blue-900';
      case 'epic': return 'border-purple-400 bg-purple-900';
      case 'legendary': return 'border-yellow-400 bg-yellow-900';
    }
  };

  const getRarityGradient = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600';
      case 'rare': return 'from-blue-500 to-blue-600';
      case 'epic': return 'from-purple-500 to-purple-600';
      case 'legendary': return 'from-yellow-500 to-orange-500';
    }
  };

  const getProgressPercentage = (progress: number, maxProgress: number) => {
    return (progress / maxProgress) * 100;
  };

  const filteredAchievements = achievements.filter(achievement => {
    const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory;
    const unlockedMatch = (achievement.unlocked && showUnlocked) || (!achievement.unlocked && showLocked);
    return categoryMatch && unlockedMatch;
  });

  const totalPoints = achievements.reduce((sum, a) => sum + (a.unlocked ? a.points : 0), 0);
  const maxPoints = achievements.reduce((sum, a) => sum + a.points, 0);
  const completionRate = Math.round((achievements.filter(a => a.unlocked).length / achievements.length) * 100);

  return (
    <div className="bg-gray-900 rounded-xl p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Achievement System
        </h2>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-400">Total Points</p>
            <p className="text-xl font-bold text-yellow-400">{totalPoints}/{maxPoints}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Completion</p>
            <p className="text-xl font-bold text-green-400">{completionRate}%</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Unlocked</p>
          <p className="text-2xl font-bold text-white">{achievements.filter(a => a.unlocked).length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <Lock className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Locked</p>
          <p className="text-2xl font-bold text-white">{achievements.filter(a => !a.unlocked).length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Rare+</p>
          <p className="text-2xl font-bold text-white">
            {achievements.filter(a => a.rarity !== 'common' && a.unlocked).length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">In Progress</p>
          <p className="text-2xl font-bold text-white">
            {achievements.filter(a => !a.unlocked && a.progress > 0).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowUnlocked(!showUnlocked)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              showUnlocked
                ? 'bg-green-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Unlocked
          </button>
          <button
            onClick={() => setShowLocked(!showLocked)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              showLocked
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Locked
          </button>
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`relative rounded-lg p-5 border-2 transition-all ${
              achievement.unlocked 
                ? getRarityColor(achievement.rarity)
                : 'bg-gray-800 border-gray-700 opacity-75'
            }`}
          >
            {/* Secret Achievement Overlay */}
            {achievement.secret && !achievement.unlocked && (
              <div className="absolute inset-0 bg-gray-900 bg-opacity-90 rounded-lg flex items-center justify-center z-10">
                <div className="text-center">
                  <Lock className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 font-bold">???</p>
                </div>
              </div>
            )}

            {/* Achievement Icon */}
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 mx-auto ${
              achievement.unlocked 
                ? `bg-gradient-to-br ${getRarityGradient(achievement.rarity)}`
                : 'bg-gray-700'
            }`}>
              <div className={achievement.unlocked ? 'text-white' : 'text-gray-500'}>
                {achievement.unlocked ? achievement.icon : <Lock className="w-8 h-8" />}
              </div>
            </div>

            {/* Achievement Info */}
            <div className="text-center mb-3">
              <h3 className="text-lg font-bold text-white mb-1">
                {achievement.secret && !achievement.unlocked ? '???' : achievement.name}
              </h3>
              <p className="text-sm text-gray-400">
                {achievement.secret && !achievement.unlocked ? 'Complete secret requirements' : achievement.description}
              </p>
            </div>

            {/* Rarity Badge */}
              <div className="flex justify-center mb-3">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                  achievement.unlocked 
                    ? achievement.rarity === 'common' ? 'bg-gray-600 text-gray-300'
                    : achievement.rarity === 'rare' ? 'bg-blue-600 text-blue-100'
                    : achievement.rarity === 'epic' ? 'bg-purple-600 text-purple-100'
                    : 'bg-yellow-600 text-yellow-100'
                    : 'bg-gray-700 text-gray-500'
                }`}>
                  {achievement.secret && !achievement.unlocked ? '???' : achievement.rarity}
                </span>
              </div>

            {/* Progress Bar */}
            {!achievement.unlocked && !achievement.secret && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white font-medium">
                    {achievement.progress}/{achievement.maxProgress}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                    style={{ width: `${getProgressPercentage(achievement.progress, achievement.maxProgress)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Points */}
            <div className="flex items-center justify-center gap-2 text-sm">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className={achievement.unlocked ? 'text-yellow-400' : 'text-gray-500'}>
                {achievement.points} points
              </span>
            </div>

            {/* Unlocked Date */}
            {achievement.unlocked && achievement.unlockedAt && (
              <p className="text-center text-xs text-gray-500 mt-2">
                Unlocked {achievement.unlockedAt.toLocaleDateString()}
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No achievements found for the selected filters</p>
        </div>
      )}
    </div>
  );
};

export default AchievementSystem;
