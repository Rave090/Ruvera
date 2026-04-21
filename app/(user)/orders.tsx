import React from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@components/Typography';
import { ScreenWrapper } from '@components/ScreenWrapper';
import { OrderCard } from '@features/order/components/OrderCard';
import { useOrderHistory } from '@features/order/hooks/useOrderHistory';
import { lightTheme } from '@theme';
import type { Order } from '@features/order/types';

const { colors, spacing } = lightTheme;

export default function OrdersScreen() {
  const { orders, isLoading, error } = useOrderHistory();
  const router = useRouter();

  const handleOrderPress = (order: Order) => {
    router.push(`/(user)/order/${order.id}` as never);
  };

  return (
    <ScreenWrapper backgroundColor={colors.background} scrollable={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} accessibilityRole="button">
          <Typography variant="body" color="primary">← Back</Typography>
        </Pressable>
        <Typography variant="h3" weight="semibold">Orders</Typography>
        <View style={styles.headerRight} />
      </View>

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

      {!isLoading && !error && orders.length === 0 && (
        <View style={styles.center}>
          <Typography variant="body" color="textSecondary">No orders yet.</Typography>
        </View>
      )}

      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <OrderCard order={item} onPress={handleOrderPress} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: spacing.lg,
    gap: spacing.md,
  },
});
