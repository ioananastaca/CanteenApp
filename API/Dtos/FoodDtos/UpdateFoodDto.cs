namespace API.Dtos.FoodDtos
{
    public class UpdateFoodDto
    {
        public string? Name { get; set; } 
        public string? Description { get; set; } 
        public string? ImageUrl { get; set; } 
        public decimal? Price { get; set; } 
        public int? CategoryId { get; set; }
        public int? FoodTypeId { get; set; }
    }
}