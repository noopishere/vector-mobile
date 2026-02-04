import { create } from 'zustand';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  timestamp: string;
  url: string;
  category?: string;
}

export interface Market {
  id: string;
  question: string;
  probability: number;
  volume: number;
  category: string;
  lastUpdate: string;
}

interface AppState {
  newsItems: NewsItem[];
  setNewsItems: (items: NewsItem[]) => void;
  markets: Market[];
  setMarkets: (markets: Market[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  settings: {
    notifications: boolean;
    darkMode: boolean;
    refreshInterval: number;
  };
  updateSettings: (settings: Partial<AppState['settings']>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  newsItems: [],
  setNewsItems: (items) => set({ newsItems: items }),
  markets: [],
  setMarkets: (markets) => set({ markets }),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  settings: {
    notifications: true,
    darkMode: true,
    refreshInterval: 60000,
  },
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),
}));
