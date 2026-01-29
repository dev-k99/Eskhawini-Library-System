using System.Security.Claims;
using LibraryManagement.Core.DTOs;
using LibraryManagement.Core.Entities;
using LibraryManagement.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LoansController : ControllerBase
{
    private readonly ILoanRepository _loanRepository;
    private readonly IBookRepository _bookRepository;
    private readonly IUserRepository _userRepository;
    private readonly IReservationRepository _reservationRepository;
    private readonly IAnalyticsRepository _analyticsRepository;
    private readonly ISustainabilityRepository _sustainabilityRepository;
    private readonly IQRCodeService _qrCodeService;
    private readonly INotificationService _notificationService;
    private readonly ILogger<LoansController> _logger;

    public LoansController(
        ILoanRepository loanRepository,
        IBookRepository bookRepository,
        IUserRepository userRepository,
        IReservationRepository reservationRepository,
        IAnalyticsRepository analyticsRepository,
        ISustainabilityRepository sustainabilityRepository,
        IQRCodeService qrCodeService,
        INotificationService notificationService,
        ILogger<LoansController> logger)
    {
        _loanRepository = loanRepository;
        _bookRepository = bookRepository;
        _userRepository = userRepository;
        _reservationRepository = reservationRepository;
        _analyticsRepository = analyticsRepository;
        _sustainabilityRepository = sustainabilityRepository;
        _qrCodeService = qrCodeService;
        _notificationService = notificationService;
        _logger = logger;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Librarian")]
    public async Task<ActionResult<List<LoanDto>>> GetAllLoans()
    {
        var loans = await _loanRepository.GetActiveLoansAsync();
        return Ok(loans.Select(MapToDto));
    }

    [HttpGet("my")]
    public async Task<ActionResult<List<LoanDto>>> GetMyLoans()
    {
        var userId = GetCurrentUserId();
        var loans = await _loanRepository.GetByUserIdAsync(userId);
        return Ok(loans.Select(MapToDto));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<LoanDto>> GetLoan(int id)
    {
        var loan = await _loanRepository.GetByIdAsync(id);
        if (loan == null)
            return NotFound(new { message = "Loan not found" });

        var userId = GetCurrentUserId();
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        // Users can only see their own loans unless they're admin/librarian
        if (loan.UserId != userId && userRole != "Admin" && userRole != "Librarian")
            return Forbid();

        return Ok(MapToDto(loan));
    }

    [HttpPost]
    public async Task<ActionResult<LoanDto>> CreateLoan([FromBody] CreateLoanRequest request)
    {
        var userId = request.UserId ?? GetCurrentUserId();
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        // Only admin/librarian can create loans for other users
        if (request.UserId.HasValue && request.UserId != GetCurrentUserId() 
            && userRole != "Admin" && userRole != "Librarian")
            return Forbid();

        var book = await _bookRepository.GetByIdAsync(request.BookId);
        if (book == null)
            return NotFound(new { message = "Book not found" });

        if (book.AvailableCopies <= 0)
            return BadRequest(new { message = "No copies available for checkout" });

        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
            return NotFound(new { message = "User not found" });

        // Create loan
        var loan = new Loan
        {
            UserId = userId,
            BookId = request.BookId,
            CheckoutDate = DateTime.UtcNow,
            DueDate = DateTime.UtcNow.AddDays(request.LoanDays),
            Status = LoanStatus.Active
        };

        // Generate QR code
        await _loanRepository.CreateAsync(loan);
        loan.QRCode = _qrCodeService.GenerateLoanQRCode(loan.Id, loan.BookId, loan.UserId);
        await _loanRepository.UpdateAsync(loan);

        // Update book availability
        book.AvailableCopies--;
        if (book.AvailableCopies == 0)
            book.Status = BookStatus.CheckedOut;
        await _bookRepository.UpdateAsync(book);

        // Log analytics
        await _analyticsRepository.LogEventAsync(
            AnalyticsEventTypes.BookBorrowed, book.Id, userId);

        // Load navigation properties for response
        loan.User = user;
        loan.Book = book;

        _logger.LogInformation("Loan created: Book {BookId} to User {UserId}", loan.BookId, loan.UserId);

        return CreatedAtAction(nameof(GetLoan), new { id = loan.Id }, MapToDto(loan));
    }

    [HttpPost("{id}/return")]
    public async Task<ActionResult<LoanDto>> ReturnLoan(int id, [FromBody] ReturnLoanRequest? request)
    {
        var loan = await _loanRepository.GetByIdAsync(id);
        if (loan == null)
            return NotFound(new { message = "Loan not found" });

        if (loan.Status == LoanStatus.Returned)
            return BadRequest(new { message = "Loan has already been returned" });

        var userId = GetCurrentUserId();
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        // Users can only return their own loans unless they're admin/librarian
        if (loan.UserId != userId && userRole != "Admin" && userRole != "Librarian")
            return Forbid();

        // Update loan
        loan.ReturnDate = DateTime.UtcNow;
        loan.Status = LoanStatus.Returned;
        await _loanRepository.UpdateAsync(loan);

        // Update book availability
        var book = await _bookRepository.GetByIdAsync(loan.BookId);
        if (book != null)
        {
            book.AvailableCopies++;
            book.Status = BookStatus.Available;
            await _bookRepository.UpdateAsync(book);

            // Notify about book availability
            await _notificationService.NotifyBookReturnedAsync(book.Id, book.Title);

            // Check for pending reservations
            var reservations = await _reservationRepository.GetByBookIdAsync(book.Id);
            var nextReservation = reservations.FirstOrDefault();
            if (nextReservation != null)
            {
                await _notificationService.NotifyReservationReadyAsync(
                    nextReservation.UserId, book.Id, book.Title);
            }
        }

        // Track sustainability metrics if provided
        if (request?.DistanceKm > 0 && request?.WeightKg > 0)
        {
            var metric = new SustainabilityMetric
            {
                LoanId = loan.Id,
                DistanceKm = request.DistanceKm.Value,
                WeightKg = request.WeightKg.Value,
                CarbonFootprintKg = SustainabilityMetric.CalculateCarbonFootprint(
                    request.DistanceKm.Value, request.WeightKg.Value)
            };
            await _sustainabilityRepository.CreateAsync(metric);
        }

        // Log analytics
        await _analyticsRepository.LogEventAsync(
            AnalyticsEventTypes.BookReturned, loan.BookId, loan.UserId);

        _logger.LogInformation("Book returned: Loan {LoanId}", id);

        return Ok(MapToDto(loan));
    }

    [HttpGet("{id}/qrcode")]
    public async Task<ActionResult<object>> GetLoanQRCode(int id)
    {
        var loan = await _loanRepository.GetByIdAsync(id);
        if (loan == null)
            return NotFound(new { message = "Loan not found" });

        var userId = GetCurrentUserId();
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        if (loan.UserId != userId && userRole != "Admin" && userRole != "Librarian")
            return Forbid();

        if (string.IsNullOrEmpty(loan.QRCode))
        {
            loan.QRCode = _qrCodeService.GenerateLoanQRCode(loan.Id, loan.BookId, loan.UserId);
            await _loanRepository.UpdateAsync(loan);
        }

        return Ok(new { qrCode = loan.QRCode });
    }

    [HttpGet("overdue")]
    [Authorize(Roles = "Admin,Librarian")]
    public async Task<ActionResult<List<LoanDto>>> GetOverdueLoans()
    {
        var loans = await _loanRepository.GetOverdueLoansAsync();
        return Ok(loans.Select(MapToDto));
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
            ?? User.FindFirst("sub")?.Value;
        return int.Parse(userIdClaim!);
    }

    private static LoanDto MapToDto(Loan loan) => new(
        loan.Id,
        loan.UserId,
        loan.User?.Name ?? "",
        loan.BookId,
        loan.Book?.Title ?? "",
        loan.CheckoutDate,
        loan.DueDate,
        loan.ReturnDate,
        loan.QRCode,
        loan.Status
    );
}
