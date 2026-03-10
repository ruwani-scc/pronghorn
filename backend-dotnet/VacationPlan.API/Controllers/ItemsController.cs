using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VacationPlan.Core.DTOs;
using VacationPlan.Core.Interfaces;
using VacationPlan.Core.Models;
using System.Security.Claims;

namespace VacationPlan.API.Controllers;

/// <summary>
/// Controller for itinerary item operations
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class ItemsController : ControllerBase
{
    private readonly IItemRepository _itemRepository;
    private readonly ILogger<ItemsController> _logger;

    public ItemsController(
        IItemRepository itemRepository,
        ILogger<ItemsController> logger)
    {
        _itemRepository = itemRepository;
        _logger = logger;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(userIdClaim ?? throw new UnauthorizedAccessException("User ID not found"));
    }

    /// <summary>
    /// Get a single item by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<ItemResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetItem(Guid id)
    {
        var userId = GetUserId();
        var item = await _itemRepository.GetByIdAsync(id);

        if (item == null || !await _itemRepository.BelongsToUserAsync(id, userId))
            return NotFound(ApiResponse<object>.ErrorResponse("Item not found"));

        var response = new ItemResponseDto
        {
            Id = item.Id,
            ItineraryId = item.ItineraryId,
            Category = item.Category,
            Title = item.Title,
            Description = item.Description,
            StartDatetime = item.StartDatetime,
            EndDatetime = item.EndDatetime,
            Location = item.Location,
            ConfirmationCode = item.ConfirmationCode,
            Cost = item.Cost,
            Currency = item.Currency,
            Metadata = item.MetadataDict,
            DisplayOrder = item.DisplayOrder,
            IsCompleted = item.IsCompleted,
            CreatedAt = item.CreatedAt,
            UpdatedAt = item.UpdatedAt
        };

        return Ok(ApiResponse<ItemResponseDto>.SuccessResponse(response));
    }

    /// <summary>
    /// Update an existing item
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(ApiResponse<ItemResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateItem(Guid id, [FromBody] UpdateItemDto dto)
    {
        var userId = GetUserId();
        var item = await _itemRepository.GetByIdAsync(id);

        if (item == null || !await _itemRepository.BelongsToUserAsync(id, userId))
            return NotFound(ApiResponse<object>.ErrorResponse("Item not found"));

        if (!string.IsNullOrEmpty(dto.Category))
            item.Category = dto.Category.ToLower();
        if (!string.IsNullOrEmpty(dto.Title))
            item.Title = dto.Title;
        if (dto.Description != null)
            item.Description = dto.Description;
        if (dto.StartDatetime.HasValue)
            item.StartDatetime = dto.StartDatetime;
        if (dto.EndDatetime.HasValue)
            item.EndDatetime = dto.EndDatetime;
        if (dto.Location != null)
            item.Location = dto.Location;
        if (dto.ConfirmationCode != null)
            item.ConfirmationCode = dto.ConfirmationCode;
        if (dto.Cost.HasValue)
            item.Cost = dto.Cost;
        if (!string.IsNullOrEmpty(dto.Currency))
            item.Currency = dto.Currency;
        if (dto.Metadata != null)
            item.MetadataDict = dto.Metadata;
        if (dto.DisplayOrder.HasValue)
            item.DisplayOrder = dto.DisplayOrder.Value;
        if (dto.IsCompleted.HasValue)
            item.IsCompleted = dto.IsCompleted.Value;

        var updated = await _itemRepository.UpdateAsync(item);

        var response = new ItemResponseDto
        {
            Id = updated.Id,
            ItineraryId = updated.ItineraryId,
            Category = updated.Category,
            Title = updated.Title,
            Description = updated.Description,
            StartDatetime = updated.StartDatetime,
            EndDatetime = updated.EndDatetime,
            Location = updated.Location,
            ConfirmationCode = updated.ConfirmationCode,
            Cost = updated.Cost,
            Currency = updated.Currency,
            Metadata = updated.MetadataDict,
            DisplayOrder = updated.DisplayOrder,
            IsCompleted = updated.IsCompleted,
            CreatedAt = updated.CreatedAt,
            UpdatedAt = updated.UpdatedAt
        };

        return Ok(ApiResponse<ItemResponseDto>.SuccessResponse(response, "Item updated successfully"));
    }

    /// <summary>
    /// Delete an item
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteItem(Guid id)
    {
        var userId = GetUserId();
        var belongsToUser = await _itemRepository.BelongsToUserAsync(id, userId);

        if (!belongsToUser)
            return NotFound(ApiResponse<object>.ErrorResponse("Item not found"));

        await _itemRepository.DeleteAsync(id);

        return Ok(ApiResponse<object>.SuccessResponse(null, "Item deleted successfully"));
    }

    /// <summary>
    /// Bulk operations on items (reorder, bulk delete)
    /// </summary>
    [HttpPost("bulk")]
    [ProducesResponseType(typeof(ApiResponse<BulkOperationResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> BulkOperation([FromBody] BulkOperationDto dto)
    {
        var userId = GetUserId();

        if (dto.Operation.ToLower() == "reorder")
        {
            if (dto.Items == null || dto.Items.Count == 0)
                return BadRequest(ApiResponse<object>.ErrorResponse("Items list is required for reorder operation"));

            // Verify all items belong to user
            foreach (var item in dto.Items)
            {
                if (!await _itemRepository.BelongsToUserAsync(item.Id, userId))
                    return NotFound(ApiResponse<object>.ErrorResponse($"Item {item.Id} not found"));
            }

            var reorderList = dto.Items.Select(i => (i.Id, i.DisplayOrder)).ToList();
            await _itemRepository.BulkReorderAsync(reorderList);

            return Ok(ApiResponse<BulkOperationResponse>.SuccessResponse(
                new BulkOperationResponse
                {
                    Message = "Bulk reorder completed successfully",
                    Processed = dto.Items.Count
                }));
        }
        else if (dto.Operation.ToLower() == "bulk_delete")
        {
            if (dto.ItemIds == null || dto.ItemIds.Count == 0)
                return BadRequest(ApiResponse<object>.ErrorResponse("ItemIds list is required for bulk_delete operation"));

            // Verify all items belong to user
            foreach (var itemId in dto.ItemIds)
            {
                if (!await _itemRepository.BelongsToUserAsync(itemId, userId))
                    return NotFound(ApiResponse<object>.ErrorResponse($"Item {itemId} not found"));
            }

            await _itemRepository.BulkDeleteAsync(dto.ItemIds);

            return Ok(ApiResponse<BulkOperationResponse>.SuccessResponse(
                new BulkOperationResponse
                {
                    Message = "Bulk delete completed successfully",
                    Processed = dto.ItemIds.Count
                }));
        }
        else
        {
            return BadRequest(ApiResponse<object>.ErrorResponse(
                "Invalid operation. Supported operations: reorder, bulk_delete"));
        }
    }
}
