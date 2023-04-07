using API.Models.FoodDir;

namespace API.Models
{
    public class FoodAllergen
    {
        public int Id { get; set; }
        public int FoodId { get; set; }
        public Food Food { get; set; }
        public int AllergenId { get; set; }
        public Allergen Allergen {get; set;}
    }
}