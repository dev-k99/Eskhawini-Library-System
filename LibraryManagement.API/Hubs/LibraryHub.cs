using LibraryManagement.Core.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace LibraryManagement.API.Hubs;

public class LibraryHub : Hub
{
    public async Task JoinBookGroup(int bookId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"book-{bookId}");
    }

    public async Task LeaveBookGroup(int bookId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"book-{bookId}");
    }

    public async Task JoinUserGroup(int userId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"user-{userId}");
    }

    public async Task LeaveUserGroup(int userId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user-{userId}");
    }
}

public class NotificationService : INotificationService
{
    private readonly IHubContext<LibraryHub> _hubContext;
    private readonly IEmailService _emailService;
    private readonly IUserRepository _userRepository;
    private readonly ILogger<NotificationService> _logger;

    public NotificationService(
        IHubContext<LibraryHub> hubContext,
        IEmailService emailService,
        IUserRepository userRepository,
        ILogger<NotificationService> logger)
    {
        _hubContext = hubContext;
        _emailService = emailService;
        _userRepository = userRepository;
        _logger = logger;
    }

    public async Task NotifyBookAvailableAsync(int bookId, string bookTitle)
    {
        // SignalR notification (real-time to all connected clients)
        await _hubContext.Clients.Group($"book-{bookId}")
            .SendAsync("BookAvailable", new
            {
                bookId,
                bookTitle,
                message = $"'{bookTitle}' is now available!"
            });

        _logger.LogInformation("SignalR: Book available notification sent for {BookTitle}", bookTitle);

        // NOTE: We don't send email here because we don't know which specific user to notify.
        // Email is sent in NotifyReservationReadyAsync for users with reservations.
    }

    public async Task NotifyLoanDueSoonAsync(int userId, int loanId, string bookTitle, DateTime dueDate)
    {
        // SignalR notification
        await _hubContext.Clients.Group($"user-{userId}")
            .SendAsync("LoanDueSoon", new
            {
                loanId,
                bookTitle,
                dueDate,
                message = $"'{bookTitle}' is due on {dueDate:MMM dd, yyyy}"
            });

        // Email notification
        var user = await _userRepository.GetByIdAsync(userId);
        if (user != null && !string.IsNullOrWhiteSpace(user.Email))
        {
            await _emailService.SendLoanDueSoonEmailAsync(user.Email, user.Name, bookTitle, dueDate);
        }

        _logger.LogInformation("Notifications sent: Loan due soon for {BookTitle} to User {UserId}", bookTitle, userId);
    }

    public async Task NotifyReservationReadyAsync(int userId, int bookId, string bookTitle)
    {
        // SignalR notification
        await _hubContext.Clients.Group($"user-{userId}")
            .SendAsync("ReservationReady", new
            {
                bookId,
                bookTitle,
                message = $"Your reserved book '{bookTitle}' is ready for pickup!"
            });

        // Email notification
        var user = await _userRepository.GetByIdAsync(userId);
        if (user != null && !string.IsNullOrWhiteSpace(user.Email))
        {
            await _emailService.SendReservationReadyEmailAsync(user.Email, user.Name, bookTitle);
        }

        _logger.LogInformation("Notifications sent: Reservation ready for {BookTitle} to User {UserId}", bookTitle, userId);
    }

    public async Task NotifyBookReturnedAsync(int bookId, string bookTitle)
    {
        // SignalR notification to all clients
        await _hubContext.Clients.All
            .SendAsync("BookReturned", new
            {
                bookId,
                bookTitle,
                message = $"'{bookTitle}' has been returned"
            });

        _logger.LogInformation("SignalR: Book returned notification sent for {BookTitle}", bookTitle);
    }
}
