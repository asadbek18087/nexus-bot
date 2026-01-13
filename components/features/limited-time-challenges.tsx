"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trophy, Zap, Target, Star, Lock, CheckCircle } from 'lucide-react';

interface Challenge {
  id: number;
  title: string;
  description: string;
  reward: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | '???';
  category: string;
  progress: number;
  maxProgress: number;
  timeLeft: number; // in hours
  completed: boolean;
  locked: boolean;
}

const LimitedTimeChallenges: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 1,
      title: "Speed Demon",
      description: "Complete 5 quizzes in under 2 minutes each",
      reward: "500 XP + Rare Badge",
      difficulty: "Hard",
      category: "Quiz",
      progress: 2,
      maxProgress: 5,
      timeLeft: 12,
      completed: false,
      locked: false
    },
    {
      id: 2,
      title: "Social Butterfly",
      description: "Connect with 10 new friends",
      reward: "300 XP + Avatar Frame",
      difficulty: "Medium",
      category: "Social",
      progress: 7,
      maxProgress: 10,
      timeLeft: 18,
      completed: false,
      locked: false
    },
    {
      id: 3,
      title: "Game Master",
      description: "Achieve high score in 3 different games",
      reward: "1000 XP + Exclusive Title",
      difficulty: "Hard",
      category: "Gaming",
      progress: 1,
      maxProgress: 3,
      timeLeft: 24,
      completed: false,
      locked: false
    },
    {
      id: 4,
      title: "Quick Learner",
      description: "Complete 2 courses with 90%+ accuracy",
      reward: "400 XP + Certificate",
      difficulty: "Medium",
      category: "Learning",
      progress: 0,
      maxProgress: 2,
      timeLeft: 8,
      completed: false,
      locked: false
    },
    {
      id: 5,
      title: "Daily Streak",
      description: "Login for 7 consecutive days",
      reward: "200 XP + Streak Bonus",
      difficulty: "Easy",
      category: "Daily",
      progress: 5,
      maxProgress: 7,
      timeLeft: 48,
      completed: false,
      locked: false
    },
    {
      id: 6,
      title: "Mystery Challenge",
      description: "Complete this secret challenge",
      reward: "???",
      difficulty: "???",
      category: "Special",
      progress: 0,
      maxProgress: 1,
      timeLeft: 72,
      completed: false,
      locked: true
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [timeFilter, setTimeFilter] = useState<'all' | 'urgent' | 'day'>('all');

  useEffect(() => {
    const timer = setInterval(() => {
      setChallenges(prev => prev.map(challenge => {
        if (challenge.timeLeft > 0 && !challenge.completed) {
          return { ...challenge, timeLeft: challenge.timeLeft - 0.1 };
        }
        return challenge;
      }));
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const formatTimeLeft = (hours: number) => {
    if (hours < 1) {
      const minutes = Math.floor(hours * 60);
      return `${minutes}m`;
    }
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-400';
      default: return 'text-purple-400';
    }
  };

  const getProgressPercentage = (progress: number, maxProgress: number) => {
    return (progress / maxProgress) * 100;
  };

  const filteredChallenges = challenges.filter(challenge => {
    const categoryMatch = selectedCategory === 'All' || challenge.category === selectedCategory;
    let timeMatch = true;
    
    if (timeFilter === 'urgent') {
      timeMatch = challenge.timeLeft <= 12;
    } else if (timeFilter === 'day') {
      timeMatch = challenge.timeLeft <= 24;
    }
    
    return categoryMatch && timeMatch;
  });

  const categories = ['All', 'Quiz', 'Social', 'Gaming', 'Learning', 'Daily', 'Special'];

  return (
    <div className="bg-gray-900 rounded-xl p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-2">
          <Clock className="w-8 h-8 text-orange-500" />
          Limited Time Challenges
        </h2>
        <div className="flex items-center gap-2 text-orange-400">
          <Zap className="w-5 h-5" />
          <span className="font-semibold">Active: {challenges.filter(c => !c.completed && !c.locked).length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => setTimeFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              timeFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setTimeFilter('day')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              timeFilter === 'day'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {'< 1d'}
          </button>
          <button
            onClick={() => setTimeFilter('urgent')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              timeFilter === 'urgent'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {'< 12h'}
          </button>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredChallenges.map(challenge => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`relative bg-gray-800 rounded-lg p-4 border-2 transition-all ${
                challenge.locked
                  ? 'border-gray-700 opacity-75'
                  : challenge.completed
                  ? 'border-green-500'
                  : challenge.timeLeft <= 12
                  ? 'border-red-500'
                  : 'border-gray-700'
              }`}
            >
              {/* Lock Overlay */}
              {challenge.locked && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-90 rounded-lg flex items-center justify-center z-10">
                  <Lock className="w-12 h-12 text-gray-600" />
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">
                    {challenge.locked ? '???' : challenge.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {challenge.locked ? 'Complete previous challenges to unlock' : challenge.description}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </div>
              </div>

              {/* Progress */}
              {!challenge.locked && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white font-medium">
                      {challenge.progress}/{challenge.maxProgress}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${getProgressPercentage(challenge.progress, challenge.maxProgress)}%` }}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                    />
                  </div>
                </div>
              )}

              {/* Reward */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-300">{challenge.reward}</span>
                </div>
                {challenge.completed && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>

              {/* Time Left */}
              {!challenge.locked && (
                <div className={`flex items-center gap-2 text-sm font-medium ${
                  challenge.timeLeft <= 12 ? 'text-red-400' : 'text-gray-400'
                }`}>
                  <Clock className="w-4 h-4" />
                  {formatTimeLeft(challenge.timeLeft)}
                </div>
              )}

              {/* Action Button */}
              {!challenge.locked && !challenge.completed && (
                <button className="w-full mt-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all">
                  Start Challenge
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredChallenges.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No challenges found for the selected filters</p>
        </div>
      )}
    </div>
  );
};

export default LimitedTimeChallenges;