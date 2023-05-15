import { useEffect, useState } from "react";
import { Food } from "../../app/models/food";
import FoodList from "./FoodList";

export default function Catalog() {
  const [foods, setFoods] = useState<Food[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/Food/GetAll")
      .then((response) => response.json())
      .then((data) => setFoods(data.data));
  }, []);

  // function addFood() {
  //   setFoods((prevState) => [
  //     ...prevState,
  //     {
  //       id: prevState.length + 101,
  //       name: "food" + (prevState.length + 1),
  //       description: "description" + (prevState.length + 1),
  //       ImageUrl: "https://picsum.photos/200",
  //       price: 19.99,
  //     },
  //   ]);
  // }

  return (
    <>
      <FoodList foods={foods} />
      {/* <Button variant="contained" onClick={addFood}>
        Add food
      </Button> */}
    </>
  );
}
