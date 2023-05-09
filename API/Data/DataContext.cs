using API.Models;
using API.Models.FoodDir;
using API.Models.OderDir;
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
        public DbSet<Allergen> Allergens => Set<Allergen>();
        public DbSet<FoodAllergen> FoodAllergens => Set<FoodAllergen>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    }
}