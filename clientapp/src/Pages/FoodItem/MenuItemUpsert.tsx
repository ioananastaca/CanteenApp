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

  const Types = [
    SD_Types.VEGAN,
    SD_Types.NONVEGAN,
  ];


const foodItemData = {
  name: "",
  description: "",
  price: "",
  category: Categories[0],
  foodType: Types[0],
};

function MenuItemUpsert() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [foodItemInputs, setFoodItemInputs] = useState(foodItemData);
  const [imageToBeStore, setImageToBeStore] = useState<any>();
  const [imageToBeDisplay, setImageToBeDisplay] = useState<string>("");
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
      };
      setFoodItemInputs(tempData);
      setImageToBeDisplay(foodItem.result.image);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const imgType = file.type.split("/")[1];
      const validImgTypes = ["jpeg", "jpg", "png"];

      const isImageTypeValid = validImgTypes.filter((e) => {
        return e === imgType;
      });

      if (file.size > 1000 * 1024) {
        setImageToBeStore("");
        toastNotify("File must be less than 1 MB", "error");
        return;
      } else if (isImageTypeValid.length === 0) {
        setImageToBeStore("");
        toastNotify("File must be in JPEG, JPG, or PNG format", "error");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      setImageToBeStore(file);
      reader.onload = (e) => {
        const imgUrl = e.target?.result as string;
        setImageToBeDisplay(imgUrl);
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!imageToBeStore) {
      toastNotify("Please upload an image", "error");
      setLoading(false);
      return;
    }

    const requestData = {
      name: foodItemInputs.name,
      description: foodItemInputs.description,
      imageUrl: "",
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
      <h3 className="px-2 text-success">Add Menu Item</h3>
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
              type="file"
              onChange={handleFileChange}
              className="form-control mt-3"
            />
            <div className="row">
              <div className="col-6">
                <button
                  type="submit"
                  className="btn btn-success form-control mt-3"
                >
                  Submit
                </button>
              </div>
              <div className="col-6">
                <a
                  onClick={() => navigate(-1)}
                  className="btn btn-secondary form-control mt-3"
                >
                  Back to Menu Items
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-5 text-center">
            <img
              src={imageToBeDisplay}
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
