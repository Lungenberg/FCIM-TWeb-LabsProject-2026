using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MusicStore.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddAuthCartOrders : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "users",
                schema: "public",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    password_hash = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "cart_items",
                schema: "public",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    album_id = table.Column<int>(type: "integer", nullable: false),
                    qty = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_cart_items", x => x.id);
                    table.ForeignKey(
                        name: "FK_cart_items_albums_album_id",
                        column: x => x.album_id,
                        principalSchema: "public",
                        principalTable: "albums",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_cart_items_users_user_id",
                        column: x => x.user_id,
                        principalSchema: "public",
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "orders",
                schema: "public",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    total_price = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_orders", x => x.id);
                    table.ForeignKey(
                        name: "FK_orders_users_user_id",
                        column: x => x.user_id,
                        principalSchema: "public",
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "order_items",
                schema: "public",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    order_id = table.Column<int>(type: "integer", nullable: false),
                    album_id = table.Column<int>(type: "integer", nullable: false),
                    qty = table.Column<int>(type: "integer", nullable: false),
                    unit_price = table.Column<decimal>(type: "numeric(10,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_order_items", x => x.id);
                    table.ForeignKey(
                        name: "FK_order_items_albums_album_id",
                        column: x => x.album_id,
                        principalSchema: "public",
                        principalTable: "albums",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_order_items_orders_order_id",
                        column: x => x.order_id,
                        principalSchema: "public",
                        principalTable: "orders",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                schema: "public",
                table: "albums",
                keyColumn: "id",
                keyValue: 1,
                column: "image_url",
                value: "assets/img/Audioslave-debut-album-cover-artwork-web-optimised-820-820x820.jpg");

            migrationBuilder.UpdateData(
                schema: "public",
                table: "albums",
                keyColumn: "id",
                keyValue: 2,
                column: "image_url",
                value: "assets/img/Blackparadecover.jpg");

            migrationBuilder.UpdateData(
                schema: "public",
                table: "albums",
                keyColumn: "id",
                keyValue: 3,
                column: "image_url",
                value: "assets/img/inthecourtofthecrimsonking.jpg");

            migrationBuilder.UpdateData(
                schema: "public",
                table: "albums",
                keyColumn: "id",
                keyValue: 4,
                column: "image_url",
                value: "assets/img/Minutes_to_Midnight_cover.jpg");

            migrationBuilder.UpdateData(
                schema: "public",
                table: "albums",
                keyColumn: "id",
                keyValue: 5,
                column: "image_url",
                value: "assets/img/MuseAbsAlbCov.jpg");

            migrationBuilder.UpdateData(
                schema: "public",
                table: "albums",
                keyColumn: "id",
                keyValue: 6,
                column: "image_url",
                value: "assets/img/PearlJam-Ten.jpg");

            migrationBuilder.CreateIndex(
                name: "IX_cart_items_album_id",
                schema: "public",
                table: "cart_items",
                column: "album_id");

            migrationBuilder.CreateIndex(
                name: "IX_cart_items_user_id",
                schema: "public",
                table: "cart_items",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_order_items_album_id",
                schema: "public",
                table: "order_items",
                column: "album_id");

            migrationBuilder.CreateIndex(
                name: "IX_order_items_order_id",
                schema: "public",
                table: "order_items",
                column: "order_id");

            migrationBuilder.CreateIndex(
                name: "IX_orders_user_id",
                schema: "public",
                table: "orders",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_users_email",
                schema: "public",
                table: "users",
                column: "email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "cart_items",
                schema: "public");

            migrationBuilder.DropTable(
                name: "order_items",
                schema: "public");

            migrationBuilder.DropTable(
                name: "orders",
                schema: "public");

            migrationBuilder.DropTable(
                name: "users",
                schema: "public");

            migrationBuilder.UpdateData(
                schema: "public",
                table: "albums",
                keyColumn: "id",
                keyValue: 1,
                column: "image_url",
                value: "assets/img/audioslave.jpg");

            migrationBuilder.UpdateData(
                schema: "public",
                table: "albums",
                keyColumn: "id",
                keyValue: 2,
                column: "image_url",
                value: "assets/img/mcr.jpg");

            migrationBuilder.UpdateData(
                schema: "public",
                table: "albums",
                keyColumn: "id",
                keyValue: 3,
                column: "image_url",
                value: "assets/img/crimson.jpg");

            migrationBuilder.UpdateData(
                schema: "public",
                table: "albums",
                keyColumn: "id",
                keyValue: 4,
                column: "image_url",
                value: "assets/img/lp.jpg");

            migrationBuilder.UpdateData(
                schema: "public",
                table: "albums",
                keyColumn: "id",
                keyValue: 5,
                column: "image_url",
                value: "assets/img/muse.jpg");

            migrationBuilder.UpdateData(
                schema: "public",
                table: "albums",
                keyColumn: "id",
                keyValue: 6,
                column: "image_url",
                value: "assets/img/pearljam.jpg");
        }
    }
}
