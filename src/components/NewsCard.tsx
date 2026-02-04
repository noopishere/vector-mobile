import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing } from '../theme/colors';
import { NewsItem } from '../store/useAppStore';

interface NewsCardProps {
  item: NewsItem;
  onPress?: () => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({ item, onPress }) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.category}>{item.category || 'NEWS'}</Text>
        <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.summary} numberOfLines={2}>{item.summary}</Text>
      <Text style={styles.source}>{item.source}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  category: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  timestamp: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: colors.textDim,
  },
  title: {
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
    lineHeight: 22,
  },
  summary: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    lineHeight: 18,
  },
  source: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: colors.textDim,
  },
});

export default NewsCard;
