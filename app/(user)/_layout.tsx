import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '@theme';
import { useChatStore, selectUnreadCount } from '@store/chat.store';
import { useCartStore, selectCartItemCount } from '@store/cart.store';

const { colors, spacing } = lightTheme;

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

function tabIcon(focused: boolean, name: IoniconName, focusedName: IoniconName) {
  return ({ color, size }: { color: string; size: number }) => (
    <Ionicons name={focused ? focusedName : name} color={color} size={size} />
  );
}

export default function UserLayout() {
  const unreadCount = useChatStore(selectUnreadCount);
  const cartCount = useCartStore(selectCartItemCount);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: spacing.xs,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) =>
            tabIcon(focused, 'home-outline', 'home')({ color, size }),
        }}
      />
      <Tabs.Screen
        name="detection"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, size, focused }) =>
            tabIcon(focused, 'scan-outline', 'scan')({ color, size }),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarIcon: ({ color, size, focused }) =>
            tabIcon(focused, 'chatbubbles-outline', 'chatbubbles')({ color, size }),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) =>
            tabIcon(focused, 'person-outline', 'person')({ color, size }),
        }}
      />
      {/* Hidden screens — not shown in tab bar */}
      <Tabs.Screen name="product/[id]" options={{ href: null }} />
      <Tabs.Screen name="cart" options={{ href: null, tabBarBadge: cartCount > 0 ? cartCount : undefined }} />
      <Tabs.Screen name="orders" options={{ href: null }} />
      <Tabs.Screen name="order/[id]" options={{ href: null }} />
      <Tabs.Screen name="chat-room/[id]" options={{ href: null }} />
    </Tabs>
  );
}
