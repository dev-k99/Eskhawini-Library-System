namespace LibraryManagement.Core.Entities;

public class Book
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string ISBN { get; set; } = string.Empty;
    public string Genre { get; set; } = string.Empty;
    public BookStatus Status { get; set; } = BookStatus.Available;
    public string? CoverUrl { get; set; }
    public string? Description { get; set; }
    public string? MetadataJson { get; set; }
    public int TotalCopies { get; set; } = 1;
    public int AvailableCopies { get; set; } = 1;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public ICollection<Loan> Loans { get; set; } = new List<Loan>();
    public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
}

public enum BookStatus
{
    Available = 0,
    CheckedOut = 1,
    Reserved = 2,
    Maintenance = 3
}
