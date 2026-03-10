using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VacationPlan.Core.Models;

namespace VacationPlan.Tests.Helpers;

/// <summary>
/// Common test utilities and helper methods
/// </summary>
public static class TestHelpers
{
    /// <summary>
    /// Setup authentication context for a controller with a specific user ID
    /// </summary>
    public static void SetupAuthentication(ControllerBase controller, Guid userId)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Name, "Test User"),
            new Claim(ClaimTypes.Email, "test@example.com")
        };
        var identity = new ClaimsIdentity(claims, "TestAuthType");
        var claimsPrincipal = new ClaimsPrincipal(identity);
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = claimsPrincipal }
        };
    }

    /// <summary>
    /// Create a test itinerary with default values
    /// </summary>
    public static Itinerary CreateTestItinerary(
        Guid? id = null,
        Guid? userId = null,
        string title = "Test Itinerary",
        string destination = "Test Destination",
        int daysFromNow = 10,
        int duration = 5)
    {
        return new Itinerary
        {
            Id = id ?? Guid.NewGuid(),
            UserId = userId ?? Guid.NewGuid(),
            Title = title,
            Destination = destination,
            StartDate = DateOnly.FromDateTime(DateTime.Now.AddDays(daysFromNow)),
            EndDate = DateOnly.FromDateTime(DateTime.Now.AddDays(daysFromNow + duration)),
            Description = "Test description",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    /// <summary>
    /// Create a test itinerary item with default values
    /// </summary>
    public static ItineraryItem CreateTestItem(
        Guid? id = null,
        Guid? itineraryId = null,
        string category = "flight",
        string title = "Test Item",
        decimal? cost = 100.00m,
        string currency = "USD")
    {
        return new ItineraryItem
        {
            Id = id ?? Guid.NewGuid(),
            ItineraryId = itineraryId ?? Guid.NewGuid(),
            Category = category.ToLower(),
            Title = title,
            Description = "Test Description",
            StartDatetime = DateTime.UtcNow.AddDays(1),
            EndDatetime = DateTime.UtcNow.AddDays(2),
            Location = "Test Location",
            ConfirmationCode = "TEST123",
            Cost = cost,
            Currency = currency,
            DisplayOrder = 0,
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    /// <summary>
    /// Create a test user
    /// </summary>
    public static User CreateTestUser(
        Guid? id = null,
        string email = "test@example.com",
        string name = "Test User")
    {
        return new User
        {
            Id = id ?? Guid.NewGuid(),
            Email = email,
            Name = name,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    /// <summary>
    /// Create a list of test itineraries
    /// </summary>
    public static List<Itinerary> CreateTestItineraries(int count, Guid? userId = null)
    {
        var itineraries = new List<Itinerary>();
        var testUserId = userId ?? Guid.NewGuid();

        for (int i = 0; i < count; i++)
        {
            itineraries.Add(CreateTestItinerary(
                userId: testUserId,
                title: $"Test Itinerary {i + 1}",
                destination: $"Destination {i + 1}",
                daysFromNow: 10 + (i * 7),
                duration: 5));
        }

        return itineraries;
    }

    /// <summary>
    /// Create a list of test items for an itinerary
    /// </summary>
    public static List<ItineraryItem> CreateTestItems(int count, Guid? itineraryId = null)
    {
        var items = new List<ItineraryItem>();
        var testItineraryId = itineraryId ?? Guid.NewGuid();
        var categories = new[] { "flight", "hotel", "activity", "restaurant", "transportation" };

        for (int i = 0; i < count; i++)
        {
            items.Add(CreateTestItem(
                itineraryId: testItineraryId,
                category: categories[i % categories.Length],
                title: $"Test Item {i + 1}",
                cost: 100.00m * (i + 1)));
        }

        return items;
    }

    /// <summary>
    /// Assert that a result is an OkObjectResult with the expected data type
    /// </summary>
    public static T GetOkResult<T>(IActionResult result) where T : class
    {
        if (result is not OkObjectResult okResult)
            throw new InvalidOperationException("Result is not OkObjectResult");

        if (okResult.Value is not T value)
            throw new InvalidOperationException($"Result value is not of type {typeof(T).Name}");

        return value;
    }

    /// <summary>
    /// Assert that a result is a CreatedAtActionResult with the expected data type
    /// </summary>
    public static T GetCreatedResult<T>(IActionResult result) where T : class
    {
        if (result is not CreatedAtActionResult createdResult)
            throw new InvalidOperationException("Result is not CreatedAtActionResult");

        if (createdResult.Value is not T value)
            throw new InvalidOperationException($"Result value is not of type {typeof(T).Name}");

        return value;
    }

    /// <summary>
    /// Get metadata dictionary for testing
    /// </summary>
    public static Dictionary<string, object> GetTestMetadata()
    {
        return new Dictionary<string, object>
        {
            { "notes", "Test notes" },
            { "priority", "high" },
            { "tags", new[] { "business", "urgent" } },
            { "rating", 5 }
        };
    }
}
