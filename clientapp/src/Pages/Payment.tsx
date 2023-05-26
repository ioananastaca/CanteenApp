import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import { useLocation } from "react-router-dom";
import { PaymentForm } from "../Components/Page/Payment";
import { OrderSummary } from "../Components/Page/Order";

function Payment() {
  const {
    state: { apiResult, userInput },
  } = useLocation();
  const stripePromise = loadStripe(
    "pk_test_51N8mKbIUvyb1MAB5MW0BMS3jv8Gy5vxlo7a38V8p5oqnF2OhqFwV1avXhKr7EnPap3Zfq8ESENaQaGMmy3tGIn4V00KkwTajoi"
  );
  const options = {
    // passing the client secret obtained from the server
    clientSecret: apiResult.clientSecret,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <div className="container m-5 p-5">
        <div className="row">
          <div className="col-md-7">
            <OrderSummary data={apiResult} userInput={userInput} />
          </div>
          <div className="col-md-5">
            <PaymentForm data={apiResult} userInput={userInput} />
          </div>
        </div>
      </div>
    </Elements>
  );
}

export default Payment;
