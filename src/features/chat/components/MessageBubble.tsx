import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@components/Typography';
import { lightTheme } from '@theme';
import type { Message } from '../types';

const { colors, spacing, borderRadius } = lightTheme;

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <View style={[styles.wrapper, isOwn ? styles.wrapperOwn : styles.wrapperOther]}>
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
        <Typography
          variant="bodySmall"
          color={isOwn ? 'surface' : 'textPrimary'}
          style={styles.text}
        >
          {message.content}
        </Typography>
      </View>
      <Typography variant="caption" color="textDisabled" style={styles.time}>
        {formatTime(message.sentAt)}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    maxWidth: '75%',
    gap: 3,
  },
  wrapperOwn: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  wrapperOther: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
  },
  bubbleOwn: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: borderRadius.xs,
  },
  bubbleOther: {
    backgroundColor: colors.surfaceSecondary,
    borderBottomLeftRadius: borderRadius.xs,
  },
  text: {
    lineHeight: 20,
  },
  time: {
    marginHorizontal: spacing.xs,
  },
});
