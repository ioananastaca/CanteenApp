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

        [HttpDelete("{cartItemId}")]
        public async Task<ActionResult<ApiResponse>> DeleteCartItem(int cartItemId)
        {
            CartItem cartItem = await _db.CartItems.FindAsync(cartItemId);

            if (cartItem == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                return NotFound(_response);
            }

            _db.CartItems.Remove(cartItem);
            await _db.SaveChangesAsync();

            _response.StatusCode = HttpStatusCode.OK;
            return Ok(_response);
        }
    }

}
