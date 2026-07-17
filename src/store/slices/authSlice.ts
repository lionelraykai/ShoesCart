import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AuthUser } from '@/types';
import { generateId } from '@/utils/id';

export interface AuthState {
  users: AuthUser[];
  currentUserId: string | null;
}

// Seeded so the app is explorable without signing up first. Passwords are
// SHA-256("admin123") / SHA-256("user123") — see src/utils/hash.ts.
const initialState: AuthState = {
  users: [
    {
      id: 'demo_admin',
      name: 'Demo Admin',
      email: 'admin@shoecart.app',
      passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
      role: 'admin',
    },
    {
      id: 'demo_user',
      name: 'Demo Shopper',
      email: 'user@shoecart.app',
      passwordHash: 'e606e38b0d8c19b24cf0ee3808183162ea7cd63ff7912dbb22b5e803286b4446',
      role: 'user',
    },
  ],
  currentUserId: null,
};

export type NewAccount = { name: string; email: string; passwordHash: string };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signUp: {
      reducer(state, action: PayloadAction<AuthUser>) {
        state.users.push(action.payload);
        state.currentUserId = action.payload.id;
      },
      prepare({ name, email, passwordHash }: NewAccount) {
        return {
          payload: {
            id: generateId('user'),
            name,
            email,
            passwordHash,
            role: 'user',
          } satisfies AuthUser,
        };
      },
    },
    logIn(state, action: PayloadAction<string>) {
      state.currentUserId = action.payload;
    },
    logOut(state) {
      state.currentUserId = null;
    },
  },
});

export const { signUp, logIn, logOut } = authSlice.actions;
export default authSlice.reducer;
