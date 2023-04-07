using API.Dtos.FoodDtos;
using API.Models;

namespace API.Services.FoodServices
{
    public interface IFoodService
    {
        Task<ServiceResponse<List<GetFoodDto>>> GetAllFood();
        Task<ServiceResponse<List<GetFoodDto>>> AddFood(AddFoodDto newFood);
        Task<ServiceResponse<GetFoodDto>> GetFoodById(int id);
        Task<ServiceResponse<List<GetFoodDto>>> GetAllFoodsByCategory(int categoryId);
        Task<ServiceResponse<List<GetFoodDto>>> GetAllFoodsByType(int typeId);
        Task<ServiceResponse<GetFoodDto>> UpdateFood(int id, UpdateFoodDto updatedFood);
        Task<ServiceResponse<List<GetFoodDto>>> DeleteFood(int id);
    }
}