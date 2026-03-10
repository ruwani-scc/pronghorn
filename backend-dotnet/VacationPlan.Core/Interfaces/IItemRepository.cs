using VacationPlan.Core.Models;

namespace VacationPlan.Core.Interfaces;

/// <summary>
/// Repository interface for ItineraryItem operations
/// </summary>
public interface IItemRepository
{
    Task<List<ItineraryItem>> GetItemsByItineraryAsync(Guid itineraryId, string? category = null);
    Task<ItineraryItem?> GetByIdAsync(Guid id);
    Task<ItineraryItem> CreateAsync(ItineraryItem item);
    Task<ItineraryItem> UpdateAsync(ItineraryItem item);
    Task DeleteAsync(Guid id);
    Task BulkReorderAsync(List<(Guid id, int displayOrder)> items);
    Task BulkDeleteAsync(List<Guid> itemIds);
    Task<bool> BelongsToUserAsync(Guid itemId, Guid userId);
}
