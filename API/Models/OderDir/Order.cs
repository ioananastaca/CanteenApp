using Microsoft.AspNetCore.Http.Features;

namespace API.Models.OderDir
{
    public class Order
    {
        public int OrderId { get; set; }
        public int UserId { get; set; }
        public DateTime Date { get; set; }
        public string Address { get; set; }
        public bool IsPaid { get; set; }
        public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public User User { get; set; }

        public void AddFood(Food food, int quantity)
        {
            if (OrderItems.All(item => item.FoodId != food.Id))
            {
                OrderItems.Add(new OrderItem { Food = food, Quantity = quantity});
            }

            var existingItem = OrderItems.FirstOrDefault(item => item.FoodId == food.Id);
            if (existingItem != null) existingItem.Quantity += quantity;
        }

        public void RemoveFood(int foodId, int quantity)
        {
            var item = OrderItems.FirstOrDefault(item => item.FoodId == foodId);
            if (item == null) return;
            item.Quantity -= quantity;
            if (item.Quantity == 0) OrderItems.Remove(item);
        }
    }
}