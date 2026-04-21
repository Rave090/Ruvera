import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@components/Typography';
import { Button } from '@components/Button';
import { ScreenWrapper } from '@components/ScreenWrapper';
import { useAuthStore, selectUserProfile } from '@store/auth.store';
import { useLogout } from '@features/auth/hooks/useLogout';
import { lightTheme } from '@theme';

const { colors, spacing } = lightTheme;

export default function DermProfileScreen() {
  const profile = useAuthStore(selectUserProfile);
  const { logout, isLoading } = useLogout();

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <View style={styles.container}>
        <Typography variant="h3" weight="semibold">{profile?.displayName ?? 'Doctor'}</Typography>
        <Typography variant="body" color="textSecondary" style={styles.sub}>{profile?.email}</Typography>
        <Typography variant="caption" color="textDisabled" style={styles.sub}>
          Dermatologist
        </Typography>
        <Button
          variant="outline"
          label="Log out"
          onPress={logout}
          loading={isLoading}
          style={styles.logoutButton}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.sm },
  sub: { marginTop: spacing.xs },
  logoutButton: { marginTop: spacing.xxl },
});
