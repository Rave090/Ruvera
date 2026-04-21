import React from 'react';
import { View, Image, StyleSheet, Pressable } from 'react-native';
import { Typography } from '@components/Typography';
import { lightTheme } from '@theme';
import type { Product } from '../types';

const { colors, spacing, borderRadius } = lightTheme;

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  width?: number;
}

export function ProductCard({ product, onPress, width = 160 }: ProductCardProps) {
  return (
    <Pressable
      onPress={() => onPress(product)}
      style={({ pressed }) => [styles.card, { width, opacity: pressed ? 0.85 : 1 }]}
      accessibilityRole="button"
      accessibilityLabel={`${product.name} by ${product.brand}, $${product.price}`}
    >
      <Image source={{ uri: product.imageUrl }} style={[styles.image, { width }]} />
      {product.isDiscounted && (
        <View style={styles.badge}>
          <Typography variant="caption" color="surface" weight="semibold">
            SALE
          </Typography>
        </View>
      )}
      <View style={styles.info}>
        <Typography variant="caption" color="textDisabled" numberOfLines={1}>
          {product.brand}
        </Typography>
        <Typography variant="bodySmall" weight="medium" numberOfLines={2} style={styles.name}>
          {product.name}
        </Typography>
        <View style={styles.priceRow}>
          <Typography variant="bodySmall" weight="semibold" color="primary">
            ${product.price.toFixed(2)}
          </Typography>
          {product.originalPrice && (
            <Typography variant="caption" color="textDisabled" style={styles.originalPrice}>
              ${product.originalPrice.toFixed(2)}
            </Typography>
          )}
        </View>
        <View style={styles.ratingRow}>
          <Typography variant="caption" color="textSecondary">
            ★ {product.rating.toFixed(1)}
          </Typography>
          <Typography variant="caption" color="textDisabled">
            {' '}({product.reviewCount})
          </Typography>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    height: 160,
    backgroundColor: colors.surfaceSecondary,
  },
  badge: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    backgroundColor: colors.error,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  info: {
    padding: spacing.sm,
    gap: 2,
  },
  name: {
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
});
