import { create } from 'zustand';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  timestamp: string;
  url: string;
  category?: string;
  imageUrl?: string | null;
  sentiment?: 'bullish' | 'bearish' | 'neutral';
}

export interface Market {
  id: string;
  question: string;
  description?: string;
  probability: number;
  volume: number;
  liquidity?: number;
  category: string;
  lastUpdate: string;
  endDate?: string;
  change24h?: number;
  traders?: number;
}

export interface Position {
  id: string;
  marketId: string;
  marketQuestion: string;
  outcome: 'YES' | 'NO';
  shares: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  timestamp: string;
}

export interface PortfolioStats {
  totalValue: number;
  totalPnl: number;
  totalPnlPercent: number;
  winRate: number;
  totalTrades: number;
  activePositions: number;
}

export interface TradeHistoryItem {
  id: string;
  marketQuestion: string;
  outcome: 'YES' | 'NO';
  action: 'BUY' | 'SELL';
  shares: number;
  price: number;
  total: number;
  timestamp: string;
}

interface AppState {
  // News
  newsItems: NewsItem[];
  setNewsItems: (items: NewsItem[]) => void;
  
  // Markets
  markets: Market[];
  setMarkets: (markets: Market[]) => void;
  
  // Portfolio
  positions: Position[];
  setPositions: (positions: Position[]) => void;
  portfolioStats: PortfolioStats;
  setPortfolioStats: (stats: PortfolioStats) => void;
  
  // Watchlist
  watchlist: string[];
  toggleWatchlist: (marketId: string) => void;

  // Trade History
  tradeHistory: TradeHistoryItem[];
  setTradeHistory: (history: TradeHistoryItem[]) => void;

  // UI State
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  activeTab: 'news' | 'markets' | 'portfolio' | 'settings';
  setActiveTab: (tab: AppState['activeTab']) => void;
  
  // Settings
  settings: {
    notifications: boolean;
    darkMode: boolean;
    refreshInterval: number;
    showPnlPercent: boolean;
  };
  updateSettings: (settings: Partial<AppState['settings']>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // News
  newsItems: [],
  setNewsItems: (items) => set({ newsItems: items }),
  
  // Markets
  markets: [],
  setMarkets: (markets) => set({ markets }),
  
  // Portfolio
  positions: [],
  setPositions: (positions) => set({ positions }),
  portfolioStats: {
    totalValue: 0,
    totalPnl: 0,
    totalPnlPercent: 0,
    winRate: 0,
    totalTrades: 0,
    activePositions: 0,
  },
  setPortfolioStats: (stats) => set({ portfolioStats: stats }),

  // Watchlist
  watchlist: [],
  toggleWatchlist: (marketId) =>
    set((state) => ({
      watchlist: state.watchlist.includes(marketId)
        ? state.watchlist.filter((id) => id !== marketId)
        : [...state.watchlist, marketId],
    })),

  // Trade History
  tradeHistory: [],
  setTradeHistory: (history) => set({ tradeHistory: history }),
  
  // UI State
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  activeTab: 'news',
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  // Settings
  settings: {
    notifications: true,
    darkMode: true,
    refreshInterval: 60000,
    showPnlPercent: true,
  },
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),
}));
