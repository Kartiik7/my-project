import { createSlice } from '@reduxjs/toolkit';

// Initial state for the cart
const initialState = {
  items: [], // Array of cart items
  totalQuantity: 0,
  totalAmount: 0
};

// Create cart slice with Redux Toolkit
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add item to cart
    addItemToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      
      state.totalQuantity++;
      
      if (!existingItem) {
        // If item doesn't exist in cart, add it
        state.items.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price
        });
      } else {
        // If item exists, increase quantity
        existingItem.quantity++;
        existingItem.totalPrice = existingItem.totalPrice + newItem.price;
      }
      
      // Update total amount
      state.totalAmount += newItem.price;
    },
    
    // Remove item from cart
    removeItemFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        state.totalQuantity--;
        state.totalAmount -= existingItem.price;
        
        if (existingItem.quantity === 1) {
          // Remove item completely if quantity is 1
          state.items = state.items.filter(item => item.id !== id);
        } else {
          // Decrease quantity
          existingItem.quantity--;
          existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
        }
      }
    },
    
    // Update item quantity directly
    updateItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem && quantity > 0) {
        // Calculate difference for total quantity and amount
        const quantityDifference = quantity - existingItem.quantity;
        
        state.totalQuantity += quantityDifference;
        state.totalAmount += quantityDifference * existingItem.price;
        
        // Update item
        existingItem.quantity = quantity;
        existingItem.totalPrice = existingItem.price * quantity;
      } else if (existingItem && quantity === 0) {
        // Remove item if quantity is set to 0
        state.totalQuantity -= existingItem.quantity;
        state.totalAmount -= existingItem.totalPrice;
        state.items = state.items.filter(item => item.id !== id);
      }
    },
    
    // Clear entire cart
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    }
  }
});

// Export actions
export const { 
  addItemToCart, 
  removeItemFromCart, 
  updateItemQuantity, 
  clearCart 
} = cartSlice.actions;

// Export reducer
export default cartSlice.reducer;