import React from "react";

import FoodItemList from "../Components/Page/Home/FoodItemList";
import { Banner } from "../Components/Page/Common";

function Home() {
   // Set the value of isLoggedIn based on whether a customer is logged in or not

  return (
    <div>
      <Banner />
      <div className="container p-2">
        <FoodItemList /> {/* Pass the isLoggedIn prop */}
      </div>
    </div>
  );
}

export default Home;
