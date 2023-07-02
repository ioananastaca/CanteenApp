import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetOrderDetailsQuery } from "../../Apis/orderApi";
import { OrderSummary } from "../../Components/Page/Order";
import { userModel } from "../../Interfaces";
import { RootState } from "../../Storage/Redux/store";
import { useSelector } from "react-redux";
import { SD_Roles } from "../../Utility/SD";

function OrderDetails() {
  const { id } = useParams();
  const { data, isLoading } = useGetOrderDetailsQuery(id);
  let userInput, orderDetails;
  if (!isLoading && data?.result) {
    console.log(data.result);
    userInput = {
      name: data.result[0].pickupName,
      email: data.result[0].pickupEmail,
      phoneNumber: data.result[0].pickupPhoneNumber,
    };
    orderDetails = {
      id: data.result[0].orderHeaderId,
      cartItems: data.result[0].orderDetails,
      cartTotal: data.result[0].orderTotal,
      status: data.result[0].status,
    };
  }
  const navigate = useNavigate();
  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );
  return (
    <div
      className="container my-5 mx-auto p-5 w-100"
      style={{ maxWidth: "750px" }}
    >
      {!isLoading && orderDetails && userInput && (
        <OrderSummary data={orderDetails} userInput={userInput} />
      )}
      {userData.role === SD_Roles.ADMIN && (
        <button
          className="btn btn-warning"
          onClick={() => navigate("/order/allOrders")}
        >
          Inapoi
        </button>
      )}
        {userData.role === SD_Roles.CUTOMER && (
        <button
          className="btn btn-warning"
          onClick={() => navigate("/order/myOrders")}
        >
          Inapoi
        </button>
      )}
     
    </div>
  );
}

export default OrderDetails;
