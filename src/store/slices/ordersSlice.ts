import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Address, Order, OrderItem } from '@/types';
import { generateId } from '@/utils/id';

export interface OrdersState {
  items: Order[];
}

const initialState: OrdersState = {
  items: [],
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    placeOrder: {
      reducer(state, action: PayloadAction<Order>) {
        state.items.unshift(action.payload);
      },
      prepare({ userId, items, address, paymentMethod }: { userId: string; items: OrderItem[]; address: Address; paymentMethod: string }) {
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return {
          payload: {
            id: generateId('order'),
            userId,
            items,
            total,
            address,
            paymentMethod,
            placedAt: Date.now(),
          } satisfies Order,
        };
      },
    },
  },
});

export const { placeOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
