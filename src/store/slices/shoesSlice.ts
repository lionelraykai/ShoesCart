import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { seedShoes } from '@/store/seedShoes';
import { Shoe } from '@/types';
import { generateId } from '@/utils/id';

export interface ShoesState {
  items: Shoe[];
}

const initialState: ShoesState = {
  items: seedShoes,
};

export type NewShoe = Omit<Shoe, 'id' | 'createdAt'>;

const shoesSlice = createSlice({
  name: 'shoes',
  initialState,
  reducers: {
    addShoe: {
      reducer(state, action: PayloadAction<Shoe>) {
        state.items.push(action.payload);
      },
      prepare(newShoe: NewShoe) {
        return {
          payload: {
            ...newShoe,
            id: generateId('shoe'),
            createdAt: Date.now(),
          } satisfies Shoe,
        };
      },
    },
    updateShoe(state, action: PayloadAction<Shoe>) {
      const index = state.items.findIndex((shoe) => shoe.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteShoe(state, action: PayloadAction<string>) {
      state.items = state.items.filter((shoe) => shoe.id !== action.payload);
    },
  },
});

export const { addShoe, updateShoe, deleteShoe } = shoesSlice.actions;
export default shoesSlice.reducer;
