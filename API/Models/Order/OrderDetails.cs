using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models.Order
{
    public class OrderDetails
    {
         [Key]
        public int OrderDetailId { get; set; }
        [Required]
        public int OrderHeaderId { get; set; }
        [Required]
        public int FoodId { get; set; }
        [ForeignKey("FoodId")]
        public Food Food{ get; set; }
        [Required]
        public int Quantity { get; set; }
        [Required]
        public string FoodName { get; set; }
        [Required]
        public double Price { get; set; }
    }
}