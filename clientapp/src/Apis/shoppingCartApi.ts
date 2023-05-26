import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const shoppingCartApi = createApi({
  reducerPath: "shoppingCartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/",
  }),
  tagTypes: ["ShoppingCarts"],
  endpoints: (builder) => ({
    getShoppingCart: builder.query({
      query: (userId) => ({
        url: `ShoppingCart`,
        params: {
          userId: userId,
        },
      }),
      providesTags: ["ShoppingCarts"],
    }),
    updateShoppingCart: builder.mutation({
      query: ({ userId,foodId, updateQuantityBy }) => ({
        url: "ShoppingCart",
        method: "POST",
        params: {
            userId,
            foodId,
          updateQuantityBy,
          
        },
      }),
      invalidatesTags: ["ShoppingCarts"],
    }),
  }),
});

export const { useGetShoppingCartQuery, useUpdateShoppingCartMutation } =shoppingCartApi;
export default shoppingCartApi;