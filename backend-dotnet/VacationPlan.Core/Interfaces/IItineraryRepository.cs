using VacationPlan.Core.Models;

namespace VacationPlan.Core.Interfaces;

/// <summary>
/// Repository interface for Itinerary operations
/// </summary>
public interface IItineraryRepository
{
    Task<List<Itinerary>> GetUserItinerariesAsync(Guid userId, int limit, int offset, string sortBy, string sortOrder);
    Task<Itinerary?> GetByIdAsync(Guid id);
    Task<Itinerary?> GetByIdAndUserAsync(Guid id, Guid userId);
    Task<Itinerary> CreateAsync(Itinerary itinerary);
    Task<Itinerary> UpdateAsync(Itinerary itinerary);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id, Guid userId);
    Task<int> GetCountAsync(Guid userId);
}
