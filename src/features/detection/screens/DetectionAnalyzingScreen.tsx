import React, { useState, useEffect, useRef } from 'react';
import { View, Animated, StyleSheet} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Typography from '@components/Typography';
import { lightTheme } from '@theme';

const { colors, spacing, borderRadius, shadows } = lightTheme;

const STEPS = ['Texture Scan', 'Hydration Mapping', 'Melanin Balance', 'Pore Analysis', 'AI Profiling'];
const TAGS = ['AI-driven calibrated analysis', 'Texture Scan', 'Hydration Mapping', 'Melanin Balance'];

interface Props {
  onDone: () => void;
}

export default function DetectionAnalyzingScreen({ onDone }: Props) {
  const insets = useSafeAreaInsets();
  const [progress, setProgress] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  const stepIndex = Math.min(Math.floor((progress / 100) * STEPS.length), STEPS.length - 1);

  useEffect(() => {
    let p = 0;
    const iv = setInterval(() => {
      p = Math.min(p + 1.1, 100);
      setProgress(p);
      Animated.timing(progressAnim, { toValue: p / 100, duration: 50, useNativeDriver: false }).start();
      if (p >= 100) {
        clearInterval(iv);
        setTimeout(onDone, 500);
      }
    }, 38);
    return () => clearInterval(iv);
  }, [onDone, progressAnim]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(scanLineAnim, { toValue: 0, duration: 1400, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [scanLineAnim]);

  const progressWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const scanTranslate = scanLineAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 160] });

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>

      <View style={styles.content}>
        <View style={styles.illustration}>
          <View style={styles.skinBg} />
          <View style={styles.skinCells1} />
          <View style={styles.skinCells2} />
          <View style={styles.skinDermis} />
          <Animated.View style={[styles.skinScanLine, { transform: [{ translateY: scanTranslate }] }]} />
          <View style={styles.illustrationSheen} />
        </View>

        <View style={styles.textBlock}>
          <Typography variant="subheading" weight="semibold" style={styles.analyzeTitle}>
            Analyzing your skin…
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {STEPS[stepIndex]}
          </Typography>
        </View>

        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>

        <View style={styles.tags}>
          {TAGS.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Typography variant="caption" color="textSecondary" style={styles.tagText}>
                {tag}
              </Typography>
            </View>
          ))}
        </View>
      </View>
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
    paddingVertical: spacing.lg,
  },
  topTitle: {
    color: colors.textPrimary,
    letterSpacing: 3,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 7,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.xl,
  },
  illustration: {
    width: 200,
    height: 200,
    borderRadius: borderRadius.xxl,
    overflow: 'hidden',
    ...shadows.lg,
  },
  skinBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ddd5de',
  },
  skinCells1: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    height: 44,
    backgroundColor: '#c8bdc9',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 20,
  },
  skinCells2: {
    position: 'absolute',
    top: 88,
    left: 0,
    right: 0,
    height: 44,
    backgroundColor: '#b8adb9',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 32,
  },
  skinDermis: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#a89daa',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  skinScanLine: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: 'rgba(200,80,110,0.7)',
  },
  illustrationSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  textBlock: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  analyzeTitle: {
    color: colors.textPrimary,
    letterSpacing: 0.2,
  },
  progressTrack: {
    width: '100%',
    height: 4,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceTertiary,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(122,29,58,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  tagText: {
    letterSpacing: 0.3,
  },
});
