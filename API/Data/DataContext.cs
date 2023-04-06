using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Food> Foods => Set<Food>();
        public DbSet<User> Users => Set<User>();
        public DbSet<FoodCategory> FoodCategories => Set<FoodCategory>();
        public DbSet<FoodType> FoodTypes => Set<FoodType>();
    }
}