import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

const foodItemApi = createApi({
    reducerPath: "foodItemApi",
    baseQuery: fetchBaseQuery({
      baseUrl: "http://localhost:5000/api/Food/",
    }),
    tagTypes: ["FoodItems"],
    endpoints: (builder) => ({
      getFoodItems: builder.query({
        query: () => ({
          url: "GetAll",
        }),
        providesTags: ["FoodItems"],
      }),
      getFoodItemById: builder.query({
        query: (id) => ({
          url: `ById${id}`,
        }),
        providesTags: ["FoodItems"],
      }),
    }),
  });
  
  export const { useGetFoodItemsQuery, useGetFoodItemByIdQuery} = foodItemApi;
  export default foodItemApi;