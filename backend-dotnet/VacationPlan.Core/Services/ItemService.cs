using VacationPlan.Core.DTOs;
using VacationPlan.Core.Interfaces;
using VacationPlan.Core.Models;

namespace VacationPlan.Core.Services;

/// <summary>
/// Service implementation for Itinerary Item business logic
/// Handles business rules, validation, and DTO mapping
/// </summary>
public class ItemService : IItemService
{
    private readonly IItemRepository _itemRepository;
    private readonly IItineraryRepository _itineraryRepository;

    public ItemService(
        IItemRepository itemRepository,
        IItineraryRepository itineraryRepository)
    {
        _itemRepository = itemRepository;
        _itineraryRepository = itineraryRepository;
    }

    /// <summary>
    /// Get all items for an itinerary with optional category filtering
    /// </summary>
    public async Task<ListResponse<ItemResponseDto>> GetItemsByItineraryAsync(
        Guid itineraryId,
        Guid userId,
        string? category = null)
    {
        // Verify user owns the itinerary
        var exists = await _itineraryRepository.ExistsAsync(itineraryId, userId);
        if (!exists)
            throw new UnauthorizedAccessException("Itinerary not found or access denied");

        var items = await _itemRepository.GetItemsByItineraryAsync(itineraryId, category);

        var response = items.Select(MapToDto).ToList();

        return new ListResponse<ItemResponseDto>
        {
            Data = response,
            Count = response.Count
        };
    }

    /// <summary>
    /// Get a single item by ID
    /// </summary>
    public async Task<ItemResponseDto?> GetItemByIdAsync(Guid id, Guid userId)
    {
        var item = await _itemRepository.GetByIdAsync(id);
        
        if (item == null)
            return null;

        // Verify user owns the parent itinerary
        var hasAccess = await _itineraryRepository.ExistsAsync(item.ItineraryId, userId);
        if (!hasAccess)
            throw new UnauthorizedAccessException("Access denied");

        return MapToDto(item);
    }

    /// <summary>
    /// Create a new item
    /// </summary>
    public async Task<ItemResponseDto> CreateItemAsync(
        Guid itineraryId,
        Guid userId,
        CreateItemDto dto)
    {
        // Verify user owns the itinerary
        var exists = await _itineraryRepository.ExistsAsync(itineraryId, userId);
        if (!exists)
            throw new UnauthorizedAccessException("Itinerary not found or access denied");

        // Business rule: Validate category
        var validCategories = new[] { "accommodation", "activity", "transport" };
        var normalizedCategory = dto.Category.ToLower();
        if (!validCategories.Contains(normalizedCategory))
            throw new ArgumentException($"Invalid category. Must be one of: {string.Join(", ", validCategories)}");

        // Business rule: Validate date range if provided
        if (dto.StartDatetime.HasValue && dto.EndDatetime.HasValue)
        {
            if (dto.EndDatetime.Value < dto.StartDatetime.Value)
                throw new ArgumentException("End datetime must be after start datetime");
        }

        var item = new ItineraryItem
        {
            ItineraryId = itineraryId,
            Category = normalizedCategory,
            Title = dto.Title,
            Description = dto.Description,
            StartDatetime = dto.StartDatetime,
            EndDatetime = dto.EndDatetime,
            Location = dto.Location,
            ConfirmationCode = dto.ConfirmationCode,
            Cost = dto.Cost,
            Currency = dto.Currency ?? "USD",
            MetadataDict = dto.Metadata,
            DisplayOrder = dto.DisplayOrder ?? 0
        };

        var created = await _itemRepository.CreateAsync(item);
        return MapToDto(created);
    }

    /// <summary>
    /// Update an existing item
    /// </summary>
    public async Task<ItemResponseDto?> UpdateItemAsync(
        Guid id,
        Guid userId,
        UpdateItemDto dto)
    {
        var item = await _itemRepository.GetByIdAsync(id);

        if (item == null)
            return null;

        // Verify user owns the parent itinerary
        var hasAccess = await _itineraryRepository.ExistsAsync(item.ItineraryId, userId);
        if (!hasAccess)
            throw new UnauthorizedAccessException("Access denied");

        // Apply updates
        if (!string.IsNullOrEmpty(dto.Title))
            item.Title = dto.Title;
    /// <summary>
    /// Bulk operations (reorder, bulk_delete)
    /// </summary>
    public async Task<BulkOperationResponse> BulkOperationAsync(Guid userId, BulkOperationDto dto)
    {
        if (dto.Operation.ToLower() == "reorder")
        {
            if (dto.Items == null || dto.Items.Count == 0)
                throw new ArgumentException("Items list is required for reorder operation");

            // Verify all items belong to user
            foreach (var item in dto.Items)
            {
                var existingItem = await _itemRepository.GetByIdAsync(item.Id);
                if (existingItem == null)
                    throw new ArgumentException($"Item {item.Id} not found");

                var hasAccess = await _itineraryRepository.ExistsAsync(existingItem.ItineraryId, userId);
                if (!hasAccess)
                    throw new UnauthorizedAccessException($"Access denied for item {item.Id}");
            }

            var reorderList = dto.Items.Select(i => (i.Id, i.DisplayOrder)).ToList();
            await _itemRepository.BulkReorderAsync(reorderList);

            return new BulkOperationResponse
            {
                Message = "Bulk reorder completed successfully",
                Processed = dto.Items.Count
            };
        }
        else if (dto.Operation.ToLower() == "bulk_delete")
        {
            if (dto.ItemIds == null || dto.ItemIds.Count == 0)
                throw new ArgumentException("ItemIds list is required for bulk_delete operation");

            // Verify all items belong to user
            foreach (var itemId in dto.ItemIds)
            {
                var item = await _itemRepository.GetByIdAsync(itemId);
                if (item == null)
                    throw new ArgumentException($"Item {itemId} not found");

                var hasAccess = await _itineraryRepository.ExistsAsync(item.ItineraryId, userId);
                if (!hasAccess)
                    throw new UnauthorizedAccessException($"Access denied for item {itemId}");
            }

            await _itemRepository.BulkDeleteAsync(dto.ItemIds);

            return new BulkOperationResponse
            {
                Message = "Bulk delete completed successfully",
                Processed = dto.ItemIds.Count
            };
        }
        else
        {
            throw new ArgumentException($"Invalid operation: {dto.Operation}. Supported operations: reorder, bulk_delete");
        }
    }

    {
        var item = await _itemRepository.GetByIdAsync(id);

        if (item == null)
            return false;

        // Verify user owns the parent itinerary
        var hasAccess = await _itineraryRepository.ExistsAsync(item.ItineraryId, userId);
        if (!hasAccess)
            throw new UnauthorizedAccessException("Access denied");

        await _itemRepository.DeleteAsync(id);
        return true;
    }

    /// <summary>
    /// Bulk update items (reorder, delete multiple)
    /// </summary>
    public async Task<bool> BulkUpdateItemsAsync(Guid userId, BulkUpdateItemsDto dto)
    {
        // Verify user owns all items
        foreach (var operation in dto.Operations)
        {
            var item = await _itemRepository.GetByIdAsync(operation.ItemId);
            if (item == null)
                throw new ArgumentException($"Item {operation.ItemId} not found");

            var hasAccess = await _itineraryRepository.ExistsAsync(item.ItineraryId, userId);
            if (!hasAccess)
                throw new UnauthorizedAccessException($"Access denied for item {operation.ItemId}");
        }

        // Process operations
        foreach (var operation in dto.Operations)
        {
            switch (operation.Action.ToLower())
            {
                case "delete":
                    await _itemRepository.DeleteAsync(operation.ItemId);
                    break;
                    
                case "reorder":
                    if (operation.DisplayOrder.HasValue)
                    {
                        var item = await _itemRepository.GetByIdAsync(operation.ItemId);
                        if (item != null)
                        {
                            item.DisplayOrder = operation.DisplayOrder.Value;
                            await _itemRepository.UpdateAsync(item);
                        }
                    }
                    break;
                    
                default:
                    throw new ArgumentException($"Invalid action: {operation.Action}");
            }
        }

        return true;
    }

    /// <summary>
    /// Map ItineraryItem entity to DTO
    /// </summary>
    private static ItemResponseDto MapToDto(ItineraryItem item)
    {
        return new ItemResponseDto
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
    }
}
