import React from "react";
import { foodModel } from "../../../Interfaces";
import { Link } from "react-router-dom";

interface Props {
  foodItem: foodModel;
}

function MenuItemCard(props: Props) {
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
          ></i>

          <div className="text-center">
            <p className="card-title m-0 text-success fs-3">
              <Link to={`/foodItemDetails/${props.foodItem.id}`} style={{textDecoration:"none"}}>
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
