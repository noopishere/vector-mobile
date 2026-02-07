import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { colors } from '../theme/colors';
import { Market } from '../store/useAppStore';

interface MarketCardProps {
  market: Market;
  index?: number;
  onPress?: (market: Market) => void;
  compact?: boolean;
}

export const MarketCard: React.FC<MarketCardProps> = ({ 
  market, 
  index = 0, 
  onPress,
  compact = false 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 60,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const formatVolume = (vol: number) => {
    if (vol >= 1000000) return `$${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `$${(vol / 1000).toFixed(0)}k`;
    return `$${vol}`;
  };

  const yesPrice = Math.round(market.probability * 100);
  const noPrice = 100 - yesPrice;

  if (compact) {
    return (
      <TouchableOpacity 
        style={styles.compactCard}
        onPress={() => onPress?.(market)}
        activeOpacity={0.7}
      >
        <Text style={styles.compactTitle} numberOfLines={1}>
          {market.question}
        </Text>
        <View style={styles.compactMeta}>
          <Text style={styles.compactPrice}>{yesPrice}¢</Text>
          <Text style={styles.compactVolume}>
            {formatVolume(market.volume)} vol
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <Animated.View
      style={[
        styles.card,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <TouchableOpacity activeOpacity={0.7} onPress={() => onPress?.(market)}>
        <View style={styles.header}>
          <Text style={styles.category}>{market.category}</Text>
          {market.endDate && (
            <Text style={styles.closes}>Closes {market.endDate}</Text>
          )}
        </View>
        
        <Text style={styles.title}>{market.question}</Text>
        
        <View style={styles.priceRow}>
          <View style={styles.priceContainer}>
            <TouchableOpacity style={styles.yesButton}>
              <Text style={styles.buttonLabel}>YES</Text>
              <Text style={styles.priceValue}>{yesPrice}¢</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.noButton}>
              <Text style={styles.buttonLabel}>NO</Text>
              <Text style={styles.priceValue}>{noPrice}¢</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.volumeText}>{formatVolume(market.volume)} vol</Text>
            {market.change24h !== undefined && (
              <Text style={[
                styles.changeText,
                market.change24h >= 0 ? styles.positive : styles.negative
              ]}>
                {market.change24h >= 0 ? '+' : ''}{(market.change24h * 100).toFixed(0)}%
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
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
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  category: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  closes: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: colors.text.tertiary,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: colors.white,
    lineHeight: 22,
    marginBottom: 14,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  yesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  noButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  buttonLabel: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: colors.text.secondary,
    letterSpacing: 0.5,
  },
  priceValue: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: colors.white,
  },
  metaCol: {
    alignItems: 'flex-end',
  },
  volumeText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.text.tertiary,
  },
  changeText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 2,
  },
  positive: {
    color: colors.success,
  },
  negative: {
    color: colors.error,
  },
  // Compact styles
  compactCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactTitle: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: colors.white,
    marginRight: 12,
  },
  compactMeta: {
    alignItems: 'flex-end',
  },
  compactPrice: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: colors.white,
  },
  compactVolume: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: colors.text.tertiary,
    marginTop: 2,
  },
});
