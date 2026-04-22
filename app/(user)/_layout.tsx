import React from 'react';
import { Tabs } from 'expo-router';
import { useChatStore, selectUnreadCount } from '@store/chat.store';
import { useCartStore, selectCartItemCount } from '@store/cart.store';
import { BottomTabBar } from '@components/BottomTabBar';

export default function UserLayout() {
  const unreadCount = useChatStore(selectUnreadCount);
  const cartCount = useCartStore(selectCartItemCount);

  return (
    <Tabs
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        animation: 'shift',
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="detection" />
      <Tabs.Screen name="products" />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
        }}
      />
      <Tabs.Screen name="profile" />
      {/* Hidden screens */}
      <Tabs.Screen name="product/[id]" options={{ href: null }} />
      <Tabs.Screen
        name="cart"
        options={{ href: null, tabBarBadge: cartCount > 0 ? cartCount : undefined }}
      />
      <Tabs.Screen name="orders" options={{ href: null }} />
      <Tabs.Screen name="order/[id]" options={{ href: null }} />
      <Tabs.Screen name="chat-room/[id]" options={{ href: null }} />
    </Tabs>
  );
}
