using Microsoft.AspNetCore.Mvc;
using MusiciansAppV2.Models;
using MusiciansAppV2.Services;

namespace MusiciansAppV2.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateUser(User user)
        {
            await _userService.CreateUserAsync(user);
            return Ok(user);
        }

        [HttpPost("addSong/{trackId}")]
        public async Task<IActionResult> AddFavoriteSong([FromQuery] int userId, int trackId)
        {
            var favorite = await _userService.AddFavoriteAsync(userId, trackId);

            if (favorite == null)
            {
                return BadRequest();
            }
            else
            {
                return Ok(favorite);
            }
        }

        [HttpGet("favorites/{userId}")]
        public async Task<IActionResult> GetFavorites(int userId)
        {
            var favorites = await _userService.GetFavoritesAsync(userId);
            return Ok(favorites);
        }
    }
}
