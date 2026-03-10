using System.Text.Json;

namespace VacationPlan.Core.DTOs;

/// <summary>
/// DTO for creating a new itinerary item
/// </summary>
public class CreateItemDto
{
    public string Category { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime? StartDatetime { get; set; }
    public DateTime? EndDatetime { get; set; }
    public string? Location { get; set; }
    public string? ConfirmationCode { get; set; }
    public decimal? Cost { get; set; }
    public string Currency { get; set; } = "USD";
    public Dictionary<string, object>? Metadata { get; set; }
    public int DisplayOrder { get; set; } = 0;
}

/// <summary>
/// DTO for updating an existing itinerary item
/// </summary>
public class UpdateItemDto
{
    public string? Category { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public DateTime? StartDatetime { get; set; }
    public DateTime? EndDatetime { get; set; }
    public string? Location { get; set; }
    public string? ConfirmationCode { get; set; }
    public decimal? Cost { get; set; }
    public string? Currency { get; set; }
    public Dictionary<string, object>? Metadata { get; set; }
    public int? DisplayOrder { get; set; }
    public bool? IsCompleted { get; set; }
}

/// <summary>
/// DTO for item response
/// </summary>
public class ItemResponseDto
{
    public Guid Id { get; set; }
    public Guid ItineraryId { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime? StartDatetime { get; set; }
    public DateTime? EndDatetime { get; set; }
    public string? Location { get; set; }
    public string? ConfirmationCode { get; set; }
    public decimal? Cost { get; set; }
    public string Currency { get; set; } = "USD";
    public Dictionary<string, object>? Metadata { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

/// <summary>
/// DTO for bulk operations
/// </summary>
public class BulkOperationDto
{
    public string Operation { get; set; } = string.Empty;
    public List<BulkItemDto>? Items { get; set; }
    public List<Guid>? ItemIds { get; set; }
}

public class BulkItemDto
{
    public Guid Id { get; set; }
    public int DisplayOrder { get; set; }
}

/// <summary>
/// DTO for item query parameters
/// </summary>
public class ItemQueryDto
{
    public string? Category { get; set; }
}
