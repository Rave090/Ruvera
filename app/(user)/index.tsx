import React, { useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Animated,
  Pressable,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '@components/Typography';
import { Button } from '@components/Button';
import Card from '@components/Card/Card';
import BrandIcon from '@components/BrandIcon/BrandIcon';
import { useAuthStore, selectUserProfile } from '@store/auth.store';
import { useHome } from '@features/home/hooks/useHome';
import { lightTheme } from '@theme';

const { colors, spacing, borderRadius, shadows } = lightTheme;
const BRAND = '#5C2B3E';
const HERO_LIGHT = 'rgba(196, 96, 138, 0.5)';
const PRODUCT_BG = ['#2A1208', '#160A20'] as const;

export default function HomeScreen() {
  const profile = useAuthStore(selectUserProfile);
  const { data } = useHome();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const heroAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const contentY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(220),
        Animated.parallel([
          Animated.timing(contentAnim, { toValue: 1, duration: 480, useNativeDriver: true }),
          Animated.spring(contentY, { toValue: 0, friction: 8, tension: 70, useNativeDriver: true }),
        ]),
      ]),
    ]).start();
  }, []);

  const firstName = profile?.displayName?.split(' ')[0] ?? 'there';
  const products = data?.trendingProducts?.slice(0, 2) ?? [];
  const curated =
    products.length >= 2
      ? products.map((p, i) => ({
          id: p.id,
          brand: p.brand.toUpperCase(),
          name: p.name,
          price: `${p.currency} ${Math.round(p.price).toLocaleString()}`,
          imgBg: PRODUCT_BG[i],
          badges: p.badges,
          isFavourited: p.isFavourited,
        }))
      : [
          { id: '1', brand: 'BOTANY LUXE', name: 'Aura Dew Serum', price: 'NPR 4,200', imgBg: PRODUCT_BG[0], badges: [] as string[], isFavourited: false },
          { id: '2', brand: 'SKIN RITUALS', name: 'Moonlight Balm', price: 'NPR 3,850', imgBg: PRODUCT_BG[1], badges: [] as string[], isFavourited: false },
        ];

  const analysis = data?.analysis ?? null;
  const routine = data?.routine ?? null;
  const morningSteps = routine?.morning.length ?? 0;
  const eveningSteps = routine?.evening.length ?? 0;
  const remainingSteps = morningSteps + eveningSteps;
  const hydrationText = analysis
    ? `${analysis.hydrationScore}% ${analysis.hydrationLabel}`
    : 'Scan to begin';

  const heroH = Math.min(width * 0.72, 280);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* ── Top bar ── */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <BrandIcon size={20} color={BRAND} />
          <Typography style={styles.brandName}>Ruvera</Typography>
        </View>
        <Pressable
          onPress={() => router.push('/(user)/profile' as never)}
          style={styles.avatar}
          accessibilityRole="button"
          accessibilityLabel="View profile"
        >
          <Ionicons name="person-outline" size={16} color={colors.textSecondary} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: Math.max(insets.bottom + spacing.xl, spacing.xxxl) },
        ]}
      >
        {/* ── Hero card ── */}
        <Animated.View
          style={[
            styles.heroCard,
            { height: heroH, opacity: heroAnim },
          ]}
        >
          {/* Base rose layer */}
          <View style={[StyleSheet.absoluteFill, { backgroundColor: BRAND }]} />

          {/* Radial glow — top right */}
          <View
            style={[
              styles.heroGlow,
              {
                width: heroH * 1.1,
                height: heroH * 1.1,
                backgroundColor: HERO_LIGHT,
                top: -heroH * 0.4,
                right: -heroH * 0.25,
              },
            ]}
          />

          {/* Mid shimmer circle */}
          <View
            style={[
              styles.heroGlow,
              {
                width: heroH * 0.55,
                height: heroH * 0.55,
                backgroundColor: 'rgba(220, 140, 172, 0.28)',
                top: -heroH * 0.1,
                right: heroH * 0.05,
              },
            ]}
          />

          {/* Watermark brand icon */}
          <View style={[styles.heroWatermark, { right: spacing.xl, top: spacing.lg }]}>
            <BrandIcon size={width * 0.28} color="rgba(255, 255, 255, 0.08)" />
          </View>

          {/* Bottom scrim for text legibility */}
          <View style={styles.heroScrim} />

          {/* Greeting */}
          <View style={styles.heroContent}>
            <Typography style={styles.heroGreetLabel}>Good morning,</Typography>
            <Typography
              style={[styles.heroName, { fontSize: Math.min(width * 0.088, 36) }]}
            >
              {firstName}
            </Typography>
            <Typography style={styles.heroTagline}>
              Your skin profile looks radiant today.
            </Typography>
          </View>

          {/* Hydration pill — bottom right */}
          <View style={styles.hydroPill}>
            <Ionicons name="water-outline" size={12} color="rgba(255,255,255,0.9)" />
            <Typography style={styles.hydroText}>{hydrationText}</Typography>
          </View>
        </Animated.View>

        {/* ── Content ── */}
        <Animated.View
          style={[
            styles.contentBlock,
            { opacity: contentAnim, transform: [{ translateY: contentY }] },
          ]}
        >
          {/* AI Scan card */}
          <Pressable
            onPress={() => router.push('/(user)/detection' as never)}
            style={styles.scanCard}
            accessibilityRole="button"
            accessibilityLabel="Launch AI Skin Scan"
          >
            <View style={styles.scanLeft}>
              <View style={styles.scanIconBubble}>
                <Ionicons name="scan-outline" size={15} color={BRAND} />
              </View>
              <View>
                <Typography style={styles.scanLabel}>AI ANALYSIS</Typography>
                <Typography style={styles.scanTitle}>Scan Skin</Typography>
                <Typography style={styles.scanSub}>
                  Update with a quick facial scan
                </Typography>
              </View>
            </View>
            <View style={styles.launchPill}>
              <Typography style={styles.launchText}>Launch</Typography>
              <Ionicons name="arrow-forward-outline" size={12} color={BRAND} />
            </View>
          </Pressable>

          {/* Today's Ritual */}
          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <Typography variant="subheading" weight="semibold">
                Today's Ritual
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {remainingSteps > 0 ? `${remainingSteps} STEPS REMAINING` : 'ALL DONE'}
              </Typography>
            </View>
            <View style={styles.cardRow}>
              <Card
                variant="elevated"
                shadow="sm"
                padding="md"
                style={styles.ritualCard}
                onPress={() => {}}
                accessibilityLabel="Morning hydration ritual"
              >
                <View style={[styles.ritualIconBg, { backgroundColor: colors.surfaceSecondary }]}>
                  <Ionicons name="sunny-outline" size={17} color={colors.secondary} />
                </View>
                <Typography variant="caption" color="textSecondary" style={styles.ritualLabel}>
                  Morning
                </Typography>
                <Typography variant="bodySmall" weight="semibold">
                  Hydrate
                </Typography>
              </Card>
              <Card
                variant="elevated"
                shadow="sm"
                padding="md"
                style={styles.ritualCard}
                onPress={() => {}}
                accessibilityLabel="Night repair ritual"
              >
                <View style={[styles.ritualIconBg, { backgroundColor: colors.surfaceTertiary }]}>
                  <Ionicons name="moon-outline" size={17} color={BRAND} />
                </View>
                <Typography variant="caption" color="textSecondary" style={styles.ritualLabel}>
                  Night
                </Typography>
                <Typography variant="bodySmall" weight="semibold">
                  Repair
                </Typography>
              </Card>
            </View>
          </View>

          {/* Curated For You */}
          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <Typography variant="subheading" weight="semibold">
                Curated For You
              </Typography>
              <Button
                variant="ghost"
                size="sm"
                label="View Boutique"
                onPress={() => router.push('/(user)/products')}
              />
            </View>
            <View style={styles.cardRow}>
              {curated.map((item, idx) => (
                <Pressable
                  key={idx}
                  style={({ pressed }) => [
                    styles.productCard,
                    pressed && { opacity: 0.88 },
                  ]}
                  onPress={() =>
                    router.push({
                      pathname: '/(user)/product/[id]',
                      params: { id: item.id },
                    })
                  }
                  accessibilityRole="button"
                  accessibilityLabel={`${item.name}, ${item.price}`}
                >
                  <View style={[styles.productImg, { backgroundColor: item.imgBg }]}>
                    <View style={styles.heartBtn}>
                      <Ionicons name="heart-outline" size={13} color="rgba(255,255,255,0.85)" />
                    </View>
                  </View>
                  <View style={styles.productInfo}>
                    <Typography style={styles.productBrand}>{item.brand}</Typography>
                    <Typography variant="bodySmall" weight="semibold" numberOfLines={1}>
                      {item.name}
                    </Typography>
                    <View style={styles.productFooter}>
                      <Typography variant="bodySmall" weight="semibold" color="primary">
                        {item.price}
                      </Typography>
                      <View style={styles.addBtn}>
                        <Ionicons name="add" size={14} color={colors.primary} />
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ── Top bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  brandName: {
    fontSize: 15,
    fontWeight: '700',
    color: BRAND,
    letterSpacing: 0.5,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Scroll
  scroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xl,
    paddingTop: spacing.xs,
  },

  // ── Hero card
  heroCard: {
    borderRadius: borderRadius.xxl,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    borderRadius: 9999,
  },
  heroWatermark: {
    position: 'absolute',
  },
  heroScrim: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: 'rgba(40, 10, 24, 0.38)',
  },
  heroContent: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.xl,
    right: '35%',
  },
  heroGreetLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255, 220, 230, 0.82)',
    letterSpacing: 0.2,
    marginBottom: 2,
  },
  heroName: {
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    lineHeight: 44,
  },
  heroTagline: {
    fontSize: 12,
    color: 'rgba(255, 220, 230, 0.72)',
    lineHeight: 17,
    marginTop: spacing.xs,
  },
  hydroPill: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  hydroText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },

  // ── Content block
  contentBlock: {
    gap: spacing.xl,
  },

  // ── Scan card
  scanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  scanLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  scanIconBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.4,
    color: colors.textSecondary,
  },
  scanTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
    letterSpacing: -0.2,
  },
  scanSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  launchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    backgroundColor: colors.surfaceTertiary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  launchText: {
    fontSize: 12,
    fontWeight: '600',
    color: BRAND,
  },

  // ── Sections
  section: {
    gap: spacing.md,
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },

  // ── Ritual cards
  ritualCard: {
    flex: 1,
    gap: spacing.xxs,
  },
  ritualIconBg: {
    width: 34,
    height: 34,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ritualLabel: {
    marginTop: spacing.xs,
  },

  // ── Product cards
  productCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.sm,
  },
  productImg: {
    height: 140,
  },
  heartBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: 2,
  },
  productBrand: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: colors.textSecondary,
  },
  productFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  addBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
