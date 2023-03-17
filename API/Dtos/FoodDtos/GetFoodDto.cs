namespace API.Dtos.FoodDtos
{
    public class GetFoodDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "default";
        public string Description { get; set; } = "default";
        public string ImageUrl { get; set; } = "default";
        public decimal Price { get; set; } = 19.9m;
    }
}