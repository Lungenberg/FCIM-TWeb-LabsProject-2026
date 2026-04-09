using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicStore.Api.Models;

[Table("users")]
public class User
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required, MaxLength(200)]
    [Column("email")]
    public string Email { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    [Column("password_hash")]
    public string PasswordHash { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
