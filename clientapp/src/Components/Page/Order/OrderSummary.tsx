import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cartItemModel } from "../../../Interfaces";
import { orderSummaryProps } from "./orderSummaryProps";

function OrderSummary({ data, userInput }: orderSummaryProps) {
  const navigate = useNavigate();
  const [skipDetails, setSkipDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSkipDetailsChange = () => {
    setSkipDetails(!skipDetails);
  };

  const handleSubmitOrders = async () => {
    if (skipDetails) {
      // Add order to the database
      setIsSubmitting(true);

      try {
        // Simulate API request with a delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Add your logic to add the order to the database
        console.log("Order added to the database");

        // Redirect to order confirmed page
        navigate("/order/orderconfirmed/:id");
      } catch (error) {
        // Handle the case when adding the order to the database fails
        console.log("Failed to add order to the database");
      }

      setIsSubmitting(false);
    } else {
      // Proceed with normal form submission
      // Add your form submission logic here
      console.log("Submitting form...");
    }
  };

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
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={skipDetails}
            onChange={handleSkipDetailsChange}
          />
          <label className="form-check-label">
            Treci peste completarea detaliilor cartului
          </label>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleSubmitOrders}
          disabled={!skipDetails || isSubmitting}
        >
          Plaseaza comanda
        </button>
      </div>
    </div>
  );
}

export default OrderSummary;
