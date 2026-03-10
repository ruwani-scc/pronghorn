using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using VacationPlan.Core.DTOs;
using VacationPlan.Core.Interfaces;
using VacationPlan.Core.Models;

namespace VacationPlan.API.Controllers;

/// <summary>
/// Controller for authentication operations
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        IUserRepository userRepository,
        IConfiguration configuration,
        ILogger<AuthController> logger)
    {
        _userRepository = userRepository;
        _configuration = configuration;
        _logger = logger;
    }

    /// <summary>
    /// Generate JWT token for a user by email and auth provider ID
    /// </summary>
    /// <param name="request">Email and auth provider ID</param>
    /// <returns>JWT token with expiration information</returns>
    [HttpPost("token")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<TokenResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GenerateToken([FromBody] GenerateTokenRequest request)
    {
        try
        {
            // Find user by email and auth provider ID
            var user = await _userRepository.GetByEmailAndAuthProviderIdAsync(
                request.Email, 
                request.AuthProviderId);

            if (user == null)
            {
                _logger.LogWarning(
                    "Token generation failed: User not found with email {Email} and auth provider ID {AuthProviderId}",
                    request.Email,
                    request.AuthProviderId);
                
                return NotFound(ApiResponse<object>.ErrorResponse(
                    "User not found with the provided email and auth provider ID"));
            }

            // Generate JWT token
            var token = GenerateJwtToken(user);
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var expirationMinutes = int.Parse(jwtSettings["ExpirationMinutes"] ?? "60");
            var expiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes);

            var response = new TokenResponse
            {
                Token = token,
                ExpiresAt = expiresAt,
                ExpiresIn = expirationMinutes * 60, // in seconds
                UserId = user.Id,
                Email = user.Email
            };

            _logger.LogInformation(
                "JWT token generated successfully for user {UserId} with email {Email}",
                user.Id,
                user.Email);

            return Ok(ApiResponse<TokenResponse>.SuccessResponse(
                response, 
                "Token generated successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating token for email {Email}", request.Email);
            return StatusCode(500, ApiResponse<object>.ErrorResponse(
                "An error occurred while generating the token"));
        }
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["Secret"] ?? throw new InvalidOperationException("JWT Secret not configured");
        var issuer = jwtSettings["Issuer"];
        var audience = jwtSettings["Audience"];
        var expirationMinutes = int.Parse(jwtSettings["ExpirationMinutes"] ?? "60");

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim("auth_provider_id", user.AuthProviderId),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
