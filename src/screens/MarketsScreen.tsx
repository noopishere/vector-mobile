import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Animated,
  TouchableOpacity,
  TextInput,
  Keyboard,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme/colors';
import { useMarkets } from '../api/hooks';
import { MarketCard } from '../components/MarketCard';
import { Market } from '../store/useAppStore';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type FilterCategory = 'ALL' | 'TECHNOLOGY' | 'ECONOMICS' | 'CRYPTO' | 'POLITICS' | 'FINANCE';

const SearchBar: React.FC<{
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}> = ({ value, onChangeText, onFocus, onBlur }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1.02,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
    onFocus?.();
  };

  const handleBlur = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
    onBlur?.();
  };

  const borderColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.primary + '60'],
  });

  return (
    <Animated.View
      style={[
        styles.searchContainer,
        {
          transform: [{ scale: scaleAnim }],
          borderColor,
        },
      ]}
    >
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search markets..."
        placeholderTextColor={colors.textDim}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText('')}
          style={styles.clearButton}
          activeOpacity={0.7}
        >
          <Text style={styles.clearIcon}>✕</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const CategoryFilter: React.FC<{
  categories: FilterCategory[];
  selected: FilterCategory;
  onSelect: (cat: FilterCategory) => void;
}> = ({ categories, selected, onSelect }) => {
  const handleSelect = (cat: FilterCategory) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onSelect(cat);
  };

  return (
    <View style={styles.filterContainer}>
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterChip,
              selected === item && styles.filterChipActive,
            ]}
            onPress={() => handleSelect(item)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterChipText,
                selected === item && styles.filterChipTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const MarketCardSkeleton: React.FC = () => {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.skeleton, { opacity: pulseAnim }]}>
      <View style={styles.skeletonHeader}>
        <View style={styles.skeletonBadge} />
        <View style={styles.skeletonVolume} />
      </View>
      <View style={styles.skeletonQuestion} />
      <View style={styles.skeletonQuestionShort} />
      <View style={styles.skeletonBar} />
      <View style={styles.skeletonButtons} />
    </Animated.View>
  );
};

export const MarketsScreen: React.FC = () => {
  const { data: markets, isLoading, refetch, isRefetching } = useMarkets();
  const [filter, setFilter] = useState<FilterCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Animated values for header
  const headerAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.spring(headerAnim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  const categories: FilterCategory[] = ['ALL', 'TECHNOLOGY', 'ECONOMICS', 'CRYPTO', 'POLITICS', 'FINANCE'];

  // Filter markets by category and search query
  const filteredMarkets = markets?.filter((m) => {
    const matchesCategory = filter === 'ALL' || m.category === filter;
    const matchesSearch = searchQuery.trim() === '' || 
      m.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  const handleSearchChange = useCallback((text: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSearchQuery(text);
  }, []);

  const totalVolume = markets?.reduce((sum, m) => sum + m.volume, 0) || 0;
  const avgProbability = markets?.length
    ? markets.reduce((sum, m) => sum + m.probability, 0) / markets.length
    : 0;

  const formatVolume = (vol: number) => {
    if (vol >= 1000000) return `$${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `$${(vol / 1000).toFixed(0)}K`;
    return `$${vol}`;
  };

  const renderItem = ({ item }: { item: Market }) => (
    <MarketCard market={item} onPress={() => console.log('Open market:', item.id)} />
  );

  const renderHeader = () => (
    <Animated.View 
      style={[
        styles.header,
        {
          opacity: headerAnim,
          transform: [
            {
              translateY: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.logoRow}>
        <Text style={styles.logo}>VECTOR</Text>
        <View style={styles.updateBadge}>
          <Text style={styles.updateText}>↻ LIVE</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>PREDICTION MARKETS</Text>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearchChange}
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => setIsSearchFocused(false)}
      />

      {/* Stats Overview */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{markets?.length || 0}</Text>
          <Text style={styles.statLabel}>ACTIVE MARKETS</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatVolume(totalVolume)}</Text>
          <Text style={styles.statLabel}>TOTAL VOLUME</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{(avgProbability * 100).toFixed(0)}%</Text>
          <Text style={styles.statLabel}>AVG PROB</Text>
        </View>
      </View>

      {/* Category Filters */}
      <CategoryFilter
        categories={categories}
        selected={filter}
        onSelect={setFilter}
      />

      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {searchQuery ? `"${searchQuery}"` : filter === 'ALL' ? 'ALL MARKETS' : filter}
        </Text>
        <Text style={styles.sectionCount}>{filteredMarkets?.length || 0}</Text>
      </View>
    </Animated.View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingHeader}>
          <Text style={styles.logo}>VECTOR</Text>
          <Text style={styles.subtitle}>PREDICTION MARKETS</Text>
        </View>
        <View style={styles.skeletonList}>
          <MarketCardSkeleton />
          <MarketCardSkeleton />
          <MarketCardSkeleton />
        </View>
      </SafeAreaView>
    );
  }

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🔍</Text>
      <Text style={styles.emptyTitle}>NO MARKETS FOUND</Text>
      <Text style={styles.emptyText}>
        {searchQuery 
          ? `No markets matching "${searchQuery}"`
          : 'No markets in this category'}
      </Text>
      {searchQuery && (
        <TouchableOpacity
          style={styles.clearSearchButton}
          onPress={() => setSearchQuery('')}
          activeOpacity={0.7}
        >
          <Text style={styles.clearSearchText}>Clear Search</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={filteredMarkets}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={8}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={Keyboard.dismiss}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  loadingHeader: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  logo: {
    fontFamily: 'monospace',
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 4,
  },
  updateBadge: {
    backgroundColor: colors.secondary + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.secondary + '30',
  },
  updateText: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: '700',
    color: colors.secondary,
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: colors.textDim,
    letterSpacing: 2,
    marginTop: spacing.xs,
  },
  // Search Bar Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.lg,
    borderWidth: 1,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: spacing.sm,
    opacity: 0.6,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'monospace',
    fontSize: 14,
    color: colors.text,
    padding: 0,
    letterSpacing: 0.5,
  },
  clearButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  clearIcon: {
    fontSize: 12,
    color: colors.textDim,
  },
  // Empty State Styles
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
    opacity: 0.5,
  },
  emptyTitle: {
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textMuted,
    marginBottom: spacing.sm,
    letterSpacing: 2,
  },
  emptyText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: colors.textDim,
    textAlign: 'center',
    lineHeight: 18,
  },
  clearSearchButton: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary + '15',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  clearSearchText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    letterSpacing: 1,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: colors.textDim,
    letterSpacing: 1,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  filterContainer: {
    marginTop: spacing.lg,
    marginHorizontal: -spacing.md,
  },
  filterList: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary + '40',
  },
  filterChipText: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 1,
  },
  filterChipTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: colors.textDim,
    letterSpacing: 2,
  },
  sectionCount: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  skeletonList: {
    paddingHorizontal: spacing.md,
  },
  skeleton: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  skeletonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  skeletonBadge: {
    width: 70,
    height: 16,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 4,
  },
  skeletonVolume: {
    width: 50,
    height: 12,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 4,
  },
  skeletonQuestion: {
    width: '100%',
    height: 14,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 4,
    marginBottom: spacing.sm,
  },
  skeletonQuestionShort: {
    width: '70%',
    height: 14,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 4,
    marginBottom: spacing.md,
  },
  skeletonBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 4,
    marginBottom: spacing.md,
  },
  skeletonButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    height: 40,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 6,
  },
});

export default MarketsScreen;
