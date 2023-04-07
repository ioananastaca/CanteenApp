namespace API.Models.FoodDir
{
    public class Allergen
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<FoodAllergen> FoodAllergens { get; set; }
    }
}