import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Item, CartItem } from '@randostore/types';

interface CartStore {
  cart: CartItem[];
  totalItems: number;
  totalPrice: number;
  
  addToCart: (item: Item) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (itemId: number) => boolean;
  getItemQuantity: (itemId: number) => number;
}

const calculateTotals = (cart: CartItem[]) => {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (parseFloat(item.item.price) * item.quantity), 0);
  return { totalItems, totalPrice };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      totalItems: 0,
      totalPrice: 0,

      addToCart: (item: Item) => {
        const cart = get().cart;
        const existing = cart.find(cartItem => cartItem.item.id === item.id);
        
        if (existing) {
          // Increase quantity by 1
          const newCart = cart.map(cartItem =>
            cartItem.item.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
          const { totalItems, totalPrice } = calculateTotals(newCart);
          set({ cart: newCart, totalItems, totalPrice });
        } else {
          // Add new item
          const newCart = [...cart, { item, quantity: 1 }];
          const { totalItems, totalPrice } = calculateTotals(newCart);
          set({ cart: newCart, totalItems, totalPrice });
        }
      },

      removeFromCart: (itemId: number) => {
        const newCart = get().cart.filter(cartItem => cartItem.item.id !== itemId);
        const { totalItems, totalPrice } = calculateTotals(newCart);
        set({ cart: newCart, totalItems, totalPrice });
      },

      updateQuantity: (itemId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(itemId);
          return;
        }

        const newCart = get().cart.map(cartItem =>
          cartItem.item.id === itemId
            ? { ...cartItem, quantity }
            : cartItem
        );
        const { totalItems, totalPrice } = calculateTotals(newCart);
        set({ cart: newCart, totalItems, totalPrice });
      },

      clearCart: () => {
        set({ cart: [], totalItems: 0, totalPrice: 0 });
      },

      isInCart: (itemId: number) => {
        return get().cart.some(cartItem => cartItem.item.id === itemId);
      },

      getItemQuantity: (itemId: number) => {
        const item = get().cart.find(cartItem => cartItem.item.id === itemId);
        return item ? item.quantity : 0;
      },
    }),
    {
      name: 'randostore-cart',
    }
  )
);