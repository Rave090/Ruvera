import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewToken,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BrandIcon from '@components/BrandIcon/BrandIcon';
import { Button } from '@components/Button';
import { Typography } from '@components/Typography';
import { useOnboarding } from '@features/auth/hooks/useOnboarding';
import { lightTheme } from '@theme';

const { spacing } = lightTheme;

const BRAND = '#5C2B3E';

interface Slide {
  id: string;
  badge: string;
  heading: string;
  body: string;
  bgColor: string;
  accentColor: string;
}

const SLIDES: Slide[] = [
  {
    id: 'scan',
    badge: 'AURA AI',
    heading: 'Reveal Your\nInner Radiance',
    body: "Experience the world's most advanced AI skin analysis tailored for Nepal.",
    bgColor: '#C8906A',
    accentColor: '#E8C090',
  },
  {
    id: 'consult',
    badge: 'DERM CONNECT',
    heading: 'Talk to Skin\nExperts Anytime',
    body: 'Connect with certified dermatologists for real-time consultations — text, audio, or video.',
    bgColor: '#5A9278',
    accentColor: '#90C4A8',
  },
  {
    id: 'products',
    badge: 'SMART PICKS',
    heading: 'Products Made\nFor Your Skin',
    body: 'Get personalised product recommendations based on your unique skin profile.',
    bgColor: '#5880A8',
    accentColor: '#98BCDA',
  },
  {
    id: 'cta',
    badge: 'WELCOME',
    heading: 'Begin Your\nSkin Journey',
    body: 'Join thousands who have transformed their skincare routine with Ruvera.',
    bgColor: '#A86050',
    accentColor: '#D49880',
  },
];

// ─── Dot indicator ────────────────────────────────────────────────────────────

interface DotIndicatorProps {
  count: number;
  activeIndex: number;
}

function DotIndicator({ count, activeIndex }: DotIndicatorProps) {
  const dotWidths = useRef(
    SLIDES.map((_, i) => new Animated.Value(i === 0 ? 22 : 8))
  ).current;

  useEffect(() => {
    dotWidths.forEach((anim, i) => {
      Animated.spring(anim, {
        toValue: i === activeIndex ? 22 : 8,
        useNativeDriver: false,
        speed: 20,
        bounciness: 4,
      }).start();
    });
  }, [activeIndex]);

  return (
    <View style={dotStyles.row}>
      {Array.from({ length: count }).map((_, i) => (
        <Animated.View
          key={i}
          style={[
            dotStyles.dot,
            {
              width: dotWidths[i],
              backgroundColor: i === activeIndex ? BRAND : '#C4A0A8',
              opacity: i === activeIndex ? 1 : 0.45,
            },
          ]}
        />
      ))}
    </View>
  );
}

const dotStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});

// ─── Individual slide ─────────────────────────────────────────────────────────

interface SlideProps {
  slide: Slide;
  activeIndex: number;
  isLast: boolean;
  onNext: () => void;
  onSkip: () => void;
}

function OnboardingSlide({ slide, activeIndex, isLast, onNext, onSkip }: SlideProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const circleSize = Math.min(width, height) * 0.55;

  return (
    <View style={{ width, height, backgroundColor: slide.bgColor }}>
      {/* Decorative product circle */}
      <View style={slideStyles.bgArea}>
        <View
          style={[
            slideStyles.decoOuter,
            {
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize / 2,
              backgroundColor: slide.accentColor,
            },
          ]}
        >
          <View
            style={[
              slideStyles.decoInner,
              {
                width: circleSize * 0.72,
                height: circleSize * 0.72,
                borderRadius: (circleSize * 0.72) / 2,
                backgroundColor: slide.bgColor,
              },
            ]}
          />
          {/* Reflective cap detail */}
          <View style={slideStyles.decoGloss} />
        </View>
      </View>

      {/* Content card */}
      <View
        style={[
          slideStyles.card,
          {
            paddingBottom: Math.max(insets.bottom + spacing.lg, spacing.xl),
          },
        ]}
      >
        {/* Badge */}
        <View style={slideStyles.badge}>
          <BrandIcon size={13} color={BRAND} />
          <Typography style={slideStyles.badgeText}>{slide.badge}</Typography>
        </View>

        {/* Heading */}
        <Typography
          variant="h2"
          weight="bold"
          style={slideStyles.heading}
        >
          {slide.heading}
        </Typography>

        {/* Body */}
        <Typography
          variant="body"
          color="textSecondary"
          style={slideStyles.body}
        >
          {slide.body}
        </Typography>

        {/* Dots */}
        <DotIndicator count={SLIDES.length} activeIndex={activeIndex} />

        {/* Primary CTA */}
        <Button
          variant="primary"
          size="lg"
          label={isLast ? 'GET STARTED' : 'NEXT  →'}
          onPress={onNext}
          fullWidth
          style={slideStyles.nextBtn}
        />

        {/* Skip */}
        {!isLast && (
          <Button
            variant="ghost"
            size="md"
            label="SKIP INTRODUCTION"
            onPress={onSkip}
            fullWidth
          />
        )}
      </View>
    </View>
  );
}

const slideStyles = StyleSheet.create({
  bgArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decoOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  decoInner: {
    position: 'absolute',
  },
  decoGloss: {
    position: 'absolute',
    top: '12%',
    left: '20%',
    width: '55%',
    height: '35%',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    transform: [{ rotate: '-20deg' }],
  },
  card: {
    backgroundColor: '#FDFAF9',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    gap: spacing.lg,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: BRAND,
    letterSpacing: 1.8,
  },
  heading: {
    fontSize: 32,
    color: '#3D1828',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  body: {
    lineHeight: 24,
  },
  nextBtn: {
    borderRadius: 999,
    marginTop: spacing.xs,
  },
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const router = useRouter();
  const { finishOnboarding } = useOnboarding();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);
  const { width } = useWindowDimensions();

  const handleFinish = useCallback(async () => {
    await finishOnboarding();
    router.replace('/(auth)/login');
  }, [finishOnboarding, router]);

  const handleNext = useCallback(() => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      handleFinish();
    }
  }, [activeIndex, handleFinish]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
    []
  );

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <FlatList
      ref={flatListRef}
      data={SLIDES}
      keyExtractor={(item) => item.id}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig.current}
      getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
      renderItem={({ item, index }) => (
        <OnboardingSlide
          slide={item}
          activeIndex={activeIndex}
          isLast={index === SLIDES.length - 1}
          onNext={handleNext}
          onSkip={handleFinish}
        />
      )}
    />
  );
}
