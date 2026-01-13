import { create } from 'zustand';
import { getUserCoins } from '@/actions/economy';

interface SecureEconomyState {
  coins: number;
  isPremium: boolean;
  energy: number;
  loading: boolean;
  
  // Actions
  refreshBalance: (telegramId: string | bigint) => Promise<void>;
  setPremium: (status: boolean) => void;
  setEnergy: (amount: number) => void;
}

export const useSecureEconomyStore = create<SecureEconomyState>((set, get) => ({
  coins: 0,
  isPremium: false,
  energy: 100,
  loading: false,

  refreshBalance: async (telegramId: string | bigint) => {
    set({ loading: true });
    try {
      const coins = await getUserCoins(telegramId);
      set({ coins, loading: false });
    } catch (error) {
      console.error('Failed to refresh balance:', error);
      set({ loading: false });
    }
  },

  setPremium: (status) => set({ isPremium: status }),
  setEnergy: (amount) => set({ energy: amount })
}));
