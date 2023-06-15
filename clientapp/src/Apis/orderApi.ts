
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl:  "http://localhost:5000/api/",
  }),
  tagTypes:["Orders"],
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderDetails) => ({
        url: "order",
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: orderDetails,
      }),
      invalidatesTags: ["Orders"],
    }),
    getAllOrders: builder.query({
      query: (userId) => ({
        url: "order",
        params: {
          userId: userId,
        },
      }),
      providesTags: ["Orders"],
    }),
    getOrderDetails: builder.query({
      query: (id) => ({
        url: `order/${id}`,
      }),
      providesTags: ["Orders"],
    }),
    getTotalAmountPerWeek: builder.query({
      query: () => ({
        url: "order/total-amount-per-week",
      })
    }),

    
  }),
});


export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderDetailsQuery,
  useGetTotalAmountPerWeekQuery
} = orderApi;
export default orderApi;