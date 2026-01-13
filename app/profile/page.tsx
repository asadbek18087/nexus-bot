"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings, 
  Trophy, 
  Target, 
  Zap, 
  Flame, 
  Coins, 
  ChevronRight, 
  ShieldCheck, 
  Award, 
  LogOut,
  Bell,
  Star,
  Activity,
  Crown,
  History,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import SuperAppLayout from '@/components/SuperAppLayout';
import { QuantumCard, QuantumButton } from '@/components/quantum-effects';
import { useEconomyStore } from '@/stores/economyStore';

export default function ProfilePage() {
  const router = useRouter();
  const { coins, isPremium, xp, level } = useEconomyStore();
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'achievements' | 'dna'>('overview');
  const [categoryStats, setCategoryStats] = useState<Record<string, { total: number; correct: number }>>({});

  useEffect(() => {
    setMounted(true);
    const savedStats = JSON.parse(localStorage.getItem('nexus_category_stats') || '{}');
    setCategoryStats(savedStats);
  }, []);

  if (!mounted) return null;

  const xpToNext = level * 1000;
  const streak = parseInt(localStorage.getItem('nexus_streak') || '0');

  const stats = [
    { label: "Daraja", value: level.toString(), icon: Star, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Tajriba (XP)", value: xp.toLocaleString(), icon: Zap, color: "text-violet-400", bg: "bg-violet-400/10" },
    { label: "Balans", value: coins.toLocaleString(), icon: Coins, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Streak", value: `${streak} kun`, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  const achievements = [
    { name: "Tezkor Bilimdon", icon: Zap, desc: "10 ta testni 1 daqiqadan kam vaqtda yeching", earned: true },
    { name: "Xatosiz", icon: ShieldCheck, desc: "Ketma-ket 5 ta testni 100% natija bilan yeching", earned: true },
    { name: "Kvant Ustasi", icon: Award, desc: "Fizika bo'limida 50 ta test yeching", earned: false },
    { name: "Oltin A'zo", icon: Crown, desc: "Premium tarifni faollashtiring", earned: isPremium },
  ];

  return (
    <SuperAppLayout>
      <div className="min-h-screen bg-slate-950 pb-24">
        {/* Profile Header */}
        <div className="relative h-48 bg-gradient-to-br from-violet-600 to-indigo-900 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <Activity className="w-64 h-64 absolute -bottom-10 -right-10 text-white" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end gap-6 translate-y-1/2">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-slate-900 border-4 border-slate-950 flex items-center justify-center shadow-2xl overflow-hidden">
                <User className="w-12 h-12 text-slate-500" />
              </div>
              {isPremium && (
                <div className="absolute -top-2 -right-2 bg-amber-500 rounded-full p-1.5 border-4 border-slate-950 shadow-lg">
                  <Crown className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="mb-2 text-left">
              <h1 className="text-2xl font-black text-white">Uolter Uayt</h1>
              <p className="text-slate-400 text-sm font-medium">@walter_white</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-16 px-4 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {stats.map((stat, i) => (
            <div key={i} className="bg-slate-900/40 rounded-2xl p-4 border border-white/5 text-center">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-lg font-black text-white leading-tight">{stat.value}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="px-4 mt-8 space-y-6 max-w-4xl mx-auto">
          {/* Coins & Premium Card */}
          <QuantumCard className="p-6 bg-gradient-to-r from-slate-900/60 to-slate-900/40 border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/20">
                  <Coins className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Mening Balansim</h3>
                  <div className="text-2xl font-black text-white">{coins.toLocaleString()} tanga</div>
                </div>
              </div>
              <button 
                onClick={() => router.push('/buy-coins')}
                className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all shadow-lg shadow-cyan-600/20"
              >
                To'ldirish
              </button>
            </div>
          </QuantumCard>

          {/* Achievements */}
          <div>
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                Yutuqlar
              </h2>
              <button className="text-xs text-slate-500 font-bold hover:text-white transition-colors">Barchasi</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {achievements.map((ach, i) => (
                <div 
                  key={i} 
                  className={`p-4 rounded-2xl border transition-all flex gap-4 ${
                    ach.earned 
                      ? 'bg-slate-900/40 border-white/5' 
                      : 'bg-slate-950 border-white/[0.02] grayscale opacity-50'
                  }`}
                >
                  <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${ach.earned ? 'bg-violet-500/10' : 'bg-slate-800'}`}>
                    <ach.icon className={`w-6 h-6 ${ach.earned ? 'text-violet-400' : 'text-slate-600'}`} />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-slate-200 text-sm">{ach.name}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{ach.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Global Leaderboard */}
          <div>
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                Global Reyting
              </h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full font-bold uppercase">Siz: #124</span>
            </div>
            <div className="bg-slate-900/40 rounded-3xl border border-white/5 overflow-hidden mb-8">
              {[
                { rank: 1, name: "Azizbek", xp: "45,200", streak: 42, color: "text-amber-400" },
                { rank: 2, name: "Madina", xp: "38,150", streak: 28, color: "text-slate-300" },
                { rank: 3, name: "Sardor", xp: "32,900", streak: 15, color: "text-orange-400" },
              ].map((user, i) => (
                <div key={i} className={`flex items-center justify-between p-4 ${i !== 2 ? 'border-b border-white/5' : ''} hover:bg-white/[0.02] transition-colors`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${user.color} bg-white/5`}>
                      {user.rank}
                    </div>
                    <div>
                      <div className="font-bold text-slate-200 text-sm">{user.name}</div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <Zap className="w-3 h-3" /> {user.xp} XP
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-orange-500/10 px-2 py-1 rounded-lg">
                    <Flame className="w-3 h-3 text-orange-500" />
                    <span className="text-[10px] font-bold text-orange-500">{user.streak}</span>
                  </div>
                </div>
              ))}
              <button className="w-full py-3 bg-white/[0.02] text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:text-slate-300 transition-colors">
                To'liq ro'yxatni ko'rish
              </button>
            </div>
          </div>

          {/* Weakness Tracker (Mavzular tahlili) */}
          {Object.keys(categoryStats).length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-400" />
                  Mavzular tahlili
                </h2>
              </div>
              <div className="bg-slate-900/40 rounded-3xl border border-white/5 p-6 space-y-6">
                {Object.entries(categoryStats).map(([cat, stat]) => {
                  const perc = Math.round((stat.correct / stat.total) * 100);
                  return (
                    <div key={cat} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-300">{cat}</span>
                        <span className={`text-xs font-black ${perc < 50 ? 'text-red-400' : perc < 80 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                          {perc}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-white/[0.02]">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${perc}%` }}
                          className={`h-full ${perc < 50 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : perc < 80 ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'}`} 
                        />
                      </div>
                      {perc < 50 && (
                        <div className="flex items-center gap-1.5 text-[10px] text-red-400/60 italic font-medium">
                          <AlertCircle className="w-3 h-3" />
                          Ushbu mavzuda ko'proq ishlash tavsiya etiladi
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white mb-4 px-2 flex items-center gap-2">
              <Settings className="w-5 h-5 text-slate-400" />
              Sozlamalar
            </h2>
            <button className="w-full flex items-center justify-between p-5 bg-slate-900/40 rounded-2xl border border-white/5 hover:bg-slate-900/60 transition-all group">
              <div className="flex items-center gap-4">
                <div className="bg-slate-800 p-2.5 rounded-xl">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <span className="font-bold text-sm text-slate-200">Profilni tahrirlash</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full flex items-center justify-between p-5 bg-slate-900/40 rounded-2xl border border-white/5 hover:bg-slate-900/60 transition-all group">
              <div className="flex items-center gap-4">
                <div className="bg-slate-800 p-2.5 rounded-xl">
                  <Bell className="w-5 h-5 text-slate-400" />
                </div>
                <span className="font-bold text-sm text-slate-200">Bildirishnomalar</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => router.push('/premium')}
              className="w-full flex items-center justify-between p-5 bg-slate-900/40 rounded-2xl border border-white/5 hover:bg-slate-900/60 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-amber-500/10 p-2.5 rounded-xl">
                  <Crown className="w-5 h-5 text-amber-400" />
                </div>
                <span className="font-bold text-sm text-slate-200">Obuna boshqaruvi</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full flex items-center justify-between p-5 bg-red-500/5 rounded-2xl border border-red-500/10 hover:bg-red-500/10 transition-all group mt-4">
              <div className="flex items-center gap-4">
                <div className="bg-red-500/10 p-2.5 rounded-xl">
                  <LogOut className="w-5 h-5 text-red-400" />
                </div>
                <span className="font-bold text-sm text-red-400">Chiqish</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </SuperAppLayout>
  );
}
