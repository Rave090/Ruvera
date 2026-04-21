import React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { lightTheme } from '@theme';
import type { ShadowKey, SpacingKey, BorderRadiusKey } from '@theme';

type CardVariant = 'default' | 'outlined' | 'elevated';

interface CardProps {
  variant?: CardVariant;
  padding?: SpacingKey;
  shadow?: ShadowKey;
  radius?: BorderRadiusKey;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  accessibilityLabel?: string;
}

const { colors, spacing, shadows, borderRadius } = lightTheme;

function Card({
  variant = 'default',
  padding = 'lg',
  shadow = 'sm',
  radius = 'xl',
  onPress,
  style,
  children,
  accessibilityLabel,
}: CardProps) {
  const containerStyle: StyleProp<ViewStyle> = [
    styles.base,
    { padding: spacing[padding], borderRadius: borderRadius[radius] },
    variant === 'outlined' ? styles.outlined : null,
    variant === 'elevated' ? (shadows[shadow] as ViewStyle) : null,
    variant === 'default' ? (shadows.xs as ViewStyle) : null,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          ...containerStyle,
          pressed && styles.pressed,
        ]}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={containerStyle} accessibilityLabel={accessibilityLabel}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.92,
  },
});

export default Card;
