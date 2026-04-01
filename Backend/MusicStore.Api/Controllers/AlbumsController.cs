using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicStore.Api.Data;
using MusicStore.Api.Models;

namespace MusicStore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AlbumsController : ControllerBase
{
    private readonly AppDbContext _db;

    public AlbumsController(AppDbContext db)
    {
        _db = db;
    }

    // GET /api/albums?genre=rock&minPrice=10&maxPrice=50
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? genre,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice)
    {
        var query = _db.Albums.AsQueryable();

        if (!string.IsNullOrWhiteSpace(genre))
            query = query.Where(a => a.Genre == genre.ToLower());

        if (minPrice.HasValue)
            query = query.Where(a => a.Price >= minPrice.Value);

        if (maxPrice.HasValue)
            query = query.Where(a => a.Price <= maxPrice.Value);

        var albums = await query.OrderBy(a => a.Id).ToListAsync();
        return Ok(albums);
    }

    // GET /api/albums/5
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var album = await _db.Albums.FindAsync(id);
        return album is null ? NotFound() : Ok(album);
    }

    // POST /api/albums
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Album album)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        album.CreatedAt = DateTime.UtcNow;
        _db.Albums.Add(album);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = album.Id }, album);
    }

    // PUT /api/albums/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] Album album)
    {
        if (id != album.Id)
            return BadRequest("ID mismatch");

        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var existing = await _db.Albums.FindAsync(id);
        if (existing is null)
            return NotFound();

        existing.Title    = album.Title;
        existing.Artist   = album.Artist;
        existing.Genre    = album.Genre;
        existing.Price    = album.Price;
        existing.ImageUrl = album.ImageUrl;
        existing.Description = album.Description;
        existing.StockQty = album.StockQty;

        await _db.SaveChangesAsync();
        return Ok(existing);
    }

    // DELETE /api/albums/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var album = await _db.Albums.FindAsync(id);
        if (album is null)
            return NotFound();

        _db.Albums.Remove(album);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
