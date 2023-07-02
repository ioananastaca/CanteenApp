import { useParams } from "react-router-dom";
import React from "react";

let confirmedImage = require("../../Assets/Images/cantinausv.jpg");
function OrderConfirmedWp() {
  return (
    <div className="w-100 text-center d-flex justify-content-center align-items-center">
      <div>
        <i
          style={{ fontSize: "7rem" }}
          className="bi bi-check2-circle text-success"
        ></i>
        <div className="pb-5">
          <h2 className=" text-success">Comanda plasata!</h2>
          <h5 className="mt-3">Te asteptam intre orele 12:30-14:30 sa o ridici! </h5>
          <p>Nu uita că trebuie să plătești comanda în locația noastră.</p>
          <img
            src={confirmedImage}
            style={{ width: "40%", borderRadius: "30px" }}
          ></img>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmedWp;