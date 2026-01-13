"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Zap, Trophy, Shield, Play, Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SuperAppLayout from '@/components/SuperAppLayout';
import { QuantumCard, QuantumButton } from '@/components/quantum-effects';

export default function GroupQuizPage() {
  const router = useRouter();
  const [isSearching, setIsGenerating] = useState(false);

  const startBattle = () => {
    setIsGenerating(true);
    // Simulate matchmaking
    setTimeout(() => {
      setIsGenerating(false);
      alert("Raqib topilmadi. Hozircha bu funksiya beta testda!");
    }, 3000);
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
            <h1 className="text-xl font-bold">Guruh testi</h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-4 py-8">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
              <Users className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold mb-2 text-white">Duel Rejimi</h2>
            <p className="text-slate-400">Do'stlaringiz yoki tasodifiy raqiblar bilan real vaqtda bilimingizni sinashga tayyormisiz?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <QuantumCard className="p-6 flex flex-col items-center text-center space-y-4 hover:border-emerald-500/30 transition-all">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Tezkor O'yin</h3>
                <p className="text-xs text-slate-500">Tasodifiy raqib bilan 1vs1 duel</p>
              </div>
              <QuantumButton onClick={startBattle} disabled={isSearching} className="w-full">
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Raqib qidirish"}
              </QuantumButton>
            </QuantumCard>

            <QuantumCard className="p-6 flex flex-col items-center text-center space-y-4 hover:border-violet-500/30 transition-all">
              <div className="w-12 h-12 bg-violet-500/10 rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Xona yaratish</h3>
                <p className="text-xs text-slate-500">Do'stlarni taklif qiling</p>
              </div>
              <QuantumButton variant="secondary" className="w-full">Xona yaratish</QuantumButton>
            </QuantumCard>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2">Top Duelchilar</h4>
            {[
              { name: "Walter White", rank: "Diamond", xp: "12,450", winRate: "92%" },
              { name: "Jesse Pinkman", rank: "Gold", xp: "8,200", winRate: "75%" },
              { name: "Gustavo Fring", rank: "Master", xp: "15,100", winRate: "98%" },
            ].map((user, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-800 rounded-full border border-white/10 flex items-center justify-center font-bold text-slate-400">
                    {i + 1}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-200">{user.name}</h5>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-violet-500/20 text-violet-400 px-1.5 py-0.5 rounded font-bold uppercase">{user.rank}</span>
                      <span className="text-[10px] text-slate-500">{user.xp} XP</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-400">{user.winRate}</div>
                  <div className="text-[10px] text-slate-500">Win Rate</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SuperAppLayout>
  );
}
