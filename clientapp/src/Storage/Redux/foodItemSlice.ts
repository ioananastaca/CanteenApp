import { createSlice } from "@reduxjs/toolkit";

const initialState={
    foodItem:[]
};

export const foodItemSlice = createSlice({
    name: "FoodItem",
    initialState: initialState,
    reducers: {
      setFoodItem: (state, action) => {
        state.foodItem = action.payload;
      },
    },
  });
  
  export const { setFoodItem } = foodItemSlice.actions;
  export const foodItemReducer = foodItemSlice.reducer;