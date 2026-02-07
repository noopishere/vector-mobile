import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { colors } from '../theme/colors';
import { NewsItem, Market } from '../store/useAppStore';
import { MarketCard } from './MarketCard';

interface NewsCardProps {
  news: NewsItem;
  index?: number;
  attachedMarkets?: Market[];
  onPress?: (news: NewsItem) => void;
  onMarketPress?: (market: Market) => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({ 
  news, 
  index = 0,
  attachedMarkets = [],
  onPress,
  onMarketPress,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'bullish': return colors.success;
      case 'bearish': return colors.error;
      default: return colors.text.tertiary;
    }
  };

  return (
    <Animated.View
      style={[
        styles.card,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <TouchableOpacity activeOpacity={0.7} onPress={() => onPress?.(news)}>
        <View style={styles.header}>
          <View style={styles.sourceRow}>
            <Text style={styles.source}>{news.source}</Text>
            {news.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{news.category}</Text>
              </View>
            )}
          </View>
          <Text style={styles.time}>{formatTime(news.timestamp)}</Text>
        </View>
        
        <Text style={styles.title}>{news.title}</Text>
        <Text style={styles.summary} numberOfLines={2}>{news.summary}</Text>
        
        {news.sentiment && (
          <View style={styles.sentimentRow}>
            <View style={[styles.sentimentDot, { backgroundColor: getSentimentColor(news.sentiment) }]} />
            <Text style={[styles.sentimentText, { color: getSentimentColor(news.sentiment) }]}>
              {news.sentiment.charAt(0).toUpperCase() + news.sentiment.slice(1)}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      
      {attachedMarkets.length > 0 && (
        <View style={styles.marketsContainer}>
          <Text style={styles.marketsLabel}>Related Markets</Text>
          {attachedMarkets.map((market) => (
            <MarketCard 
              key={market.id} 
              market={market} 
              compact 
              onPress={onMarketPress}
            />
          ))}
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  source: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  categoryBadge: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  time: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.text.tertiary,
  },
  title: {
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
    color: colors.white,
    lineHeight: 24,
    marginBottom: 8,
  },
  summary: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.text.secondary,
    lineHeight: 20,
  },
  sentimentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  sentimentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sentimentText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  marketsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  marketsLabel: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
});
