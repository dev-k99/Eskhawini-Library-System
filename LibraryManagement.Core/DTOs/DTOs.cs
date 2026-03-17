using System.ComponentModel.DataAnnotations;
using LibraryManagement.Core.Entities;

namespace LibraryManagement.Core.DTOs;

// Authentication DTOs
public class RegisterRequest
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = "";

    [Required, EmailAddress, MaxLength(255)]
    public string Email { get; set; } = "";

    [Required, MinLength(8), MaxLength(128)]
    public string Password { get; set; } = "";
}

public class LoginRequest
{
    [Required, EmailAddress, MaxLength(255)]
    public string Email { get; set; } = "";

    [Required]
    public string Password { get; set; } = "";
}

public record AuthResponse(string Token, string RefreshToken, UserDto User);
public record RefreshTokenRequest(string RefreshToken);

// User DTOs
public record UserDto(int Id, string Name, string Email, UserRole Role, DateTime CreatedAt);
public record CreateUserRequest(string Name, string Email, string Password, UserRole Role);
public record UpdateUserRequest(string? Name, string? Email, UserRole? Role);

// Book DTOs
public record BookDto(
    int Id, 
    string Title, 
    string Author, 
    string ISBN, 
    string Genre, 
    BookStatus Status,
    string? CoverUrl, 
    string? Description,
    int TotalCopies,
    int AvailableCopies,
    DateTime CreatedAt
);

public class CreateBookRequest
{
    [Required, MaxLength(300)]
    public string Title { get; set; } = "";

    [Required, MaxLength(200)]
    public string Author { get; set; } = "";

    [MaxLength(20)]
    public string ISBN { get; set; } = "";

    [Required, MaxLength(100)]
    public string Genre { get; set; } = "";

    [Url, MaxLength(500)]
    public string? CoverUrl { get; set; }

    [MaxLength(2000)]
    public string? Description { get; set; }

    [Range(1, 1000)]
    public int TotalCopies { get; set; } = 1;
}

public record UpdateBookRequest(
    string? Title, 
    string? Author, 
    string? ISBN, 
    string? Genre,
    BookStatus? Status,
    string? CoverUrl,
    string? Description,
    int? TotalCopies,
    int? AvailableCopies
);

public record BookSearchRequest(
    string? Query,
    string? Genre,
    BookStatus? Status,
    int Page = 1,
    int PageSize = 10
);

// Loan DTOs
public record LoanDto(
    int Id,
    int UserId,
    string UserName,
    int BookId,
    string BookTitle,
    DateTime CheckoutDate,
    DateTime DueDate,
    DateTime? ReturnDate,
    string? QRCode,
    LoanStatus Status
);

public record CreateLoanRequest(int BookId, int? UserId = null, int LoanDays = 14);
public record ReturnLoanRequest(decimal? DistanceKm = null, decimal? WeightKg = null);

// Reservation DTOs
public record ReservationDto(
    int Id,
    int UserId,
    string UserName,
    int BookId,
    string BookTitle,
    DateTime ReservationDate,
    DateTime? ExpiryDate,
    ReservationStatus Status
);

public record CreateReservationRequest(int BookId);

// Analytics DTOs
public record MostBorrowedBookDto(int BookId, string Title, string Author, int BorrowCount);
public record UserActivityDto(int UserId, string UserName, int TotalLoans, int ActiveLoans, DateTime? LastActivity);
public record GenreTrendDto(string Genre, int BorrowCount, decimal Percentage);
public record AnalyticsSummaryDto(
    int TotalBooks,
    int TotalUsers,
    int ActiveLoans,
    int TotalLoansThisMonth,
    List<MostBorrowedBookDto> TopBooks,
    List<GenreTrendDto> GenreTrends
);

// Sustainability DTOs
public record SustainabilityStatsDto(
    decimal TotalCarbonFootprintKg,
    int TotalShipments,
    decimal DigitalReadsSavedTrees,
    decimal AverageDistanceKm
);

public record CalculateCarbonRequest(decimal DistanceKm, decimal WeightKg);

// Pagination
public record PagedResult<T>(List<T> Items, int TotalCount, int Page, int PageSize, int TotalPages);
