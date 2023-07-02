import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiResponse,cartItemModel, userModel } from "../../../Interfaces";
import { orderSummaryProps } from "./orderSummaryProps";
import { useSelector } from "react-redux";
import { RootState } from "../../../Storage/Redux/store";
import { SD_Roles } from "../../../Utility/SD";
import { useCreateOrderMutation } from "../../../Apis/orderApi";
import { SD_Status } from "../../../Utility/SD";


function OrderSummary({ data, userInput }: orderSummaryProps) {
  const navigate = useNavigate();
  const [skipDetails, setSkipDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createOrder] = useCreateOrderMutation();

  const handleSkipDetailsChange = () => {
    setSkipDetails(!skipDetails);
  };
  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  return (
    <div>
      <h3 className="text-success">Detalii comanda</h3>
      <div className="mt-3">
        <div className="border py-3 px-2">Nume: {userInput.name} </div>
        <div className="border py-3 px-2">Email: {userInput.email} </div>
        <div className="border py-3 px-2">
          Numar telefon: {userInput.phoneNumber}
        </div>
        <div className="border py-3 px-2">
          <h4 className="text-success">Meniul ales</h4>
          <div className="p-3">
            {data.cartItems?.map((cartitem: cartItemModel, index: number) => {
              return (
                <div className="d-flex" key={index}>
                  <div className="d-flex w-100 justify-content-between">
                    <p>{cartitem.food?.name}</p>
                    <p>
                      {cartitem.food?.price} RON x {cartitem.quantity} =
                    </p>
                  </div>
                  <p style={{ width: "70px", textAlign: "right" }}>
                    {(cartitem.food?.price ?? 0) * (cartitem.quantity ?? 0)} RON
                  </p>
                </div>
              );
            })}
            <hr />
            <h4 className="text-danger" style={{ textAlign: "right" }}>
              {data.cartTotal?.toFixed(2)} RON
            </h4>
          </div>
        </div>
      </div>
     
    </div>
  );
}

export default OrderSummary;
