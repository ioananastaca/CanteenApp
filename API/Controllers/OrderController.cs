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


        // [HttpPost]
        // public async Task<ActionResult<ApiResponse>> CreateOrder([FromBody] OrderHeaderCreateDto orderHeaderDTO)
        // {
        //     try
        //     {
        //         OrderHeader order = new()
        //         {
        //             ApplicationUserId = orderHeaderDTO.ApplicationUserId,
        //             PickupEmail = orderHeaderDTO.PickupEmail,
        //             PickupName = orderHeaderDTO.PickupName,
        //             PickupPhoneNumber = orderHeaderDTO.PickupPhoneNumber,
        //             OrderTotal = orderHeaderDTO.OrderTotal,
        //             OrderDate = DateTime.Now,
        //             StripePaymentIntentID = orderHeaderDTO.StripePaymentIntentID,
        //             TotalFoodItems = orderHeaderDTO.TotalItems,
        //             Status = String.IsNullOrEmpty(orderHeaderDTO.Status) ? SD.status_pending : orderHeaderDTO.Status,
        //         };

        //         if (ModelState.IsValid)
        //         {
        //             _db.OrderHeaders.Add(order);
        //             _db.SaveChanges();

        //             // Clear shopping cart data for the user
        //             var userId = orderHeaderDTO.ApplicationUserId;
        //             var userCart = _db.ShoppingCarts.FirstOrDefault(cart => cart.UserId == userId);
        //             if (userCart != null)
        //             {
        //                 _db.CartItems.RemoveRange(userCart.CartItems);
        //                 _db.SaveChanges();
        //             }

        //             foreach (var orderDetailDTO in orderHeaderDTO.OrderDetailsDTO)
        //             {
        //                 OrderDetails orderDetails = new()
        //                 {
        //                     OrderHeaderId = order.OrderHeaderId,
        //                     FoodName = orderDetailDTO.FoodName,
        //                     FoodId = orderDetailDTO.FoodId,
        //                     Price = orderDetailDTO.Price,
        //                     Quantity = orderDetailDTO.Quantity,
        //                 };
        //                 _db.OrderDetails.Add(orderDetails);
        //             }
        //             _db.SaveChanges();

        //             _response.Result = order;
        //             order.OrderDetails = null;
        //             _response.StatusCode = HttpStatusCode.Created;
        //             return Ok(_response);
        //         }
        //     }
        //     catch (Exception ex)
        //     {
        //         _response.IsSuccess = false;
        //         _response.ErrorMessages = new List<string>() { ex.ToString() };
        //     }
        //     return _response;
        // }
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


        [HttpGet("ordered-foods-currentday")]
        public async Task<ActionResult<ApiResponse>> GetOrderedFoodCurrentDay()
        {
            try
            {
                var currentDate = DateTime.Today;
                var orders = await _db.OrderHeaders
                    .Include(o => o.OrderDetails)
                    .Where(o => o.OrderDate.Date == currentDate)
                    .ToListAsync();

                var foodCounts = new Dictionary<string, int>();

                foreach (var order in orders)
                {
                    foreach (var orderDetail in order.OrderDetails)
                    {
                        if (foodCounts.ContainsKey(orderDetail.FoodName))
                        {
                            foodCounts[orderDetail.FoodName] += orderDetail.Quantity;
                        }
                        else
                        {
                            foodCounts[orderDetail.FoodName] = orderDetail.Quantity;
                        }
                    }
                }

                var result = foodCounts.ToDictionary(kv => kv.Key, kv => kv.Value);

                _response.Result = result;
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

        // statistici 


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

        [HttpGet("total-payed-orders")]
        public async Task<ActionResult<ApiResponse>> GetTotalPayedOrders()
        {
            try
            {
                var orders = await _db.OrderHeaders.ToListAsync(); // Retrieve all orders

                var pendingCount = orders.Count(u => u.Status == "Pending");
                var confirmedCount = orders.Count(u => u.Status == "Confirmed");

                var result = new
                {
                    Pending = pendingCount,
                    Confirmed = confirmedCount
                };

                _response.Result = result;
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
        [HttpGet("top-ordered-foods")]
        public async Task<ActionResult<ApiResponse>> GetTopOrderedFoods()
        {
            try
            {
                var orders = await _db.OrderHeaders
                    .Include(o => o.OrderDetails)
                    .ToListAsync(); // Preia toate comenzile și detaliile acestora

                var foodQuantities = new Dictionary<string, int>();

                foreach (var order in orders)
                {
                    foreach (var orderDetail in order.OrderDetails)
                    {
                        if (foodQuantities.ContainsKey(orderDetail.FoodName))
                        {
                            foodQuantities[orderDetail.FoodName] += orderDetail.Quantity;
                        }
                        else
                        {
                            foodQuantities[orderDetail.FoodName] = orderDetail.Quantity;
                        }
                    }
                }

                var topFoods = foodQuantities.OrderByDescending(kv => kv.Value).Take(5);

                var result = topFoods.ToDictionary(kv => kv.Key, kv => kv.Value);

                _response.Result = result;
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


        // [HttpGet("category-order-count")]
        // public async Task<ActionResult<ApiResponse>> GetCategoryOrderCount()
        // {
        //     try
        //     {
        //         var foodCategories = await _db.FoodCategories.Include(fc => fc.Foods).ToListAsync();

        //         var categoryOrderCounts = new Dictionary<string, int>();

        //         foreach (var category in foodCategories)
        //         {
        //             var orderCount = _db.OrderDetails
        //                 .ToList()
        //                 .Count(od => category.Foods.Any(food => food.Id == od.FoodId));

        //             categoryOrderCounts.Add(category.Name, orderCount);
        //         }

        //         var result = categoryOrderCounts.Select(kv => new
        //         {
        //             CategoryName = kv.Key,
        //             TotalOrderedProducts = kv.Value
        //         });

        //         var response = new ApiResponse
        //         {
        //             StatusCode = HttpStatusCode.OK,
        //             IsSuccess = true,
        //             Result = result
        //         };

        //         return Ok(response);
        //     }
        //     catch (Exception ex)
        //     {
        //         var response = new ApiResponse
        //         {
        //             StatusCode = HttpStatusCode.InternalServerError,
        //             IsSuccess = false,
        //             ErrorMessages = new List<string> { ex.ToString() }
        //         };

        //         return StatusCode((int)HttpStatusCode.InternalServerError, response);
        //     }
        // }
[HttpGet("category-order-count")]
public async Task<ActionResult<Dictionary<string, int>>> GetCategoryOrderCount()
{
    try
    {
        var foodCategories = await _db.FoodCategories.Include(fc => fc.Foods).ToListAsync();

        var categoryOrderCounts = new Dictionary<string, int>();

        var orders = await _db.OrderHeaders.Include(o => o.OrderDetails).ToListAsync();

        foreach (var order in orders)
        {
            foreach (var orderDetail in order.OrderDetails)
            {
                var food = foodCategories
                    .SelectMany(fc => fc.Foods)
                    .FirstOrDefault(f => f.Id == orderDetail.FoodId);

                if (food != null)
                {
                    if (categoryOrderCounts.ContainsKey(food.Category.Name))
                    {
                        categoryOrderCounts[food.Category.Name] += orderDetail.Quantity;
                    }
                    else
                    {
                        categoryOrderCounts[food.Category.Name] = orderDetail.Quantity;
                    }
                }
            }
        }

        return categoryOrderCounts;
    }
    catch (Exception ex)
    {
        // În cazul unei erori, puteți returna un mesaj de eroare sau un cod de stare corespunzător
        return StatusCode((int)HttpStatusCode.InternalServerError, ex.ToString());
    }
}




        [HttpGet("ordered-foods")]
        public async Task<ActionResult<ApiResponse>> GetOrderedFoods()
        {
            try
            {
                var orders = await _db.OrderHeaders.Include(o => o.OrderDetails).ToListAsync(); // Preia toate comenzile și detaliile acestora

                var foodCountsByDay = new Dictionary<DateTime, Dictionary<string, int>>();

                foreach (var order in orders)
                {
                    var orderDate = order.OrderDate.Date;

                    if (!foodCountsByDay.ContainsKey(orderDate))
                    {
                        foodCountsByDay[orderDate] = new Dictionary<string, int>();
                    }

                    foreach (var orderDetail in order.OrderDetails)
                    {
                        if (foodCountsByDay[orderDate].ContainsKey(orderDetail.FoodName))
                        {
                            foodCountsByDay[orderDate][orderDetail.FoodName]++;
                        }
                        else
                        {
                            foodCountsByDay[orderDate][orderDetail.FoodName] = 1;
                        }
                    }
                }

                var result = foodCountsByDay.Select(kv => new
                {
                    Date = kv.Key,
                    Foods = kv.Value
                }).ToList();

                _response.Result = result;
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