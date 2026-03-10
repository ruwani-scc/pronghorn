using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VacationPlan.Core.DTOs;
using VacationPlan.Core.Interfaces;
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
    private readonly IItemService _itemService;
    private readonly ILogger<ItemsController> _logger;

    public ItemsController(
        IItemService itemService,
        ILogger<ItemsController> logger)
    {
        _itemService = itemService;
        _logger = logger;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(userIdClaim ?? throw new UnauthorizedAccessException("User ID not found"));
    }

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    /// <summary>
    /// Get a single item by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<ItemResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetItem(Guid id)
    {
        try
        {
            var userId = GetUserId();
            var result = await _itemService.GetItemByIdAsync(id, userId);

            if (result == null)
                return NotFound(ApiResponse<object>.ErrorResponse("Item not found"));

            return Ok(ApiResponse<ItemResponseDto>.SuccessResponse(result));
        }
        catch (UnauthorizedAccessException ex)
        {
            return NotFound(ApiResponse<object>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Update an existing item
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(ApiResponse<ItemResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateItem(Guid id, [FromBody] UpdateItemDto dto)
    {
        try
        {
            var userId = GetUserId();
            var result = await _itemService.UpdateItemAsync(id, userId, dto);

            if (result == null)
                return NotFound(ApiResponse<object>.ErrorResponse("Item not found"));

            return Ok(ApiResponse<ItemResponseDto>.SuccessResponse(result, "Item updated successfully"));
        }
        catch (UnauthorizedAccessException ex)
    /// <summary>
    /// Delete an item
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteItem(Guid id)
    {
        try
        {
            var userId = GetUserId();
            var deleted = await _itemService.DeleteItemAsync(id, userId);

            if (!deleted)
                return NotFound(ApiResponse<object>.ErrorResponse("Item not found"));

            return Ok(ApiResponse<object>.SuccessResponse(null, "Item deleted successfully"));
        }
        catch (UnauthorizedAccessException ex)
        {
            return NotFound(ApiResponse<object>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Bulk operations on items (reorder, bulk delete)
    /// </summary>
    [HttpPost("bulk")]
    [ProducesResponseType(typeof(ApiResponse<BulkOperationResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> BulkOperation([FromBody] BulkOperationDto dto)
    {
        try
        {
            var userId = GetUserId();
            var result = await _itemService.BulkOperationAsync(userId, dto);

            return Ok(ApiResponse<BulkOperationResponse>.SuccessResponse(result));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message));
        }
        catch (UnauthorizedAccessException ex)
        {
            return NotFound(ApiResponse<object>.ErrorResponse(ex.Message));
        }
    }
}

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
