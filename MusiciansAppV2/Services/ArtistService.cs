using Microsoft.EntityFrameworkCore;
using MusiciansAppV2.Data;
using MusiciansAppV2.Models;

namespace MusiciansAppV2.Services;

public class ArtistService
{
    private readonly ApplicationDbContext _context;

    public ArtistService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Artist> GetArtistByIdAsync(int id)
    {
        return await _context.Artists.FindAsync(id);
    }

    public async Task<IEnumerable<Artist>> GetAllArtistsAsync()
    {
        return await _context.Artists.ToListAsync();
    }

    public async Task<Artist> CreateArtistAsync(Artist artist)
    {
        await _context.Artists.AddAsync(artist);
        await _context.SaveChangesAsync();
        return artist;
    }

    public async Task<bool> UpdateArtistAsync(Artist artist)
    {
        _context.Entry(artist).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteArtistAsync(string name)
    {
        var artist = await _context.Artists.FirstOrDefaultAsync(a => a.Name == name);

        if (artist == null) return false;

        _context.Artists.Remove(artist);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<object> SearchAsync(string query)
    {
        var artist = await _context.Artists
            .Include(a => a.Albums)
            .Include(a => a.Single)
            .FirstOrDefaultAsync(a => a.Name.Contains(query));

        if (artist != null)
            return new
            {
                Type = "Artist",
                Data = new
                {
                    artist.Id,
                    artist.Name,
                    artist.ImagePath,
                    Albums = artist.Albums.Select(a => new { a.Id, a.Title, a.ReleaseDate }),
                    Singles = artist.Single.Select(a => new { a.Id, a.Title, a.FilePath })
                }
            };

        var song = await _context.Songs
            .Include(a => a.Artist)
            .Include(a => a.Album)
            .FirstOrDefaultAsync(a => a.Title.Contains(query));

        if (song != null)
            return new
            {
                Type = "Song",
                Data = new
                {
                    song.Id,
                    song.Title,
                    song.FilePath,
                    song.ImagePath,
                    Artist = song.Artist != null ? new { song.Artist.Id, song.Artist.Name } : null,
                    Album = song.Album != null ? new { song.Album.Id, song.Album.Title } : null
                }
            };

        var album = await _context.Albums
            .Include(a => a.Artist)
            .Include(a => a.Songs)
            .FirstOrDefaultAsync(a => a.Title.Contains(query));

        if (album != null)
            return new
            {
                Type = "Album",
                Data = new
                {
                    album.Id,
                    album.Title,
                    album.ReleaseDate,
                    album.ImagePath,
                    Artist = new
                    {
                        album.Artist.Id,
                        album.Artist.Name
                    },
                    Songs = album.Songs.Select(a => new { a.Id, a.Title })
                }
            };
        return new
        {
            Type = "NotFound",
            Message = "No results found for the provided query."
        };
    }
}