import React from 'react';
import { Text, TextStyle, StyleSheet, TextProps } from 'react-native';
import { lightTheme } from '@theme';
import type { TypographyVariant } from '@theme';
import type { ColorKey } from '@theme';

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: ColorKey | (string & {});
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  align?: TextStyle['textAlign'];
  italic?: boolean;
  strikethrough?: boolean;
  underline?: boolean;
  numberOfLines?: number;
  children: React.ReactNode;
}

function Typography({
  variant = 'body',
  color,
  weight,
  align,
  italic = false,
  strikethrough = false,
  underline = false,
  style,
  children,
  ...rest
}: TypographyProps) {
  const variantStyle = lightTheme.typography.variants[variant];

  const resolvedColor = color
    ? (lightTheme.colors[color as ColorKey] ?? color)
    : lightTheme.colors.textPrimary;

  const resolvedWeight = weight
    ? lightTheme.typography.fontWeight?.[weight]
    : variantStyle.fontWeight;

  const textDecorationLine: TextStyle['textDecorationLine'] =
    strikethrough && underline
      ? 'underline line-through'
      : strikethrough
        ? 'line-through'
        : underline
          ? 'underline'
          : 'none';

  return (
    <Text
      style={[
        styles.base,
        {
          fontSize: variantStyle.fontSize,
          lineHeight: variantStyle.lineHeight,
          fontWeight: resolvedWeight,
          letterSpacing: variantStyle.letterSpacing,
          color: resolvedColor,
          textAlign: align,
          fontStyle: italic ? 'italic' : 'normal',
          textDecorationLine,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});

export default Typography;
