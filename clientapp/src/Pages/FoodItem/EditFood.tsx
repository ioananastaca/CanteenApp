import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetFoodItemByIdQuery,
  useUpdateFoodItemMutation,
} from "../../Apis/foodItemApi";
import { MainLoader, MiniLoader } from "../../Components/Page/Common";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FoodItem {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  categoryId: number;
  foodTypeId: number;
}

const EditFood: React.FC = () => {
  const { id } = useParams<{ id?: string }>() || {};

  const { data: foodItem, isLoading } = useGetFoodItemByIdQuery(id || "");

  const navigate = useNavigate();

  const [updatedFood, setUpdatedFood] = useState<FoodItem>({
    id: 0,
    name: "",
    description: "",
    imageUrl: "",
    price: 0,
    categoryId: 1,
    foodTypeId: 1,
  });

  const [updateFoodItem, { isLoading: isUpdating }] =
    useUpdateFoodItemMutation();

  useEffect(() => {
    if (foodItem) {
      setUpdatedFood(foodItem);
    }
  }, [foodItem]);

  const mapCategoryName = (categoryId: number): string => {
    switch (categoryId) {
      case 1:
        return "Supe/Ciorbe";
      case 2:
        return "Fel principal";
      case 3:
        return "Desert";
      default:
        return "";
    }
  };

  const mapFoodTypeName = (foodTypeId: number): string => {
    switch (foodTypeId) {
      case 1:
        return "Vegan";
      case 2:
        return "Non-vegan";
      default:
        return "";
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    if (name === "categoryId") {
      setUpdatedFood((prevFoodItem) => ({
        ...prevFoodItem,
        categoryId: parseInt(value),
      }));
    } else if (name === "foodTypeId") {
      setUpdatedFood((prevFoodItem) => ({
        ...prevFoodItem,
        foodTypeId: parseInt(value),
      }));
    } else {
      setUpdatedFood((prevFoodItem) => ({
        ...prevFoodItem,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!id) {
      console.error("Invalid food item ID");
      return;
    }

    try {
      const response = await updateFoodItem({
        data: updatedFood,
        id: parseInt(id),
      });

      if ("error" in response) {
        console.error(
          "Error occurred while updating food item:",
          response.error
        );
        toast.error("An error occurred while updating the food item");
      } else {
        console.log("Food item updated successfully:", response.data);
        toast.success("Modificare salvata!");
      }
    } catch (error) {
      console.error("Error occurred while updating food item:", error);
      toast.error("An error occurred while updating the food item");
    }
  };

  if (isLoading) {
    return <MainLoader />;
  }
  return (
    <div className="container border mt-5 p-5 bg-light">
      <h3 className="px-2 text-success">Editează aliment</h3>
      <div className="row">
        <form
          onSubmit={handleSubmit}
          className="col-md-7"
          style={{ marginBottom: "20px" }}
        >
          <input
            type="text"
            className="form-control"
            placeholder="Denumire"
            required
            name="name"
            value={updatedFood.name}
            onChange={handleChange}
            style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
          />
          <input
            className="form-control mt-3"
            placeholder="Descriere"
            name="description"
            value={updatedFood.description}
            onChange={handleChange}
            style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
          />
          <input
            type="text"
            className="form-control mt-3"
            required
            placeholder="Image URL"
            name="imageUrl"
            value={updatedFood.imageUrl}
            onChange={handleChange}
            style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
          />
          <input
            type="number"
            className="form-control mt-3"
            required
            placeholder="Pret"
            name="price"
            value={updatedFood.price}
            onChange={handleChange}
            style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
          />
          <select
            className="form-control mt-3"
            name="categoryId"
            value={updatedFood.categoryId}
            onChange={handleChange}
            style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
          >
            <option value="1">Alege categoria</option>
            <option value="1">Supe/Ciorbe</option>
            <option value="2">Fel principal</option>
            <option value="3">Desert</option>
          </select>
          <select
            className="form-control mt-3"
            name="foodTypeId"
            value={updatedFood.foodTypeId}
            onChange={handleChange}
            style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
          >
            <option value="1">Alege tip</option>

            <option value="1">Vegan</option>
            <option value="2">Non-vegan</option>
          </select>
          <button type="submit" className="btn btn-success form-control mt-3">
            {isUpdating ? (
              <MiniLoader type="light" size={16} /> // Display MiniLoader when updating
            ) : (
              "Salvează"
            )}
          </button>
        </form>
        <div className="col-md-5 text-center">
          <img
            src={foodItem.imageUrl}
            style={{ width: "100%", borderRadius: "30px" }}
            alt=""
          />
        </div>
      </div>
      <button
        className="btn btn-warning"
        onClick={() => navigate("/menuItem/menuitemlist")}
      >
        Inapoi
      </button>
    </div>
  );
};

export default EditFood;
