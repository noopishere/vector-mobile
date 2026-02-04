import React, { useRef, useEffect } from 'react';
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
import { useNews } from '../api/hooks';
import { NewsCard } from '../components/NewsCard';
import { NewsItem } from '../store/useAppStore';

const AnimatedHeader: React.FC<{ itemCount: number }> = ({ itemCount }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.header,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.logoRow}>
        <Text style={styles.logo}>VECTOR</Text>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>NEWS FEED</Text>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{itemCount}</Text>
          <Text style={styles.statLabel}>STORIES</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>4</Text>
          <Text style={styles.statLabel}>SOURCES</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>REAL-TIME</Text>
          <Text style={styles.statLabel}>UPDATES</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const NewsCardSkeleton: React.FC = () => {
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
        <View style={styles.skeletonTime} />
      </View>
      <View style={styles.skeletonTitle} />
      <View style={styles.skeletonTitleShort} />
      <View style={styles.skeletonSummary} />
      <View style={styles.skeletonSummaryShort} />
      <View style={styles.skeletonFooter} />
    </Animated.View>
  );
};

export const NewsScreen: React.FC = () => {
  const { data: news, isLoading, refetch, isRefetching } = useNews();

  const renderItem = ({ item, index }: { item: NewsItem; index: number }) => (
    <NewsCard item={item} index={index} onPress={() => console.log('Open news:', item.id)} />
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingHeader}>
          <Text style={styles.logo}>VECTOR</Text>
          <Text style={styles.subtitle}>NEWS FEED</Text>
        </View>
        <View style={styles.skeletonList}>
          <NewsCardSkeleton />
          <NewsCardSkeleton />
          <NewsCardSkeleton />
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
        ListHeaderComponent={<AnimatedHeader itemCount={news?.length || 0} />}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={10}
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
    paddingHorizontal: 0,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  loadingHeader: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontFamily: 'monospace',
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 4,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: spacing.xs,
  },
  liveText: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: colors.textDim,
    letterSpacing: 2,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: colors.textDim,
    letterSpacing: 1,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
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
    width: 60,
    height: 16,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 4,
  },
  skeletonTime: {
    width: 50,
    height: 12,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 4,
  },
  skeletonTitle: {
    width: '100%',
    height: 16,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 4,
    marginBottom: spacing.sm,
  },
  skeletonTitleShort: {
    width: '60%',
    height: 16,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 4,
    marginBottom: spacing.md,
  },
  skeletonSummary: {
    width: '100%',
    height: 12,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 4,
    marginBottom: spacing.xs,
  },
  skeletonSummaryShort: {
    width: '80%',
    height: 12,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 4,
    marginBottom: spacing.md,
  },
  skeletonFooter: {
    width: 100,
    height: 10,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 4,
  },
});

export default NewsScreen;
