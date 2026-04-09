using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicStore.Api.Models;

[Table("order_items")]
public class OrderItem
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("order_id")]
    public int OrderId { get; set; }

    [ForeignKey("OrderId")]
    public Order Order { get; set; } = null!;

    [Column("album_id")]
    public int AlbumId { get; set; }

    [ForeignKey("AlbumId")]
    public Album Album { get; set; } = null!;

    [Column("qty")]
    public int Qty { get; set; }

    [Column("unit_price", TypeName = "numeric(10,2)")]
    public decimal UnitPrice { get; set; }
}
