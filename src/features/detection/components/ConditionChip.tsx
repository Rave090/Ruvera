import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from '@components/Typography';
import { lightTheme } from '@theme';
import { formatKebabCaseLabel } from '@utils/formatters';
import type { SkinCondition, Severity } from '@ml/skinAnalysis/types';

const { colors, spacing, borderRadius } = lightTheme;

interface ConditionChipProps {
  condition: SkinCondition;
  severity: Severity;
}

const SEVERITY_COLOR: Record<Exclude<Severity, 'none'>, string> = {
  mild: colors.warning,
  moderate: colors.secondary,
  severe: colors.error,
};

function ConditionChip({ condition, severity }: ConditionChipProps) {
  if (severity === 'none') return null;

  const chipColor = SEVERITY_COLOR[severity];

  return (
    <View style={[styles.chip, { borderColor: chipColor, backgroundColor: chipColor + '22' }]}>
      <View style={[styles.dot, { backgroundColor: chipColor }]} />
      <Typography variant="caption" color={chipColor} weight="medium">
        {formatKebabCaseLabel(condition)}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: borderRadius.full,
    marginRight: spacing.xs,
  },
});

export default ConditionChip;
