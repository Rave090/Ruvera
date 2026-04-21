import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@components/Typography';
import { lightTheme } from '@theme';
import type { TrackingEvent } from '../types';

const { colors, spacing, borderRadius } = lightTheme;

interface TrackingTimelineProps {
  events: TrackingEvent[];
}

export function TrackingTimeline({ events }: TrackingTimelineProps) {
  return (
    <View style={styles.container}>
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        return (
          <View key={index} style={styles.eventRow}>
            <View style={styles.lineColumn}>
              <View
                style={[
                  styles.dot,
                  event.isCompleted ? styles.dotCompleted : styles.dotPending,
                ]}
              />
              {!isLast && (
                <View
                  style={[
                    styles.line,
                    event.isCompleted ? styles.lineCompleted : styles.linePending,
                  ]}
                />
              )}
            </View>
            <View style={styles.eventContent}>
              <Typography
                variant="bodySmall"
                weight={event.isCompleted ? 'semibold' : 'regular'}
                color={event.isCompleted ? 'textPrimary' : 'textDisabled'}
              >
                {event.description}
              </Typography>
              {event.timestamp && (
                <Typography variant="caption" color="textDisabled">
                  {new Date(event.timestamp).toLocaleString()}
                </Typography>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  eventRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  lineColumn: {
    alignItems: 'center',
    width: 20,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: borderRadius.full,
    marginTop: 2,
  },
  dotCompleted: {
    backgroundColor: colors.primary,
  },
  dotPending: {
    backgroundColor: colors.border,
    borderWidth: 2,
    borderColor: colors.textDisabled,
  },
  line: {
    width: 2,
    flex: 1,
    minHeight: spacing.xl,
    marginVertical: 2,
  },
  lineCompleted: {
    backgroundColor: colors.primary,
  },
  linePending: {
    backgroundColor: colors.border,
  },
  eventContent: {
    flex: 1,
    paddingBottom: spacing.md,
    gap: 2,
  },
});
