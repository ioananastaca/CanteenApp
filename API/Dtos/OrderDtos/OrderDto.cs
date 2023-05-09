namespace API.Dtos.OrderDtos
{
    public class OrderDto
    {
        public int OrderId { get; set; }
        public int UserId { get; set; }
        public DateTime Date { get; set; }
        public string Address { get; set; }
        public bool IsPaid { get; set; }
        public List<OrderItemDto> OrderItems { get; set; }
    }
}