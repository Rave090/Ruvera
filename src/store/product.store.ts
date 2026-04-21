import { create } from 'zustand';

interface ProductState {
  searchQuery: string;
  favoriteIds: Set<string>;
}

interface ProductActions {
  setSearchQuery: (query: string) => void;
  toggleFavorite: (productId: string) => void;
  setFavoriteIds: (ids: string[]) => void;
}

type ProductStore = ProductState & ProductActions;

export const useProductStore = create<ProductStore>((set, get) => ({
  searchQuery: '',
  favoriteIds: new Set(),

  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleFavorite: (productId) => {
    const next = new Set(get().favoriteIds);
    if (next.has(productId)) {
      next.delete(productId);
    } else {
      next.add(productId);
    }
    set({ favoriteIds: next });
  },

  setFavoriteIds: (ids) => set({ favoriteIds: new Set(ids) }),
}));

export const selectSearchQuery = (s: ProductStore) => s.searchQuery;
export const selectFavoriteIds = (s: ProductStore) => s.favoriteIds;
export const selectIsFavorite = (productId: string) => (s: ProductStore) =>
  s.favoriteIds.has(productId);
