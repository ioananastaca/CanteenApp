using API.Dtos.FoodAllergensDto;
using API.Dtos.FoodDtos;
using API.Models;

namespace API.Services.FoodServices
{
    public interface IFoodService
    {
        Task<ServiceResponse<List<GetFoodDto>>> GetAllFood();
        // Task<ServiceResponse<List<GetFoodDto>>> AddFood(AddFoodDto newFood);
        Task<ServiceResponse<AddFoodDto>> AddFood(AddFoodDto newFood);
        Task<ServiceResponse<GetFoodDto>> GetFoodById(int id);
        Task<ServiceResponse<List<GetFoodDto>>> GetAllFoodsByCategory(int categoryId);
        Task<ServiceResponse<List<GetFoodDto>>> GetAllFoodsByType(int typeId);
        Task<ServiceResponse<GetFoodDto>> UpdateFood(int id, UpdateFoodDto updatedFood);
        Task<ServiceResponse<List<GetFoodDto>>> DeleteFood(int id);
        Task<ServiceResponse<GetFoodDto>>AddAllergenToFood(int foodId,int allergenId);
        Task<ServiceResponse<GetFoodDto>>DeleteAllergenFromFood(int foodId,int allergenId);
        Task<ServiceResponse<List<GetFoodDto>>> GetAllFoodByAllergen(int allergenId);
        Task<ServiceResponse<List<GetAllergenDto>>> GetFoodAllergensById(int foodId);
    }
}