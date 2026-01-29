using LibraryManagement.Core.DTOs;
using LibraryManagement.Core.Entities;
using LibraryManagement.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly ILogger<UsersController> _logger;

    public UsersController(IUserRepository userRepository, ILogger<UsersController> logger)
    {
        _userRepository = userRepository;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<List<UserDto>>> GetUsers()
    {
        var users = await _userRepository.GetAllAsync();
        return Ok(users.Select(u => new UserDto(u.Id, u.Name, u.Email, u.Role, u.CreatedAt)));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
            return NotFound(new { message = "User not found" });

        return Ok(new UserDto(user.Id, user.Name, user.Email, user.Role, user.CreatedAt));
    }

    [HttpPost]
    public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserRequest request)
    {
        var existing = await _userRepository.GetByEmailAsync(request.Email);
        if (existing != null)
            return BadRequest(new { message = "User with this email already exists" });

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = request.Role,
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.CreateAsync(user);
        _logger.LogInformation("User created by admin: {Email}", user.Email);

        return CreatedAtAction(nameof(GetUser), new { id = user.Id },
            new UserDto(user.Id, user.Name, user.Email, user.Role, user.CreatedAt));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<UserDto>> UpdateUser(int id, [FromBody] UpdateUserRequest request)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
            return NotFound(new { message = "User not found" });

        if (request.Name != null) user.Name = request.Name;
        if (request.Email != null)
        {
            var existing = await _userRepository.GetByEmailAsync(request.Email);
            if (existing != null && existing.Id != id)
                return BadRequest(new { message = "Email already in use" });
            user.Email = request.Email;
        }
        if (request.Role.HasValue) user.Role = request.Role.Value;

        await _userRepository.UpdateAsync(user);
        _logger.LogInformation("User updated: {Id}", id);

        return Ok(new UserDto(user.Id, user.Name, user.Email, user.Role, user.CreatedAt));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
            return NotFound(new { message = "User not found" });

        await _userRepository.DeleteAsync(id);
        _logger.LogInformation("User deleted: {Id}", id);

        return NoContent();
    }
}
