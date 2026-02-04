import React from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme/colors';
import { useMarkets } from '../api/hooks';
import { MarketCard } from '../components/MarketCard';
import { Market } from '../store/useAppStore';

export const MarketsScreen: React.FC = () => {
  const { data: markets, isLoading, refetch, isRefetching } = useMarkets();

  const renderItem = ({ item }: { item: Market }) => (
    <MarketCard market={item} onPress={() => console.log('Open market:', item.id)} />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.logo}>VECTOR</Text>
      <Text style={styles.subtitle}>MARKETS</Text>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{markets?.length || 0}</Text>
          <Text style={styles.statLabel}>ACTIVE</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>
            ${markets?.reduce((sum, m) => sum + m.volume, 0).toLocaleString() || 0}
          </Text>
          <Text style={styles.statLabel}>VOLUME</Text>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>VECTOR</Text>
          <Text style={styles.subtitle}>MARKETS</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading markets...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={markets}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
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
  statsRow: { flexDirection: 'row', marginTop: spacing.lg, gap: spacing.xl },
  stat: { alignItems: 'flex-start' },
  statValue: { fontFamily: 'monospace', fontSize: 18, fontWeight: 'bold', color: colors.text },
  statLabel: { fontFamily: 'monospace', fontSize: 10, color: colors.textDim, letterSpacing: 1, marginTop: spacing.xs },
  listContent: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontFamily: 'monospace', fontSize: 12, color: colors.textDim, marginTop: spacing.md },
});

export default MarketsScreen;
