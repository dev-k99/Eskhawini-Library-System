using LibraryManagement.Core.DTOs;
using LibraryManagement.Core.Entities;
using LibraryManagement.Core.Interfaces;
using LibraryManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Infrastructure.Repositories;

public class AnalyticsRepository : IAnalyticsRepository
{
    private readonly LibraryDbContext _context;

    public AnalyticsRepository(LibraryDbContext context)
    {
        _context = context;
    }

    public async Task LogEventAsync(string eventType, int? entityId, int? userId, string? details = null)
    {
        var log = new AnalyticsLog
        {
            EventType = eventType,
            EntityId = entityId,
            UserId = userId,
            Details = details,
            Timestamp = DateTime.UtcNow
        };
        _context.AnalyticsLogs.Add(log);
        await _context.SaveChangesAsync();
    }

    public async Task<List<MostBorrowedBookDto>> GetMostBorrowedBooksAsync(int count = 10)
    {
        // FIXED: Simplified query that EF Core can translate
        var result = await _context.Loans
            .Include(l => l.Book)
            .GroupBy(l => new { l.BookId, l.Book.Title, l.Book.Author })
            .Select(g => new
            {
                BookId = g.Key.BookId,
                Title = g.Key.Title,
                Author = g.Key.Author,
                BorrowCount = g.Count()
            })
            .OrderByDescending(x => x.BorrowCount)
            .Take(count)
            .ToListAsync();

        // Map to DTO
        return result.Select(r => new MostBorrowedBookDto(
            r.BookId,
            r.Title,
            r.Author,
            r.BorrowCount
        )).ToList();
    }

    public async Task<List<UserActivityDto>> GetUserActivityAsync(int count = 10)
    {
        // FIXED: Simplified query
        var result = await _context.Users
            .Include(u => u.Loans)
            .Select(u => new
            {
                UserId = u.Id,
                UserName = u.Name,
                TotalLoans = u.Loans.Count,
                ActiveLoans = u.Loans.Count(l => l.Status == LoanStatus.Active),
                LastActivity = u.Loans.Any() ? u.Loans.Max(l => l.CheckoutDate) : (DateTime?)null
            })
            .OrderByDescending(x => x.TotalLoans)
            .Take(count)
            .ToListAsync();

        // Map to DTO
        return result.Select(r => new UserActivityDto(
            r.UserId,
            r.UserName,
            r.TotalLoans,
            r.ActiveLoans,
            r.LastActivity
        )).ToList();
    }

    public async Task<List<GenreTrendDto>> GetGenreTrendsAsync()
    {
        var totalLoans = await _context.Loans.CountAsync();
        if (totalLoans == 0) return new List<GenreTrendDto>();

        // FIXED: Simplified query
        var result = await _context.Loans
            .Include(l => l.Book)
            .GroupBy(l => l.Book.Genre)
            .Select(g => new
            {
                Genre = g.Key,
                BorrowCount = g.Count()
            })
            .OrderByDescending(x => x.BorrowCount)
            .ToListAsync();

        // Calculate percentage and map to DTO
        return result.Select(r => new GenreTrendDto(
            r.Genre,
            r.BorrowCount,
            Math.Round((decimal)r.BorrowCount / totalLoans * 100, 2)
        )).ToList();
    }

    public async Task<AnalyticsSummaryDto> GetSummaryAsync()
    {
        var now = DateTime.UtcNow;
        var startOfMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);

        var totalBooks = await _context.Books.CountAsync();
        var totalUsers = await _context.Users.CountAsync();
        var activeLoans = await _context.Loans.CountAsync(l => l.Status == LoanStatus.Active);
        var loansThisMonth = await _context.Loans.CountAsync(l => l.CheckoutDate >= startOfMonth);
        var topBooks = await GetMostBorrowedBooksAsync(5);
        var genreTrends = await GetGenreTrendsAsync();

        return new AnalyticsSummaryDto(
            totalBooks,
            totalUsers,
            activeLoans,
            loansThisMonth,
            topBooks,
            genreTrends
        );
    }
}

public class SustainabilityRepository : ISustainabilityRepository
{
    private readonly LibraryDbContext _context;

    public SustainabilityRepository(LibraryDbContext context)
    {
        _context = context;
    }

    public async Task<SustainabilityMetric> CreateAsync(SustainabilityMetric metric)
    {
        _context.SustainabilityMetrics.Add(metric);
        await _context.SaveChangesAsync();
        return metric;
    }

    public async Task<SustainabilityStatsDto> GetStatsAsync()
    {
        var metrics = await _context.SustainabilityMetrics.ToListAsync();

        var totalCarbonFootprint = metrics.Sum(m => m.CarbonFootprintKg);
        var totalShipments = metrics.Count;
        var avgDistance = totalShipments > 0 ? metrics.Average(m => m.DistanceKm) : 0;

        // Calculate digital reads saved trees (assuming 10% of total loans are digital)
        var totalLoans = await _context.Loans.CountAsync();
        var digitalReads = (int)(totalLoans * 0.1);
        var treesSaved = SustainabilityMetric.CalculateTreesSaved(digitalReads);

        return new SustainabilityStatsDto(
            totalCarbonFootprint,
            totalShipments,
            treesSaved,
            (decimal)avgDistance
        );
    }
}