namespace VacationPlan.Core.DTOs;

/// <summary>
/// Standard API response wrapper
/// </summary>
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public string? Message { get; set; }
    public Dictionary<string, string>? Errors { get; set; }

    public static ApiResponse<T> SuccessResponse(T data, string? message = null)
    {
        return new ApiResponse<T>
        {
            Success = true,
            Data = data,
            Message = message
        };
    }

    public static ApiResponse<T> ErrorResponse(string error, Dictionary<string, string>? errors = null)
    {
        return new ApiResponse<T>
        {
            Success = false,
            Message = error,
            Errors = errors
        };
    }
}

/// <summary>
/// Response for list operations with count
/// </summary>
public class ListResponse<T>
{
    public List<T> Data { get; set; } = new();
    public int Count { get; set; }
}

/// <summary>
/// Response for bulk operations
/// </summary>
public class BulkOperationResponse
{
    public string Message { get; set; } = string.Empty;
    public int Processed { get; set; }
}
