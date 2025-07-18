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