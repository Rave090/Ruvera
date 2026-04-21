import React from 'react';
import { View, StyleSheet, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Typography } from '@components/Typography';
import { ScreenWrapper } from '@components/ScreenWrapper';
import { TrackingTimeline } from '@features/order/components/TrackingTimeline';
import { useOrderDetail } from '@features/order/hooks/useOrderDetail';
import { lightTheme } from '@theme';

const { colors, spacing, borderRadius } = lightTheme;

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const STATUS_COLORS: Record<string, string> = {
  pending: colors.warning,
  confirmed: colors.info,
  shipped: colors.primary,
  delivered: colors.success,
  cancelled: colors.error,
};

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { order, isLoading, error } = useOrderDetail(id);
  const router = useRouter();

  return (
    <ScreenWrapper backgroundColor={colors.background} scrollable={false}>
      <Pressable
        onPress={() => router.back()}
        style={styles.back}
        accessibilityRole="button"
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

      {order && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.topCard}>
              <View style={styles.row}>
                <Typography variant="body" weight="semibold">
                  Order #{order.id.toUpperCase()}
                </Typography>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: (STATUS_COLORS[order.status] ?? colors.border) + '22' },
                  ]}
                >
                  <Typography
                    variant="caption"
                    weight="semibold"
                    style={{ color: STATUS_COLORS[order.status] ?? colors.textSecondary }}
                  >
                    {STATUS_LABELS[order.status] ?? order.status}
                  </Typography>
                </View>
              </View>
              <Typography variant="caption" color="textSecondary">
                Placed {new Date(order.createdAt).toLocaleDateString()}
              </Typography>
              {order.estimatedDelivery && (
                <Typography variant="caption" color="textSecondary">
                  Est. delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                </Typography>
              )}
              {order.trackingNumber && (
                <Typography variant="caption" color="textDisabled">
                  Tracking: {order.trackingNumber}
                </Typography>
              )}
            </View>

            <View style={styles.section}>
              <Typography variant="bodySmall" weight="semibold" style={styles.sectionTitle}>
                Tracking
              </Typography>
              <TrackingTimeline events={order.trackingEvents} />
            </View>

            <View style={styles.section}>
              <Typography variant="bodySmall" weight="semibold" style={styles.sectionTitle}>
                Items ({order.items.length})
              </Typography>
              {order.items.length === 0 ? (
                <Typography variant="caption" color="textDisabled">
                  No items recorded.
                </Typography>
              ) : (
                order.items.map((item, i) => (
                  <View key={i} style={styles.orderItem}>
                    <Typography variant="bodySmall" numberOfLines={1} style={styles.flex}>
                      {item.product.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      ×{item.quantity} · ${(item.unitPrice * item.quantity).toFixed(2)}
                    </Typography>
                  </View>
                ))
              )}
            </View>

            <View style={styles.section}>
              <View style={styles.row}>
                <Typography variant="body" weight="semibold">Total</Typography>
                <Typography variant="subheading" weight="semibold" color="primary">
                  ${order.totalAmount.toFixed(2)}
                </Typography>
              </View>
            </View>
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
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  topCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    marginBottom: spacing.xs,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  flex: {
    flex: 1,
    marginRight: spacing.sm,
  },
});
