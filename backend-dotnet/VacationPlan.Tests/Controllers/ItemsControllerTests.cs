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

public class ItemsControllerTests
{
    private readonly Mock<IItemRepository> _mockItemRepository;
    private readonly Mock<ILogger<ItemsController>> _mockLogger;
    private readonly ItemsController _controller;
    private readonly Guid _testUserId = Guid.NewGuid();
    private readonly Guid _testItemId = Guid.NewGuid();
    private readonly Guid _testItineraryId = Guid.NewGuid();

    public ItemsControllerTests()
    {
        _mockItemRepository = new Mock<IItemRepository>();
        _mockLogger = new Mock<ILogger<ItemsController>>();
        _controller = new ItemsController(_mockItemRepository.Object, _mockLogger.Object);

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

    #region GetItem Tests

    [Fact]
    public async Task GetItem_WithValidId_ReturnsOkResult()
    {
        // Arrange
        var item = CreateTestItem();
        _mockItemRepository.Setup(r => r.GetByIdAsync(_testItemId))
            .ReturnsAsync(item);
        _mockItemRepository.Setup(r => r.BelongsToUserAsync(_testItemId, _testUserId))
            .ReturnsAsync(true);

        // Act
        var result = await _controller.GetItem(_testItemId);

        // Assert
        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task GetItem_WithValidId_ReturnsCorrectItem()
    {
        // Arrange
        var item = CreateTestItem();
        _mockItemRepository.Setup(r => r.GetByIdAsync(_testItemId))
            .ReturnsAsync(item);
        _mockItemRepository.Setup(r => r.BelongsToUserAsync(_testItemId, _testUserId))
            .ReturnsAsync(true);

        // Act
        var result = await _controller.GetItem(_testItemId) as OkObjectResult;
        var response = result!.Value as ApiResponse<ItemResponseDto>;

        // Assert
        response.Should().NotBeNull();
        response!.Success.Should().BeTrue();
        response.Data.Should().NotBeNull();
        response.Data!.Id.Should().Be(_testItemId);
        response.Data.Title.Should().Be("Test Item");
    }

    [Fact]
    public async Task GetItem_WithNonExistentId_ReturnsNotFound()
    {
        // Arrange
        _mockItemRepository.Setup(r => r.GetByIdAsync(_testItemId))
            .ReturnsAsync((ItineraryItem?)null);

        // Act
        var result = await _controller.GetItem(_testItemId);

        // Assert
        result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task GetItem_WithUnauthorizedUser_ReturnsNotFound()
    {
        // Arrange
        var item = CreateTestItem();
        _mockItemRepository.Setup(r => r.GetByIdAsync(_testItemId))
            .ReturnsAsync(item);
        _mockItemRepository.Setup(r => r.BelongsToUserAsync(_testItemId, _testUserId))
            .ReturnsAsync(false);

        // Act
        var result = await _controller.GetItem(_testItemId);

        // Assert
        result.Should().BeOfType<NotFoundObjectResult>();
    }

    #endregion

    #region UpdateItem Tests

    [Fact]
    public async Task UpdateItem_WithValidData_ReturnsOkResult()
    {
        // Arrange
        var item = CreateTestItem();
        var updateDto = new UpdateItemDto
        {
            Title = "Updated Title",
            Description = "Updated Description"
        };

        _mockItemRepository.Setup(r => r.GetByIdAsync(_testItemId))
            .ReturnsAsync(item);
        _mockItemRepository.Setup(r => r.BelongsToUserAsync(_testItemId, _testUserId))
            .ReturnsAsync(true);
        _mockItemRepository.Setup(r => r.UpdateAsync(It.IsAny<ItineraryItem>()))
            .ReturnsAsync(item);

        // Act
        var result = await _controller.UpdateItem(_testItemId, updateDto);

        // Assert
        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task UpdateItem_UpdatesItemProperties()
    {
        // Arrange
        var item = CreateTestItem();
        var updateDto = new UpdateItemDto
        {
            Title = "Updated Title",
            Cost = 150.50m,
            IsCompleted = true
        };

        _mockItemRepository.Setup(r => r.GetByIdAsync(_testItemId))
            .ReturnsAsync(item);
        _mockItemRepository.Setup(r => r.BelongsToUserAsync(_testItemId, _testUserId))
            .ReturnsAsync(true);
        _mockItemRepository.Setup(r => r.UpdateAsync(It.IsAny<ItineraryItem>()))
            .ReturnsAsync((ItineraryItem i) => i);

        // Act
        var result = await _controller.UpdateItem(_testItemId, updateDto) as OkObjectResult;
        var response = result!.Value as ApiResponse<ItemResponseDto>;

        // Assert
        response.Should().NotBeNull();
        response!.Success.Should().BeTrue();
        _mockItemRepository.Verify(r => r.UpdateAsync(It.Is<ItineraryItem>(i => 
            i.Title == "Updated Title" && 
            i.Cost == 150.50m && 
            i.IsCompleted == true)), Times.Once);
    }

    [Fact]
    public async Task UpdateItem_WithNonExistentId_ReturnsNotFound()
    {
        // Arrange
        var updateDto = new UpdateItemDto { Title = "Updated" };
        _mockItemRepository.Setup(r => r.GetByIdAsync(_testItemId))
            .ReturnsAsync((ItineraryItem?)null);

        // Act
        var result = await _controller.UpdateItem(_testItemId, updateDto);

        // Assert
        result.Should().BeOfType<NotFoundObjectResult>();
    }

    #endregion

    #region DeleteItem Tests

    [Fact]
    public async Task DeleteItem_WithValidId_ReturnsOkResult()
    {
        // Arrange
        _mockItemRepository.Setup(r => r.BelongsToUserAsync(_testItemId, _testUserId))
            .ReturnsAsync(true);
        _mockItemRepository.Setup(r => r.DeleteAsync(_testItemId))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _controller.DeleteItem(_testItemId);

        // Assert
        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task DeleteItem_CallsRepositoryDelete()
    {
        // Arrange
        _mockItemRepository.Setup(r => r.BelongsToUserAsync(_testItemId, _testUserId))
            .ReturnsAsync(true);
        _mockItemRepository.Setup(r => r.DeleteAsync(_testItemId))
            .Returns(Task.CompletedTask);

        // Act
        await _controller.DeleteItem(_testItemId);

        // Assert
        _mockItemRepository.Verify(r => r.DeleteAsync(_testItemId), Times.Once);
    }

    [Fact]
    public async Task DeleteItem_WithUnauthorizedUser_ReturnsNotFound()
    {
        // Arrange
        _mockItemRepository.Setup(r => r.BelongsToUserAsync(_testItemId, _testUserId))
            .ReturnsAsync(false);

        // Act
        var result = await _controller.DeleteItem(_testItemId);

        // Assert
        result.Should().BeOfType<NotFoundObjectResult>();
        _mockItemRepository.Verify(r => r.DeleteAsync(It.IsAny<Guid>()), Times.Never);
    }

    #endregion

    #region BulkOperation Tests

    [Fact]
    public async Task BulkOperation_Reorder_WithValidData_ReturnsOk()
    {
        // Arrange
        var bulkDto = new BulkOperationDto
        {
            Operation = "reorder",
            Items = new List<BulkItemDto>
            {
                new BulkItemDto { Id = Guid.NewGuid(), DisplayOrder = 1 },
                new BulkItemDto { Id = Guid.NewGuid(), DisplayOrder = 2 }
            }
        };

        foreach (var item in bulkDto.Items)
        {
            _mockItemRepository.Setup(r => r.BelongsToUserAsync(item.Id, _testUserId))
                .ReturnsAsync(true);
        }
        _mockItemRepository.Setup(r => r.BulkReorderAsync(It.IsAny<List<(Guid, int)>>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _controller.BulkOperation(bulkDto);

        // Assert
        result.Should().BeOfType<OkObjectResult>();
        _mockItemRepository.Verify(r => r.BulkReorderAsync(It.IsAny<List<(Guid, int)>>()), Times.Once);
    }

    [Fact]
    public async Task BulkOperation_BulkDelete_WithValidData_ReturnsOk()
    {
        // Arrange
        var itemIds = new List<Guid> { Guid.NewGuid(), Guid.NewGuid() };
        var bulkDto = new BulkOperationDto
        {
            Operation = "bulk_delete",
            ItemIds = itemIds
        };

        foreach (var id in itemIds)
        {
            _mockItemRepository.Setup(r => r.BelongsToUserAsync(id, _testUserId))
                .ReturnsAsync(true);
        }
        _mockItemRepository.Setup(r => r.BulkDeleteAsync(It.IsAny<List<Guid>>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _controller.BulkOperation(bulkDto);

        // Assert
        result.Should().BeOfType<OkObjectResult>();
        _mockItemRepository.Verify(r => r.BulkDeleteAsync(itemIds), Times.Once);
    }

    [Fact]
    public async Task BulkOperation_WithInvalidOperation_ReturnsBadRequest()
    {
        // Arrange
        var bulkDto = new BulkOperationDto
        {
            Operation = "invalid_operation"
        };

        // Act
        var result = await _controller.BulkOperation(bulkDto);

        // Assert
        result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task BulkOperation_Reorder_WithEmptyItems_ReturnsBadRequest()
    {
        // Arrange
        var bulkDto = new BulkOperationDto
        {
            Operation = "reorder",
            Items = new List<BulkItemDto>()
        };

        // Act
        var result = await _controller.BulkOperation(bulkDto);

        // Assert
        result.Should().BeOfType<BadRequestObjectResult>();
    }

    #endregion

    #region Helper Methods

    private ItineraryItem CreateTestItem()
    {
        return new ItineraryItem
        {
            Id = _testItemId,
            ItineraryId = _testItineraryId,
            Category = "flight",
            Title = "Test Item",
            Description = "Test Description",
            StartDatetime = DateTime.UtcNow.AddDays(1),
            EndDatetime = DateTime.UtcNow.AddDays(2),
            Location = "Test Location",
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
