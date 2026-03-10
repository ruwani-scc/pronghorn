using Microsoft.EntityFrameworkCore;
using VacationPlan.Core.Interfaces;
using VacationPlan.Core.Models;
using VacationPlan.Infrastructure.Data;

namespace VacationPlan.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for Itinerary operations
/// </summary>
public class ItineraryRepository : IItineraryRepository
{
    private readonly VacationPlanDbContext _context;

    public ItineraryRepository(VacationPlanDbContext context)
    {
        _context = context;
    }

    public async Task<List<Itinerary>> GetUserItinerariesAsync(
        Guid userId, 
        int limit, 
        int offset, 
        string sortBy, 
        string sortOrder)
    {
        var query = _context.Itineraries
            .Where(i => i.UserId == userId)
            .AsQueryable();

        // Apply sorting
        query = sortBy.ToLower() switch
        {
            "title" => sortOrder.ToUpper() == "ASC" 
                ? query.OrderBy(i => i.Title) 
                : query.OrderByDescending(i => i.Title),
            "start_date" => sortOrder.ToUpper() == "ASC" 
                ? query.OrderBy(i => i.StartDate) 
                : query.OrderByDescending(i => i.StartDate),
            "destination" => sortOrder.ToUpper() == "ASC" 
                ? query.OrderBy(i => i.Destination) 
                : query.OrderByDescending(i => i.Destination),
            _ => sortOrder.ToUpper() == "ASC" 
                ? query.OrderBy(i => i.CreatedAt) 
                : query.OrderByDescending(i => i.CreatedAt)
        };

        return await query
            .Skip(offset)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<Itinerary?> GetByIdAsync(Guid id)
    {
        return await _context.Itineraries
            .Include(i => i.Items)
            .FirstOrDefaultAsync(i => i.Id == id);
    }

    public async Task<Itinerary?> GetByIdAndUserAsync(Guid id, Guid userId)
    {
        return await _context.Itineraries
            .Include(i => i.Items)
            .FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);
    }

    public async Task<Itinerary> CreateAsync(Itinerary itinerary)
    {
        _context.Itineraries.Add(itinerary);
        await _context.SaveChangesAsync();
        return itinerary;
    }

    public async Task<Itinerary> UpdateAsync(Itinerary itinerary)
    {
        _context.Itineraries.Update(itinerary);
        await _context.SaveChangesAsync();
        return itinerary;
    }

    public async Task DeleteAsync(Guid id)
    {
        var itinerary = await _context.Itineraries.FindAsync(id);
        if (itinerary != null)
        {
            _context.Itineraries.Remove(itinerary);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid id, Guid userId)
    {
        return await _context.Itineraries
            .AnyAsync(i => i.Id == id && i.UserId == userId);
    }

    public async Task<int> GetCountAsync(Guid userId)
    {
        return await _context.Itineraries
            .CountAsync(i => i.UserId == userId);
    }
}
