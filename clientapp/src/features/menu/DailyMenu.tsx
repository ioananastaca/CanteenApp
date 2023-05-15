import React, { useState } from "react";
import Catalog from "../catalog/Catalog";

const DailyMenu = () => {
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const weekdays = ['Luni', 'Marti', 'Miercuri', 'Joi', 'Vineri'];

  const handleButtonClick = (buttonIndex: number) => {
    setActiveButton(buttonIndex);
  };

  return (
    <div>
      <h1>Menu</h1>
      <ul>
        {weekdays.map((weekday, index) => (
          <li key={weekday}>
            <button onClick={() => handleButtonClick(index)}>{weekday}</button>
          </li>
        ))}
      </ul>
      {activeButton !== null && (
        <div>
          <h2>{weekdays[activeButton]} was clicked!</h2>
          <Catalog />
          {/* Here you can import your empty React file */}
        </div>
      )}
    </div>
  );
};

export default DailyMenu;
