import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@components/Typography';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { Card } from '@components/Card';
import { ScreenWrapper } from '@components/ScreenWrapper';
import { useForgotPassword } from '@features/auth/hooks/useForgotPassword';
import { lightTheme } from '@theme';

const { colors, spacing } = lightTheme;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { email, setEmail, error, isLoading, isSuccess, submit } = useForgotPassword();

  if (isSuccess) {
    return (
      <ScreenWrapper backgroundColor={colors.background}>
        <View style={styles.successContainer}>
          <Typography variant="h2" weight="bold" align="center">
            Check your inbox
          </Typography>
          <Typography
            variant="body"
            color="textSecondary"
            align="center"
            style={styles.successMessage}
          >
            If an account exists for {email}, you will receive a password reset
            link shortly.
          </Typography>
          <Button
            label="Back to Login"
            onPress={() => router.replace('/(auth)/login')}
            fullWidth
            size="lg"
            style={styles.backButton}
          />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper keyboardAware backgroundColor={colors.background}>
      <View style={styles.header}>
        <Button
          variant="ghost"
          label="← Back"
          onPress={() => router.back()}
          size="sm"
          style={styles.backLink}
        />
        <Typography variant="h2" weight="bold">
          Reset password
        </Typography>
        <Typography variant="body" color="textSecondary" style={styles.subtitle}>
          Enter your email and we&apos;ll send you a reset link.
        </Typography>
      </View>

      <Card variant="elevated" shadow="md" style={styles.card}>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          returnKeyType="send"
          onSubmitEditing={submit}
          required
        />

        {error && (
          <Typography variant="caption" color="error" style={styles.errorText}>
            {error}
          </Typography>
        )}

        <Button
          label="Send reset link"
          onPress={submit}
          loading={isLoading}
          fullWidth
          size="lg"
          style={styles.submitButton}
        />
      </Card>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.xl,
    marginTop: spacing.lg,
  },
  backLink: {
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
    marginLeft: -spacing.sm,
  },
  subtitle: {
    marginTop: spacing.xs,
  },
  card: {
    padding: spacing.xl,
  },
  errorText: {
    marginTop: spacing.sm,
  },
  submitButton: {
    marginTop: spacing.xl,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  successMessage: {
    marginTop: spacing.md,
    textAlign: 'center',
    lineHeight: 24,
  },
  backButton: {
    marginTop: spacing.xxxl,
  },
});
