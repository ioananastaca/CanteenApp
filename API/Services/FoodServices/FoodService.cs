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
                var dbFood = await _context.Foods.FirstOrDefaultAsync(x => x.Id == id);
                if (dbFood is null)
                    throw new Exception($"food with id '{id}' not found!");

                _context.Foods.Remove(dbFood);

                await _context.SaveChangesAsync();

                serviceResponse.Data = await _context.Foods.Select(c => _mapper.Map<GetFoodDto>(c)).ToListAsync();
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

            var dbFoods = await _context.Foods.ToListAsync();

            serviceResponse.Data = dbFoods.Select(x => _mapper.Map<GetFoodDto>(x)).ToList();
            return serviceResponse;
        }

        public async Task<ServiceResponse<GetFoodDto>> GetFoodById(int id)
        {
            var serviceResponse = new ServiceResponse<GetFoodDto>();

            var dbFood = await _context.Foods.FirstOrDefaultAsync(x => x.Id == id);
            serviceResponse.Data = _mapper.Map<GetFoodDto>(dbFood);
            return serviceResponse;
        }

        public async Task<ServiceResponse<GetFoodDto>> UpdateFood(UpdateFoodDto updateFood)
        {
            var serviceResponse = new ServiceResponse<GetFoodDto>();
            try
            {
                var food = await _context.Foods.FirstOrDefaultAsync(x => x.Id == updateFood.Id);
                if (food is null)
                    throw new Exception($"food with id '{updateFood.Id}' not found!");

                food.Name = updateFood.Name;
                food.Description = updateFood.Description;
                food.ImageUrl = updateFood.ImageUrl;
                food.Price = updateFood.Price;

                await _context.SaveChangesAsync();

                serviceResponse.Data = _mapper.Map<GetFoodDto>(food);
            }
            catch (Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }
            return serviceResponse;
        }
    }
}