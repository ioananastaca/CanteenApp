using API.Dtos.OrderDtos;
using API.Models;
using API.Services.OrderService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    [Route("[controller]")]
    public class OrderController : Controller
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost]
        public async Task<ActionResult<ServiceResponse<OrderDto>>> AddItemToOrder(int foodId, int quantity, string address)
        {
            var response = await _orderService.AddItemToOrder(foodId, quantity, address);

            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }
        [HttpDelete]
        public async Task<ActionResult<ServiceResponse<OrderDto>>> DeleteItemOrder(int foodId, int quantity, int orderId)
        {
            var response = await _orderService.RemoveItemOrder(foodId, quantity, orderId);

            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }
    }
}
