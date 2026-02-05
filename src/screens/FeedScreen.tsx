import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

interface AttachedMarket {
  id: string;
  title: string;
  yesPrice: number;
  volume24h: number;
}

interface FeedItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: string;
  publishedAt: string;
  attachedMarkets: AttachedMarket[];
}

// Mock feed data
const mockFeed: FeedItem[] = [
  {
    id: '1',
    title: 'Fed signals potential rate cuts in Q2 2026',
    summary: 'Federal Reserve officials indicated openness to reducing interest rates if inflation continues to cool.',
    source: 'Reuters',
    category: 'Economy',
    publishedAt: '2h ago',
    attachedMarkets: [
      { id: 'm1', title: 'Fed rate cut by June 2026?', yesPrice: 62, volume24h: 125000 },
      { id: 'm2', title: 'Inflation below 2.5% by Q2?', yesPrice: 45, volume24h: 89000 },
    ],
  },
  {
    id: '2',
    title: 'SpaceX Starship completes orbital test flight',
    summary: 'The company successfully landed both the booster and ship for the first time.',
    source: 'SpaceNews',
    category: 'Tech',
    publishedAt: '4h ago',
    attachedMarkets: [
      { id: 'm3', title: 'SpaceX Mars mission by 2028?', yesPrice: 23, volume24h: 234000 },
    ],
  },
  {
    id: '3',
    title: 'Bitcoin ETF inflows hit record $2.1B in single day',
    summary: 'Institutional demand continues to surge as major banks expand crypto offerings.',
    source: 'Bloomberg',
    category: 'Crypto',
    publishedAt: '5h ago',
    attachedMarkets: [
      { id: 'm4', title: 'BTC above $100k by March?', yesPrice: 71, volume24h: 892000 },
      { id: 'm5', title: 'ETH flips BTC in 2026?', yesPrice: 8, volume24h: 156000 },
    ],
  },
  {
    id: '4',
    title: 'Senate advances AI regulation bill',
    summary: 'Bipartisan legislation would require safety testing for advanced AI models.',
    source: 'Politico',
    category: 'Politics',
    publishedAt: '6h ago',
    attachedMarkets: [
      { id: 'm6', title: 'AI regulation passed by 2026?', yesPrice: 54, volume24h: 67000 },
    ],
  },
  {
    id: '5',
    title: 'Apple announces mixed reality headset successor',
    summary: 'Vision Pro 2 features lighter design and expanded app ecosystem.',
    source: 'The Verge',
    category: 'Tech',
    publishedAt: '8h ago',
    attachedMarkets: [],
  },
];

const FeedCard = ({ item, index }: { item: FeedItem; index: number }) => {
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

  return (
    <Animated.View
      style={[
        styles.feedCard,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.feedHeader}>
        <Text style={styles.feedSource}>{item.source}</Text>
        <Text style={styles.feedTime}>{item.publishedAt}</Text>
      </View>
      
      <Text style={styles.feedTitle}>{item.title}</Text>
      <Text style={styles.feedSummary}>{item.summary}</Text>
      
      {item.attachedMarkets.length > 0 && (
        <View style={styles.attachedMarketsContainer}>
          <Text style={styles.attachedLabel}>Related Markets</Text>
          {item.attachedMarkets.map((market) => (
            <TouchableOpacity key={market.id} style={styles.attachedMarket}>
              <Text style={styles.marketTitle} numberOfLines={1}>
                {market.title}
              </Text>
              <View style={styles.marketMeta}>
                <Text style={styles.marketPrice}>{market.yesPrice}¢</Text>
                <Text style={styles.marketVolume}>
                  ${(market.volume24h / 1000).toFixed(0)}k vol
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </Animated.View>
  );
};

export const FeedScreen = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feed</Text>
      </View>

      <FlatList
        data={mockFeed}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <FeedCard item={item} index={index} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.white}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: colors.white,
    letterSpacing: -0.5,
  },
  list: {
    padding: 16,
    gap: 16,
  },
  feedCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  feedSource: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  feedTime: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.text.tertiary,
  },
  feedTitle: {
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
    color: colors.white,
    lineHeight: 24,
    marginBottom: 8,
  },
  feedSummary: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.text.secondary,
    lineHeight: 20,
  },
  attachedMarketsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  attachedLabel: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  attachedMarket: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marketTitle: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: colors.white,
    marginRight: 12,
  },
  marketMeta: {
    alignItems: 'flex-end',
  },
  marketPrice: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: colors.white,
  },
  marketVolume: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: colors.text.tertiary,
    marginTop: 2,
  },
});
