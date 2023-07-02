import React, { useEffect, useState } from "react";
import { toastNotify } from "../../../Helper";
import { apiResponse, cartItemModel, userModel } from "../../../Interfaces";
import { SD_Status } from "../../../Utility/SD";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "../../../Apis/orderApi";
import { orderSummaryProps } from "../Order/orderSummaryProps";
import { useDispatch, useSelector } from "react-redux";
import {
  clearShoppingCart,
  removeFromCart,
} from "../../../Storage/Redux/shoppingCartSlice";
import { useUpdateShoppingCartMutation } from "../../../Apis/shoppingCartApi";
import { RootState } from "../../../Storage/Redux/store";

const PaymentForm = ({ data, userInput }: orderSummaryProps) => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [createOrder] = useCreateOrderMutation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [skipPayment, setSkipPayment] = useState(false);
  const dispatch = useDispatch();
  const [updateShoppingCart] = useUpdateShoppingCartMutation();

  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    if (skipPayment) {
      // Create order without payment
      await createOrderWithoutPayment();
    } else {
      // Proceed with payment
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: "https://example.com/order/123/complete",
        },
        redirect: "if_required",
      });

      if (result.error) {
        toastNotify("An unexpected error occurred.", "error");
        setIsProcessing(false);
      } else {
        // Create order with payment details
        await createOrderWithPayment(result.paymentIntent.status);
      }
    }

    setIsProcessing(false);
  };

  const createOrderWithoutPayment = async () => {
    let grandTotal = 0;
    let totalItems = 0;
    const orderDetailsDTO: any = [];
    data.cartItems?.forEach((item: cartItemModel) => {
      const tempOrderDetail: any = {};
      tempOrderDetail["foodId"] = item.food?.id;
      tempOrderDetail["quantity"] = item.quantity;
      tempOrderDetail["foodName"] = item.food?.name;
      tempOrderDetail["price"] = item.food?.price;
      orderDetailsDTO.push(tempOrderDetail);
      grandTotal += item.quantity! * item.food?.price!;
      totalItems += item.quantity!;
    });

    const response: apiResponse = await createOrder({
      pickupName: userInput.name,
      pickupPhoneNumber: userInput.phoneNumber,
      pickupEmail: userInput.email,
      totalItems: totalItems,
      orderTotal: grandTotal,
      orderDetailsDTO: orderDetailsDTO,
      stripePaymentIntentID: data.stripePaymentIntentId,
      applicationUserId: data.userId,
      status: SD_Status.PENDING,
    });

    if (response) {
      if (response.data?.result.status === SD_Status.CONFIRMED) {
        navigate("/order/orderConfirmed");
      } else {
        navigate("/order/orderConfirmed");
      }
    }
    data.cartItems?.forEach((item: cartItemModel) => {
      handleQuantity(0, item);
    });
  };

  const createOrderWithPayment = async (paymentStatus: string) => {
    let grandTotal = 0;
    let totalItems = 0;
    const orderDetailsDTO: any = [];
    data.cartItems?.forEach((item: cartItemModel) => {
      const tempOrderDetail: any = {};
      tempOrderDetail["foodId"] = item.food?.id;
      tempOrderDetail["quantity"] = item.quantity;
      tempOrderDetail["foodName"] = item.food?.name;
      tempOrderDetail["price"] = item.food?.price;
      orderDetailsDTO.push(tempOrderDetail);
      grandTotal += item.quantity! * item.food?.price!;
      totalItems += item.quantity!;
    });

    const response: apiResponse = await createOrder({
      pickupName: userInput.name,
      pickupPhoneNumber: userInput.phoneNumber,
      pickupEmail: userInput.email,
      totalItems: totalItems,
      orderTotal: grandTotal,
      orderDetailsDTO: orderDetailsDTO,
      stripePaymentIntentID: data.stripePaymentIntentId,
      applicationUserId: data.userId,
      status:
        paymentStatus === "succeeded" ? SD_Status.CONFIRMED : SD_Status.PENDING,
    });

    if (response) {
      if (response.data?.result.status === SD_Status.CONFIRMED) {
        navigate(`/order/orderConfirmed/${response.data.result.orderHeaderId}`);
      } else {
        navigate("/failed");
      }
    }
    dispatch(clearShoppingCart());
    data.cartItems?.forEach((item: cartItemModel) => {
      handleQuantity(0, item);
    });
  };

  const handleQuantity = (
    updateQuantityBy: number,
    cartItem: cartItemModel
  ) => {
    if (
      (updateQuantityBy == -1 && cartItem.quantity == 1) ||
      updateQuantityBy == 0
    ) {
      //remove item

      updateShoppingCart({
        userId: userData.id,
        foodId: cartItem.food?.id,
        updateQuantityBy: 0,
      });
      dispatch(removeFromCart({ cartItem, quantity: 0 }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <div>
        <label htmlFor="skipPayment">
          <input
            type="checkbox"
            id="skipPayment"
            checked={skipPayment}
            onChange={(e) => setSkipPayment(e.target.checked)}
          />
          Treci peste plată
        </label>
      </div>
      <button
        disabled={!stripe || isProcessing}
        className="btn btn-success mt-5 w-100"
      >
        <span id="button-text">
          {isProcessing ? "Se procesează..." : "Plasează comanda"}
        </span>
      </button>
    </form>
  );
};

export default PaymentForm;
