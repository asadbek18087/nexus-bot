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

  const allItems = useMemo(() => {
    const storeItems: InventoryDisplayItem[] = inventory.map(item => ({
      id: item.id,
      productId: item.productId,
      title: `Sotib olingan ${item.productId}`,
      type: 'tool',
      description: 'Sizning shaxsiy resursingiz',
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
      <div className="min-h-screen bg-slate-950 pb-20 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Mening Resurslarim
            </h1>
            <p className="text-slate-500 text-sm italic">Sotib olingan barcha kitoblar, kinolar va vositalar.</p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
              <input
                type="text"
                placeholder="Resurslarni qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-900/40 rounded-2xl border border-white/5 focus:border-violet-500/30 focus:outline-none transition-all placeholder:text-slate-600"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 p-1.5 bg-slate-900/60 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
              {(['all', 'movies', 'books', 'tools'] as const).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`flex-1 py-2.5 px-6 rounded-xl font-bold text-sm capitalize transition-all whitespace-nowrap ${
                    filter === filterType
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {filterType === 'all' ? 'Hammasi' : 
                   filterType === 'movies' ? 'Kinolar' :
                   filterType === 'books' ? 'Kitoblar' : 'Asboblar'}
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
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -4 }}
                  className="bg-slate-900/40 rounded-2xl p-5 border border-white/5 hover:border-violet-500/20 transition-all group"
                >
                  <div className="flex gap-5">
                    {/* Icon */}
                    <div className={`w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br ${getTypeColor(item.type)} flex items-center justify-center text-white shadow-inner`}>
                      <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm border border-white/20">
                        {getTypeIcon(item.type)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col">
                      <h3 className="font-bold text-lg text-slate-100 group-hover:text-violet-400 transition-colors">{item.title}</h3>
                      <p className="text-slate-500 text-xs mb-4 line-clamp-1 italic">{item.description}</p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                          <Calendar className="w-3 h-3" />
                          <span>{item.purchasedAt.toLocaleDateString()}</span>
                        </div>
                        
                        <button
                          onClick={() => handleOpen(item)}
                          className="px-5 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-200 border border-white/5 transition-all active:scale-95"
                        >
                          Ochish
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-slate-900/20 rounded-3xl border border-dashed border-white/5">
              <div className="w-24 h-24 bg-slate-900/60 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-400 mb-2">Hech narsa topilmadi</h3>
              <p className="text-slate-600 text-sm max-w-xs mx-auto italic">
                {searchQuery ? 'Qidiruv bo\'yicha resurslar mavjud emas' : 'Hali hech qanday resurs sotib olmagansiz'}
              </p>
            </div>
          )}

          {/* History Section - Optional refresh */}
          <div className="mt-16">
            <h2 className="text-lg font-bold text-slate-400 mb-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              Oxirgi harakatlar
            </h2>
            <div className="space-y-3">
              {[
                { act: "2048 o'ynadi", reward: "+5.5 tanga", time: "2 soat oldin" },
                { act: "AI Test yaratdi", reward: "-30 tanga", time: "5 soat oldin" },
                { act: "Premium sotib oldi", reward: "Faol", time: "Kecha" },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-slate-900/40 rounded-2xl border border-white/5 text-xs flex justify-between items-center">
                  <span className="text-slate-300 font-medium">{item.act}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-emerald-400 font-bold">{item.reward}</span>
                    <span className="text-slate-600 italic">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SuperAppLayout>
  );
}
