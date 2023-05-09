namespace API.Models.OderDir
{
    public class Order
    {
        public int OrderId { get; set; }
        public int UserId { get; set; }
        public DateTime Date { get; set; }
        public string Address { get; set; }
        public bool IsPaid { get; set; }
        public List<OrderItem> OrderItems { get; set; }
        public User User { get; set; }
    }
}