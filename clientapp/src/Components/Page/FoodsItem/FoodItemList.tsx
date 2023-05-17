import React, { useState, useEffect } from "react";
import { foodModel } from "../../../Interfaces";
import FoodItemCart from "./FoodItemCart";

function FoodItemList() {
  const [foodItems, setFoodItems] = useState<foodModel[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/Food/GetAll")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch food items");
        }
        return response.json();
      })
      .then((data) => {
        setFoodItems(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container row">
      {foodItems.map((menuItem) => (
        <FoodItemCart foodItem={menuItem} key={menuItem.id} />
      ))}
    </div>
  );
}

export default FoodItemList;