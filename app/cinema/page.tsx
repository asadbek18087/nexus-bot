"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Search, Play, Star, Clock, Download, Loader2 } from 'lucide-react';
import { QuantumButton, QuantumCard } from '@/components/quantum-effects';
import { motion, AnimatePresence } from 'framer-motion';
import { getMovies } from '@/actions/content';

export default function CinemaPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [redirecting, setRedirecting] = useState<string | null>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Action', 'Sci-Fi', 'Documentary', 'Anime', 'Drama', 'Comedy'];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getMovies(activeCategory === 'All' ? undefined : activeCategory, searchQuery);
        setMovies(data);
      } catch (error) {
        console.error('Failed to fetch movies', error);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery]);

  const handleWatch = (movieId: string, movieCode: string) => {
    const isPremium = localStorage.getItem('nexus_premium') === 'true';
    const isTrial = localStorage.getItem('nexus_trial_active') === 'true';
    
    if (!isPremium && !isTrial) {
      router.push('/premium');
      return;
    }

    setRedirecting(movieId);
    setTimeout(() => {
      window.open(`https://t.me/NexusMediaBot?start=movie_${movieCode}`, '_blank');
      setRedirecting(null);
    }, 1500);
  };

  const getGenreColor = (genre: string) => {
    if (genre?.includes('Action')) return 'bg-pink-900/50';
    if (genre?.includes('Sci-Fi')) return 'bg-indigo-900/50';
    if (genre?.includes('Documentary')) return 'bg-blue-900/50';
    if (genre?.includes('Anime')) return 'bg-purple-900/50';
    return 'bg-slate-800/50';
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 pb-20 md:pb-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pt-4">
        <QuantumButton onClick={() => router.back()} size="sm" variant="secondary">
          <ChevronLeft className="w-5 h-5" />
        </QuantumButton>
        <h1 className="text-2xl font-bold text-white">Nexus Cinema</h1>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search movies & series..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat 
                ? 'bg-red-600 text-white' 
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center text-slate-400 py-12">
          No movies found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <AnimatePresence>
            {movies.map((movie) => (
              <motion.div
                key={movie.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
              >
                <QuantumCard className="h-full flex flex-col p-0 overflow-hidden group cursor-pointer relative">
                  <div className={`aspect-video ${getGenreColor(movie.genre)} relative flex items-center justify-center`}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                    
                    <button 
                      onClick={() => handleWatch(movie.id, movie.code || '')}
                      className="w-12 h-12 bg-white/20 hover:bg-red-600 rounded-full flex items-center justify-center backdrop-blur-sm transition-all transform group-hover:scale-110 z-10"
                    >
                      <Play className="w-5 h-5 text-white fill-current ml-1" />
                    </button>
                  </div>
                  
                  <div className="p-3">
                    <h3 className="text-white font-bold text-sm mb-1 truncate">{movie.title}</h3>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="truncate max-w-[100px]">{movie.genre}</span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-current" /> {movie.rating || 0}</span>
                        {/* <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {movie.duration}</span> */}
                      </div>
                    </div>
                  </div>

                  {/* Redirect Overlay */}
                  {redirecting === movie.id && (
                    <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center text-center p-4 z-20">
                      <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-2" />
                      <p className="text-xs text-red-400 font-medium">Opening in Telegram...</p>
                    </div>
                  )}
                </QuantumCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
