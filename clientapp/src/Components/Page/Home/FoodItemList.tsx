import React, { useState, useEffect } from "react";
import { foodModel, userModel } from "../../../Interfaces";
import FoodItemCart from "./FoodItemCart";
import { SD_Roles, SD_SortTypes } from "../../../Utility/SD";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { RootState } from "../../../Storage/Redux/store";
import { useSelector } from "react-redux";

function FoodItemList() {
  const [foodItems, setFoodItems] = useState<foodModel[]>([]);
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState<SD_SortTypes>(
    SD_SortTypes.NAME_A_Z
  );
  const [selectedFoodItems, setSelectedFoodItems] = useState<number[]>([]);
  const [showPopup, setShowPopup] = useState(false); // New state for popup visibility

  const sortOptions: SD_SortTypes[] = [
    SD_SortTypes.PRICE_LOW_HIGH,
    SD_SortTypes.PRICE_HIGH_LOW,
    SD_SortTypes.NAME_A_Z,
    SD_SortTypes.NAME_Z_A,
  ];

  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

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
        const uniqueCategories = Array.from(
          new Set<string>(data.map((food: foodModel) => food.categoryName))
        );
        setCategoryList(uniqueCategories);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

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
    }
    return 0;
  });

  const filteredFoodItems = sortedFoodItems.filter((food) => {
    if (selectedCategory && food.categoryName !== selectedCategory) {
      return false;
    }
    if (selectedAllergens.length > 0) {
      return !selectedAllergens.some((allergen) =>
        food.allergenNames.includes(allergen)
      );
    }
    return true;
  });

  if (error) {
    return <div>Error: {error}</div>;
  }

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="container row">
      <div className="my-3">
        <ul className="nav w-100 d-flex justify-content-center">
          {categoryList.map((categoryName, index) => (
            <li className="nav-item" key={index}>
              <button
                className={`nav-link p-0 pb-2 custom-buttons fs-5 btn btn-link ${
                  categoryName === selectedCategory ? "active underline" : ""
                }`}
                onClick={() => handleCategoryClick(categoryName)}
              >
                {categoryName}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="my-3">
        <label className="form-label">Sort by:</label>
        <select
          className="form-select form-select-sm"
          value={sortOption}
          onChange={(e) =>
            handleSortOptionChange(e.target.value as SD_SortTypes)
          }
        >
          {sortOptions.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      {userData.role === SD_Roles.CUTOMER && (
        <div className="my-3">
          <h4>Ce alergeni ai vrea sa eviti?</h4>
          <div className="btn-group" role="group">
            {foodItems
              .flatMap((food) => food.allergenNames)
              .filter(
                (allergen, index, self) => self.indexOf(allergen) === index
              )
              .map((allergen, index) => (
                <button
                  key={index}
                  type="button"
                  className={`btn btn-outline-primary m-2 ${
                    selectedAllergens.includes(allergen) ? "active" : ""
                  }`}
                  onClick={() => handleAllergenChange(allergen)}
                >
                  {allergen}
                  {selectedAllergens.includes(allergen) && (
                    <FontAwesomeIcon icon={faCheck} />
                  )}
                </button>
              ))}
          </div>
        </div>
      )}

      {userData.role === SD_Roles.ADMIN && (
        <div>
          {/* Popup */}
          {showPopup && (
            <div className="popup">
              <h3>Alege Meniul</h3>
              {/* Content */}
              <div className="content">
                {/* Checkbox items */}
                {filteredFoodItems.map((food) => (
                  <div className="form-check" key={food.id}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={food.id}
                      id={`foodItemCheckbox_${food.id}_popup`}
                      checked={selectedFoodItems.includes(food.id)}
                      onChange={() => handleFoodItemCheckboxChange(food.id)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`foodItemCheckbox_${food.id}_popup`}
                    >
                      {food.name}
                    </label>
                  </div>
                ))}
              </div>
              {/* Close button */}
              <button className="close-button" onClick={togglePopup}>
                Close
              </button>
            </div>
          )}
          {/* Button to toggle popup */}
          <button className="btn btn-primary" onClick={togglePopup}>
            Alege Meniul
          </button>
        </div>
      )}
      <div className="row ">
        {filteredFoodItems
          .filter((food) => selectedFoodItems.includes(food.id))
          .map((food) => (
            <div key={food.id}>
              <FoodItemCart foodItem={food} key={food.id} />
            </div>
          ))}
      </div>
    </div>
  );
}

export default FoodItemList;
