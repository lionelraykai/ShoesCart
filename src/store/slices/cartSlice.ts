import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CartItem } from '@/types';
import { generateId } from '@/utils/id';

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: {
      reducer(state, action: PayloadAction<CartItem>) {
        const existing = state.items.find(
          (item) => item.shoeId === action.payload.shoeId && item.size === action.payload.size
        );
        if (existing) {
          existing.quantity += action.payload.quantity;
        } else {
          state.items.push(action.payload);
        }
      },
      prepare(input: { shoeId: string; size: number; quantity: number }) {
        return { payload: { ...input, id: generateId('cart') } satisfies CartItem };
      },
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.items.find((entry) => entry.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
