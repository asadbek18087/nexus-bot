"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Presentation, Sparkles, Layout, Image as ImageIcon, Zap, Loader2, Wand2, Monitor, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SuperAppLayout from '@/components/SuperAppLayout';
import { QuantumCard, QuantumButton } from '@/components/quantum-effects';
import { useEconomyStore } from '@/stores/economyStore';

export default function AiPresentationPage() {
  const router = useRouter();
  const { coins, spendCoins, addToInventory } = useEconomyStore();
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<'input' | 'processing' | 'ready'>('input');

  const handleGenerate = async () => {
    if (!topic || coins < 100) return;
    
    setIsGenerating(true);
    setStep('processing');
    
    // Simulate generation
    setTimeout(() => {
      spendCoins(100);
      addToInventory({
        id: `pres_${Date.now()}`,
        productId: 'ai_presentation',
        purchasedAt: new Date().toISOString()
      });
      setIsGenerating(false);
      setStep('ready');
    }, 5000);
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
            <h1 className="text-xl font-bold">AI Prezentatsiya</h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-4 py-8">
          <AnimatePresence mode="wait">
            {step === 'input' && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-10">
                  <div className="w-20 h-20 bg-cyan-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-cyan-500/20">
                    <Presentation className="w-10 h-10 text-cyan-400" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2 text-white">AI bilan Prezentatsiya yarating</h2>
                  <p className="text-slate-400">Mavzuni kiriting, AI esa sizga to'liq slaydlar va kontent tayyorlab beradi.</p>
                </div>

                <QuantumCard className="p-6 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                      <Wand2 className="w-4 h-4 text-cyan-400" />
                      Prezentatsiya mavzusi
                    </label>
                    <textarea
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="Masalan: Quyosh tizimi haqida qiziqarli ma'lumotlar yoki Sun'iy intellektning kelajagi..."
                      className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-all min-h-[120px] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-white/5 text-xs text-slate-400">
                      <Layout className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>10-15 Professional slaydlar</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-white/5 text-xs text-slate-400">
                      <ImageIcon className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>AI tomonidan tanlangan rasmlar</span>
                    </div>
                  </div>
                </QuantumCard>

                <div className="bg-slate-900/50 p-4 rounded-xl border border-cyan-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-medium text-slate-200">Xizmat narxi: 100 tanga</span>
                  </div>
                  <span className={`text-xs ${coins < 100 ? 'text-red-400' : 'text-slate-500'}`}>
                    Sizda: {coins} tanga
                  </span>
                </div>

                <QuantumButton
                  disabled={!topic || coins < 100 || isGenerating}
                  onClick={handleGenerate}
                  className="w-full py-4 text-lg shadow-lg shadow-cyan-500/20 bg-gradient-to-r from-cyan-600 to-blue-600"
                >
                  Generatsiyani boshlash
                  <Sparkles className="w-5 h-5 ml-2" />
                </QuantumButton>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="relative mb-8">
                  <div className="w-24 h-24 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                  <Presentation className="w-10 h-10 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Prezentatsiya tayyorlanmoqda...</h2>
                <div className="space-y-2 max-w-xs mx-auto">
                  <p className="text-slate-400 text-sm italic">Sladylar tuzilishi yaratilmoqda...</p>
                  <p className="text-slate-500 text-xs">AI mavzu bo'yicha eng dolzarb ma'lumotlarni qidirmoqda va vizualizatsiya qilmoqda.</p>
                </div>
              </motion.div>
            )}

            {step === 'ready' && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 text-center"
              >
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Prezentatsiya tayyor!</h2>
                <p className="text-slate-400">"{topic}" mavzusidagi prezentatsiya muvaffaqiyatli yaratildi.</p>
                
                <QuantumCard className="p-4 overflow-hidden relative group cursor-pointer aspect-video bg-slate-800 flex items-center justify-center border-white/10 hover:border-cyan-500/50 transition-all mt-8">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  <Monitor className="w-16 h-16 text-slate-700 absolute opacity-20" />
                  <div className="relative z-20 text-left w-full mt-auto">
                    <h4 className="text-lg font-bold text-white truncate">{topic}</h4>
                    <p className="text-xs text-slate-400">12 ta slayd • 1.2 MB</p>
                  </div>
                </QuantumCard>

                <div className="flex gap-4 mt-8">
                  <QuantumButton 
                    variant="secondary" 
                    className="flex-1"
                    onClick={() => setStep('input')}
                  >
                    Yangi yaratish
                  </QuantumButton>
                  <QuantumButton 
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600"
                    onClick={() => alert("Yuklab olish funksiyasi tez orada qo'shiladi!")}
                  >
                    Yuklab olish (PPTX)
                  </QuantumButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </SuperAppLayout>
  );
}
