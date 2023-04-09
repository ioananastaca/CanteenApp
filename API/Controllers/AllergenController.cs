using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos.AllergensDto;
using API.Dtos.FoodAllergensDto;
using API.Models;
using API.Services.AllergensService;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AllergenController : ControllerBase
    {
        private readonly IAllergensService _service;

        public AllergenController(IAllergensService service)
        {
            _service = service;
        }
        [HttpGet("GetAllAllergens")]
        public async Task<ActionResult<ServiceResponse<List<GetAllergenDto>>>> GetAllAllergens()
        {
            return Ok(await _service.GetAllAllergens());
        }

        [HttpPost("AddAllergen")]
        public async Task<ActionResult<ServiceResponse<List<GetAllergenDto>>>> AddAllergen(AddAllergenDto newAllergen)
        {
            return Ok(await _service.AddAllergen(newAllergen));
        }
    }
}