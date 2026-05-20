import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Typography from '@components/Typography';
import { lightTheme } from '@theme';
import type { SkinRoutineApiResult, RoutineStep } from '../types';

const { colors, spacing, borderRadius, shadows } = lightTheme;

const CATEGORY_LABELS: Record<string, string> = {
  cleanser: 'Cleanser',
  toner: 'Toner',
  serum: 'Serum',
  moisturizer: 'Moisturizer',
  sunscreen: 'Sunscreen',
  treatment: 'Treatment',
  'eye-cream': 'Eye Cream',
  exfoliant: 'Exfoliant',
  mask: 'Mask',
};

function StepList({ steps }: { steps: RoutineStep[] }) {
  return (
    <View style={styles.card}>
      {steps.map((step, index) => (
        <View
          key={step.order}
          style={[styles.step, index < steps.length - 1 && styles.stepDivider]}
        >
          <View style={styles.stepBadge}>
            <Typography variant="overline" style={styles.stepNum}>{step.order}</Typography>
          </View>
          <View style={styles.stepBody}>
            <Typography variant="label" weight="semibold" color="textPrimary">
              {CATEGORY_LABELS[step.productCategory] ?? step.productCategory}
            </Typography>
            <Typography variant="caption" color="textSecondary" style={styles.instr}>
              {step.instruction}
            </Typography>
            {step.productName !== null && (
              <View style={styles.productRow}>
                <Ionicons name="checkmark-circle" size={12} color={colors.primary} />
                <Typography variant="caption" style={styles.productName}>
                  {step.productName}
                </Typography>
              </View>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

interface Props {
  routine: SkinRoutineApiResult;
}

export default function RoutineSection({ routine }: Props) {
  return (
    <View>
      <Typography variant="overline" style={styles.sectionLabel}>Morning Routine</Typography>
      <StepList steps={routine.morning} />
      <Typography variant="overline" style={[styles.sectionLabel, styles.eveningLabel]}>
        Evening Routine
      </Typography>
      <StepList steps={routine.evening} />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    color: colors.textSecondary,
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  eveningLabel: {
    marginTop: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.sm,
  },
  step: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
  },
  stepDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: `${colors.primary}18`,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  stepNum: {
    color: colors.primary,
    fontSize: 10,
  },
  stepBody: {
    flex: 1,
    gap: spacing.xxs,
  },
  instr: {
    lineHeight: 18,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  productName: {
    color: colors.primary,
    fontWeight: '500',
  },
});
