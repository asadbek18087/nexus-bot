"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, BookOpen, Download, Share2, Star } from 'lucide-react';
import { QuantumCard, QuantumButton } from './quantum-effects';

interface ContentItem {
  id: string;
  title: string;
  type: 'movie' | 'book' | 'course';
  rating: number;
  image: string;
  description: string;
}

export default function ContentViewer() {
  const [activeTab, setActiveTab] = useState<'movies' | 'books' | 'courses'>('movies');

  const content: Record<string, ContentItem[]> = {
    movies: [
      { id: 'm1', title: 'Inception', type: 'movie', rating: 4.8, image: '🎬', description: 'Dream within a dream.' },
      { id: 'm2', title: 'Interstellar', type: 'movie', rating: 4.9, image: '🚀', description: 'Love transcends dimensions.' }
    ],
    books: [
      { id: 'b1', title: 'Atomic Habits', type: 'book', rating: 4.7, image: '📘', description: 'Tiny changes, remarkable results.' },
      { id: 'b2', title: 'Deep Work', type: 'book', rating: 4.6, image: '📚', description: 'Rules for focused success.' }
    ],
    courses: [
      { id: 'c1', title: 'Python Mastery', type: 'course', rating: 4.9, image: '🐍', description: 'Zero to Hero in Python.' },
      { id: 'c2', title: 'React Pro', type: 'course', rating: 4.8, image: '⚛️', description: 'Build modern web apps.' }
    ]
  };

  const handleAction = (item: ContentItem, action: 'watch' | 'download') => {
    // Deep link to Telegram bot
    const botUsername = "nexus_media_bot"; // Replace with actual bot username
    const startParam = `${item.type}_${item.id}`;
    const url = `https://t.me/${botUsername}?start=${startParam}`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Tabs */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {['movies', 'books', 'courses'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {content[activeTab].map((item) => (
          <QuantumCard key={item.id} className="p-6 flex flex-col h-full">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-20 h-20 bg-slate-800 rounded-xl flex items-center justify-center text-4xl">
                {item.image}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                <div className="flex items-center gap-2 text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold">{item.rating}</span>
                </div>
                <p className="text-sm text-slate-400 mt-2 line-clamp-2">{item.description}</p>
              </div>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-3">
              <QuantumButton 
                onClick={() => handleAction(item, 'watch')}
                className="w-full justify-center"
              >
                {activeTab === 'books' ? <BookOpen className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {activeTab === 'books' ? 'Read' : 'Watch'}
              </QuantumButton>
              <QuantumButton 
                onClick={() => handleAction(item, 'download')}
                variant="secondary"
                className="w-full justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </QuantumButton>
            </div>
          </QuantumCard>
        ))}
      </div>
    </div>
  );
}
