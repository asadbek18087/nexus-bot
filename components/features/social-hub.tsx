"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  Bookmark, 
  Send, 
  Image as ImageIcon, 
  Smile,
  Users,
  TrendingUp,
  Clock,
  Filter,
  Bell,
  MoreHorizontal
} from 'lucide-react';

interface Post {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    level: number;
  };
  content: string;
  image?: string;
  timestamp: Date;
  reactions: {
    likes: number;
    comments: number;
    shares: number;
  };
  tags: string[];
  isLiked: boolean;
  isBookmarked: boolean;
}

const SocialHub: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: {
        name: 'Alex Chen',
        username: '@alexchen',
        avatar: '👨‍💻',
        level: 42
      },
      content: 'Just reached level 42! 🎉 The grind never stops. Thanks to everyone who joined my study group today!',
      image: undefined,
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      reactions: {
        likes: 45,
        comments: 12,
        shares: 3
      },
      tags: ['achievement', 'levelup', 'grateful'],
      isLiked: false,
      isBookmarked: false
    },
    {
      id: '2',
      author: {
        name: 'Sarah Miller',
        username: '@sarahm',
        avatar: '👩‍🎮',
        level: 38
      },
      content: 'Pro tip: Use the Pomodoro technique while studying. It increased my productivity by 200%! 🍅⏰',
      image: undefined,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      reactions: {
        likes: 89,
        comments: 24,
        shares: 15
      },
      tags: ['tips', 'productivity', 'study'],
      isLiked: true,
      isBookmarked: false
    },
    {
      id: '3',
      author: {
        name: 'Mike Johnson',
        username: '@mikej',
        avatar: '🧑‍🚀',
        level: 25
      },
      content: 'Looking for teammates for the upcoming tournament! We need 2 more players. DM if interested! 🏆',
      image: undefined,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      reactions: {
        likes: 23,
        comments: 8,
        shares: 2
      },
      tags: ['lfg', 'tournament', 'team'],
      isLiked: false,
      isBookmarked: true
    }
  ]);

  const [newPost, setNewPost] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'following' | 'trending'>('all');

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

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            reactions: {
              ...post.reactions,
              likes: post.isLiked ? post.reactions.likes - 1 : post.reactions.likes + 1
            }
          }
        : post
    ));
  };

  const handleBookmark = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  const createPost = () => {
    if (!newPost.trim()) return;
    
    const post: Post = {
      id: Date.now().toString(),
      author: {
        name: 'You',
        username: '@you',
        avatar: '😎',
        level: 30
      },
      content: newPost,
      timestamp: new Date(),
      reactions: {
        likes: 0,
        comments: 0,
        shares: 0
      },
      tags: [],
      isLiked: false,
      isBookmarked: false
    };
    
    setPosts(prev => [post, ...prev]);
    setNewPost('');
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-8 h-8 text-blue-500" />
          Social Hub
        </h2>
        <div className="flex items-center gap-2">
          <button className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Create Post */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <div className="text-2xl">😎</div>
          <div className="flex-1">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full bg-gray-700 text-white rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded transition-all">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded transition-all">
                  <Smile className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={createPost}
                disabled={!newPost.trim()}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          All Posts
        </button>
        <button
          onClick={() => setSelectedFilter('following')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedFilter === 'following'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Following
        </button>
        <button
          onClick={() => setSelectedFilter('trending')}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            selectedFilter === 'trending'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Trending
        </button>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-lg p-4"
          >
            {/* Post Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="text-3xl">{post.author.avatar}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white">{post.author.name}</h3>
                    <span className="text-sm text-gray-400">{post.author.username}</span>
                    <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">Lv.{post.author.level}</span>
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(post.timestamp)}
                  </p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-white">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Post Content */}
            <div className="mb-3">
              <p className="text-white mb-2">{post.content}</p>
              {post.image && (
                <div className="rounded-lg overflow-hidden relative h-64 w-full">
                  <Image 
                    src={post.image} 
                    alt={`Post by ${post.author.name}`} 
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-blue-400 text-sm hover:underline cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

            {/* Post Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-700">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-2 transition-all ${
                  post.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm">{post.reactions.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-all">
                <MessageSquare className="w-5 h-5" />
                <span className="text-sm">{post.reactions.comments}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition-all">
                <Share2 className="w-5 h-5" />
                <span className="text-sm">{post.reactions.shares}</span>
              </button>
              <button
                onClick={() => handleBookmark(post.id)}
                className={`transition-all ${
                  post.isBookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-6">
        <button className="px-6 py-2 bg-gray-800 text-gray-400 rounded-lg font-medium hover:bg-gray-700 hover:text-white transition-all">
          Load More Posts
        </button>
      </div>
    </div>
  );
};

export default SocialHub;
