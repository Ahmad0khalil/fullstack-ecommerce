import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  product_id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
};

type CartStore = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (item) =>
        set((state) => {
          console.log("Adding to cart:", item);
          const existing = state.cart.find(
            (i) => i.product_id === item.product_id
          );

          if (existing) {
            return {
              cart: state.cart.map((i) =>
                i.product_id === item.product_id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }

          return {
            cart: [...state.cart, { ...item, quantity: 1 }],
          };
        }),

      removeFromCart: (id) => {
        console.log("Removing from cart:", id);
        set((state) => ({
          cart: state.cart.filter((i) => i.product_id !== id),
        }))
      },

      increaseQty: (id) => {
        console.log("Increasing quantity:", id);
        set((state) => ({
          cart: state.cart.map((i) =>
            i.product_id === id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }))},

      decreaseQty: (id) => {
        console.log("Decreasing quantity:", id);
        set((state) => ({
          cart: state.cart
            .map((i) =>
              i.product_id === id
                ? { ...i, quantity: i.quantity - 1 }
                : i
            )
            .filter((i) => i.quantity > 0),
        }))},

      clearCart: () => set({ cart: [] }),

      getTotalItems: () =>
        get().cart.reduce((acc, item) => acc + item.quantity, 0),

      getTotalPrice: () =>
        get().cart.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        ),
    }),
    {
      name: "cart-storage",
    }
  )
);