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
public class ReservationsController : ControllerBase
{
    private readonly IReservationRepository _reservationRepository;
    private readonly IBookRepository _bookRepository;
    private readonly IUserRepository _userRepository;
    private readonly IAnalyticsRepository _analyticsRepository;
    private readonly INotificationService _notificationService;
    private readonly ILogger<ReservationsController> _logger;

    public ReservationsController(
        IReservationRepository reservationRepository,
        IBookRepository bookRepository,
        IUserRepository userRepository,
        IAnalyticsRepository analyticsRepository,
        INotificationService notificationService,
        ILogger<ReservationsController> logger)
    {
        _reservationRepository = reservationRepository;
        _bookRepository = bookRepository;
        _userRepository = userRepository;
        _analyticsRepository = analyticsRepository;
        _notificationService = notificationService;
        _logger = logger;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Librarian")]
    public async Task<ActionResult<List<ReservationDto>>> GetAllReservations()
    {
        var users = await _userRepository.GetAllAsync();
        var allReservations = new List<Reservation>();
        
        foreach (var user in users)
        {
            var userReservations = await _reservationRepository.GetByUserIdAsync(user.Id);
            allReservations.AddRange(userReservations);
        }

        return Ok(allReservations.Select(MapToDto));
    }

    [HttpGet("my")]
    public async Task<ActionResult<List<ReservationDto>>> GetMyReservations()
    {
        var userId = GetCurrentUserId();
        var reservations = await _reservationRepository.GetByUserIdAsync(userId);
        return Ok(reservations.Select(MapToDto));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ReservationDto>> GetReservation(int id)
    {
        var reservation = await _reservationRepository.GetByIdAsync(id);
        if (reservation == null)
            return NotFound(new { message = "Reservation not found" });

        var userId = GetCurrentUserId();
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        if (reservation.UserId != userId && userRole != "Admin" && userRole != "Librarian")
            return Forbid();

        return Ok(MapToDto(reservation));
    }

    [HttpPost]
    public async Task<ActionResult<ReservationDto>> CreateReservation([FromBody] CreateReservationRequest request)
    {
        var userId = GetCurrentUserId();
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
            return NotFound(new { message = "User not found" });

        var book = await _bookRepository.GetByIdAsync(request.BookId);
        if (book == null)
            return NotFound(new { message = "Book not found" });

        // Check if user already has a reservation for this book
        var userReservations = await _reservationRepository.GetByUserIdAsync(userId);
        if (userReservations.Any(r => r.BookId == request.BookId && r.Status == ReservationStatus.Pending))
            return BadRequest(new { message = "You already have an active reservation for this book" });

        var reservation = new Reservation
        {
            UserId = userId,
            BookId = request.BookId,
            ReservationDate = DateTime.UtcNow,
            ExpiryDate = DateTime.UtcNow.AddDays(7),
            Status = ReservationStatus.Pending
        };

        await _reservationRepository.CreateAsync(reservation);
        await _analyticsRepository.LogEventAsync(AnalyticsEventTypes.BookReserved, book.Id, userId);

        reservation.User = user;
        reservation.Book = book;

        _logger.LogInformation("Reservation created: Book {BookId} by User {UserId}", book.Id, userId);

        return CreatedAtAction(nameof(GetReservation), new { id = reservation.Id }, MapToDto(reservation));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> CancelReservation(int id)
    {
        var reservation = await _reservationRepository.GetByIdAsync(id);
        if (reservation == null)
            return NotFound(new { message = "Reservation not found" });

        var userId = GetCurrentUserId();
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        if (reservation.UserId != userId && userRole != "Admin" && userRole != "Librarian")
            return Forbid();

        reservation.Status = ReservationStatus.Cancelled;
        await _reservationRepository.UpdateAsync(reservation);

        _logger.LogInformation("Reservation cancelled: {Id}", id);

        return NoContent();
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
            ?? User.FindFirst("sub")?.Value;
        return int.Parse(userIdClaim!);
    }

    private static ReservationDto MapToDto(Reservation r) => new(
        r.Id,
        r.UserId,
        r.User?.Name ?? "",
        r.BookId,
        r.Book?.Title ?? "",
        r.ReservationDate,
        r.ExpiryDate,
        r.Status
    );
}
