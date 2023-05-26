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
  }),
});

  export const { useGetFoodItemsQuery, useGetFoodItemByIdQuery} = foodItemApi;
  export default foodItemApi;