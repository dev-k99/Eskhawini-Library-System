using LibraryManagement.Core.Entities;

namespace LibraryManagement.Core.DTOs;

// Authentication DTOs
public record RegisterRequest(string Name, string Email, string Password);
public record LoginRequest(string Email, string Password);
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

public record CreateBookRequest(
    string Title, 
    string Author, 
    string ISBN, 
    string Genre,
    string? CoverUrl,
    string? Description,
    int TotalCopies = 1
);

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
