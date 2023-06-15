import React, { useEffect, useState } from "react";
import { inputHelper, toastNotify } from "../../Helper";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateFoodItemMutation,
  useGetFoodItemByIdQuery,
} from "../../Apis/foodItemApi";
import { MainLoader } from "../../Components/Page/Common";
import { SD_Categories, SD_Types } from "../../Utility/SD";

const Categories = [
  SD_Categories.SUPE,
  SD_Categories.PRINCIPAL,
  SD_Categories.DESERT
];

const Types = [SD_Types.VEGAN, SD_Types.NONVEGAN];

const foodItemData = {
  name: "",
  description: "",
  price: "",
  category: Categories[0],
  foodType: Types[0],
  imageUrl: "", // Add imageUrl to the foodItemData
};

function MenuItemUpsert() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [foodItemInputs, setFoodItemInputs] = useState(foodItemData);
  const [loading, setLoading] = useState(false);
  const [createFoodItem] = useCreateFoodItemMutation();

  const { data: foodItem } = useGetFoodItemByIdQuery(id);
  useEffect(() => {
    if (foodItem && foodItem.result) {
      const tempData = {
        name: foodItem.result.name,
        description: foodItem.result.description,
        foodType: foodItem.result.foodType,
        category: foodItem.result.category,
        price: foodItem.result.price,
        imageUrl: foodItem.result.imageUrl, // Set the imageUrl from the foodItem result
      };
      setFoodItemInputs(tempData);
    }
  }, [foodItem]);

  const handleFoodItemInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const tempData = inputHelper(e, foodItemInputs);
    setFoodItemInputs(tempData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const requestData = {
      name: foodItemInputs.name,
      description: foodItemInputs.description,
      imageUrl: foodItemInputs.imageUrl, // Use the imageUrl from the input field
      foodTypeId: foodItemInputs.foodType,
      categoryId: foodItemInputs.category,
      price: foodItemInputs.price,
    };

    const response = await createFoodItem(requestData);

    if ("error" in response) {
      toastNotify("Error occurred while creating food item", "error");
      setLoading(false);
      return;
    }

    toastNotify("Food item created successfully", "success");
    setLoading(false);
    navigate("/foodItem/fooditemlist");
  };

  return (
    <div className="container border mt-5 p-5 bg-light">
      {loading && <MainLoader />}
      <h3 className="px-2 text-success">Adaugă aliment</h3>
      <form method="post" onSubmit={handleSubmit}>
        <div className="row mt-3">
          <div className="col-md-7">
            <input
              type="text"
              className="form-control"
              placeholder="Denumire"
              required
              name="name"
              value={foodItemInputs.name}
              onChange={handleFoodItemInput}
            />
            <textarea
              className="form-control mt-3"
              placeholder="Descriere"
              name="description"
              rows={5}
              value={foodItemInputs.description}
              onChange={handleFoodItemInput}
            ></textarea>
            <select
              className="form-control mt-3 form-select"
              required
              placeholder="Tip"
              name="foodType" // Update the name attribute to "foodType"
              value={foodItemInputs.foodType}
              onChange={handleFoodItemInput}
            >
              {Types.map((types) => (
                <option value={types}>{types}</option>
              ))}
            </select>
            <select
              className="form-control mt-3 form-select"
              required
              placeholder="Categorie"
              name="category" // Update the name attribute to "category"
              value={foodItemInputs.category}
              onChange={handleFoodItemInput}
            >
              {Categories.map((category) => (
                <option value={category}>{category}</option>
              ))}
            </select>
            <input
              type="number"
              className="form-control mt-3"
              required
              placeholder="Pret"
              name="price"
              value={foodItemInputs.price}
              onChange={handleFoodItemInput}
            />
            <input
              type="text" // Change the input type to "text"
              className="form-control mt-3"
              required
              placeholder="Image URL"
              name="imageUrl"
              value={foodItemInputs.imageUrl}
              onChange={handleFoodItemInput}
            />
            <div className="row">
              <div className="col-6">
                <button
                  type="submit"
                  className="btn btn-success form-control mt-3"
                >
                  Salvează
                </button>
              </div>
              <div className="col-6">
                <a
                  onClick={() => navigate(-1)}
                  className="btn btn-secondary form-control mt-3"
                >
                 Înapoi la listă alimente
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-5 text-center">
            <img
              src={foodItemInputs.imageUrl} // Display the imageUrl from the input field
              style={{ width: "100%", borderRadius: "30px" }}
              alt=""
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default MenuItemUpsert;
