using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicStore.Api.Models;

[Table("cart_items")]
public class CartItem
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("user_id")]
    public int UserId { get; set; }

    [ForeignKey("UserId")]
    public User User { get; set; } = null!;

    [Column("album_id")]
    public int AlbumId { get; set; }

    [ForeignKey("AlbumId")]
    public Album Album { get; set; } = null!;

    [Column("qty")]
    public int Qty { get; set; } = 1;
}
