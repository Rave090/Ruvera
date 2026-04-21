import React, { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { useAuthStore, selectIsAuthenticated, selectIsHydrating, selectUserRole, selectHasCompletedOnboarding } from '@store/auth.store';
import { useSessionHydration } from '@features/auth/hooks/useSessionHydration';
import SplashScreen from '@components/SplashScreen';

function AuthGuard() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isHydrating = useAuthStore(selectIsHydrating);
  const userRole = useAuthStore(selectUserRole);
  const hasCompletedOnboarding = useAuthStore(selectHasCompletedOnboarding);

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isHydrating) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup =
      segments[0] === '(user)' ||
      segments[0] === '(vendor)' ||
      segments[0] === '(dermatologist)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace(
        hasCompletedOnboarding ? '/(auth)/login' : '/(auth)/onboarding',
      );
    } else if (isAuthenticated && (inAuthGroup || (!inAuthGroup && !inAppGroup))) {
      switch (userRole) {
        case 'user':
          router.replace('/(user)');
          break;
        case 'vendor':
          router.replace('/(vendor)');
          break;
        case 'dermatologist':
          router.replace('/(dermatologist)');
          break;
      }
    }
  }, [isAuthenticated, isHydrating, segments, userRole, hasCompletedOnboarding, router]);

  return <Slot />;
}

export default function RootLayout() {
  useSessionHydration();

  const isHydrating = useAuthStore(selectIsHydrating);

  if (isHydrating) {
    return (
      <GestureHandlerRootView style={styles.fill}>
        <SafeAreaProvider>
          <SplashScreen />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.fill}>
      <SafeAreaProvider>
        <AuthGuard />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
