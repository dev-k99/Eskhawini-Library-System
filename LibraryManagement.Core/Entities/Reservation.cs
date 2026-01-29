namespace LibraryManagement.Core.Entities;

public class Reservation
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int BookId { get; set; }
    public DateTime ReservationDate { get; set; } = DateTime.UtcNow;
    public DateTime? ExpiryDate { get; set; }
    public ReservationStatus Status { get; set; } = ReservationStatus.Pending;

    // Navigation properties
    public User User { get; set; } = null!;
    public Book Book { get; set; } = null!;
}

public enum ReservationStatus
{
    Pending = 0,
    Fulfilled = 1,
    Cancelled = 2,
    Expired = 3
}
