import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Pressable, Animated, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import Typography from '@components/Typography';
import Button from '@components/Button';
import RoutineSection from '../components/RoutineSection';
import {
  useDetectionStore,
  selectAnalysisResult,
  selectBackendResult,
  selectRoutine,
} from '../store/detection.store';
import { lightTheme } from '@theme';
import type { SkinCondition } from '@ml/skinAnalysis/types';

const { colors, spacing, borderRadius, shadows } = lightTheme;

const SKIN_SUBTITLES: Record<string, string> = {
  oily: 'Enlarged pores · shine-prone',
  dry: 'Tight · flaking-prone',
  combination: 'T-zone oily · cheeks normal-dry',
  normal: 'Balanced · healthy',
  sensitive: 'Reactive · easily irritated',
};

const CONCERN_LABELS: Record<string, string> = {
  acne: 'Acne',
  hyperpigmentation: 'Hyperpigmentation',
  dryness: 'Dryness',
  oiliness: 'Excess Oiliness',
  sensitivity: 'Sensitivity',
  wrinkles: 'Fine Lines & Wrinkles',
  rosacea: 'Rosacea',
  'dark-circles': 'Dark Circles',
};

const SEVERITY_COLORS: Record<string, string> = {
  mild: '#c4a035',
  moderate: '#ba5a6a',
  severe: '#c43a3a',
};

interface Props {
  onRescan: () => void;
}

export default function DetectionResultsScreen({ onRescan }: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const analysisResult = useDetectionStore(selectAnalysisResult);
  const backendResult = useDetectionStore(selectBackendResult);
  const routine = useDetectionStore(selectRoutine);

  const [visible, setVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;
  const metricAnims = useRef([...Array(4)].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start(() => setVisible(true));
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    if (!visible || !backendResult || !analysisResult) return;
    const targets = [
      backendResult.hydrationScore / 100,
      backendResult.overallHealthScore / 100,
      analysisResult.scores.texture,
      analysisResult.scores.uniformity,
    ];
    Animated.stagger(
      100,
      metricAnims.map((anim, i) =>
        Animated.timing(anim, { toValue: targets[i], duration: 900, useNativeDriver: false }),
      ),
    ).start();
  }, [visible, backendResult, analysisResult, metricAnims]);

  if (!backendResult || !analysisResult) return <View style={styles.root} />;

  const skinTypeLabel =
    backendResult.skinType.charAt(0).toUpperCase() + backendResult.skinType.slice(1);
  const subtitle = SKIN_SUBTITLES[backendResult.skinType] ?? '';

  const conditionSeverityMap = new Map(analysisResult.conditions.map((c) => [c.condition, c.severity]));

  const metrics = [
    { label: 'Hydration', value: backendResult.hydrationScore, sub: backendResult.hydrationLabel, color: '#4a9aba' },
    { label: 'Overall Health', value: backendResult.overallHealthScore, sub: '', color: '#5a8a5a' },
    { label: 'Texture', value: Math.round(analysisResult.scores.texture * 100), sub: '', color: '#c4a035' },
    { label: 'Uniformity', value: Math.round(analysisResult.scores.uniformity * 100), sub: '', color: '#ba5a6a' },
  ];

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.topBar}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} accessibilityRole="button">
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
        <Animated.View style={[styles.heroCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.heroTop}>
            <View style={styles.heroLeft}>
              <Typography variant="overline" style={styles.heroLabel}>Skin Type Detected</Typography>
              <Typography variant="h2" style={styles.heroSkinType}>{skinTypeLabel}</Typography>
              {subtitle ? (
                <Typography variant="caption" style={styles.heroSubtitle}>{subtitle}</Typography>
              ) : null}
            </View>
            <View style={styles.scoreCircle}>
              <Typography variant="subheading" weight="bold" style={styles.scoreNumber}>
                {backendResult.overallHealthScore}
              </Typography>
              <Typography variant="overline" style={styles.scoreLabel}>score</Typography>
            </View>
          </View>
          {backendResult.concerns.length > 0 && (
            <View style={styles.heroTags}>
              {backendResult.concerns.map((c) => (
                <View key={c} style={styles.heroTag}>
                  <Typography variant="caption" style={styles.heroTagText}>
                    {CONCERN_LABELS[c] ?? c}
                  </Typography>
                </View>
              ))}
            </View>
          )}
        </Animated.View>

        {/* Metrics */}
        <Typography variant="overline" style={styles.sectionLabel}>Skin Metrics</Typography>
        <View style={styles.metricsGrid}>
          {metrics.map((m, i) => {
            const barWidth = metricAnims[i].interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
            return (
              <View key={m.label} style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <Typography variant="caption" weight="semibold" color="textSecondary">{m.label}</Typography>
                  <Typography variant="label" weight="bold" style={{ color: m.color }}>{m.value}%</Typography>
                </View>
                <View style={styles.metricTrack}>
                  <Animated.View style={[styles.metricFill, { width: barWidth, backgroundColor: m.color }]} />
                </View>
                {m.sub ? (
                  <Typography variant="caption" style={{ color: m.color, marginTop: spacing.xxs, fontSize: 10 }}>
                    {m.sub}
                  </Typography>
                ) : null}
              </View>
            );
          })}
        </View>

        {/* Concerns */}
        {backendResult.concerns.length > 0 && (
          <>
            <Typography variant="overline" style={styles.sectionLabel}>Skin Concerns</Typography>
            <View style={styles.concernsCard}>
              {backendResult.concerns.map((name, i) => {
                const severity = conditionSeverityMap.get(name as SkinCondition) ?? 'mild';
                const dotColor = SEVERITY_COLORS[severity] ?? SEVERITY_COLORS.mild;
                return (
                  <View
                    key={name}
                    style={[styles.concernRow, i < backendResult.concerns.length - 1 && styles.concernDivider]}
                  >
                    <View style={[styles.concernDot, { backgroundColor: dotColor }]} />
                    <Typography variant="bodySmall" style={styles.concernText}>
                      {CONCERN_LABELS[name] ?? name}
                    </Typography>
                    <Typography variant="caption" style={{ color: dotColor, textTransform: 'capitalize' }}>
                      {severity}
                    </Typography>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* Routine */}
        {routine && (
          <>
            <View style={styles.routineHeader}>
              <Typography variant="overline" style={styles.sectionLabel}>Your Routine</Typography>
              <View style={styles.routineBadge}>
                <Ionicons name="sparkles" size={12} color={colors.primary} />
                <Typography variant="caption" style={styles.routineBadgeText}>AI Generated</Typography>
              </View>
            </View>
            <RoutineSection routine={routine} />
          </>
        )}

        {/* Products CTA */}
        <Pressable style={styles.ctaCard} accessibilityRole="button" onPress={() => router.push('/(user)/products' as never)}>
          <View style={styles.ctaIcon}>
            <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
          </View>
          <View style={styles.ctaText}>
            <Typography variant="label" weight="semibold" color="textPrimary">
              View Matched Products
            </Typography>
            <Typography variant="caption" color="textSecondary" style={{ marginTop: spacing.xxs }}>
              Products selected for your skin type
            </Typography>
          </View>
          <Feather name="chevron-right" size={14} color={colors.primary} />
        </Pressable>

        <View style={styles.rescanRow}>
          <Button variant="outline" label="Scan Again" onPress={onRescan} style={styles.rescanBtn} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
  },
  backBtn: { padding: spacing.xs },
  topTitle: { color: colors.textPrimary, letterSpacing: 0.5, fontSize: 15 },
  iconCircle: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg },
  heroCard: {
    borderRadius: borderRadius.xxl, backgroundColor: colors.primary,
    padding: spacing.xl, marginBottom: spacing.lg, ...shadows.xl,
  },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroLeft: { flex: 1, marginRight: spacing.md },
  heroLabel: { color: 'rgba(255,255,255,0.7)', letterSpacing: 2, marginBottom: spacing.xs },
  heroSkinType: { color: '#fff', letterSpacing: 0.3 },
  heroSubtitle: { color: 'rgba(255,255,255,0.75)', marginTop: spacing.xs },
  scoreCircle: {
    width: 68, height: 68, borderRadius: 34,
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center', justifyContent: 'center',
  },
  scoreNumber: { color: '#fff', fontSize: 20 },
  scoreLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 9 },
  heroTags: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg, flexWrap: 'wrap' },
  heroTag: {
    backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: borderRadius.full,
    paddingVertical: 4, paddingHorizontal: spacing.md,
  },
  heroTagText: { color: '#fff', letterSpacing: 0.3 },
  sectionLabel: { color: colors.textSecondary, letterSpacing: 1.5, marginBottom: spacing.md },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  metricCard: {
    width: '48%', backgroundColor: colors.surface,
    borderRadius: borderRadius.xl, padding: spacing.lg, ...shadows.sm,
  },
  metricHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: spacing.sm,
  },
  metricTrack: {
    height: 5, borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceTertiary, overflow: 'hidden',
  },
  metricFill: { height: '100%', borderRadius: borderRadius.full },
  concernsCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.xl,
    overflow: 'hidden', marginBottom: spacing.lg, ...shadows.sm,
  },
  concernRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.md, paddingHorizontal: spacing.lg, gap: spacing.md,
  },
  concernDivider: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  concernDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  concernText: { flex: 1, color: colors.textPrimary },
  routineHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  routineBadge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    backgroundColor: `${colors.primary}12`, borderRadius: borderRadius.full,
    paddingVertical: 4, paddingHorizontal: spacing.sm,
  },
  routineBadgeText: { color: colors.primary, fontSize: 10 },
  ctaCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.surfaceSecondary, borderRadius: borderRadius.xl,
    padding: spacing.lg, marginTop: spacing.lg, marginBottom: spacing.lg,
    borderWidth: 1, borderColor: `${colors.primary}20`,
  },
  ctaIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  ctaText: { flex: 1 },
  rescanRow: { alignItems: 'center' },
  rescanBtn: { paddingHorizontal: spacing.xxxl, borderRadius: borderRadius.xxl },
});
