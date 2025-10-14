import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

// Configure store with Redux Toolkit
export const store = configureStore({
  reducer: {
    cart: cartReducer
  },
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;