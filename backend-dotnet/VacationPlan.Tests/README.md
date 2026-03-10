# VacationPlan.Tests

Comprehensive XUnit test suite for the VacationPlan API.

## Overview

This project contains unit tests for all API controllers using XUnit, Moq, and FluentAssertions.

## Test Structure

```
VacationPlan.Tests/
├── Controllers/
│   ├── HealthControllerTests.cs        # Health endpoint tests
│   ├── ItemsControllerTests.cs         # Items CRUD and bulk operations tests
│   └── ItinerariesControllerTests.cs   # Itineraries CRUD and item management tests
├── Helpers/
│   └── TestHelpers.cs                  # Common test utilities
└── VacationPlan.Tests.csproj
```

## Technologies Used

- **XUnit**: Testing framework
- **Moq**: Mocking framework for dependencies
- **FluentAssertions**: Fluent API for assertions
- **Microsoft.AspNetCore.Mvc.Testing**: Integration testing support
- **Microsoft.EntityFrameworkCore.InMemory**: In-memory database for testing

## Running Tests

### Run all tests
```bash
cd backend-dotnet
dotnet test
```

### Run specific test class
```bash
dotnet test --filter "FullyQualifiedName~HealthControllerTests"
```

### Run with coverage
```bash
dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=opencover
```

### Run in watch mode (for development)
```bash
dotnet watch test
```

## Test Coverage

### HealthController (6 tests)
- ✅ Health endpoint returns OK status
- ✅ Health endpoint returns valid timestamp
- ✅ Health response structure validation

### ItemsController (16 tests)
- ✅ Get item by ID (success and failure cases)
- ✅ Update item (with various properties)
- ✅ Delete item (authorized and unauthorized)
- ✅ Bulk operations (reorder, bulk delete)
- ✅ Authorization checks

### ItinerariesController (25+ tests)
- ✅ Get all itineraries with pagination
- ✅ Get single itinerary by ID
- ✅ Create new itinerary
- ✅ Update existing itinerary
- ✅ Delete itinerary
- ✅ Get items for itinerary
- ✅ Add item to itinerary
- ✅ Category filtering
- ✅ Authorization checks

## Writing New Tests

### Basic Test Structure

```csharp
public class MyControllerTests
{
    private readonly Mock<IMyRepository> _mockRepository;
    private readonly MyController _controller;
    
    public MyControllerTests()
    {
        _mockRepository = new Mock<IMyRepository>();
        _controller = new MyController(_mockRepository.Object);
        
        // Setup authentication if needed
        SetupAuthentication();
    }
    
    [Fact]
    public async Task MethodName_Scenario_ExpectedBehavior()
    {
        // Arrange
        var input = new InputDto { /* ... */ };
        _mockRepository.Setup(r => r.MethodAsync(It.IsAny<Parameter>()))
            .ReturnsAsync(expectedResult);
        
        // Act
        var result = await _controller.MethodName(input);
        
        // Assert
        result.Should().BeOfType<OkObjectResult>();
    }
}
```

### Authentication Setup

```csharp
private void SetupAuthentication()
{
    var userId = Guid.NewGuid();
    var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, userId.ToString())
    };
    var identity = new ClaimsIdentity(claims, "TestAuthType");
    var claimsPrincipal = new ClaimsPrincipal(identity);
    _controller.ControllerContext = new ControllerContext
    {
        HttpContext = new DefaultHttpContext { User = claimsPrincipal }
    };
}
```

## Best Practices

1. **Naming Convention**: `MethodName_Scenario_ExpectedBehavior`
2. **AAA Pattern**: Arrange, Act, Assert
3. **One Assertion Per Test**: Focus each test on a single behavior
4. **Mock Dependencies**: Use Moq to isolate units under test
5. **Use FluentAssertions**: Write readable assertions
6. **Test Edge Cases**: Include null checks, empty lists, unauthorized access
7. **Verify Mock Calls**: Ensure methods are called with correct parameters

## Continuous Integration

Tests are automatically run in CI/CD pipelines. Ensure all tests pass before merging PRs.

## Contributing

When adding new features:
1. Write tests first (TDD approach)
2. Ensure all existing tests pass
3. Aim for >80% code coverage
4. Add integration tests for critical paths

## Troubleshooting

### Tests fail with authentication errors
- Ensure user context is properly set up in test constructor
- Check ClaimTypes.NameIdentifier is set correctly

### Mock not returning expected values
- Verify Setup() method matches the actual call signature
- Use `It.IsAny<T>()` for flexible matching
- Check async vs sync method signatures

### Database-related errors
- Consider using InMemory database for integration tests
- Ensure DbContext is properly disposed

## Resources

- [XUnit Documentation](https://xunit.net/)
- [Moq Quickstart](https://github.com/moq/moq4)
- [FluentAssertions Documentation](https://fluentassertions.com/)
- [ASP.NET Core Testing](https://learn.microsoft.com/en-us/aspnet/core/test/)
