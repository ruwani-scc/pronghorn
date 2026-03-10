using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System.Security.Claims;
using VacationPlan.API.Controllers;
using VacationPlan.Core.DTOs;
using VacationPlan.Core.Interfaces;
using VacationPlan.Core.Models;
using Xunit;

namespace VacationPlan.Tests.Controllers;

public class ItinerariesControllerTests
{
    private readonly Mock<IItineraryRepository> _mockItineraryRepository;
    private readonly Mock<IItemRepository> _mockItemRepository;
    private readonly Mock<ILogger<ItinerariesController>> _mockLogger;
    private readonly ItinerariesController _controller;
    private readonly Guid _testUserId = Guid.NewGuid();
    private readonly Guid _testItineraryId = Guid.NewGuid();

    public ItinerariesControllerTests()
    {
        _mockItineraryRepository = new Mock<IItineraryRepository>();
        _mockItemRepository = new Mock<IItemRepository>();
        _mockLogger = new Mock<ILogger<ItinerariesController>>();
        _controller = new ItinerariesController(
            _mockItineraryRepository.Object,
            _mockItemRepository.Object,
            _mockLogger.Object);

        // Setup user context
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, _testUserId.ToString())
        };
        var identity = new ClaimsIdentity(claims, "TestAuthType");
        var claimsPrincipal = new ClaimsPrincipal(identity);
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = claimsPrincipal }
        };
    }

    #region GetItineraries Tests

    [Fact]
    public async Task GetItineraries_ReturnsOkResult()
    {
        // Arrange
        var itineraries = new List<Itinerary> { CreateTestItinerary() };
        _mockItineraryRepository.Setup(r => r.GetUserItinerariesAsync(
            _testUserId, It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync(itineraries);
        _mockItineraryRepository.Setup(r => r.GetCountAsync(_testUserId))
            .ReturnsAsync(1);

        var query = new ItineraryQueryDto();

        // Act
        var result = await _controller.GetItineraries(query);

        // Assert
        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task GetItineraries_ReturnsListOfItineraries()
    {
        // Arrange
        var itineraries = new List<Itinerary> 
        { 
            CreateTestItinerary(),
            CreateTestItinerary(Guid.NewGuid())
        };
        _mockItineraryRepository.Setup(r => r.GetUserItinerariesAsync(
            _testUserId, It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync(itineraries);
        _mockItineraryRepository.Setup(r => r.GetCountAsync(_testUserId))
            .ReturnsAsync(2);

        var query = new ItineraryQueryDto();

        // Act
        var result = await _controller.GetItineraries(query) as OkObjectResult;
        var response = result!.Value as ApiResponse<ListResponse<ItineraryResponseDto>>;

        // Assert
        response.Should().NotBeNull();
        response!.Success.Should().BeTrue();
        response.Data.Should().NotBeNull();
        response.Data!.Data.Should().HaveCount(2);
        response.Data.Count.Should().Be(2);
    }

    [Fact]
    public async Task GetItineraries_WithQueryParameters_PassesCorrectValues()
    {
        // Arrange
        var query = new ItineraryQueryDto
        {
            Limit = 10,
            Offset = 5,
            SortBy = "title",
            SortOrder = "ASC"
        };

        _mockItineraryRepository.Setup(r => r.GetUserItinerariesAsync(
            _testUserId, 10, 5, "title", "ASC"))
            .ReturnsAsync(new List<Itinerary>());
        _mockItineraryRepository.Setup(r => r.GetCountAsync(_testUserId))
            .ReturnsAsync(0);

        // Act
        await _controller.GetItineraries(query);

        // Assert
        _mockItineraryRepository.Verify(r => r.GetUserItinerariesAsync(
            _testUserId, 10, 5, "title", "ASC"), Times.Once);
    }

    #endregion

    #region GetItinerary Tests

    [Fact]
    public async Task GetItinerary_WithValidId_ReturnsOkResult()
    {
        // Arrange
        var itinerary = CreateTestItinerary();
        _mockItineraryRepository.Setup(r => r.GetByIdAndUserAsync(_testItineraryId, _testUserId))
            .ReturnsAsync(itinerary);

        // Act
        var result = await _controller.GetItinerary(_testItineraryId);

        // Assert
        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task GetItinerary_WithValidId_ReturnsCorrectItinerary()
    {
        // Arrange
        var itinerary = CreateTestItinerary();
        _mockItineraryRepository.Setup(r => r.GetByIdAndUserAsync(_testItineraryId, _testUserId))
            .ReturnsAsync(itinerary);

        // Act
        var result = await _controller.GetItinerary(_testItineraryId) as OkObjectResult;
        var response = result!.Value as ApiResponse<ItineraryResponseDto>;

        // Assert
        response.Should().NotBeNull();
        response!.Success.Should().BeTrue();
        response.Data.Should().NotBeNull();
        response.Data!.Id.Should().Be(_testItineraryId);
        response.Data.Title.Should().Be("Test Itinerary");
    }

    [Fact]
    public async Task GetItinerary_WithNonExistentId_ReturnsNotFound()
    {
        // Arrange
        _mockItineraryRepository.Setup(r => r.GetByIdAndUserAsync(_testItineraryId, _testUserId))
            .ReturnsAsync((Itinerary?)null);

        // Act
        var result = await _controller.GetItinerary(_testItineraryId);

        // Assert
        result.Should().BeOfType<NotFoundObjectResult>();
    }

    #endregion

    #region CreateItinerary Tests

    [Fact]
    public async Task CreateItinerary_WithValidData_ReturnsCreatedResult()
    {
        // Arrange
        var createDto = new CreateItineraryDto
        {
            Title = "New Itinerary",
            Destination = "Paris",
            StartDate = DateOnly.FromDateTime(DateTime.Now.AddDays(10)),
            EndDate = DateOnly.FromDateTime(DateTime.Now.AddDays(15)),
            Description = "Test trip"
        };

        var createdItinerary = CreateTestItinerary();
        _mockItineraryRepository.Setup(r => r.CreateAsync(It.IsAny<Itinerary>()))
            .ReturnsAsync(createdItinerary);

        // Act
        var result = await _controller.CreateItinerary(createDto);

        // Assert
        result.Should().BeOfType<CreatedAtActionResult>();
    }

    [Fact]
    public async Task CreateItinerary_ReturnsCreatedItineraryData()
    {
        // Arrange
        var createDto = new CreateItineraryDto
        {
            Title = "New Itinerary",
            Destination = "Paris",
            StartDate = DateOnly.FromDateTime(DateTime.Now.AddDays(10)),
            EndDate = DateOnly.FromDateTime(DateTime.Now.AddDays(15))
        };

        var createdItinerary = CreateTestItinerary();
        _mockItineraryRepository.Setup(r => r.CreateAsync(It.IsAny<Itinerary>()))
            .ReturnsAsync(createdItinerary);

        // Act
        var result = await _controller.CreateItinerary(createDto) as CreatedAtActionResult;
        var response = result!.Value as ApiResponse<ItineraryResponseDto>;

        // Assert
        response.Should().NotBeNull();
        response!.Success.Should().BeTrue();
        response.Data.Should().NotBeNull();
        response.Data!.Id.Should().Be(_testItineraryId);
    }

    [Fact]
    public async Task CreateItinerary_CallsRepositoryCreate()
    {
        // Arrange
        var createDto = new CreateItineraryDto
        {
            Title = "New Itinerary",
            Destination = "Paris",
            StartDate = DateOnly.FromDateTime(DateTime.Now.AddDays(10)),
            EndDate = DateOnly.FromDateTime(DateTime.Now.AddDays(15))
        };

        var createdItinerary = CreateTestItinerary();
        _mockItineraryRepository.Setup(r => r.CreateAsync(It.IsAny<Itinerary>()))
            .ReturnsAsync(createdItinerary);

        // Act
        await _controller.CreateItinerary(createDto);

        // Assert
        _mockItineraryRepository.Verify(r => r.CreateAsync(It.Is<Itinerary>(i =>
            i.Title == "New Itinerary" &&
            i.Destination == "Paris" &&
            i.UserId == _testUserId)), Times.Once);
    }

    #endregion

    #region UpdateItinerary Tests

    [Fact]
    public async Task UpdateItinerary_WithValidData_ReturnsOkResult()
    {
        // Arrange
        var itinerary = CreateTestItinerary();
        var updateDto = new UpdateItineraryDto
        {
            Title = "Updated Title",
            Description = "Updated Description"
        };

        _mockItineraryRepository.Setup(r => r.GetByIdAndUserAsync(_testItineraryId, _testUserId))
            .ReturnsAsync(itinerary);
        _mockItineraryRepository.Setup(r => r.UpdateAsync(It.IsAny<Itinerary>()))
            .ReturnsAsync(itinerary);

        // Act
        var result = await _controller.UpdateItinerary(_testItineraryId, updateDto);

        // Assert
        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task UpdateItinerary_UpdatesItineraryProperties()
    {
        // Arrange
        var itinerary = CreateTestItinerary();
        var updateDto = new UpdateItineraryDto
        {
            Title = "Updated Title",
            Destination = "New Destination"
        };

        _mockItineraryRepository.Setup(r => r.GetByIdAndUserAsync(_testItineraryId, _testUserId))
            .ReturnsAsync(itinerary);
        _mockItineraryRepository.Setup(r => r.UpdateAsync(It.IsAny<Itinerary>()))
            .ReturnsAsync((Itinerary i) => i);

        // Act
        await _controller.UpdateItinerary(_testItineraryId, updateDto);

        // Assert
        _mockItineraryRepository.Verify(r => r.UpdateAsync(It.Is<Itinerary>(i =>
            i.Title == "Updated Title" &&
            i.Destination == "New Destination")), Times.Once);
    }

    [Fact]
    public async Task UpdateItinerary_WithNonExistentId_ReturnsNotFound()
    {
        // Arrange
        var updateDto = new UpdateItineraryDto { Title = "Updated" };
        _mockItineraryRepository.Setup(r => r.GetByIdAndUserAsync(_testItineraryId, _testUserId))
            .ReturnsAsync((Itinerary?)null);

        // Act
        var result = await _controller.UpdateItinerary(_testItineraryId, updateDto);

        // Assert
        result.Should().BeOfType<NotFoundObjectResult>();
    }

    #endregion

    #region DeleteItinerary Tests

    [Fact]
    public async Task DeleteItinerary_WithValidId_ReturnsOkResult()
    {
        // Arrange
        _mockItineraryRepository.Setup(r => r.ExistsAsync(_testItineraryId, _testUserId))
            .ReturnsAsync(true);
        _mockItineraryRepository.Setup(r => r.DeleteAsync(_testItineraryId))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _controller.DeleteItinerary(_testItineraryId);

        // Assert
        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task DeleteItinerary_CallsRepositoryDelete()
    {
        // Arrange
        _mockItineraryRepository.Setup(r => r.ExistsAsync(_testItineraryId, _testUserId))
            .ReturnsAsync(true);
        _mockItineraryRepository.Setup(r => r.DeleteAsync(_testItineraryId))
            .Returns(Task.CompletedTask);

        // Act
        await _controller.DeleteItinerary(_testItineraryId);

        // Assert
        _mockItineraryRepository.Verify(r => r.DeleteAsync(_testItineraryId), Times.Once);
    }

    [Fact]
    public async Task DeleteItinerary_WithNonExistentId_ReturnsNotFound()
    {
        // Arrange
        _mockItineraryRepository.Setup(r => r.ExistsAsync(_testItineraryId, _testUserId))
            .ReturnsAsync(false);

        // Act
        var result = await _controller.DeleteItinerary(_testItineraryId);

        // Assert
        result.Should().BeOfType<NotFoundObjectResult>();
        _mockItineraryRepository.Verify(r => r.DeleteAsync(It.IsAny<Guid>()), Times.Never);
    }

    #endregion

    #region GetItineraryItems Tests

    [Fact]
    public async Task GetItineraryItems_WithValidId_ReturnsOkResult()
    {
        // Arrange
        var items = new List<ItineraryItem> { CreateTestItem() };
        _mockItineraryRepository.Setup(r => r.ExistsAsync(_testItineraryId, _testUserId))
            .ReturnsAsync(true);
        _mockItemRepository.Setup(r => r.GetItemsByItineraryAsync(_testItineraryId, null))
            .ReturnsAsync(items);

        var query = new ItemQueryDto();

        // Act
        var result = await _controller.GetItineraryItems(_testItineraryId, query);

        // Assert
        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task GetItineraryItems_ReturnsListOfItems()
    {
        // Arrange
        var items = new List<ItineraryItem> { CreateTestItem(), CreateTestItem() };
        _mockItineraryRepository.Setup(r => r.ExistsAsync(_testItineraryId, _testUserId))
            .ReturnsAsync(true);
        _mockItemRepository.Setup(r => r.GetItemsByItineraryAsync(_testItineraryId, null))
            .ReturnsAsync(items);

        var query = new ItemQueryDto();

        // Act
        var result = await _controller.GetItineraryItems(_testItineraryId, query) as OkObjectResult;
        var response = result!.Value as ApiResponse<ListResponse<ItemResponseDto>>;

        // Assert
        response.Should().NotBeNull();
        response!.Success.Should().BeTrue();
        response.Data.Should().NotBeNull();
        response.Data!.Data.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetItineraryItems_WithNonExistentItinerary_ReturnsNotFound()
    {
        // Arrange
        _mockItineraryRepository.Setup(r => r.ExistsAsync(_testItineraryId, _testUserId))
            .ReturnsAsync(false);

        var query = new ItemQueryDto();

        // Act
        var result = await _controller.GetItineraryItems(_testItineraryId, query);

        // Assert
        result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task GetItineraryItems_WithCategoryFilter_PassesCorrectCategory()
    {
        // Arrange
        _mockItineraryRepository.Setup(r => r.ExistsAsync(_testItineraryId, _testUserId))
            .ReturnsAsync(true);
        _mockItemRepository.Setup(r => r.GetItemsByItineraryAsync(_testItineraryId, "flight"))
            .ReturnsAsync(new List<ItineraryItem>());

        var query = new ItemQueryDto { Category = "flight" };

        // Act
        await _controller.GetItineraryItems(_testItineraryId, query);

        // Assert
        _mockItemRepository.Verify(r => r.GetItemsByItineraryAsync(_testItineraryId, "flight"), Times.Once);
    }

    #endregion

    #region AddItem Tests

    [Fact]
    public async Task AddItem_WithValidData_ReturnsCreatedResult()
    {
        // Arrange
        var createDto = new CreateItemDto
        {
            Category = "flight",
            Title = "New Flight",
            Description = "Test flight",
            Cost = 500.00m
        };

        var createdItem = CreateTestItem();
        _mockItineraryRepository.Setup(r => r.ExistsAsync(_testItineraryId, _testUserId))
            .ReturnsAsync(true);
        _mockItemRepository.Setup(r => r.CreateAsync(It.IsAny<ItineraryItem>()))
            .ReturnsAsync(createdItem);

        // Act
        var result = await _controller.AddItem(_testItineraryId, createDto);

        // Assert
        result.Should().BeOfType<CreatedAtActionResult>();
    }

    [Fact]
    public async Task AddItem_CallsRepositoryCreate()
    {
        // Arrange
        var createDto = new CreateItemDto
        {
            Category = "flight",
            Title = "New Flight",
            Cost = 500.00m
        };

        var createdItem = CreateTestItem();
        _mockItineraryRepository.Setup(r => r.ExistsAsync(_testItineraryId, _testUserId))
            .ReturnsAsync(true);
        _mockItemRepository.Setup(r => r.CreateAsync(It.IsAny<ItineraryItem>()))
            .ReturnsAsync(createdItem);

        // Act
        await _controller.AddItem(_testItineraryId, createDto);

        // Assert
        _mockItemRepository.Verify(r => r.CreateAsync(It.Is<ItineraryItem>(i =>
            i.ItineraryId == _testItineraryId &&
            i.Category == "flight" &&
            i.Title == "New Flight")), Times.Once);
    }

    [Fact]
    public async Task AddItem_WithNonExistentItinerary_ReturnsNotFound()
    {
        // Arrange
        var createDto = new CreateItemDto
        {
            Category = "flight",
            Title = "New Flight"
        };

        _mockItineraryRepository.Setup(r => r.ExistsAsync(_testItineraryId, _testUserId))
            .ReturnsAsync(false);

        // Act
        var result = await _controller.AddItem(_testItineraryId, createDto);

        // Assert
        result.Should().BeOfType<NotFoundObjectResult>();
    }

    #endregion

    #region Helper Methods

    private Itinerary CreateTestItinerary(Guid? id = null)
    {
        return new Itinerary
        {
            Id = id ?? _testItineraryId,
            UserId = _testUserId,
            Title = "Test Itinerary",
            Destination = "Test Destination",
            StartDate = DateOnly.FromDateTime(DateTime.Now.AddDays(10)),
            EndDate = DateOnly.FromDateTime(DateTime.Now.AddDays(15)),
            Description = "Test description",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    private ItineraryItem CreateTestItem()
    {
        return new ItineraryItem
        {
            Id = Guid.NewGuid(),
            ItineraryId = _testItineraryId,
            Category = "flight",
            Title = "Test Item",
            Description = "Test Description",
            Cost = 100.00m,
            Currency = "USD",
            DisplayOrder = 0,
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    #endregion
}
