using API.Dtos.FoodDtos;
using API.Models;
using AutoMapper;

namespace API
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<FoodAllergen, string>().ConvertUsing(src => src.Allergen.Name);

            CreateMap<Food, GetFoodDto>()
                .ForMember(d => d.CategoryName, s => s.MapFrom(x => x.Category.Name))
                .ForMember(d => d.FoodTypeName, s => s.MapFrom(x => x.Type.Name))
                .ForMember(dest => dest.AllergenNames,
                 opt => opt.MapFrom(src => src.FoodAllergens != null ? src.FoodAllergens.Select(x => x.Allergen.Name).ToList() : null));

            CreateMap<AddFoodDto, Food>();

        }
    }
}