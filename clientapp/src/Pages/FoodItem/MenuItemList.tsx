import React from "react";

import { MainLoader } from "../../Components/Page/Common";
import { foodModel } from "../../Interfaces";
import { useDeleteFoodItemMutation, useGetFoodItemsQuery } from "../../Apis/foodItemApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function MenuItemList() {
  const { data, isLoading } = useGetFoodItemsQuery(null);
  const navigate = useNavigate();
  const [deleteFoodItem] = useDeleteFoodItemMutation();

  const handleMenuItemDelete = async (id: number) => {
    toast.promise(
      deleteFoodItem(id),
      {
        pending: "Processing your request...",
        success: "Menu Item Deleted Successfully 👌",
        error: "Error encoutnered 🤯",
      }
    );
  };

  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <div className="table p-5">
          <div className="d-flex align-items-center justify-content-between">
            <h1 className="text-success">MenuItem List</h1>
            <button 
              className="btn btn-success"
              onClick={() => navigate("/menuitem/menuitemupsert")}
            >
              Add New
            </button>
          </div>
          <div className="p-2">
            <div className="row border">
              <div className="col-1">Image</div>
              <div className="col-1">ID</div>
              <div className="col-2">Name</div>
              <div className="col-2">Category</div>
              <div className="col-1">Price</div>
              <div className="col-2">Tip</div>
              <div className="col-1">Alergeni</div>
              <div className="col-1">Action</div>
            </div>

            {data.map((foodItem: foodModel) => {
              return (
                <div className="row border" key={foodItem.id}>
                  <div className="col-1">
                    <img
                      src={foodItem.imageUrl}
                      alt="no content"
                      style={{ width: "100%", maxWidth: "120px" }}
                    />
                  </div>
                  <div className="col-1">{foodItem.id}</div>
                  <div className="col-2">{foodItem.name}</div>
                  <div className="col-2">{foodItem.categoryName}</div>
                  <div className="col-1">${foodItem.price}</div>
                  <div className="col-2">{foodItem.foodTypeName}</div>
                  <div className="col-2">{foodItem.allergenNames}</div>
                  <div className="col-1">
                    <button className="btn btn-success">
                    <i
                        className="bi bi-pencil-fill"
                        onClick={() =>
                          navigate("/menuitem/menuitemupsert/" + foodItem.id)
                        }
                      ></i>
                    </button>
                    <button
                      className="btn btn-danger mx-2"
                      onClick={() => handleMenuItemDelete(foodItem.id)}
                    >
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default MenuItemList;