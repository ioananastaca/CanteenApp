namespace API.Models
{
    public class Food
    {
        public int Id { get; set; }
        public string Name { get; set; } 
        public string Description { get; set; } 
        public string ImageUrl { get; set; }
        public double Price { get; set; } 
        public int CategoryId { get; set; }
        public FoodCategory Category { get; set; }
        public int FoodTypeId { get; set; }
        public FoodType Type { get; set; }
        public List<FoodAllergen> FoodAllergens { get; set; }
    }
}