import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { useAppStore } from '../store/useAppStore';
import { NewsCard } from '../components';

type Props = NativeStackScreenProps<any, 'MarketDetail'>;

export const MarketDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { marketId } = route.params as { marketId: string };
  const { markets, newsItems, watchlist, toggleWatchlist } = useAppStore();
  const market = markets.find((m) => m.id === marketId);

  const ringAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(ringAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (!market) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Market not found</Text>
      </SafeAreaView>
    );
  }

  const yesPrice = Math.round(market.probability * 100);
  const noPrice = 100 - yesPrice;
  const isWatched = watchlist.includes(market.id);

  const formatVolume = (vol: number) => {
    if (vol >= 1000000) return `$${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `$${(vol / 1000).toFixed(0)}k`;
    return `$${vol}`;
  };

  // Bar width animated
  const barWidth = ringAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', `${yesPrice}%`],
  });

  // Related news by category
  const categoryMap: Record<string, string[]> = {
    ECONOMICS: ['FINANCE'],
    FINANCE: ['FINANCE'],
    TECHNOLOGY: ['TECH'],
    CRYPTO: ['CRYPTO'],
    POLITICS: ['POLITICS'],
  };
  const newsCats = [market.category, ...(categoryMap[market.category] || [])];
  const relatedNews = newsItems.filter(
    (n) => n.category && newsCats.includes(n.category)
  ).slice(0, 3);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleWatchlist(market.id)}>
            <Text style={styles.starIcon}>{isWatched ? '★' : '☆'}</Text>
          </TouchableOpacity>
        </View>

        {/* Category & End Date */}
        <View style={styles.metaRow}>
          <Text style={styles.category}>{market.category}</Text>
          {market.endDate && <Text style={styles.endDate}>Closes {market.endDate}</Text>}
        </View>

        {/* Question */}
        <Animated.View style={{ opacity: fadeAnim, paddingHorizontal: 20 }}>
          <Text style={styles.question}>{market.question}</Text>
          {market.description && (
            <Text style={styles.description}>{market.description}</Text>
          )}
        </Animated.View>

        {/* Probability Display */}
        <View style={styles.probabilitySection}>
          <Text style={styles.probLabel}>PROBABILITY</Text>
          <Text style={styles.probValue}>{yesPrice}%</Text>
          <View style={styles.probBarBg}>
            <Animated.View style={[styles.probBarFill, { width: barWidth }]} />
          </View>
          {market.change24h !== undefined && (
            <Text
              style={[
                styles.changeText,
                market.change24h >= 0 ? styles.positive : styles.negative,
              ]}
            >
              {market.change24h >= 0 ? '▲' : '▼'}{' '}
              {Math.abs(market.change24h * 100).toFixed(0)}% 24h
            </Text>
          )}
        </View>

        {/* Buy Buttons */}
        <View style={styles.buyRow}>
          <TouchableOpacity style={styles.yesButton}>
            <Text style={styles.buyLabel}>BUY YES</Text>
            <Text style={styles.buyPrice}>{yesPrice}¢</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.noButton}>
            <Text style={styles.buyLabelNo}>BUY NO</Text>
            <Text style={styles.buyPriceNo}>{noPrice}¢</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Volume</Text>
            <Text style={styles.statValue}>{formatVolume(market.volume)}</Text>
          </View>
          {market.liquidity && (
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Liquidity</Text>
              <Text style={styles.statValue}>{formatVolume(market.liquidity)}</Text>
            </View>
          )}
          {market.traders && (
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Traders</Text>
              <Text style={styles.statValue}>{market.traders.toLocaleString()}</Text>
            </View>
          )}
        </View>

        {/* Chart Placeholder */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>PRICE CHART</Text>
          <View style={styles.chartPlaceholder}>
            <View style={styles.chartLine}>
              {[40, 45, 42, 50, 48, 55, 60, 58, 65, 62, 68, yesPrice].map((v, i) => (
                <View
                  key={i}
                  style={[
                    styles.chartDot,
                    { bottom: `${v}%`, left: `${(i / 11) * 100}%` },
                  ]}
                />
              ))}
            </View>
            <Text style={styles.chartLabel}>Full chart coming soon</Text>
          </View>
        </View>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <View style={styles.newsSection}>
            <Text style={styles.sectionTitle}>RELATED NEWS</Text>
            {relatedNews.map((news, index) => (
              <NewsCard
                key={news.id}
                news={news}
                index={index}
                onPress={(n) =>
                  navigation.push('NewsDetail', { newsId: n.id })
                }
              />
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black },
  errorText: { color: colors.text.secondary, textAlign: 'center', marginTop: 100, fontFamily: 'Inter_400Regular' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: { padding: 4 },
  backText: { fontSize: 16, fontFamily: 'Inter_500Medium', color: colors.white },
  starIcon: { fontSize: 24, color: colors.white },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  category: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  endDate: { fontSize: 11, fontFamily: 'Inter_400Regular', color: colors.text.tertiary },
  question: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: colors.white,
    lineHeight: 30,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  probabilitySection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  probLabel: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text.tertiary,
    letterSpacing: 1,
    marginBottom: 8,
  },
  probValue: {
    fontSize: 56,
    fontFamily: 'Inter_700Bold',
    color: colors.white,
    letterSpacing: -2,
  },
  probBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 3,
    marginTop: 16,
    overflow: 'hidden',
  },
  probBarFill: {
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: 3,
  },
  changeText: { fontSize: 13, fontFamily: 'Inter_600SemiBold', marginTop: 10 },
  positive: { color: colors.success },
  negative: { color: colors.error },
  buyRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  yesButton: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  noButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  buyLabel: { fontSize: 11, fontFamily: 'Inter_700Bold', color: colors.black, letterSpacing: 1 },
  buyPrice: { fontSize: 22, fontFamily: 'Inter_700Bold', color: colors.black, marginTop: 4 },
  buyLabelNo: { fontSize: 11, fontFamily: 'Inter_700Bold', color: colors.text.secondary, letterSpacing: 1 },
  buyPriceNo: { fontSize: 22, fontFamily: 'Inter_700Bold', color: colors.white, marginTop: 4 },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: colors.white,
  },
  chartSection: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  chartPlaceholder: {
    height: 160,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  chartLine: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    bottom: 40,
  },
  chartDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.white,
  },
  chartLabel: {
    position: 'absolute',
    bottom: 12,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.text.tertiary,
  },
  newsSection: { paddingHorizontal: 20, marginBottom: 24 },
});
