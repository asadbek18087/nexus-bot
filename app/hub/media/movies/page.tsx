"use client";

import { useState } from 'react';
import SuperAppLayout from '@/components/SuperAppLayout';
import { useEconomyStore } from '@/stores/economyStore';
import { motion } from 'framer-motion';
import { Play, Lock, CheckCircle, Star } from 'lucide-react';

interface MediaProduct {
  id: string;
  type: 'movie' | 'book';
  title: string;
  description: string;
  price: number;
  coverUrl: string;
  rating: number;
  duration?: string;
  pages?: number;
  isPremium?: boolean;
}

const mockMovies: MediaProduct[] = [
  {
    id: 'movie1',
    type: 'movie',
    title: 'Quantum Paradox',
    description: 'A mind-bending sci-fi thriller exploring parallel universes',
    price: 50,
    coverUrl: '/images/movie1.jpg',
    rating: 4.8,
    duration: '2h 15min'
  },
  {
    id: 'movie2',
    type: 'movie',
    title: 'Digital Dreams',
    description: 'An animated journey through the digital realm',
    price: 40,
    coverUrl: '/images/movie2.jpg',
    rating: 4.5,
    duration: '1h 45min'
  },
  {
    id: 'movie3',
    type: 'movie',
    title: 'The Last Algorithm',
    description: 'AI thriller that questions consciousness',
    price: 0,
    coverUrl: '/images/movie3.jpg',
    rating: 4.9,
    duration: '2h 30min',
    isPremium: true
  },
  {
    id: 'movie4',
    type: 'movie',
    title: 'Cyber City',
    description: 'Neo-noir detective story in a futuristic metropolis',
    price: 45,
    coverUrl: '/images/movie4.jpg',
    rating: 4.6,
    duration: '2h 5min'
  },
  {
    id: 'movie5',
    type: 'movie',
    title: 'Neural Networks',
    description: 'Documentary on the rise of artificial intelligence',
    price: 30,
    coverUrl: '/images/movie5.jpg',
    rating: 4.7,
    duration: '1h 30min'
  },
  {
    id: 'movie6',
    type: 'movie',
    title: 'Virtual Reality',
    description: 'Experience the future through immersive storytelling',
    price: 0,
    coverUrl: '/images/movie6.jpg',
    rating: 4.4,
    duration: '1h 55min',
    isPremium: true
  }
];

export default function MoviesPage() {
  const { coins, spendCoins, isPremium, hasItem, addToInventory } = useEconomyStore();
  const [selectedMovie, setSelectedMovie] = useState<MediaProduct | null>(null);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const handlePurchase = async (movie: MediaProduct) => {
    if (hasItem(movie.id)) return;
    
    if (movie.isPremium && !isPremium) {
      alert('This movie requires Premium membership!');
      return;
    }

    if (movie.price > 0 && coins < movie.price) {
      alert('Not enough coins!');
      return;
    }

    setPurchasing(movie.id);

    // Deduct coins if needed
    if (movie.price > 0) {
      const success = spendCoins(movie.price);
      if (!success) {
        setPurchasing(null);
        return;
      }
    }

    // Add to inventory
    addToInventory({
      id: `inv_${movie.id}`,
      productId: movie.id,
      purchasedAt: new Date().toISOString()
    });

    // Simulate API call to get Telegram file ID
    await new Promise(resolve => setTimeout(resolve, 1000));

    setPurchasing(null);
    alert('Movie added to your library! Check "My Stuff" to watch.');
  };

  const handleWatch = (movie: MediaProduct) => {
    if (!hasItem(movie.id)) return;
    
    // In a real app, this would open the Telegram media player
    alert(`Opening ${movie.title} via Telegram Bot...`);
  };

  return (
    <SuperAppLayout>
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Movie Marketplace
            </h1>
            <p className="text-slate-400">Browse and purchase premium movies</p>
          </div>

          {/* Movies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockMovies.map((movie) => {
              const owned = hasItem(movie.id);
              const canAfford = coins >= movie.price;
              
              return (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-slate-800/50 rounded-xl overflow-hidden border border-cyan-500/20 hover:border-cyan-400/50 transition-all"
                >
                  {/* Cover Image */}
                  <div className="aspect-video bg-gradient-to-br from-cyan-600/20 to-blue-600/20 flex items-center justify-center">
                    <Play className="w-12 h-12 text-cyan-400/50" />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{movie.title}</h3>
                      {movie.isPremium && (
                        <span className="px-2 py-1 bg-gradient-to-r from-yellow-600/20 to-yellow-600/10 border border-yellow-500/30 rounded-full text-xs text-yellow-400">
                          Premium
                        </span>
                      )}
                    </div>

                    <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                      {movie.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{movie.rating}</span>
                      </div>
                      {movie.duration && (
                        <span>{movie.duration}</span>
                      )}
                    </div>

                    {/* Action Button */}
                    {owned ? (
                      <button
                        onClick={() => handleWatch(movie)}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Watch Now
                      </button>
                    ) : movie.isPremium && !isPremium ? (
                      <button
                        disabled
                        className="w-full flex items-center justify-center gap-2 py-2 bg-slate-700 rounded-lg font-medium opacity-50 cursor-not-allowed"
                      >
                        <Lock className="w-4 h-4" />
                        Premium Only
                      </button>
                    ) : movie.price === 0 ? (
                      <button
                        onClick={() => handlePurchase(movie)}
                        disabled={purchasing === movie.id}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {purchasing === movie.id ? 'Processing...' : 'Get Free'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePurchase(movie)}
                        disabled={purchasing === movie.id || !canAfford}
                        className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-all ${
                          canAfford
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-90'
                            : 'bg-slate-700 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <span className="text-lg font-bold text-cyan-400">{movie.price}</span>
                        <span>coins</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Empty State for selected movie preview */}
          {selectedMovie && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-slate-900/95 backdrop-blur-lg z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedMovie(null)}
            >
              <div
                className="bg-slate-800 rounded-xl max-w-2xl w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold mb-4">{selectedMovie.title}</h2>
                <p className="text-slate-400 mb-6">{selectedMovie.description}</p>
                <button
                  onClick={() => setSelectedMovie(null)}
                  className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </SuperAppLayout>
  );
}
