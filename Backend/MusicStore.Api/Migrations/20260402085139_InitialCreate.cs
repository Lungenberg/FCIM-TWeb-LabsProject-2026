using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace MusicStore.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "public");

            migrationBuilder.CreateTable(
                name: "albums",
                schema: "public",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    artist = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    genre = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    price = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    image_url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    stock_qty = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_albums", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "contact_requests",
                schema: "public",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    user_email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    user_phone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    req_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    message = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_contact_requests", x => x.id);
                });

            migrationBuilder.InsertData(
                schema: "public",
                table: "albums",
                columns: new[] { "id", "artist", "created_at", "description", "genre", "image_url", "price", "stock_qty", "title" },
                values: new object[,]
                {
                    { 1, "Audioslave", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "rock", "assets/img/audioslave.jpg", 20m, 10, "Audioslave" },
                    { 2, "My Chemical Romance", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "rock", "assets/img/mcr.jpg", 25m, 8, "Welcome to the Black Parade" },
                    { 3, "King Crimson", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "prog", "assets/img/crimson.jpg", 22m, 5, "In the Court of the Crimson King" },
                    { 4, "Linkin Park", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "rock", "assets/img/lp.jpg", 18m, 12, "Minutes to Midnight" },
                    { 5, "Muse", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "rock", "assets/img/muse.jpg", 30m, 7, "Absolution" },
                    { 6, "Pearl Jam", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "grunge", "assets/img/pearljam.jpg", 28m, 6, "Ten" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "albums",
                schema: "public");

            migrationBuilder.DropTable(
                name: "contact_requests",
                schema: "public");
        }
    }
}
