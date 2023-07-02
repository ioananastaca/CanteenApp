import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetFoodItemByIdQuery } from "../Apis/foodItemApi";
import { useUpdateShoppingCartMutation } from "../Apis/shoppingCartApi";
import { MainLoader, MiniLoader } from "../Components/Page/Common";
import { apiResponse, userModel } from "../Interfaces";
import { toastNotify } from "../Helper";
import { useSelector } from "react-redux";
import { RootState } from "../Storage/Redux/store";

function FoodItemDetails() {
  const { foodItemId } = useParams();
  const { data, isLoading } = useGetFoodItemByIdQuery(foodItemId);
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [updateShoppingCart] = useUpdateShoppingCartMutation();
  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  const handleQuantity = (counter: number) => {
    let newQuantity = quantity + counter;
    if (newQuantity == 0) {
      newQuantity = 1;
    }
    setQuantity(newQuantity);
    return;
  };

  const handleAddToCart = async (foodItemId: number) => {
    if (!userData.id) {
      navigate("/login");
      return;
    }
    setIsAddingToCart(true);

    const response: apiResponse = await updateShoppingCart({
      userId: userData.id,
      foodId: foodItemId,
      updateQuantityBy: quantity,
    });

    if (response.data && response.data.isSuccess) {
      toastNotify("Aliment adaugat cu succes!");
    }

    setIsAddingToCart(false);
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center" style={{ width: "100%" }}>
        Loading...
      </div>
    );
  }

  if (!data) {
    return <div>No food item found.</div>;
  }

  return (
    <div className="container pt-4 pt-md-5">
      <div className="row">
        <div className="col-7">
          <h2 className="text-success">{data.name}</h2>
          <span>
            <span
              className="badge text-bg-dark pt-2"
              style={{ height: "40px", fontSize: "20px" }}
            >
              {data.categoryName}
            </span>
          </span>
          <span>
            <span
              className="badge text-bg-light pt-2"
              style={{ height: "40px", fontSize: "20px" }}
            >
              {data.foodTypeName}
            </span>
          </span>
          <p
            style={{ fontSize: "20px", lineHeight: "1.5", margin: "10px 0" }}
            className="pt-2"
          >
            Descriere: {data.description}
          </p>
          <span className="h3">{data.price} RON</span> &nbsp;&nbsp;&nbsp;
          <span
            className="pb-2  p-3"
            style={{ border: "1px solid #333", borderRadius: "30px" }}
          >
            <i
              onClick={() => {
                handleQuantity(-1);
              }}
              className="bi bi-dash p-1"
              style={{ fontSize: "25px", cursor: "pointer" }}
            ></i>
            <span className="h3 mt-3 px-3">{quantity}</span>
            <i
              onClick={() => {
                handleQuantity(+1);
              }}
              className="bi bi-plus p-1"
              style={{ fontSize: "25px", cursor: "pointer" }}
            ></i>
          </span>
          <div className="row pt-4">
            <div className="col-5">
              {isAddingToCart ? (
                <button disabled className="btn btn-success form-control">
                  <MiniLoader size={60} />
                </button>
              ) : (
                <button
                  className="btn btn-success form-control"
                  onClick={() => handleAddToCart(data.id)}
                >
                  Adaugă
                </button>
              )}
            </div>

            <div className="col-5 ">
              <button
                className="btn btn-secondary form-control"
                onClick={() => navigate(-1)}
              >
                Înapoi la meniu
              </button>
            </div>
          </div>
        </div>
        <div className="col-5">
          <img
            src={data.imageUrl}
            width="100%"
            style={{ borderRadius: "50%" }}
            alt="No content"
          ></img>
        </div>
      </div>
    </div>
  );
}

export default FoodItemDetails;
