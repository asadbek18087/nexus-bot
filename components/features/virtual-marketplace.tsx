"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Star, 
  Zap, 
  Crown, 
  Gem, 
  Coins, 
  Clock, 
  Sparkles,
  Gift,
  TrendingUp,
  Lock,
  Unlock,
  ShoppingCart
} from 'lucide-react';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'coins' | 'gems' | 'real';
  category: 'avatars' | 'frames' | 'themes' | 'powers' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  owned: boolean;
  equipped: boolean;
  discount?: number;
  limited?: boolean;
  timeLeft?: number; // in hours
}

const VirtualMarketplace: React.FC = () => {
  const [items, setItems] = useState<ShopItem[]>([
    {
      id: '1',
      name: 'Dragon Avatar',
      description: 'Transform into a mighty dragon',
      price: 1000,
      currency: 'coins',
      category: 'avatars',
      rarity: 'epic',
      owned: false,
      equipped: false,
      discount: 20,
      limited: true,
      timeLeft: 48
    },
    {
      id: '2',
      name: 'Golden Frame',
      description: 'Show off your premium status',
      price: 500,
      currency: 'coins',
      category: 'frames',
      rarity: 'rare',
      owned: true,
      equipped: false
    },
    {
      id: '3',
      name: 'Neon Theme',
      description: 'Futuristic neon interface',
      price: 150,
      currency: 'coins',
      category: 'themes',
      rarity: 'common',
      owned: false,
      equipped: false
    },
    {
      id: '4',
      name: 'Double XP Power',
      description: '2x XP for 24 hours',
      price: 100,
      currency: 'gems',
      category: 'powers',
      rarity: 'rare',
      owned: false,
      equipped: false
    },
    {
      id: '5',
      name: 'Phoenix Avatar',
      description: 'Rise from the ashes',
      price: 2000,
      currency: 'coins',
      category: 'avatars',
      rarity: 'legendary',
      owned: false,
      equipped: false,
      limited: true,
      timeLeft: 24
    },
    {
      id: '6',
      name: 'Crystal Crown',
      description: 'Ultimate symbol of power',
      price: 500,
      currency: 'gems',
      category: 'special',
      rarity: 'legendary',
      owned: false,
      equipped: false
    },
    {
      id: '7',
      name: 'Energy Boost',
      description: 'Refill energy to full',
      price: 50,
      currency: 'coins',
      category: 'powers',
      rarity: 'common',
      owned: false,
      equipped: false
    },
    {
      id: '8',
      name: 'Mystery Box',
      description: 'Contains random rare item',
      price: 300,
      currency: 'coins',
      category: 'special',
      rarity: 'epic',
      owned: false,
      equipped: false
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [userCurrency, setUserCurrency] = useState({ coins: 5430, gems: 125 });
  const [cart, setCart] = useState<string[]>([]);

  const categories = [
    { value: 'all', label: 'All Items' },
    { value: 'avatars', label: 'Avatars' },
    { value: 'frames', label: 'Frames' },
    { value: 'themes', label: 'Themes' },
    { value: 'powers', label: 'Powers' },
    { value: 'special', label: 'Special' }
  ];

  const getRarityColor = (rarity: ShopItem['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 text-gray-400';
      case 'rare': return 'border-blue-400 text-blue-400';
      case 'epic': return 'border-purple-400 text-purple-400';
      case 'legendary': return 'border-yellow-400 text-yellow-400';
    }
  };

  const getRarityGradient = (rarity: ShopItem['rarity']) => {
    switch (rarity) {
      case 'common': return 'from-gray-600 to-gray-700';
      case 'rare': return 'from-blue-600 to-blue-700';
      case 'epic': return 'from-purple-600 to-purple-700';
      case 'legendary': return 'from-yellow-600 to-orange-600';
    }
  };

  const purchaseItem = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item || item.owned) return;

    if (item.currency === 'coins' && userCurrency.coins >= item.price) {
      setUserCurrency(prev => ({ ...prev, coins: prev.coins - item.price }));
      setItems(prev => prev.map(i => 
        i.id === itemId ? { ...i, owned: true } : i
      ));
    } else if (item.currency === 'gems' && userCurrency.gems >= item.price) {
      setUserCurrency(prev => ({ ...prev, gems: prev.gems - item.price }));
      setItems(prev => prev.map(i => 
        i.id === itemId ? { ...i, owned: true } : i
      ));
    }
  };

  const equipItem = (itemId: string) => {
    setItems(prev => prev.map(item => ({
      ...item,
      equipped: item.id === itemId ? true : item.category === prev.find(i => i.id === itemId)?.category && item.equipped ? false : item.equipped
    })));
  };

  const addToCart = (itemId: string) => {
    setCart(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]);
  };

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  const cartTotal = cart.reduce((total, itemId) => {
    const item = items.find(i => i.id === itemId);
    if (!item || item.owned) return total;
    const discountedPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price;
    return total + discountedPrice;
  }, 0);

  return (
    <div className="bg-gray-900 rounded-xl p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-2">
          <ShoppingBag className="w-8 h-8 text-purple-500" />
          Virtual Marketplace
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
            <Coins className="w-5 h-5 text-yellow-500" />
            <span className="text-white font-bold">{userCurrency.coins.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
            <Gem className="w-5 h-5 text-cyan-500" />
            <span className="text-white font-bold">{userCurrency.gems}</span>
          </div>
          <button className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all">
            <ShoppingCart className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              selectedCategory === category.value
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Special Offers Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-yellow-300" />
            <div>
              <h3 className="text-lg font-bold text-white">Flash Sale!</h3>
              <p className="text-purple-100">Limited time offers on selected items</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-white">
            <Clock className="w-5 h-5" />
            <span className="font-bold">Ends in 2d 14h</span>
          </div>
        </div>
      </div>

      {/* Shop Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className={`relative bg-gray-800 rounded-lg overflow-hidden border-2 ${
                item.owned ? 'border-green-500' : getRarityColor(item.rarity)
              }`}
            >
              {/* Limited Timer */}
              {item.limited && item.timeLeft && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1 z-10">
                  <Clock className="w-3 h-3" />
                  {item.timeLeft}h
                </div>
              )}

              {/* Discount Badge */}
              {item.discount && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold z-10">
                  -{item.discount}%
                </div>
              )}

              {/* Owned Badge */}
              {item.owned && (
                <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold z-10">
                  OWNED
                </div>
              )}

              <div className={`p-4 bg-gradient-to-br ${getRarityGradient(item.rarity)}`}>
                <div className="aspect-square bg-gray-900 rounded-lg mb-3 flex items-center justify-center">
                  <Gift className="w-16 h-16 text-gray-600" />
                </div>
                
                <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                <p className="text-sm text-gray-300 mb-3">{item.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {item.currency === 'coins' ? (
                      <Coins className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <Gem className="w-4 h-4 text-cyan-500" />
                    )}
                    <span className="text-white font-bold">
                      {item.discount ? Math.floor(item.price * (1 - item.discount / 100)) : item.price}
                    </span>
                    {item.discount && (
                      <span className="text-gray-400 line-through text-sm">{item.price}</span>
                    )}
                  </div>
                  <span className={`text-xs font-bold uppercase ${getRarityColor(item.rarity)}`}>
                    {item.rarity}
                  </span>
                </div>

                <div className="flex gap-2">
                  {item.owned ? (
                    <button
                      onClick={() => equipItem(item.id)}
                      className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                        item.equipped
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {item.equipped ? 'Equipped' : 'Equip'}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => purchaseItem(item.id)}
                        disabled={item.currency === 'coins' ? userCurrency.coins < item.price : userCurrency.gems < item.price}
                        className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                          item.currency === 'coins' 
                            ? userCurrency.coins >= item.price 
                              ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : userCurrency.gems >= item.price
                              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700'
                              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Buy
                      </button>
                      <button
                        onClick={() => addToCart(item.id)}
                        className={`p-2 rounded-lg transition-all ${
                          cart.includes(item.id)
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 bg-gray-800 rounded-lg p-4 border-2 border-purple-500 max-w-sm"
        >
          <h4 className="text-white font-bold mb-2">Cart Summary</h4>
          <p className="text-gray-300 text-sm mb-3">{cart.length} items</p>
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-bold">Total:</span>
            <div className="flex items-center gap-1">
              <Coins className="w-4 h-4 text-yellow-500" />
              <span className="text-white font-bold">{Math.floor(cartTotal)}</span>
            </div>
          </div>
          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all">
            Purchase All
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default VirtualMarketplace;
