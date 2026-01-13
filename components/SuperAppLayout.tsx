"use client";

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Grid3x3, Backpack, Crown, Plus, Sparkles, Bell, Flame, User, BrainCircuit } from 'lucide-react';
import { useEconomyStore } from '@/stores/economyStore';
import { useNotificationStore } from '@/stores/notificationStore';
import Link from 'next/link';
import NotificationPanel from '@/components/features/notification-panel';

interface SuperAppLayoutProps {
  children: ReactNode;
}

export default function SuperAppLayout({ children }: SuperAppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { coins, isPremium } = useEconomyStore();
  const { unreadCount } = useNotificationStore();
  const [mounted, setMounted] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setMounted(true);
    
    // Streak logic
    const lastVisit = localStorage.getItem('nexus_last_visit');
    const savedStreak = parseInt(localStorage.getItem('nexus_streak') || '0');
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (lastVisit === yesterday) {
      const newStreak = savedStreak + 1;
      setStreak(newStreak);
      localStorage.setItem('nexus_streak', newStreak.toString());
    } else if (lastVisit !== today) {
      setStreak(1);
      localStorage.setItem('nexus_streak', '1');
    } else {
      setStreak(savedStreak || 1);
    }
    localStorage.setItem('nexus_last_visit', today);
  }, []);

  const tabs = [
    { id: 'hub', label: 'Hub', icon: Grid3x3, href: '/hub' },
    { id: 'quiz', label: 'AI Quiz', icon: BrainCircuit, href: '/quiz' },
    { id: 'inventory', label: 'Resurslar', icon: Backpack, href: '/inventory' },
    { id: 'profile', label: 'Profil', icon: User, href: '/profile' },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col relative overflow-hidden">
      {/* Background Neon Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-slate-950/60 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left Actions - Premium & Streak */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/premium')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-600/20 to-violet-600/10 border border-violet-500/30 hover:border-violet-400/50 transition-all"
            >
              {isPremium ? (
                <>
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs font-medium text-yellow-400">Premium</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span className="text-xs font-medium text-violet-400">Get Premium</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold text-orange-500">{streak}</span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button
              onClick={() => setIsNotificationOpen(true)}
              className="relative p-2 rounded-full hover:bg-slate-800 transition-colors"
            >
              <Bell className="w-5 h-5 text-slate-400" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900" />
              )}
            </button>

            {/* Coin Balance */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/50 border border-cyan-500/30">
                <span className="text-lg font-bold text-cyan-400">{coins.toLocaleString()}</span>
              </div>
              <button
                onClick={() => router.push('/buy-coins')}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-cyan-500/25"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-16">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/60 backdrop-blur-xl border-t border-white/5">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href);
            const Icon = tab.icon;
            
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'text-violet-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
      />
    </div>
  );
}
