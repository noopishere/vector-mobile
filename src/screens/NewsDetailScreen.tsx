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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { useAppStore } from '../store/useAppStore';
import { MarketCard } from '../components';

type Props = NativeStackScreenProps<any, 'NewsDetail'>;

export const NewsDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { newsId } = route.params as { newsId: string };
  const { newsItems, markets } = useAppStore();
  const news = newsItems.find((n) => n.id === newsId);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!news) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Article not found</Text>
      </SafeAreaView>
    );
  }

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'bullish': return colors.success;
      case 'bearish': return colors.error;
      default: return colors.text.tertiary;
    }
  };

  const getSentimentLabel = (sentiment?: string) => {
    switch (sentiment) {
      case 'bullish': return '▲ Bullish';
      case 'bearish': return '▼ Bearish';
      default: return '● Neutral';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Related markets
  const categoryMap: Record<string, string[]> = {
    FINANCE: ['ECONOMICS', 'FINANCE'],
    TECH: ['TECHNOLOGY'],
    CRYPTO: ['CRYPTO'],
    POLITICS: ['POLITICS'],
  };
  const marketCats = categoryMap[news.category || ''] || [];
  const relatedMarkets = markets
    .filter((m) => marketCats.includes(m.category))
    .slice(0, 3);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        </View>

        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Source & Time */}
          <View style={styles.metaRow}>
            <View style={styles.sourceRow}>
              <Text style={styles.source}>{news.source}</Text>
              {news.category && (
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{news.category}</Text>
                </View>
              )}
            </View>
            <Text style={styles.timestamp}>{formatTime(news.timestamp)}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{news.title}</Text>

          {/* Sentiment */}
          {news.sentiment && (
            <View style={styles.sentimentRow}>
              <View style={[styles.sentimentBadge, { borderColor: getSentimentColor(news.sentiment) }]}>
                <Text style={[styles.sentimentText, { color: getSentimentColor(news.sentiment) }]}>
                  {getSentimentLabel(news.sentiment)}
                </Text>
              </View>
            </View>
          )}

          {/* Divider */}
          <View style={styles.divider} />

          {/* Summary / Article Body */}
          <View style={styles.bodySection}>
            <Text style={styles.bodyText}>{news.summary}</Text>
            <Text style={styles.bodyText}>
              {'\n'}This is a developing story. Full coverage and analysis will be available as more details emerge. 
              Prediction markets have been reacting to this news with notable volume changes across related contracts.
            </Text>
            <Text style={styles.bodyText}>
              {'\n'}Market participants are closely watching for follow-up announcements that could shift probabilities 
              in active prediction markets. Check the related markets below for current pricing.
            </Text>
          </View>

          {/* Related Markets */}
          {relatedMarkets.length > 0 && (
            <View style={styles.marketsSection}>
              <Text style={styles.sectionTitle}>RELATED MARKETS</Text>
              {relatedMarkets.map((market) => (
                <MarketCard
                  key={market.id}
                  market={market}
                  compact
                  onPress={(m) =>
                    navigation.push('MarketDetail', { marketId: m.id })
                  }
                />
              ))}
            </View>
          )}
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black },
  errorText: { color: colors.text.secondary, textAlign: 'center', marginTop: 100, fontFamily: 'Inter_400Regular' },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: { padding: 4 },
  backText: { fontSize: 16, fontFamily: 'Inter_500Medium', color: colors.white },
  metaRow: { paddingHorizontal: 20, paddingTop: 20, marginBottom: 12 },
  sourceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  source: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  categoryBadge: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timestamp: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.text.tertiary,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    color: colors.white,
    lineHeight: 34,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sentimentRow: { paddingHorizontal: 20, marginBottom: 16 },
  sentimentBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  sentimentText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  bodySection: { paddingHorizontal: 20, marginBottom: 32 },
  bodyText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: colors.text.secondary,
    lineHeight: 26,
  },
  marketsSection: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
});
