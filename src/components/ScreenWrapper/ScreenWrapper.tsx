import React from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ViewStyle,
  StyleProp,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { lightTheme } from '@theme';

interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;
  keyboardAware?: boolean;
  padHorizontal?: boolean;
  padBottom?: boolean;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

const { colors, spacing } = lightTheme;

function ScreenWrapper({
  children,
  scrollable = false,
  keyboardAware = false,
  padHorizontal = true,
  padBottom = true,
  backgroundColor = colors.background,
  style,
  contentContainerStyle,
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();

  const paddingStyle: ViewStyle = {
    paddingTop: insets.top,
    paddingBottom: padBottom ? insets.bottom + spacing.lg : insets.bottom,
    paddingLeft: padHorizontal ? spacing.lg : 0,
    paddingRight: padHorizontal ? spacing.lg : 0,
    backgroundColor,
  };

  const inner = scrollable ? (
    <ScrollView
      style={[styles.fill, { backgroundColor }]}
      contentContainerStyle={[paddingStyle, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.fill, paddingStyle, style]}>{children}</View>
  );

  if (keyboardAware) {
    return (
      <KeyboardAvoidingView
        style={[styles.fill, { backgroundColor }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor={backgroundColor}
          translucent={false}
        />
        {inner}
      </KeyboardAvoidingView>
    );
  }

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={backgroundColor}
        translucent={false}
      />
      {inner}
    </>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});

export default ScreenWrapper;
