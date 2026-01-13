"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, RotateCcw, ChevronRight, ChevronLeft, Zap, Sparkles, Layers } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SuperAppLayout from '@/components/SuperAppLayout';
import { QuantumCard, QuantumButton } from '@/components/quantum-effects';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
}

export default function FlashcardsPage() {
  const router = useRouter();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    // Mock data
    const mockCards: Flashcard[] = [
      { id: '1', front: 'Quantum Entanglement', back: 'A physical phenomenon where particles remain connected such that the state of one instantly influences the other, regardless of distance.', category: 'Physics' },
      { id: '2', front: 'Closure (JavaScript)', back: 'A function bundled together with its lexical environment, allowing it to access variables from an outer scope even after that scope has closed.', category: 'Programming' },
      { id: '3', front: 'Algorithm', back: 'A step-by-step procedure or set of rules to be followed in calculations or other problem-solving operations.', category: 'Logic' },
    ];
    setCards(mockCards);
  }, []);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setDirection(1);
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 50);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 50);
    }
  };

  if (cards.length === 0) return null;

  return (
    <SuperAppLayout>
      <div className="min-h-screen bg-slate-950 pb-20 flex flex-col">
        {/* Header */}
        <div className="bg-slate-900/50 backdrop-blur-lg border-b border-white/10 p-4 sticky top-0 z-50">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => router.back()} className="text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-bold text-white">Flashcards</h1>
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-full border border-white/5">
              {currentIndex + 1} / {cards.length}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full">
          {/* Card Container */}
          <div className="relative w-full aspect-[3/4] md:aspect-[4/3] [perspective:1000px] group">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentIndex}
                initial={{ x: direction * 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -direction * 300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full h-full cursor-pointer [transform-style:preserve-3d]"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                  className="w-full h-full relative [transform-style:preserve-3d]"
                >
                  {/* Front Side */}
                  <div className="absolute inset-0 [backface-visibility:hidden]">
                    <QuantumCard className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-slate-900/80 border-white/10 group-hover:border-violet-500/30 transition-all shadow-2xl">
                      <div className="absolute top-6 left-6 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{cards[currentIndex].category}</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                        {cards[currentIndex].front}
                      </h2>
                      <div className="absolute bottom-8 text-slate-500 flex flex-col items-center gap-2">
                        <RotateCcw className="w-5 h-5 opacity-20 animate-spin-slow" />
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Tarifini ko'rish uchun bosing</span>
                      </div>
                    </QuantumCard>
                  </div>

                  {/* Back Side */}
                  <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <QuantumCard className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-violet-950/40 to-slate-900/80 border-violet-500/20 shadow-2xl shadow-violet-500/10">
                      <div className="absolute top-6 left-6 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-violet-400" />
                        <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Ta'rif</span>
                      </div>
                      <p className="text-xl md:text-2xl text-slate-200 font-medium leading-relaxed">
                        {cards[currentIndex].back}
                      </p>
                      <div className="absolute bottom-8 text-violet-400/40">
                        <RotateCcw className="w-5 h-5" />
                      </div>
                    </QuantumCard>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6 mt-12 w-full max-w-sm">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            
            <QuantumButton 
              className="flex-1 py-4 text-lg shadow-lg shadow-violet-500/20"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {isFlipped ? "Oldi tomoni" : "Orqa tomoni"}
            </QuantumButton>

            <button
              onClick={handleNext}
              disabled={currentIndex === cards.length - 1}
              className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 w-full">
            <div className="bg-slate-900/40 p-4 rounded-2xl border border-white/5 text-center">
              <div className="text-xl font-black text-emerald-400">12</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bilaman</div>
            </div>
            <div className="bg-slate-900/40 p-4 rounded-2xl border border-white/5 text-center">
              <div className="text-xl font-black text-red-400">3</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">O'rganishim kerak</div>
            </div>
          </div>
        </div>
      </div>
    </SuperAppLayout>
  );
}
