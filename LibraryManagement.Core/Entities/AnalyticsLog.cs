namespace LibraryManagement.Core.Entities;

public class AnalyticsLog
{
    public int Id { get; set; }
    public string EventType { get; set; } = string.Empty;
    public int? EntityId { get; set; }
    public int? UserId { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string? Details { get; set; }
}

public static class AnalyticsEventTypes
{
    public const string BookBorrowed = "BOOK_BORROWED";
    public const string BookReturned = "BOOK_RETURNED";
    public const string BookReserved = "BOOK_RESERVED";
    public const string UserRegistered = "USER_REGISTERED";
    public const string BookAdded = "BOOK_ADDED";
    public const string SearchPerformed = "SEARCH_PERFORMED";
}
