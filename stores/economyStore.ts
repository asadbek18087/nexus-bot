import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  type: 'tool' | 'movie' | 'book';
  title: string;
  priceCoins: number;
  fileId?: string;
  isPremiumOnly: boolean;
  description?: string;
  icon?: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  purchasedAt: string;
}

interface EconomyState {
  coins: number;
  xp: number;
  level: number;
  isPremium: boolean;
  inventory: InventoryItem[];
  
  // Actions
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  addXp: (amount: number) => void;
  setPremium: (status: boolean) => void;
  addToInventory: (item: InventoryItem) => void;
  hasItem: (productId: string) => boolean;
}

export const useEconomyStore = create<EconomyState>()(
  persist(
    (set, get) => ({
      coins: 100, // Initial balance
      xp: 0,
      level: 1,
      isPremium: false,
      inventory: [],

      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
      
      spendCoins: (amount) => {
        const { coins } = get();
        if (coins >= amount) {
          set((state) => ({ coins: state.coins - amount }));
          return true;
        }
        return false;
      },

      addXp: (amount) => set((state) => {
        const newXp = state.xp + amount;
        const newLevel = Math.floor(newXp / 1000) + 1;
        return { xp: newXp, level: newLevel };
      }),

      setPremium: (status) => set({ isPremium: status }),
      
      addToInventory: (item) => set((state) => ({ 
        inventory: [...state.inventory, item] 
      })),
      
      hasItem: (productId) => {
        const { inventory } = get();
        return inventory.some((item) => item.productId === productId);
      }
    }),
    {
      name: 'nexus-economy-storage',
    }
  )
);
