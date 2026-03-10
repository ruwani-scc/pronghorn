using VacationPlan.Core.Models;

namespace VacationPlan.Core.Interfaces;

/// <summary>
/// Repository interface for User operations
/// </summary>
public interface IUserRepository
{
    Task<User?> GetByEmailAndAuthProviderIdAsync(string email, string authProviderId);
    Task<User?> GetByIdAsync(Guid id);
    Task<User> CreateAsync(User user);
}
