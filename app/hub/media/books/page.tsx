"use client";

import { useState } from 'react';
import SuperAppLayout from '@/components/SuperAppLayout';
import { useEconomyStore } from '@/stores/economyStore';
import { motion } from 'framer-motion';
import { BookOpen, Lock, CheckCircle, Star, Download, Search } from 'lucide-react';

interface EBook {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  rating: number;
  pages: number;
  category: string;
  coverUrl: string;
  isPremium?: boolean;
}

const mockBooks: EBook[] = [
  {
    id: 'book1',
    title: 'The Quantum Mind',
    author: 'Dr. Sarah Chen',
    description: 'Exploring the intersection of quantum physics and consciousness',
    price: 30,
    rating: 4.7,
    pages: 320,
    category: 'Science',
    coverUrl: '/images/book1.jpg'
  },
  {
    id: 'book2',
    title: 'AI Revolution',
    author: 'Marcus Johnson',
    description: 'How artificial intelligence is reshaping our world',
    price: 25,
    rating: 4.5,
    pages: 280,
    category: 'Technology',
    coverUrl: '/images/book2.jpg'
  },
  {
    id: 'book3',
    title: 'Digital Minimalism',
    author: 'Emma Thompson',
    description: 'Finding focus in a noisy world',
    price: 0,
    rating: 4.9,
    pages: 250,
    category: 'Self-Help',
    coverUrl: '/images/book3.jpg',
    isPremium: true
  },
  {
    id: 'book4',
    title: 'The Future of Code',
    author: 'Alex Kumar',
    description: 'Programming paradigms for the next decade',
    price: 35,
    rating: 4.6,
    pages: 400,
    category: 'Programming',
    coverUrl: '/images/book4.jpg'
  },
  {
    id: 'book5',
    title: 'Neural Networks Explained',
    author: 'Dr. Lisa Park',
    description: 'A beginner\'s guide to deep learning',
    price: 20,
    rating: 4.8,
    pages: 220,
    category: 'Technology',
    coverUrl: '/images/book5.jpg'
  },
  {
    id: 'book6',
    title: 'The Startup Playbook',
    author: 'Ryan Mitchell',
    description: 'From idea to IPO - lessons from successful founders',
    price: 0,
    rating: 4.4,
    pages: 350,
    category: 'Business',
    coverUrl: '/images/book6.jpg',
    isPremium: true
  }
];

const categories = ['All', 'Science', 'Technology', 'Programming', 'Self-Help', 'Business'];

export default function EBooksPage() {
  const { coins, spendCoins, isPremium, hasItem, addToInventory } = useEconomyStore();
  const [books] = useState<EBook[]>(mockBooks);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const filteredBooks = books.filter(book => {
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePurchase = async (book: EBook) => {
    if (hasItem(book.id)) return;
    
    if (book.isPremium && !isPremium) {
      alert('This book requires Premium membership!');
      return;
    }

    if (book.price > 0 && coins < book.price) {
      alert('Not enough coins!');
      return;
    }

    setPurchasing(book.id);

    // Deduct coins if needed
    if (book.price > 0) {
      const success = spendCoins(book.price);
      if (!success) {
        setPurchasing(null);
        return;
      }
    }

    // Add to inventory
    addToInventory({
      id: `inv_${book.id}`,
      productId: book.id,
      purchasedAt: new Date().toISOString()
    });

    setPurchasing(null);
    alert('Book added to your library! Check "My Stuff" to read.');
  };

  const handleRead = (book: EBook) => {
    if (!hasItem(book.id)) return;
    
    // In a real app, this would open the e-book reader or send via Telegram
    alert(`Opening "${book.title}" via Telegram Bot...`);
  };

  return (
    <SuperAppLayout>
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              E-Books Library
            </h1>
            <p className="text-slate-400">Discover and purchase premium e-books</p>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search books or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 rounded-lg border border-slate-700 focus:border-violet-500/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-800/50 text-slate-400 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => {
              const owned = hasItem(book.id);
              const canAfford = coins >= book.price;
              
              return (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-slate-800/50 rounded-xl overflow-hidden border border-violet-500/20 hover:border-violet-400/50 transition-all"
                >
                  {/* Cover */}
                  <div className="aspect-[3/4] bg-gradient-to-br from-violet-600/20 to-purple-600/20 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-violet-400/50" />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg flex-1">{book.title}</h3>
                      {book.isPremium && (
                        <span className="px-2 py-1 bg-gradient-to-r from-yellow-600/20 to-yellow-600/10 border border-yellow-500/30 rounded-full text-xs text-yellow-400 ml-2">
                          Premium
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-slate-400 mb-1">by {book.author}</p>
                    <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                      {book.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{book.rating}</span>
                      </div>
                      <span>{book.pages} pages</span>
                      <span>{book.category}</span>
                    </div>

                    {/* Action Button */}
                    {owned ? (
                      <button
                        onClick={() => handleRead(book)}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
                      >
                        <Download className="w-4 h-4" />
                        Read Now
                      </button>
                    ) : book.isPremium && !isPremium ? (
                      <button
                        disabled
                        className="w-full flex items-center justify-center gap-2 py-2 bg-slate-700 rounded-lg font-medium opacity-50 cursor-not-allowed"
                      >
                        <Lock className="w-4 h-4" />
                        Premium Only
                      </button>
                    ) : book.price === 0 ? (
                      <button
                        onClick={() => handlePurchase(book)}
                        disabled={purchasing === book.id}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {purchasing === book.id ? 'Processing...' : 'Get Free'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePurchase(book)}
                        disabled={purchasing === book.id || !canAfford}
                        className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-all ${
                          canAfford
                            ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90'
                            : 'bg-slate-700 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <span className="text-lg font-bold text-violet-400">{book.price}</span>
                        <span>coins</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredBooks.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No books found</h3>
              <p className="text-slate-400">
                {searchQuery ? 'Try adjusting your search' : 'No books in this category yet'}
              </p>
            </div>
          )}
        </div>
      </div>
    </SuperAppLayout>
  );
}
