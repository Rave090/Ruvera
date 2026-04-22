import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const ROSE = '#7A1D3A';
const INACTIVE = '#C4909E';

interface TabConfig {
  label: string;
  icon: IoniconName;
  iconActive: IoniconName;
  iconSize: number;
}

const TAB_CONFIG: Record<string, TabConfig> = {
  index: {
    label: 'HOME',
    icon: 'home-outline',
    iconActive: 'home',
    iconSize: 20,
  },
  detection: {
    label: 'SCAN',
    icon: 'scan-outline',
    iconActive: 'scan',
    iconSize: 22,
  },
  products: {
    label: 'PRODUCTS',
    icon: 'flask-outline',
    iconActive: 'flask',
    iconSize: 20,
  },
  chat: {
    label: 'CONSULT',
    icon: 'briefcase-outline',
    iconActive: 'briefcase',
    iconSize: 20,
  },
  profile: {
    label: 'PROFILE',
    icon: 'person-outline',
    iconActive: 'person',
    iconSize: 20,
  },
};

export function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const activeRouteName = state.routes[state.index]?.name;
  const isDark = activeRouteName === 'detection';

  const bg = isDark ? '#1A0D10' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const shadowStyle = isDark
    ? {}
    : { shadowOpacity: 0.06, shadowRadius: 10, elevation: 8 };

  return (
    <View
      style={[
        styles.container,
        shadowStyle,
        {
          backgroundColor: bg,
          borderTopColor: borderColor,
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}
    >
      <View style={styles.tabRow}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const config = TAB_CONFIG[route.name];

          if (!config) return null;

          const isActive = state.index === index;

          return (
            <Pressable
              key={route.key}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              onLongPress={() => {
                navigation.emit({ type: 'tabLongPress', target: route.key });
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              style={styles.tabButton}
            >
              <View style={[styles.iconCircle, isActive && styles.iconCircleActive]}>
                <Ionicons
                  name={isActive ? config.iconActive : config.icon}
                  size={config.iconSize}
                  color={isActive ? '#FFFFFF' : INACTIVE}
                />
              </View>
              <Text style={[styles.label, { color: isActive ? ROSE : INACTIVE }]}>
                {config.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingTop: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },
  tabButton: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleActive: {
    backgroundColor: ROSE,
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: ROSE,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.33,
          shadowRadius: 9,
        }
      : { elevation: 6 }),
  },
  label: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    lineHeight: 11,
  },
});
