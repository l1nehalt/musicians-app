using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MusiciansAppV2.Services;
using MusiciansAppV2.Models;

namespace MusiciansAppV2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register(User user)
        {
            try
            {
                var newUser = await _authService.RegisterAsync(user);
                return Ok(new { message = "User registered successfully", newUser });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(User user)
        {
            try
            {
                var newUser = await _authService.LoginAsync(user.Email, user.Password);
                return Ok(new { message = "User logged in successfully", newUser });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
