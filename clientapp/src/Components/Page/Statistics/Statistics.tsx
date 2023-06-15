import React from 'react'

function Statistics() {
  const data = [
    { week: "Week 1", totalOrders: Math.floor(Math.random() * 100) },
    { week: "Week 2", totalOrders: Math.floor(Math.random() * 100) },
    { week: "Week 3", totalOrders: Math.floor(Math.random() * 100) },
    { week: "Week 4", totalOrders: Math.floor(Math.random() * 100) },
    { week: "Week 5", totalOrders: Math.floor(Math.random() * 100) },
  ];

  // Calculate the maximum value of total orders for scaling the bar heights
  const maxTotalOrders = Math.max(...data.map((item) => item.totalOrders));

  return (
    <div className="bar-chart-container">
      <div className="bar-chart">
        {data.map((item) => (
          <div
            key={item.week}
            className="bar"
            style={{ height: `${(item.totalOrders / maxTotalOrders) * 100}%` }}
          >
            <div className="bar-label">{item.totalOrders}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Statistics