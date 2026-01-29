using LibraryManagement.Core.DTOs;
using LibraryManagement.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Librarian")]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsRepository _analyticsRepository;

    public AnalyticsController(IAnalyticsRepository analyticsRepository)
    {
        _analyticsRepository = analyticsRepository;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<AnalyticsSummaryDto>> GetSummary()
    {
        var summary = await _analyticsRepository.GetSummaryAsync();
        return Ok(summary);
    }

    [HttpGet("most-borrowed")]
    public async Task<ActionResult<List<MostBorrowedBookDto>>> GetMostBorrowed([FromQuery] int count = 10)
    {
        var books = await _analyticsRepository.GetMostBorrowedBooksAsync(count);
        return Ok(books);
    }

    [HttpGet("user-activity")]
    public async Task<ActionResult<List<UserActivityDto>>> GetUserActivity([FromQuery] int count = 10)
    {
        var activity = await _analyticsRepository.GetUserActivityAsync(count);
        return Ok(activity);
    }

    [HttpGet("genre-trends")]
    public async Task<ActionResult<List<GenreTrendDto>>> GetGenreTrends()
    {
        var trends = await _analyticsRepository.GetGenreTrendsAsync();
        return Ok(trends);
    }
}
