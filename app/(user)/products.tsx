import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
  ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '@components/Typography';
import { lightTheme } from '@theme';
import { useProductList } from '@features/product/hooks/useProductList';
import { useProductStore, selectFavoriteIds } from '@store/product.store';
import { useCartStore, selectCartItemCount } from '@store/cart.store';
import { AiMatchPill } from '@features/product/components/AiMatchPill';
import { FeaturedCard } from '@features/product/components/FeaturedCard';
import { ProductListItem } from '@features/product/components/ProductListItem';
import type { Product, ProductCategory } from '@features/product/types';

const { colors, spacing, borderRadius } = lightTheme;

interface CategoryTab {
  label: string;
  value: ProductCategory | 'all';
}

const CATEGORY_TABS: CategoryTab[] = [
  { label: 'All', value: 'all' },
  { label: 'Serums', value: 'serum' },
  { label: 'Toners', value: 'toner' },
  { label: 'Moisturisers', value: 'moisturizer' },
  { label: 'Sunscreen', value: 'sunscreen' },
];

function CartBadge({ count, onPress }: { count: number; onPress: () => void }): React.ReactElement {
  return (
    <Pressable
      onPress={onPress}
      style={styles.cartBtn}
      accessibilityRole="button"
      accessibilityLabel={`Cart, ${count} items`}
    >
      <Ionicons name="bag-outline" size={20} color={colors.primary} />
      {count > 0 && (
        <View style={styles.cartBadge}>
          <Typography variant="overline" style={styles.cartBadgeText}>
            {count > 99 ? '99+' : count}
          </Typography>
        </View>
      )}
    </Pressable>
  );
}

function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}): React.ReactElement {
  const inputRef = useRef<TextInput>(null);
  return (
    <Pressable onPress={() => inputRef.current?.focus()} style={styles.searchBar}>
      <Ionicons name="search-outline" size={16} color={colors.textSecondary} />
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChange}
        placeholder="Search products, brands…"
        placeholderTextColor={colors.textDisabled}
        style={styles.searchInput}
        returnKeyType="search"
        clearButtonMode="while-editing"
        accessibilityLabel="Search products"
      />
    </Pressable>
  );
}

export default function ProductsScreen(): React.ReactElement {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');

  const favoriteIds = useProductStore(selectFavoriteIds);
  const toggleFavorite = useProductStore(s => s.toggleFavorite);
  const cartCount = useCartStore(selectCartItemCount);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const listParams = React.useMemo(
    () => ({
      query: debouncedSearch || undefined,
      filters:
        activeCategory !== 'all' ? { category: activeCategory as ProductCategory } : undefined,
    }),
    [debouncedSearch, activeCategory],
  );

  const { products, isLoading, isLoadingMore, refresh, loadMore, hasNextPage } =
    useProductList(listParams);

  const featuredProducts = products.filter(p => p.isTrending).slice(0, 3);

  const navigateToProduct = useCallback(
    (product: Product) => {
      router.push({ pathname: '/(user)/product/[id]', params: { id: product.id } });
    },
    [router],
  );

  const navigateToCart = useCallback(() => router.push('/(user)/cart'), [router]);

  const renderProduct = useCallback(
    ({ item }: ListRenderItemInfo<Product>) => (
      <ProductListItem
        product={item}
        isFavorite={favoriteIds.has(item.id)}
        onPress={() => navigateToProduct(item)}
        onToggleFavorite={() => toggleFavorite(item.id)}
      />
    ),
    [favoriteIds, toggleFavorite, navigateToProduct],
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  const ListHeader = (
    <View>
      <AiMatchPill matchCount={12} skinProfile="Combination" onPress={() => {}} />
      {activeCategory === 'all' && featuredProducts.length > 0 && (
        <View style={styles.featuredSection}>
          <View style={styles.sectionRow}>
            <Typography variant="label" weight="semibold" color="textPrimary">Featured</Typography>
            <Typography variant="caption" style={styles.seeAll}>See all</Typography>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredScroll}
          >
            {featuredProducts.map(p => (
              <FeaturedCard key={p.id} product={p} onPress={() => navigateToProduct(p)} />
            ))}
          </ScrollView>
        </View>
      )}
      <View style={styles.sectionTitleRow}>
        <Typography variant="label" weight="semibold" color="textPrimary">
          {activeCategory === 'all'
            ? 'All Products'
            : `${products.length} product${products.length !== 1 ? 's' : ''} in ${
                CATEGORY_TABS.find(c => c.value === activeCategory)?.label ?? ''
              }`}
        </Typography>
      </View>
    </View>
  );

  const ListFooter = isLoadingMore ? (
    <View style={styles.loadingMore}>
      <ActivityIndicator size="small" color={colors.primary} />
    </View>
  ) : null;

  const ListEmpty = !isLoading ? (
    <View style={styles.emptyState}>
      <Ionicons name="flask-outline" size={40} color={colors.textDisabled} />
      <Typography variant="body" color="textSecondary" align="center" style={styles.emptyText}>
        No products found
      </Typography>
    </View>
  ) : null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View>
              <Typography variant="overline" style={styles.overline}>Your Ritual</Typography>
              <Typography variant="h2" weight="bold" color="textPrimary" style={styles.title}>
                Shop
              </Typography>
            </View>
            <CartBadge count={cartCount} onPress={navigateToCart} />
          </View>
          <SearchBar value={search} onChange={setSearch} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {CATEGORY_TABS.map(tab => {
              const isActive = activeCategory === tab.value;
              return (
                <Pressable
                  key={tab.value}
                  onPress={() => setActiveCategory(tab.value)}
                  style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                >
                  <Typography
                    variant="caption"
                    weight="semibold"
                    style={[styles.categoryLabel, isActive && styles.categoryLabelActive]}
                  >
                    {tab.label}
                  </Typography>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {isLoading && products.length === 0 ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={keyExtractor}
            renderItem={renderProduct}
            ListHeaderComponent={ListHeader}
            ListFooterComponent={ListFooter}
            ListEmptyComponent={ListEmpty}
            contentContainerStyle={styles.listContent}
            onEndReached={hasNextPage ? loadMore : undefined}
            onEndReachedThreshold={0.4}
            refreshing={isLoading}
            onRefresh={refresh}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews
          />
        )}
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
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.background,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  overline: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    color: colors.primaryLight,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  cartBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 2,
    borderColor: colors.background,
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    lineHeight: 13,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: 13,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'System',
    paddingVertical: 0,
  },
  categoryScroll: {
    gap: 6,
    paddingBottom: spacing.lg,
  },
  categoryPill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  categoryPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  categoryLabel: {
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
  categoryLabelActive: {
    color: colors.textOnPrimary,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  seeAll: {
    color: colors.primary,
    fontWeight: '600',
  },
  featuredSection: {
    marginBottom: 20,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  featuredScroll: {
    gap: 12,
    paddingRight: spacing.xs,
  },
  sectionTitleRow: {
    marginBottom: 12,
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingMore: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  emptyState: {
    paddingTop: spacing.xxxl,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: spacing.sm,
  },
});
