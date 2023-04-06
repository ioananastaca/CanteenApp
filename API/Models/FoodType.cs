namespace API.Models
{
    public class FoodType
    {
        public int Id { get; set; }
        public string Name { get; set; } 
         public List<Food> Foods { get; set; }

    }
}