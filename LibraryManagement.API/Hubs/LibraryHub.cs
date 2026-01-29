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

    public NotificationService(IHubContext<LibraryHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task NotifyBookAvailableAsync(int bookId, string bookTitle)
    {
        await _hubContext.Clients.Group($"book-{bookId}")
            .SendAsync("BookAvailable", new { bookId, bookTitle, message = $"'{bookTitle}' is now available!" });
    }

    public async Task NotifyLoanDueSoonAsync(int userId, int loanId, string bookTitle, DateTime dueDate)
    {
        await _hubContext.Clients.Group($"user-{userId}")
            .SendAsync("LoanDueSoon", new { loanId, bookTitle, dueDate, message = $"'{bookTitle}' is due on {dueDate:MMM dd, yyyy}" });
    }

    public async Task NotifyReservationReadyAsync(int userId, int bookId, string bookTitle)
    {
        await _hubContext.Clients.Group($"user-{userId}")
            .SendAsync("ReservationReady", new { bookId, bookTitle, message = $"Your reserved book '{bookTitle}' is ready for pickup!" });
    }

    public async Task NotifyBookReturnedAsync(int bookId, string bookTitle)
    {
        await _hubContext.Clients.All
            .SendAsync("BookReturned", new { bookId, bookTitle, message = $"'{bookTitle}' has been returned" });
    }
}
