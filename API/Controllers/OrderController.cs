using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using API.Data;
using API.Dtos.OrderDtos;
using API.Models;
using API.Models.Order;
using API.Utility;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly DataContext _db;
        private ApiResponse _response;
        public OrderController(DataContext db)
        {
            _db = db;
            _response = new ApiResponse();
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse>> GetOrders(string? userId)
        {
            try
            {
                var orderHeaders = _db.OrderHeaders.Include(u => u.OrderDetails)
                    .ThenInclude(u => u.Food)
                    .OrderByDescending(u => u.OrderHeaderId);
                if (!string.IsNullOrEmpty(userId))
                {
                    _response.Result = orderHeaders.Where(u => u.ApplicationUserId == userId);
                }
                else
                {
                    _response.Result = orderHeaders;
                }
                _response.StatusCode = HttpStatusCode.OK;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages
                     = new List<string>() { ex.ToString() };
            }
            return _response;
        }


        [HttpGet("{id:int}")]
        public async Task<ActionResult<ApiResponse>> GetOrders(int id)
        {
            try
            {
                if (id == 0)
                {
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    return BadRequest(_response);
                }


                var orderHeaders = _db.OrderHeaders.Include(u => u.OrderDetails)
                    .ThenInclude(u => u.Food)
                    .Where(u => u.OrderHeaderId == id);
                if (orderHeaders == null)
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    return NotFound(_response);
                }
                _response.Result = orderHeaders;
                _response.StatusCode = HttpStatusCode.OK;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages
                     = new List<string>() { ex.ToString() };
            }
            return _response;
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse>> CreateOrder([FromBody] OrderHeaderCreateDto orderHeaderDTO)
        {
            try
            {
                OrderHeader order = new()
                {
                    ApplicationUserId = orderHeaderDTO.ApplicationUserId,
                    PickupEmail = orderHeaderDTO.PickupEmail,
                    PickupName = orderHeaderDTO.PickupName,
                    PickupPhoneNumber = orderHeaderDTO.PickupPhoneNumber,
                    OrderTotal = orderHeaderDTO.OrderTotal,
                    OrderDate = DateTime.Now,
                    StripePaymentIntentID = orderHeaderDTO.StripePaymentIntentID,
                    TotalFoodItems = orderHeaderDTO.TotalItems,
                    Status = String.IsNullOrEmpty(orderHeaderDTO.Status) ? SD.status_pending : orderHeaderDTO.Status,
                };

                if (ModelState.IsValid)
                {
                    _db.OrderHeaders.Add(order);
                    _db.SaveChanges();
                    foreach (var orderDetailDTO in orderHeaderDTO.OrderDetailsDTO)
                    {
                        OrderDetails orderDetails = new()
                        {
                            OrderHeaderId = order.OrderHeaderId,
                            FoodName = orderDetailDTO.FoodName,
                            FoodId = orderDetailDTO.FoodId,
                            Price = orderDetailDTO.Price,
                            Quantity = orderDetailDTO.Quantity,
                        };
                        _db.OrderDetails.Add(orderDetails);
                    }
                    _db.SaveChanges();
                    _response.Result = order;
                    order.OrderDetails = null;
                    _response.StatusCode = HttpStatusCode.Created;
                    return Ok(_response);
                }
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages
                     = new List<string>() { ex.ToString() };
            }
            return _response;
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<ApiResponse>> UpdateOrderHeader(int id, [FromBody] OrderHeaderUpdateDto orderHeaderUpdateDTO)
        {
            try
            {
                if (orderHeaderUpdateDTO == null || id != orderHeaderUpdateDTO.OrderHeaderId)
                {
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    return BadRequest();
                }
                OrderHeader orderFromDb = _db.OrderHeaders.FirstOrDefault(u => u.OrderHeaderId == id);

                if (orderFromDb == null)
                {
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    return BadRequest();
                }
                if (!string.IsNullOrEmpty(orderHeaderUpdateDTO.PickupName))
                {
                    orderFromDb.PickupName = orderHeaderUpdateDTO.PickupName;
                }
                if (!string.IsNullOrEmpty(orderHeaderUpdateDTO.PickupPhoneNumber))
                {
                    orderFromDb.PickupPhoneNumber = orderHeaderUpdateDTO.PickupPhoneNumber;
                }
                if (!string.IsNullOrEmpty(orderHeaderUpdateDTO.PickupEmail))
                {
                    orderFromDb.PickupEmail = orderHeaderUpdateDTO.PickupEmail;
                }
                if (!string.IsNullOrEmpty(orderHeaderUpdateDTO.Status))
                {
                    orderFromDb.Status = orderHeaderUpdateDTO.Status;
                }
                if (!string.IsNullOrEmpty(orderHeaderUpdateDTO.StripePaymentIntentID))
                {
                    orderFromDb.StripePaymentIntentID = orderHeaderUpdateDTO.StripePaymentIntentID;
                }
                _db.SaveChanges();
                _response.StatusCode = HttpStatusCode.NoContent;
                _response.IsSuccess = true;
                return Ok(_response);

            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages
                     = new List<string>() { ex.ToString() };
            }
            return _response;
        }
        // [HttpGet("total-amount-per-day")]
        // public async Task<ActionResult<ApiResponse>> GetTotalAmountPerDay()
        // {
        //     try
        //     {
        //         var orders = await _db.OrderHeaders
        //             .ToListAsync(); // Retrieve all orders

        //         var filteredOrders = orders
        //             .Where(u => u.OrderDate.DayOfWeek >= DayOfWeek.Monday && u.OrderDate.DayOfWeek <= DayOfWeek.Friday)
        //             .GroupBy(u => u.OrderDate.DayOfWeek)
        //             .Select(g => new
        //             {
        //                 DayOfWeek = g.Key,
        //                 TotalAmount = g.Sum(u => u.OrderTotal)
        //             })
        //             .ToList(); // Perform filtering and grouping on the client side

        //         _response.Result = filteredOrders;
        //         _response.StatusCode = HttpStatusCode.OK;
        //         return Ok(_response);
        //     }
        //     catch (Exception ex)
        //     {
        //         _response.IsSuccess = false;
        //         _response.ErrorMessages = new List<string>() { ex.ToString() };
        //     }
        //     return _response;
        // }

        // [HttpGet("total-amount-per-week")]
        // public async Task<ActionResult<ApiResponse>> GetTotalAmountPerWeek()
        // {
        //     try
        //     {
        //         var orders = await _db.OrderHeaders
        //             .ToListAsync(); // Retrieve all orders

        //         var filteredOrders = orders
        //             .Where(u => u.OrderDate >= DateTime.Today.AddDays(-7)) // Filter orders for the last week
        //             .GroupBy(u => u.OrderDate.Date)
        //             .Select(g => new
        //             {
        //                 WeekStartDate = g.Key.ToString("yyyy-MM-dd"),
        //                 TotalAmount = g.Sum(u => u.OrderTotal)
        //             })
        //             .ToList(); // Perform filtering and grouping on the client side

        //         _response.Result = filteredOrders;
        //         _response.StatusCode = HttpStatusCode.OK;
        //         return Ok(_response);
        //     }
        //     catch (Exception ex)
        //     {
        //         _response.IsSuccess = false;
        //         _response.ErrorMessages = new List<string>() { ex.ToString() };
        //     }
        //     return _response;
        // }

        [HttpGet("total-amount-per-week")]
        public async Task<ActionResult<ApiResponse>> GetTotalAmountPerWeek()
        {
            try
            {
                var orders = await _db.OrderHeaders
                    .ToListAsync(); // Retrieve all orders

                var filteredOrders = orders
                    .Where(u => u.OrderDate >= DateTime.Today.AddDays(-20)) // Filter orders for the last 5 days
                    .GroupBy(u => u.OrderDate.Date)
                    .Select(g => new
                    {
                        OrderDate = g.Key.ToString("yyyy-MM-dd"),
                        TotalAmount = g.Sum(u => u.OrderTotal)
                    })
                    .ToList(); // Perform filtering and grouping on the client side

                _response.Result = filteredOrders;
                _response.StatusCode = HttpStatusCode.OK;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages = new List<string>() { ex.ToString() };
            }
            return _response;
        }




    }
}