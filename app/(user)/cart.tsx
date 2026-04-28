import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '@components/Typography';
import { Button } from '@components/Button';
import { lightTheme } from '@theme';
import { useCartStore, selectCartItems, selectCartSummary } from '@store/cart.store';
import { ProductBottle } from '@features/product/components/ProductBottle';
import type { CartItem } from '@features/cart/types';

const { colors, spacing } = lightTheme;

const ROSE = '#5C2B3E';
const ROSE_LIGHT = '#F5E8EA';
const BG = '#f6f2f8';
const SUCCESS = '#4caf7d';
const SUCCESS_LIGHT = '#e8f7ef';

function CartItemCard({
  item,
  onUpdateQty,
  onRemove,
}: {
  item: CartItem;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}): React.ReactElement {
  const { product, quantity } = item;

  return (
    <View style={styles.itemCard}>
      <View style={[styles.itemImg, { backgroundColor: product.themeColor ?? colors.surfaceSecondary }]}>
        <ProductBottle category={product.category} accentColor={product.accentColor} size="sm" />
      </View>

      <View style={styles.itemInfo}>
        <Typography
          variant="overline"
          style={[styles.itemBrand, { color: product.accentColor ?? ROSE }]}
        >
          {product.brand}
        </Typography>
        <Typography
          variant="label"
          weight="semibold"
          color="textPrimary"
          numberOfLines={2}
          style={styles.itemName}
        >
          {product.name}
        </Typography>
        <View style={styles.itemBottom}>
          <Typography variant="subheading" weight="bold" color="textPrimary">
            ₹{product.price * quantity}
          </Typography>
          <View style={styles.qtyControls}>
            <Pressable
              onPress={() => onUpdateQty(product.id, quantity - 1)}
              style={styles.qtyBtn}
              accessibilityRole="button"
              accessibilityLabel="Decrease quantity"
            >
              <Typography variant="subheading" weight="bold" style={{ color: ROSE, lineHeight: 22 }}>
                −
              </Typography>
            </Pressable>
            <Typography variant="label" weight="bold" color="textPrimary" style={styles.qtyNum}>
              {quantity}
            </Typography>
            <Pressable
              onPress={() => onUpdateQty(product.id, quantity + 1)}
              style={[styles.qtyBtn, styles.qtyBtnFilled]}
              accessibilityRole="button"
              accessibilityLabel="Increase quantity"
            >
              <Typography variant="subheading" weight="bold" style={{ color: '#fff', lineHeight: 22 }}>
                +
              </Typography>
            </Pressable>
          </View>
        </View>
      </View>

      <Pressable
        onPress={() => onRemove(product.id)}
        style={styles.removeBtn}
        accessibilityRole="button"
        accessibilityLabel={`Remove ${product.name}`}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="close" size={14} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
}

function EmptyCart({ onShop }: { onShop: () => void }): React.ReactElement {
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyIcon}>
        <Ionicons name="bag-outline" size={36} color={ROSE} />
      </View>
      <Typography variant="h3" weight="semibold" color="textPrimary" style={styles.emptyTitle}>
        Your cart is empty
      </Typography>
      <Typography variant="body" color="textSecondary" align="center" style={styles.emptySubtext}>
        Add some products to get started
      </Typography>
      <Button
        variant="primary"
        size="md"
        label="Shop Now"
        onPress={onShop}
        style={styles.shopNowBtn}
      />
    </View>
  );
}

export default function CartScreen(): React.ReactElement {
  const router = useRouter();
  const items = useCartStore(selectCartItems);
  const summary = useCartStore(selectCartSummary);
  const updateQuantity = useCartStore(s => s.updateQuantity);
  const removeItem = useCartStore(s => s.removeItem);
  const clearCart = useCartStore(s => s.clearCart);

  const handleUpdateQty = useCallback(
    (id: string, qty: number) => updateQuantity(id, qty),
    [updateQuantity],
  );

  const handleRemove = useCallback(
    (id: string) => removeItem(id),
    [removeItem],
  );

  const handleCheckout = useCallback(() => {
    const total = summary.total;
    clearCart();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.replace({ pathname: '/(user)/order-confirmed' as any, params: { total: total.toString() } });
  }, [summary.total, clearCart, router]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<CartItem>) => (
      <CartItemCard item={item} onUpdateQty={handleUpdateQty} onRemove={handleRemove} />
    ),
    [handleUpdateQty, handleRemove],
  );

  const keyExtractor = useCallback((item: CartItem) => item.product.id, []);

  const savings = summary.discount;

  const ListFooter = (
    <View style={{ gap: 10, paddingTop: 4 }}>
      {savings > 0 && (
        <View style={styles.savingsBanner}>
          <Ionicons name="checkmark-circle" size={18} color={SUCCESS} />
          <Typography variant="bodySmall" weight="semibold" style={{ color: '#2e7d52' }}>
            You save ₹{savings} on this order!
          </Typography>
        </View>
      )}

      <View style={styles.summaryCard}>
        <Typography variant="overline" color="textSecondary" style={styles.summaryTitle}>
          Order Summary
        </Typography>
        <View style={styles.summaryRow}>
          <Typography variant="bodySmall" color="textSecondary">Subtotal</Typography>
          <Typography variant="bodySmall" weight="semibold" color="textPrimary">
            ₹{summary.subtotal}
          </Typography>
        </View>
        <View style={styles.summaryRow}>
          <Typography variant="bodySmall" color="textSecondary">Delivery</Typography>
          <Typography variant="bodySmall" weight="semibold" color="textPrimary">Free</Typography>
        </View>
        {savings > 0 && (
          <View style={styles.summaryRow}>
            <Typography variant="bodySmall" color="textSecondary">Discount</Typography>
            <Typography variant="bodySmall" weight="semibold" style={{ color: SUCCESS }}>
              −₹{savings}
            </Typography>
          </View>
        )}
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Typography variant="label" weight="semibold" color="textPrimary">Total</Typography>
          <Typography variant="subheading" weight="bold" style={{ color: ROSE }}>
            ₹{summary.total}
          </Typography>
        </View>
      </View>

      <View style={styles.addressCard}>
        <View style={styles.addressIcon}>
          <Ionicons name="location-outline" size={16} color={ROSE} />
        </View>
        <View style={styles.addressText}>
          <Typography variant="caption" weight="semibold" color="textPrimary">
            Deliver to Home
          </Typography>
          <Typography variant="overline" color="textSecondary">
            42 Rosewood Lane, Mumbai 400001
          </Typography>
        </View>
        <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={18} color={ROSE} />
        </Pressable>
        <Typography variant="h3" weight="semibold" color="textPrimary">
          My Cart
        </Typography>
        {items.length > 0 && (
          <Typography variant="bodySmall" color="textSecondary">
            ({items.length} item{items.length !== 1 ? 's' : ''})
          </Typography>
        )}
      </View>

      {items.length === 0 ? (
        <EmptyCart onShop={() => router.back()} />
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListFooterComponent={ListFooter}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.checkoutBar}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              label={`Proceed to Checkout · ₹${summary.total}`}
              onPress={handleCheckout}
              style={styles.checkoutBtn}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ROSE_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  itemCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    flexDirection: 'row',
    gap: 12,
    padding: spacing.md,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemImg: {
    width: 72,
    height: 72,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemBrand: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  itemName: {
    lineHeight: 19,
  },
  itemBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f3eff5',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  qtyBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: ROSE_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnFilled: {
    backgroundColor: ROSE,
  },
  qtyNum: {
    minWidth: 16,
    textAlign: 'center',
    fontSize: 13,
  },
  removeBtn: {
    padding: 4,
    alignSelf: 'flex-start',
  },
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: SUCCESS_LIGHT,
    borderRadius: 16,
    padding: spacing.md,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.lg,
    gap: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#eeе8ee',
    marginVertical: spacing.sm,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  addressIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ROSE_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  addressText: {
    flex: 1,
    gap: 2,
  },
  checkoutBar: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  checkoutBtn: {
    shadowColor: ROSE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xxxl,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: ROSE_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    marginTop: spacing.xs,
  },
  emptySubtext: {
    lineHeight: 22,
  },
  shopNowBtn: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xxxl,
  },
});
