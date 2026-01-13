"use client";

import { useState } from 'react';
import SuperAppLayout from '@/components/SuperAppLayout';
import Link from 'next/link';
import { Wrench, Film, ChevronRight, BrainCircuit, Mic, Award, Sparkles, Brain } from 'lucide-react';

export default function HubPage() {
  const [activeTab, setActiveTab] = useState<'tools' | 'media'>('tools');

  return (
    <SuperAppLayout>
      <div className="min-h-screen p-4">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 p-1 bg-slate-800/50 rounded-xl">
          <button
            onClick={() => setActiveTab('tools')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'tools'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wrench className="w-5 h-5" />
            Tools
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'media'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-5 h-5" />
            Media
          </button>
        </div>

        {/* Content */}
        {activeTab === 'tools' && (
          <div className="space-y-4">
            <Link
              href="/hub/tools/pdf-quiz"
              className="block p-4 bg-slate-800/50 rounded-xl border border-violet-500/20 hover:border-violet-400/50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">PDF to Quiz</h3>
                  <p className="text-slate-400 text-sm">Convert any PDF into an interactive quiz</p>
                </div>
                <ChevronRight className="w-5 h-5 text-violet-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/hub/tools/quiz-generator"
              className="block p-4 bg-slate-800/50 rounded-xl border border-violet-500/20 hover:border-violet-400/50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="bg-violet-500/10 p-2 rounded-lg">
                    <BrainCircuit className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">AI Quiz Generator</h3>
                    <p className="text-slate-400 text-sm">Generate quizzes from any topic</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-violet-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/hub/tools/mindmap"
              className="block p-4 bg-slate-800/50 rounded-xl border border-violet-500/20 hover:border-violet-400/50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Mind Map</h3>
                  <p className="text-slate-400 text-sm">Create dynamic mind maps for any topic</p>
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
                  <p className="text-slate-400 text-sm">Study with swipeable flashcards</p>
                </div>
                <ChevronRight className="w-5 h-5 text-violet-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/hub/tools/speech-to-text"
              className="block p-4 bg-slate-800/50 rounded-xl border border-violet-500/20 hover:border-violet-400/50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="bg-violet-500/10 p-2 rounded-lg">
                    <Mic className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Speech to Text</h3>
                    <p className="text-slate-400 text-sm">Convert speech to text in real-time</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-violet-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/hub/tools/ai-tools"
              className="block p-4 bg-slate-800/50 rounded-xl border border-violet-500/20 hover:border-violet-400/50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="bg-violet-500/10 p-2 rounded-lg">
                    <Brain className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">AI Tools</h3>
                    <p className="text-slate-400 text-sm">Copilot & Gemini integration</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-violet-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/hub/certificates"
              className="block p-4 bg-slate-800/50 rounded-xl border border-violet-500/20 hover:border-violet-400/50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="bg-violet-500/10 p-2 rounded-lg">
                    <Award className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Certificates</h3>
                    <p className="text-slate-400 text-sm">View your earned achievements</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-violet-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="space-y-4">
            <Link
              href="/hub/media/movies"
              className="block p-4 bg-slate-800/50 rounded-xl border border-cyan-500/20 hover:border-cyan-400/50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Movies</h3>
                  <p className="text-slate-400 text-sm">Browse and purchase premium movies</p>
                </div>
                <ChevronRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/hub/media/books"
              className="block p-4 bg-slate-800/50 rounded-xl border border-cyan-500/20 hover:border-cyan-400/50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">E-Books</h3>
                  <p className="text-slate-400 text-sm">Access our collection of e-books</p>
                </div>
                <ChevronRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        )}
      </div>
    </SuperAppLayout>
  );
}
