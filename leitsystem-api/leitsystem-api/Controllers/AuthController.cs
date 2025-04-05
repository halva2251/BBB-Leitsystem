using leitsystem_api.Data;
using leitsystem_api.ModelsDTO;
using leitsystem_api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace leitsystem_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(DataContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        
        [HttpPost("/register")]
        public IActionResult Registration([FromBody] RegisterDTO data)
        {
            // Validate input
            if (string.IsNullOrWhiteSpace(data.Username) || string.IsNullOrWhiteSpace(data.Password))
            {
                return BadRequest("Invalid data");
            }

            // Check if the username already exists
            if (_context.Users.Any(u => u.Username == data.Username))
            {
                return BadRequest("Username already exists");
            }

            // If no users exist, the first registered user is an admin
            bool isAdmin = !_context.Users.Any();

            // Hash the password using BCrypt (ensure you have the BCrypt.Net-Next package installed)
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(data.Password);

            // Create the new user
            var newUser = new User
            {
                Username = data.Username,
                Email = data.Email,
                PasswordHash = passwordHash,
            };

            // Add the new user to the database and save changes
            _context.Users.Add(newUser);
            _context.SaveChanges();

            return Ok(new { Message = "Registration successful", IsAdmin = isAdmin });

        }
        [HttpPost("/login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
        {
            if (string.IsNullOrWhiteSpace(loginDto.Email) || string.IsNullOrWhiteSpace(loginDto.Password))
                return BadRequest("Username and password are required.");

            // Retrieve the user from the database (adjust the property names as needed)
            var user = await _context.Users
                .SingleOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null)
                return Unauthorized("Invalid username or password.");

            // Verify the password (assuming you use BCrypt for hashing)
            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
                return Unauthorized("Invalid username or password.");

            // Create JWT token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Secret"]); // Make sure this secret is set in appsettings.json
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim("UserId", user.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new { Token = tokenString });
        }
    }
}
