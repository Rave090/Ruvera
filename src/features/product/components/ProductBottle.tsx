import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@components/Typography';
import type { ProductCategory } from '../types';

interface ProductBottleProps {
  category: ProductCategory;
  accentColor?: string;
  size?: 'sm' | 'lg';
}

const DEFAULT_ACCENT = '#9b2d4f';

function s(n: number, scale: number): number {
  return Math.round(n * scale);
}

function SerumBottle({
  accent,
  scale,
}: {
  accent: string;
  scale: number;
}): React.ReactElement {
  const bodyW = s(14, scale);
  const bodyH = s(50, scale);
  const bodyRadius = s(7, scale);

  return (
    <View style={[bottleStyles.col, { height: s(84, scale), width: s(40, scale) }]}>
      <View
        style={{
          width: s(7, scale),
          height: s(7, scale),
          borderRadius: s(4, scale),
          backgroundColor: accent,
          opacity: 0.65,
          marginTop: s(4, scale),
        }}
      />
      <View
        style={{
          width: s(3, scale),
          height: s(12, scale),
          backgroundColor: 'rgba(255,255,255,0.72)',
        }}
      />
      <View
        style={[
          bottleStyles.bodyBase,
          {
            width: bodyW,
            height: bodyH,
            borderRadius: bodyRadius,
          },
        ]}
      >
        <View
          style={{
            position: 'absolute',
            left: s(2, scale),
            top: s(6, scale),
            width: s(2, scale),
            height: s(28, scale),
            borderRadius: s(1, scale),
            backgroundColor: 'rgba(255,255,255,0.55)',
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: s(19, scale),
            height: s(12, scale),
            backgroundColor: accent,
            opacity: 0.13,
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: s(2, scale),
            right: s(2, scale),
            top: s(22, scale),
            height: s(1.5, scale) || 1,
            backgroundColor: accent,
            opacity: 0.38,
          }}
        />
      </View>
    </View>
  );
}

function TonerBottle({
  accent,
  scale,
}: {
  accent: string;
  scale: number;
}): React.ReactElement {
  const bodyW = s(26, scale);
  const bodyH = s(46, scale);
  const bodyRadius = s(10, scale);

  return (
    <View style={[bottleStyles.col, { height: s(84, scale), width: s(50, scale) }]}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          width: bodyW,
          height: s(16, scale),
        }}
      >
        <View
          style={{
            width: s(8, scale),
            height: s(12, scale),
            backgroundColor: 'rgba(255,255,255,0.8)',
            borderRadius: s(4, scale),
            marginLeft: s(6, scale),
          }}
        />
        <View
          style={{
            width: s(10, scale),
            height: s(4, scale),
            backgroundColor: accent,
            opacity: 0.5,
            borderRadius: s(2, scale),
            marginLeft: s(1, scale),
          }}
        />
      </View>
      <View
        style={[
          bottleStyles.bodyBase,
          {
            width: bodyW,
            height: bodyH,
            borderRadius: bodyRadius,
          },
        ]}
      >
        <View
          style={{
            position: 'absolute',
            left: s(3, scale),
            top: s(8, scale),
            width: s(3, scale),
            height: s(28, scale),
            borderRadius: s(1.5, scale),
            backgroundColor: 'rgba(255,255,255,0.45)',
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: s(20, scale),
            height: s(10, scale),
            backgroundColor: accent,
            opacity: 0.1,
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: s(4, scale),
            right: s(4, scale),
            top: s(23, scale),
            height: s(1.5, scale) || 1,
            backgroundColor: accent,
            opacity: 0.36,
          }}
        />
      </View>
    </View>
  );
}

function MoisturizerJar({
  accent,
  scale,
}: {
  accent: string;
  scale: number;
}): React.ReactElement {
  const bodyW = s(36, scale);
  const bodyH = s(28, scale);
  const lidW = s(40, scale);
  const lidH = s(12, scale);

  return (
    <View style={[bottleStyles.col, { height: s(84, scale), width: s(56, scale) }]}>
      <View style={{ marginTop: s(10, scale) }}>
        <View
          style={{
            width: lidW,
            height: lidH,
            borderRadius: s(6, scale),
            backgroundColor: 'rgba(255,255,255,0.94)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: lidW - s(8, scale),
              height: lidH - s(4, scale),
              borderRadius: s(4, scale),
              backgroundColor: accent,
              opacity: 0.13,
            }}
          />
        </View>
        <View
          style={[
            bottleStyles.bodyBase,
            {
              width: bodyW,
              height: bodyH,
              borderRadius: s(8, scale),
              marginTop: 1,
            },
          ]}
        >
          <View
            style={{
              position: 'absolute',
              left: s(3, scale),
              top: s(5, scale),
              width: s(4, scale),
              height: s(16, scale),
              borderRadius: s(2, scale),
              backgroundColor: 'rgba(255,255,255,0.42)',
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: s(8, scale),
              right: s(8, scale),
              top: s(12, scale),
              height: s(1.5, scale) || 1,
              backgroundColor: accent,
              opacity: 0.32,
            }}
          />
        </View>
      </View>
    </View>
  );
}

function SunscreenTube({
  accent,
  scale,
}: {
  accent: string;
  scale: number;
}): React.ReactElement {
  const bodyW = s(20, scale);
  const bodyH = s(50, scale);
  const capH = s(12, scale);
  const bodyRadius = s(8, scale);

  return (
    <View style={[bottleStyles.col, { height: s(84, scale), width: s(40, scale) }]}>
      <View
        style={{
          width: bodyW,
          height: capH,
          backgroundColor: accent,
          opacity: 0.45,
          borderTopLeftRadius: s(6, scale),
          borderTopRightRadius: s(6, scale),
          marginTop: s(2, scale),
        }}
      />
      <View
        style={[
          bottleStyles.bodyBase,
          {
            width: bodyW,
            height: bodyH,
            borderBottomLeftRadius: bodyRadius,
            borderBottomRightRadius: bodyRadius,
          },
        ]}
      >
        <View
          style={{
            position: 'absolute',
            left: s(2, scale),
            top: s(8, scale),
            width: s(2, scale),
            height: s(30, scale),
            borderRadius: s(1, scale),
            backgroundColor: 'rgba(255,255,255,0.48)',
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: s(22, scale),
            left: s(4, scale),
            right: s(4, scale),
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: s(16, scale),
              height: s(16, scale),
              borderRadius: s(8, scale),
              backgroundColor: accent,
              opacity: 0.13,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
          <View style={{ position: 'absolute', alignItems: 'center' }}>
            <Typography
              variant="overline"
              style={{
                fontSize: s(5, scale),
                color: accent,
                opacity: 0.75,
                lineHeight: s(7, scale),
              }}
            >
              SPF
            </Typography>
            <Typography
              variant="overline"
              style={{
                fontSize: s(4.5, scale),
                color: accent,
                opacity: 0.65,
                lineHeight: s(6, scale),
              }}
            >
              50+
            </Typography>
          </View>
        </View>
      </View>
    </View>
  );
}

function CleanserBottle({
  accent,
  scale,
}: {
  accent: string;
  scale: number;
}): React.ReactElement {
  const bodyW = s(28, scale);
  const bodyH = s(42, scale);

  return (
    <View style={[bottleStyles.col, { height: s(84, scale), width: s(48, scale) }]}>
      <View
        style={{
          width: s(14, scale),
          height: s(8, scale),
          backgroundColor: accent,
          opacity: 0.4,
          borderRadius: s(4, scale),
          marginTop: s(6, scale),
        }}
      />
      <View
        style={{
          width: bodyW - s(6, scale),
          height: s(8, scale),
          backgroundColor: 'rgba(255,255,255,0.75)',
          borderRadius: s(4, scale),
        }}
      />
      <View
        style={[
          bottleStyles.bodyBase,
          {
            width: bodyW,
            height: bodyH,
            borderRadius: s(10, scale),
          },
        ]}
      >
        <View
          style={{
            position: 'absolute',
            left: s(3, scale),
            top: s(7, scale),
            width: s(3, scale),
            height: s(24, scale),
            borderRadius: s(1.5, scale),
            backgroundColor: 'rgba(255,255,255,0.43)',
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: s(18, scale),
            height: s(10, scale),
            backgroundColor: accent,
            opacity: 0.1,
          }}
        />
      </View>
    </View>
  );
}

export function ProductBottle({
  category,
  accentColor = DEFAULT_ACCENT,
  size = 'sm',
}: ProductBottleProps): React.ReactElement {
  const scale = size === 'lg' ? 1.55 : 1;

  switch (category) {
    case 'serum':
    case 'treatment':
    case 'eye-care':
      return <SerumBottle accent={accentColor} scale={scale} />;
    case 'toner':
      return <TonerBottle accent={accentColor} scale={scale} />;
    case 'moisturizer':
    case 'mask':
      return <MoisturizerJar accent={accentColor} scale={scale} />;
    case 'sunscreen':
      return <SunscreenTube accent={accentColor} scale={scale} />;
    case 'cleanser':
      return <CleanserBottle accent={accentColor} scale={scale} />;
    default:
      return <SerumBottle accent={accentColor} scale={scale} />;
  }
}

const bottleStyles = StyleSheet.create({
  col: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bodyBase: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    overflow: 'hidden',
  },
});
