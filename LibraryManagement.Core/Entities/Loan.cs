namespace LibraryManagement.Core.Entities;

public class Loan
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int BookId { get; set; }
    public DateTime CheckoutDate { get; set; } = DateTime.UtcNow;
    public DateTime DueDate { get; set; }
    public DateTime? ReturnDate { get; set; }
    public string? QRCode { get; set; }
    public LoanStatus Status { get; set; } = LoanStatus.Active;

    // Navigation properties
    public User User { get; set; } = null!;
    public Book Book { get; set; } = null!;
    public SustainabilityMetric? SustainabilityMetric { get; set; }
}

public enum LoanStatus
{
    Active = 0,
    Returned = 1,
    Overdue = 2
}
