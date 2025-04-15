using Microsoft.EntityFrameworkCore;
using MusiciansAppV2.Data;
using MusiciansAppV2.Models;

namespace MusiciansAppV2.Services;

public class SongService
{
    private readonly ApplicationDbContext _context;

    public SongService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Song>> GetAllSongsAsync()
    {
        var songs = await _context.Songs
            .Include(s => s.Artist)
            .ToListAsync();
        
        return songs;
    }
}