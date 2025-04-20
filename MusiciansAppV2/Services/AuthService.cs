using Microsoft.EntityFrameworkCore;
using MusiciansAppV2.Data;
using MusiciansAppV2.Models;

namespace MusiciansAppV2.Services;

public class AuthService
{
    private readonly ApplicationDbContext _context;

    public AuthService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User> RegisterAsync(User user)
    {
        if (await _context.Users.AnyAsync(a => a.Email == user.Email))
        {
            throw new ArgumentException("Email already exists");
        }

        if (await _context.Users.AnyAsync(a => a.Name == user.Name))
        {
            throw new ArgumentException("Name already exists");
        }
        
        user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
        
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<User?> LoginAsync(string email, string password)
    {
        var user = await _context.Users.FirstOrDefaultAsync(a => a.Email == email);

        if (user == null)
        {
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        if (!BCrypt.Net.BCrypt.Verify(password, user.Password))
        {
            throw new UnauthorizedAccessException("Invalid password");
        }
        
        return user;
    }
}