import React from 'react';
import { View, Image, StyleSheet, Pressable } from 'react-native';
import { Typography } from '@components/Typography';
import { lightTheme } from '@theme';
import type { CartItem } from '../types';

const { colors, spacing, borderRadius } = lightTheme;

interface CartItemRowProps {
  item: CartItem;
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export function CartItemRow({ item, onRemove, onUpdateQuantity }: CartItemRowProps) {
  const { product, quantity } = item;

  return (
    <View style={styles.row}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <View style={styles.details}>
        <Typography variant="bodySmall" weight="medium" numberOfLines={2}>
          {product.name}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {product.brand}
        </Typography>
        <Typography variant="bodySmall" weight="semibold" color="primary">
          ${product.price.toFixed(2)}
        </Typography>
      </View>
      <View style={styles.controls}>
        <Pressable
          onPress={() => onRemove(product.id)}
          style={styles.removeBtn}
          accessibilityRole="button"
          accessibilityLabel="Remove item"
        >
          <Typography variant="caption" color="error">✕</Typography>
        </Pressable>
        <View style={styles.quantityRow}>
          <Pressable
            onPress={() => onUpdateQuantity(product.id, quantity - 1)}
            style={styles.qtyBtn}
            accessibilityRole="button"
          >
            <Typography variant="body" weight="semibold">−</Typography>
          </Pressable>
          <Typography variant="bodySmall" weight="semibold" style={styles.qty}>
            {quantity}
          </Typography>
          <Pressable
            onPress={() => onUpdateQuantity(product.id, quantity + 1)}
            style={styles.qtyBtn}
            accessibilityRole="button"
          >
            <Typography variant="body" weight="semibold">+</Typography>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSecondary,
  },
  details: {
    flex: 1,
    gap: 2,
  },
  controls: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  removeBtn: {
    padding: spacing.xs,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  qtyBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    backgroundColor: colors.surfaceSecondary,
  },
  qty: {
    width: 28,
    textAlign: 'center',
  },
});
