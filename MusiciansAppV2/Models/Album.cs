namespace MusiciansAppV2.Models;

public class Album
{
    public int Id { get; set; }
    public int ArtistId { get; set; }
    public string Title { get; set; }
    public DateTime ReleaseDate { get; set; }
    public string ImagePath { get; set; }
    public List<Song> Songs { get; set; }
    public Artist Artist { get; set; }
}