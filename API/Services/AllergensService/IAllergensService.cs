using API.Dtos.AllergensDto;
using API.Dtos.FoodAllergensDto;
using API.Models;

namespace API.Services.AllergensService
{
    public interface IAllergensService
    {
        Task<ServiceResponse<List<GetAllergenDto>>>GetAllAllergens();
        Task<ServiceResponse<List<GetAllergenDto>>>AddAllergen(AddAllergenDto newAllergen);
    }
}