import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme/colors';
import { usePositions, usePortfolioStats } from '../api/hooks';
import { PositionCard } from '../components/PositionCard';
import { Position } from '../store/useAppStore';

const StatBox: React.FC<{
  label: string;
  value: string;
  subValue?: string;
  color?: string;
  large?: boolean;
}> = ({ label, value, subValue, color = colors.text, large }) => (
  <View style={[styles.statBox, large && styles.statBoxLarge]}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={[styles.statValue, large && styles.statValueLarge, { color }]}>
      {value}
    </Text>
    {subValue && (
      <Text style={[styles.statSubValue, { color }]}>{subValue}</Text>
    )}
  </View>
);

export const PortfolioScreen: React.FC = () => {
  const { data: positions, isLoading: positionsLoading, refetch: refetchPositions, isRefetching: positionsRefetching } = usePositions();
  const { data: stats, isLoading: statsLoading, refetch: refetchStats, isRefetching: statsRefetching } = usePortfolioStats();

  const isLoading = positionsLoading || statsLoading;
  const isRefetching = positionsRefetching || statsRefetching;

  const refetch = () => {
    refetchPositions();
    refetchStats();
  };

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const renderItem = ({ item }: { item: Position }) => (
    <PositionCard position={item} onPress={() => console.log('Open position:', item.id)} />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.logo}>VECTOR</Text>
      <Text style={styles.subtitle}>PORTFOLIO</Text>

      {/* Main Stats Card */}
      <View style={styles.mainStatsCard}>
        <View style={styles.mainStatsRow}>
          <StatBox
            label="TOTAL VALUE"
            value={formatCurrency(stats?.totalValue || 0)}
            large
          />
          <StatBox
            label="TOTAL P&L"
            value={formatCurrency(stats?.totalPnl || 0)}
            subValue={formatPercent(stats?.totalPnlPercent || 0)}
            color={(stats?.totalPnl || 0) >= 0 ? colors.bullish : colors.bearish}
            large
          />
        </View>
      </View>

      {/* Secondary Stats */}
      <View style={styles.secondaryStats}>
        <View style={styles.secondaryStatItem}>
          <Text style={styles.secondaryStatValue}>
            {((stats?.winRate || 0) * 100).toFixed(0)}%
          </Text>
          <Text style={styles.secondaryStatLabel}>WIN RATE</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.secondaryStatItem}>
          <Text style={styles.secondaryStatValue}>
            {stats?.activePositions || 0}
          </Text>
          <Text style={styles.secondaryStatLabel}>ACTIVE</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.secondaryStatItem}>
          <Text style={styles.secondaryStatValue}>
            {stats?.totalTrades || 0}
          </Text>
          <Text style={styles.secondaryStatLabel}>TOTAL TRADES</Text>
        </View>
      </View>

      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>OPEN POSITIONS</Text>
        <Text style={styles.positionCount}>{positions?.length || 0}</Text>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📊</Text>
      <Text style={styles.emptyTitle}>NO POSITIONS</Text>
      <Text style={styles.emptyText}>
        Start trading prediction markets to see your positions here
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>VECTOR</Text>
          <Text style={styles.subtitle}>PORTFOLIO</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading portfolio...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={positions}
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
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  logo: {
    fontFamily: 'monospace',
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 4,
  },
  subtitle: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: colors.textDim,
    letterSpacing: 2,
    marginTop: spacing.xs,
  },
  mainStatsCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mainStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
  },
  statBoxLarge: {
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: colors.textDim,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontFamily: 'monospace',
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  statValueLarge: {
    fontSize: 24,
  },
  statSubValue: {
    fontFamily: 'monospace',
    fontSize: 12,
    marginTop: 2,
  },
  secondaryStats: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  secondaryStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  secondaryStatValue: {
    fontFamily: 'monospace',
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  secondaryStatLabel: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: colors.textDim,
    letterSpacing: 1,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: colors.textDim,
    letterSpacing: 2,
  },
  positionCount: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: colors.textDim,
    marginTop: spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
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
  },
  emptyText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: colors.textDim,
    textAlign: 'center',
    maxWidth: 250,
    lineHeight: 18,
  },
});

export default PortfolioScreen;
