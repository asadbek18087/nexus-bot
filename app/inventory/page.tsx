"use client";

import { useState, useMemo } from 'react';
import SuperAppLayout from '@/components/SuperAppLayout';
import { useEconomyStore } from '@/stores/economyStore';
import { motion } from 'framer-motion';
import { Play, BookOpen, Calendar, Search } from 'lucide-react';

interface InventoryDisplayItem {
  id: string;
  productId: string;
  title: string;
  type: 'movie' | 'book' | 'tool';
  description: string;
  purchasedAt: Date;
  coverUrl?: string;
  duration?: string;
  pages?: number;
}

const mockInventory: InventoryDisplayItem[] = [
  {
    id: 'inv1',
    productId: 'movie1',
    title: 'Quantum Paradox',
    type: 'movie',
    description: 'A mind-bending sci-fi thriller',
    purchasedAt: new Date('2024-01-15'),
    duration: '2h 15min'
  },
  {
    id: 'inv2',
    productId: 'book1',
    title: 'AI Fundamentals',
    type: 'book',
    description: 'Complete guide to artificial intelligence',
    purchasedAt: new Date('2024-01-14'),
    pages: 350
  },
  {
    id: 'inv3',
    productId: 'tool1',
    title: 'PDF Quiz Generator',
    type: 'tool',
    description: 'Convert PDFs to interactive quizzes',
    purchasedAt: new Date('2024-01-13')
  }
];

export default function InventoryPage() {
  const { inventory } = useEconomyStore();
  const [filter, setFilter] = useState<'all' | 'movies' | 'books' | 'tools'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Combine store inventory with mock data and map to display format
  const allItems = useMemo(() => {
    // Map store inventory items to display format
    // In a real app, we would fetch product details based on productId
    const storeItems: InventoryDisplayItem[] = inventory.map(item => ({
      id: item.id,
      productId: item.productId,
      title: `Product ${item.productId}`, // Placeholder title
      type: 'tool', // Default type
      description: 'Purchased item',
      purchasedAt: new Date(item.purchasedAt)
    }));
    return [...mockInventory, ...storeItems];
  }, [inventory]);

  const filteredItems = allItems.filter(item => {
    const matchesFilter = filter === 'all' || item.type === filter.slice(0, -1); // Remove 's' from plural
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleOpen = (item: InventoryDisplayItem) => {
    if (item.type === 'movie') {
      alert(`Opening ${item.title} via Telegram Bot...`);
    } else if (item.type === 'book') {
      alert(`Downloading ${item.title} via Telegram Bot...`);
    } else if (item.type === 'tool') {
      alert(`Accessing ${item.title}...`);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'movie':
        return <Play className="w-5 h-5" />;
      case 'book':
        return <BookOpen className="w-5 h-5" />;
      case 'tool':
        return <Calendar className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'movie':
        return 'from-cyan-600 to-blue-600';
      case 'book':
        return 'from-violet-600 to-purple-600';
      case 'tool':
        return 'from-green-600 to-emerald-600';
      default:
        return 'from-slate-600 to-slate-700';
    }
  };

  return (
    <SuperAppLayout>
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              My Stuff
            </h1>
            <p className="text-slate-400">Your purchased items and tools</p>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search your items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 rounded-lg border border-slate-700 focus:border-violet-500/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 p-1 bg-slate-800/50 rounded-lg">
              {(['all', 'movies', 'books', 'tools'] as const).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`flex-1 py-2 px-4 rounded-md font-medium capitalize transition-all ${
                    filter === filterType
                      ? 'bg-violet-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filterType}
                </button>
              ))}
            </div>
          </div>

          {/* Items Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item: InventoryDisplayItem) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-violet-500/50 transition-all"
                >
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getTypeColor(item.type)} flex items-center justify-center text-white`}>
                      {getTypeIcon(item.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                      <p className="text-slate-400 text-sm mb-2">{item.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-500">
                          {item.duration && <span>{item.duration}</span>}
                          {item.pages && <span>{item.pages} pages</span>}
                          <span>Purchased {item.purchasedAt.toLocaleDateString()}</span>
                        </div>
                        
                        <button
                          onClick={() => handleOpen(item)}
                          className="px-3 py-1 bg-violet-600 rounded-md text-sm font-medium hover:bg-violet-700 transition-colors"
                        >
                          Open
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No items found</h3>
              <p className="text-slate-400">
                {searchQuery ? 'Try adjusting your search' : 'Start by exploring the Hub'}
              </p>
            </div>
          )}

          {/* History Section */}
          <div className="mt-12">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-2">
              <div className="p-3 bg-slate-800/30 rounded-lg text-sm text-slate-400">
                <span className="text-white">Played 2048</span> - Earned 5.5 coins
                <span className="float-right">2 hours ago</span>
              </div>
              <div className="p-3 bg-slate-800/30 rounded-lg text-sm text-slate-400">
                <span className="text-white">Generated PDF Quiz</span> - Used 10 energy
                <span className="float-right">5 hours ago</span>
              </div>
              <div className="p-3 bg-slate-800/30 rounded-lg text-sm text-slate-400">
                <span className="text-white">Purchased &quot;Quantum Paradox&quot;</span> - 50 coins
                <span className="float-right">Yesterday</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SuperAppLayout>
  );
}
