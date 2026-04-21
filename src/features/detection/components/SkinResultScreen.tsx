import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Typography from '@components/Typography';
import Button from '@components/Button';
import Card from '@components/Card';
import { lightTheme } from '@theme';
import { formatKebabCaseLabel } from '@utils/formatters';
import { useDetectionStore, selectAnalysisResult } from '../store/detection.store';
import { useRecommendationStore, selectCurrentRecommendation } from '@store/recommendation.store';
import ScoreBar from './ScoreBar';
import ConditionChip from './ConditionChip';
import RecommendationCard from './RecommendationCard';

const { colors, spacing, borderRadius } = lightTheme;

type ProductTab = 'skincare' | 'cosmetics';
type RoutineTab = 'morning' | 'evening';

const SKIN_TYPE_COLOR: Record<string, string> = {
  oily: colors.info,
  dry: colors.secondary,
  combination: colors.primary,
  normal: colors.success,
  sensitive: colors.warning,
};

function SkinResultScreen() {
  const analysisResult = useDetectionStore(selectAnalysisResult);
  const recommendation = useRecommendationStore(selectCurrentRecommendation);
  const [productTab, setProductTab] = useState<ProductTab>('skincare');
  const [routineTab, setRoutineTab] = useState<RoutineTab>('morning');
  const insets = useSafeAreaInsets();

  if (!analysisResult || !recommendation) {
    return (
      <View style={styles.emptyContainer}>
        <Typography variant="body" color="textSecondary" align="center">
          No analysis available. Take a skin scan to see your results.
        </Typography>
      </View>
    );
  }

  const { skinType, conditions, scores, confidence } = analysisResult;
  const { skincareProducts, cosmeticProducts, morningRoutine, eveningRoutine } = recommendation;
  const activeProducts = productTab === 'skincare' ? skincareProducts : cosmeticProducts;
  const activeRoutine = routineTab === 'morning' ? morningRoutine : eveningRoutine;
  const skinTypeColor = SKIN_TYPE_COLOR[skinType] ?? colors.primary;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <Typography variant="h2">Skin Report</Typography>
        <View style={[styles.skinTypeBadge, { backgroundColor: skinTypeColor + '22', borderColor: skinTypeColor }]}>
          <Typography variant="label" color={skinTypeColor} weight="semibold">
            {skinType.toUpperCase()}
          </Typography>
        </View>
        <Typography variant="bodySmall" color="textSecondary">
          {Math.round(confidence * 100)}% confidence
        </Typography>
      </View>

      {/* Scores */}
      <Card variant="elevated" shadow="sm" style={styles.section}>
        <Typography variant="subheading" style={styles.sectionTitle}>
          Skin Scores
        </Typography>
        <ScoreBar label="Hydration" score={scores.hydration} color={colors.info} />
        <ScoreBar label="Texture" score={scores.texture} color={colors.success} />
        <ScoreBar label="Uniformity" score={scores.uniformity} color={colors.primary} />
      </Card>

      {/* Conditions */}
      {conditions.length > 0 && (
        <Card variant="elevated" shadow="sm" style={styles.section}>
          <Typography variant="subheading" style={styles.sectionTitle}>
            Conditions Detected
          </Typography>
          <View style={styles.chipsWrap}>
            {conditions.map((c) => (
              <ConditionChip key={c.condition} condition={c.condition} severity={c.severity} />
            ))}
          </View>
        </Card>
      )}

      {/* Recommendations */}
      <Card variant="elevated" shadow="sm" style={styles.section}>
        <Typography variant="subheading" style={styles.sectionTitle}>
          Recommendations
        </Typography>
        <View style={styles.tabRow}>
          <Button
            variant={productTab === 'skincare' ? 'primary' : 'outline'}
            size="sm"
            label="Skincare"
            onPress={() => setProductTab('skincare')}
            style={styles.tabButton}
            accessibilityLabel="Show skincare recommendations"
          />
          <Button
            variant={productTab === 'cosmetics' ? 'primary' : 'outline'}
            size="sm"
            label="Cosmetics"
            onPress={() => setProductTab('cosmetics')}
            style={styles.tabButton}
            accessibilityLabel="Show cosmetics recommendations"
          />
        </View>
        {activeProducts.length === 0 ? (
          <Typography variant="bodySmall" color="textSecondary">
            No recommendations for this category.
          </Typography>
        ) : (
          activeProducts.map((rec) => (
            <RecommendationCard key={`${productTab}-${rec.category}`} recommendation={rec} />
          ))
        )}
      </Card>

      {/* Routine */}
      <Card variant="elevated" shadow="sm" style={styles.section}>
        <Typography variant="subheading" style={styles.sectionTitle}>
          Daily Routine
        </Typography>
        <View style={styles.tabRow}>
          <Button
            variant={routineTab === 'morning' ? 'primary' : 'outline'}
            size="sm"
            label="Morning"
            onPress={() => setRoutineTab('morning')}
            style={styles.tabButton}
            accessibilityLabel="Show morning routine"
          />
          <Button
            variant={routineTab === 'evening' ? 'primary' : 'outline'}
            size="sm"
            label="Evening"
            onPress={() => setRoutineTab('evening')}
            style={styles.tabButton}
            accessibilityLabel="Show evening routine"
          />
        </View>
        {activeRoutine.map((step) => (
          <View key={step.order} style={styles.routineStep}>
            <View style={styles.stepBubble}>
              <Typography variant="label" color="textOnPrimary" weight="bold">
                {step.order}
              </Typography>
            </View>
            <View style={styles.stepBody}>
              <Typography variant="label" weight="semibold">
                {formatKebabCaseLabel(step.productCategory)}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {step.instruction}
              </Typography>
            </View>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'flex-start',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  skinTypeBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tabRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tabButton: {
    flex: 1,
  },
  routineStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  stepBubble: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  stepBody: {
    flex: 1,
    gap: spacing.xxs,
  },
});

export default SkinResultScreen;
