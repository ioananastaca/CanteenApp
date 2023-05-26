import { useNavigate } from "react-router-dom";
import { cartItemModel } from "../../../Interfaces";
import { orderSummaryProps } from "./orderSummaryProps";

function OrderSummary({ data, userInput }: orderSummaryProps) {
  const navigate = useNavigate();
  return (
    <div>
      {" "}
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
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Inapoi 
        </button>
      </div>
    </div>
  );
}

export default OrderSummary;