import React, { useState } from "react";
import "./banner.css";
import { useDispatch } from "react-redux";
import { setSearchItem } from "../../../Storage/Redux/foodItemSlice";

function Banner() {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();

  const handleSearch = () => {
    dispatch(setSearchItem(value));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const currentTime = new Date();
  const isAfter12 = currentTime.getHours() >= 12;

  return (
    <div className="custom-banner">
      <div className="custom-banner-content">
        {isAfter12 ? (
          <h1 className="custom-banner-text">
            Ne pare rau dar timpul alocat plasării comenzilor online a expirat! Te asteptăm la locație!
          </h1>
        ) : (
          <div>  <h1 className="custom-banner-text">Bun venit pe Cantina USV!</h1>
          <p className="custom-banner-subtext">Vezi ce ți-am pregătit pentru azi</p>
          <h1 className="custom-banner-text">Grăbește-te să plasezi comanda până în ora 12:00</h1></div>
        )}
       
        <p className="custom-banner-subtext">Noi deschidem la 12:30 și vrem să ai totul gata</p>
      </div>
    </div>
  );
}

export default Banner;
