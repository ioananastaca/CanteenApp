import React from "react";
import { useParams } from "react-router-dom";
import { useGetFoodItemByIdQuery } from "../../../Apis/foodItemApi";

function UpdateFoodAllergen() {
  const { foodId } = useParams();
  const { data: foodItem, isLoading, isError, error } = useGetFoodItemByIdQuery(foodId);
  console.log(foodItem) 

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching food item.</div>;
  }

  const allergens = foodItem?.allergens || [];

  return (
    <div>
      <h2>Allergens for food with ID {foodId}</h2>
      {allergens.map((allergen: { id: number; name: string }) => (
        <div key={allergen.id}>{allergen.name}</div>
      ))}
    </div>
  );
}

export default UpdateFoodAllergen;
