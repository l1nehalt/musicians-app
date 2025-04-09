namespace MusiciansAppV2.Models;

public class Artist
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string ImagePath { get; set; }
    public List<Album>? Albums { get; set; }
    public List<Song>? Single { get; set; }
}