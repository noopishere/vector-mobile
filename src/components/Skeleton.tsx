import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();
    return () => shimmer.stop();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

// Pre-built skeleton layouts
export const MarketCardSkeleton: React.FC<{ index?: number }> = ({ index = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      delay: index * 50,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.cardContainer, { opacity: fadeAnim }]}>
      <View style={styles.cardHeader}>
        <Skeleton width={60} height={12} />
        <Skeleton width={80} height={12} />
      </View>
      <Skeleton width="90%" height={18} style={{ marginBottom: 8 }} />
      <Skeleton width="70%" height={18} style={{ marginBottom: 14 }} />
      <View style={styles.priceRow}>
        <View style={styles.buttonRow}>
          <Skeleton width={70} height={36} borderRadius={8} />
          <Skeleton width={70} height={36} borderRadius={8} />
        </View>
        <Skeleton width={60} height={14} />
      </View>
    </Animated.View>
  );
};

export const NewsCardSkeleton: React.FC<{ index?: number }> = ({ index = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      delay: index * 50,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.cardContainer, { opacity: fadeAnim }]}>
      <View style={styles.cardHeader}>
        <Skeleton width={80} height={12} />
        <Skeleton width={50} height={12} />
      </View>
      <Skeleton width="95%" height={20} style={{ marginBottom: 8 }} />
      <Skeleton width="100%" height={14} style={{ marginBottom: 4 }} />
      <Skeleton width="80%" height={14} />
    </Animated.View>
  );
};

export const PositionCardSkeleton: React.FC<{ index?: number }> = ({ index = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      delay: index * 50,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.cardContainer, { opacity: fadeAnim }]}>
      <View style={styles.cardHeader}>
        <Skeleton width="70%" height={16} />
        <Skeleton width={40} height={22} borderRadius={4} />
      </View>
      <View style={styles.detailsRow}>
        <View style={styles.detailCol}>
          <Skeleton width={40} height={10} style={{ marginBottom: 4 }} />
          <Skeleton width={30} height={16} />
        </View>
        <View style={styles.detailCol}>
          <Skeleton width={30} height={10} style={{ marginBottom: 4 }} />
          <Skeleton width={35} height={16} />
        </View>
        <View style={styles.detailCol}>
          <Skeleton width={45} height={10} style={{ marginBottom: 4 }} />
          <Skeleton width={35} height={16} />
        </View>
        <View style={[styles.detailCol, { alignItems: 'flex-end' }]}>
          <Skeleton width={30} height={10} style={{ marginBottom: 4 }} />
          <Skeleton width={50} height={16} />
        </View>
      </View>
    </Animated.View>
  );
};

export const StatCardSkeleton: React.FC = () => (
  <View style={styles.statCard}>
    <Skeleton width={50} height={10} style={{ marginBottom: 8 }} />
    <Skeleton width={60} height={22} />
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.surface,
  },
  cardContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailCol: {
    alignItems: 'flex-start',
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
