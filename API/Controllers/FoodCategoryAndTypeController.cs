using API.Dtos.FoodCategoryAndTypeDto;
using API.Models;
using API.Services.CategoryAndTypeServices;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")]
    public class FoodCategoryAndTypeController : ControllerBase
    {
        private readonly IFoodCategoryAndTypeService _service;

        public FoodCategoryAndTypeController(IFoodCategoryAndTypeService service)
        {
            _service = service;
        }

        [HttpGet("GetAllCategories")]
        public async Task<ActionResult<ServiceResponse<List<GetFoodCategoryDto>>>> GetAllCategories()
        {
            return Ok(await _service.GetAllCategories());
        }

        [HttpGet("GetAllTypes")]
        public async Task<ActionResult<ServiceResponse<List<GetFoodTypeDto>>>> GetAllTypes()
        {
            return Ok(await _service.GetAllTypes());
        }

        [HttpPost("AddFoodCategory")]
        public async Task<ActionResult<ServiceResponse<List<GetFoodCategoryDto>>>> AddFoodCategory(AddFoodCategoryDto newFoodCategory)
        {
            return Ok(await _service.AddFoodCategory(newFoodCategory));
        }

        [HttpPost("AddFoodType")]
        public async Task<ActionResult<ServiceResponse<List<GetFoodTypeDto>>>> AddFoodType(AddFoodTypeDto newFoodType)
        {
            return Ok(await _service.AddFoodType(newFoodType));
        }
    }
}