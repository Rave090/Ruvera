import React from 'react';
import { View, Image, StyleSheet, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Typography } from '@components/Typography';
import { Button } from '@components/Button';
import { ScreenWrapper } from '@components/ScreenWrapper';
import { useProductDetail } from '@features/product/hooks/useProductDetail';
import { useCart } from '@features/cart/hooks/useCart';
import { lightTheme } from '@theme';

const { colors, spacing, borderRadius } = lightTheme;

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { product, isLoading, error } = useProductDetail(id);
  const { addToCart, isInCart } = useCart();
  const router = useRouter();

  return (
    <ScreenWrapper backgroundColor={colors.background} scrollable={false}>
      {/* Back button */}
      <Pressable
        onPress={() => router.back()}
        style={styles.back}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Typography variant="body" color="primary">← Back</Typography>
      </Pressable>

      {isLoading && (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      )}

      {error && (
        <View style={styles.center}>
          <Typography variant="body" color="error">{error}</Typography>
        </View>
      )}

      {product && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Image source={{ uri: product.imageUrl }} style={styles.image} />
          <View style={styles.content}>
            <Typography variant="caption" color="textDisabled">{product.brand}</Typography>
            <Typography variant="h3" weight="semibold" style={styles.name}>
              {product.name}
            </Typography>

            <View style={styles.ratingRow}>
              <Typography variant="bodySmall" color="textSecondary">
                ★ {product.rating.toFixed(1)}
              </Typography>
              <Typography variant="caption" color="textDisabled">
                {' '}({product.reviewCount} reviews)
              </Typography>
            </View>

            <View style={styles.priceRow}>
              <Typography variant="h3" weight="semibold" color="primary">
                ${product.price.toFixed(2)}
              </Typography>
              {product.originalPrice && (
                <Typography variant="body" color="textDisabled" style={styles.strike}>
                  ${product.originalPrice.toFixed(2)}
                </Typography>
              )}
            </View>

            <View style={styles.tags}>
              {product.tags.map(tag => (
                <View key={tag} style={styles.tag}>
                  <Typography variant="caption" color="textSecondary">{tag}</Typography>
                </View>
              ))}
            </View>

            <Typography variant="body" color="textSecondary" style={styles.description}>
              {product.description}
            </Typography>

            <Button
              variant={isInCart(product.id) ? 'outline' : 'primary'}
              label={isInCart(product.id) ? 'Added to cart ✓' : 'Add to cart'}
              onPress={() => addToCart(product)}
              style={styles.cta}
            />
          </View>
        </ScrollView>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  back: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 320,
    backgroundColor: colors.surfaceSecondary,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  name: {
    marginTop: spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  strike: {
    textDecorationLine: 'line-through',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  tag: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  description: {
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  cta: {
    marginTop: spacing.lg,
  },
});
