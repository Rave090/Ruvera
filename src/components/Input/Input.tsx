import React, { useState } from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  Pressable,
  StyleSheet,
  StyleProp,
  TextStyle,
} from 'react-native';
import { lightTheme } from '@theme';
import Typography from '@components/Typography';
import type { ColorKey } from '@theme';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  labelColor?: ColorKey | (string & {});
  labelStyle?: StyleProp<TextStyle>;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  secureToggle?: boolean;
  disabled?: boolean;
  required?: boolean;
  variant?: 'outlined' | 'filled';
}

const { colors, spacing, borderRadius, typography } = lightTheme;

function Input({
  label,
  labelColor,
  labelStyle,
  error,
  helperText,
  leftIcon,
  rightIcon,
  secureToggle = false,
  disabled = false,
  required = false,
  variant = 'outlined',
  secureTextEntry,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureVisible, setIsSecureVisible] = useState(false);

  const isSecure = secureToggle ? !isSecureVisible : (secureTextEntry ?? false);
  const hasError = Boolean(error);

  const borderColor = hasError
    ? colors.borderError
    : isFocused
      ? colors.borderFocus
      : colors.border;

  return (
    <View style={styles.wrapper}>
      {label && (
        <View style={styles.labelRow}>
          <Typography
            variant="label"
            color={labelColor ?? 'textSecondary'}
            style={labelStyle}
          >
            {label}
          </Typography>
          {required && (
            <Typography variant="label" color="error">
              {' *'}
            </Typography>
          )}
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          variant === 'filled' ? styles.containerFilled : { borderColor },
          variant === 'filled'
            ? (isFocused ? styles.focusedFilled : null)
            : (isFocused ? styles.focused : null),
          disabled && styles.disabled,
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            { color: disabled ? colors.textDisabled : colors.textPrimary },
          ]}
          placeholderTextColor={colors.textDisabled}
          selectionColor={colors.primary}
          cursorColor={colors.primary}
          editable={!disabled}
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          accessibilityLabel={label}
          accessibilityState={{ disabled }}
          {...rest}
        />

        {secureToggle ? (
          <Pressable
            style={styles.iconRight}
            onPress={() => setIsSecureVisible((prev) => !prev)}
            accessibilityLabel={isSecureVisible ? 'Hide password' : 'Show password'}
            hitSlop={8}
          >
            <Typography variant="caption" color="textSecondary">
              {isSecureVisible ? 'Hide' : 'Show'}
            </Typography>
          </Pressable>
        ) : rightIcon ? (
          <View style={styles.iconRight}>{rightIcon}</View>
        ) : null}
      </View>

      {(error || helperText) && (
        <Typography
          variant="caption"
          color={hasError ? 'error' : 'textSecondary'}
          style={styles.helperText}
        >
          {error ?? helperText}
        </Typography>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    minHeight: 56,
  },
  containerFilled: {
    borderWidth: 0,
    borderRadius: 999,
    backgroundColor: '#EDEDED',
  },
  focused: {
    backgroundColor: colors.surfaceSecondary,
  },
  focusedFilled: {
    backgroundColor: '#E4E4E4',
  },
  disabled: {
    backgroundColor: colors.surfaceTertiary,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontSize: typography.variants.body.fontSize,
    lineHeight: typography.variants.body.lineHeight,
    fontWeight: typography.variants.body.fontWeight,
    paddingVertical: spacing.sm,
    includeFontPadding: false,
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
  helperText: {
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});

export default Input;
