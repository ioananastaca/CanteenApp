using System.ComponentModel.DataAnnotations;

namespace API.Dtos.OrderDtos
{
    public class OrderDetailsCreateDto
    {
        [Required]
        public int FoodId { get; set; }
        [Required]
        public int Quantity { get; set; }
        [Required]
        public string FoodName { get; set; }
        [Required]
        public double Price { get; set; }
    }
}