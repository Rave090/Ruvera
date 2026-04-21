import React from 'react';
import { View, ViewStyle } from 'react-native';

interface BrandIconProps {
  size?: number;
  color?: string;
}

function BrandIcon({ size = 40, color = '#5C2B3E' }: BrandIconProps) {
  const lw = size * 0.28;
  const lh = size * 0.54;
  const radius = lw * 0.6;

  const leaf: ViewStyle = {
    position: 'absolute',
    width: lw,
    height: lh,
    borderTopLeftRadius: radius,
    borderTopRightRadius: radius,
    borderBottomLeftRadius: lw * 0.3,
    borderBottomRightRadius: lw * 0.3,
    backgroundColor: color,
  };

  const cx = (size - lw) / 2;
  const base = size - lh * 0.45;

  return (
    <View style={{ width: size, height: size }}>
      {/* Left leaf */}
      <View
        style={[
          leaf,
          {
            left: cx - lw * 0.75,
            top: base - lh,
            transform: [{ rotate: '-30deg' }],
          },
        ]}
      />
      {/* Centre leaf — tallest */}
      <View
        style={[
          leaf,
          {
            left: cx,
            top: base - lh - size * 0.07,
          },
        ]}
      />
      {/* Right leaf */}
      <View
        style={[
          leaf,
          {
            left: cx + lw * 0.75,
            top: base - lh,
            transform: [{ rotate: '30deg' }],
          },
        ]}
      />
    </View>
  );
}

export default BrandIcon;
