using System.ComponentModel.DataAnnotations;

namespace VacationPlan.Core.DTOs;

/// <summary>
/// DTO for generating JWT token
/// </summary>
public class GenerateTokenRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string AuthProviderId { get; set; } = string.Empty;
}

/// <summary>
/// DTO for token response
/// </summary>
public class TokenResponse
{
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public int ExpiresIn { get; set; }
    public Guid UserId { get; set; }
    public string Email { get; set; } = string.Empty;
}
