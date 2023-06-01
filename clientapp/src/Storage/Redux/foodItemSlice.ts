import { createSlice } from "@reduxjs/toolkit";

const initialState={
    foodItem:[],
    search:""
};

export const foodItemSlice = createSlice({
    name: "FoodItem",
    initialState: initialState,
    reducers: {
      setFoodItem: (state, action) => {
        state.foodItem = action.payload;
      },
      setSearchItem: (state, action) => {
        state.search = action.payload;
      },
    },
  });
  
  export const { setFoodItem,setSearchItem } = foodItemSlice.actions;
  export const foodItemReducer = foodItemSlice.reducer;