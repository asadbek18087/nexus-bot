"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Zap, 
  Target, 
  Trophy, 
  Star, 
  Clock, 
  CheckCircle, 
  X,
  TrendingUp,
  Award,
  Flame
} from 'lucide-react';

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  progress: number;
  maxProgress: number;
  rewards: {
    xp: number;
    coins: number;
    items?: string[];
  };
  completed: boolean;
  timeLeft: number; // in hours
}

const QuestSystem: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: '1',
      title: 'Daily Quiz Master',
      description: 'Complete 10 quizzes with 80% accuracy or higher',
      type: 'daily',
      difficulty: 'medium',
      progress: 6,
      maxProgress: 10,
      rewards: {
        xp: 200,
        coins: 50,
        items: ['Quiz Badge']
      },
      completed: false,
      timeLeft: 8
    },
    {
      id: '2',
      title: 'Social Butterfly',
      description: 'Connect with 5 new users and send 10 messages',
      type: 'daily',
      difficulty: 'easy',
      progress: 3,
      maxProgress: 5,
      rewards: {
        xp: 100,
        coins: 25
      },
      completed: false,
      timeLeft: 8
    },
    {
      id: '3',
      title: 'Game Champion',
      description: 'Reach top 10 in any 3 games',
      type: 'weekly',
      difficulty: 'hard',
      progress: 1,
      maxProgress: 3,
      rewards: {
        xp: 500,
        coins: 150,
        items: ['Champion Title', 'Rare Avatar Frame']
      },
      completed: false,
      timeLeft: 72
    },
    {
      id: '4',
      title: 'Learning Streak',
      description: 'Complete lessons for 7 consecutive days',
      type: 'weekly',
      difficulty: 'medium',
      progress: 4,
      maxProgress: 7,
      rewards: {
        xp: 350,
        coins: 100,
        items: ['Streak Badge', 'Energy Boost x2']
      },
      completed: false,
      timeLeft: 72
    },
    {
      id: '5',
      title: 'Treasure Hunter',
      description: 'Find and collect 20 hidden treasures across the platform',
      type: 'monthly',
      difficulty: 'hard',
      progress: 8,
      maxProgress: 20,
      rewards: {
        xp: 1000,
        coins: 300,
        items: ['Treasure Hunter Badge', 'Map Background']
      },
      completed: false,
      timeLeft: 240
    },
    {
      id: '6',
      title: 'Legendary Challenge',
      description: 'Complete all daily quests for 30 days straight',
      type: 'special',
      difficulty: 'legendary',
      progress: 12,
      maxProgress: 30,
      rewards: {
        xp: 5000,
        coins: 1000,
        items: ['Legendary Crown', 'Exclusive Pet', 'Golden Profile Theme']
      },
      completed: false,
      timeLeft: 720
    }
  ]);

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'daily' | 'weekly' | 'monthly' | 'special'>('all');
  const [showCompleted, setShowCompleted] = useState(false);

  const getDifficultyColor = (difficulty: Quest['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 border-green-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'hard': return 'text-red-400 border-red-400';
      case 'legendary': return 'text-purple-400 border-purple-400';
    }
  };

  const getTypeColor = (type: Quest['type']) => {
    switch (type) {
      case 'daily': return 'bg-blue-500';
      case 'weekly': return 'bg-purple-500';
      case 'monthly': return 'bg-orange-500';
      case 'special': return 'bg-gradient-to-r from-yellow-500 to-purple-500';
    }
  };

  const formatTimeLeft = (hours: number) => {
    if (hours < 24) {
      return `${hours}h`;
    }
    const days = Math.floor(hours / 24);
    const h = hours % 24;
    return `${days}d ${h}h`;
  };

  const completeQuest = (questId: string) => {
    setQuests(prev => prev.map(quest => 
      quest.id === questId 
        ? { ...quest, completed: true, progress: quest.maxProgress }
        : quest
    ));
  };

  const claimRewards = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (quest?.completed) {
      // Add rewards to user inventory
      const inventory = JSON.parse(localStorage.getItem('userInventory') || '{}');
      inventory.xp = (inventory.xp || 0) + quest.rewards.xp;
      inventory.coins = (inventory.coins || 0) + quest.rewards.coins;
      inventory.items = [...(inventory.items || []), ...(quest.rewards.items || [])];
      localStorage.setItem('userInventory', JSON.stringify(inventory));
      
      // Remove quest from list
      setQuests(prev => prev.filter(q => q.id !== questId));
    }
  };

  const filteredQuests = quests.filter(quest => {
    const filterMatch = selectedFilter === 'all' || quest.type === selectedFilter;
    const completedMatch = showCompleted || !quest.completed;
    return filterMatch && completedMatch;
  });

  const questStats = {
    total: quests.length,
    completed: quests.filter(q => q.completed).length,
    inProgress: quests.filter(q => !q.completed).length,
    totalRewards: quests.reduce((acc, q) => acc + q.rewards.xp, 0)
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-2">
          <Target className="w-8 h-8 text-purple-500" />
          Quest System
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-orange-400">
            <Flame className="w-5 h-5" />
            <span className="font-semibold">{questStats.inProgress} Active</span>
          </div>
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">{questStats.completed} Done</span>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <p className="text-gray-400 text-sm">Total XP Available</p>
          <p className="text-2xl font-bold text-purple-400">{questStats.totalRewards}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <p className="text-gray-400 text-sm">Completion Rate</p>
          <p className="text-2xl font-bold text-blue-400">
            {Math.round((questStats.completed / questStats.total) * 100)}%
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <p className="text-gray-400 text-sm">Active Quests</p>
          <p className="text-2xl font-bold text-orange-400">{questStats.inProgress}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <p className="text-gray-400 text-sm">Total Quests</p>
          <p className="text-2xl font-bold text-white">{questStats.total}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {(['all', 'daily', 'weekly', 'monthly', 'special'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                selectedFilter === filter
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            showCompleted
              ? 'bg-green-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          {showCompleted ? 'Hide' : 'Show'} Completed
        </button>
      </div>

      {/* Quest List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {filteredQuests.map(quest => (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`relative bg-gray-800 rounded-lg p-5 border-2 ${
                quest.completed ? 'border-green-500' : getDifficultyColor(quest.difficulty)
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 rounded text-xs font-bold text-white ${getTypeColor(quest.type)}`}>
                      {quest.type}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-bold border ${getDifficultyColor(quest.difficulty)}`}>
                      {quest.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{quest.title}</h3>
                  <p className="text-sm text-gray-400">{quest.description}</p>
                </div>
                <div className="flex items-center gap-1 text-orange-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{formatTimeLeft(quest.timeLeft)}</span>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white font-medium">
                    {quest.progress}/{quest.maxProgress}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(quest.progress / quest.maxProgress) * 100}%` }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  />
                </div>
              </div>

              {/* Rewards */}
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Rewards:</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-purple-400">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-medium">{quest.rewards.xp} XP</span>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm font-medium">{quest.rewards.coins} coins</span>
                  </div>
                  {quest.rewards.items && (
                    <div className="flex items-center gap-1 text-blue-400">
                      <Star className="w-4 h-4" />
                      <span className="text-sm font-medium">{quest.rewards.items.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {quest.completed ? (
                  <button
                    onClick={() => claimRewards(quest.id)}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Award className="w-4 h-4" />
                    Claim Rewards
                  </button>
                ) : quest.progress === quest.maxProgress ? (
                  <button
                    onClick={() => completeQuest(quest.id)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Complete Quest
                  </button>
                ) : (
                  <button className="flex-1 bg-gray-700 text-gray-300 py-2 rounded-lg font-medium cursor-not-allowed flex items-center justify-center gap-2">
                    <Target className="w-4 h-4" />
                    In Progress
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredQuests.length === 0 && (
        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No quests found</p>
        </div>
      )}
    </div>
  );
};

export default QuestSystem;
