using API.Dtos.FoodDtos;
using API.Models;
using API.Services.FoodServices;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FoodController : Controller
    {

        private readonly IFoodService _service;

        public FoodController(IFoodService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<ServiceResponse<List<GetFoodDto>>>> GetAllFoods()
        {
            var serviceResponse=await _service.GetAllFood();

            return Ok(serviceResponse.Data);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<GetFoodDto>> GetSingleFood(int id)
        {
            var serviceResponse = await _service.GetFoodById(id);

            if (serviceResponse.Data == null)
            {
                return NotFound();
            }

            return Ok(serviceResponse.Data);
        }

        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<ServiceResponse<GetFoodDto>>> GetAllFoodsByCategory(int categoryId)
        {
            return Ok(await _service.GetAllFoodsByCategory(categoryId));
        }

        [HttpGet("type/{typeId}")]
        public async Task<ActionResult<ServiceResponse<GetFoodDto>>> GetAllFoodsByType(int typeId)
        {
            return Ok(await _service.GetAllFoodsByType(typeId));
        }

        [HttpPost]
        public async Task<ActionResult<ServiceResponse<List<GetFoodDto>>>> AddFood(AddFoodDto newFood)
        {
            return Ok(await _service.AddFood(newFood));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ServiceResponse<List<GetFoodDto>>>> UpdateFood(int id, UpdateFoodDto updatedFood)
        {
            var response = await _service.UpdateFood(id, updatedFood);
            if (response.Data is null)
            {
                return NotFound(response);
            }
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ServiceResponse<GetFoodDto>>> DeleteFood(int id)
        {
            var response = await _service.DeleteFood(id);
            if (response.Data is null)
            {
                return NotFound(response);
            }
            return Ok();
        }

        [HttpPost("AddAllergenToFood/{foodId}/allergen/{allergenId}")]
        public async Task<ActionResult<ServiceResponse<GetFoodDto>>> AddAllergenToFood(int foodId, int allergenId)
        {
            var serviceResponse = await _service.AddAllergenToFood(foodId, allergenId);

            if (!serviceResponse.Success)
            {
                return BadRequest(serviceResponse);
            }

            var foodDto = serviceResponse.Data;
            return Ok(foodDto);
        }

        [HttpDelete("DeleteAllergenFromFood/{foodId}/allergens/{allergenId}")]
        public async Task<ActionResult<ServiceResponse<GetFoodDto>>> DeleteAllergenFromFood(int foodId, int allergenId)
        {
            var response = await _service.DeleteAllergenFromFood(foodId, allergenId);

            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }
        [HttpGet("allergen/{allergenId}")]
        public async Task<ActionResult<ServiceResponse<GetFoodDto>>> GetAllFoodByAllergen(int allergenId)
        {
            var response = await _service.GetAllFoodByAllergen((allergenId));
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
    }
}