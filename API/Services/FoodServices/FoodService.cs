using API.Data;
using API.Dtos.FoodDtos;
using API.Models;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Services.FoodServices
{
    public class FoodService : IFoodService
    {
        private readonly IMapper _mapper;
        private readonly DataContext _context;

        public FoodService(IMapper mapper, DataContext context)
        {
            _mapper = mapper;
            _context = context;
        }
        public async Task<ServiceResponse<List<GetFoodDto>>> AddFood(AddFoodDto newFood)
        {
            var serviceResponse = new ServiceResponse<List<GetFoodDto>>();

            if (!await ValidateCategory(newFood.CategoryId))
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "Invalid category!";
                return serviceResponse;
            }

            if (!await ValidateType(newFood.FoodTypeId))
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "Invalid type!";
                return serviceResponse;
            }

            var food = _mapper.Map<Food>(newFood);

            _context.Foods.Add(food);
            await _context.SaveChangesAsync();

            serviceResponse.Data = await _context.Foods.Select(x => _mapper.Map<GetFoodDto>(x)).ToListAsync();
            return serviceResponse;
        }

        public async Task<ServiceResponse<List<GetFoodDto>>> DeleteFood(int id)
        {
            var serviceResponse = new ServiceResponse<List<GetFoodDto>>();

            try
            {
                var foodToDelete = await _context.Foods.FirstOrDefaultAsync(f => f.Id == id);

                if (foodToDelete != null)
                {
                    _context.Foods.Remove(foodToDelete);
                    await _context.SaveChangesAsync();

                    serviceResponse.Data = await _context.Foods
                        .Include(f => f.Category)
                        .Include(f => f.Type)
                        .Select(f => _mapper.Map<GetFoodDto>(f))
                        .ToListAsync();

                    serviceResponse.Message = $"Food with ID: {id} deleted successfully";
                }
                else
                {
                    serviceResponse.Success = false;
                    serviceResponse.Message = $"Food with ID: {id} not found";
                }
            }
            catch (Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }

            return serviceResponse;
        }

        public async Task<ServiceResponse<List<GetFoodDto>>> GetAllFood()
        {
            var serviceResponse = new ServiceResponse<List<GetFoodDto>>();

            var dbFoods = await _context.Foods
                .Include(x => x.Category)
                .Include(x => x.Type)
                .ToListAsync();

            serviceResponse.Data = dbFoods.Select(x => _mapper.Map<GetFoodDto>(x)).ToList();
            return serviceResponse;
        }

        public async Task<ServiceResponse<GetFoodDto>> GetFoodById(int id)
        {
            var serviceResponse = new ServiceResponse<GetFoodDto>();

            var dbFood = await _context.Foods
                .Include(x => x.Category)
                .Include(x => x.Type)
                .FirstOrDefaultAsync(x => x.Id == id);
            serviceResponse.Data = _mapper.Map<GetFoodDto>(dbFood);
            return serviceResponse;
        }

        public async Task<ServiceResponse<GetFoodDto>> UpdateFood(int id, UpdateFoodDto updatedFood)
        {
            var serviceResponse = new ServiceResponse<GetFoodDto>();
            try
            {
                var existingFood = await _context.Foods.FirstOrDefaultAsync(f => f.Id == id);
                if (existingFood is null)
                {
                    serviceResponse.Success = false;
                    serviceResponse.Message = "Food not found.";
                    return serviceResponse;
                }


                var category = await _context.FoodCategories.FirstOrDefaultAsync(c => c.Id == updatedFood.CategoryId);
                if (category == null)
                {
                    serviceResponse.Success = false;
                    serviceResponse.Message = "Invalid category id.";
                    return serviceResponse;
                }

                var type = await _context.FoodTypes.FirstOrDefaultAsync(t => t.Id == updatedFood.FoodTypeId);
                if (type == null)
                {
                    serviceResponse.Success = false;
                    serviceResponse.Message = "Invalid type id.";
                    return serviceResponse;
                }

                existingFood.Name = updatedFood.Name;
                existingFood.Description = updatedFood.Description;
                existingFood.ImageUrl = updatedFood.ImageUrl;
                existingFood.Price = updatedFood.Price;
                existingFood.Category = category;
                existingFood.Type = type;

                await _context.SaveChangesAsync();

                serviceResponse.Data = _mapper.Map<GetFoodDto>(existingFood);
            }
            catch (Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }
            return serviceResponse;
        }

        private async Task<bool> ValidateCategory(int categoryId)
        {
            var category = await _context.FoodCategories.FindAsync(categoryId);
            if (category == null)
            {
                return false;
            }
            return true;
        }

        private async Task<bool> ValidateType(int typeId)
        {
            var type = await _context.FoodTypes.FindAsync(typeId);
            if (type == null)
            {
                return false;
            }
            return true;
        }
    }
}