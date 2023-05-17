using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using API.Data;
using API.Models;
using API.Models.Shopping;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShoppingCartController : ControllerBase
    {
        private readonly DataContext _db;
        protected ApiResponse _response;
        public ShoppingCartController(DataContext db)
        {
            _db = db;
            _response = new();
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse>> GetShoppingCart(string userId)
        {
            try
            {
                ShoppingCart shoppingCart;
                if (string.IsNullOrEmpty(userId))
                {
                    shoppingCart = new();
                }
                else
                {
                    shoppingCart = _db.ShoppingCarts
                                       .Include(u => u.CartItems).ThenInclude(u => u.Food)
                                       .FirstOrDefault(u => u.UserId == userId);
                }


                if (shoppingCart.CartItems != null && shoppingCart.CartItems.Count > 0)
                {
                    shoppingCart.CartTotal = shoppingCart.CartItems.Sum(u => u.Quantity * u.Food.Price);
                }
                _response.Result = shoppingCart;
                _response.StatusCode = HttpStatusCode.OK;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages
                     = new List<string>() { ex.ToString() };
                _response.StatusCode = HttpStatusCode.BadRequest;
            }
            return _response;
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse>> AddOrUpdateItemInCart(string userId, int foodId, int updateQuantityBy)
        {
            // Shopping cart will have one entry per user id, even if a user has many items in cart.
            // Cart items will have all the items in shopping cart for a user
            // updatequantityby will have count by with an items quantity needs to be updated
            // if it is -1 that means we have lower a count if it is 5 it means we have to add 5 count to existing count.
            // if updatequantityby by is 0, item will be removed


            // when a user adds a new item to a new shopping cart for the first time
            // when a user adds a new item to an existing shopping cart (basically user has other items in cart)
            // when a user updates an existing item count
            // when a user removes an existing item

            ShoppingCart shoppingCart = _db.ShoppingCarts.Include(u => u.CartItems).FirstOrDefault(u => u.UserId == userId);
            Food food = _db.Foods.FirstOrDefault(u => u.Id == foodId);
            if (food == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                return BadRequest(_response);
            }
            if (shoppingCart == null && updateQuantityBy > 0)
            {
                //create a shopping cart & add cart item

                ShoppingCart newCart = new() { UserId = userId };
                _db.ShoppingCarts.Add(newCart);
                _db.SaveChanges();

                CartItem newCartItem = new()
                {
                    FoodId = foodId,
                    Quantity = updateQuantityBy,
                    ShoppingCartId = newCart.Id,
                    Food = null
                };
                _db.CartItems.Add(newCartItem);
                _db.SaveChanges();
            }
            else
            {
                //shopping cart exists

                CartItem cartItemInCart = shoppingCart.CartItems.FirstOrDefault(u => u.FoodId == foodId);
                if (cartItemInCart == null)
                {
                    CartItem newCartItem = new()
                    {
                        FoodId = foodId,
                        Quantity = updateQuantityBy,
                        ShoppingCartId = shoppingCart.Id,
                        Food = null
                    };
                    _db.CartItems.Add(newCartItem);
                    _db.SaveChanges();
                }
                else
                {
                    int newQuantity = cartItemInCart.Quantity + updateQuantityBy;
                    if (updateQuantityBy == 0 || newQuantity <= 0)
                    {
                        _db.CartItems.Remove(cartItemInCart);
                        if (shoppingCart.CartItems.Count() == 1)
                        {
                            _db.ShoppingCarts.Remove(shoppingCart);
                        }
                        _db.SaveChanges();
                    }
                    else
                    {
                        cartItemInCart.Quantity = newQuantity;
                        _db.SaveChanges();
                    }
                }
            }
            return _response;

        }
    }
}