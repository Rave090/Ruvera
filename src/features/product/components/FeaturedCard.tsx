import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Typography } from '@components/Typography';
import { lightTheme } from '@theme';
import { ProductBottle } from './ProductBottle';
import type { Product } from '../types';

const { colors } = lightTheme;

interface FeaturedCardProps {
  product: Product;
  onPress: () => void;
}

export function FeaturedCard({ product, onPress }: FeaturedCardProps): React.ReactElement {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.9 : 1 }]}
      accessibilityRole="button"
      accessibilityLabel={product.name}
    >
      <View style={[styles.imageContainer, { backgroundColor: product.themeColor ?? colors.surfaceSecondary }]}>
        <ProductBottle category={product.category} accentColor={product.accentColor} size="sm" />
        {product.badge && (
          <View style={[styles.badge, { backgroundColor: product.accentColor ?? colors.primary }]}>
            <Typography variant="overline" style={styles.badgeText}>{product.badge}</Typography>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Typography variant="overline" style={[styles.brand, { color: product.accentColor ?? colors.primary }]}>
          {product.brand}
        </Typography>
        <Typography variant="bodySmall" weight="semibold" color="textPrimary" numberOfLines={2} style={styles.name}>
          {product.name}
        </Typography>
        <Typography variant="bodySmall" weight="bold" color="textPrimary">
          ₹{product.price}
        </Typography>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 148,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 3,
  },
  imageContainer: {
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  info: {
    padding: 12,
    gap: 2,
  },
  name: {
    marginBottom: 4,
    lineHeight: 17,
  },
  brand: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
