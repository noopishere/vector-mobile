import { useQuery } from '@tanstack/react-query';
import { NewsItem, Market, Position, PortfolioStats } from '../store/useAppStore';
import { dummyNews, dummyMarkets, dummyPositions, portfolioStats } from '../data/dummyData';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: async (): Promise<NewsItem[]> => {
      await delay(600);
      // Simulate some variability in timestamps
      return dummyNews.map(item => ({
        ...item,
        timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24).toISOString(),
      }));
    },
    staleTime: 60000,
  });
};

export const useMarkets = () => {
  return useQuery({
    queryKey: ['markets'],
    queryFn: async (): Promise<Market[]> => {
      await delay(500);
      // Simulate small probability changes
      return dummyMarkets.map(market => ({
        ...market,
        probability: Math.min(0.99, Math.max(0.01, market.probability + (Math.random() - 0.5) * 0.02)),
        lastUpdate: new Date().toISOString(),
      }));
    },
    staleTime: 30000,
  });
};

export const usePositions = () => {
  return useQuery({
    queryKey: ['positions'],
    queryFn: async (): Promise<Position[]> => {
      await delay(400);
      // Update current prices slightly
      return dummyPositions.map(pos => {
        const priceChange = (Math.random() - 0.5) * 0.02;
        const newPrice = Math.min(0.99, Math.max(0.01, pos.currentPrice + priceChange));
        const newPnl = (newPrice - pos.avgPrice) * pos.shares * (pos.outcome === 'YES' ? 1 : -1);
        const newPnlPercent = ((newPrice - pos.avgPrice) / pos.avgPrice) * 100 * (pos.outcome === 'YES' ? 1 : -1);
        return {
          ...pos,
          currentPrice: newPrice,
          pnl: Number(newPnl.toFixed(2)),
          pnlPercent: Number(newPnlPercent.toFixed(2)),
        };
      });
    },
    staleTime: 15000,
  });
};

export const usePortfolioStats = () => {
  return useQuery({
    queryKey: ['portfolioStats'],
    queryFn: async (): Promise<PortfolioStats> => {
      await delay(300);
      // Small variations in stats
      return {
        ...portfolioStats,
        totalValue: portfolioStats.totalValue + (Math.random() - 0.5) * 20,
        totalPnl: portfolioStats.totalPnl + (Math.random() - 0.5) * 5,
        totalPnlPercent: portfolioStats.totalPnlPercent + (Math.random() - 0.5) * 0.5,
      };
    },
    staleTime: 15000,
  });
};

export const useMarketById = (id: string) => {
  return useQuery({
    queryKey: ['market', id],
    queryFn: async (): Promise<Market | undefined> => {
      await delay(300);
      return dummyMarkets.find(m => m.id === id);
    },
    staleTime: 30000,
    enabled: !!id,
  });
};
