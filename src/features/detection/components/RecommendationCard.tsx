import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Card from '@components/Card';
import Typography from '@components/Typography';
import Button from '@components/Button';
import { lightTheme } from '@theme';
import { formatKebabCaseLabel } from '@utils/formatters';
import type { ProductRecommendation, RecommendationPriority } from '../types';

const { colors, spacing, borderRadius } = lightTheme;

interface RecommendationCardProps {
  recommendation: ProductRecommendation;
}

const PRIORITY_COLOR: Record<RecommendationPriority, string> = {
  essential: colors.error,
  recommended: colors.primary,
  optional: colors.textSecondary,
};

function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { category, priority, rationale, preferIngredients, avoidIngredients } = recommendation;
  const priorityColor = PRIORITY_COLOR[priority];

  return (
    <Card variant="outlined" padding="md" style={styles.card}>
      <View style={styles.header}>
        <Typography variant="label" weight="semibold">
          {formatKebabCaseLabel(category)}
        </Typography>
        <View style={[styles.badge, { backgroundColor: priorityColor + '1A' }]}>
          <Typography variant="caption" color={priorityColor} weight="semibold">
            {priority.toUpperCase()}
          </Typography>
        </View>
      </View>

      <Typography variant="bodySmall" color="textSecondary" style={styles.rationale}>
        {rationale}
      </Typography>

      {expanded && (
        <>
          {preferIngredients.length > 0 && (
            <View style={styles.ingredientRow}>
              <Typography variant="caption" weight="semibold" color="success">
                {'Look for: '}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {preferIngredients.slice(0, 3).join(', ')}
              </Typography>
            </View>
          )}
          {avoidIngredients.length > 0 && (
            <View style={styles.ingredientRow}>
              <Typography variant="caption" weight="semibold" color="error">
                {'Avoid: '}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {avoidIngredients.slice(0, 2).join(', ')}
              </Typography>
            </View>
          )}
        </>
      )}

      <Button
        variant="ghost"
        size="sm"
        label={expanded ? 'Show less' : 'Ingredients'}
        onPress={() => setExpanded((prev) => !prev)}
        accessibilityLabel={expanded ? 'Collapse ingredients' : 'Expand ingredient guidance'}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.full,
  },
  rationale: {
    marginBottom: spacing.xs,
  },
  ingredientRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
});

export default RecommendationCard;
