import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '@components/Typography';
import { Button } from '@components/Button';
import { lightTheme } from '@theme';

const { colors, spacing } = lightTheme;

const ROSE = '#5C2B3E';
const SUCCESS = '#4caf7d';

interface SummaryRow {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

export default function OrderConfirmedScreen(): React.ReactElement {
  const router = useRouter();
  const { total } = useLocalSearchParams<{ total: string }>();
  const displayTotal = parseInt(total ?? '0', 10);

  const orderId = `#RVR-${Math.floor(10000 + Math.random() * 89999)}`;

  const summaryRows: SummaryRow[] = [
    { icon: 'cube-outline', label: 'Order ID', value: orderId },
    { icon: 'bicycle-outline', label: 'Estimated Delivery', value: '3–5 business days' },
    { icon: 'location-outline', label: 'Deliver to', value: 'Home · Mumbai' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Success badge */}
        <View style={styles.successBadge}>
          <Ionicons name="checkmark" size={46} color="#fff" />
        </View>

        <Typography variant="h2" weight="bold" color="textPrimary" align="center" style={styles.headline}>
          Order Placed!
        </Typography>
        <Typography variant="body" color="textSecondary" align="center" style={styles.sub}>
          Your skincare is on its way
        </Typography>
        <View style={styles.totalPill}>
          <Typography variant="label" weight="semibold" style={{ color: '#fff' }}>
            ₹{displayTotal} paid
          </Typography>
        </View>

        {/* Order card */}
        <View style={styles.orderCard}>
          {summaryRows.map(row => (
            <View key={row.label} style={styles.orderRow}>
              <View style={styles.orderRowIcon}>
                <Ionicons name={row.icon} size={18} color={ROSE} />
              </View>
              <View style={styles.orderRowText}>
                <Typography variant="caption" color="textSecondary" weight="semibold">
                  {row.label}
                </Typography>
                <Typography variant="label" weight="semibold" color="textPrimary">
                  {row.value}
                </Typography>
              </View>
            </View>
          ))}
        </View>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          label="Continue Shopping"
          onPress={() => router.replace('/(user)/products' as never)}
          style={styles.continueBtn}
        />
        <Button
          variant="ghost"
          size="md"
          label="Track my order"
          onPress={() => router.replace('/(user)/orders' as never)}
          style={styles.trackBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  successBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: SUCCESS,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    shadowColor: SUCCESS,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  headline: {
    marginBottom: spacing.xs,
  },
  sub: {
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  totalPill: {
    backgroundColor: ROSE,
    borderRadius: 20,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    marginBottom: spacing.xxl,
  },
  orderCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 4,
    gap: 12,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  orderRowIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5E8EA',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  orderRowText: {
    gap: 2,
  },
  continueBtn: {
    width: '100%',
    shadowColor: ROSE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
    marginBottom: spacing.sm,
  },
  trackBtn: {
    width: '100%',
  },
});
