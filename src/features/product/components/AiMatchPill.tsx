import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '@components/Typography';
import { lightTheme } from '@theme';

const { colors, spacing } = lightTheme;

interface AiMatchPillProps {
  matchCount: number;
  skinProfile: string;
  onPress: () => void;
}

export function AiMatchPill({ matchCount, skinProfile, onPress }: AiMatchPillProps): React.ReactElement {
  return (
    <Pressable onPress={onPress} style={styles.container} accessibilityRole="button">
      <View style={styles.icon}>
        <Ionicons name="sparkles" size={16} color={colors.textOnPrimary} />
      </View>
      <View style={styles.text}>
        <Typography variant="bodySmall" weight="semibold" color="textPrimary">
          {matchCount} products matched for you
        </Typography>
        <Typography variant="overline" color="textSecondary" style={styles.subtext}>
          Based on your {skinProfile} skin profile
        </Typography>
      </View>
      <Ionicons name="chevron-forward" size={14} color={colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.md,
    marginBottom: 18,
    marginTop: spacing.xs,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.surfaceSecondary,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  text: {
    flex: 1,
    gap: 1,
  },
  subtext: {
    marginTop: 1,
  },
});
