using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicStore.Api.Models;

[Table("albums")]
public class Album
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required, MaxLength(200)]
    [Column("title")]
    public string Title { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    [Column("artist")]
    public string Artist { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    [Column("genre")]
    public string Genre { get; set; } = string.Empty;

    [Column("price", TypeName = "numeric(10,2)")]
    public decimal Price { get; set; }

    [MaxLength(500)]
    [Column("image_url")]
    public string? ImageUrl { get; set; }

    [MaxLength(1000)]
    [Column("description")]
    public string? Description { get; set; }

    [Column("stock_qty")]
    public int StockQty { get; set; } = 0;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
