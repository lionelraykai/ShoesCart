import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  persistReducer,
  persistStore,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';

import storage from '@/store/storage';
import authReducer from '@/store/slices/authSlice';
import cartReducer from '@/store/slices/cartSlice';
import ordersReducer from '@/store/slices/ordersSlice';
import shoesReducer from '@/store/slices/shoesSlice';

const rootReducer = combineReducers({
  shoes: shoesReducer,
  cart: cartReducer,
  orders: ordersReducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(
  {
    key: 'shoecart',
    storage,
    whitelist: ['shoes', 'cart', 'orders', 'auth'],
  },
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
