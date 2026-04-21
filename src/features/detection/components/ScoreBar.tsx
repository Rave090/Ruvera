import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import Typography from '@components/Typography';
import { lightTheme } from '@theme';

const { colors, spacing, borderRadius } = lightTheme;

interface ScoreBarProps {
  label: string;
  score: number;
  color?: string;
}

function ScoreBar({ label, score, color = colors.primary }: ScoreBarProps) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: score,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [anim, score]);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Typography variant="label">{label}</Typography>
        <Typography variant="label" color="textSecondary">
          {Math.round(score * 100)}%
        </Typography>
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: color,
              width: anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  track: {
    height: 8,
    backgroundColor: colors.surfaceTertiary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
});

export default ScoreBar;
