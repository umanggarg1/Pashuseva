import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({ ...action.payload, qty: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    updateQty: (state, action) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) item.qty = Math.max(1, action.payload.qty);
    },
    clearCart: (state) => { state.items = []; },
  },
});

export const { addToCart, removeFromCart, updateQty, clearCart } = cartSlice.actions;
export const selectCart = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.items.reduce((s, i) => s + i.qty, 0);
export const selectCartTotal = (state) => state.cart.items.reduce((s, i) => s + i.price * i.qty, 0);
export default cartSlice.reducer;
