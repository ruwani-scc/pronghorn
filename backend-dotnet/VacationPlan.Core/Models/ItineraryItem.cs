using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace VacationPlan.Core.Models;

/// <summary>
/// Itinerary item entity - represents accommodations, activities, or transport
/// </summary>
[Table("itinerary_items")]
public class ItineraryItem
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [Column("itinerary_id")]
    public Guid ItineraryId { get; set; }

    [Required]
    [Column("category")]
    [MaxLength(50)]
    public string Category { get; set; } = string.Empty;

    [Required]
    [Column("title")]
    [MaxLength(255)]
    public string Title { get; set; } = string.Empty;

    [Column("description")]
    public string? Description { get; set; }

    [Column("start_datetime")]
    public DateTime? StartDatetime { get; set; }

    [Column("end_datetime")]
    public DateTime? EndDatetime { get; set; }

    [Column("location")]
    [MaxLength(255)]
    public string? Location { get; set; }

    [Column("confirmation_code")]
    [MaxLength(100)]
    public string? ConfirmationCode { get; set; }

    [Column("cost")]
    [Precision(10, 2)]
    public decimal? Cost { get; set; }

    [Column("currency")]
    [MaxLength(3)]
    public string Currency { get; set; } = "USD";

    [Column("metadata", TypeName = "jsonb")]
    public string? Metadata { get; set; }

    [Column("display_order")]
    public int DisplayOrder { get; set; } = 0;

    [Column("is_completed")]
    public bool IsCompleted { get; set; } = false;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    [ForeignKey("ItineraryId")]
    public virtual Itinerary Itinerary { get; set; } = null!;

    // Helper methods for metadata
    [NotMapped]
    public Dictionary<string, object>? MetadataDict
    {
        get => string.IsNullOrEmpty(Metadata)
            ? null
            : JsonSerializer.Deserialize<Dictionary<string, object>>(Metadata);
        set => Metadata = value == null
            ? null
            : JsonSerializer.Serialize(value);
    }
}

/// <summary>
/// Item category constants
/// </summary>
public static class ItemCategory
{
    public const string Accommodation = "accommodation";
    public const string Activity = "activity";
    public const string Transport = "transport";

    public static readonly string[] ValidCategories =
    {
        Accommodation,
        Activity,
        Transport
    };

    public static bool IsValid(string category)
    {
        return ValidCategories.Contains(category?.ToLower());
    }
}
