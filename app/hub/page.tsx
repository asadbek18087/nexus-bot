"use client";

import { useState } from 'react';
import SuperAppLayout from '@/components/SuperAppLayout';
import Link from 'next/link';
import { BrainCircuit, Sparkles, Trophy, Target, Zap, Lock, Star, ChevronRight } from 'lucide-react';

export default function HubPage() {
  return (
    <SuperAppLayout>
      <div className="min-h-screen p-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            AI Quiz Center
          </h1>
          <p className="text-slate-400">Learn & Earn with AI-powered quizzes</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-violet-600/20 to-violet-800/20 p-4 rounded-xl border border-violet-500/20">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-8 h-8 text-violet-400" />
              <span className="text-2xl font-bold text-violet-400">1,250</span>
            </div>
            <p className="text-slate-300">Total Points</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 p-4 rounded-xl border border-cyan-500/20">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-cyan-400" />
              <span className="text-2xl font-bold text-cyan-400">85%</span>
            </div>
            <p className="text-slate-300">Success Rate</p>
          </div>
          <div className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 p-4 rounded-xl border border-amber-500/20">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-8 h-8 text-amber-400" />
              <span className="text-2xl font-bold text-amber-400">7</span>
            </div>
            <p className="text-slate-300">Day Streak 🔥</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* AI Quiz Generator - Featured */}
          <Link
            href="/hub/tools/quiz-generator"
            className="block p-6 bg-gradient-to-br from-violet-600/30 to-cyan-600/30 rounded-xl border border-violet-400/30 hover:border-violet-300/50 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 opacity-20">
              <Sparkles className="w-32 h-32 text-violet-400" />
            </div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="bg-violet-500/20 p-3 rounded-xl">
                    <BrainCircuit className="w-8 h-8 text-violet-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">AI Quiz Generator</h3>
                    <p className="text-slate-300">Generate quizzes with detailed explanations</p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-violet-300 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Other Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/hub/tools/pdf-quiz"
              className="block p-4 bg-slate-800/50 rounded-xl border border-violet-500/20 hover:border-violet-400/50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">PDF to Quiz</h3>
                  <p className="text-slate-400 text-sm">Convert PDFs to interactive quizzes</p>
                </div>
                <ChevronRight className="w-5 h-5 text-violet-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/hub/tools/flashcards"
              className="block p-4 bg-slate-800/50 rounded-xl border border-violet-500/20 hover:border-violet-400/50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Flashcards</h3>
                  <p className="text-slate-400 text-sm">Study with smart flashcards</p>
                </div>
                <ChevronRight className="w-5 h-5 text-violet-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          {/* Premium Section */}
          <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 p-6 rounded-xl border border-amber-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Lock className="w-6 h-6 text-amber-400" />
                <h3 className="text-xl font-bold">Premium Features</h3>
              </div>
              <Star className="w-6 h-6 text-amber-400" />
            </div>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2 text-slate-300">
                <ChevronRight className="w-4 h-4 text-amber-400" />
                <span>Unlimited AI quizzes</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <ChevronRight className="w-4 h-4 text-amber-400" />
                <span>Detailed explanations for every answer</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <ChevronRight className="w-4 h-4 text-amber-400" />
                <span>Weakness tracker & personalized learning</span>
              </li>
            </ul>
            <button
              onClick={() => window.open('https://t.me/nexus_support_bot', '_blank')}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-5 h-5" />
              Upgrade to Premium via Telegram
            </button>
          </div>
        </div>
      </div>
    </SuperAppLayout>
  );
}
