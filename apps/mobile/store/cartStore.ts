// src/store/cartStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Item, CartStore } from "@randostore/types";

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: {
        items: [],
        totalItems: 0,
        totalPrice: 0,
      },

      addItem: (item: Item) => {
        const { items } = get().cart;
        const idx = items.findIndex((ci) => ci.item.id === item.id);
        const newItems =
          idx >= 0
            ? items.map((ci, i) =>
                i === idx ? { ...ci, quantity: ci.quantity + 1 } : ci
              )
            : [...items, { item, quantity: 1 }];

        const totalItems = newItems.reduce((sum, ci) => sum + ci.quantity, 0);
        const totalPrice = newItems.reduce(
          (sum, ci) => sum + parseFloat(ci.item.price) * ci.quantity,
          0
        );

        set({ cart: { items: newItems, totalItems, totalPrice } });
      },

      removeItem: (id: number) => {
        const newItems = get().cart.items.filter((ci) => ci.item.id !== id);
        const totalItems = newItems.reduce((sum, ci) => sum + ci.quantity, 0);
        const totalPrice = newItems.reduce(
          (sum, ci) => sum + parseFloat(ci.item.price) * ci.quantity,
          0
        );
        set({ cart: { items: newItems, totalItems, totalPrice } });
      },

      updateQuantity: (id: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        const newItems = get().cart.items.map((ci) =>
          ci.item.id === id ? { ...ci, quantity } : ci
        );
        const totalItems = newItems.reduce((sum, ci) => sum + ci.quantity, 0);
        const totalPrice = newItems.reduce(
          (sum, ci) => sum + parseFloat(ci.item.price) * ci.quantity,
          0
        );
        set({ cart: { items: newItems, totalItems, totalPrice } });
      },

      clearCart: () => {
        set({ cart: { items: [], totalItems: 0, totalPrice: 0 } });
      },

      getTotalPrice: () => get().cart.totalPrice,

      getCartCount: () => get().cart.totalItems,

      // ← NEW: returns quantity or 0
      getItemQuantity: (id: number) => {
        const entry = get().cart.items.find((ci) => ci.item.id === id);
        return entry ? entry.quantity : 0;
      },

      // ← NEW: true if in cart
      isInCart: (id: number) => {
        return get().cart.items.some((ci) => ci.item.id === id);
      },
    }),
    {
      name: "randostore-cart",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
