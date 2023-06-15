import React, { useState, useEffect } from "react";
import { foodModel } from "../../../Interfaces";

function DailyMenuPage() {
  const [foodItems, setFoodItems] = useState<foodModel[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<foodModel[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/Food")
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

  const handleFoodItemToggle = (foodItem: foodModel) => {
    if (selectedFoods.includes(foodItem)) {
      setSelectedFoods(selectedFoods.filter((item) => item !== foodItem));
    } else {
      setSelectedFoods([...selectedFoods, foodItem]);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Group food items by category
  const groupedFoodItems: { [key: string]: foodModel[] } = {};
  foodItems.forEach((foodItem) => {
    if (!groupedFoodItems[foodItem.categoryName]) {
      groupedFoodItems[foodItem.categoryName] = [];
    }
    groupedFoodItems[foodItem.categoryName].push(foodItem);
  });

  return (
    <div>
      <h1>Daily Menu</h1>
      {Object.entries(groupedFoodItems).map(([category, foods]) => (
        <div className="category-container" key={category}>
          <h2 className="category-header">{category}</h2>
          <div className="food-items">
            {foods.map((foodItem) => (
              <div className="food-item-cart" key={foodItem.id}>
                <input
                  type="checkbox"
                  checked={selectedFoods.includes(foodItem)}
                  onChange={() => handleFoodItemToggle(foodItem)}
                />
                <div className="food-item-details">
                  <div className="food-item-name">{foodItem.name}</div>
                  <div className="food-item-allergens">
                    <strong>Allergens:</strong> {foodItem.allergenNames.join(", ")}
                  </div>
                </div>
                <div className="food-item-image">
                  <img src={foodItem.imageUrl} alt={foodItem.name} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default DailyMenuPage;
