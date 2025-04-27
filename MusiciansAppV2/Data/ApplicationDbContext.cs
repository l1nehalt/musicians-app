using Microsoft.EntityFrameworkCore;
using MusiciansAppV2.Models;

namespace MusiciansAppV2.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
        
    }
    public DbSet<Artist> Artists { get; set; }
    public DbSet<Song> Songs { get; set; }
    public DbSet<Album> Albums { get; set; }
    public DbSet<Favorite> Favorites { get; set; }
    public DbSet<User> Users { get; set; }
    
}