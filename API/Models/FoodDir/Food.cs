namespace API.Models
{
    public class Food
    {
        public int Id { get; set; }
        public string Name { get; set; } = "default";
        public string Description { get; set; } = "default";
        public string ImageUrl { get; set; } = "default";
        public decimal Price { get; set; } = 19.9m;
        public int CategoryId { get; set; }
        public FoodCategory Category { get; set; }
        public int FoodTypeId { get; set; }
        public FoodType Type { get; set; }
        public List<FoodAllergen> FoodAllergens { get; set; }
    }
}