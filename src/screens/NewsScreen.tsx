import React from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme/colors';
import { useNews } from '../api/hooks';
import { NewsCard } from '../components/NewsCard';
import { NewsItem } from '../store/useAppStore';

export const NewsScreen: React.FC = () => {
  const { data: news, isLoading, refetch, isRefetching } = useNews();

  const renderItem = ({ item }: { item: NewsItem }) => (
    <NewsCard item={item} onPress={() => console.log('Open news:', item.id)} />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.logo}>VECTOR</Text>
      <Text style={styles.subtitle}>NEWS</Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading news...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={news}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.lg },
  logo: { fontFamily: 'monospace', fontSize: 28, fontWeight: 'bold', color: colors.primary, letterSpacing: 4 },
  subtitle: { fontFamily: 'monospace', fontSize: 12, color: colors.textDim, letterSpacing: 2, marginTop: spacing.xs },
  listContent: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontFamily: 'monospace', fontSize: 12, color: colors.textDim, marginTop: spacing.md },
});

export default NewsScreen;
