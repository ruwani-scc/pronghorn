using Microsoft.EntityFrameworkCore;
using VacationPlan.Core.Interfaces;
using VacationPlan.Core.Models;
using VacationPlan.Infrastructure.Data;

namespace VacationPlan.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for ItineraryItem operations
/// </summary>
public class ItemRepository : IItemRepository
{
    private readonly VacationPlanDbContext _context;

    public ItemRepository(VacationPlanDbContext context)
    {
        _context = context;
    }

    public async Task<List<ItineraryItem>> GetItemsByItineraryAsync(Guid itineraryId, string? category = null)
    {
        var query = _context.ItineraryItems
            .Where(item => item.ItineraryId == itineraryId);

        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(item => item.Category == category.ToLower());
        }

        return await query
            .OrderBy(item => item.DisplayOrder)
            .ThenBy(item => item.StartDatetime)
            .ToListAsync();
    }

    public async Task<ItineraryItem?> GetByIdAsync(Guid id)
    {
        return await _context.ItineraryItems
            .Include(item => item.Itinerary)
            .FirstOrDefaultAsync(item => item.Id == id);
    }

    public async Task<ItineraryItem> CreateAsync(ItineraryItem item)
    {
        _context.ItineraryItems.Add(item);
        await _context.SaveChangesAsync();
        return item;
    }

    public async Task<ItineraryItem> UpdateAsync(ItineraryItem item)
    {
        _context.ItineraryItems.Update(item);
        await _context.SaveChangesAsync();
        return item;
    }

    public async Task DeleteAsync(Guid id)
    {
        var item = await _context.ItineraryItems.FindAsync(id);
        if (item != null)
        {
            _context.ItineraryItems.Remove(item);
            await _context.SaveChangesAsync();
        }
    }

    public async Task BulkReorderAsync(List<(Guid id, int displayOrder)> items)
    {
        foreach (var (id, displayOrder) in items)
        {
            var item = await _context.ItineraryItems.FindAsync(id);
            if (item != null)
            {
                item.DisplayOrder = displayOrder;
            }
        }
        await _context.SaveChangesAsync();
    }

    public async Task BulkDeleteAsync(List<Guid> itemIds)
    {
        var items = await _context.ItineraryItems
            .Where(item => itemIds.Contains(item.Id))
            .ToListAsync();
        
        _context.ItineraryItems.RemoveRange(items);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> BelongsToUserAsync(Guid itemId, Guid userId)
    {
        return await _context.ItineraryItems
            .Include(item => item.Itinerary)
            .AnyAsync(item => item.Id == itemId && item.Itinerary.UserId == userId);
    }
}
