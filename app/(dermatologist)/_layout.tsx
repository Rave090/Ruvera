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

export default function DermatologistLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.success,
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
          title: 'Patients',
          tabBarIcon: ({ color, size, focused }) =>
            tabIcon(focused, 'people-outline', 'people')({ color, size }),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color, size, focused }) =>
            tabIcon(focused, 'calendar-outline', 'calendar')({ color, size }),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
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
    </Tabs>
  );
}
