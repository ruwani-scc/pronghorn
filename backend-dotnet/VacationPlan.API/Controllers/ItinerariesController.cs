using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VacationPlan.Core.DTOs;
using VacationPlan.Core.Interfaces;
using System.Security.Claims;

namespace VacationPlan.API.Controllers;

/// <summary>
/// Controller for itinerary operations
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class ItinerariesController : ControllerBase
{
    private readonly IItineraryService _itineraryService;
    private readonly IItemService _itemService;
    private readonly ILogger<ItinerariesController> _logger;

    public ItinerariesController(
        IItineraryService itineraryService,
        IItemService itemService,
        ILogger<ItinerariesController> logger)
    {
        _itineraryService = itineraryService;
        _itemService = itemService;
        _logger = logger;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(userIdClaim ?? throw new UnauthorizedAccessException("User ID not found"));
    }
    /// <summary>
    /// Get all itineraries for the authenticated user
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<ListResponse<ItineraryResponseDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetItineraries([FromQuery] ItineraryQueryDto query)
    {
        var userId = GetUserId();
        var result = await _itineraryService.GetUserItinerariesAsync(
            userId, query.Limit, query.Offset, query.SortBy, query.SortOrder);

        return Ok(ApiResponse<ListResponse<ItineraryResponseDto>>.SuccessResponse(result));
    }

    /// <summary>
    /// Get a single itinerary by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<ItineraryResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetItinerary(Guid id)
    {
        var userId = GetUserId();
        var result = await _itineraryService.GetItineraryByIdAsync(id, userId);

        if (result == null)
            return NotFound(ApiResponse<object>.ErrorResponse("Itinerary not found"));

        return Ok(ApiResponse<ItineraryResponseDto>.SuccessResponse(result));
    }

    /// <summary>
    /// Create a new itinerary
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<ItineraryResponseDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateItinerary([FromBody] CreateItineraryDto dto)
    {
        var userId = GetUserId();
        var result = await _itineraryService.CreateItineraryAsync(userId, dto);

        return CreatedAtAction(nameof(GetItinerary), new { id = result.Id },
            ApiResponse<ItineraryResponseDto>.SuccessResponse(result, "Itinerary created successfully"));
    }

    /// <summary>
    /// Update an existing itinerary
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(ApiResponse<ItineraryResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateItinerary(Guid id, [FromBody] UpdateItineraryDto dto)
    {
        var userId = GetUserId();
        var result = await _itineraryService.UpdateItineraryAsync(id, userId, dto);

        if (result == null)
            return NotFound(ApiResponse<object>.ErrorResponse("Itinerary not found"));

        return Ok(ApiResponse<ItineraryResponseDto>.SuccessResponse(result, "Itinerary updated successfully"));
    }

    /// <summary>
    /// Delete an itinerary
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteItinerary(Guid id)
    {
        var userId = GetUserId();
        var deleted = await _itineraryService.DeleteItineraryAsync(id, userId);

        if (!deleted)
            return NotFound(ApiResponse<object>.ErrorResponse("Itinerary not found"));
    /// <summary>
    /// Get all items for an itinerary
    /// </summary>
    [HttpGet("{id}/items")]
    [ProducesResponseType(typeof(ApiResponse<ListResponse<ItemResponseDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetItineraryItems(Guid id, [FromQuery] ItemQueryDto query)
    {
        try
        {
            var userId = GetUserId();
            var result = await _itemService.GetItemsByItineraryAsync(id, userId, query.Category);

            return Ok(ApiResponse<ListResponse<ItemResponseDto>>.SuccessResponse(result));
        }
        catch (UnauthorizedAccessException ex)
        {
            return NotFound(ApiResponse<object>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Add an item to an itinerary
    /// </summary>
    [HttpPost("{id}/items")]
    [ProducesResponseType(typeof(ApiResponse<ItemResponseDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AddItem(Guid id, [FromBody] CreateItemDto dto)
    {
        try
        {
            var userId = GetUserId();
            var result = await _itemService.CreateItemAsync(id, userId, dto);

            return CreatedAtAction(nameof(ItemsController.GetItem), "Items", new { id = result.Id },
                ApiResponse<ItemResponseDto>.SuccessResponse(result, "Item created successfully"));
        }
        catch (UnauthorizedAccessException ex)
        {
            return NotFound(ApiResponse<object>.ErrorResponse(ex.Message));
        }
    }
}

            Destination = created.Destination,
            StartDate = created.StartDate,
            EndDate = created.EndDate,
            Description = created.Description,
            CreatedAt = created.CreatedAt,
            UpdatedAt = created.UpdatedAt,
            DurationDays = created.DurationDays
        };

        return CreatedAtAction(nameof(GetItinerary), new { id = created.Id },
            ApiResponse<ItineraryResponseDto>.SuccessResponse(response, "Itinerary created successfully"));
    }

    /// <summary>
    /// Update an existing itinerary
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(ApiResponse<ItineraryResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateItinerary(Guid id, [FromBody] UpdateItineraryDto dto)
    {
        var userId = GetUserId();
        var itinerary = await _itineraryRepository.GetByIdAndUserAsync(id, userId);

        if (itinerary == null)
            return NotFound(ApiResponse<object>.ErrorResponse("Itinerary not found"));

        if (!string.IsNullOrEmpty(dto.Title))
            itinerary.Title = dto.Title;
        if (dto.Destination != null)
            itinerary.Destination = dto.Destination;
        if (dto.StartDate.HasValue)
            itinerary.StartDate = dto.StartDate.Value;
        if (dto.EndDate.HasValue)
            itinerary.EndDate = dto.EndDate.Value;
        if (dto.Description != null)
            itinerary.Description = dto.Description;

        var updated = await _itineraryRepository.UpdateAsync(itinerary);

        var response = new ItineraryResponseDto
        {
            Id = updated.Id,
            UserId = updated.UserId,
            Title = updated.Title,
            Destination = updated.Destination,
            StartDate = updated.StartDate,
            EndDate = updated.EndDate,
            Description = updated.Description,
            CreatedAt = updated.CreatedAt,
            UpdatedAt = updated.UpdatedAt,
            DurationDays = updated.DurationDays
        };

        return Ok(ApiResponse<ItineraryResponseDto>.SuccessResponse(response, "Itinerary updated successfully"));
    }

    /// <summary>
    /// Delete an itinerary
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteItinerary(Guid id)
    {
        var userId = GetUserId();
        var exists = await _itineraryRepository.ExistsAsync(id, userId);

        if (!exists)
            return NotFound(ApiResponse<object>.ErrorResponse("Itinerary not found"));

        await _itineraryRepository.DeleteAsync(id);

        return Ok(ApiResponse<object>.SuccessResponse(null, "Itinerary deleted successfully"));
    }

    /// <summary>
    /// Get all items for an itinerary
    /// </summary>
    [HttpGet("{id}/items")]
    [ProducesResponseType(typeof(ApiResponse<ListResponse<ItemResponseDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetItineraryItems(Guid id, [FromQuery] ItemQueryDto query)
    {
        var userId = GetUserId();
        var exists = await _itineraryRepository.ExistsAsync(id, userId);

        if (!exists)
            return NotFound(ApiResponse<object>.ErrorResponse("Itinerary not found"));

        var items = await _itemRepository.GetItemsByItineraryAsync(id, query.Category);

        var response = items.Select(i => new ItemResponseDto
        {
            Id = i.Id,
            ItineraryId = i.ItineraryId,
            Category = i.Category,
            Title = i.Title,
            Description = i.Description,
            StartDatetime = i.StartDatetime,
            EndDatetime = i.EndDatetime,
            Location = i.Location,
            ConfirmationCode = i.ConfirmationCode,
            Cost = i.Cost,
            Currency = i.Currency,
            Metadata = i.MetadataDict,
            DisplayOrder = i.DisplayOrder,
            IsCompleted = i.IsCompleted,
            CreatedAt = i.CreatedAt,
            UpdatedAt = i.UpdatedAt
        }).ToList();

        return Ok(ApiResponse<ListResponse<ItemResponseDto>>.SuccessResponse(
            new ListResponse<ItemResponseDto> { Data = response, Count = response.Count }));
    }

    /// <summary>
    /// Add an item to an itinerary
    /// </summary>
    [HttpPost("{id}/items")]
    [ProducesResponseType(typeof(ApiResponse<ItemResponseDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AddItem(Guid id, [FromBody] CreateItemDto dto)
    {
        var userId = GetUserId();
        var exists = await _itineraryRepository.ExistsAsync(id, userId);

        if (!exists)
            return NotFound(ApiResponse<object>.ErrorResponse("Itinerary not found"));

        var item = new ItineraryItem
        {
            ItineraryId = id,
            Category = dto.Category.ToLower(),
            Title = dto.Title,
            Description = dto.Description,
            StartDatetime = dto.StartDatetime,
            EndDatetime = dto.EndDatetime,
            Location = dto.Location,
            ConfirmationCode = dto.ConfirmationCode,
            Cost = dto.Cost,
            Currency = dto.Currency,
            MetadataDict = dto.Metadata,
            DisplayOrder = dto.DisplayOrder
        };

        var created = await _itemRepository.CreateAsync(item);

        var response = new ItemResponseDto
        {
            Id = created.Id,
            ItineraryId = created.ItineraryId,
            Category = created.Category,
            Title = created.Title,
            Description = created.Description,
            StartDatetime = created.StartDatetime,
            EndDatetime = created.EndDatetime,
            Location = created.Location,
            ConfirmationCode = created.ConfirmationCode,
            Cost = created.Cost,
            Currency = created.Currency,
            Metadata = created.MetadataDict,
            DisplayOrder = created.DisplayOrder,
            IsCompleted = created.IsCompleted,
            CreatedAt = created.CreatedAt,
            UpdatedAt = created.UpdatedAt
        };

        return CreatedAtAction(nameof(ItemsController.GetItem), "Items", new { id = created.Id },
            ApiResponse<ItemResponseDto>.SuccessResponse(response, "Item created successfully"));
    }
}
