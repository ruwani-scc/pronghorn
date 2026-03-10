using VacationPlan.Core.DTOs;

namespace VacationPlan.Core.Interfaces;

/// <summary>
/// Service interface for Itinerary Item business logic
/// </summary>
public interface IItemService
{
    Task<ListResponse<ItemResponseDto>> GetItemsByItineraryAsync(
        Guid itineraryId, 
        Guid userId, 
        string? category = null);
    
    Task<ItemResponseDto?> GetItemByIdAsync(Guid id, Guid userId);
    
    Task<ItemResponseDto> CreateItemAsync(Guid itineraryId, Guid userId, CreateItemDto dto);
    
    Task<ItemResponseDto?> UpdateItemAsync(Guid id, Guid userId, UpdateItemDto dto);
    
    Task<bool> DeleteItemAsync(Guid id, Guid userId);
    
    Task<BulkOperationResponse> BulkOperationAsync(Guid userId, BulkOperationDto dto);
}

    Task<bool> BulkUpdateItemsAsync(Guid userId, BulkUpdateItemsDto dto);
}
