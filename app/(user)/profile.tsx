import React from 'react';
import { View, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@components/Typography';
import { Button } from '@components/Button';
import { ScreenWrapper } from '@components/ScreenWrapper';
import { useAuthStore, selectUserProfile } from '@store/auth.store';
import { useLogout } from '@features/auth/hooks/useLogout';
import { useProfile } from '@features/profile/hooks/useProfile';
import { lightTheme } from '@theme';

const { colors, spacing, borderRadius } = lightTheme;

export default function ProfileScreen() {
  const authProfile = useAuthStore(selectUserProfile);
  const { logout, isLoading: isLoggingOut } = useLogout();
  const { profile, isLoading } = useProfile();
  const router = useRouter();

  const initials = authProfile?.displayName
    ?.split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '?';

  return (
    <ScreenWrapper backgroundColor={colors.background} scrollable>
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Typography variant="h2" color="primary" weight="semibold">{initials}</Typography>
        </View>
        <Typography variant="subheading" weight="semibold">
          {authProfile?.displayName ?? 'User'}
        </Typography>
        <Typography variant="body" color="textSecondary">{authProfile?.email}</Typography>
      </View>

      {isLoading ? (
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      ) : (
        <View style={styles.sections}>
          {/* Skin Profile */}
          <View style={styles.card}>
            <Typography variant="bodySmall" weight="semibold" style={styles.cardTitle}>
              Skin Profile
            </Typography>
            {profile?.skinProfile ? (
              <View style={styles.skinInfo}>
                <View style={styles.infoRow}>
                  <Typography variant="caption" color="textSecondary">Skin type</Typography>
                  <Typography variant="caption" weight="medium">
                    {profile.skinProfile.skinType.charAt(0).toUpperCase() +
                      profile.skinProfile.skinType.slice(1)}
                  </Typography>
                </View>
                {profile.skinProfile.concerns.length > 0 && (
                  <View style={styles.infoRow}>
                    <Typography variant="caption" color="textSecondary">Concerns</Typography>
                    <Typography variant="caption" weight="medium">
                      {profile.skinProfile.concerns.join(', ')}
                    </Typography>
                  </View>
                )}
              </View>
            ) : (
              <Typography variant="caption" color="textDisabled" style={styles.emptyText}>
                No skin profile set up yet.
              </Typography>
            )}
          </View>

          {/* Orders */}
          <Pressable
            style={styles.card}
            onPress={() => router.push('/(user)/orders' as never)}
            accessibilityRole="button"
          >
            <View style={styles.rowBetween}>
              <Typography variant="bodySmall" weight="semibold">Order History</Typography>
              <Typography variant="body" color="textDisabled">›</Typography>
            </View>
          </Pressable>

          {/* Favorites */}
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <Typography variant="bodySmall" weight="semibold">Favourites</Typography>
              <Typography variant="caption" color="textSecondary">
                {profile?.favoriteProductIds.length ?? 0} items
              </Typography>
            </View>
          </View>

          {/* Logout */}
          <Button
            variant="outline"
            label="Log out"
            onPress={logout}
            loading={isLoggingOut}
            style={styles.logoutBtn}
          />
        </View>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  avatarSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.xs,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  loader: {
    marginTop: spacing.xxl,
  },
  sections: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  cardTitle: {
    marginBottom: spacing.sm,
  },
  skinInfo: {
    gap: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: spacing.xs,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutBtn: {
    marginTop: spacing.sm,
  },
});
