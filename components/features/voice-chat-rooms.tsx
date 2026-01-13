"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Users, 
  MessageCircle, 
  Settings,
  Video,
  VideoOff,
  ScreenShare,
  Hand,
  Smile,
  MoreVertical
} from 'lucide-react';

interface VoiceRoomMember {
  id: string;
  name: string;
  avatar: string;
  isSpeaking: boolean;
  isMuted: boolean;
  isDeafened: boolean;
  role: 'host' | 'moderator' | 'speaker' | 'listener';
}

const VoiceChatRooms: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [currentRoom, setCurrentRoom] = useState('General Lounge');
  
  const [members, setMembers] = useState<VoiceRoomMember[]>([
    {
      id: '1',
      name: 'Alex Chen',
      avatar: '👨‍💻',
      isSpeaking: false,
      isMuted: false,
      isDeafened: false,
      role: 'host'
    },
    {
      id: '2',
      name: 'Sarah Miller',
      avatar: '👩‍🎮',
      isSpeaking: true,
      isMuted: false,
      isDeafened: false,
      role: 'speaker'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      avatar: '🧑‍🚀',
      isSpeaking: false,
      isMuted: true,
      isDeafened: false,
      role: 'listener'
    },
    {
      id: '4',
      name: 'Emma Davis',
      avatar: '👩‍🔬',
      isSpeaking: false,
      isMuted: false,
      isDeafened: true,
      role: 'listener'
    }
  ]);

  const rooms = [
    'General Lounge',
    'Study Group',
    'Gaming Squad',
    'Music Jam',
    'Tech Talk',
    'Casual Chat'
  ];

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setMembers(prev => prev.map(member => 
      member.id === '1' ? { ...member, isMuted: !isMuted } : member
    ));
  };

  const toggleDeafen = () => {
    setIsDeafened(!isDeafened);
    if (!isDeafened) {
      setIsMuted(true);
    }
    setMembers(prev => prev.map(member => 
      member.id === '1' ? { ...member, isMuted: !isDeafened ? true : member.isMuted, isDeafened: !isDeafened } : member
    ));
  };

  const getRoleColor = (role: VoiceRoomMember['role']) => {
    switch (role) {
      case 'host': return 'text-purple-400';
      case 'moderator': return 'text-blue-400';
      case 'speaker': return 'text-green-400';
      case 'listener': return 'text-gray-400';
    }
  };

  const getRoleBadge = (role: VoiceRoomMember['role']) => {
    switch (role) {
      case 'host': return '👑';
      case 'moderator': return '🛡️';
      case 'speaker': return '🎤';
      case 'listener': return '';
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-2">
          <Mic className="w-8 h-8 text-blue-500" />
          Voice Chat Rooms
        </h2>
        <button
          onClick={() => setIsConnected(!isConnected)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            isConnected 
              ? 'bg-red-600 text-white hover:bg-red-700' 
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isConnected ? 'Disconnect' : 'Connect'}
        </button>
      </div>

      {isConnected ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Room List */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Rooms</h3>
            <div className="space-y-2">
              {rooms.map(room => (
                <button
                  key={room}
                  onClick={() => setCurrentRoom(room)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    currentRoom === room
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{room}</span>
                    <Users className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Room Area */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{currentRoom}</h3>
                <div className="flex items-center gap-2">
                  <button className="p-2 bg-gray-700 rounded-lg text-gray-300 hover:bg-gray-600 transition-all">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Members Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {members.map(member => (
                  <div
                    key={member.id}
                    className={`bg-gray-700 rounded-lg p-4 ${
                      member.isSpeaking ? 'ring-2 ring-green-500' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="text-3xl">{member.avatar}</div>
                        {member.isSpeaking && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium">{member.name}</p>
                          <span className={getRoleColor(member.role)}>
                            {getRoleBadge(member.role)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {member.isMuted && <MicOff className="w-3 h-3 text-red-400" />}
                          {member.isDeafened && <Volume2 className="w-3 h-3 text-red-400" />}
                          <span className={`text-xs ${getRoleColor(member.role)}`}>
                            {member.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Voice Controls */}
              <div className="flex items-center justify-center gap-4">
                <button className="p-3 bg-gray-700 rounded-lg text-gray-300 hover:bg-gray-600 transition-all">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-3 bg-gray-700 rounded-lg text-gray-300 hover:bg-gray-600 transition-all">
                  <ScreenShare className="w-5 h-5" />
                </button>
                <button
                  onClick={toggleMute}
                  className={`p-4 rounded-lg transition-all ${
                    isMuted 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>
                <button
                  onClick={toggleDeafen}
                  className={`p-3 rounded-lg transition-all ${
                    isDeafened 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {isDeafened ? <Volume2 className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <button className="p-3 bg-gray-700 rounded-lg text-gray-300 hover:bg-gray-600 transition-all">
                  <Hand className="w-5 h-5" />
                </button>
                <button className="p-3 bg-gray-700 rounded-lg text-gray-300 hover:bg-gray-600 transition-all">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-gray-800 rounded-lg p-3 text-gray-300 hover:bg-gray-700 transition-all flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Text Channel
              </button>
              <button className="bg-gray-800 rounded-lg p-3 text-gray-300 hover:bg-gray-700 transition-all flex items-center justify-center gap-2">
                <Smile className="w-5 h-5" />
                Soundboard
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <MicOff className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Connect to join voice chat rooms</p>
          <button
            onClick={() => setIsConnected(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all"
          >
            Connect Now
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceChatRooms;
