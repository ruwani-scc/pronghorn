namespace VacationPlan.Core.DTOs;

/// <summary>
/// DTO for creating a new itinerary
/// </summary>
public class CreateItineraryDto
{
    public string Title { get; set; } = string.Empty;
    public string? Destination { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string? Description { get; set; }
}

/// <summary>
/// DTO for updating an existing itinerary
/// </summary>
public class UpdateItineraryDto
{
    public string? Title { get; set; }
    public string? Destination { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string? Description { get; set; }
}

/// <summary>
/// DTO for itinerary response
/// </summary>
public class ItineraryResponseDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Destination { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public int DurationDays { get; set; }
}

/// <summary>
/// DTO for itinerary list query parameters
/// </summary>
public class ItineraryQueryDto
{
    public int Limit { get; set; } = 50;
    public int Offset { get; set; } = 0;
    public string SortBy { get; set; } = "created_at";
    public string SortOrder { get; set; } = "DESC";
}
