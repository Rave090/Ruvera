import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BrandIcon from '@components/BrandIcon/BrandIcon';
import { Typography } from '@components/Typography';
import { lightTheme } from '@theme';

const { spacing } = lightTheme;

const BRAND = '#5C2B3E';
const BG = '#FAF2F3';
const DIVIDER = '#DEC8CC';

function SplashScreen() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.8)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const makePulse = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1, duration: 480, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0.25, duration: 480, useNativeDriver: true }),
        ])
      );

    Animated.parallel([
      makePulse(dot1, 0),
      makePulse(dot2, 220),
      makePulse(dot3, 440),
    ]).start();
  }, []);

  return (
    <View style={[styles.container, { width, height, backgroundColor: BG }]}>
      {/* Subtle centre glow approximating radial gradient */}
      <View
        style={[
          styles.glow,
          {
            width: width * 0.85,
            height: width * 0.85,
            borderRadius: (width * 0.85) / 2,
            top: height * 0.12,
            left: width * 0.075,
          },
        ]}
      />

      {/* Logo + brand name — vertically centred */}
      <View style={styles.centre}>
        <View style={styles.logoCircle}>
          <BrandIcon size={46} color={BRAND} />
        </View>

        <Typography
          variant="h1"
          style={styles.brandName}
        >
          Ruvera
        </Typography>

        <View style={styles.divider} />
      </View>

      {/* Bottom section — tagline pill + loading dots */}
      <View
        style={[
          styles.bottom,
          { paddingBottom: Math.max(insets.bottom + spacing.lg, spacing.xxxl) },
        ]}
      >
        <View style={styles.taglinePill}>
          <Typography style={styles.taglineText}>YOUR RITUAL, PERFECTED.</Typography>
        </View>

        <View style={styles.dotsRow}>
          <Animated.View style={[styles.dot, { opacity: dot1 }]} />
          <Animated.View style={[styles.dot, { opacity: dot2 }]} />
          <Animated.View style={[styles.dot, { opacity: dot3 }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  glow: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
  },
  centre: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BRAND,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 10,
  },
  brandName: {
    marginTop: spacing.xl,
    fontSize: 40,
    fontWeight: '700',
    color: BRAND,
    letterSpacing: -1,
  },
  divider: {
    marginTop: spacing.lg,
    width: 50,
    height: 1.5,
    backgroundColor: DIVIDER,
    borderRadius: 1,
  },
  bottom: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  taglinePill: {
    borderWidth: 1.5,
    borderColor: BRAND,
    borderRadius: 999,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    alignItems: 'center',
  },
  taglineText: {
    fontSize: 12,
    fontWeight: '600',
    color: BRAND,
    letterSpacing: 2.5,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: BRAND,
  },
});

export default SplashScreen;
