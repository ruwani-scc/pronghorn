using System.Collections.Concurrent;
using System.Net;

namespace VacationPlan.API.Middleware;

/// <summary>
/// Rate limiting middleware - 100 requests per 15 minutes
/// </summary>
public class RateLimitingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RateLimitingMiddleware> _logger;
    private static readonly ConcurrentDictionary<string, (DateTime resetTime, int count)> _requestCounts = new();
    private const int MaxRequests = 100;
    private static readonly TimeSpan TimeWindow = TimeSpan.FromMinutes(15);

    public RateLimitingMiddleware(RequestDelegate next, ILogger<RateLimitingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Skip rate limiting for health check
        if (context.Request.Path.StartsWithSegments("/health"))
        {
            await _next(context);
            return;
        }

        var clientId = GetClientIdentifier(context);
        var now = DateTime.UtcNow;

        // Clean up old entries periodically
        CleanupOldEntries(now);

        if (_requestCounts.TryGetValue(clientId, out var requestInfo))
        {
            if (now < requestInfo.resetTime)
            {
                if (requestInfo.count >= MaxRequests)
                {
                    context.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
                    context.Response.Headers.Add("X-RateLimit-Limit", MaxRequests.ToString());
                    context.Response.Headers.Add("X-RateLimit-Remaining", "0");
                    context.Response.Headers.Add("X-RateLimit-Reset", requestInfo.resetTime.ToString("o"));
                    await context.Response.WriteAsJsonAsync(new
                    {
                        success = false,
                        error = "Rate limit exceeded. Please try again later."
                    });
                    return;
                }

                _requestCounts[clientId] = (requestInfo.resetTime, requestInfo.count + 1);
            }
            else
            {
                // Reset window
                _requestCounts[clientId] = (now.Add(TimeWindow), 1);
            }
        }
        else
        {
            _requestCounts[clientId] = (now.Add(TimeWindow), 1);
        }

        var currentInfo = _requestCounts[clientId];
        context.Response.Headers.Add("X-RateLimit-Limit", MaxRequests.ToString());
        context.Response.Headers.Add("X-RateLimit-Remaining", (MaxRequests - currentInfo.count).ToString());
        context.Response.Headers.Add("X-RateLimit-Reset", currentInfo.resetTime.ToString("o"));

        await _next(context);
    }

    private static string GetClientIdentifier(HttpContext context)
    {
        // Use user ID if authenticated, otherwise use IP address
        var userId = context.User?.Identity?.Name;
        return string.IsNullOrEmpty(userId)
            ? context.Connection.RemoteIpAddress?.ToString() ?? "unknown"
            : userId;
    }

    private static void CleanupOldEntries(DateTime now)
    {
        var keysToRemove = _requestCounts
            .Where(kvp => now > kvp.Value.resetTime.Add(TimeSpan.FromMinutes(5)))
            .Select(kvp => kvp.Key)
            .ToList();

        foreach (var key in keysToRemove)
        {
            _requestCounts.TryRemove(key, out _);
        }
    }
}
