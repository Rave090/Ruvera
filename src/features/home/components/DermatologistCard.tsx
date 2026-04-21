import React from 'react';
import { View, Image, StyleSheet, Pressable } from 'react-native';
import { Typography } from '@components/Typography';
import { lightTheme } from '@theme';
import type { Dermatologist } from '../types';

const { colors, spacing, borderRadius } = lightTheme;

interface DermatologistCardProps {
  dermatologist: Dermatologist;
  onPress: (dermatologist: Dermatologist) => void;
}

export function DermatologistCard({ dermatologist, onPress }: DermatologistCardProps) {
  return (
    <Pressable
      onPress={() => onPress(dermatologist)}
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.85 : 1 }]}
      accessibilityRole="button"
    >
      <View style={styles.avatarWrapper}>
        {dermatologist.avatarUrl ? (
          <Image source={{ uri: dermatologist.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Typography variant="h3" color="primary">
              {dermatologist.name[0]}
            </Typography>
          </View>
        )}
        {dermatologist.isOnline && <View style={styles.onlineDot} />}
      </View>
      <View style={styles.info}>
        <Typography variant="bodySmall" weight="semibold" numberOfLines={1}>
          {dermatologist.name}
        </Typography>
        <Typography variant="caption" color="textSecondary" numberOfLines={1}>
          {dermatologist.specialization}
        </Typography>
        <View style={styles.row}>
          <Typography variant="caption" color="textSecondary">
            ★ {dermatologist.rating.toFixed(1)}
          </Typography>
          <Typography variant="caption" color="textDisabled">
            {' '}· ${dermatologist.consultationFee}/consult
          </Typography>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 150,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceSecondary,
  },
  avatarFallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  info: {
    alignItems: 'center',
    gap: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
