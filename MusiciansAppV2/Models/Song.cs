using System.ComponentModel.DataAnnotations.Schema;

namespace MusiciansAppV2.Models;

public class Song
{
    public int Id { get; set; }
    
    public int AlbumId { get; set; }
    
    public int ArtistId { get; set; }
    public string Title { get; set; }
    
    public string? FeaturingArtists { get; set; }
    public string FilePath { get; set; }
    public string ImagePath { get; set; }
    
    public bool IsSingle { get; set; }
    public Artist? Artist { get; set; }
    public Album? Album { get; set; }
    
}