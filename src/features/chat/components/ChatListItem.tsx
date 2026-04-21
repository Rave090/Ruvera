import React from 'react';
import { View, Image, StyleSheet, Pressable } from 'react-native';
import { Typography } from '@components/Typography';
import { lightTheme } from '@theme';
import type { Conversation } from '../types';

const { colors, spacing, borderRadius } = lightTheme;

function formatTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

interface ChatListItemProps {
  conversation: Conversation;
  onPress: (conversation: Conversation) => void;
}

export function ChatListItem({ conversation, onPress }: ChatListItemProps) {
  const { dermatologist, lastMessage, lastMessageTime, unreadCount } = conversation;

  return (
    <Pressable
      onPress={() => onPress(conversation)}
      style={({ pressed }) => [styles.item, { opacity: pressed ? 0.85 : 1 }]}
      accessibilityRole="button"
    >
      <View style={styles.avatarWrapper}>
        {dermatologist.avatarUrl ? (
          <Image source={{ uri: dermatologist.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Typography variant="body" color="primary" weight="semibold">
              {dermatologist.name[0]}
            </Typography>
          </View>
        )}
        {dermatologist.isOnline && <View style={styles.onlineDot} />}
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Typography variant="bodySmall" weight="semibold" numberOfLines={1} style={styles.name}>
            {dermatologist.name}
          </Typography>
          <Typography variant="caption" color="textDisabled">
            {formatTime(lastMessageTime)}
          </Typography>
        </View>
        <View style={styles.bottomRow}>
          <Typography variant="caption" color="textSecondary" numberOfLines={1} style={styles.preview}>
            {lastMessage}
          </Typography>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Typography variant="caption" color="surface" weight="semibold">
                {unreadCount}
              </Typography>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceSecondary,
  },
  avatarFallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.background,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    flex: 1,
    marginRight: spacing.sm,
  },
  preview: {
    flex: 1,
    marginRight: spacing.sm,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
});
