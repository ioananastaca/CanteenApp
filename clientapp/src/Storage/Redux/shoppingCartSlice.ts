import { createSlice } from "@reduxjs/toolkit";
import { shoppingCartModel } from "../../Interfaces";

const initialState: shoppingCartModel = {
  cartItems: [],
};

export const shoppingCartSlice = createSlice({
  name: "cartItems",
  initialState: initialState,
  reducers: {
    setShoppingCart: (state, action) => {
      state.cartItems = action.payload;
    },
    updateQuantity: (state, action) => {
      // payload - cart item that needs to be updated, new quantity
      state.cartItems = state.cartItems?.map((item) => {
        if (item.id === action.payload.cartItem.id) {
          item.quantity = action.payload.quantity;
        }
        return item;
      });
    },
    removeFromCart: (state, action) => {
      // payload - cart item that needs to be removed
      state.cartItems = state.cartItems?.filter((item) => {
        return item.id !== action.payload.cartItem.id;
      });
    },
    
    clearShoppingCart: (state) => {
      state.cartItems = [];
    
    },
  },
});

export const {
  setShoppingCart,
  updateQuantity,
  removeFromCart,
  clearShoppingCart,
} = shoppingCartSlice.actions;

export const shoppingCartReducer = shoppingCartSlice.reducer;
