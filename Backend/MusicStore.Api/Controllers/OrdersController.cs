using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicStore.Api.Data;
using MusicStore.Api.Models;

namespace MusicStore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _db;

    public OrdersController(AppDbContext db)
    {
        _db = db;
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> Checkout()
    {
        var userId = GetUserId();

        var cartItems = await _db.CartItems
            .Where(c => c.UserId == userId)
            .Include(c => c.Album)
            .ToListAsync();

        if (cartItems.Count == 0)
            return BadRequest(new { message = "Корзина пуста." });

        var order = new Order
        {
            UserId = userId,
            Status = "new",
            CreatedAt = DateTime.UtcNow,
            Items = cartItems.Select(c => new OrderItem
            {
                AlbumId = c.AlbumId,
                Qty = c.Qty,
                UnitPrice = c.Album.Price
            }).ToList(),
            TotalPrice = cartItems.Sum(c => c.Album.Price * c.Qty)
        };

        _db.Orders.Add(order);
        _db.CartItems.RemoveRange(cartItems);
        await _db.SaveChangesAsync();

        return Ok(new
        {
            order.Id,
            order.TotalPrice,
            order.Status,
            order.CreatedAt,
            Items = order.Items.Select(i => new
            {
                i.AlbumId,
                AlbumTitle = cartItems.First(c => c.AlbumId == i.AlbumId).Album.Title,
                i.Qty,
                i.UnitPrice
            })
        });
    }

    [HttpGet]
    public async Task<IActionResult> GetOrders()
    {
        var userId = GetUserId();

        var orders = await _db.Orders
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new
            {
                o.Id,
                o.TotalPrice,
                o.Status,
                o.CreatedAt,
                ItemCount = o.Items.Sum(i => i.Qty)
            })
            .ToListAsync();

        return Ok(orders);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetOrder(int id)
    {
        var userId = GetUserId();

        var order = await _db.Orders
            .Where(o => o.Id == id && o.UserId == userId)
            .Select(o => new
            {
                o.Id,
                o.TotalPrice,
                o.Status,
                o.CreatedAt,
                Items = o.Items.Select(i => new
                {
                    i.AlbumId,
                    AlbumTitle = i.Album.Title,
                    AlbumArtist = i.Album.Artist,
                    i.Qty,
                    i.UnitPrice
                })
            })
            .FirstOrDefaultAsync();

        return order is null ? NotFound() : Ok(order);
    }
}
