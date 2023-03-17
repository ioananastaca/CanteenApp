using System.Runtime.CompilerServices;
using API.Dtos.FoodDtos;
using API.Models;
using API.Services.FoodServices;
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
            return Ok(await _service.GetAllFood());
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceResponse<GetFoodDto>>> GetSingleFood(int id)
        {
            return Ok(await _service.GetFoodById(id));
        }

        [HttpPost]
        public async Task<ActionResult<ServiceResponse<List<GetFoodDto>>>> AddFood(AddFoodDto newFood)
        {
            return Ok(await _service.AddFood(newFood));
        }

        [HttpPut]
        public async Task<ActionResult<ServiceResponse<List<GetFoodDto>>>> UpdateFood(UpdateFoodDto updatedFood)
        {
            var response = await _service.UpdateFood(updatedFood);
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
    }
}