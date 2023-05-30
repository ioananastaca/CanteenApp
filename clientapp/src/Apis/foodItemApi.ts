import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

const foodItemApi = createApi({
  reducerPath: "foodItemApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/",
  }),
  tagTypes: ["FoodItems"],
  endpoints: (builder) => ({
    getFoodItems: builder.query({
      query: () => ({
        url: "Food",
      }),
      providesTags: ["FoodItems"],
    }),
    getFoodItemById: builder.query({
      query: (id) => ({
        url: `Food/${id}`,
      }),
      providesTags: ["FoodItems"],
    }),
    createFoodItem: builder.mutation({
      query: (data) => ({
        url: "Food",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["FoodItems"],
    }),
    updateFoodItem: builder.mutation({
      query: ({ data, id }) => ({
        url: "Food/" + id,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["FoodItems"],
    }),
    deleteFoodItem: builder.mutation({
      query: (id) => ({
        url: "Food/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["FoodItems"],
    }),
  }),
});

  export const { useGetFoodItemsQuery, useGetFoodItemByIdQuery,  useCreateFoodItemMutation,
    useUpdateFoodItemMutation,
    useDeleteFoodItemMutation} = foodItemApi;
  export default foodItemApi;