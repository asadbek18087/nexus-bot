"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SuperAppLayout from '@/components/SuperAppLayout';
import { useEconomyStore } from '@/stores/economyStore';
import { motion } from 'framer-motion';
import { Coins, Crown, Zap, CheckCircle, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import { QuantumButton, QuantumCard } from '@/components/quantum-effects';

interface CoinPackage {
  id: string;
  amount: number;
  price: string;
  priceValue: number;
  bonus?: number;
  popular?: boolean;
}

const packages: CoinPackage[] = [
  { id: 'small', amount: 100, price: '3 000 UZS', priceValue: 3000 },
  { id: 'medium', amount: 550, price: '15 000 UZS', priceValue: 15000, bonus: 50 },
  { id: 'large', amount: 1150, price: '29 000 UZS', priceValue: 29000, bonus: 150, popular: true },
  { id: 'xlarge', amount: 6000, price: '99 000 UZS', priceValue: 99000, bonus: 1000 },
  { id: 'mega', amount: 12500, price: '199 000 UZS', priceValue: 199000, bonus: 2500 },
];

export default function BuyCoinsPage() {
  const router = useRouter();
  const { coins } = useEconomyStore();
  const [selectedPackage, setSelectedPackage] = useState<string>('large');

  const handlePurchase = (pkg: CoinPackage) => {
    // Redirect to @nexus_support_bot for payment processing
    window.open(`https://t.me/nexus_support_bot?start=buy_coins_${pkg.id}`, '_blank');
  };

  return (
    <SuperAppLayout>
      <div className="min-h-screen bg-slate-950 pb-20">
        {/* Header */}
        <div className="bg-slate-900/50 backdrop-blur-lg border-b border-white/10 p-4 sticky top-0 z-50">
          <div className="max-w-2xl mx-auto flex items-center gap-4">
            <button onClick={() => router.back()} className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Tangalar sotib olish</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 py-8">
          {/* Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="bg-gradient-to-br from-cyan-600/20 to-blue-900/20 rounded-3xl p-8 border border-cyan-500/20 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Coins className="w-32 h-32 text-cyan-400 -rotate-12" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
                  <Coins className="w-8 h-8 text-cyan-400" />
                </div>
                <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-1">Joriy balans</h2>
                <div className="text-4xl font-black text-white">{coins.toLocaleString()}</div>
                <p className="text-slate-500 text-xs mt-2 italic">Tangalaringiz barcha funksiyalar uchun ishlaydi</p>
              </div>
            </div>
          </motion.div>

          {/* Coin Packages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {packages.map((pkg, index) => {
              const totalCoins = pkg.amount + (pkg.bonus || 0);
              const isSelected = selectedPackage === pkg.id;
              
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`relative bg-slate-900/40 rounded-2xl p-6 border cursor-pointer transition-all active:scale-[0.98] ${
                    isSelected
                      ? 'border-cyan-500/50 bg-slate-900/60 shadow-lg shadow-cyan-500/10'
                      : 'border-white/5 hover:border-white/10'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-full text-[10px] font-black text-white uppercase tracking-tighter shadow-lg shadow-orange-500/20">
                      Eng ommabop
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className="text-3xl font-black text-white mb-1">
                      {totalCoins.toLocaleString()}
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tangalar</div>
                  </div>

                  {pkg.bonus && (
                    <div className="flex justify-center mb-6">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-400">
                        <Sparkles className="w-3 h-3" />
                        +{pkg.bonus} bonus
                      </div>
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
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                      isSelected
                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Sotib olish
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Features / Why Buy Coins? */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Zap, title: "AI Testlar", desc: "Har bir test yaratish uchun tangalar kerak", color: "text-amber-400", bg: "bg-amber-400/10" },
              { icon: Sparkles, title: "Jokerlar", desc: "Testda 50/50 va AI yordamidan foydalaning", color: "text-violet-400", bg: "bg-violet-400/10" },
              { icon: CheckCircle, title: "Prezentatsiyalar", desc: "Murakkab mavzularda AI prezentatsiyalar yarating", color: "text-cyan-400", bg: "bg-cyan-400/10" },
              { icon: Crown, title: "Cheksiz Imkoniyat", desc: "Limitlarni oshiring va o'rganishni tezlashtiring", color: "text-emerald-400", bg: "bg-emerald-400/10" },
            ].map((feature, i) => (
              <div key={i} className="flex gap-4 p-5 bg-slate-900/40 rounded-2xl border border-white/5">
                <div className={`w-12 h-12 shrink-0 rounded-xl ${feature.bg} flex items-center justify-center`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100">{feature.title}</h3>
                  <p className="text-slate-500 text-xs mt-1">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SuperAppLayout>
  );
}

