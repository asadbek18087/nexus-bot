"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Trophy, MessageCircle, Share2, Heart, Star, Send } from 'lucide-react';
import Link from 'next/link';
import { QuantumCard, QuantumButton } from '@/components/quantum-effects';
import BackgroundAudio from '@/components/background-audio';
import EyeTrackingEffect from '@/components/eye-tracking-effect';

interface User {
  id: number;
  username: string;
  level: number;
  avatar: string;
  status: 'online' | 'offline' | 'in-game';
  xp: number;
}

interface Post {
  id: number;
  author: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  liked: boolean;
}

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'friends' | 'posts'>('leaderboard');
  const [userStats, setUserStats] = useState({
    level: 24,
    xp: 8420,
    friends: 156,
    referrals: 12,
    referralCode: 'NEXUS-2471'
  });
  
  const [leaderboard] = useState<User[]>([
    { id: 1, username: 'Phoenix', level: 45, avatar: '🔥', status: 'online', xp: 185000 },
    { id: 2, username: 'Dragon', level: 42, avatar: '🐉', status: 'in-game', xp: 172000 },
    { id: 3, username: 'Thunder', level: 40, avatar: '⚡', status: 'online', xp: 165000 },
    { id: 4, username: 'Shadow', level: 38, avatar: '🌑', status: 'offline', xp: 158000 },
    { id: 5, username: 'Crystal', level: 35, avatar: '💎', status: 'online', xp: 145000 },
    { id: 6, username: 'Ninja', level: 33, avatar: '🥷', status: 'in-game', xp: 138000 },
    { id: 7, username: 'Wizard', level: 31, avatar: '🧙', status: 'online', xp: 131000 },
    { id: 8, username: 'Robot', level: 30, avatar: '🤖', status: 'offline', xp: 127000 }
  ]);

  const [friends] = useState<User[]>([
    { id: 1, username: 'Alex', level: 28, avatar: '🎮', status: 'online', xp: 118000 },
    { id: 2, username: 'Sarah', level: 25, avatar: '🌟', status: 'in-game', xp: 105000 },
    { id: 3, username: 'Mike', level: 26, avatar: '🚀', status: 'online', xp: 110000 },
    { id: 4, username: 'Emma', level: 24, avatar: '🦄', status: 'offline', xp: 98000 },
    { id: 5, username: 'John', level: 27, avatar: '⚔️', status: 'online', xp: 115000 }
  ]);

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: 'Phoenix',
      content: 'Just reached level 45! The grind never stops! 🔥',
      likes: 42,
      comments: 8,
      timestamp: '2 hours ago',
      liked: false
    },
    {
      id: 2,
      author: 'Dragon',
      content: 'New high score in 2048 - 28,450! Can anyone beat it? 🎯',
      likes: 38,
      comments: 12,
      timestamp: '4 hours ago',
      liked: true
    },
    {
      id: 3,
      author: 'Crystal',
      content: 'The quantum effects in this game are absolutely stunning! ✨',
      likes: 56,
      comments: 15,
      timestamp: '6 hours ago',
      liked: false
    }
  ]);

  const [newPost, setNewPost] = useState('');

  const handleLike = (postId: number) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleShareCode = () => {
    navigator.clipboard.writeText(userStats.referralCode);
  };

  const handleCreatePost = () => {
    if (newPost.trim()) {
      const post: Post = {
        id: posts.length + 1,
        author: 'You',
        content: newPost,
        likes: 0,
        comments: 0,
        timestamp: 'Just now',
        liked: false
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-yellow-950/20 to-purple-950/20" />
      <div className="absolute inset-0">
        {mounted && Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-pulse"
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
      <header className="relative z-20 bg-slate-900/80 backdrop-blur-lg border-b border-yellow-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 text-yellow-400 hover:text-yellow-300 transition-colors">
              <ArrowLeft className="w-6 h-6" />
              <span>Back to Home</span>
            </Link>
            
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
              Social Hub
            </h1>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-yellow-400" />
                <span className="font-bold">{userStats.friends} Friends</span>
              </div>
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-purple-400" />
                <span className="font-bold">{userStats.referrals} Referrals</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-slate-800">
            {[
              { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
              { id: 'friends', label: 'Friends', icon: Users },
              { id: 'posts', label: 'Posts', icon: MessageCircle }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 pb-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-yellow-400 text-yellow-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-xl font-bold mb-6">Global Rankings</h2>
                <div className="space-y-3">
                  {leaderboard.map((user, index) => (
                    <QuantumCard 
                      key={user.id} 
                      glowColor={index < 3 ? 'gold' : 'blue'} 
                      className="p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                            index === 0 ? 'bg-yellow-500 text-black' :
                            index === 1 ? 'bg-slate-400 text-black' :
                            index === 2 ? 'bg-orange-700 text-white' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="text-2xl">{user.avatar}</div>
                          <div>
                            <p className="font-bold">{user.username}</p>
                            <p className="text-sm text-slate-400">Level {user.level}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-bold text-purple-400">{user.xp.toLocaleString()} XP</p>
                          <div className="flex items-center gap-1 justify-end">
                            <div className={`w-2 h-2 rounded-full ${
                              user.status === 'online' ? 'bg-green-400' :
                              user.status === 'in-game' ? 'bg-yellow-400' :
                              'bg-slate-600'
                            }`} />
                            <span className="text-xs text-slate-400">{user.status}</span>
                          </div>
                        </div>
                      </div>
                    </QuantumCard>
                  ))}
                </div>
              </div>

              {/* Referral Card */}
              <div>
                <QuantumCard glowColor="purple" className="p-6 mb-6">
                  <h3 className="text-lg font-bold mb-4">Invite Friends</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Share your referral code and earn rewards when friends join!
                  </p>
                  <div 
                    onClick={handleShareCode}
                    className="bg-slate-800/50 p-4 rounded-xl border border-dashed border-slate-700 cursor-pointer hover:border-purple-500 transition-colors mb-4"
                  >
                    <code className="text-xl font-mono font-bold text-purple-400">
                      {userStats.referralCode}
                    </code>
                  </div>
                  <QuantumButton onClick={handleShareCode} className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    Copy Code
                  </QuantumButton>
                </QuantumCard>

                {/* Your Stats */}
                <QuantumCard glowColor="green" className="p-6">
                  <h3 className="text-lg font-bold mb-4">Your Social Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Friends</span>
                      <span className="font-bold">{userStats.friends}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Referrals</span>
                      <span className="font-bold">{userStats.referrals}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Rank</span>
                      <span className="font-bold text-yellow-400">#127</span>
                    </div>
                  </div>
                </QuantumCard>
              </div>
            </div>
          )}

          {/* Friends Tab */}
          {activeTab === 'friends' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Your Friends ({friends.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {friends.map(friend => (
                  <QuantumCard key={friend.id} className="p-4 hover:scale-105 transition-transform cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="text-3xl">{friend.avatar}</div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                          friend.status === 'online' ? 'bg-green-400' :
                          friend.status === 'in-game' ? 'bg-yellow-400' :
                          'bg-slate-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold">{friend.username}</p>
                        <p className="text-sm text-slate-400">Level {friend.level}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">{friend.status}</p>
                        <p className="text-xs font-mono text-purple-400">{(friend.xp / 1000).toFixed(1)}k XP</p>
                      </div>
                    </div>
                  </QuantumCard>
                ))}
              </div>
            </div>
          )}

          {/* Posts Tab */}
          {activeTab === 'posts' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {/* Create Post */}
                <QuantumCard className="p-6 mb-6">
                  <h3 className="text-lg font-bold mb-4">Create Post</h3>
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-purple-500/50 transition-colors resize-none h-24 mb-4"
                  />
                  <QuantumButton onClick={handleCreatePost} disabled={!newPost.trim()}>
                    <Send className="w-4 h-4 mr-2" />
                    Post
                  </QuantumButton>
                </QuantumCard>

                {/* Posts Feed */}
                <div className="space-y-4">
                  {posts.map(post => (
                    <QuantumCard key={post.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="font-bold text-lg">{post.author}</p>
                          <p className="text-sm text-slate-400">{post.timestamp}</p>
                        </div>
                      </div>
                      <p className="mb-4">{post.content}</p>
                      <div className="flex items-center gap-6">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-2 transition-colors ${
                            post.liked ? 'text-red-400' : 'text-slate-400 hover:text-red-400'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
                          <MessageCircle className="w-5 h-5" />
                          <span>{post.comments}</span>
                        </button>
                        <button className="flex items-center gap-2 text-slate-400 hover:text-green-400 transition-colors">
                          <Share2 className="w-5 h-5" />
                          <span>Share</span>
                        </button>
                      </div>
                    </QuantumCard>
                  ))}
                </div>
              </div>

              {/* Trending */}
              <div>
                <QuantumCard glowColor="red" className="p-6">
                  <h3 className="text-lg font-bold mb-4">Trending Topics</h3>
                  <div className="space-y-3">
                    {['#Level50', '#NewRecord', '#QuantumGaming', '#Tournament', '#NEXUS'].map((tag, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800/80 transition-colors cursor-pointer">
                        <p className="font-bold text-orange-400">{tag}</p>
                        <p className="text-xs text-slate-400">{1000 - (i * 150) + 42} posts</p>
                      </div>
                    ))}
                  </div>
                </QuantumCard>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
