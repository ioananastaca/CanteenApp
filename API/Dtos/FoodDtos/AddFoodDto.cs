namespace API.Dtos.FoodDtos
{
    public class AddFoodDto
    {
        public string Name { get; set; } = "default";
        public string Description { get; set; } = "default";
        public string ImageUrl { get; set; } = "default";
        public decimal Price { get; set; } = 19.9m;
        public int CategoryId{ get; set; } 
        public int FoodTypeId { get; set; } 
    }
}