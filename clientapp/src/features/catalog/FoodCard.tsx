import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { Food } from "../../app/models/food";
import { Link } from "react-router-dom";

interface Props {
  food: Food;
}

export default function FoodCard({ food }: Props) {
  return (
    <Card>
      <CardMedia sx={{ height: 140 }} image={food.imageUrl} title={food.name} />
      <CardContent>
        <Typography gutterBottom variant="h5" color="secondary">
          {food.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {food.description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ${food.price}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Adauga la comanda</Button>
        <Button component={Link} to={`/catalog/${food.id}`} size="small">
          Detalii
        </Button>
      </CardActions>
    </Card>
  );
}
