"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SuperAppLayout from '@/components/SuperAppLayout';
import Link from 'next/link';
import { useEconomyStore } from '@/stores/economyStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { 
  BrainCircuit, 
  Sparkles, 
  Trophy, 
  Target, 
  Zap, 
  Lock, 
  Star, 
  ChevronRight,
  FileUp,
  Presentation,
  BookOpen,
  AlertCircle,
  Users,
  Gift,
  Layers,
  Info,
  Gamepad2,
  Flame,
  Clock
} from 'lucide-react';

export default function HubPage() {
  const { coins, addCoins } = useEconomyStore();
  const { addNotification } = useNotificationStore();
  const [showDailyBonus, setShowDailyBonus] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 14, s: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Onboarding check
    const onboarded = localStorage.getItem('nexus_onboarded');
    if (!onboarded) {
      localStorage.setItem('nexus_onboarded', 'true');
      addNotification({
        id: 'welcome',
        title: 'Nexus-ga xush kelibsiz! 🚀',
        message: 'Bilim olishni AI testlardan boshlang va tangalar yig\'ing.',
        type: 'info',
        timestamp: new Date().toISOString()
      });
    }

    // Daily bonus check
    const lastClaim = localStorage.getItem('nexus_last_claim');
    const today = new Date().toDateString();
    if (lastClaim !== today) {
      setTimeout(() => setShowDailyBonus(true), 1500);
    }
  }, [addNotification]);

  const claimDailyBonus = () => {
    addCoins(50);
    localStorage.setItem('nexus_last_claim', new Date().toDateString());
    setShowDailyBonus(false);
    alert("Tabriklaymiz! 50 tanga balansingizga qo'shildi! 🔥");
  };
  return (
    <SuperAppLayout>
      <div className="min-h-screen bg-slate-950 pb-20">
        {/* Daily Bonus Modal - Placeholder style */}
        {showDailyBonus && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-900 border border-violet-500/30 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl shadow-violet-500/20"
            >
              <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gift className="w-10 h-10 text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Kunlik Bonus!</h2>
              <p className="text-slate-400 text-sm mb-8">Har kuni kirib bonus tangalarni qo'lga kiriting va o'rganishni davom ettiring.</p>
              <button 
                onClick={claimDailyBonus}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-violet-600/20 active:scale-95"
              >
                50 tangani olish
              </button>
            </motion.div>
          </div>
        )}

        {/* Hero Section / Banner */}
        <div className="p-4 pt-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-900 p-8 shadow-2xl shadow-violet-500/20">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 opacity-20">
              <FileUp className="w-40 h-40 text-white rotate-12" />
            </div>
            <div className="relative z-10 max-w-xs">
              <h1 className="text-2xl font-bold text-white mb-2 leading-tight">
                Fayllarni testlarga bir zumda aylantiring
              </h1>
              <p className="text-violet-100/80 text-sm mb-6">
                Yuklang, mashq qiling, ulashing.
              </p>
              <Link href="/hub/tools/pdf-quiz">
                <button className="bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-white/30 transition-all text-sm uppercase tracking-wide">
                  PDF yuklash
                </button>
              </Link>
            </div>
            
            {/* Pagination Dots (as seen in screenshot) */}
            <div className="flex gap-1.5 mt-8 justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
              <div className="w-4 h-1.5 rounded-full bg-white" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
            </div>
          </div>
        </div>

        <div className="px-4 py-6 max-w-2xl mx-auto">
          {/* Section Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-1">Boshlash uchun</h2>
            <p className="text-slate-500 text-sm italic">Keyingi harakatni tanlang.</p>
          </div>

          {/* Main Actions List */}
          <div className="space-y-3">
            <Link
              href="/hub/tools/pdf-quiz"
              className="flex items-center justify-between p-5 bg-slate-900/40 rounded-2xl border border-white/5 hover:bg-slate-900/60 transition-all group"
            >
              <div className="flex gap-4 items-center">
                <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5">
                  <FileUp className="w-6 h-6 text-slate-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">PDF yuklash</h3>
                  <p className="text-slate-500 text-xs">Har qanday faylni testga aylantiring.</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/hub/tools/quiz-generator"
              className="flex items-center justify-between p-5 bg-slate-900/40 rounded-2xl border border-white/5 hover:bg-slate-900/60 transition-all group"
            >
              <div className="flex gap-4 items-center">
                <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5 relative">
                  <BrainCircuit className="w-6 h-6 text-violet-400" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-[8px] font-bold px-1.5 py-0.5 rounded-full text-white border border-slate-950 flex items-center gap-0.5">
                    <Flame className="w-2 h-2" fill="currentColor" /> HOT
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    AI Test Yaratish
                    <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded uppercase font-bold tracking-wide">
                      3 ta joy qoldi
                    </span>
                  </h3>
                  <p className="text-slate-500 text-xs">Istalgan mavzuda test yarating.</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/hub/tools/ai-presentation"
              className="flex items-center justify-between p-5 bg-slate-900/40 rounded-2xl border border-white/5 hover:bg-slate-900/60 transition-all group"
            >
              <div className="flex gap-4 items-center">
                <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5 relative">
                  <Presentation className="w-6 h-6 text-cyan-400" />
                  <span className="absolute -top-1 -right-1 bg-cyan-600 text-[8px] font-bold px-1.5 py-0.5 rounded-full text-white border border-slate-950">NEW</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">AI Prezentatsiya</h3>
                  <p className="text-slate-500 text-xs">Professional prezentatsiyalar yarating.</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/hub/my-quizzes"
              className="flex items-center justify-between p-5 bg-slate-900/40 rounded-2xl border border-white/5 hover:bg-slate-900/60 transition-all group"
            >
              <div className="flex gap-4 items-center">
                <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5">
                  <BookOpen className="w-6 h-6 text-slate-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Testlarim</h3>
                  <p className="text-slate-500 text-xs">Natijalarni ko'ring va ulashing.</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/hub/mistakes"
              className="flex items-center justify-between p-5 bg-slate-900/40 rounded-2xl border border-white/5 hover:bg-slate-900/60 transition-all group"
            >
              <div className="flex gap-4 items-center">
                <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5">
                  <AlertCircle className="w-6 h-6 text-slate-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Noto'g'ri javoblar</h3>
                  <p className="text-slate-500 text-xs">Barcha testlardagi xatolarni ko'rib chiqing.</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/hub/group-quiz"
              className="flex items-center justify-between p-5 bg-slate-900/40 rounded-2xl border border-white/5 hover:bg-slate-900/60 transition-all group"
            >
              <div className="flex gap-4 items-center">
                <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5">
                  <Users className="w-6 h-6 text-slate-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Guruh testi</h3>
                  <p className="text-slate-500 text-xs">Do'stlaringiz bilan real vaqtda o'ynang!</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/hub/tools/flashcards"
              className="flex items-center justify-between p-5 bg-slate-900/40 rounded-2xl border border-white/5 hover:bg-slate-900/60 transition-all group"
            >
              <div className="flex gap-4 items-center">
                <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5">
                  <Layers className="w-6 h-6 text-slate-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Flashcards</h3>
                  <p className="text-slate-500 text-xs">Interaktiv kartochkalar orqali o'rganing.</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/game"
              className="flex items-center justify-between p-5 bg-slate-900/40 rounded-2xl border border-white/5 hover:bg-slate-900/60 transition-all group"
            >
              <div className="flex gap-4 items-center">
                <div className="bg-emerald-500/10 p-3 rounded-xl border border-white/5 relative">
                  <Gamepad2 className="w-6 h-6 text-emerald-400" />
                  <span className="absolute -top-1 -right-1 bg-emerald-600 text-[8px] font-bold px-1.5 py-0.5 rounded-full text-white border border-slate-950">FUN</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Dam olish xonasi</h3>
                  <p className="text-slate-500 text-xs">2048 o'yinini o'ynab hordiq chiqaring.</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Flash Sale Banner */}
          <div className="mt-8 mb-4 bg-gradient-to-r from-red-900/40 to-orange-900/40 border border-red-500/30 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden">
             <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
             <div className="relative z-10 flex items-center gap-3">
              <div className="bg-red-500/20 p-2.5 rounded-xl">
                <Flame className="w-5 h-5 text-red-500" fill="currentColor" />
              </div>
              <div>
                <h3 className="font-black text-red-400 text-sm uppercase tracking-wide">Flash Sale</h3>
                <p className="text-xs text-red-200/60 font-medium">Premium uchun -50% chegirma</p>
              </div>
            </div>
            <div className="relative z-10 flex items-center gap-1 font-mono font-bold text-xl text-white bg-black/30 px-3 py-1 rounded-lg border border-white/10">
              <span>{String(timeLeft.h).padStart(2, '0')}</span>:
              <span>{String(timeLeft.m).padStart(2, '0')}</span>:
              <span>{String(timeLeft.s).padStart(2, '0')}</span>
            </div>
          </div>

          {/* Premium Section - Re-enhanced */}
          <div className="relative overflow-hidden rounded-3xl bg-[#1e1b4b]/40 border border-violet-500/20 p-6">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Star className="w-24 h-24 text-amber-400" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-500/20 p-2 rounded-lg">
                    <Lock className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Premium tariflar</h3>
                </div>
                <Star className="w-5 h-5 text-amber-400" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {[
                  "Cheksiz AI testlar",
                  "Batafsil izohlar",
                  "Zaif nuqtalar tahlili",
                  "E-kitoblar va kinolar"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    {text}
                  </div>
                ))}
              </div>

              <Link
                href="/premium"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98]"
              >
                Premium sotib olish
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SuperAppLayout>
  );
}
