import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';
import { colors, spacing } from '../theme/colors';
import { Position } from '../store/useAppStore';

interface PositionCardProps {
  position: Position;
  onPress?: () => void;
  index?: number;
}

export const PositionCard: React.FC<PositionCardProps> = ({ position, onPress, index = 0 }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pnlPulseAnim = useRef(new Animated.Value(1)).current;

  // Staggered entrance animation
  useEffect(() => {
    const delay = index * 100;
    
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

    // Subtle pulse animation for P&L
    if (position.pnl !== 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pnlPulseAnim, {
            toValue: 1.05,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pnlPulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [index, position.pnl]);

  const isProfitable = position.pnl >= 0;
  const pnlColor = isProfitable ? colors.bullish : colors.bearish;

  const formatCurrency = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}$${Math.abs(value).toFixed(2)}`;
  };

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
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

  const currentValue = position.shares * position.currentPrice;
  const costBasis = position.shares * position.avgPrice;

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
        {/* Header */}
        <View style={styles.header}>
          <View style={[
            styles.outcomeBadge,
            { backgroundColor: position.outcome === 'YES' ? colors.bullish + '20' : colors.bearish + '20' }
          ]}>
            <Text style={[
              styles.outcomeText,
              { color: position.outcome === 'YES' ? colors.bullish : colors.bearish }
            ]}>
              {position.outcome}
            </Text>
          </View>
          <Animated.View 
            style={[
              styles.pnlContainer,
              { transform: [{ scale: pnlPulseAnim }] }
            ]}
          >
            <Text style={[styles.pnl, { color: pnlColor }]}>
              {formatCurrency(position.pnl)}
            </Text>
            <Text style={[styles.pnlPercent, { color: pnlColor }]}>
              {formatPercent(position.pnlPercent)}
            </Text>
          </Animated.View>
        </View>

        {/* Market Question */}
        <Text style={styles.question} numberOfLines={2}>
          {position.marketQuestion}
        </Text>

        {/* Position Details */}
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>SHARES</Text>
              <Text style={styles.detailValue}>{position.shares}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>AVG PRICE</Text>
              <Text style={styles.detailValue}>{(position.avgPrice * 100).toFixed(1)}¢</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>CURRENT</Text>
              <Text style={[styles.detailValue, { color: pnlColor }]}>
                {(position.currentPrice * 100).toFixed(1)}¢
              </Text>
            </View>
          </View>
        </View>

        {/* Value Bar */}
        <View style={styles.valueSection}>
          <View style={styles.valueBar}>
            <View style={styles.costBasisIndicator}>
              <Text style={styles.valueLabel}>COST</Text>
              <Text style={styles.costValue}>${costBasis.toFixed(2)}</Text>
            </View>
            <View style={styles.arrowContainer}>
              <Text style={[styles.arrow, { color: pnlColor }]}>
                {isProfitable ? '→' : '←'}
              </Text>
            </View>
            <View style={styles.currentValueIndicator}>
              <Text style={styles.valueLabel}>VALUE</Text>
              <Text style={[styles.currentValue, { color: pnlColor }]}>
                ${currentValue.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Sell Button */}
        <View style={styles.actions}>
          <Pressable style={styles.sellButton}>
            <Text style={styles.sellButtonText}>SELL POSITION</Text>
          </Pressable>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  outcomeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs - 2,
    borderRadius: 4,
  },
  outcomeText: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  pnlContainer: {
    alignItems: 'flex-end',
  },
  pnl: {
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pnlPercent: {
    fontFamily: 'monospace',
    fontSize: 11,
    marginTop: 2,
  },
  question: {
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  details: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: colors.textDim,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  detailValue: {
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  valueSection: {
    marginBottom: spacing.md,
  },
  valueBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 8,
  },
  costBasisIndicator: {
    alignItems: 'flex-start',
  },
  currentValueIndicator: {
    alignItems: 'flex-end',
  },
  valueLabel: {
    fontFamily: 'monospace',
    fontSize: 8,
    color: colors.textDim,
    letterSpacing: 1,
    marginBottom: 2,
  },
  costValue: {
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  currentValue: {
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 'bold',
  },
  arrowContainer: {
    flex: 1,
    alignItems: 'center',
  },
  arrow: {
    fontFamily: 'monospace',
    fontSize: 20,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
  },
  sellButton: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    paddingVertical: spacing.sm,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  sellButtonText: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 1,
  },
});

export default PositionCard;
