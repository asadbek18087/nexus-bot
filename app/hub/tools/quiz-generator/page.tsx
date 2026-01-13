"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BrainCircuit, Sparkles, Target, Zap, ChevronRight, Loader2, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SuperAppLayout from '@/components/SuperAppLayout';
import { QuantumCard, QuantumButton } from '@/components/quantum-effects';
import { useEconomyStore } from '@/stores/economyStore';
import { useQuizStore } from '@/stores/quizStore';

export default function QuizGeneratorPage() {
  const router = useRouter();
  const { coins, spendCoins } = useEconomyStore();
  const { setQuestions, setMode, setTopic: setStoreTopic } = useQuizStore();
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [count, setCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!topic || coins < 30) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, count, difficulty })
      });
      
      const data = await response.json();
      if (data.success && data.questions.length > 0) {
        spendCoins(30);
        setQuestions(data.questions);
        setStoreTopic(topic);
        setMode('practice');
        router.push('/quiz');
      } else {
        alert("Savollar yaratishda xatolik yuz berdi.");
      }
    } catch (error) {
      console.error('Generation error:', error);
      alert("Server bilan bog'lanishda xatolik.");
    } finally {
      setIsGenerating(false);
    }
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
            <h1 className="text-xl font-bold">AI Test Yaratish</h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-4 py-8">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-violet-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-violet-500/20">
              <BrainCircuit className="w-10 h-10 text-violet-400" />
            </div>
            <h2 className="text-3xl font-bold mb-2 text-white">AI bilan Test yarating</h2>
            <p className="text-slate-400">Istalgan mavzuda professional test savollarini sun'iy intellekt yordamida tayyorlang.</p>
          </div>

          <div className="space-y-6">
            <QuantumCard className="p-6 space-y-6">
              {/* Topic */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-violet-400" />
                  Mavzuni kiriting
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Masalan: Python asoslari, O'zbekiston tarixi..."
                  className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 transition-all"
                />
              </div>

              {/* Difficulty */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                  <Target className="w-4 h-4 text-cyan-400" />
                  Qiyinlik darajasi
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['easy', 'medium', 'hard'] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                        difficulty === d
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                          : 'bg-slate-800/50 border-white/5 text-slate-500'
                      }`}
                    >
                      {d === 'easy' ? 'Oson' : d === 'medium' ? "O'rta" : 'Qiyin'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Count */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Savollar soni
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[5, 10, 15, 20].map((c) => (
                    <button
                      key={c}
                      onClick={() => setCount(c)}
                      className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                        count === c
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                          : 'bg-slate-800/50 border-white/5 text-slate-500'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </QuantumCard>

            <div className="bg-slate-900/50 p-4 rounded-xl border border-violet-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-medium text-slate-200">Xizmat narxi: 30 tanga</span>
              </div>
              <span className={`text-xs ${coins < 30 ? 'text-red-400' : 'text-slate-500'}`}>
                Balansingiz: {coins} tanga
              </span>
            </div>

            <QuantumButton
              disabled={!topic || coins < 30 || isGenerating}
              onClick={handleGenerate}
              className="w-full py-4 text-lg shadow-lg shadow-violet-500/20"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Yaratilmoqda...
                </>
              ) : (
                <>
                  Testni yaratish
                  <Sparkles className="w-5 h-5 ml-2" />
                </>
              )}
            </QuantumButton>
          </div>
        </div>
      </div>
    </SuperAppLayout>
  );
}
