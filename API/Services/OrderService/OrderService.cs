using System.Security.Claims;
using API.Data;
using API.Dtos.OrderDtos;
using API.Models;
using API.Models.OderDir;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Services.OrderService
{
    public class OrderService : IOrderService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;


        public OrderService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;

        }
        public async Task<ServiceResponse<OrderDto>> AddOrder(string address, List<int> foodIds)
        {
            var serviceResponse = new ServiceResponse<OrderDto>();

            // Hardcode user id as 1 (you can change this as needed)
            int userId = 1;

            // Create a new order instance
            var order = new Order
            {
                UserId = userId,
                Date = DateTime.Now,
                IsPaid = false
            };

            // Get the highest order ID in the database and add 1 to autoincrement
            // order.OrderId = await _context.Orders.CountAsync() + 1;

            // Create a list to hold the order items
            var orderItems = new List<OrderItem>();

            // Loop through the food IDs and create order items
            foreach (var foodId in foodIds)
            {
                // Get the food by ID
                var food = await _context.Foods.FindAsync(foodId);

                // Check if the food exists
                if (food == null)
                {
                    serviceResponse.Success = false;
                    serviceResponse.Message = $"Food with ID {foodId} not found.";
                    return serviceResponse;
                }

                // Create a new order item instance
                var orderItem = new OrderItem
                {
                    FoodId = food.Id,
                    Quantity = 1, // Set default quantity to 1
                    Price = food.Price
                };

                // Get the highest order item ID for this order and add 1 to autoincrement
                // orderItem.OrderItemId = orderItems.Count() + 1;

                // Add the order item to the list
                orderItems.Add(orderItem);
            }

            // Set the address and order items on the order instance
            order.Address = address;
            order.OrderItems = orderItems;

            // Add the order instance to the database and save changes
            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();

            // Map the order instance to a DTO and set it as the response data
            var resultDto = _mapper.Map<OrderDto>(order);
            serviceResponse.Data = resultDto;

            return serviceResponse;
        }

    }
}