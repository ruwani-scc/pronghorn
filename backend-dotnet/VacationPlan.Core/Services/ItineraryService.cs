using VacationPlan.Core.DTOs;
using VacationPlan.Core.Interfaces;
using VacationPlan.Core.Models;

namespace VacationPlan.Core.Services;

/// <summary>
/// Service implementation for Itinerary business logic
/// Handles business rules, validation, and DTO mapping
/// </summary>
public class ItineraryService : IItineraryService
{
    private readonly IItineraryRepository _itineraryRepository;
    private readonly IItemRepository _itemRepository;

    public ItineraryService(
        IItineraryRepository itineraryRepository,
        IItemRepository itemRepository)
    {
        _itineraryRepository = itineraryRepository;
        _itemRepository = itemRepository;
    }

    /// <summary>
    /// Get all itineraries for a user with pagination and sorting
    /// </summary>
    public async Task<ListResponse<ItineraryResponseDto>> GetUserItinerariesAsync(
        Guid userId,
        int limit = 10,
        int offset = 0,
        string sortBy = "created_at",
        string sortOrder = "DESC")
    {
        // Apply business rules for pagination
        limit = Math.Min(limit, 100); // Max 100 items per page
        offset = Math.Max(offset, 0); // No negative offsets

        var itineraries = await _itineraryRepository.GetUserItinerariesAsync(
            userId, limit, offset, sortBy, sortOrder);

        var count = await _itineraryRepository.GetCountAsync(userId);

        var response = itineraries.Select(MapToDto).ToList();

        return new ListResponse<ItineraryResponseDto>
        {
            Data = response,
            Count = count
        };
    }

    /// <summary>
    /// Get a single itinerary by ID
    /// </summary>
    public async Task<ItineraryResponseDto?> GetItineraryByIdAsync(Guid id, Guid userId)
    {
        var itinerary = await _itineraryRepository.GetByIdAndUserAsync(id, userId);
        
        if (itinerary == null)
            return null;

        return MapToDto(itinerary);
    }

    /// <summary>
    /// Create a new itinerary
    /// </summary>
    public async Task<ItineraryResponseDto> CreateItineraryAsync(Guid userId, CreateItineraryDto dto)
    {
        // Business rule: Validate date range
        if (dto.EndDate < dto.StartDate)
            throw new ArgumentException("End date must be after start date");

        var itinerary = new Itinerary
        {
            UserId = userId,
            Title = dto.Title,
            Destination = dto.Destination,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Description = dto.Description
        };

        var created = await _itineraryRepository.CreateAsync(itinerary);
        return MapToDto(created);
    }

    /// <summary>
    /// Update an existing itinerary
    /// </summary>
    public async Task<ItineraryResponseDto?> UpdateItineraryAsync(
        Guid id,
        Guid userId,
        UpdateItineraryDto dto)
    {
        var itinerary = await _itineraryRepository.GetByIdAndUserAsync(id, userId);

        if (itinerary == null)
            return null;

        // Apply updates
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

        // Business rule: Validate date range after updates
        if (itinerary.EndDate < itinerary.StartDate)
            throw new ArgumentException("End date must be after start date");

        var updated = await _itineraryRepository.UpdateAsync(itinerary);
        return MapToDto(updated);
    }

    /// <summary>
    /// Delete an itinerary
    /// </summary>
    public async Task<bool> DeleteItineraryAsync(Guid id, Guid userId)
    {
        var exists = await _itineraryRepository.ExistsAsync(id, userId);

        if (!exists)
            return false;

        await _itineraryRepository.DeleteAsync(id);
        return true;
    }

    /// <summary>
    /// Check if an itinerary exists for a user
    /// </summary>
    public async Task<bool> ItineraryExistsAsync(Guid id, Guid userId)
    {
        return await _itineraryRepository.ExistsAsync(id, userId);
    }

    /// <summary>
    /// Map Itinerary entity to DTO
    /// </summary>
    private static ItineraryResponseDto MapToDto(Itinerary itinerary)
    {
        return new ItineraryResponseDto
        {
            Id = itinerary.Id,
            UserId = itinerary.UserId,
            Title = itinerary.Title,
            Destination = itinerary.Destination,
            StartDate = itinerary.StartDate,
            EndDate = itinerary.EndDate,
            Description = itinerary.Description,
            CreatedAt = itinerary.CreatedAt,
            UpdatedAt = itinerary.UpdatedAt,
            DurationDays = itinerary.DurationDays
        };
    }
}
