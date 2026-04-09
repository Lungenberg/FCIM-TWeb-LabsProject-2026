using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicStore.Api.Data;
using MusicStore.Api.Models;
using MusicStore.Api.Dto;

namespace MusicStore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly AppDbContext _db;

    public CartController(AppDbContext db)
    {
        _db = db;
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var userId = GetUserId();
        var items = await _db.CartItems
            .Where(c => c.UserId == userId)
            .Include(c => c.Album)
            .Select(c => new
            {
                c.Id,
                c.AlbumId,
                c.Qty,
                AlbumTitle = c.Album.Title,
                AlbumArtist = c.Album.Artist,
                AlbumPrice = c.Album.Price,
                AlbumImageUrl = c.Album.ImageUrl
            })
            .ToListAsync();

        return Ok(items);
    }

    [HttpPost]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartDto dto)
    {
        var userId = GetUserId();

        var album = await _db.Albums.FindAsync(dto.AlbumId);
        if (album is null)
            return NotFound(new { message = "Альбом не найден." });

        var existing = await _db.CartItems
            .FirstOrDefaultAsync(c => c.UserId == userId && c.AlbumId == dto.AlbumId);

        if (existing is not null)
        {
            existing.Qty += dto.Qty;
        }
        else
        {
            _db.CartItems.Add(new CartItem
            {
                UserId = userId,
                AlbumId = dto.AlbumId,
                Qty = dto.Qty
            });
        }

        await _db.SaveChangesAsync();
        return Ok(new { message = "Товар добавлен в корзину." });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateQty(int id, [FromBody] UpdateQtyDto dto)
    {
        var userId = GetUserId();
        var item = await _db.CartItems.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        if (item is null) return NotFound();

        if (dto.Qty <= 0)
        {
            _db.CartItems.Remove(item);
        }
        else
        {
            item.Qty = dto.Qty;
        }

        await _db.SaveChangesAsync();
        return Ok(new { message = "Корзина обновлена." });
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> RemoveItem(int id)
    {
        var userId = GetUserId();
        var item = await _db.CartItems.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        if (item is null) return NotFound();

        _db.CartItems.Remove(item);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete]
    public async Task<IActionResult> ClearCart()
    {
        var userId = GetUserId();
        var items = await _db.CartItems.Where(c => c.UserId == userId).ToListAsync();
        _db.CartItems.RemoveRange(items);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

