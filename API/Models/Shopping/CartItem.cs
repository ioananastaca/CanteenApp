using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models.Shopping
{
    public class CartItem
    {
        public int Id { get; set; }
        public int FoodId { get; set; }
        [ForeignKey("FoodId")]
        public Food Food { get; set; } = new();
        public int Quantity { get; set; }
        public int ShoppingCartId { get; set; }
    }
}