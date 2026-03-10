# Service Layer Architecture - .NET Coding Standards

## Overview

This document outlines the .NET coding standards and architectural patterns implemented in the VacationPlan backend service layer. The service layer provides a clean separation between the API controllers and data access layer, following industry best practices and SOLID principles.

## Architecture Pattern

### Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   API Layer (Controllers)                    │
│  - HTTP request/response handling                           │
│  - Authentication/Authorization                             │
│  - Input validation (FluentValidation)                      │
│  - Exception handling                                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Service Layer (Business Logic)              │
│  - Business rules and validation                            │
│  - DTO to Entity mapping                                    │
│  - Transaction coordination                                 │
│  - Cross-cutting concerns                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Infrastructure Layer (Repositories)             │
│  - Database operations                                      │
│  - Entity Framework Core                                    │
│  - Data persistence                                         │
└─────────────────────────────────────────────────────────────┘
```

## Implemented Standards

### 1. Service Interface Pattern

**Location**: `VacationPlan.Core/Interfaces/`

Every service has a corresponding interface that defines its contract:

```csharp
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
}
```

**Benefits**:
- Enables dependency injection
- Facilitates unit testing with mocking
- Supports interface segregation principle
- Provides clear contract documentation

### 2. Service Implementation Pattern

**Location**: `VacationPlan.Core/Services/`

Service implementations contain all business logic:

```csharp
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

    // Business logic implementation...
}
```

**Standards**:
- Constructor injection for dependencies
- Async/await for all I/O operations
- XML documentation comments
- Private helper methods for mapping and utilities

### 3. DTO (Data Transfer Object) Pattern

**Location**: `VacationPlan.Core/DTOs/`

Services work exclusively with DTOs, never exposing domain entities:

```csharp
public class ItineraryResponseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    // ... other properties
}
```

**Benefits**:
- Decouples API contracts from domain models
- Prevents over-posting vulnerabilities
- Enables API versioning
- Reduces data exposure

### 4. Business Logic Encapsulation

All business rules are enforced in the service layer:

```csharp
public async Task<ItineraryResponseDto> CreateItineraryAsync(Guid userId, CreateItineraryDto dto)
{
    // Business rule: Validate date range
    if (dto.EndDate < dto.StartDate)
        throw new ArgumentException("End date must be after start date");

    // Business rule: Apply pagination limits
    limit = Math.Min(limit, 100); // Max 100 items per page
    
    // Business rule: Validate categories
    var validCategories = new[] { "accommodation", "activity", "transport" };
    if (!validCategories.Contains(normalizedCategory))
        throw new ArgumentException($"Invalid category");
        
    // Data access
    var itinerary = await _itineraryRepository.CreateAsync(entity);
    return MapToDto(itinerary);
}
```

### 5. Authorization in Services

User ownership verification is handled at the service layer:

```csharp
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
```

### 6. Exception Handling Strategy

**Service Layer Throws**:
- `ArgumentException` - Invalid input or business rule violations
- `UnauthorizedAccessException` - Authorization failures
- Domain-specific exceptions for business errors

**Controller Layer Catches**:
```csharp
try
{
    var result = await _itemService.GetItemByIdAsync(id, userId);
    return Ok(ApiResponse<ItemResponseDto>.SuccessResponse(result));
}
catch (UnauthorizedAccessException ex)
{
    return NotFound(ApiResponse<object>.ErrorResponse(ex.Message));
}
catch (ArgumentException ex)
{
    return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message));
}
```

### 7. Dependency Injection Registration

**Location**: `VacationPlan.API/Program.cs`

```csharp
// Register repositories
builder.Services.AddScoped<IItineraryRepository, ItineraryRepository>();
builder.Services.AddScoped<IItemRepository, ItemRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Register services (Business Logic Layer)
builder.Services.AddScoped<IItineraryService, ItineraryService>();
builder.Services.AddScoped<IItemService, ItemService>();
```

**Standards**:
- Use `AddScoped` for services that interact with DbContext
- Interfaces registered first, then implementations
- Clear separation between infrastructure and business logic

### 8. Mapping Pattern

Private static methods for entity-to-DTO mapping:

```csharp
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
```

**Benefits**:
- Centralized mapping logic
- Easy to maintain and update
- Type-safe transformations
- Can be replaced with AutoMapper if needed

### 9. Controller Refactoring

Controllers are now thin and focused on HTTP concerns:

**Before** (Anti-pattern):
```csharp
[HttpGet]
public async Task<IActionResult> GetItineraries()
{
    var userId = GetUserId();
    var itineraries = await _itineraryRepository.GetUserItinerariesAsync(userId);
    
    // Business logic in controller (BAD!)
    var response = itineraries.Select(i => new ItineraryResponseDto
    {
        Id = i.Id,
        Title = i.Title,
        // ... mapping logic
    }).ToList();
    
    return Ok(response);
}
```

**After** (Best practice):
```csharp
[HttpGet]
public async Task<IActionResult> GetItineraries([FromQuery] ItineraryQueryDto query)
{
    var userId = GetUserId();
    var result = await _itineraryService.GetUserItinerariesAsync(
        userId, query.Limit, query.Offset, query.SortBy, query.SortOrder);

    return Ok(ApiResponse<ListResponse<ItineraryResponseDto>>.SuccessResponse(result));
}
```

### 10. Testability

Service layer enables comprehensive unit testing:

```csharp
public class ItineraryServiceTests
{
    [Fact]
    public async Task CreateItinerary_WithInvalidDates_ThrowsArgumentException()
    {
        // Arrange
        var mockRepo = new Mock<IItineraryRepository>();
        var service = new ItineraryService(mockRepo.Object, null);
        var dto = new CreateItineraryDto 
        { 
            StartDate = DateTime.Now,
            EndDate = DateTime.Now.AddDays(-1) // Invalid!
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(
            () => service.CreateItineraryAsync(Guid.NewGuid(), dto)
        );
    }
}
```

## SOLID Principles Applied

### Single Responsibility Principle (SRP)
- **Controllers**: Handle HTTP concerns only
- **Services**: Contain business logic only
- **Repositories**: Handle data access only

### Open/Closed Principle (OCP)
- Services are open for extension through interfaces
- Closed for modification through dependency injection

### Liskov Substitution Principle (LSP)
- Any implementation of `IItineraryService` can replace another
- Mock implementations can replace real ones in tests

### Interface Segregation Principle (ISP)
- Separate interfaces for different services
- Clients depend only on methods they use

### Dependency Inversion Principle (DIP)
- Controllers depend on `IItineraryService` interface
- Services depend on `IRepository` interfaces
- No concrete dependencies across layers

## Best Practices

### 1. Async All The Way
```csharp
// ✅ Good
public async Task<ItineraryResponseDto> CreateItineraryAsync(...)
{
    var created = await _itineraryRepository.CreateAsync(itinerary);
    return MapToDto(created);
}

// ❌ Bad
public ItineraryResponseDto CreateItinerary(...)
{
    var created = _itineraryRepository.CreateAsync(itinerary).Result; // Blocking!
    return MapToDto(created);
}
```

### 2. Nullable Reference Types
```csharp
// Use nullable returns for "not found" scenarios
public async Task<ItineraryResponseDto?> GetItineraryByIdAsync(Guid id, Guid userId)
{
    var itinerary = await _itineraryRepository.GetByIdAndUserAsync(id, userId);
    
    if (itinerary == null)
        return null; // Clear contract: null means not found
        
    return MapToDto(itinerary);
}
```

### 3. XML Documentation
```csharp
/// <summary>
/// Creates a new itinerary for the specified user
/// </summary>
/// <param name="userId">The user ID who owns the itinerary</param>
/// <param name="dto">The itinerary creation data</param>
/// <returns>The created itinerary details</returns>
/// <exception cref="ArgumentException">Thrown when date validation fails</exception>
public async Task<ItineraryResponseDto> CreateItineraryAsync(Guid userId, CreateItineraryDto dto)
```

### 4. Guard Clauses
```csharp
public async Task<ItemResponseDto> CreateItemAsync(Guid itineraryId, Guid userId, CreateItemDto dto)
{
    // Verify user owns the itinerary (guard clause)
    var exists = await _itineraryRepository.ExistsAsync(itineraryId, userId);
    if (!exists)
        throw new UnauthorizedAccessException("Itinerary not found or access denied");

    // Business logic continues...
}
```

### 5. Immutable DTOs
```csharp
public class CreateItineraryDto
{
    public string Title { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    // No business logic in DTOs - pure data carriers
}
```

## Migration Guide

### For Existing Controllers

1. **Inject service instead of repository**:
```csharp
// Before
private readonly IItineraryRepository _itineraryRepository;

// After
private readonly IItineraryService _itineraryService;
```

2. **Replace repository calls with service calls**:
```csharp
// Before
var itinerary = await _itineraryRepository.GetByIdAsync(id);
var response = MapToDto(itinerary);

// After
var response = await _itineraryService.GetItineraryByIdAsync(id, userId);
```

3. **Remove business logic from controller**:
```csharp
// Before
if (dto.EndDate < dto.StartDate)
    return BadRequest("Invalid dates");

// After (validation in service)
var result = await _itineraryService.CreateItineraryAsync(userId, dto);
```

### For New Features

1. Create service interface in `VacationPlan.Core/Interfaces/`
2. Create service implementation in `VacationPlan.Core/Services/`
3. Register in `Program.cs` DI container
4. Inject into controllers via constructor
5. Write unit tests for service logic

## Benefits Achieved

✅ **Separation of Concerns**: Clear boundaries between layers  
✅ **Testability**: Business logic can be unit tested independently  
✅ **Maintainability**: Changes to business rules are localized  
✅ **Reusability**: Services can be used by multiple controllers  
✅ **Security**: Authorization logic centralized and consistent  
✅ **Scalability**: Easy to add new features without modifying existing code  
✅ **Code Quality**: Follows SOLID principles and .NET best practices  

## Common Patterns

### Pattern 1: List with Pagination
```csharp
public async Task<ListResponse<TDto>> GetListAsync(
    Guid userId,
    int limit = 10,
    int offset = 0,
    string sortBy = "created_at",
    string sortOrder = "DESC")
{
    // Apply business rules
    limit = Math.Min(limit, 100);
    offset = Math.Max(offset, 0);
    
    // Fetch data
    var entities = await _repository.GetAsync(userId, limit, offset, sortBy, sortOrder);
    var count = await _repository.GetCountAsync(userId);
    
    // Map and return
    return new ListResponse<TDto>
    {
        Data = entities.Select(MapToDto).ToList(),
        Count = count
    };
}
```

### Pattern 2: Create with Validation
```csharp
public async Task<TDto> CreateAsync(Guid userId, CreateDto dto)
{
    // Business rules
    ValidateBusinessRules(dto);
    
    // Map to entity
    var entity = MapFromDto(dto, userId);
    
    // Persist
    var created = await _repository.CreateAsync(entity);
    
    // Return DTO
    return MapToDto(created);
}
```

### Pattern 3: Update with Partial Data
```csharp
public async Task<TDto?> UpdateAsync(Guid id, Guid userId, UpdateDto dto)
{
    // Fetch existing
    var entity = await _repository.GetByIdAndUserAsync(id, userId);
    if (entity == null)
        return null;
    
    // Apply updates (only non-null values)
    ApplyUpdates(entity, dto);
    
    // Validate after update
    ValidateBusinessRules(entity);
    
    // Save and return
    var updated = await _repository.UpdateAsync(entity);
    return MapToDto(updated);
}
```

### Pattern 4: Delete with Authorization
```csharp
public async Task<bool> DeleteAsync(Guid id, Guid userId)
{
    // Verify ownership
    var exists = await _repository.ExistsAsync(id, userId);
    if (!exists)
        return false;
    
    // Delete
    await _repository.DeleteAsync(id);
    return true;
}
```

## References

- [Microsoft: ASP.NET Core Best Practices](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/best-practices)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Repository Pattern](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/infrastructure-persistence-layer-design)
- [DTO Pattern](https://docs.microsoft.com/en-us/aspnet/web-api/overview/data/using-web-api-with-entity-framework/part-5)

## Conclusion

The service layer implementation follows enterprise-level .NET coding standards and architectural patterns. It provides a robust, maintainable, and testable foundation for business logic while keeping controllers thin and focused on HTTP concerns.

For questions or contributions, please refer to the main project documentation or contact the development team.
