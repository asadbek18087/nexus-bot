"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Sparkles, Video, FileText, Monitor, BarChart, Settings, Star } from 'lucide-react';
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
  ];

  const plans = [
    {
      duration: "1 kunlik Premium",
      description: "Premium imkoniyatlarni sinab ko'ring",
      price: "8 000 UZS",
      fire: "2 kishi bugun sotib oldi",
      popular: false,
      color: "from-blue-600 to-violet-600"
    },
    {
      duration: "7 kunlik Premium",
      description: "52% tejash • Bir hafta uchun",
      price: "29 000 UZS",
      oldPrice: "60 900 UZS",
      discount: "52% chegirma",
      popular: true,
      color: "from-orange-500 to-pink-500"
    },
    {
      duration: "1 oylik Premium",
      description: "77% tejash • Bir oy cheksiz",
      price: "60 000 UZS",
      oldPrice: "261 000 UZS",
      discount: "77% chegirma",
      bestValue: true,
      color: "from-violet-600 to-purple-600"
    }
  ];

  const handlePurchase = (plan: any) => {
    // Redirect to Telegram bot for payment
    window.open(`https://t.me/nexus_support_bot?start=pay_${plan.duration.replace(/\s/g, '_')}`, '_blank');
  };

  const handleSendCheck = () => {
    window.open('https://t.me/nexus_support_bot?start=send_receipt', '_blank');
  };

  return (
    <SuperAppLayout>
      <div className="min-h-screen bg-slate-950 pb-20">
        {/* Header */}
        <div className="bg-slate-900/50 backdrop-blur-lg border-b border-white/10 p-4 sticky top-0 z-50">
          <div className="max-w-md mx-auto flex items-center gap-4">
            <button onClick={() => router.back()} className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Premium sotib olish</h1>
          </div>
        </div>

        <div className="max-w-md mx-auto p-4 space-y-6">
          {/* Features List */}
          <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10 space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20`}>
                  <feature.icon className="w-5 h-5 text-violet-400" />
                </div>
                <span className="flex-1 text-sm font-medium text-slate-200">{feature.text}</span>
                <Check className="w-5 h-5 text-green-400" />
              </div>
            ))}
          </div>

          {/* Plans */}
          <div className="space-y-4">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative overflow-hidden rounded-2xl border ${
                  plan.popular ? 'border-orange-500/50 bg-slate-900/80' : 
                  plan.bestValue ? 'border-violet-500/50 bg-slate-900/80' : 
                  'border-white/10 bg-slate-900/50'
                } p-6`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-orange-500/20">
                    🔥 MASHHUR 🔥
                  </div>
                )}

                {/* Best Value Badge */}
                {plan.bestValue && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-blue-500/20">
                    💎 ENG YAXSHI NARX
                  </div>
                )}

                <h3 className="text-lg font-bold mb-1">{plan.duration}</h3>
                <p className="text-slate-400 text-sm mb-4">{plan.description}</p>

                {/* Fire Notification */}
                {plan.fire && (
                  <div className="mb-4 bg-orange-500/10 border border-orange-500/20 rounded-lg p-2 flex items-center gap-2">
                    <span className="text-orange-400 animate-pulse">🔥</span>
                    <span className="text-orange-400 text-sm font-medium">{plan.fire}</span>
                  </div>
                )}

                <div className="mb-6">
                  <div className="text-3xl font-bold">{plan.price}</div>
                  {plan.oldPrice && (
                    <div className="text-sm text-slate-500 mt-1">
                      <span className="line-through">{plan.oldPrice}</span>
                      <span className="ml-2 text-green-400 font-bold">{plan.discount}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handlePurchase(plan)}
                  className={`w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r ${plan.color} hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg`}
                >
                  Sotib olish
                  <div className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white/30">CLICK</div>
                </button>
              </motion.div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/5">
            <button
              onClick={handleSendCheck}
              className="w-full py-3 px-4 rounded-xl bg-slate-800/50 border border-white/10 text-slate-300 text-sm font-medium hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              To'lov chekini yuborish
            </button>
          </div>

          <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            💡 Maslahat: Sifatli PDF fayllar mukammal savollar beradi.
          </p>
        </div>
      </div>
    </SuperAppLayout>
  );
}

