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

interface Position {
  id: string;
  market: string;
  side: 'yes' | 'no';
  quantity: number;
  avgPrice: number;
  currentPrice: number;
}

// Mock data
const mockPositions: Position[] = [
  { id: '1', market: 'Fed rate cut by June 2026?', side: 'yes', quantity: 100, avgPrice: 58, currentPrice: 62 },
  { id: '2', market: 'BTC above $100k by March?', side: 'yes', quantity: 250, avgPrice: 65, currentPrice: 71 },
  { id: '3', market: 'SpaceX Mars mission by 2028?', side: 'no', quantity: 150, avgPrice: 80, currentPrice: 77 },
];

const mockStats = {
  portfolioValue: 1247.50,
  cashBalance: 523.40,
  totalPnL: 189.20,
  totalPnLPercent: 17.8,
  winRate: 62,
  totalTrades: 47,
};

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
  const pnl = (position.currentPrice - position.avgPrice) * position.quantity / 100;
  const pnlPercent = ((position.currentPrice - position.avgPrice) / position.avgPrice) * 100;
  const isProfit = pnl >= 0;

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
        <Text style={styles.positionMarket} numberOfLines={1}>{position.market}</Text>
        <View style={[styles.sideBadge, position.side === 'yes' ? styles.yesBadge : styles.noBadge]}>
          <Text style={styles.sideText}>{position.side.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.positionDetails}>
        <View style={styles.positionCol}>
          <Text style={styles.detailLabel}>Qty</Text>
          <Text style={styles.detailValue}>{position.quantity}</Text>
        </View>
        <View style={styles.positionCol}>
          <Text style={styles.detailLabel}>Avg</Text>
          <Text style={styles.detailValue}>{position.avgPrice}¢</Text>
        </View>
        <View style={styles.positionCol}>
          <Text style={styles.detailLabel}>Current</Text>
          <Text style={styles.detailValue}>{position.currentPrice}¢</Text>
        </View>
        <View style={[styles.positionCol, styles.pnlCol]}>
          <Text style={styles.detailLabel}>P&L</Text>
          <Text style={[styles.pnlValue, isProfit ? styles.profit : styles.loss]}>
            {isProfit ? '+' : ''}{pnlPercent.toFixed(1)}%
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

export const ProfileScreen = () => {
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
            ${mockStats.portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Text>
          <View style={styles.pnlBadge}>
            <Text style={[styles.pnlBadgeText, styles.profit]}>
              +${mockStats.totalPnL.toFixed(2)} ({mockStats.totalPnLPercent}%)
            </Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard 
            label="Cash" 
            value={`$${mockStats.cashBalance.toFixed(2)}`} 
            delay={0}
          />
          <StatCard 
            label="Win Rate" 
            value={`${mockStats.winRate}%`} 
            delay={50}
          />
          <StatCard 
            label="Trades" 
            value={mockStats.totalTrades.toString()} 
            delay={100}
          />
        </View>

        {/* Positions */}
        <View style={styles.positionsSection}>
          <Text style={styles.sectionTitle}>Open Positions</Text>
          {mockPositions.map((position, index) => (
            <PositionCard key={position.id} position={position} index={index} />
          ))}
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
});
