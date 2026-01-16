"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Sparkles, Video, FileText, Monitor, BarChart, Settings, Star, Crown, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SuperAppLayout from '@/components/SuperAppLayout';

export default function PremiumPage() {
  const router = useRouter();

  const features = [
    { icon: Video, text: "Cheksiz videodan testlar" },
    { icon: FileText, text: "Cheksiz PDFdan testlar" },
    { icon: Monitor, text: "Cheksiz AI prezentatsiyalar" },
    { icon: BarChart, text: "Premium statistika va maslaxatlar" },
    { icon: Settings, text: "Savollar sonini tanlash" },
    { icon: Sparkles, text: "Yuqori sifatli testlar" },
    { icon: Crown, text: "Eksklyuziv 'Exclusive' nishoni" },
  ];

  const plans = [
    {
      id: "1_day",
      duration: "1 Kunlik",
      description: "Sinab ko'rish uchun",
      price: "9 000 UZS",
      save: null,
      popular: false,
      color: "from-slate-700 to-slate-600",
      border: "border-white/10"
    },
    {
      id: "1_week",
      duration: "1 Haftalik",
      description: "Qisqa muddatli reja",
      price: "29 000 UZS",
      oldPrice: "63 000 UZS",
      save: "54% tejash",
      popular: false,
      color: "from-blue-600 to-indigo-600",
      border: "border-blue-500/30"
    },
    {
      id: "1_month",
      duration: "1 Oylik",
      description: "Eng ko'p tanlanadigan",
      price: "69 000 UZS",
      oldPrice: "270 000 UZS",
      save: "75% tejash",
      popular: true,
      color: "from-violet-600 to-purple-600",
      border: "border-violet-500/50"
    },
    {
      id: "1_year",
      duration: "1 Yillik",
      description: "Professional tanlov",
      price: "399 000 UZS",
      oldPrice: "3 285 000 UZS",
      save: "88% tejash",
      popular: false,
      exclusive: true,
      color: "from-amber-500 to-orange-600",
      border: "border-amber-500/50"
    }
  ];

  const handlePurchase = (plan: any) => {
    // Redirect to Telegram bot for payment with specific plan ID
    window.open(`https://t.me/polway_bot?start=pay_${plan.id}`, '_blank');
  };

  const handleSendCheck = () => {
    window.open('https://t.me/polway_bot?start=send_receipt', '_blank');
  };

  return (
    <SuperAppLayout>
      <div className="min-h-screen bg-slate-950 pb-20">
        {/* Header */}
        <div className="bg-slate-900/50 backdrop-blur-lg border-b border-white/10 p-4 sticky top-0 z-50">
          <div className="max-w-md mx-auto flex items-center gap-4">
            <button onClick={() => router.back()} className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Premium Tariflar</h1>
          </div>
        </div>

        <div className="max-w-md mx-auto p-4 space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-2 py-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3" /> Cheksiz Imkoniyatlar
            </div>
            <h2 className="text-3xl font-bold text-white">Salohiyatingizni<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">To'liq Ochish</span></h2>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">Premium obuna bilan barcha AI vositalari va cheksiz kontentga ega bo'ling.</p>
          </div>

          {/* Plans Grid */}
          <div className="space-y-4">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handlePurchase(plan)}
                className={`relative overflow-hidden rounded-2xl border ${plan.border} bg-slate-900/60 p-5 cursor-pointer hover:bg-slate-900/80 transition-all group`}
              >
                {/* Background Glow */}
                <div className={`absolute inset-0 bg-gradient-to-r ${plan.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                
                {/* Badges */}
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-violet-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-lg">
                    ENG MASHHUR
                  </div>
                )}
                {plan.exclusive && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-lg flex items-center gap-1">
                    <Crown className="w-3 h-3 fill-current" /> EXCLUSIVE
                  </div>
                )}

                <div className="flex justify-between items-center relative z-10">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      {plan.duration}
                      {plan.save && <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">{plan.save}</span>}
                    </h3>
                    <p className="text-slate-400 text-xs">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    {plan.oldPrice && <div className="text-xs text-slate-500 line-through decoration-slate-500">{plan.oldPrice}</div>}
                    <div className={`text-xl font-bold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>{plan.price}</div>
                  </div>
                </div>
                
                {/* Active Indicator */}
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>

          {/* Features List */}
          <div className="bg-slate-900/40 rounded-3xl p-6 border border-white/5 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> Premium Afzalliklari
            </h3>
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <div className="p-2 rounded-xl bg-slate-800/50 group-hover:bg-violet-500/20 transition-colors">
                    <feature.icon className="w-4 h-4 text-slate-400 group-hover:text-violet-400 transition-colors" />
                  </div>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Info */}
          <div className="pt-4 space-y-3">
            <button
              onClick={handleSendCheck}
              className="w-full py-4 px-6 rounded-2xl bg-slate-800/50 border border-white/10 text-slate-300 text-sm font-bold hover:bg-slate-800 hover:border-white/20 transition-all flex items-center justify-center gap-2 group"
            >
              <FileText className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              To'lov chekini yuborish
            </button>
            <p className="text-center text-[10px] text-slate-500">
              To'lov xavfsizligi kafolatlangan. Muammo yuzaga kelsa, qo'llab-quvvatlash xizmati 24/7 ishlaydi.
            </p>
          </div>
        </div>
      </div>
    </SuperAppLayout>
  );
}

