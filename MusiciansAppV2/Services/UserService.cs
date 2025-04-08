using MusiciansAppV2.Data;
using MusiciansAppV2.Models;

namespace MusiciansAppV2.Services;

public class UserService
{
    private readonly ApplicationDbContext _context;

    public UserService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User> CreateUserAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<Favorite?> AddFavoriteAsync(int userId, int trackId)
    {
        var song = await _context.Songs.FindAsync(trackId);
        if (song == null)
        {
            return null;
        }
        
        var favorite = new Favorite
        {
            UserId = userId,
            SongId = trackId
        };
        
        _context.Favorites.Add(favorite);
        await _context.SaveChangesAsync();
        
        return favorite;
    }

    public async Task<List<Favorite>> GetFavoritesAsync(int userId)
    {
        var favorites = _context.Favorites.Where(a => a.UserId == userId).ToList();
        return favorites;
    }
}