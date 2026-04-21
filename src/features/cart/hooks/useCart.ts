import { useCartStore, selectCartItems, selectCartSummary, selectCartItemCount } from '@store/cart.store';
import type { Product } from '@features/product/types';

export function useCart() {
  const items = useCartStore(selectCartItems);
  const summary = useCartStore(selectCartSummary);
  const itemCount = useCartStore(selectCartItemCount);
  const addItem = useCartStore(s => s.addItem);
  const removeItem = useCartStore(s => s.removeItem);
  const updateQuantity = useCartStore(s => s.updateQuantity);
  const clearCart = useCartStore(s => s.clearCart);

  const isInCart = (productId: string) =>
    items.some(i => i.product.id === productId);

  const getQuantity = (productId: string) =>
    items.find(i => i.product.id === productId)?.quantity ?? 0;

  const addToCart = (product: Product) => addItem(product, 1);

  return {
    items,
    summary,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getQuantity,
    addToCart,
  };
}
