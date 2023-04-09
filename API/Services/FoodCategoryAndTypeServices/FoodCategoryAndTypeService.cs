using API.Data;
using API.Dtos.FoodCategoryAndTypeDto;
using API.Models;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Services.CategoryAndTypeServices
{
    public class FoodCategoryAndTypeService : IFoodCategoryAndTypeService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public FoodCategoryAndTypeService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<ServiceResponse<List<GetFoodCategoryDto>>> AddFoodCategory(AddFoodCategoryDto newFoodCategory)
        {
            var serviceResponse = new ServiceResponse<List<GetFoodCategoryDto>>();

            if (await _context.FoodCategories.AnyAsync(x => x.Name.ToLower() == (newFoodCategory.Name).ToLower()))
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "Category with the same name already exists.";
                return serviceResponse;
            }

            var category = _mapper.Map<FoodCategory>(newFoodCategory);

            _context.FoodCategories.Add(category);
            await _context.SaveChangesAsync();

            serviceResponse.Data = await _context.FoodCategories.Select(x => _mapper.Map<GetFoodCategoryDto>(x)).ToListAsync();
            return serviceResponse;
        }

        public async Task<ServiceResponse<List<GetFoodTypeDto>>> AddFoodType(AddFoodTypeDto newFoodType)
        {
            var serviceResponse = new ServiceResponse<List<GetFoodTypeDto>>();

            if (await _context.FoodTypes.AnyAsync(x => x.Name.ToLower() == (newFoodType.Name).ToLower()))
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "Type with the same name already exists.";
                return serviceResponse;
            }

            var type = _mapper.Map<FoodType>(newFoodType);

            _context.FoodTypes.Add(type);
            await _context.SaveChangesAsync();

            serviceResponse.Data = await _context.FoodTypes.Select(x => _mapper.Map<GetFoodTypeDto>(x)).ToListAsync();
            return serviceResponse;
        }

        public async Task<ServiceResponse<List<GetFoodCategoryDto>>> GetAllCategories()
        {
            var serviceResponse = new ServiceResponse<List<GetFoodCategoryDto>>();

            var categories = await _context.FoodCategories.ToListAsync();

            serviceResponse.Data = categories.Select(x => _mapper.Map<GetFoodCategoryDto>(x)).ToList();
            return serviceResponse;
        }

        public async Task<ServiceResponse<List<GetFoodTypeDto>>> GetAllTypes()
        {
            var serviceResponse = new ServiceResponse<List<GetFoodTypeDto>>();

            var types = await _context.FoodTypes.ToListAsync();

            serviceResponse.Data = types.Select(x => _mapper.Map<GetFoodTypeDto>(x)).ToList();
            return serviceResponse;
        }
    }
}