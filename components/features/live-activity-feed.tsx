"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Trophy, 
  Star, 
  Zap, 
  Users, 
  Gamepad2,
  BookOpen,
  Gift,
  TrendingUp,
  Clock,
  Filter
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'achievement' | 'social' | 'game' | 'learning' | 'reward' | 'milestone';
  user: {
    name: string;
    avatar: string;
    level: number;
  };
  action: string;
  details: string;
  timestamp: Date;
  metadata?: {
    score?: number;
    xp?: number;
    coins?: number;
    rank?: number;
  };
  reactions: {
    likes: number;
    comments: number;
    shares: number;
  };
}

const LiveActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'achievement',
        user: {
          name: 'Alex Chen',
          avatar: '👨‍💻',
          level: 42
        },
        action: 'unlocked achievement',
        details: 'Speed Demon - Completed 5 quizzes in under 2 minutes',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        metadata: {
          xp: 500,
          coins: 100
        },
        reactions: {
          likes: 24,
          comments: 5,
          shares: 2
        }
      },
      {
        id: '2',
        type: 'game',
        user: {
          name: 'Sarah Miller',
          avatar: '👩‍🎮',
          level: 38
        },
        action: 'set new high score',
        details: '2048 Game - Reached the 4096 tile!',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        metadata: {
          score: 45000,
          rank: 3
        },
        reactions: {
          likes: 45,
          comments: 12,
          shares: 8
        }
      },
      {
        id: '3',
        type: 'social',
        user: {
          name: 'Mike Johnson',
          avatar: '🧑‍🚀',
          level: 25
        },
        action: 'completed challenge with',
        details: 'Team Nexus - Conquered the Daily Team Challenge',
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
        metadata: {
          xp: 300
        },
        reactions: {
          likes: 18,
          comments: 3,
          shares: 1
        }
      },
      {
        id: '4',
        type: 'learning',
        user: {
          name: 'Emma Davis',
          avatar: '👩‍🔬',
          level: 51
        },
        action: 'mastered new skill',
        details: 'Advanced JavaScript - Completed with 98% accuracy',
        timestamp: new Date(Date.now() - 12 * 60 * 1000),
        metadata: {
          xp: 750,
          coins: 200
        },
        reactions: {
          likes: 67,
          comments: 15,
          shares: 10
        }
      },
      {
        id: '5',
        type: 'reward',
        user: {
          name: 'Tom Wilson',
          avatar: '🦸',
          level: 33
        },
        action: 'won rare reward',
        details: 'Legendary Avatar Frame from Daily Spin',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        reactions: {
          likes: 92,
          comments: 20,
          shares: 15
        }
      },
      {
        id: '6',
        type: 'milestone',
        user: {
          name: 'Lisa Anderson',
          avatar: '👑',
          level: 60
        },
        action: 'reached milestone',
        details: 'Level 60 - Joined the Elite Circle',
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        metadata: {
          xp: 1000,
          coins: 500
        },
        reactions: {
          likes: 156,
          comments: 42,
          shares: 25
        }
      },
      {
        id: '7',
        type: 'game',
        user: {
          name: 'Chris Taylor',
          avatar: '🎯',
          level: 29
        },
        action: 'achieved perfect run',
        details: 'Memory Match - Completed in 15 seconds',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        metadata: {
          score: 10000
        },
        reactions: {
          likes: 33,
          comments: 7,
          shares: 4
        }
      },
      {
        id: '8',
        type: 'achievement',
        user: {
          name: 'Nina Patel',
          avatar: '🌟',
          level: 45
        },
        action: 'earned badge',
        details: 'Quiz Master - Answered 100 questions correctly',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        metadata: {
          xp: 600
        },
        reactions: {
          likes: 78,
          comments: 18,
          shares: 12
        }
      }
    ];

    // Simulate loading
    const timer = setTimeout(() => {
      setActivities(mockActivities);
      setIsLoading(false);
    }, 1000);

    // Simulate live updates
    const interval = setInterval(() => {
      const newActivity: Activity = {
        id: Date.now().toString(),
        type: ['achievement', 'social', 'game', 'learning', 'reward'][Math.floor(Math.random() * 5)] as Activity['type'],
        user: {
          name: ['You', 'Friend', 'Rival'][Math.floor(Math.random() * 3)],
          avatar: ['😎', '🤓', '😊'][Math.floor(Math.random() * 3)],
          level: Math.floor(Math.random() * 50) + 1
        },
        action: 'performed action',
        details: 'Something amazing happened!',
        timestamp: new Date(),
        reactions: {
          likes: Math.floor(Math.random() * 100),
          comments: Math.floor(Math.random() * 30),
          shares: Math.floor(Math.random() * 20)
        }
      };
      
      setActivities(prev => [newActivity, ...prev].slice(0, 20));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'achievement': return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'social': return <Users className="w-5 h-5 text-blue-500" />;
      case 'game': return <Gamepad2 className="w-5 h-5 text-purple-500" />;
      case 'learning': return <BookOpen className="w-5 h-5 text-green-500" />;
      case 'reward': return <Gift className="w-5 h-5 text-pink-500" />;
      case 'milestone': return <Star className="w-5 h-5 text-orange-500" />;
      default: return <Zap className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(a => a.type === filter);

  const filterOptions = [
    { value: 'all', label: 'All Activity', icon: <TrendingUp className="w-4 h-4" /> },
    { value: 'achievement', label: 'Achievements', icon: <Trophy className="w-4 h-4" /> },
    { value: 'social', label: 'Social', icon: <Users className="w-4 h-4" /> },
    { value: 'game', label: 'Games', icon: <Gamepad2 className="w-4 h-4" /> },
    { value: 'learning', label: 'Learning', icon: <BookOpen className="w-4 h-4" /> },
    { value: 'reward', label: 'Rewards', icon: <Gift className="w-4 h-4" /> }
  ];

  return (
    <div className="bg-gray-900 rounded-xl p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-2">
          <Clock className="w-8 h-8 text-blue-500" />
          Live Activity Feed
        </h2>
        <div className="flex items-center gap-2 text-green-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Live</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {filterOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              filter === option.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        <AnimatePresence>
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            filteredActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-all"
              >
                <div className="flex items-start gap-3">
                  {/* User Avatar */}
                  <div className="relative">
                    <div className="text-2xl">{activity.user.avatar}</div>
                    <div className="absolute -bottom-1 -right-1 bg-gray-700 rounded-full px-1 text-xs font-bold text-white">
                      {activity.user.level}
                    </div>
                  </div>

                  {/* Activity Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-white">
                          <span className="font-semibold">{activity.user.name}</span>
                          <span className="text-gray-400 mx-1">{activity.action}</span>
                          {activity.details}
                        </p>
                        
                        {/* Metadata */}
                        {activity.metadata && (
                          <div className="flex items-center gap-3 mt-2 text-sm">
                            {activity.metadata.xp && (
                              <span className="text-purple-400 flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                {activity.metadata.xp} XP
                              </span>
                            )}
                            {activity.metadata.coins && (
                              <span className="text-yellow-400 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                {activity.metadata.coins} coins
                              </span>
                            )}
                            {activity.metadata.score && (
                              <span className="text-blue-400 flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                {activity.metadata.score.toLocaleString()} pts
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Activity Icon */}
                      <div className="ml-4">
                        {getActivityIcon(activity.type)}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                      
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors">
                          <Heart className="w-4 h-4" />
                          <span className="text-xs">{activity.reactions.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-xs">{activity.reactions.comments}</span>
                        </button>
                        <button className="flex items-center gap-1 text-gray-400 hover:text-green-400 transition-colors">
                          <Share2 className="w-4 h-4" />
                          <span className="text-xs">{activity.reactions.shares}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {!isLoading && filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <Filter className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No activities found for this filter</p>
        </div>
      )}
    </div>
  );
};

export default LiveActivityFeed;