import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Pressable,
} from 'react-native';
import { colors, spacing } from '../theme/colors';
import { NewsItem } from '../store/useAppStore';

interface NewsCardProps {
  item: NewsItem;
  onPress?: () => void;
  index?: number;
}

export const NewsCard: React.FC<NewsCardProps> = ({ item, onPress, index = 0 }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Staggered entrance animation
  useEffect(() => {
    const delay = index * 100; // 100ms stagger between cards
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'JUST NOW';
    if (minutes < 60) return `${minutes}M AGO`;
    if (hours < 24) return `${hours}H AGO`;
    if (days === 1) return 'YESTERDAY';
    return `${days}D AGO`;
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'bullish': return colors.bullish;
      case 'bearish': return colors.bearish;
      default: return colors.textDim;
    }
  };

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'bullish': return '↑';
      case 'bearish': return '↓';
      default: return '•';
    }
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim },
            ],
          },
        ]}
      >
        {/* Category Badge & Time */}
        <View style={styles.header}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category || 'NEWS'}</Text>
          </View>
          <View style={styles.metaRight}>
            {item.sentiment && (
              <Text style={[styles.sentimentIcon, { color: getSentimentColor(item.sentiment) }]}>
                {getSentimentIcon(item.sentiment)}
              </Text>
            )}
            <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        {/* Summary */}
        <Text style={styles.summary} numberOfLines={2}>
          {item.summary}
        </Text>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.sourceContainer}>
            <View style={styles.sourceDot} />
            <Text style={styles.source}>{item.source.toUpperCase()}</Text>
          </View>
          <Text style={styles.readMore}>READ →</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryBadge: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs - 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  categoryText: {
    fontFamily: 'monospace',
    fontSize: 9,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 1.5,
  },
  metaRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sentimentIcon: {
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 'bold',
  },
  timestamp: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: colors.textDim,
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: 'monospace',
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    lineHeight: 22,
    letterSpacing: -0.3,
  },
  summary: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.md,
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sourceDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textDim,
  },
  source: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: colors.textDim,
    letterSpacing: 1,
  },
  readMore: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default NewsCard;
