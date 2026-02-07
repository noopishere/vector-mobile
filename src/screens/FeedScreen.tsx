import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useAppStore, NewsItem, Market } from '../store/useAppStore';
import { NewsCard, NewsCardSkeleton } from '../components';

export const FeedScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { newsItems, markets, isLoading } = useAppStore();

  const onRefresh = () => {
    setRefreshing(true);
    // In future: fetch real data here
    setTimeout(() => setRefreshing(false), 1500);
  };

  // Show skeletons when loading or no data yet
  const showSkeletons = isLoading || (newsItems.length === 0 && !refreshing);

  // Get related markets for a news item based on category matching
  const getRelatedMarkets = (news: NewsItem): Market[] => {
    if (!news.category) return [];
    
    // Map news categories to market categories
    const categoryMap: Record<string, string[]> = {
      'FINANCE': ['ECONOMICS', 'FINANCE'],
      'TECH': ['TECHNOLOGY'],
      'CRYPTO': ['CRYPTO'],
      'POLITICS': ['POLITICS'],
      'ECONOMY': ['ECONOMICS'],
    };
    
    const relevantCategories = categoryMap[news.category] || [news.category];
    return markets
      .filter(m => relevantCategories.includes(m.category))
      .slice(0, 2); // Max 2 related markets per news item
  };

  const handleNewsPress = (news: NewsItem) => {
    // TODO: Navigate to news detail
    console.log('News pressed:', news.id);
  };

  const handleMarketPress = (market: Market) => {
    // TODO: Navigate to market detail
    console.log('Market pressed:', market.id);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feed</Text>
      </View>

      {showSkeletons ? (
        <View style={styles.list}>
          {[0, 1, 2, 3].map((i) => (
            <NewsCardSkeleton key={i} index={i} />
          ))}
        </View>
      ) : (
        <FlatList
          data={newsItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <NewsCard
              news={item}
              index={index}
              attachedMarkets={getRelatedMarkets(item)}
              onPress={handleNewsPress}
              onMarketPress={handleMarketPress}
            />
          )}
          contentContainerStyle={styles.list}
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
              <Text style={styles.emptyText}>No news available</Text>
            </View>
          }
        />
      )}
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
