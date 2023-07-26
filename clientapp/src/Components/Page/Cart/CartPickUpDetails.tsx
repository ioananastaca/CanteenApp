import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { apiResponse, cartItemModel, userModel } from "../../../Interfaces";
import { RootState } from "../../../Storage/Redux/store";
import { MiniLoader } from "../Common";
import { inputHelper } from "../../../Helper";
import { useInitiatePaymentMutation } from "../../../Apis/paymentApi";
import { useNavigate } from "react-router-dom";

export default function CartPickUpDetails() {
  const [loading, setLoading] = useState(false);
  const shoppingCartFromStore: cartItemModel[] = useSelector(
    (state: RootState) => state.shoppingCartStore.cartItems ?? []
  );
  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );
  let grandTotal = 0;
  let totalItems = 0;
  const initialUserData = {
    name: userData.fullName,
    email: userData.email,
    phoneNumber: "",
  };
  shoppingCartFromStore?.map((cartItem: cartItemModel) => {
    totalItems += cartItem.quantity ?? 0;
    grandTotal += (cartItem.food?.price ?? 0) * (cartItem.quantity ?? 0);
    return null;
  });

  const navigate = useNavigate();
  const [userInput, setUserInput] = useState(initialUserData);
  const [initiatePayment] = useInitiatePaymentMutation();
  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (e.target.name === "phoneNumber" && value.length > 15) {
      value = value.slice(0, 15); // Truncate the value to 15 characters
    }

    const tempData = inputHelper(e, { ...userInput, [e.target.name]: value });
    setUserInput(tempData);
  };

  useEffect(() => {
    setUserInput({
      name: userData.fullName,
      email: userData.email,
      phoneNumber: "",
    });
  }, [userData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { data }: apiResponse = await initiatePayment(userData.id);
    navigate("/payment", {
      state: { apiResult: data?.result, userInput },
    });
  };

  return (
    <div className="border pb-5 pt-3">
      <h1 style={{ fontWeight: "300" }} className="text-center text-success">
        Detalii comanda
      </h1>
      <hr />
      <form onSubmit={handleSubmit} className="col-10 mx-auto">
        <div className="form-group mt-3">
          Nume
          <input
            type="text"
            value={userInput.name}
            className="form-control"
            placeholder="name..."
            name="name"
            onChange={handleUserInput}
            required
          />
        </div>
        <div className="form-group mt-3">
          Email
          <input
            type="email"
            value={userInput.email}
            className="form-control"
            placeholder="email..."
            name="email"
            onChange={handleUserInput}
            required
          />
        </div>

        <div className="form-group mt-3">
          Telefon
          <input
            type="text"
            pattern="[0-9]*"
            value={userInput.phoneNumber}
            className="form-control"
            placeholder="numarul de telefon"
            name="phoneNumber"
            onChange={handleUserInput}
            maxLength={10}
            minLength={10}
            required
          />
          {userInput.phoneNumber.length > 0 &&
            !/^\d+$/.test(userInput.phoneNumber) && (
              <span className="text-danger">
                Doar caractere numerice permise
              </span>
            )}
        </div>

        <div className="form-group mt-3">
          <div className="card p-3" style={{ background: "ghostwhite" }}>
            <h5>Total comanda : {grandTotal.toFixed(2)} RON</h5>
            <h5>Numar produse: {totalItems}</h5>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-lg btn-success form-control mt-3"
          disabled={loading || shoppingCartFromStore.length === 0}
        >
          {loading ? <MiniLoader /> : "Continuați"}
        </button>
      </form>
    </div>
  );
}
