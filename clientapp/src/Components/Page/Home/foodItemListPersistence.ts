import { foodModel } from "../../../Interfaces";

const FOOD_ITEMS_KEY = "foodItems";

export function saveFoodItems(foodItems: foodModel[]) {
  localStorage.setItem(FOOD_ITEMS_KEY, JSON.stringify(foodItems));
}

export function loadFoodItems(): foodModel[] {
  const storedFoodItems = localStorage.getItem(FOOD_ITEMS_KEY);
  if (storedFoodItems) {
    return JSON.parse(storedFoodItems);
  } else {
    return [];
  }
}
