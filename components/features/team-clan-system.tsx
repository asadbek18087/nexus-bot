"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Trophy, 
  Star, 
  Zap, 
  Crown, 
  Shield, 
  Sword,
  Target,
  Flame,
  Medal,
  Award,
  TrendingUp,
  X
} from 'lucide-react';

interface Team {
  id: string;
  name: string;
  logo: string;
  members: number;
  maxMembers: number;
  level: number;
  points: number;
  rank: number;
  description: string;
  isJoined: boolean;
  achievements: number;
}

const TeamClanSystem: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: '1',
      name: 'Phoenix Rising',
      logo: '🔥',
      members: 48,
      maxMembers: 50,
      level: 25,
      points: 125000,
      rank: 1,
      description: 'We rise from the ashes and conquer all challenges!',
      isJoined: false,
      achievements: 142
    },
    {
      id: '2',
      name: 'Thunder Bolts',
      logo: '⚡',
      members: 45,
      maxMembers: 50,
      level: 23,
      points: 118000,
      rank: 2,
      description: 'Striking with speed and precision!',
      isJoined: true,
      achievements: 128
    },
    {
      id: '3',
      name: 'Ice Dragons',
      logo: '🐉',
      members: 42,
      maxMembers: 50,
      level: 22,
      points: 112000,
      rank: 3,
      description: 'Frozen in time, mighty in power!',
      isJoined: false,
      achievements: 115
    },
    {
      id: '4',
      name: 'Shadow Ninjas',
      logo: '🥷',
      members: 38,
      maxMembers: 40,
      level: 21,
      points: 105000,
      rank: 4,
      description: 'Silent but deadly!',
      isJoined: false,
      achievements: 102
    },
    {
      id: '5',
      name: 'Cosmic Guardians',
      logo: '🌌',
      members: 35,
      maxMembers: 50,
      level: 20,
      points: 98000,
      rank: 5,
      description: 'Protecting the universe one challenge at a time!',
      isJoined: false,
      achievements: 98
    },
    {
      id: '6',
      name: 'Cyber Warriors',
      logo: '🤖',
      members: 33,
      maxMembers: 40,
      level: 19,
      points: 92000,
      rank: 6,
      description: 'Powered by code, driven by passion!',
      isJoined: false,
      achievements: 89
    }
  ]);

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showCreateTeam, setShowCreateTeam] = useState(false);

  const joinTeam = (teamId: string) => {
    setTeams(prev => prev.map(team => 
      team.id === teamId 
        ? { ...team, isJoined: true, members: team.members + 1 }
        : { ...team, isJoined: false }
    ));
  };

  const leaveTeam = (teamId: string) => {
    setTeams(prev => prev.map(team => 
      team.id === teamId 
        ? { ...team, isJoined: false, members: team.members - 1 }
        : team
    ));
    setSelectedTeam(null);
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-400 border-yellow-400';
      case 2: return 'text-gray-300 border-gray-300';
      case 3: return 'text-orange-400 border-orange-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-gray-300" />;
      case 3: return <Award className="w-5 h-5 text-orange-400" />;
      default: return <Shield className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-2">
          <Users className="w-8 h-8 text-blue-500" />
          Teams & Clans
        </h2>
        <button
          onClick={() => setShowCreateTeam(!showCreateTeam)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          Create Team
        </button>
      </div>

      {/* Leaderboard Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Your Team Rank</p>
          <p className="text-2xl font-bold text-white">#2</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <Star className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Team Points</p>
          <p className="text-2xl font-bold text-white">118,000</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <Zap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Achievements</p>
          <p className="text-2xl font-bold text-white">128</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Weekly Goal</p>
          <p className="text-2xl font-bold text-white">75%</p>
        </div>
      </div>

      {/* Teams List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teams.map((team, index) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative bg-gray-800 rounded-lg p-5 border-2 transition-all hover:border-purple-500 ${
              team.isJoined ? 'border-purple-500' : 'border-gray-700'
            }`}
          >
            {/* Rank Badge */}
            <div className="absolute -top-3 -right-3">
              <div className={`w-12 h-12 rounded-full bg-gray-900 border-2 ${getRankColor(team.rank)} flex items-center justify-center font-bold text-white`}>
                #{team.rank}
              </div>
            </div>

            {/* Team Header */}
            <div className="flex items-start gap-4 mb-3">
              <div className="text-4xl">{team.logo}</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                  {team.name}
                  {team.isJoined && <Flame className="w-5 h-5 text-orange-500" />}
                </h3>
                <p className="text-sm text-gray-400 mb-2">{team.description}</p>
                
                {/* Team Stats */}
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Members</p>
                    <p className="text-white font-medium">{team.members}/{team.maxMembers}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Level</p>
                    <p className="text-white font-medium">{team.level}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Points</p>
                    <p className="text-white font-medium">{team.points.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-300">{team.achievements} Achievements</span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-400">Team Progress</span>
                <span className="text-purple-400 font-medium">Level {team.level}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  style={{ width: `${(team.points % 5000) / 50}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {team.isJoined ? (
                <>
                  <button
                    onClick={() => setSelectedTeam(team)}
                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-all"
                  >
                    View Team
                  </button>
                  <button
                    onClick={() => leaveTeam(team.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all"
                  >
                    Leave
                  </button>
                </>
              ) : team.members < team.maxMembers ? (
                <button
                  onClick={() => joinTeam(team.id)}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all"
                >
                  Join Team
                </button>
              ) : (
                <button disabled className="w-full bg-gray-700 text-gray-400 py-2 rounded-lg font-medium cursor-not-allowed">
                  Team Full
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Team Details Modal */}
      {selectedTeam && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedTeam(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-3xl">{selectedTeam.logo}</span>
                {selectedTeam.name}
              </h3>
              <button
                onClick={() => setSelectedTeam(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-700 rounded-lg p-3">
                <p className="text-gray-400 text-sm mb-1">Team Power</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-xl font-bold text-white">{selectedTeam.points.toLocaleString()}</span>
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <p className="text-gray-400 text-sm mb-1">Win Rate</p>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  <span className="text-xl font-bold text-white">68.5%</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-lg font-semibold text-white mb-2">Recent Activities</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-gray-300">Won Team Battle against Ice Dragons</span>
                  <span className="text-gray-500 ml-auto">2h ago</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-purple-500" />
                  <span className="text-gray-300">Completed Weekly Team Challenge</span>
                  <span className="text-gray-500 ml-auto">5h ago</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-300">New member joined the team</span>
                  <span className="text-gray-500 ml-auto">1d ago</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-all">
                Team Chat
              </button>
              <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-all">
                Team Battles
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default TeamClanSystem;
