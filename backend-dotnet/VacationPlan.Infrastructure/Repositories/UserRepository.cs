using Microsoft.EntityFrameworkCore;
using VacationPlan.Core.Interfaces;
using VacationPlan.Core.Models;
using VacationPlan.Infrastructure.Data;

namespace VacationPlan.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for User operations
/// </summary>
public class UserRepository : IUserRepository
{
    private readonly VacationPlanDbContext _context;

    public UserRepository(VacationPlanDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByEmailAndAuthProviderIdAsync(string email, string authProviderId)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email && u.AuthProviderId == authProviderId);
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<User> CreateAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }
}
