import React, { useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BrandIcon from '@components/BrandIcon/BrandIcon';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { Typography } from '@components/Typography';
import { useSignup } from '@features/auth/hooks/useSignup';
import { MOCK_ROLE_HINT } from '@features/auth/services/auth.service';
import { lightTheme } from '@theme';
import type { UserRole } from '@store/auth.store';

const { colors, spacing, borderRadius } = lightTheme;
const BRAND = '#5C2B3E';
const AMBER = '#C8906A';

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'user', label: 'User' },
  { value: 'vendor', label: 'Vendor' },
  { value: 'dermatologist', label: 'Derm' },
];

export default function SignupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { form, setField, error, isLoading, signup } = useSignup();
  const [termsAccepted, setTermsAccepted] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Warm amber accent — top-right */}
      <View
        style={[
          styles.bgAmber,
          { width: width * 0.55, height: height * 0.5 },
        ]}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            {
              paddingTop: insets.top + spacing.xl,
              paddingBottom: Math.max(insets.bottom + spacing.xl, spacing.xxl),
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Brand header */}
          <View style={styles.brandHeader}>
            <BrandIcon size={32} color={BRAND} />
            <Typography style={styles.brandName}>Ruvera</Typography>
            <Typography style={styles.brandTagline}>AURA AI EXPERIENCE</Typography>
          </View>

          {/* White form card */}
          <View style={styles.card}>
            <Typography style={styles.cardHeading}>Begin Your Journey</Typography>
            <Typography variant="body" color="textSecondary" style={styles.cardSubtitle}>
              Create your personal skincare profile to start your AI-powered ritual.
            </Typography>

            <View style={styles.fieldGroup}>
              <Input
                variant="filled"
                label="FULL NAME"
                labelColor="primary"
                labelStyle={styles.fieldLabel}
                placeholder="Evelyn Rose"
                value={form.displayName}
                onChangeText={(v) => setField('displayName', v)}
                autoCapitalize="words"
                autoComplete="name"
                returnKeyType="next"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Input
                variant="filled"
                label="EMAIL ADDRESS"
                labelColor="primary"
                labelStyle={styles.fieldLabel}
                placeholder="evelyn@example.com"
                value={form.email}
                onChangeText={(v) => setField('email', v)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="next"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Input
                variant="filled"
                label="CREATE PASSWORD"
                labelColor="primary"
                labelStyle={styles.fieldLabel}
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                value={form.password}
                onChangeText={(v) => setField('password', v)}
                secureToggle
                autoComplete="new-password"
                returnKeyType="done"
              />
            </View>

            {/* Account type */}
            <View style={styles.fieldGroup}>
              <Typography
                style={styles.fieldLabel}
                color="primary"
              >
                ACCOUNT TYPE
              </Typography>
              <View style={styles.roleRow}>
                {ROLES.map(({ value, label }) => {
                  const isSelected = form.role === value;
                  return (
                    <Pressable
                      key={value}
                      onPress={() => setField('role', value)}
                      style={[styles.roleChip, isSelected && styles.roleChipSelected]}
                      accessibilityRole="radio"
                      accessibilityLabel={`Select role: ${label}`}
                      accessibilityState={{ selected: isSelected }}
                    >
                      <Typography
                        variant="label"
                        color={isSelected ? 'textOnPrimary' : 'textSecondary'}
                      >
                        {label}
                      </Typography>
                    </Pressable>
                  );
                })}
              </View>
              <Typography variant="caption" color="textDisabled" style={styles.roleHint}>
                {MOCK_ROLE_HINT[form.role]}
              </Typography>
            </View>

            {/* Terms checkbox */}
            <Pressable
              style={styles.termsRow}
              onPress={() => setTermsAccepted((v) => !v)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: termsAccepted }}
              accessibilityLabel="I agree to the Terms of Service and Privacy Policy"
            >
              <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
                {termsAccepted && (
                  <Typography style={styles.checkmark}>✓</Typography>
                )}
              </View>
              <Typography variant="bodySmall" color="textSecondary" style={styles.termsText}>
                {'I agree to the '}
                <Typography variant="bodySmall" color="primary" underline>
                  Terms of Service
                </Typography>
                {' and '}
                <Typography variant="bodySmall" color="primary" underline>
                  Privacy Policy
                </Typography>
                {'.'}
              </Typography>
            </Pressable>

            {error && (
              <Typography variant="caption" color="error" style={styles.errorText}>
                {error}
              </Typography>
            )}

            <Button
              variant="primary"
              size="lg"
              label="Create Account  →"
              onPress={signup}
              loading={isLoading}
              disabled={!termsAccepted}
              fullWidth
              style={styles.submitBtn}
            />

            <View style={styles.loginLinkRow}>
              <Typography variant="bodySmall" color="textSecondary">
                {'Already part of the community?  '}
              </Typography>
              <Button
                variant="ghost"
                size="sm"
                label="Login"
                onPress={() => router.back()}
              />
            </View>
          </View>

          {/* Decorative bottom icons */}
          <View style={styles.bottomSection}>
            <View style={styles.bottomLine} />
            <View style={styles.bottomIconsRow}>
              <BrandIcon size={20} color={colors.primaryLight} />
              <Typography style={styles.bottomIcon}>{'💧'}</Typography>
              <Typography style={styles.bottomIcon}>{'⚗️'}</Typography>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF2F3',
  },
  flex: { flex: 1 },
  bgAmber: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: AMBER,
    borderBottomLeftRadius: 32,
  },
  scroll: {
    paddingHorizontal: spacing.xl,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: spacing.xs,
  },
  brandName: {
    fontSize: 36,
    fontWeight: '700',
    color: BRAND,
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 2.5,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  cardHeading: {
    fontSize: 28,
    fontWeight: '700',
    color: BRAND,
    lineHeight: 36,
    marginBottom: spacing.sm,
  },
  cardSubtitle: {
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  fieldGroup: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: spacing.xs,
  },
  roleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  roleChip: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  roleChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleHint: {
    marginTop: spacing.xs,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    fontSize: 13,
    color: colors.textOnPrimary,
    fontWeight: '700',
    lineHeight: 16,
  },
  termsText: {
    flex: 1,
    lineHeight: 20,
  },
  errorText: {
    marginBottom: spacing.sm,
  },
  submitBtn: {
    borderRadius: 999,
    marginBottom: spacing.md,
  },
  loginLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  bottomSection: {
    marginTop: spacing.xl,
    alignItems: 'center',
    paddingBottom: spacing.md,
  },
  bottomLine: {
    width: '100%',
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },
  bottomIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
  },
  bottomIcon: {
    fontSize: 18,
    opacity: 0.7,
  },
});
