"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SuperAppLayout from '@/components/SuperAppLayout';
import { useEconomyStore } from '@/stores/economyStore';
import { motion } from 'framer-motion';
import { Coins, Crown, Zap, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

interface CoinPackage {
  id: string;
  amount: number;
  price: string;
  priceValue: number;
  bonus?: number;
  popular?: boolean;
}

const packages: CoinPackage[] = [
  { id: 'small', amount: 100, price: '3,000 UZS', priceValue: 3000 },
  { id: 'medium', amount: 550, price: '15,000 UZS', priceValue: 15000, bonus: 50 },
  { id: 'large', amount: 1150, price: '29,000 UZS', priceValue: 29000, bonus: 150, popular: true },
  { id: 'xlarge', amount: 6000, price: '99,000 UZS', priceValue: 99000, bonus: 1000 },
  { id: 'mega', amount: 12500, price: '199,000 UZS', priceValue: 199000, bonus: 2500 },
];

export default function BuyCoinsPage() {
  const router = useRouter();
  const { coins, addCoins } = useEconomyStore();
  const [selectedPackage, setSelectedPackage] = useState<string>('large');
  const [processing, setProcessing] = useState(false);

  const handlePurchase = (pkg: CoinPackage) => {
    // Redirect to @polway_bot for payment processing
    window.open(`https://t.me/polway_bot?start=buy_coins_${pkg.id}`, '_blank');
  };

  return (
    <SuperAppLayout>
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Buy Coins
            </h1>
            <p className="text-slate-400 text-lg">
              Get more coins to unlock premium content and features
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full">
              <Coins className="w-5 h-5 text-cyan-400" />
              <span className="font-semibold">Current Balance: {coins.toLocaleString()}</span>
            </div>
          </motion.div>

          {/* Coin Packages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {packages.map((pkg) => {
              const totalCoins = pkg.amount + (pkg.bonus || 0);
              const isSelected = selectedPackage === pkg.id;
              
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: packages.indexOf(pkg) * 0.1 }}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`relative bg-slate-800/50 rounded-2xl p-6 border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/20 scale-105'
                      : 'border-slate-700 hover:border-cyan-400/50'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full text-xs font-medium text-white">
                      Most Popular
                    </div>
                  )}

                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Coins className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                      {totalCoins.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-400">coins</div>
                  </div>

                  {pkg.bonus && (
                    <div className="text-center mb-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-500/50 rounded text-xs text-green-400">
                        <Sparkles className="w-3 h-3" />
                        +{pkg.bonus} bonus
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className="text-xl font-bold text-white">{pkg.price}</div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePurchase(pkg);
                    }}
                    disabled={processing}
                    className={`w-full py-3 rounded-lg font-medium transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-90'
                        : 'bg-slate-700 hover:bg-slate-600'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {processing ? 'Processing...' : 'Buy Now'}
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-800/30 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-center mb-8">What Can You Do With Coins?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-violet-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Premium Content</h3>
                  <p className="text-sm text-slate-400">Unlock exclusive movies and books</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Energy Boosts</h3>
                  <p className="text-sm text-slate-400">Get more energy for AI tools</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Power-ups</h3>
                  <p className="text-sm text-slate-400">Enhance your gaming experience</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Skip Waits</h3>
                  <p className="text-sm text-slate-400">Instant access to all features</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 text-center text-sm text-slate-500"
          >
            <p>Secure payment via Click / Payme / Telegram</p>
            <p>Coins are added to your account instantly</p>
          </motion.div>
        </div>
      </div>
    </SuperAppLayout>
  );
}
