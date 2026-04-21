import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import { Typography } from '@components/Typography';
import { lightTheme } from '@theme';

const { colors, spacing } = lightTheme;

export default function NotFound() {
  return (
    <View style={styles.container}>
      <Typography variant="h2" align="center">
        Screen not found
      </Typography>
      <Link href="/(auth)/login" style={styles.link}>
        <Typography variant="body" color="primary">
          Go to Login
        </Typography>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  link: {
    marginTop: spacing.lg,
  },
});
