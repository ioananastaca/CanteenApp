import React, { useEffect } from "react";
import { MainLoader } from "../../Components/Page/Common";
import { foodModel } from "../../Interfaces";
import { useDeleteFoodItemMutation, useGetFoodItemsQuery } from "../../Apis/foodItemApi";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

function MenuItemList() {
  const { data, isLoading, refetch } = useGetFoodItemsQuery(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [deleteFoodItem] = useDeleteFoodItemMutation();

  const handleMenuItemDelete = async (id: number) => {
    toast.promise(deleteFoodItem(id), {
   
      success: "Aliment sters cu succes 👌",
      error: "Error encountered 🤯",
    });
  };

  useEffect(() => {
    // Refetch the food items whenever the location changes
    refetch();
  }, [location, refetch]);

  const handleEditAllergens = (id: number) => {
    navigate("/updateallergen/" + id);
  };

  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <div className="table p-5">
          <div className="d-flex align-items-center justify-content-between">
            <h1 className="text-success">Lista alimente</h1>
            <button
              className="btn btn-success"
              onClick={() => navigate("/menuitem/menuitemupsert")}
            >
             Adaugă aliment
            </button>
          </div>
          <div className="p-2">
            <table className="table">
              <thead>
                <tr className="border">
                  <th>Image</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Tip</th>
                  <th>Alergeni</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((foodItem: foodModel) => (
                  <tr className="border" key={foodItem.id}>
                    <td>
                      <img
                        src={foodItem.imageUrl}
                        alt="no content"
                        style={{ width: "100%", maxWidth: "120px" }}
                      />
                    </td>
                    <td>{foodItem.id}</td>
                    <td>{foodItem.name}</td>
                    <td>{foodItem.categoryName}</td>
                    <td>{foodItem.price}Ron</td>
                    <td>{foodItem.foodTypeName}</td>
                    <td>{foodItem.allergenNames.join(", ")}</td>

                    <td className="col-lg-3">
                      <button
                        className="btn btn-success"
                        onClick={() => navigate("/menuitem/editfood/" + foodItem.id)}
                      >
                        Editeaza
                      </button>

                      <button
                        className="btn btn-info btn-sm"
                        onClick={() =>navigate("/menuitem/editallergens/" + foodItem.id)}
                        style={{ marginLeft: "0.5rem", fontSize: "0.8rem" }}
                      >
                        Alergeni
                      </button>

                      <button
                        className="btn btn-danger"
                        onClick={() => handleMenuItemDelete(foodItem.id)}
                        style={{ marginLeft: "0.5rem" }}
                      >
                        Sterge
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

export default MenuItemList;
