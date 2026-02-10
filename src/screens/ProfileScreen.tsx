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
import { colors } from '../theme/colors';
import { useAppStore, Position, TradeHistoryItem } from '../store/useAppStore';

const StatCard = ({ label, value, subValue, delay }: { 
  label: string; 
  value: string; 
  subValue?: string;
  delay: number;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.statCard, { opacity: fadeAnim }]}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {subValue && <Text style={styles.statSubValue}>{subValue}</Text>}
    </Animated.View>
  );
};

const PositionCard = ({ position, index }: { position: Position; index: number }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isProfit = position.pnl >= 0;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: 200 + index * 80,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.positionCard, { opacity: fadeAnim }]}>
      <View style={styles.positionHeader}>
        <Text style={styles.positionMarket} numberOfLines={1}>{position.marketQuestion}</Text>
        <View style={[styles.sideBadge, position.outcome === 'YES' ? styles.yesBadge : styles.noBadge]}>
          <Text style={styles.sideText}>{position.outcome}</Text>
        </View>
      </View>
      
      <View style={styles.positionDetails}>
        <View style={styles.positionCol}>
          <Text style={styles.detailLabel}>Shares</Text>
          <Text style={styles.detailValue}>{position.shares}</Text>
        </View>
        <View style={styles.positionCol}>
          <Text style={styles.detailLabel}>Avg</Text>
          <Text style={styles.detailValue}>{(position.avgPrice * 100).toFixed(0)}¢</Text>
        </View>
        <View style={styles.positionCol}>
          <Text style={styles.detailLabel}>Current</Text>
          <Text style={styles.detailValue}>{(position.currentPrice * 100).toFixed(0)}¢</Text>
        </View>
        <View style={[styles.positionCol, styles.pnlCol]}>
          <Text style={styles.detailLabel}>P&L</Text>
          <Text style={[styles.pnlValue, isProfit ? styles.profit : styles.loss]}>
            {isProfit ? '+' : ''}{position.pnlPercent.toFixed(1)}%
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const TradeCard = ({ trade, index }: { trade: TradeHistoryItem; index: number }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: 300 + index * 60,
      useNativeDriver: true,
    }).start();
  }, []);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <Animated.View style={[styles.tradeCard, { opacity: fadeAnim }]}>
      <View style={styles.tradeHeader}>
        <Text style={styles.tradeMarket} numberOfLines={1}>{trade.marketQuestion}</Text>
        <View style={styles.tradeActionRow}>
          <View style={[styles.actionBadge, trade.action === 'BUY' ? styles.buyBadge : styles.sellBadge]}>
            <Text style={styles.actionText}>{trade.action}</Text>
          </View>
          <View style={[styles.sideBadge, trade.outcome === 'YES' ? styles.yesBadge : styles.noBadge]}>
            <Text style={styles.sideText}>{trade.outcome}</Text>
          </View>
        </View>
      </View>
      <View style={styles.tradeDetails}>
        <Text style={styles.tradeDetail}>{trade.shares} shares @ {(trade.price * 100).toFixed(0)}¢</Text>
        <Text style={styles.tradeDetail}>${trade.total.toFixed(2)}</Text>
      </View>
      <Text style={styles.tradeTime}>{formatTime(trade.timestamp)}</Text>
    </Animated.View>
  );
};

export const ProfileScreen = () => {
  const { positions, portfolioStats, tradeHistory } = useAppStore();
  
  // Calculate cash balance (simple estimate)
  const cashBalance = portfolioStats.totalValue * 0.42; // ~42% cash ratio
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Portfolio</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>⚙</Text>
          </TouchableOpacity>
        </View>

        {/* Portfolio Value */}
        <View style={styles.portfolioSection}>
          <Text style={styles.portfolioLabel}>Total Value</Text>
          <Text style={styles.portfolioValue}>
            ${portfolioStats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Text>
          <View style={styles.pnlBadge}>
            <Text style={[styles.pnlBadgeText, portfolioStats.totalPnl >= 0 ? styles.profit : styles.loss]}>
              {portfolioStats.totalPnl >= 0 ? '+' : ''}${portfolioStats.totalPnl.toFixed(2)} ({portfolioStats.totalPnlPercent.toFixed(1)}%)
            </Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard 
            label="Cash" 
            value={`$${cashBalance.toFixed(2)}`} 
            delay={0}
          />
          <StatCard 
            label="Win Rate" 
            value={`${(portfolioStats.winRate * 100).toFixed(0)}%`} 
            delay={50}
          />
          <StatCard 
            label="Trades" 
            value={portfolioStats.totalTrades.toString()} 
            delay={100}
          />
        </View>

        {/* Positions */}
        <View style={styles.positionsSection}>
          <Text style={styles.sectionTitle}>Open Positions ({positions.length})</Text>
          {positions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No open positions</Text>
              <Text style={styles.emptySubtext}>Start trading to see your positions here</Text>
            </View>
          ) : (
            positions.map((position, index) => (
              <PositionCard key={position.id} position={position} index={index} />
            ))
          )}
        </View>

        {/* Trade History */}
        <View style={styles.positionsSection}>
          <Text style={styles.sectionTitle}>Trade History ({tradeHistory.length})</Text>
          {tradeHistory.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No trade history</Text>
            </View>
          ) : (
            tradeHistory.map((trade, index) => (
              <TradeCard key={trade.id} trade={trade} index={index} />
            ))
          )}
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Deposit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.actionButtonOutline]}>
            <Text style={[styles.actionText, styles.actionTextOutline]}>Withdraw</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  settingsButton: {
    padding: 8,
  },
  settingsIcon: {
    fontSize: 22,
    color: colors.text.secondary,
  },
  portfolioSection: {
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  portfolioLabel: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  portfolioValue: {
    fontSize: 42,
    fontFamily: 'Inter_700Bold',
    color: colors.white,
    letterSpacing: -1,
  },
  pnlBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 20,
  },
  pnlBadgeText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  statsGrid: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
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
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: colors.white,
  },
  statSubValue: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.text.secondary,
    marginTop: 2,
  },
  positionsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  positionCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  positionMarket: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: colors.white,
    marginRight: 12,
  },
  sideBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  yesBadge: {
    backgroundColor: colors.gray[800],
  },
  noBadge: {
    backgroundColor: colors.gray[800],
  },
  sideText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: colors.white,
    letterSpacing: 0.5,
  },
  positionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  positionCol: {
    alignItems: 'flex-start',
  },
  pnlCol: {
    alignItems: 'flex-end',
  },
  detailLabel: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: colors.text.tertiary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: colors.white,
  },
  pnlValue: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
  },
  profit: {
    color: colors.success,
  },
  loss: {
    color: colors.error,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text.secondary,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.text.tertiary,
  },
  actionsSection: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.white,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: colors.black,
  },
  actionTextOutline: {
    color: colors.white,
  },
  tradeCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tradeMarket: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.white,
    marginRight: 8,
  },
  tradeActionRow: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  buyBadge: {
    backgroundColor: 'rgba(34,197,94,0.15)',
  },
  sellBadge: {
    backgroundColor: 'rgba(239,68,68,0.15)',
  },
  actionText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    color: colors.white,
    letterSpacing: 0.5,
  },
  tradeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tradeDetail: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.text.secondary,
  },
  tradeTime: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: colors.text.tertiary,
    marginTop: 6,
  },
});
