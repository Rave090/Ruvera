import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Pressable, Animated, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import Typography from '@components/Typography';
import Button from '@components/Button';
import { lightTheme } from '@theme';

const { colors, spacing, borderRadius, shadows } = lightTheme;

// ── Static placeholder — replace with useDetectionStore(selectAnalysisResult) when backend is ready
const PLACEHOLDER_RESULT = {
  skinType: 'Combination',
  subtitle: 'T-zone oily · cheeks normal-dry',
  score: 76,
  tags: ['Combination', 'Normal pH', 'Melanin II'],
  metrics: [
    { label: 'Hydration', value: 62, color: '#4a9aba' },
    { label: 'Oiliness', value: 38, color: '#c4a035' },
    { label: 'Sensitivity', value: 45, color: '#ba5a6a' },
    { label: 'Firmness', value: 74, color: '#5a8a5a' },
  ],
  concerns: [
    { label: 'Mild Dehydration', dotColor: '#c4a035' },
    { label: 'Uneven Texture', dotColor: '#ba5a6a' },
    { label: 'Light Hyperpigmentation', dotColor: '#6a8aba' },
  ],
} as const;

interface Props {
  onRescan: () => void;
}

export default function DetectionResultsScreen({ onRescan }: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;
  const metricAnims = useRef(PLACEHOLDER_RESULT.metrics.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start(() => setVisible(true));
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    if (!visible) return;
    Animated.stagger(
      100,
      metricAnims.map((anim, i) =>
        Animated.timing(anim, {
          toValue: PLACEHOLDER_RESULT.metrics[i].value / 100,
          duration: 900,
          useNativeDriver: false,
        }),
      ),
    ).start();
  }, [visible, metricAnims]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.topBar}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Feather name="arrow-left" size={20} color={colors.primary} />
        </Pressable>
        <Typography variant="label" weight="semibold" style={styles.topTitle}>
          Skin Analysis
        </Typography>
        <View style={styles.iconCircle}>
          <Feather name="clock" size={18} color={colors.primary} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + spacing.xxl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero card */}
        <Animated.View
          style={[styles.heroCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        >
          <View style={styles.heroTop}>
            <View>
              <Typography variant="overline" style={styles.heroLabel}>
                Skin Type Detected
              </Typography>
              <Typography variant="h2" style={styles.heroSkinType}>
                {PLACEHOLDER_RESULT.skinType}
              </Typography>
              <Typography variant="caption" style={styles.heroSubtitle}>
                {PLACEHOLDER_RESULT.subtitle}
              </Typography>
            </View>
            <View style={styles.scoreCircle}>
              <Typography variant="subheading" weight="bold" style={styles.scoreNumber}>
                {PLACEHOLDER_RESULT.score}
              </Typography>
              <Typography variant="overline" style={styles.scoreLabel}>score</Typography>
            </View>
          </View>
          <View style={styles.heroTags}>
            {PLACEHOLDER_RESULT.tags.map((tag) => (
              <View key={tag} style={styles.heroTag}>
                <Typography variant="caption" style={styles.heroTagText}>{tag}</Typography>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Metrics grid */}
        <Typography variant="overline" style={styles.sectionLabel}>Skin Metrics</Typography>
        <View style={styles.metricsGrid}>
          {PLACEHOLDER_RESULT.metrics.map((m, i) => {
            const barWidth = metricAnims[i].interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            });
            return (
              <View key={m.label} style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <Typography variant="caption" weight="semibold" color="textSecondary">
                    {m.label}
                  </Typography>
                  <Typography variant="label" weight="bold" style={{ color: m.color }}>
                    {m.value}%
                  </Typography>
                </View>
                <View style={styles.metricTrack}>
                  <Animated.View
                    style={[styles.metricFill, { width: barWidth, backgroundColor: m.color }]}
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* Concerns */}
        <Typography variant="overline" style={styles.sectionLabel}>Skin Concerns</Typography>
        <View style={styles.concernsCard}>
          {PLACEHOLDER_RESULT.concerns.map((c, i) => (
            <View
              key={c.label}
              style={[
                styles.concernRow,
                i < PLACEHOLDER_RESULT.concerns.length - 1 && styles.concernDivider,
              ]}
            >
              <View style={[styles.concernDot, { backgroundColor: c.dotColor }]} />
              <Typography variant="bodySmall" style={styles.concernText}>{c.label}</Typography>
              <Feather name="chevron-right" size={14} color={colors.textSecondary} style={styles.chevron} />
            </View>
          ))}
        </View>

        {/* CTA */}
        <Pressable
          style={styles.ctaCard}
          accessibilityRole="button"
          accessibilityLabel="View product recommendations"
        >
          <View style={styles.ctaIcon}>
            <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
          </View>
          <View style={styles.ctaText}>
            <Typography variant="label" weight="semibold" color="textPrimary">
              View Product Recommendations
            </Typography>
            <Typography variant="caption" color="textSecondary" style={styles.ctaSub}>
              12 products matched to your skin profile
            </Typography>
          </View>
          <Feather name="chevron-right" size={14} color={colors.primary} />
        </Pressable>

        {/* Scan Again */}
        <View style={styles.rescanRow}>
          <Button
            variant="outline"
            label="Scan Again"
            onPress={onRescan}
            style={styles.rescanBtn}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backBtn: {
    padding: spacing.xs,
  },
  topTitle: {
    color: colors.textPrimary,
    letterSpacing: 0.5,
    fontSize: 15,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },
  heroCard: {
    borderRadius: borderRadius.xxl,
    backgroundColor: colors.primary,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadows.xl,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroLabel: {
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  heroSkinType: {
    color: '#fff',
    letterSpacing: 0.3,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    marginTop: spacing.xs,
  },
  scoreCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    color: '#fff',
    fontSize: 20,
  },
  scoreLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 9,
  },
  heroTags: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
    flexWrap: 'wrap',
  },
  heroTag: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: borderRadius.full,
    paddingVertical: 4,
    paddingHorizontal: spacing.md,
  },
  heroTagText: {
    color: '#fff',
    letterSpacing: 0.3,
  },
  sectionLabel: {
    color: colors.textSecondary,
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  metricCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.sm,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  metricTrack: {
    height: 5,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceTertiary,
    overflow: 'hidden',
  },
  metricFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  concernsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  concernRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  concernDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  concernDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  concernText: {
    flex: 1,
    color: colors.textPrimary,
  },
  chevron: {
    marginLeft: 'auto',
  },
  ctaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: `${colors.primary}20`,
  },
  ctaIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  ctaText: {
    flex: 1,
    gap: spacing.xxs,
  },
  ctaSub: {
    marginTop: spacing.xxs,
  },
  rescanRow: {
    alignItems: 'center',
  },
  rescanBtn: {
    paddingHorizontal: spacing.xxxl,
    borderRadius: borderRadius.xxl,
  },
});
