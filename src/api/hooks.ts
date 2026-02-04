import { useQuery } from '@tanstack/react-query';
import { NewsItem, Market } from '../store/useAppStore';

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Federal Reserve Signals Potential Rate Cut',
    summary: 'Markets react to latest Fed comments suggesting policy shift in Q2',
    source: 'Financial Times',
    timestamp: new Date().toISOString(),
    url: 'https://example.com/news/1',
    category: 'Finance',
  },
  {
    id: '2',
    title: 'AI Regulation Framework Advances in EU',
    summary: 'European Parliament moves closer to comprehensive AI governance',
    source: 'Reuters',
    timestamp: new Date().toISOString(),
    url: 'https://example.com/news/2',
    category: 'Technology',
  },
  {
    id: '3',
    title: 'Climate Summit Yields New Carbon Commitments',
    summary: 'Major economies pledge accelerated emissions targets',
    source: 'BBC',
    timestamp: new Date().toISOString(),
    url: 'https://example.com/news/3',
    category: 'Politics',
  },
];

const mockMarkets: Market[] = [
  {
    id: '1',
    question: 'Will Fed cut rates in March 2026?',
    probability: 0.72,
    volume: 1250000,
    category: 'Economics',
    lastUpdate: new Date().toISOString(),
  },
  {
    id: '2',
    question: 'Will GPT-5 be released by Q2 2026?',
    probability: 0.45,
    volume: 890000,
    category: 'Technology',
    lastUpdate: new Date().toISOString(),
  },
  {
    id: '3',
    question: 'Will Bitcoin exceed $150K in 2026?',
    probability: 0.38,
    volume: 2100000,
    category: 'Crypto',
    lastUpdate: new Date().toISOString(),
  },
  {
    id: '4',
    question: 'Will EU pass AI Act amendments by June?',
    probability: 0.81,
    volume: 450000,
    category: 'Politics',
    lastUpdate: new Date().toISOString(),
  },
];

export const useNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: async (): Promise<NewsItem[]> => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockNews;
    },
    staleTime: 60000,
  });
};

export const useMarkets = () => {
  return useQuery({
    queryKey: ['markets'],
    queryFn: async (): Promise<Market[]> => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockMarkets;
    },
    staleTime: 30000,
  });
};
