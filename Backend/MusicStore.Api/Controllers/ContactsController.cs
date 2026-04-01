using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicStore.Api.Data;
using MusicStore.Api.Models;

namespace MusicStore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ContactsController(AppDbContext db)
    {
        _db = db;
    }

    // GET /api/contacts
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var requests = await _db.ContactRequests
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
        return Ok(requests);
    }

    // GET /api/contacts/3
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var request = await _db.ContactRequests.FindAsync(id);
        return request is null ? NotFound() : Ok(request);
    }

    // POST /api/contacts
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ContactRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var allowed = new[] { "Order album", "Stock question", "Complaint", "Suggestion" };
        if (!allowed.Contains(request.ReqType))
            return BadRequest("Invalid request type.");

        request.CreatedAt = DateTime.UtcNow;
        _db.ContactRequests.Add(request);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = request.Id }, request);
    }

    // DELETE /api/contacts/3
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var request = await _db.ContactRequests.FindAsync(id);
        if (request is null)
            return NotFound();

        _db.ContactRequests.Remove(request);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
