"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, MessageCircle, MoreVertical } from 'lucide-react';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  level: number;
  lastSeen?: Date;
}

const FriendsList: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([
    { id: '1', name: 'Alex Chen', avatar: '👨‍💻', status: 'online', level: 42 },
    { id: '2', name: 'Sarah Miller', avatar: '👩‍🎮', status: 'away', level: 38, lastSeen: new Date(Date.now() - 30 * 60 * 1000) },
    { id: '3', name: 'Mike Johnson', avatar: '🧑‍🚀', status: 'offline', level: 25, lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: '4', name: 'Emma Davis', avatar: '👩‍🔬', status: 'online', level: 51 },
    { id: '5', name: 'Tom Wilson', avatar: '🦸', status: 'busy', level: 33 },
  ]);

  const getStatusColor = (status: Friend['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      case 'offline': return 'bg-gray-500';
    }
  };

  const getStatusText = (friend: Friend) => {
    if (friend.status === 'offline' && friend.lastSeen) {
      const diff = Date.now() - friend.lastSeen.getTime();
      const minutes = Math.floor(diff / 60000);
      if (minutes < 60) return `Last seen ${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      return `Last seen ${hours}h ago`;
    }
    return friend.status;
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-2">
          <Users className="w-8 h-8 text-blue-500" />
          Friends
        </h2>
        <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-all">
          <UserPlus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        {friends.map((friend, index) => (
          <motion.div
            key={friend.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-lg p-4 flex items-center gap-4 hover:bg-gray-750 transition-all"
          >
            <div className="relative">
              <div className="text-3xl">{friend.avatar}</div>
              <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${getStatusColor(friend.status)}`} />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold">{friend.name}</p>
              <p className="text-gray-400 text-sm">{getStatusText(friend)} • Level {friend.level}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-blue-400 transition-all">
                <MessageCircle className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-all">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {friends.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No friends yet</p>
        </div>
      )}
    </div>
  );
};

export default FriendsList;
