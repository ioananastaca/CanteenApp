import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

interface OrderData {
  orderDate: string;
  totalAmount: number;
}

interface CategoryOrderData {
  categoryName: string;
  totalOrderedCount: number;
}

const Statistics: React.FC = () => {
  const [chartData, setChartData] = useState<OrderData[]>([]);
  const [totalPending, setTotalPending] = useState<number>(0);
  const [totalConfirmed, setTotalConfirmed] = useState<number>(0);
  const [topFoodData, setTopFoodData] = useState<
    { foodName: string; orderCount: number }[]
  >([]);
  const [categoryOrderData, setCategoryOrderData] = useState<
    CategoryOrderData[]
  >([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/Order/total-amount-per-week"
      );
      const data = await response.json();
      setChartData(data.result);

      const payedOrdersResponse = await fetch(
        "http://localhost:5000/api/Order/total-payed-orders"
      );
      const payedOrdersData = await payedOrdersResponse.json();
      setTotalPending(payedOrdersData.result.pending);
      setTotalConfirmed(payedOrdersData.result.confirmed);

      const topFoodResponse = await fetch(
        "http://localhost:5000/api/Order/top-ordered-foods"
      );
      const topFoodData = await topFoodResponse.json();
      setTopFoodData(
        Object.entries(topFoodData.result).map(
          ([foodName, orderCount]: [string, unknown]) => ({
            foodName: foodName as string,
            orderCount: orderCount as number,
          })
        )
      );

      const categoryOrderResponse = await fetch(
        "http://localhost:5000/api/Order/category-order-count"
      );
      const categoryOrderData = await categoryOrderResponse.json();
      setCategoryOrderData(
        Object.entries(categoryOrderData).map(
          ([categoryName, totalOrderedCount]) => ({
            categoryName,
            totalOrderedCount: totalOrderedCount as number,
          })
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const chartOptions = {
    chartArea: { width: "70%", height: "70%" },
    hAxis: {
      title: "Data",
    },
    vAxis: {
      title: "Total",
      minValue: 0,
    },
  };

  const chartRows = chartData.map((item) => [item.orderDate, item.totalAmount]);
  const chartColumns = [
    { type: "string", label: "Data" },
    { type: "number", label: "Total comenzi in RON" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gridGap: "20px",
      }}
    >
      <div>
        <h2>Total comenzi plasate plătite și neplătite</h2>
        <Chart
          width="100%"
          height="300px"
          chartType="PieChart"
          loader={<div>Loading Chart</div>}
          data={[
            ["Status", "Total"],
            ["Comenzi neplătite", totalPending],
            ["Comenzi plătite", totalConfirmed],
          ]}
          options={{
            title: "Numărul de comenzi",
          }}
        />
      </div>
      <div>
        <h2>Top 5 alimente</h2>
        <Chart
          width="100%"
          height="400px"
          chartType="Bar"
          loader={<div>Loading Chart</div>}
          data={[
            ["Nume aliment", "Număr comenzi"],
            ...topFoodData.map((item) => [item.foodName, item.orderCount]),
          ]}
          options={{
            title: "Cele mai comandate alimente",
          }}
        />
      </div>

      <div>
        <h2>Categorii de produse cu cea mai mare cantitate comandată</h2>
        <Chart
          width="100%"
          height="400px"
          chartType="Bar"
          loader={<div>Loading Chart</div>}
          data={[
            ["Categorie", "Cantitate"],
            ...categoryOrderData.map((item) => [
              item.categoryName,
              item.totalOrderedCount,
            ]),
          ]}
          options={{
            title: "Categorii de produse cu cea mai mare cantitate comandată",
          }}
        />
      </div>
      <div>
        <h2>Total încasări din ultima săptămână</h2>
        <Chart
          width="100%"
          height="400px"
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={[chartColumns, ...chartRows]}
          options={chartOptions}
        />
      </div>
    </div>
  );
};

export default Statistics;
