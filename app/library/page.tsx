"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Search, Book, Bookmark, Star, Download, ExternalLink, Loader2 } from 'lucide-react';
import { QuantumButton, QuantumCard } from '@/components/quantum-effects';
import { motion, AnimatePresence } from 'framer-motion';
import { getBooks } from '@/actions/content';

export default function LibraryPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [redirecting, setRedirecting] = useState<string | null>(null); // changed to string for UUID
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Sci-Fi', 'Quantum Physics', 'AI & Tech', 'Philosophy', 'Badiiy adabiyot', 'Jahon adabiyoti'];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getBooks(activeCategory === 'All' ? undefined : activeCategory, searchQuery);
        setBooks(data);
      } catch (error) {
        console.error('Failed to fetch books', error);
      } finally {
        setLoading(false);
      }
    }
    
    // Debounce search
    const timer = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery]);

  const handleDownload = (bookId: string, bookCode: string) => {
    const isPremium = localStorage.getItem('nexus_premium') === 'true';
    const isTrial = localStorage.getItem('nexus_trial_active') === 'true';
    
    if (!isPremium && !isTrial) {
      router.push('/premium');
      return;
    }

    setRedirecting(bookId);
    setTimeout(() => {
      window.open(`https://t.me/polway_bot?start=book_${bookCode}`, '_blank');
      setRedirecting(null);
    }, 1500);
  };

  // Helper to get color based on genre
  const getGenreColor = (genre: string) => {
    if (genre?.includes('Sci-Fi')) return 'bg-indigo-900/50';
    if (genre?.includes('Physics')) return 'bg-blue-900/50';
    if (genre?.includes('AI')) return 'bg-purple-900/50';
    if (genre?.includes('Philosophy')) return 'bg-emerald-900/50';
    return 'bg-slate-800/50';
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 pb-20 md:pb-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pt-4">
        <QuantumButton onClick={() => router.back()} size="sm" variant="secondary">
          <ChevronLeft className="w-5 h-5" />
        </QuantumButton>
        <h1 className="text-2xl font-bold text-white">Nexus Library</h1>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search for knowledge..." 
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
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : books.length === 0 ? (
        <div className="text-center text-slate-400 py-12">
          No books found. Try adjusting your filters.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AnimatePresence>
            {books.map((book) => (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
              >
                <QuantumCard className="h-full flex flex-col p-3 relative overflow-hidden group">
                  <div className={`aspect-[2/3] ${getGenreColor(book.genre)} rounded-lg mb-3 flex items-center justify-center relative`}>
                    <Book className="w-12 h-12 text-white/20" />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <button 
                        onClick={() => handleDownload(book.id, book.code || '')}
                        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-500 transition-colors"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-white font-bold text-sm mb-1 truncate">{book.title}</h3>
                  <p className="text-slate-400 text-xs mb-2 truncate">{book.author}</p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-slate-300">{book.rating || 0}</span>
                    </div>
                    <button className="text-blue-400 hover:text-blue-300">
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Redirect Overlay */}
                  {redirecting === book.id && (
                    <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center text-center p-4 z-20">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2" />
                      <p className="text-xs text-blue-400 font-medium">Opening in Telegram...</p>
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
