using API.Dtos.OrderDtos;
using API.Models;

namespace API.Services.OrderService
{
    public interface IOrderService
    {
        // Task<ServiceResponse<OrderDto>> AddOrder(OrderDto orderDto);
        Task<ServiceResponse<OrderDto>> AddItemToOrder(int foodId, int quantity, string address);
        Task<ServiceResponse<OrderDto>> RemoveItemOrder(int foodId, int quantity, int orderId);



    }
}