import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '@components/Typography';
import { lightTheme } from '@theme';
import { ProductBottle } from './ProductBottle';
import { StarRating } from './StarRating';
import type { Product } from '../types';

const { colors, spacing } = lightTheme;

interface ProductListItemProps {
  product: Product;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export function ProductListItem({
  product,
  isFavorite,
  onPress,
  onToggleFavorite,
}: ProductListItemProps): React.ReactElement {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.95 : 1 }]}
      accessibilityRole="button"
      accessibilityLabel={`${product.name} by ${product.brand}`}
    >
      <View style={[styles.imageContainer, { backgroundColor: product.themeColor ?? colors.surfaceSecondary }]}>
        <ProductBottle category={product.category} accentColor={product.accentColor} size="sm" />
      </View>
      <View style={styles.info}>
        <View style={styles.infoTop}>
          <Typography variant="overline" style={[styles.brand, { color: product.accentColor ?? colors.primary }]}>
            {product.brand}
          </Typography>
          <Pressable
            onPress={onToggleFavorite}
            style={styles.heartBtn}
            accessibilityRole="button"
            accessibilityLabel={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={17} color={colors.primary} />
          </Pressable>
        </View>
        <Typography variant="label" weight="semibold" color="textPrimary" numberOfLines={2} style={styles.name}>
          {product.name}
        </Typography>
        <View style={styles.starsRow}>
          <StarRating rating={product.rating} size={11} />
          <Typography variant="overline" color="textSecondary">({product.reviewCount})</Typography>
        </View>
        <View style={styles.priceRow}>
          <View>
            <Typography variant="subheading" weight="bold" color="textPrimary" style={styles.price}>
              ₹{product.price}
            </Typography>
            {product.originalPrice && (
              <Typography variant="caption" color="textDisabled" strikethrough>
                ₹{product.originalPrice}
              </Typography>
            )}
          </View>
          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Typography variant="overline" style={styles.discountText}>{discount}% off</Typography>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  imageContainer: {
    width: 108,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 110,
  },
  info: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  infoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  brand: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  heartBtn: {
    padding: 2,
  },
  name: {
    lineHeight: 20,
    marginBottom: 5,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 16,
    lineHeight: 20,
  },
  discountBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
    elevation: 2,
  },
  discountText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.3,
  },
});
