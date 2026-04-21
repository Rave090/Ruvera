import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@components/Typography';
import { ScreenWrapper } from '@components/ScreenWrapper';
import { lightTheme } from '@theme';

const { colors, spacing } = lightTheme;

export default function VendorProductsScreen() {
  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <View style={styles.container}>
        <Typography variant="h3" weight="semibold">Products</Typography>
        <Typography variant="body" color="textSecondary" style={styles.sub}>
          Inventory management — coming in Phase 6
        </Typography>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.sm },
  sub: { marginTop: spacing.xs },
});
