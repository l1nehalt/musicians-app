using Microsoft.AspNetCore.Mvc;
using MusiciansAppV2.Models;
using MusiciansAppV2.Services;

namespace MusiciansAppV2.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArtistController : ControllerBase
{
    private readonly ArtistService _artistService;

    public ArtistController(ArtistService artistService)
    {
        _artistService = artistService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Artist>>> GetAllArtist()
    {
        var artist = await _artistService.GetAllArtistsAsync();
        return Ok(artist);
    }

    [HttpGet("{Id}")]
    public async Task<ActionResult<Artist>> GetArtistById(int id)
    {
        var artist = await _artistService.GetArtistByIdAsync(id);

        if (artist == null) return NotFound();

        return Ok(artist);
    }

    [HttpPost("create")]
    public async Task<ActionResult<Artist>> CreateArtist(Artist artist)
    {
        await _artistService.CreateArtistAsync(artist);
        return CreatedAtAction(nameof(GetArtistById), new { id = artist.Id }, artist);
    }

    [HttpPut("{Id}")]
    public async Task<IActionResult> UpdateArtist(int id, Artist artist)
    {
        if (id != artist.Id) return BadRequest("Artist ID mismactch");

        try
        {
            await _artistService.UpdateArtistAsync(artist);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("{name}")]
    public async Task<IActionResult> DeleteArtist(string name)
    {
        try
        {
            await _artistService.DeleteArtistAsync(name);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string query)
    {
        if (string.IsNullOrEmpty(query)) return BadRequest("Query cannot be empty.");

        var result = await _artistService.SearchAsync(query);

        if (result == null) return NotFound(new { Message = "No results found for the given query." });

        return Ok(result);
    }
}