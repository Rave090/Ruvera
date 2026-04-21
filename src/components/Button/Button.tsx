import React from 'react';
import {
  Pressable,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  StyleProp,
  View,
} from 'react-native';
import { lightTheme } from '@theme';
import Typography from '@components/Typography';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'social';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

const { colors, spacing, borderRadius } = lightTheme;

const variantStyles: Record<ButtonVariant, { container: ViewStyle; labelColor: string }> = {
  primary: {
    container: { backgroundColor: colors.primary },
    labelColor: colors.textOnPrimary,
  },
  secondary: {
    container: { backgroundColor: colors.secondary },
    labelColor: colors.textOnPrimary,
  },
  outline: {
    container: {
      backgroundColor: colors.transparent,
      borderWidth: 1.5,
      borderColor: colors.primary,
    },
    labelColor: colors.primary,
  },
  ghost: {
    container: { backgroundColor: colors.transparent },
    labelColor: colors.primary,
  },
  destructive: {
    container: { backgroundColor: colors.error },
    labelColor: colors.textOnPrimary,
  },
  social: {
    container: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    labelColor: colors.textPrimary,
  },
};

const sizeStyles: Record<ButtonSize, { container: ViewStyle; typography: 'label' | 'body' }> = {
  sm: {
    container: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.md,
      minHeight: 36,
    },
    typography: 'label',
  },
  md: {
    container: {
      paddingVertical: spacing.sm + 2,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.lg,
      minHeight: 48,
    },
    typography: 'body',
  },
  lg: {
    container: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      borderRadius: borderRadius.lg,
      minHeight: 56,
    },
    typography: 'body',
  },
};

function Button({
  variant = 'primary',
  size = 'md',
  label,
  onPress,
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  accessibilityLabel,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const { container: variantContainer, labelColor } = variantStyles[variant];
  const { container: sizeContainer, typography } = sizeStyles[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        variantContainer,
        sizeContainer,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={labelColor}
          accessibilityLabel="Loading"
        />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Typography variant={typography} color={labelColor} weight="semibold">
            {label}
          </Typography>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLeft: {
    marginRight: lightTheme.spacing.xs,
  },
  iconRight: {
    marginLeft: lightTheme.spacing.xs,
  },
});

export default Button;
