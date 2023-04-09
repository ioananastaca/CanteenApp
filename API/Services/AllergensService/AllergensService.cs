using API.Data;
using API.Dtos.AllergensDto;
using API.Dtos.FoodAllergensDto;
using API.Models;
using API.Models.FoodDir;
using API.Services.AllergensService;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Services.FoodAllergensService
{
    public class AllergensService : IAllergensService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public AllergensService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<ServiceResponse<List<GetAllergenDto>>> AddAllergen(AddAllergenDto newAllergen)
        {
            var serviceResponse = new ServiceResponse<List<GetAllergenDto>>();

            if (await _context.Allergens.AnyAsync(x => x.Name.ToLower() == (newAllergen.Name).ToLower()))
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "Allergen with the same name already exists.";
                return serviceResponse;
            }

            var allergen = _mapper.Map<Allergen>(newAllergen);

            _context.Allergens.Add(allergen);
            await _context.SaveChangesAsync();

            serviceResponse.Data = await _context.Allergens.Select(x => _mapper.Map<GetAllergenDto>(x)).ToListAsync();
            return serviceResponse;

        }

        public async Task<ServiceResponse<List<GetAllergenDto>>> GetAllAllergens()
        {
            var serviceResponse = new ServiceResponse<List<GetAllergenDto>>();

            var allergens = await _context.Allergens.ToListAsync();

            serviceResponse.Data = await _context.Allergens.Select(x => _mapper.Map<GetAllergenDto>(x)).ToListAsync();
            return serviceResponse;
        }
    }
}