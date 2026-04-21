import React from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BrandIcon from '@components/BrandIcon/BrandIcon';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { Typography } from '@components/Typography';
import { useLogin } from '@features/auth/hooks/useLogin';
import { lightTheme } from '@theme';

const { colors, spacing } = lightTheme;
const BRAND = '#5C2B3E';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { form, setField, error, isLoading, login } = useLogin();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header bar */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.headerLeft}>
          <BrandIcon size={22} color={BRAND} />
          <Typography style={styles.headerBrand}>Ruvera</Typography>
        </View>
        <View style={styles.avatarCircle} />
      </View>
      <View style={styles.headerDivider} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: Math.max(insets.bottom + spacing.xl, spacing.xxl) },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Heading */}
          <View style={styles.headingBlock}>
            <Typography style={styles.heading}>Welcome Back</Typography>
            <Typography variant="body" color="textSecondary" style={styles.subheading}>
              Continue your personalized skin ritual
            </Typography>
          </View>

          {/* Inputs */}
          <Input
            variant="filled"
            placeholder="Email Address"
            value={form.email}
            onChangeText={(v) => setField('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            returnKeyType="next"
          />
          <View style={styles.inputGap} />
          <Input
            variant="filled"
            placeholder="Password"
            value={form.password}
            onChangeText={(v) => setField('password', v)}
            secureToggle
            autoComplete="password"
            returnKeyType="done"
            onSubmitEditing={login}
          />

          {/* Forgot password */}
          <Button
            variant="ghost"
            size="sm"
            label="Forgot password?"
            onPress={() => router.push('/(auth)/forgot-password')}
            style={styles.forgotBtn}
          />

          {error && (
            <Typography variant="caption" color="error" style={styles.errorText}>
              {error}
            </Typography>
          )}

          {/* Login CTA */}
          <Button
            variant="primary"
            size="lg"
            label="Login"
            onPress={login}
            loading={isLoading}
            fullWidth
            style={styles.loginBtn}
          />

          {/* OR divider */}
          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Typography style={styles.orText}>OR CONNECT VIA</Typography>
            <View style={styles.orLine} />
          </View>

          {/* Social buttons */}
          <View style={styles.socialRow}>
            <Button
              variant="social"
              size="md"
              label="G"
              onPress={() => {}}
              style={styles.socialCircle}
              accessibilityLabel="Sign in with Google"
            />
            <Button
              variant="social"
              size="md"
              label={'\uF8FF'}
              onPress={() => {}}
              style={styles.socialCircle}
              accessibilityLabel="Sign in with Apple"
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Typography variant="body" color="textSecondary" align="center">
              New to Ruvera?
            </Typography>
            <Button
              variant="outline"
              size="md"
              label="Create an account"
              onPress={() => router.push('/(auth)/signup')}
              fullWidth
              style={styles.createAccountBtn}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Decorative leaves — bottom-right */}
      <View
        style={[styles.decoLeaves, { bottom: -width * 0.12, right: -width * 0.08 }]}
        pointerEvents="none"
      >
        <BrandIcon size={width * 0.52} color="rgba(92, 43, 62, 0.07)" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerBrand: {
    fontSize: 15,
    fontWeight: '700',
    color: BRAND,
    letterSpacing: 0.3,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D4C0C4',
    borderWidth: 2,
    borderColor: '#C4A8B0',
  },
  headerDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  headingBlock: {
    marginBottom: spacing.xxl,
    marginTop: spacing.lg,
  },
  heading: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 44,
  },
  subheading: {
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  inputGap: { height: spacing.md },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: spacing.sm,
  },
  errorText: { marginTop: spacing.sm },
  loginBtn: {
    borderRadius: 999,
    marginTop: spacing.lg,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginVertical: spacing.xl,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  orText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textDisabled,
    letterSpacing: 1.5,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  socialCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    paddingHorizontal: 0,
    paddingVertical: 0,
    minHeight: 64,
  },
  footer: {
    marginTop: spacing.xxl,
    gap: spacing.md,
  },
  createAccountBtn: {
    borderRadius: 999,
  },
  decoLeaves: {
    position: 'absolute',
    zIndex: 0,
    pointerEvents: 'none',
  },
});
