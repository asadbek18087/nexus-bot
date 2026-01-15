'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-violet-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm text-slate-400">Nexus AI v2.0 Live</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Nexus AI Super App
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Ta'lim, ko'ngilochar va sun'iy intellektning yagona markazi. 
            Testlar yeching, kitoblar o'qing va AI yordamida rivojlaning.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/hub" 
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-xl bg-violet-600 px-8 font-medium text-white transition-all duration-300 hover:bg-violet-700 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(124,58,237,0.5)]"
            >
              <span className="mr-2">Boshlash</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <Link 
              href="/auth/signin" 
              className="inline-flex h-12 items-center justify-center rounded-xl bg-slate-900 px-8 font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white border border-slate-800"
            >
              Kirish
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-violet-500/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-violet-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI Yordamchi</h3>
            <p className="text-slate-400">GPT-4 va Copilot asosida ishlaydigan aqlli yordamchi bilan istalgan savolga javob oling.</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-indigo-500/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Tezkor Testlar</h3>
            <p className="text-slate-400">PDF kitoblarni yuklang va bir zumda testlarga aylantiring. Bilimingizni sinang.</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Xavfsiz Tizim</h3>
            <p className="text-slate-400">Ma'lumotlaringiz himoyalangan va xavfsiz serverlarda saqlanadi.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
