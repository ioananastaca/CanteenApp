
import { foodItemReducer } from "./foodItemSlice";

import { authApi, foodItemApi, orderApi, paymentApi, shoppingCartApi } from "../../Apis";
import { configureStore } from "@reduxjs/toolkit";
import { shoppingCartReducer } from "./shoppingCartSlice";
import { userAuthReducer } from "./userAuthSlice";

const store = configureStore({
  reducer: {
    foodItemStore: foodItemReducer,
    shoppingCartStore: shoppingCartReducer,
    userAuthStore: userAuthReducer,
   [foodItemApi.reducerPath]: foodItemApi.reducer,
   [shoppingCartApi.reducerPath]:shoppingCartApi.reducer,
   [authApi.reducerPath]: authApi.reducer,
   [paymentApi.reducerPath]: paymentApi.reducer,
   [orderApi.reducerPath]: orderApi.reducer,
  },
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
      .concat(foodItemApi.middleware)
      .concat(authApi.middleware)
      .concat(orderApi.middleware)
      .concat(paymentApi.middleware)
      .concat(shoppingCartApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export default store;