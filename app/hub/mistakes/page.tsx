"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, AlertCircle, RotateCcw, ChevronRight, CheckCircle2, XCircle, Brain } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SuperAppLayout from '@/components/SuperAppLayout';
import { QuantumCard, QuantumButton } from '@/components/quantum-effects';

interface Mistake {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  category: string;
  timestamp: string;
}

export default function MistakesPage() {
  const router = useRouter();
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [selectedMistake, setSelectedMistake] = useState<Mistake | null>(null);

  useEffect(() => {
    const savedMistakes = JSON.parse(localStorage.getItem('nexus_mistakes') || '[]');
    setMistakes(savedMistakes.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  }, []);

  const clearMistakes = () => {
    if (confirm("Barcha xatolarni o'chirib tashlamoqchimisiz?")) {
      localStorage.removeItem('nexus_mistakes');
      setMistakes([]);
    }
  };

  return (
    <SuperAppLayout>
      <div className="min-h-screen bg-slate-950 pb-20">
        {/* Header */}
        <div className="bg-slate-900/50 backdrop-blur-lg border-b border-white/10 p-4 sticky top-0 z-50">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => router.back()} className="text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-bold">Noto'g'ri javoblar</h1>
            </div>
            {mistakes.length > 0 && (
              <button 
                onClick={clearMistakes}
                className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Tozalash
              </button>
            )}
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-4">
          {mistakes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Hozircha xatolar yo'q!</h2>
              <p className="text-slate-400 max-w-sm">
                Siz juda zo'r ketyapsiz. Bilimingizni oshirish uchun yangi testlar yechishda davom eting.
              </p>
              <Link href="/hub" className="mt-8">
                <QuantumButton>Test yechishni boshlash</QuantumButton>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-6">
                <div className="flex gap-3">
                  <Brain className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-300">
                    <strong>Spaced Repetition:</strong> Xatolaringiz ustida ishlash — o'rganishning eng tezkor yo'li. Bu savollarni qayta ko'rib chiqish orqali xotirani mustahkamlang.
                  </p>
                </div>
              </div>

              {mistakes.map((mistake, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <QuantumCard 
                    className="p-5 cursor-pointer hover:border-white/20 transition-all"
                    onClick={() => setSelectedMistake(selectedMistake === mistake ? null : mistake)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                            Xato qilingan
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {mistake.category}
                          </span>
                        </div>
                        <h3 className="font-medium text-slate-200 line-clamp-2">
                          {mistake.question}
                        </h3>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-slate-600 transition-transform ${selectedMistake === mistake ? 'rotate-90' : ''}`} />
                    </div>

                    <AnimatePresence>
                      {selectedMistake === mistake && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-6 space-y-3 border-t border-white/5 pt-4">
                            {mistake.options.map((option, i) => (
                              <div 
                                key={i}
                                className={`p-3 rounded-xl border flex items-center justify-between ${
                                  i === mistake.correctAnswer 
                                    ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                                    : 'bg-slate-800/50 border-white/5 text-slate-400'
                                }`}
                              >
                                <span className="text-sm">{option}</span>
                                {i === mistake.correctAnswer && <CheckCircle2 className="w-4 h-4" />}
                                {i !== mistake.correctAnswer && <XCircle className="w-4 h-4 opacity-20" />}
                              </div>
                            ))}
                            
                            {mistake.explanation && (
                              <div className="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <div className="flex gap-2">
                                  <span className="text-blue-400 font-bold text-sm">Nega?</span>
                                  <p className="text-xs text-blue-300 leading-relaxed">
                                    {mistake.explanation}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </QuantumCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SuperAppLayout>
  );
}
