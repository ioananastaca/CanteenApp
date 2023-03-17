using API.Dtos.FoodDtos;
using API.Models;
using AutoMapper;

namespace API
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Food,GetFoodDto>();
            CreateMap<AddFoodDto,Food>();
            
        }
    }
}