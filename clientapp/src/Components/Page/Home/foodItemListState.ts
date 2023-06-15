import { useState, useEffect } from "react";
import { foodModel } from "../../../Interfaces";
import { saveFoodItems, loadFoodItems } from "./foodItemListPersistence";
import { SD_SortTypes } from "../../../Utility/SD";

export function useFoodItemList() {
  const [foodItems, setFoodItems] = useState<foodModel[]>([]);
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState<SD_SortTypes>(
    SD_SortTypes.NAME_A_Z
  );
  const [selectedFoodItems, setSelectedFoodItems] = useState<number[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  const sortOptions: SD_SortTypes[] = [
    SD_SortTypes.PRICE_LOW_HIGH,
    SD_SortTypes.PRICE_HIGH_LOW,
    SD_SortTypes.NAME_A_Z,
    SD_SortTypes.NAME_Z_A,
  ];

  useEffect(() => {
    const loadedFoodItems = loadFoodItems();
    setFoodItems(loadedFoodItems);
    const uniqueCategories = Array.from(
      new Set<string>(loadedFoodItems.map((food: foodModel) => food.categoryName))
    );
    setCategoryList(uniqueCategories);
  }, []);

  useEffect(() => {
    saveFoodItems(foodItems);
  }, [foodItems]);

  const handleCategoryClick = (category: string) => {
    if (category === selectedCategory) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const handleAllergenChange = (allergen: string) => {
    if (selectedAllergens.includes(allergen)) {
      setSelectedAllergens(selectedAllergens.filter((a) => a !== allergen));
    } else {
      setSelectedAllergens([...selectedAllergens, allergen]);
    }
  };

  const handleSortOptionChange = (option: SD_SortTypes) => {
    setSortOption(option);
  };

  const handleFoodItemCheckboxChange = (foodItemId: number) => {
    if (selectedFoodItems.includes(foodItemId)) {
      setSelectedFoodItems(selectedFoodItems.filter((id) => id !== foodItemId));
    } else {
      setSelectedFoodItems([...selectedFoodItems, foodItemId]);
    }
  };

  const sortedFoodItems = foodItems.sort((a, b) => {
    if (sortOption === SD_SortTypes.PRICE_LOW_HIGH) {
      return a.price - b.price;
    } else if (sortOption === SD_SortTypes.PRICE_HIGH_LOW) {
      return b.price - a.price;
    } else if (sortOption === SD_SortTypes.NAME_A_Z) {
      return a.name.localeCompare(b.name);
    } else if (sortOption === SD_SortTypes.NAME_Z_A) {
      return b.name.localeCompare(a.name);
    } else {
      return 0;
    }
  });

  const filteredFoodItems = sortedFoodItems.filter((food: foodModel) => {
    if (selectedCategory && food.categoryName !== selectedCategory) {
      return false;
    }
    if (
      selectedAllergens.length > 0 &&
      !selectedAllergens.every((allergen) =>
        food.allergenNames.includes(allergen)
      )
    ) {
      return false;
    }
    return true;
  });

  const handleAddToCart = () => {
    setShowPopup(true);
  };

  return {
    foodItems: filteredFoodItems,
    categoryList,
    selectedCategory,
    selectedAllergens,
    error,
    sortOption,
    selectedFoodItems,
    showPopup,
    sortOptions,
    handleCategoryClick,
    handleAllergenChange,
    handleSortOptionChange,
    handleFoodItemCheckboxChange,
    handleAddToCart,
  };
}
