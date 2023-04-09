using API.Dtos.FoodCategoryAndTypeDto;
using API.Models;

namespace API.Services.CategoryAndTypeServices
{
    public interface IFoodCategoryAndTypeService
    {
        Task<ServiceResponse<List<GetFoodCategoryDto>>> GetAllCategories();
        Task<ServiceResponse<List<GetFoodCategoryDto>>> AddFoodCategory(AddFoodCategoryDto newFoodCategory);

        Task<ServiceResponse<List<GetFoodTypeDto>>> GetAllTypes();
        Task<ServiceResponse<List<GetFoodTypeDto>>> AddFoodType(AddFoodTypeDto newFoodType);

    }
}