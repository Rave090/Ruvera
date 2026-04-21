import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Typography } from '@components/Typography';
import { lightTheme } from '@theme';
import type { Order, OrderStatus } from '../types';

const { colors, spacing, borderRadius } = lightTheme;

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: colors.warning,
  confirmed: colors.info,
  shipped: colors.primary,
  delivered: colors.success,
  cancelled: colors.error,
};

interface OrderCardProps {
  order: Order;
  onPress: (order: Order) => void;
}

export function OrderCard({ order, onPress }: OrderCardProps) {
  const statusColor = STATUS_COLORS[order.status];
  const date = new Date(order.createdAt).toLocaleDateString();

  return (
    <Pressable
      onPress={() => onPress(order)}
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.85 : 1 }]}
      accessibilityRole="button"
    >
      <View style={styles.header}>
        <Typography variant="bodySmall" weight="semibold">
          Order #{order.id.toUpperCase()}
        </Typography>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '22' }]}>
          <Typography variant="caption" weight="semibold" style={{ color: statusColor }}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Typography>
        </View>
      </View>
      <Typography variant="caption" color="textSecondary">
        {order.items.length} item{order.items.length !== 1 ? 's' : ''} · Placed {date}
      </Typography>
      <View style={styles.footer}>
        <Typography variant="bodySmall" weight="semibold" color="primary">
          ${order.totalAmount.toFixed(2)}
        </Typography>
        {order.trackingNumber && (
          <Typography variant="caption" color="textDisabled">
            {order.trackingNumber}
          </Typography>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
});
