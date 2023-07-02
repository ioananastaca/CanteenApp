import React, { useState } from "react";
import { useCreateFoodItemMutation } from "../../Apis/foodItemApi";
import { MainLoader } from "../../Components/Page/Common";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

interface AddFoodForm {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  categoryId: number;
  foodTypeId: number;
}

const MenuItemUpsert: React.FC = () => {
  const [foodItem, setFoodItem] = useState<AddFoodForm>({
    name: "",
    description: "",
    imageUrl: "",
    price: 0,
    categoryId: 0,
    foodTypeId: 0,
  });

  const [createFoodItem] = useCreateFoodItemMutation();

  const categoryNames = {
    1: "Supe/Ciorbe",
    2: "Fel principal",
    3: "Desert",
  };

  const foodTypeNames = {
    1: "Vegan",
    2: "Non vegan",
  };

  const navigate = useNavigate();
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFoodItem((prevFoodItem) => ({
      ...prevFoodItem,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await createFoodItem(foodItem);

      if ("error" in response) {
        console.error("Error occurred while adding food item:", response.error);
        toast.error("Error occurred while adding food item");
      } else {
        console.log("Aliment adaugat cu succes!", response.data);
        toast.success("Aliment adaugat cu succes!");
        setFoodItem({
          name: "",
          description: "",
          imageUrl: "",
          price: 0,
          categoryId: 0,
          foodTypeId: 0,
        });
      }
    } catch (error) {
      console.error("Error occurred while adding food item:", error);
      toast.error("Error occurred while adding food item");
    }
  };

  return (
    <div className="container border mt-5 p-5 bg-light">
      <ToastContainer />
      {/* Add any loading indicator component here */}
      <h3 className="px-2 text-success">Adaugă aliment</h3>
      <form onSubmit={handleSubmit}>
        <div className="row mt-3">
          <div className="col-md-7">
            <input
              type="text"
              className="form-control"
              placeholder="Denumire"
              required
              name="name"
              value={foodItem.name}
              onChange={handleChange}
              style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
            />
            <input
              className="form-control mt-3"
              placeholder="Descriere"
              name="description"
              value={foodItem.description}
              onChange={handleChange}
              style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
            />
            <input
              type="text"
              className="form-control mt-3"
              required
              placeholder="Image URL"
              name="imageUrl"
              value={foodItem.imageUrl}
              onChange={handleChange}
              style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
            />
            <input
              type="number"
              className="form-control mt-3"
              required
              placeholder="Pret"
              name="price"
              value={foodItem.price}
              onChange={handleChange}
              style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
            />
            <select
              className="form-control mt-3 form-select"
              required
              placeholder="Categorie"
              name="categoryId"
              value={foodItem.categoryId}
              onChange={handleChange}
              style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
            >
              <option value="">Selectează categoria</option>
              {Object.entries(categoryNames).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
            <select
              className="form-control mt-3 form-select"
              required
              placeholder="Tip"
              name="foodTypeId"
              value={foodItem.foodTypeId}
              onChange={handleChange}
              style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
            >
              <option value="">Selectează tipul</option>
              {Object.entries(foodTypeNames).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
            <button type="submit" className="btn btn-success form-control mt-3">
              Salvează
            </button>
            <div></div>
          </div>
          <div className="col-md-5 text-center">
            <img
              src={foodItem.imageUrl}
              style={{ width: "100%", borderRadius: "30px" }}
              alt=""
            />
          </div>
        </div>
      </form>
      <button
        className="btn btn-warning"
        onClick={() => navigate("/menuItem/menuitemlist")}
      >
        Inapoi
      </button>
    </div>
  );
};

export default MenuItemUpsert;
