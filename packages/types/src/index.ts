export interface Item {
  id: number;
  name: string;
  price: string;
  img: string;
}

export interface CartItem {
  item: Item;
  quantity: number;
}
export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}
export interface CartStore {
  cart: Cart;
  addItem: (item: Item) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity(id: number): number;
  getTotalPrice: () => number;
  getCartCount: () => number;
}
