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
import { Market } from '../store/useAppStore';

interface MarketCardProps {
  market: Market;
  onPress?: () => void;
  compact?: boolean;
}

export const MarketCard: React.FC<MarketCardProps> = ({ market, onPress, compact = false }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const probability = Math.round(market.probability * 100);
  const isHigh = probability >= 65;
  const isLow = probability <= 35;
  const isMid = !isHigh && !isLow;

  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: probability,
      useNativeDriver: false,
      tension: 40,
      friction: 7,
    }).start();
  }, [probability]);

  const formatVolume = (vol: number) => {
    if (vol >= 1000000) return `$${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `$${(vol / 1000).toFixed(0)}K`;
    return `$${vol}`;
  };

  const formatChange = (change?: number) => {
    if (!change) return null;
    const sign = change >= 0 ? '+' : '';
    return `${sign}${(change * 100).toFixed(1)}%`;
  };

  const formatTraders = (count?: number) => {
    if (!count) return '';
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const getProbabilityColor = () => {
    if (isHigh) return colors.bullish;
    if (isLow) return colors.bearish;
    return colors.textMuted;
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

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.container,
          compact && styles.containerCompact,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{market.category}</Text>
          </View>
          <View style={styles.headerRight}>
            {market.change24h !== undefined && (
              <Text style={[
                styles.change,
                { color: market.change24h >= 0 ? colors.bullish : colors.bearish }
              ]}>
                {formatChange(market.change24h)}
              </Text>
            )}
            <Text style={styles.volume}>{formatVolume(market.volume)}</Text>
          </View>
        </View>

        {/* Question */}
        <Text style={[styles.question, compact && styles.questionCompact]} numberOfLines={compact ? 2 : 3}>
          {market.question}
        </Text>

        {/* Probability Bar */}
        <View style={styles.probabilitySection}>
          <View style={styles.probabilityBarBg}>
            <Animated.View
              style={[
                styles.probabilityBarFill,
                {
                  width: progressWidth,
                  backgroundColor: getProbabilityColor(),
                },
              ]}
            />
          </View>
          <View style={styles.probabilityLabels}>
            <Text style={styles.probabilityLabel}>YES</Text>
            <Text style={[styles.probabilityValue, { color: getProbabilityColor() }]}>
              {probability}%
            </Text>
          </View>
        </View>

        {/* Trade Buttons */}
        <View style={styles.tradeSection}>
          <TouchableOpacity style={[styles.tradeButton, styles.yesButton]} activeOpacity={0.7}>
            <Text style={styles.yesPrice}>{probability}¢</Text>
            <Text style={styles.yesLabel}>BUY YES</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tradeButton, styles.noButton]} activeOpacity={0.7}>
            <Text style={styles.noPrice}>{100 - probability}¢</Text>
            <Text style={styles.noLabel}>BUY NO</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Stats */}
        {!compact && (
          <View style={styles.footer}>
            {market.traders && (
              <View style={styles.stat}>
                <Text style={styles.statValue}>{formatTraders(market.traders)}</Text>
                <Text style={styles.statLabel}>TRADERS</Text>
              </View>
            )}
            {market.liquidity && (
              <View style={styles.stat}>
                <Text style={styles.statValue}>{formatVolume(market.liquidity)}</Text>
                <Text style={styles.statLabel}>LIQUIDITY</Text>
              </View>
            )}
            {market.endDate && (
              <View style={styles.stat}>
                <Text style={styles.statValue}>{new Date(market.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
                <Text style={styles.statLabel}>CLOSES</Text>
              </View>
            )}
          </View>
        )}
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
  containerCompact: {
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryBadge: {
    backgroundColor: colors.secondary + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs - 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.secondary + '30',
  },
  categoryText: {
    fontFamily: 'monospace',
    fontSize: 9,
    fontWeight: '700',
    color: colors.secondary,
    letterSpacing: 1.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  change: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  volume: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: colors.textDim,
    letterSpacing: 0.3,
  },
  question: {
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
    lineHeight: 21,
    letterSpacing: -0.2,
  },
  questionCompact: {
    fontSize: 13,
    marginBottom: spacing.sm,
  },
  probabilitySection: {
    marginBottom: spacing.md,
  },
  probabilityBarBg: {
    height: 8,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  probabilityBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  probabilityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  probabilityLabel: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: colors.textDim,
    letterSpacing: 1,
  },
  probabilityValue: {
    fontFamily: 'monospace',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tradeSection: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tradeButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yesButton: {
    backgroundColor: colors.bullish + '12',
    borderWidth: 1,
    borderColor: colors.bullish + '30',
  },
  noButton: {
    backgroundColor: colors.bearish + '12',
    borderWidth: 1,
    borderColor: colors.bearish + '30',
  },
  yesPrice: {
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.bullish,
  },
  yesLabel: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: colors.bullish,
    letterSpacing: 1,
    marginTop: 2,
    opacity: 0.8,
  },
  noPrice: {
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.bearish,
  },
  noLabel: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: colors.bearish,
    letterSpacing: 1,
    marginTop: 2,
    opacity: 0.8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  statLabel: {
    fontFamily: 'monospace',
    fontSize: 8,
    color: colors.textDim,
    letterSpacing: 1,
    marginTop: 2,
  },
});

export default MarketCard;
