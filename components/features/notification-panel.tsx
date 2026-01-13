"use client";

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Bell, Info, AlertTriangle, Gift, MessageSquare } from 'lucide-react';
import { useNotificationStore, NotificationType } from '@/stores/notificationStore';
import { useRouter } from 'next/navigation';

export default function NotificationPanel({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const { notifications, markAsRead, removeNotification, markAllAsRead, clearAll } = useNotificationStore();
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'info': return <Info className="w-5 h-5 text-blue-400" />;
      case 'success': return <Check className="w-5 h-5 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'reward': return <Gift className="w-5 h-5 text-purple-400" />;
      case 'message': return <MessageSquare className="w-5 h-5 text-pink-400" />;
      default: return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            ref={panelRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-slate-900 border-l border-slate-800 z-50 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-violet-400" />
                  <h2 className="font-bold text-lg">Notifications</h2>
                  {notifications.length > 0 && (
                    <span className="bg-violet-600 text-xs px-2 py-0.5 rounded-full">
                      {notifications.length}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <Bell className="w-12 h-12 mb-4 opacity-20" />
                    <p>No new notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className={`relative p-4 rounded-xl border transition-colors ${
                        notification.read 
                          ? 'bg-slate-800/30 border-slate-800' 
                          : 'bg-slate-800 border-slate-700'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex gap-4">
                        <div className={`mt-1 p-2 rounded-lg bg-slate-900 h-fit`}>
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className={`font-semibold ${notification.read ? 'text-slate-400' : 'text-white'}`}>
                              {notification.title}
                            </h3>
                            <span className="text-xs text-slate-500">
                              {formatTime(notification.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-slate-400 mb-3">
                            {notification.message}
                          </p>
                          {notification.link && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                                router.push(notification.link!);
                              }}
                              className="text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors"
                            >
                              {notification.actionLabel || 'View Details'} →
                            </button>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                          className="absolute top-2 right-2 p-1 text-slate-600 hover:text-slate-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      {!notification.read && (
                        <div className="absolute top-4 right-4 w-2 h-2 bg-violet-500 rounded-full" />
                      )}
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-800 bg-slate-900">
                <button
                  onClick={markAllAsRead}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
