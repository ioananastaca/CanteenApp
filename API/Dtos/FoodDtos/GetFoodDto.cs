using API.Models;

namespace API.Dtos.FoodDtos
{
    public class GetFoodDto
    {
        public int Id { get; set; }
        public string Name { get; set; } 
        public string Description { get; set; } 
        public string ImageUrl { get; set; } 
        public decimal Price { get; set; } 
        public string CategoryName { get; set; } 
        public string FoodTypeName { get; set; } 
        public List<string> AllergenNames { get; set; }
    }
}