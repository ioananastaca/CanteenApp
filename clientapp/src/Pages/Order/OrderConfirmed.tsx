import { useParams } from "react-router-dom";
import React from "react";

let confirmedImage = require("../../Assets/Images/cantinausv.jpg");
function OrderConfirmed() {
  const { id } = useParams();
  return (
    <div className="w-100 text-center d-flex justify-content-center align-items-center">
      <div>
        <i
          style={{ fontSize: "7rem" }}
          className="bi bi-check2-circle text-success"
        ></i>
        <div className="pb-5">
          <h2 className=" text-success">Comanda plasata!</h2>
          <h5 className="mt-3">ID-ul tau este: {id} </h5>
          <p>Te asteptam intre orele 12:30-14:30 sa o ridici! </p>
          <img
            src={confirmedImage}
            style={{ width: "40%", borderRadius: "30px" }}
          ></img>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmed;