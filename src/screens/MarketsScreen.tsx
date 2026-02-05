import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Animated,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

interface Market {
  id: string;
  title: string;
  category: string;
  yesPrice: number;
  noPrice: number;
  volume24h: number;
  closesAt: string;
  trending: boolean;
}

// Mock markets data
const mockMarkets: Market[] = [
  { id: '1', title: 'Will Bitcoin exceed $100k by March 2026?', category: 'Crypto', yesPrice: 71, noPrice: 29, volume24h: 892000, closesAt: '23d', trending: true },
  { id: '2', title: 'Fed rate cut by June 2026?', category: 'Economy', yesPrice: 62, noPrice: 38, volume24h: 125000, closesAt: '4mo', trending: true },
  { id: '3', title: 'SpaceX Mars mission by 2028?', category: 'Tech', yesPrice: 23, noPrice: 77, volume24h: 234000, closesAt: '2yr', trending: false },
  { id: '4', title: 'AI regulation passed by Congress in 2026?', category: 'Politics', yesPrice: 54, noPrice: 46, volume24h: 67000, closesAt: '10mo', trending: false },
  { id: '5', title: 'Tesla delivers Cybertruck 500k units in 2026?', category: 'Business', yesPrice: 35, noPrice: 65, volume24h: 145000, closesAt: '11mo', trending: false },
  { id: '6', title: 'Ethereum flips Bitcoin in 2026?', category: 'Crypto', yesPrice: 8, noPrice: 92, volume24h: 156000, closesAt: '11mo', trending: false },
  { id: '7', title: 'Inflation below 2.5% by Q2 2026?', category: 'Economy', yesPrice: 45, noPrice: 55, volume24h: 89000, closesAt: '3mo', trending: true },
  { id: '8', title: 'Apple releases foldable iPhone in 2026?', category: 'Tech', yesPrice: 28, noPrice: 72, volume24h: 198000, closesAt: '11mo', trending: false },
];

const categories = ['All', 'Trending', 'Crypto', 'Politics', 'Economy', 'Tech', 'Sports'];

const MarketCard = ({ market, index }: { market: Market; index: number }) => {
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

  return (
    <Animated.View
      style={[
        styles.marketCard,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <TouchableOpacity activeOpacity={0.7}>
        <View style={styles.marketHeader}>
          <Text style={styles.marketCategory}>{market.category}</Text>
          <Text style={styles.marketCloses}>Closes {market.closesAt}</Text>
        </View>
        
        <Text style={styles.marketTitle}>{market.title}</Text>
        
        <View style={styles.priceRow}>
          <View style={styles.priceContainer}>
            <TouchableOpacity style={styles.yesButton}>
              <Text style={styles.yesLabel}>YES</Text>
              <Text style={styles.priceValue}>{market.yesPrice}¢</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.noButton}>
              <Text style={styles.noLabel}>NO</Text>
              <Text style={styles.priceValue}>{market.noPrice}¢</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.volumeText}>{formatVolume(market.volume24h)} vol</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const MarketsScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const filteredMarkets = mockMarkets.filter((market) => {
    const matchesCategory = 
      selectedCategory === 'All' || 
      selectedCategory === 'Trending' ? market.trending :
      market.category === selectedCategory;
    const matchesSearch = market.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>vector</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search markets..."
          placeholderTextColor={colors.text.tertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryPill,
                selectedCategory === item && styles.categoryPillActive,
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item && styles.categoryTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Markets List */}
      <FlatList
        data={filteredMarkets}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <MarketCard market={item} index={index} />}
        contentContainerStyle={styles.marketsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.white}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No markets found</Text>
          </View>
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
  logo: {
    fontSize: 24,
    fontFamily: 'SpaceMono-Regular',
    color: colors.white,
    letterSpacing: -1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoriesContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoriesList: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  categoryPillActive: {
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
  categoryText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: colors.text.secondary,
  },
  categoryTextActive: {
    color: colors.black,
  },
  marketsList: {
    padding: 16,
    gap: 12,
  },
  marketCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  marketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  marketCategory: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  marketCloses: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: colors.text.tertiary,
  },
  marketTitle: {
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
  yesLabel: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: colors.text.secondary,
    letterSpacing: 0.5,
  },
  noLabel: {
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
  volumeText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.text.tertiary,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: colors.text.tertiary,
  },
});
