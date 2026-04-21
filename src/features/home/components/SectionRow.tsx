import React from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Typography } from '@components/Typography';
import { lightTheme } from '@theme';

const { spacing } = lightTheme;

interface SectionRowProps {
  title: string;
  onSeeAll?: () => void;
  children: React.ReactNode;
}

export function SectionRow({ title, onSeeAll, children }: SectionRowProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Typography variant="subheading" weight="semibold">{title}</Typography>
        {onSeeAll && (
          <Pressable onPress={onSeeAll} accessibilityRole="button">
            <Typography variant="bodySmall" color="primary" weight="medium">
              See all
            </Typography>
          </Pressable>
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  row: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
});
