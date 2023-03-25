import { Grid } from "@mui/material";
import { Food } from "../../app/models/food";
import FoodCard from "./FoodCard";

interface Props {
  foods: Food[];
}

export default function FoodList({ foods }: Props) {
  return (
    <Grid container spacing={4}>
      {foods.map((food) => (
        <Grid item xs={3} key={food.id}>
          <FoodCard food={food} />
        </Grid>
      ))}
    </Grid>
  );
}
