import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useAppStore, Market } from '../store/useAppStore';
import { MarketCard } from '../components';

const categories = ['All', 'Trending', 'Crypto', 'Economics', 'Technology', 'Politics', 'Finance'];

export const MarketsScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { markets } = useAppStore();

  const filteredMarkets = useMemo(() => {
    return markets.filter((market) => {
      // Category filter
      let matchesCategory = true;
      if (selectedCategory === 'Trending') {
        // Consider markets with high volume or positive change as trending
        matchesCategory = market.volume > 1500000 || (market.change24h && market.change24h > 0.05);
      } else if (selectedCategory !== 'All') {
        matchesCategory = market.category.toUpperCase() === selectedCategory.toUpperCase();
      }
      
      // Search filter
      const matchesSearch = market.question.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [markets, selectedCategory, searchQuery]);

  const onRefresh = () => {
    setRefreshing(true);
    // In future: fetch real data here
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleMarketPress = (market: Market) => {
    // TODO: Navigate to market detail
    console.log('Market pressed:', market.id);
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
        renderItem={({ item, index }) => (
          <MarketCard
            market={item}
            index={index}
            onPress={handleMarketPress}
          />
        )}
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
