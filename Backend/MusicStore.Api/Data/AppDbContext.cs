using Microsoft.EntityFrameworkCore;
using MusicStore.Api.Models;

namespace MusicStore.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Album> Albums { get; set; }
    public DbSet<ContactRequest> ContactRequests { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("public");
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Album>().HasData(
            new Album { Id = 1, Title = "Audioslave", Artist = "Audioslave", Genre = "rock",   Price = 20m, ImageUrl = "assets/img/Audioslave-debut-album-cover-artwork-web-optimised-820-820x820.jpg", StockQty = 10, CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Album { Id = 2, Title = "Welcome to the Black Parade", Artist = "My Chemical Romance", Genre = "rock", Price = 25m, ImageUrl = "assets/img/Blackparadecover.jpg", StockQty = 8, CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Album { Id = 3, Title = "In the Court of the Crimson King", Artist = "King Crimson", Genre = "prog", Price = 22m, ImageUrl = "assets/img/inthecourtofthecrimsonking.jpg", StockQty = 5, CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Album { Id = 4, Title = "Minutes to Midnight", Artist = "Linkin Park", Genre = "rock", Price = 18m, ImageUrl = "assets/img/Minutes_to_Midnight_cover.jpg", StockQty = 12, CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Album { Id = 5, Title = "Absolution", Artist = "Muse", Genre = "rock", Price = 30m, ImageUrl = "assets/img/MuseAbsAlbCov.jpg", StockQty = 7, CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Album { Id = 6, Title = "Ten", Artist = "Pearl Jam", Genre = "grunge", Price = 28m, ImageUrl = "assets/img/PearlJam-Ten.jpg", StockQty = 6, CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc) }
        );
    }
}
