using API.Data;
using API.Dtos.FoodAllergensDto;
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
                .Include(x => x.FoodAllergens)
                    .ThenInclude(fa => fa.Allergen)
                .ToListAsync();

            serviceResponse.Data = dbFoods.Select(x => _mapper.Map<GetFoodDto>(x)).ToList();
            serviceResponse.Success = true;
            serviceResponse.Message = "Success"; // You can customize the success message if needed

            return serviceResponse;
        }


        public async Task<ServiceResponse<GetFoodDto>> GetFoodById(int id)
        {
            var serviceResponse = new ServiceResponse<GetFoodDto>();

            var dbFood = await _context.Foods
                .Include(x => x.Category)
                .Include(x => x.Type)
                .Include(x => x.FoodAllergens)
                    .ThenInclude(fa => fa.Allergen)
                .FirstOrDefaultAsync(x => x.Id == id);
            if (dbFood == null)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "Food not found.";
                return serviceResponse;
            }
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
                existingFood.Price = (double)updatedFood.Price;
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

        public async Task<ServiceResponse<List<GetFoodDto>>> GetAllFoodsByCategory(int categoryId)
        {
            var serviceResponse = new ServiceResponse<List<GetFoodDto>>();

            var category = await _context.FoodCategories.FirstOrDefaultAsync(c => c.Id == categoryId);
            if (category == null)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "Invalid category id.";
                return serviceResponse;
            }

            var dbFoods = await _context.Foods
                .Include(x => x.Category)
                .Include(x => x.Type)
                .Include(x => x.FoodAllergens)
                  .ThenInclude(fa => fa.Allergen)
                .Where(x => x.Category.Id == categoryId)
                .ToListAsync();

            serviceResponse.Data = dbFoods.Select(x => _mapper.Map<GetFoodDto>(x)).ToList();
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

        public async Task<ServiceResponse<List<GetFoodDto>>> GetAllFoodsByType(int typeId)
        {
            var serviceResponse = new ServiceResponse<List<GetFoodDto>>();

            var types = await _context.Foods
                .Include(x => x.Category)
                .Include(x => x.Type)
                .Include(x => x.FoodAllergens)
                  .ThenInclude(fa => fa.Allergen)
                .Where(x => x.Type.Id == typeId)
                .ToListAsync();

            serviceResponse.Data = types.Select(x => _mapper.Map<GetFoodDto>(x)).ToList();
            return serviceResponse;
        }

        public async Task<ServiceResponse<GetFoodDto>> AddAllergenToFood(int foodId, int allergenId)
        {
            var serviceResponse = new ServiceResponse<GetFoodDto>();

            var food = await _context.Foods.Include(x => x.Category)
                                            .Include(x => x.Type)
                                            .Include(f => f.FoodAllergens)
                                                .ThenInclude(fa => fa.Allergen)
                                            .FirstOrDefaultAsync(f => f.Id == foodId);
            if (food == null)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = $"Food {food.Name} not found.";
                return serviceResponse;
            }

            var allergen = await _context.Allergens.FindAsync(allergenId);
            if (allergen == null)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = $"Allergen {allergen.Name} not found.";
                return serviceResponse;
            }

            if (food.FoodAllergens.Any(fa => fa.AllergenId == allergenId))
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "Food already has this allergen.";
                return serviceResponse;
            }

            food.FoodAllergens.Add(new FoodAllergen { AllergenId = allergenId });

            await _context.SaveChangesAsync();

            serviceResponse.Data = _mapper.Map<GetFoodDto>(food);
            return serviceResponse;
        }

        public async Task<ServiceResponse<GetFoodDto>> DeleteAllergenFromFood(int foodId, int allergenId)
        {
            var serviceResponse = new ServiceResponse<GetFoodDto>();

            var food = await _context.Foods.Include(f => f.Category)
                                            .Include(f => f.Type)
                                            .Include(f => f.FoodAllergens)
                                            .ThenInclude(fa => fa.Allergen)
                                            .FirstOrDefaultAsync(f => f.Id == foodId);
            if (food == null)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = $"Food {food.Name} not found.";
                return serviceResponse;
            }

            var allergen = await _context.Allergens.FindAsync(allergenId);
            if (allergen == null)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = $"Allergen {allergen.Name} not found.";
                return serviceResponse;
            }

            var foodAllergen = food.FoodAllergens.FirstOrDefault(fa => fa.AllergenId == allergenId);
            if (foodAllergen == null)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "Food does not have this allergen.";
                return serviceResponse;
            }

            food.FoodAllergens.Remove(foodAllergen);

            await _context.SaveChangesAsync();

            serviceResponse.Data = _mapper.Map<GetFoodDto>(food);
            return serviceResponse;
        }

        public async Task<ServiceResponse<List<GetFoodDto>>> GetAllFoodByAllergen(int allergenId)
        {
            var serviceResponse = new ServiceResponse<List<GetFoodDto>>();

            var allergen = await _context.Allergens.FindAsync(allergenId);
            if (allergen == null)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "Allergen not found.";
                return serviceResponse;
            }

            var foods = await _context.Foods.Include(f => f.Category)
                                             .Include(f => f.Type)
                                             .Include(f => f.FoodAllergens)
                                                .ThenInclude(fa => fa.Allergen)
                                             .Where(f => f.FoodAllergens.Any(fa => fa.AllergenId == allergenId))
                                             .ToListAsync();

            serviceResponse.Data = _mapper.Map<List<GetFoodDto>>(foods);
            return serviceResponse;
        }

        public async Task<ServiceResponse<List<GetAllergenDto>>> GetFoodAllergensById(int foodId)
        {
            var serviceResponse = new ServiceResponse<List<GetAllergenDto>>();

            var food = await _context.Foods
                .Include(x => x.FoodAllergens)
                    .ThenInclude(fa => fa.Allergen)
                .FirstOrDefaultAsync(x => x.Id == foodId);

            if (food == null)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = $"Food with ID {foodId} not found.";
                return serviceResponse;
            }

            var allergens = food.FoodAllergens.Select(fa => _mapper.Map<GetAllergenDto>(fa.Allergen)).ToList();

            serviceResponse.Data = allergens;
            return serviceResponse;
        }

    }
}