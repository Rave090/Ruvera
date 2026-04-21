import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@components/Typography';
import { ScreenWrapper } from '@components/ScreenWrapper';
import { useAuthStore, selectUserProfile } from '@store/auth.store';
import { lightTheme } from '@theme';

const { colors, spacing } = lightTheme;

export default function VendorDashboardScreen() {
  const profile = useAuthStore(selectUserProfile);

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <View style={styles.container}>
        <Typography variant="h3" weight="semibold">
          Dashboard
        </Typography>
        <Typography variant="body" color="textSecondary" style={styles.sub}>
          Welcome, {profile?.displayName ?? 'Vendor'}
        </Typography>
        <Typography variant="caption" color="textDisabled" style={styles.sub}>
          Vendor dashboard — coming in Phase 6
        </Typography>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.sm },
  sub: { marginTop: spacing.xs },
});
