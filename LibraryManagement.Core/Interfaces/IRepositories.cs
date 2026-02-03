using LibraryManagement.Core.DTOs;
using LibraryManagement.Core.Entities;

namespace LibraryManagement.Core.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(int id);
    Task<User?> GetByEmailAsync(string email);
    Task<List<User>> GetAllAsync();
    Task<User> CreateAsync(User user);
    Task<User> UpdateAsync(User user);
    Task DeleteAsync(int id);
}

public interface IBookRepository
{
    Task<Book?> GetByIdAsync(int id);
    Task<Book?> GetByISBNAsync(string isbn);
    Task<PagedResult<Book>> SearchAsync(BookSearchRequest request);
    Task<List<Book>> GetAllAsync();
    Task<Book> CreateAsync(Book book);
    Task<Book> UpdateAsync(Book book);
    Task DeleteAsync(int id);
}

public interface ILoanRepository
{
    Task<Loan?> GetByIdAsync(int id);
    Task<List<Loan>> GetByUserIdAsync(int userId);
    Task<List<Loan>> GetActiveLoansAsync();
    Task<List<Loan>> GetOverdueLoansAsync();
    Task<Loan> CreateAsync(Loan loan);
    Task<Loan> UpdateAsync(Loan loan);
    Task<List<Loan>> GetAllAsync();
}

public interface IReservationRepository
{
    Task<Reservation?> GetByIdAsync(int id);
    Task<List<Reservation>> GetByUserIdAsync(int userId);
    Task<List<Reservation>> GetByBookIdAsync(int bookId);
    Task<Reservation> CreateAsync(Reservation reservation);
    Task<Reservation> UpdateAsync(Reservation reservation);
    Task DeleteAsync(int id);
}

public interface IAnalyticsRepository
{
    Task LogEventAsync(string eventType, int? entityId, int? userId, string? details = null);
    Task<List<MostBorrowedBookDto>> GetMostBorrowedBooksAsync(int count = 10);
    Task<List<UserActivityDto>> GetUserActivityAsync(int count = 10);
    Task<List<GenreTrendDto>> GetGenreTrendsAsync();
    Task<AnalyticsSummaryDto> GetSummaryAsync();
}

public interface ISustainabilityRepository
{
    Task<SustainabilityMetric> CreateAsync(SustainabilityMetric metric);
    Task<SustainabilityStatsDto> GetStatsAsync();
}

public interface INotificationService
{
    // Called by LoansController.ReturnLoan() after a book is returned
    Task NotifyBookReturnedAsync(int bookId, string bookTitle);

    // Called by LoansController.ReturnLoan() when a pending reservation exists for the returned book
    Task NotifyReservationReadyAsync(int userId, int bookId, string bookTitle);

    // Called by NotificationBackgroundService when a loan is 3 days from due
    Task NotifyLoanDueSoonAsync(int userId, int loanId, string bookTitle, DateTime dueDate);

    // Called when a book transitions to Available (not currently invoked anywhere,
    // but NotificationService implements it — keep for future use)
    Task NotifyBookAvailableAsync(int bookId, string bookTitle);
}
