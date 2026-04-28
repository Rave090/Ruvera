import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '@components/Typography';
import { Button } from '@components/Button';
import { lightTheme } from '@theme';
import { useProductDetail } from '@features/product/hooks/useProductDetail';
import { useCartStore, selectCartItemCount } from '@store/cart.store';
import { ProductBottle } from '@features/product/components/ProductBottle';
import { StarRating } from '@features/product/components/StarRating';
import type { Product, ProductReview } from '@features/product/types';

const { colors, spacing } = lightTheme;

const ROSE = '#5C2B3E';
const ROSE_LIGHT = '#F5E8EA';
const SUCCESS_GREEN = '#4caf7d';

type DetailTab = 'about' | 'ingredients' | 'reviews';

function BackButton({ onPress }: { onPress: () => void }): React.ReactElement {
  return (
    <Pressable
      onPress={onPress}
      style={styles.iconBtn}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <Ionicons name="arrow-back" size={18} color={colors.textPrimary} />
    </Pressable>
  );
}

function CartButton({
  count,
  onPress,
}: {
  count: number;
  onPress: () => void;
}): React.ReactElement {
  return (
    <Pressable
      onPress={onPress}
      style={styles.iconBtn}
      accessibilityRole="button"
      accessibilityLabel={`Cart, ${count} items`}
    >
      <Ionicons name="bag-outline" size={18} color={ROSE} />
      {count > 0 && (
        <View style={styles.cartBadge}>
          <Typography variant="overline" style={styles.cartBadgeText}>
            {count > 99 ? '99+' : count}
          </Typography>
        </View>
      )}
    </Pressable>
  );
}

function QuantitySelector({
  value,
  onDecrement,
  onIncrement,
}: {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
}): React.ReactElement {
  return (
    <View style={styles.qtyRow}>
      <Pressable
        onPress={onDecrement}
        style={styles.qtyBtn}
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
        disabled={value <= 1}
      >
        <Typography variant="subheading" weight="bold" style={{ color: ROSE, lineHeight: 22 }}>
          −
        </Typography>
      </Pressable>
      <Typography variant="label" weight="bold" color="textPrimary" style={styles.qtyValue}>
        {value}
      </Typography>
      <Pressable
        onPress={onIncrement}
        style={[styles.qtyBtn, styles.qtyBtnActive]}
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
      >
        <Typography variant="subheading" weight="bold" style={{ color: '#fff', lineHeight: 22 }}>
          +
        </Typography>
      </Pressable>
    </View>
  );
}

function TabBar({
  active,
  onChange,
}: {
  active: DetailTab;
  onChange: (t: DetailTab) => void;
}): React.ReactElement {
  const tabs: Array<{ id: DetailTab; label: string }> = [
    { id: 'about', label: 'About' },
    { id: 'ingredients', label: 'Ingredients' },
    { id: 'reviews', label: 'Reviews' },
  ];
  return (
    <View style={styles.tabBar}>
      {tabs.map(tab => (
        <Pressable
          key={tab.id}
          onPress={() => onChange(tab.id)}
          style={[styles.tabItem, active === tab.id && styles.tabItemActive]}
          accessibilityRole="tab"
          accessibilityState={{ selected: active === tab.id }}
        >
          <Typography
            variant="label"
            weight="semibold"
            style={[styles.tabLabel, active === tab.id && styles.tabLabelActive]}
          >
            {tab.label}
          </Typography>
        </Pressable>
      ))}
    </View>
  );
}

function AboutTab({ product }: { product: Product }): React.ReactElement {
  return (
    <Typography variant="body" color="textSecondary" style={styles.aboutText}>
      {product.description}
    </Typography>
  );
}

function IngredientsTab({ product }: { product: Product }): React.ReactElement {
  const keyActives = (product.ingredients ?? '')
    .split(', ')
    .slice(1, 5);

  return (
    <View>
      <Typography variant="bodySmall" color="textSecondary" style={styles.ingredientsAll}>
        {product.ingredients ?? 'Ingredient list not available.'}
      </Typography>
      {keyActives.length > 0 && (
        <View style={styles.keyActivesCard}>
          <Typography variant="overline" color="textSecondary" style={styles.keyActivesTitle}>
            Key Actives
          </Typography>
          {keyActives.map(ing => (
            <View key={ing} style={styles.activeRow}>
              <View
                style={[styles.activeDot, { backgroundColor: product.accentColor ?? ROSE }]}
              />
              <Typography variant="bodySmall" color="textPrimary" weight="medium">
                {ing.trim()}
              </Typography>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function ReviewCard({ review }: { review: ProductReview }): React.ReactElement {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Typography variant="label" weight="semibold" color="textPrimary">
          {review.authorName}
        </Typography>
        <Typography variant="caption" color="textDisabled">
          {review.date}
        </Typography>
      </View>
      <StarRating rating={review.rating} size={12} />
      <Typography variant="bodySmall" color="textSecondary" style={styles.reviewText}>
        {review.text}
      </Typography>
    </View>
  );
}

function ReviewsTab({ product }: { product: Product }): React.ReactElement {
  const reviews = product.reviews ?? [];

  if (reviews.length === 0) {
    return (
      <Typography variant="body" color="textSecondary" align="center">
        No reviews yet
      </Typography>
    );
  }

  return (
    <View style={{ gap: 12 }}>
      {reviews.map(r => (
        <ReviewCard key={r.id} review={r} />
      ))}
    </View>
  );
}

function ProductDetail({ product }: { product: Product }): React.ReactElement {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<DetailTab>('about');
  const [justAdded, setJustAdded] = useState(false);

  const cartCount = useCartStore(selectCartItemCount);
  const addItem = useCartStore(s => s.addItem);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = useCallback(() => {
    addItem(product, qty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }, [addItem, product, qty]);

  const handleBuyNow = useCallback(() => {
    addItem(product, qty);
    router.push('/(user)/cart');
  }, [addItem, product, qty, router]);

  return (
    <View style={styles.root}>
      {/* Hero Section */}
      <View
        style={[
          styles.hero,
          { backgroundColor: product.themeColor ?? colors.surfaceSecondary },
        ]}
      >
        {/* Nav overlay */}
        <View style={styles.heroNav}>
          <BackButton onPress={() => router.back()} />
          <CartButton count={cartCount} onPress={() => router.push('/(user)/cart')} />
        </View>

        {/* Large bottle */}
        <View style={styles.heroBottle}>
          <ProductBottle category={product.category} accentColor={product.accentColor} size="lg" />
        </View>

        {/* Tags */}
        {product.tags.length > 0 && (
          <View style={styles.heroTags}>
            {product.tags.map(tag => (
              <View
                key={tag}
                style={[
                  styles.heroTag,
                  { borderColor: `${product.accentColor ?? ROSE}22` },
                ]}
              >
                <Typography
                  variant="caption"
                  weight="semibold"
                  style={{ color: product.accentColor ?? ROSE }}
                >
                  {tag}
                </Typography>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Info Panel */}
      <ScrollView
        style={styles.infoPanel}
        contentContainerStyle={styles.infoPanelContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand + Name */}
        <View style={styles.nameLine}>
          <Typography
            variant="overline"
            style={[styles.detailBrandLabel, { color: product.accentColor ?? ROSE }]}
          >
            {product.brand} · {product.volume ?? ''}
          </Typography>
          <Typography variant="h3" weight="bold" color="textPrimary" style={styles.productName}>
            {product.name}
          </Typography>
        </View>

        {/* Rating Row */}
        <View style={styles.ratingRow}>
          <StarRating rating={product.rating} size={13} />
          <Typography variant="bodySmall" weight="semibold" color="textPrimary">
            {product.rating.toFixed(1)}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            · {product.reviewCount} reviews
          </Typography>
          {discount > 0 && (
            <View style={[styles.discountPill, styles.ratingDiscount]}>
              <Typography variant="overline" style={styles.discountPillText}>
                {discount}% off
              </Typography>
            </View>
          )}
        </View>

        {/* Price + Qty */}
        <View style={styles.priceQtyRow}>
          <View>
            <Typography variant="h2" weight="bold" color="textPrimary" style={styles.bigPrice}>
              ₹{product.price}
            </Typography>
            {product.originalPrice && (
              <Typography variant="bodySmall" color="textDisabled" strikethrough>
                ₹{product.originalPrice}
              </Typography>
            )}
          </View>
          <QuantitySelector
            value={qty}
            onDecrement={() => setQty(q => Math.max(1, q - 1))}
            onIncrement={() => setQty(q => q + 1)}
          />
        </View>

        {/* Skin Match */}
        {product.skinType && (
          <View style={styles.skinMatchBadge}>
            <Ionicons name="checkmark-circle" size={15} color={ROSE} />
            <Typography variant="caption" weight="semibold" style={{ color: ROSE }}>
              Matched for {product.skinType}
            </Typography>
          </View>
        )}

        {/* Tabs */}
        <TabBar active={activeTab} onChange={setActiveTab} />

        {activeTab === 'about' && <AboutTab product={product} />}
        {activeTab === 'ingredients' && <IngredientsTab product={product} />}
        {activeTab === 'reviews' && <ReviewsTab product={product} />}
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.cta}>
        <Button
          variant={justAdded ? 'primary' : 'outline'}
          size="lg"
          label={justAdded ? '✓ Added!' : 'Add to Cart'}
          onPress={handleAddToCart}
          style={[styles.ctaAdd, justAdded && { backgroundColor: SUCCESS_GREEN }]}
        />
        <Button
          variant="primary"
          size="lg"
          label={`Buy Now · ₹${product.price * qty}`}
          onPress={handleBuyNow}
          style={styles.ctaBuy}
        />
      </View>
    </View>
  );
}

export default function ProductDetailScreen(): React.ReactElement {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { product, isLoading, error } = useProductDetail(id ?? '');

  if (isLoading) {
    return (
      <SafeAreaView style={styles.center} edges={['top']}>
        <ActivityIndicator size="large" color={ROSE} />
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.center} edges={['top']}>
        <Typography variant="body" color="error" align="center">
          {error ?? 'Product not found'}
        </Typography>
      </SafeAreaView>
    );
  }

  return <ProductDetail product={product} />;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  hero: {
    paddingTop: 56,
    paddingBottom: 0,
    alignItems: 'center',
  },
  heroNav: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: ROSE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '800',
    lineHeight: 11,
  },
  heroBottle: {
    marginTop: 44,
    marginBottom: 0,
  },
  heroTags: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
    marginBottom: 16,
  },
  heroTag: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  infoPanel: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -12,
  },
  infoPanelContent: {
    padding: spacing.xl,
    paddingBottom: 120,
  },
  nameLine: {
    marginBottom: spacing.sm,
  },
  detailBrandLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  productName: {
    letterSpacing: -0.3,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: spacing.lg,
  },
  ratingDiscount: {
    marginLeft: 'auto',
  },
  discountPill: {
    backgroundColor: '#e8f7ef',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  discountPillText: {
    color: '#4caf7d',
    fontWeight: '600',
    fontSize: 11,
  },
  priceQtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  bigPrice: {
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f7f4f9',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: ROSE_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnActive: {
    backgroundColor: ROSE,
  },
  qtyValue: {
    minWidth: 20,
    textAlign: 'center',
    fontSize: 15,
  },
  skinMatchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: ROSE_LIGHT,
    borderRadius: 14,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    marginBottom: spacing.lg,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#f0eaf4',
    marginBottom: spacing.lg,
    gap: spacing.xl,
  },
  tabItem: {
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginBottom: -2,
  },
  tabItemActive: {
    borderBottomColor: ROSE,
  },
  tabLabel: {
    color: colors.textSecondary,
    textTransform: 'capitalize',
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: ROSE,
  },
  aboutText: {
    lineHeight: 26,
  },
  ingredientsAll: {
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  keyActivesCard: {
    backgroundColor: '#faf8fb',
    borderRadius: 16,
    padding: spacing.lg,
    gap: 8,
  },
  keyActivesTitle: {
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  activeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    flexShrink: 0,
  },
  reviewCard: {
    backgroundColor: '#faf8fb',
    borderRadius: 18,
    padding: spacing.lg,
    gap: 6,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewText: {
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  cta: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: 12,
    paddingBottom: 32,
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0eaf4',
  },
  ctaAdd: {
    flex: 1,
    borderColor: `${ROSE}30`,
  },
  ctaBuy: {
    flex: 1.4,
    shadowColor: ROSE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
});
