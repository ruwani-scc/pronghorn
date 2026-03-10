using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using VacationPlan.API.Controllers;
using Xunit;

namespace VacationPlan.Tests.Controllers;

public class HealthControllerTests
{
    private readonly HealthController _controller;

    public HealthControllerTests()
    {
        _controller = new HealthController();
    }

    [Fact]
    public void GetHealth_ReturnsOkResult()
    {
        // Act
        var result = _controller.GetHealth();

        // Assert
        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public void GetHealth_ReturnsHealthStatus()
    {
        // Act
        var result = _controller.GetHealth() as OkObjectResult;

        // Assert
        result.Should().NotBeNull();
        result!.Value.Should().NotBeNull();
        
        var value = result.Value as dynamic;
        value.Should().NotBeNull();
    }

    [Fact]
    public void GetHealth_ReturnsStatusOK()
    {
        // Act
        var result = _controller.GetHealth() as OkObjectResult;
        var value = result!.Value;

        // Assert
        var statusProperty = value!.GetType().GetProperty("status");
        statusProperty.Should().NotBeNull();
        var statusValue = statusProperty!.GetValue(value)?.ToString();
        statusValue.Should().Be("OK");
    }

    [Fact]
    public void GetHealth_ReturnsTimestamp()
    {
        // Act
        var result = _controller.GetHealth() as OkObjectResult;
        var value = result!.Value;

        // Assert
        var timestampProperty = value!.GetType().GetProperty("timestamp");
        timestampProperty.Should().NotBeNull();
        var timestampValue = timestampProperty!.GetValue(value)?.ToString();
        timestampValue.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public void GetHealth_TimestampIsValidDateTime()
    {
        // Act
        var result = _controller.GetHealth() as OkObjectResult;
        var value = result!.Value;
        var timestampProperty = value!.GetType().GetProperty("timestamp");
        var timestampValue = timestampProperty!.GetValue(value)?.ToString();

        // Assert
        DateTime.TryParse(timestampValue, out var parsedDate).Should().BeTrue();
        parsedDate.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    }
}
