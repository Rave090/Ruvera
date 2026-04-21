import React from 'react';
import { View, FlatList, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@components/Typography';
import { Button } from '@components/Button';
import { ScreenWrapper } from '@components/ScreenWrapper';
import { CartItemRow } from '@features/cart/components/CartItemRow';
import { useCart } from '@features/cart/hooks/useCart';
import { lightTheme } from '@theme';

const { colors, spacing } = lightTheme;

export default function CartScreen() {
  const { items, summary, removeItem, updateQuantity } = useCart();
  const router = useRouter();

  return (
    <ScreenWrapper backgroundColor={colors.background} scrollable={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} accessibilityRole="button">
          <Typography variant="body" color="primary">← Back</Typography>
        </Pressable>
        <Typography variant="h3" weight="semibold">Cart</Typography>
        <View style={styles.headerRight} />
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <Typography variant="h2">🛒</Typography>
          <Typography variant="body" color="textSecondary">Your cart is empty</Typography>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={item => item.product.id}
            renderItem={({ item }) => (
              <CartItemRow
                item={item}
                onRemove={removeItem}
                onUpdateQuantity={updateQuantity}
              />
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.summary}>
            {summary.discount > 0 && (
              <View style={styles.summaryRow}>
                <Typography variant="body" color="textSecondary">Discount</Typography>
                <Typography variant="body" color="success">
                  −${summary.discount.toFixed(2)}
                </Typography>
              </View>
            )}
            <View style={styles.summaryRow}>
              <Typography variant="body" weight="semibold">Total</Typography>
              <Typography variant="subheading" weight="semibold" color="primary">
                ${summary.total.toFixed(2)}
              </Typography>
            </View>
            <Button
              variant="primary"
              label={`Checkout · ${summary.itemCount} item${summary.itemCount !== 1 ? 's' : ''}`}
              onPress={() => {}}
              style={styles.checkoutBtn}
            />
          </View>
        </>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerRight: {
    width: 60,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.lg,
  },
  summary: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
    backgroundColor: colors.surface,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkoutBtn: {
    marginTop: spacing.xs,
  },
});
