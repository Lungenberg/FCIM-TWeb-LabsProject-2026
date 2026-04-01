using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicStore.Api.Models;

[Table("contact_requests")]
public class ContactRequest
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required, MaxLength(100)]
    [Column("user_name")]
    public string UserName { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    [Column("user_email")]
    public string UserEmail { get; set; } = string.Empty;

    [MaxLength(20)]
    [Column("user_phone")]
    public string? UserPhone { get; set; }

    [Required, MaxLength(50)]
    [Column("req_type")]
    public string ReqType { get; set; } = string.Empty;

    [Required, MaxLength(2000)]
    [Column("message")]
    public string Message { get; set; } = string.Empty;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
