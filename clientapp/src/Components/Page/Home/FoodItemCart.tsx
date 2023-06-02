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

  const allergens = props.foodItem.allergenNames || [];

  return (
    <div className="col-md-4 col-6 p-2">
      <div className="card h-100 menu-item-card">
        <Link to={`/foodItemDetails/${props.foodItem.id}`}>
          <img
            src={props.foodItem.imageUrl}
            className="card-img-top"
            alt={props.foodItem.name}
          />
          <div className="card-overlay">
            <h5>{props.foodItem.foodTypeName}</h5>
            <ul>
              <li>Alergeni:</li>
              {allergens.map((allergen: string, index: number) => (
  <li key={index}>{allergen.trim()}</li>
))}
            </ul>
          </div>
        </Link>
        <div className="card-body">
          <h5 className="card-title">
            <Link
              to={`/foodItemDetails/${props.foodItem.id}`}
              style={{ textDecoration: "none" }}
            >
              {props.foodItem.name}
            </Link>
          </h5>
          <p className="card-text">{props.foodItem.description}</p>
          <div className="d-flex justify-content-between align-items-center">
            <p className="badge bg-secondary">{props.foodItem.categoryName}</p>
            {isAddingToCart ? (
              <MiniLoader />
            ) : (
              <i
                className="bi bi-cart-plus btn btn-outline-danger"
                style={{
                  padding: "5px",
                  borderRadius: "50%",
                  outline: "none !important",
                  cursor: "pointer",
                }}
                onClick={() => handleAddToCart(props.foodItem.id)}
              ></i>
            )}
          </div>
        </div>
        <div className="card-footer">
          <div className="row text-center">
            <h4>{props.foodItem.price} RON</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuItemCard;
