import { Grid, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Food } from "../../app/models/food";

export default function FoodDetails() {
  const { id } = useParams<{ id: string }>();
  const [food, setFood] = useState<Food | null>(null);
  const [loading, SetLoading] = useState(true);

  useEffect(() => {
 
    axios.get(`http://localhost:5000/api/Food/${id}`)
      .then((response) => setFood(response.data))
      .catch((error) => console.log(error))
      .finally(() => SetLoading(false));
  }, [id]);

  if (loading) return <h3>Loading...</h3>;

  if (!food) return <h3>Food not found!</h3>;
  console.log(food);
  return (
     <Grid container spacing={6}>
      <Grid item xs={6}>
        <img src={food?.imageUrl} alt={food?.name} style={{width:'100%'}}/>
      </Grid>
      <Grid item xs={6}>
      <Typography variant='h3'>{food?.name || 'Food name not found'}</Typography>
      </Grid>

     </Grid>
  
  );
}
