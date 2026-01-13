import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'message' | 'reward';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  link?: string;
  actionLabel?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      
      addNotification: (notification) => set((state) => {
        const newNotification: Notification = {
          ...notification,
          id: Math.random().toString(36).substring(7),
          timestamp: Date.now(),
          read: false,
        };
        
        return {
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        };
      }),
      
      markAsRead: (id) => set((state) => {
        const newNotifications = state.notifications.map((n) => 
          n.id === id ? { ...n, read: true } : n
        );
        return {
          notifications: newNotifications,
          unreadCount: newNotifications.filter((n) => !n.read).length,
        };
      }),
      
      markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      })),
      
      removeNotification: (id) => set((state) => {
        const newNotifications = state.notifications.filter((n) => n.id !== id);
        return {
          notifications: newNotifications,
          unreadCount: newNotifications.filter((n) => !n.read).length,
        };
      }),
      
      clearAll: () => set({ notifications: [], unreadCount: 0 }),
    }),
    {
      name: 'notification-storage',
    }
  )
);
