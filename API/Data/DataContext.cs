using API.Models;
using API.Models.FoodDir;
using API.Models.Order;
using API.Models.Shopping;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : IdentityDbContext<ApplicationUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<ApplicationUser>ApplicationUsers{get;set;}
        public DbSet<Food> Foods => Set<Food>();
        // public DbSet<User> Users => Set<User>();
        public DbSet<FoodCategory> FoodCategories => Set<FoodCategory>();
        public DbSet<FoodType> FoodTypes => Set<FoodType>();
        public DbSet<Allergen> Allergens => Set<Allergen>();
        public DbSet<FoodAllergen> FoodAllergens => Set<FoodAllergen>();
        public DbSet<ShoppingCart>ShoppingCarts{get;set;}
        public DbSet<CartItem>CartItems{get;set;}
        public DbSet<OrderHeader>OrderHeaders{get;set;}
        public DbSet<OrderDetails>OrderDetails{get;set;}
     

    }
}