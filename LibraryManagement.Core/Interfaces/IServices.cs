using LibraryManagement.Core.DTOs;
using LibraryManagement.Core.Entities;

namespace LibraryManagement.Core.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<AuthResponse> RefreshTokenAsync(string refreshToken);
    string GenerateJwtToken(User user);
    string GenerateRefreshToken();
}

public interface IQRCodeService
{
    string GenerateQRCode(string content);
    string GenerateLoanQRCode(int loanId, int bookId, int userId);
}

public interface INotificationService
{
    Task NotifyBookAvailableAsync(int bookId, string bookTitle);
    Task NotifyLoanDueSoonAsync(int userId, int loanId, string bookTitle, DateTime dueDate);
    Task NotifyReservationReadyAsync(int userId, int bookId, string bookTitle);
    Task NotifyBookReturnedAsync(int bookId, string bookTitle);
}
