import React, { useState, useEffect } from "react";
import { MainLoader } from "../Common";
import OrderListProps from "./orderListType";
import { orderHeaderModel, userModel } from "../../../Interfaces";
import { useNavigate } from "react-router-dom";
import { SD_Roles, SD_Status } from "../../../Utility/SD";
import { useSelector } from "react-redux";
import { RootState } from "../../../Storage/Redux/store";

function OrderList({ isLoading, orderData }: OrderListProps) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const daysPerPage = 3;
  const [orderedFoods, setOrderedFoods] = useState<{ [food: string]: number }>({});

  useEffect(() => {
    const fetchOrderedFoods = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/Order/ordered-foods-currentday");
        const data = await response.json();
        if (data.statusCode === 200 && data.isSuccess) {
          setOrderedFoods(data.result);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrderedFoods();
  }, []);

  const groupedOrders: { [date: string]: orderHeaderModel[] } = {};

  orderData.forEach((orderItem) => {
    const date = new Date(orderItem.orderDate!).toLocaleDateString();
    if (groupedOrders[date]) {
      groupedOrders[date].push(orderItem);
    } else {
      groupedOrders[date] = [orderItem];
    }
  });

  // Calculate pagination
  const indexOfLastDay = currentPage * daysPerPage;
  const indexOfFirstDay = indexOfLastDay - daysPerPage;
  const currentDays = Object.keys(groupedOrders).slice(
    indexOfFirstDay,
    indexOfLastDay
  );

  const totalPages = Math.ceil(Object.keys(groupedOrders).length / daysPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <div className="table p-5">
          {userData.role === SD_Roles.CUTOMER && (
          <h1 className="text-success">Comenzile mele</h1>)}
          <div className="p-2">
          {userData.role === SD_Roles.ADMIN && (
            <div className="row border mb-3">
              <div className="col-12">
                <h2 className="text-primary">Alimente comandate astăzi:</h2>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nume aliment</th>
                      <th>Cantitate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(orderedFoods).map(([food, quantity]) => (
                      <tr key={food}>
                        <td>{food}</td>
                        <td>{quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>)}
            {currentDays.map((date) => (
              <div key={date}>
                <h2 className="text-primary">{date}</h2>
                <div className="row border d-flex">
                  <div className="col-1">ID</div>
                  <div className="col-2">Nume</div>
                  <div className="col-2">Telefon</div>
                  <div className="col-1">Total</div>
                  <div className="col-2">Data</div>
                  <div className="col-2">Plata</div>
                  <div className="col-2 d-flex justify-content-end">
                    Detalii
                  </div>
                </div>
                {groupedOrders[date].map((orderItem: orderHeaderModel) => (
                  <div className="row border" key={orderItem.orderHeaderId}>
                    <div className="col-1">{orderItem.orderHeaderId}</div>
                    <div className="col-2">{orderItem.pickupName}</div>
                    <div className="col-2">{orderItem.pickupPhoneNumber}</div>
                    <div className="col-1">
                      {orderItem.orderTotal!.toFixed(2)} RON
                    </div>
                    <div className="col-2">
                      {new Date(orderItem.orderDate!).toLocaleString("en-US", {
                        hour12: true,
                      })}
                    </div>
                    <div className="col-2">
                      <span
                        className={`text-${
                          orderItem.status === SD_Status.CONFIRMED
                            ? "success"
                            : "danger"
                        }`}
                      >
                        {orderItem.status === SD_Status.CONFIRMED ? "Da" : "Nu"}
                      </span>
                    </div>
                    <div className="col-2 d-flex align-items-center justify-content-end">
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
                ))}
              </div>
            ))}
            {totalPages > 1 && (
              <nav>
                <ul className="pagination">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <li
                      key={index}
                      className={`page-item ${
                        currentPage === index + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default OrderList;
