using API.Dtos.FoodDtos;
using API.Models;

namespace API.Services.FoodServices
{
    public interface IFoodService
    {
        Task<ServiceResponse<List<GetFoodDto>>> GetAllFood();
        Task<ServiceResponse<List<GetFoodDto>>> AddFood(AddFoodDto newFood);
        Task<ServiceResponse<GetFoodDto>> GetFoodById(int id);
        Task<ServiceResponse<GetFoodDto>> UpdateFood(UpdateFoodDto updateFood);
        Task<ServiceResponse<List<GetFoodDto>>> DeleteFood(int id);
    }
}