using VacationPlan.Core.DTOs;

namespace VacationPlan.Core.Interfaces;

/// <summary>
/// Service interface for Itinerary business logic
/// </summary>
public interface IItineraryService
{
    Task<ListResponse<ItineraryResponseDto>> GetUserItinerariesAsync(
        Guid userId, 
        int limit = 10, 
        int offset = 0, 
        string sortBy = "created_at", 
        string sortOrder = "DESC");
    
    Task<ItineraryResponseDto?> GetItineraryByIdAsync(Guid id, Guid userId);
    
    Task<ItineraryResponseDto> CreateItineraryAsync(Guid userId, CreateItineraryDto dto);
    
    Task<ItineraryResponseDto?> UpdateItineraryAsync(Guid id, Guid userId, UpdateItineraryDto dto);
    
    Task<bool> DeleteItineraryAsync(Guid id, Guid userId);
    
    Task<bool> ItineraryExistsAsync(Guid id, Guid userId);
}
