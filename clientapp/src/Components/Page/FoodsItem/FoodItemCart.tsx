import React, { useState } from "react";
import { apiResponse, foodModel, userModel } from "../../../Interfaces";
import { Link, useNavigate } from "react-router-dom";
import { useUpdateShoppingCartMutation } from "../../../Apis/shoppingCartApi";
import { MiniLoader } from "../Common";
import { toastNotify } from "../../../Helper";
import { useSelector } from "react-redux";
import { RootState } from "../../../Storage/Redux/store";

interface Props {
  foodItem: foodModel;
}

function MenuItemCard(props: Props) {
  const navigate = useNavigate();
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [updateShoppingCart] = useUpdateShoppingCartMutation();
  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  const handleAddToCart = async (foodItemId: number) => {
    if (!userData.id) {
      navigate("/login");
      return;
    }
    setIsAddingToCart(true);

    const response: apiResponse = await updateShoppingCart({
      userId: userData.id,
      foodId: foodItemId,
      updateQuantityBy: 1,
    });

    if (response.data && response.data.isSuccess) {
      toastNotify("Food added to cart successfully!");
    }

    setIsAddingToCart(false);
  };
  return (
    <div className="col-md-4 col-12 p-4">
      <div
        className="card"
        style={{ boxShadow: "0 1px 7px 0 rgb(0 0 0 / 50%)" }}
      >
        <div className="card-body pt-2">
          <div className="row col-10 offset-1 p-4">
            <Link to={`/foodItemDetails/${props.foodItem.id}`}>
              <img
                src={props.foodItem.imageUrl}
                style={{ borderRadius: "50%" }}
                alt=""
                className="w-100 mt-5 image-box"
              />
            </Link>
          </div>
          {props.foodItem.foodTypeName &&
            props.foodItem.foodTypeName.length > 0 && (
              <i
                className="bi bi-star btn btn-success"
                style={{
                  position: "absolute",
                  top: "15px",
                  left: "15px",
                  padding: "5px 10px",
                  borderRadius: "3px",
                  outline: "none !important",
                  cursor: "pointer",
                }}
              >
                &nbsp; {props.foodItem.foodTypeName}
              </i>
            )}

          {isAddingToCart ? (
            <div
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
              }}
            >
              <MiniLoader/>
            </div>
          ) : (
            <i
              className="bi bi-cart-plus btn btn-outline-danger"
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                padding: "5px 10px",
                borderRadius: "3px",
                outline: "none !important",
                cursor: "pointer",
              }}
              onClick={() => handleAddToCart(props.foodItem.id)}
            ></i>
          )}

          <div className="text-center">
            <p className="card-title m-0 text-success fs-3">
              <Link
                to={`/foodItemDetails/${props.foodItem.id}`}
                style={{ textDecoration: "none" }}
              >
                {props.foodItem.name}
              </Link>
            </p>
            <p className="badge bg-secondary" style={{ fontSize: "12px" }}>
              {props.foodItem.categoryName}
            </p>
          </div>
          <p
            className="card-text"
            style={{
              textAlign: "center",
              fontWeight: "light",
              fontSize: "14px",
            }}
          >
            {props.foodItem.description}
          </p>
          <p
            className="card-text"
            style={{
              textAlign: "center",
              fontWeight: "light",
              fontSize: "14px",
            }}
          >
            {props.foodItem.allergenNames + " "}
          </p>
          <div className="row text-center">
            <h4>{props.foodItem.price} RON</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuItemCard;
