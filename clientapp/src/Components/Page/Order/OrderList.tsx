import React from "react";

import { MainLoader } from "../Common";
import OrderListProps from "./orderListType";
import { orderHeaderModel } from "../../../Interfaces";
import { useNavigate } from "react-router-dom";

function OrderList({ isLoading, orderData }: OrderListProps) {
    const navigate=useNavigate();
  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <div className="table p-5">
          <h1 className="text-success">Comenzile mele</h1>
          <div className="p-2">
            <div className="row border">
              <div className="col-1">ID</div>
              <div className="col-3">Nume</div>
              <div className="col-2">Telefon</div>
              <div className="col-1">Total</div>
              <div className="col-2">Data</div>
              <div className="col-2"></div>
            </div>
            {orderData.map((orderItem: orderHeaderModel) => {
              return (
                <div className="row border" key={orderItem.orderHeaderId}>
                  <div className="col-1">{orderItem.orderHeaderId}</div>
                  <div className="col-3">{orderItem.pickupName}</div>
                  <div className="col-2">{orderItem.pickupPhoneNumber}</div>
                  <div className="col-1">
                    {orderItem.orderTotal!.toFixed(2)} RON
                  </div>
                  <div className="col-2">
                  {new Date(orderItem.orderDate!).toLocaleString('en-US', { hour12: true })}
                  </div>
                  <div className="col-2">
                  <button
                      className="btn btn-success"
                      onClick={() =>
                        navigate(
                          "/order/orderDetails/" + orderItem.orderHeaderId
                        )
                      }
                    >
                      Detalii
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default OrderList;