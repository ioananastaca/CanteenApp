using API.Dtos.FoodDtos;
using API.Models;
using AutoMapper;

namespace API
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Food,GetFoodDto>()
                .ForMember(d=>d.CategoryName,s=>s.MapFrom(x=>x.Category.Name))
                .ForMember(d=>d.FoodTypeName,s=>s.MapFrom(x=>x.Type.Name));
            CreateMap<AddFoodDto,Food>();
            
        }
    }
}