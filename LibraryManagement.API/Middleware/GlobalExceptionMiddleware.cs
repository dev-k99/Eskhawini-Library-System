using System.Text.Json;

namespace LibraryManagement.API.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            var correlationId = Guid.NewGuid().ToString("N")[..8];
            _logger.LogError(ex, "Unhandled exception [{CorrelationId}] {Method} {Path}",
                correlationId, context.Request.Method, context.Request.Path);

            await WriteErrorResponseAsync(context, ex, correlationId);
        }
    }

    private static async Task WriteErrorResponseAsync(HttpContext context, Exception ex, string correlationId)
    {
        context.Response.ContentType = "application/json";

        var (statusCode, title) = ex switch
        {
            UnauthorizedAccessException => (StatusCodes.Status401Unauthorized, "Unauthorized"),
            InvalidOperationException   => (StatusCodes.Status400BadRequest, "Bad Request"),
            ArgumentException           => (StatusCodes.Status400BadRequest, "Bad Request"),
            KeyNotFoundException        => (StatusCodes.Status404NotFound, "Not Found"),
            _                          => (StatusCodes.Status500InternalServerError, "Internal Server Error")
        };

        context.Response.StatusCode = statusCode;

        var response = new
        {
            title,
            status = statusCode,
            correlationId,
            // Only expose details for client errors; never expose stack traces
            detail = statusCode < 500 ? ex.Message : "An unexpected error occurred. Please try again later."
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}
