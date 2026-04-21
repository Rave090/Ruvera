import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '@theme';

const { colors, spacing } = lightTheme;

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

function tabIcon(focused: boolean, name: IoniconName, focusedName: IoniconName) {
  return ({ color, size }: { color: string; size: number }) => (
    <Ionicons name={focused ? focusedName : name} color={color} size={size} />
  );
}

export default function VendorLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.secondary,
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
          title: 'Dashboard',
          tabBarIcon: ({ color, size, focused }) =>
            tabIcon(focused, 'grid-outline', 'grid')({ color, size }),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          tabBarIcon: ({ color, size, focused }) =>
            tabIcon(focused, 'cube-outline', 'cube')({ color, size }),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, size, focused }) =>
            tabIcon(focused, 'receipt-outline', 'receipt')({ color, size }),
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
    </Tabs>
  );
}
