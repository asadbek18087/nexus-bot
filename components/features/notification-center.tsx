"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff, Settings, X, Check, Info } from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Achievement Unlocked!',
      message: 'You completed your first lesson. Keep going!',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      read: false
    },
    {
      id: '2',
      type: 'info',
      title: 'New Friend Request',
      message: 'Alex Chen sent you a friend request',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false
    },
    {
      id: '3',
      type: 'warning',
      title: 'Daily Bonus Available',
      message: 'Spin the wheel for your daily bonus!',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true
    }
  ]);

  const [showSettings, setShowSettings] = useState(false);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="bg-gray-900 rounded-xl p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-2">
          <Bell className="w-8 h-8 text-blue-500" />
          Notification Center
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {unreadCount > 0 && (
        <div className="mb-4">
          <button
            onClick={markAllAsRead}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            Mark all as read
          </button>
        </div>
      )}

      <div className="space-y-3">
        {notifications.map(notification => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`bg-gray-800 rounded-lg p-4 border-l-4 ${
              notification.read ? 'opacity-75' : ''
            } ${getTypeColor(notification.type)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-semibold">{notification.title}</h3>
                  {!notification.read && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </div>
                <p className="text-gray-300 text-sm mb-2">{notification.message}</p>
                <p className="text-gray-500 text-xs">
                  {notification.timestamp.toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="p-1 text-green-400 hover:text-green-300 transition-all"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="p-1 text-red-400 hover:text-red-300 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-12">
          <BellOff className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No notifications</p>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
