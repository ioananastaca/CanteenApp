using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class removefieldsfromshoppingcart : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClientSecret",
                table: "ShoppingCarts");

            migrationBuilder.DropColumn(
                name: "StripePaymentIntentId",
                table: "ShoppingCarts");

            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "ShoppingCarts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Date",
                table: "ShoppingCarts");

            migrationBuilder.AddColumn<string>(
                name: "ClientSecret",
                table: "ShoppingCarts",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StripePaymentIntentId",
                table: "ShoppingCarts",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
