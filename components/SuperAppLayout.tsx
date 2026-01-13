"use client";

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Gamepad2, Grid3x3, Backpack, Crown, Plus, Sparkles, Bell } from 'lucide-react';
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs = [
    { id: 'game', label: 'Play', icon: Gamepad2, href: '/game' },
    { id: 'hub', label: 'Hub', icon: Grid3x3, href: '/hub' },
    { id: 'inventory', label: 'My Stuff', icon: Backpack, href: '/inventory' },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-lg border-b border-violet-500/20">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Premium Status */}
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
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-violet-500/20">
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
