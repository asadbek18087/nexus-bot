"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Clock, ChevronRight, Share2, Play, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SuperAppLayout from '@/components/SuperAppLayout';
import { QuantumCard, QuantumButton } from '@/components/quantum-effects';

interface SavedQuiz {
  id: string;
  topic: string;
  score: number;
  totalQuestions: number;
  date: string;
  category: string;
}

export default function MyQuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<SavedQuiz[]>([]);

  useEffect(() => {
    // Mock data for initial view
    const mockQuizzes: SavedQuiz[] = [
      { id: '1', topic: 'Python Asoslari', score: 8, totalQuestions: 10, date: '2026-01-13', category: 'Programming' },
      { id: '2', topic: 'O\'zbekiston Tarixi', score: 10, totalQuestions: 10, date: '2026-01-12', category: 'History' },
      { id: '3', topic: 'Kvant Fizikasi', score: 6, totalQuestions: 10, date: '2026-01-10', category: 'Physics' },
    ];
    setQuizzes(mockQuizzes);
  }, []);

  return (
    <SuperAppLayout>
      <div className="min-h-screen bg-slate-950 pb-20">
        {/* Header */}
        <div className="bg-slate-900/50 backdrop-blur-lg border-b border-white/10 p-4 sticky top-0 z-50">
          <div className="max-w-2xl mx-auto flex items-center gap-4">
            <button onClick={() => router.back()} className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Mening Testlarim</h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-4 py-8">
          {quizzes.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-slate-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-300">Sizda hali saqlangan testlar yo'q</h2>
              <QuantumButton onClick={() => router.push('/hub')} className="mt-6">
                Yangi test yaratish
              </QuantumButton>
            </div>
          ) : (
            <div className="space-y-4">
              {quizzes.map((quiz, index) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <QuantumCard className="p-5 group hover:border-violet-500/30 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-violet-500/10 p-2 rounded-lg">
                          <Trophy className="w-5 h-5 text-violet-400" />
                        </div>
                        <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">{quiz.category}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {quiz.date}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-200 mb-4">{quiz.topic}</h3>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex flex-col">
                          <span className="text-slate-500 text-[10px] uppercase">Natija</span>
                          <span className="font-bold text-slate-200">{quiz.score}/{quiz.totalQuestions}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-slate-500 text-[10px] uppercase">Foiz</span>
                          <span className="font-bold text-emerald-400">{Math.round((quiz.score/quiz.totalQuestions)*100)}%</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => router.push('/quiz')}
                          className="flex items-center gap-2 px-4 py-2 bg-violet-600 rounded-lg text-white text-xs font-bold hover:bg-violet-500 transition-all"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          Qayta yechish
                        </button>
                      </div>
                    </div>
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
