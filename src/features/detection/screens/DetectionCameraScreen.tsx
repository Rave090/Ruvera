import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Pressable, Animated, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import type { CameraType, FlashMode } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Typography from '@components/Typography';
import Button from '@components/Button';
import { lightTheme } from '@theme';

const { colors, spacing, borderRadius } = lightTheme;

const ROSE_RING = 'rgba(196,106,130,0.6)';
const ROSE_CORE = '#9b2d4f';
const OVAL_ALIGNED = 'rgba(100,220,120,0.9)';
const OVAL_DEFAULT = 'rgba(245,180,195,0.7)';
const PULSE_ALIGNED = 'rgba(100,220,120,0.3)';
const PULSE_DEFAULT = 'rgba(196,106,130,0.3)';
const BADGE_ALIGNED = 'rgba(100,200,120,0.85)';
const BADGE_DEFAULT = 'rgba(122,29,58,0.85)';

interface Props {
  onCapture: (imageUri: string) => void;
}

export default function DetectionCameraScreen({ onCapture }: Props) {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('front');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [aligned, setAligned] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const cameraRef = useRef<CameraView>(null);

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, []),
  );
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.8)).current;
  const scanLineY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const id = setTimeout(() => setAligned(true), 1800);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseScale, { toValue: 1.08, duration: 1100, useNativeDriver: true }),
          Animated.timing(pulseOpacity, { toValue: 0.4, duration: 1100, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(pulseScale, { toValue: 1, duration: 1100, useNativeDriver: true }),
          Animated.timing(pulseOpacity, { toValue: 0.8, duration: 1100, useNativeDriver: true }),
        ]),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseScale, pulseOpacity]);

  useEffect(() => {
    if (!aligned) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineY, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(scanLineY, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [aligned, scanLineY]);

  const scanTranslate = scanLineY.interpolate({ inputRange: [0, 1], outputRange: [0, 224] });

  const handleCapture = useCallback(async () => {
    if (capturing || !cameraRef.current) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.85, skipProcessing: false });
      onCapture(photo.uri);
    } finally {
      setCapturing(false);
    }
  }, [capturing, onCapture]);

  const handleGallery = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4] as [number, number],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      onCapture(result.assets[0].uri);
    }
  }, [onCapture]);

  const toggleFacing = useCallback(() => {
    setFacing((f) => (f === 'back' ? 'front' : 'back'));
  }, []);

  const toggleFlash = useCallback(() => {
    setFlash((f) => (f === 'off' ? 'on' : 'off'));
  }, []);

  // ── Permission loading ────────────────────────────────────────
  if (!permission) {
    return <View style={styles.root}><StatusBar barStyle="light-content" /></View>;
  }

  // ── Permission denied ─────────────────────────────────────────
  if (!permission.granted) {
    return (
      <View style={[styles.permRoot, { paddingTop: insets.top + spacing.xxxl }]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <Ionicons name="camera-outline" size={64} color={colors.primaryLight} />
        <Typography variant="subheading" weight="semibold" style={styles.permTitle}>
          Camera Access Required
        </Typography>
        <Typography variant="body" color="textSecondary" align="center" style={styles.permSub}>
          Allow camera access to scan your skin for AI-powered analysis
        </Typography>
        <Button label="Grant Camera Access" onPress={requestPermission} style={styles.permBtn} />
        <Button
          variant="ghost"
          label="Choose from Gallery"
          onPress={handleGallery}
          style={styles.permGalleryBtn}
        />
      </View>
    );
  }

  // ── Main camera UI ────────────────────────────────────────────
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {isFocused && (
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing={facing}
          flash={flash}
        />
      )}

      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable
          style={[styles.iconBtn, flash === 'on' && styles.iconBtnActive]}
          onPress={toggleFlash}
          accessibilityRole="button"
          accessibilityLabel="Toggle flash"
        >
          <Ionicons name={flash === 'on' ? 'flash' : 'flash-off'} size={18} color="#fff" />
        </Pressable>
        <Typography variant="subheading" weight="bold" style={styles.brandText}>
          SkinSense
        </Typography>
        <View style={styles.avatarBtn}>
          <Ionicons name="person" size={20} color="#7a9cbf" />
        </View>
      </View>

      {/* Oval area */}
      <View style={styles.ovalArea} pointerEvents="none">
        <View style={[styles.alignBadge, { backgroundColor: aligned ? BADGE_ALIGNED : BADGE_DEFAULT }]}>
          <Typography variant="overline" style={styles.alignText}>
            {aligned ? '✓  ALIGNED' : 'FACE ALIGNMENT'}
          </Typography>
        </View>

        <View style={styles.ovalWrapper}>
          <Animated.View
            style={[
              styles.pulseRing,
              {
                borderColor: aligned ? PULSE_ALIGNED : PULSE_DEFAULT,
                transform: [{ scale: pulseScale }],
                opacity: pulseOpacity,
              },
            ]}
          />
          <View style={[styles.oval, { borderColor: aligned ? OVAL_ALIGNED : OVAL_DEFAULT }]}>
            {aligned && (
              <Animated.View
                style={[styles.scanLine, { transform: [{ translateY: scanTranslate }] }]}
              />
            )}
          </View>
        </View>

        <View style={styles.instrBlock}>
          <Typography variant="body" weight="medium" style={styles.instrPrimary}>
            Align your face within the frame
          </Typography>
          <Typography variant="caption" style={styles.instrSecondary}>
            Ensure even lighting for the best analysis
          </Typography>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <Pressable
          style={styles.ctrlBtn}
          onPress={handleGallery}
          accessibilityRole="button"
          accessibilityLabel="Open gallery"
        >
          <MaterialIcons name="photo-library" size={22} color="#fff" />
        </Pressable>

        <Pressable
          style={styles.captureBtn}
          onPress={handleCapture}
          disabled={capturing}
          accessibilityRole="button"
          accessibilityLabel="Capture"
        >
          <View style={styles.captureRing} />
          <View style={[styles.captureCore, capturing && styles.captureCoreActive]}>
            {capturing
              ? <ActivityIndicator size="small" color="rgba(255,255,255,0.8)" />
              : <View style={styles.captureDot} />
            }
          </View>
        </Pressable>

        <Pressable
          style={styles.ctrlBtn}
          onPress={toggleFacing}
          accessibilityRole="button"
          accessibilityLabel="Flip camera"
        >
          <Ionicons name="camera-reverse-outline" size={22} color="#fff" />
        </Pressable>
      </View>

      <View style={{ height: insets.bottom + spacing.lg }} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0D0B0C',
  },
  permRoot: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    gap: spacing.lg,
  },
  permTitle: {
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  permSub: {
    textAlign: 'center',
  },
  permBtn: {
    width: '100%',
    marginTop: spacing.sm,
  },
  permGalleryBtn: {
    width: '100%',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    zIndex: 10,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnActive: {
    backgroundColor: 'rgba(255,220,80,0.25)',
    borderColor: 'rgba(255,220,80,0.5)',
  },
  brandText: {
    color: '#d4688a',
  },
  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ovalArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alignBadge: {
    borderRadius: borderRadius.full,
    paddingVertical: 6,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  alignText: {
    color: '#fff',
    letterSpacing: 2,
  },
  ovalWrapper: {
    width: 200,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 224,
    height: 304,
    borderRadius: 112,
    borderWidth: 2,
  },
  oval: {
    width: 200,
    height: 280,
    borderRadius: 100,
    borderWidth: 2.5,
    overflow: 'hidden',
    alignItems: 'center',
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    left: 4,
    right: 4,
    height: 2,
    borderRadius: 2,
    backgroundColor: 'rgba(100,220,120,0.8)',
  },
  instrBlock: {
    marginTop: spacing.xxl,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  instrPrimary: {
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  instrSecondary: {
    color: 'rgba(255,255,255,0.5)',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 44,
    paddingBottom: spacing.xl,
  },
  ctrlBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(30,20,25,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureBtn: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureRing: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: ROSE_RING,
  },
  captureCore: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ROSE_CORE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ROSE_CORE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  captureCoreActive: {
    opacity: 0.7,
  },
  captureDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
});
