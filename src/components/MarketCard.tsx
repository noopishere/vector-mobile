import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing } from '../theme/colors';
import { Market } from '../store/useAppStore';

interface MarketCardProps {
  market: Market;
  onPress?: () => void;
}

export const MarketCard: React.FC<MarketCardProps> = ({ market, onPress }) => {
  const formatVolume = (vol: number) => {
    if (vol >= 1000000) return `$${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `$${(vol / 1000).toFixed(0)}K`;
    return `$${vol}`;
  };

  const probability = Math.round(market.probability * 100);
  const isHigh = probability >= 70;
  const isLow = probability <= 30;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.category}>{market.category}</Text>
        <Text style={styles.volume}>{formatVolume(market.volume)}</Text>
      </View>
      <Text style={styles.question}>{market.question}</Text>
      <View style={styles.probabilityContainer}>
        <View style={styles.probabilityBarBg}>
          <View
            style={[
              styles.probabilityBarFill,
              {
                width: `${probability}%`,
                backgroundColor: isHigh ? colors.bullish : isLow ? colors.bearish : colors.textMuted,
              },
            ]}
          />
        </View>
        <Text style={[styles.probabilityText, { color: isHigh ? colors.bullish : isLow ? colors.bearish : colors.text }]}>
          {probability}%
        </Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.button, styles.yesButton]}>
          <Text style={styles.yesButtonText}>YES</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.noButton]}>
          <Text style={styles.noButtonText}>NO</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  category: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: colors.secondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  volume: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: colors.textDim,
  },
  question: {
    fontFamily: 'monospace',
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  probabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  probabilityBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 3,
    marginRight: spacing.md,
    overflow: 'hidden',
  },
  probabilityBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  probabilityText: {
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 50,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 4,
    alignItems: 'center',
  },
  yesButton: {
    backgroundColor: colors.bullish + '20',
    borderWidth: 1,
    borderColor: colors.bullish + '40',
  },
  noButton: {
    backgroundColor: colors.bearish + '20',
    borderWidth: 1,
    borderColor: colors.bearish + '40',
  },
  yesButtonText: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.bullish,
    letterSpacing: 1,
  },
  noButtonText: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.bearish,
    letterSpacing: 1,
  },
});

export default MarketCard;
