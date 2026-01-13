"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, Clock, TrendingUp, Trophy } from 'lucide-react';

const Leaderboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'global' | 'friends' | 'weekly'>('global');
  
  const leaders = [
    { rank: 1, name: 'Phoenix', avatar: '🔥', points: 45230, level: 85, trend: 'up' },
    { rank: 2, name: 'ThunderBolt', avatar: '⚡', points: 42150, level: 82, trend: 'up' },
    { rank: 3, name: 'IceQueen', avatar: '👸', points: 39800, level: 79, trend: 'down' },
    { rank: 4, name: 'ShadowNinja', avatar: '🥷', points: 37200, level: 76, trend: 'up' },
    { rank: 5, name: 'DragonMaster', avatar: '🐉', points: 35100, level: 74, trend: 'same' },
  ];

  return (
    <div className="bg-gray-900 rounded-xl p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
        <Trophy className="w-8 h-8 text-yellow-500" />
        Leaderboard
      </h2>
      
      <div className="flex gap-2 mb-6">
        {['global', 'friends', 'weekly'].map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab as any)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
              selectedTab === tab
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {leaders.map((leader, index) => (
          <motion.div
            key={leader.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gray-800 rounded-lg p-4 flex items-center gap-4 ${
              leader.rank <= 3 ? 'border-2 border-yellow-500' : ''
            }`}
          >
            <div className={`text-2xl font-bold ${
              leader.rank === 1 ? 'text-yellow-400' :
              leader.rank === 2 ? 'text-gray-300' :
              leader.rank === 3 ? 'text-orange-400' :
              'text-gray-500'
            }`}>
              #{leader.rank}
            </div>
            <div className="text-3xl">{leader.avatar}</div>
            <div className="flex-1">
              <p className="text-white font-semibold">{leader.name}</p>
              <p className="text-gray-400 text-sm">Level {leader.level}</p>
            </div>
            <div className="text-right">
              <p className="text-white font-bold">{leader.points.toLocaleString()}</p>
              <p className="text-gray-400 text-sm">points</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
