using API.Dtos.OrderDtos;
using API.Models;

namespace API.Services.OrderService
{
    public interface IOrderService
    {
        // Task<ServiceResponse<OrderDto>> AddOrder(OrderDto orderDto);
            Task<ServiceResponse<OrderDto>>AddOrder(string address, List<int> foodIds);

    }
}