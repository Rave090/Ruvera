import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { lightTheme } from './src/theme';
import { Typography } from './src/components/Typography';

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Typography variant="h2" align="center">
          Ruvera
        </Typography>
        <Typography variant="body" color="textSecondary" align="center">
          Foundation ready.
        </Typography>
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: lightTheme.spacing.sm,
  },
});
,