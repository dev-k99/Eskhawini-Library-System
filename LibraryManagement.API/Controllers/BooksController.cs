using LibraryManagement.Core.DTOs;
using LibraryManagement.Core.Entities;
using LibraryManagement.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly IBookRepository _bookRepository;
    private readonly IAnalyticsRepository _analyticsRepository;
    private readonly ILogger<BooksController> _logger;

    public BooksController(
        IBookRepository bookRepository, 
        IAnalyticsRepository analyticsRepository,
        ILogger<BooksController> logger)
    {
        _bookRepository = bookRepository;
        _analyticsRepository = analyticsRepository;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<BookDto>>> GetBooks([FromQuery] BookSearchRequest request)
    {
        var result = await _bookRepository.SearchAsync(request);
        
        var bookDtos = result.Items.Select(b => new BookDto(
            b.Id, b.Title, b.Author, b.ISBN, b.Genre, b.Status,
            b.CoverUrl, b.Description, b.TotalCopies, b.AvailableCopies, b.CreatedAt
        )).ToList();

        // Log search analytics
        if (!string.IsNullOrWhiteSpace(request.Query))
        {
            await _analyticsRepository.LogEventAsync(
                AnalyticsEventTypes.SearchPerformed, 
                null, 
                null, 
                $"Query: {request.Query}");
        }

        return Ok(new PagedResult<BookDto>(
            bookDtos, result.TotalCount, result.Page, result.PageSize, result.TotalPages));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BookDto>> GetBook(int id)
    {
        var book = await _bookRepository.GetByIdAsync(id);
        if (book == null)
            return NotFound(new { message = "Book not found" });

        return Ok(new BookDto(
            book.Id, book.Title, book.Author, book.ISBN, book.Genre, book.Status,
            book.CoverUrl, book.Description, book.TotalCopies, book.AvailableCopies, book.CreatedAt));
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Librarian")]
    public async Task<ActionResult<BookDto>> CreateBook([FromBody] CreateBookRequest request)
    {
        // Check for duplicate ISBN
        if (!string.IsNullOrWhiteSpace(request.ISBN))
        {
            var existing = await _bookRepository.GetByISBNAsync(request.ISBN);
            if (existing != null)
                return BadRequest(new { message = "A book with this ISBN already exists" });
        }

        var book = new Book
        {
            Title = request.Title,
            Author = request.Author,
            ISBN = request.ISBN,
            Genre = request.Genre,
            CoverUrl = request.CoverUrl,
            Description = request.Description,
            TotalCopies = request.TotalCopies,
            AvailableCopies = request.TotalCopies,
            Status = BookStatus.Available,
            CreatedAt = DateTime.UtcNow
        };

        await _bookRepository.CreateAsync(book);
        await _analyticsRepository.LogEventAsync(AnalyticsEventTypes.BookAdded, book.Id, null);

        _logger.LogInformation("Book created: {Title} (ID: {Id})", book.Title, book.Id);

        return CreatedAtAction(nameof(GetBook), new { id = book.Id }, new BookDto(
            book.Id, book.Title, book.Author, book.ISBN, book.Genre, book.Status,
            book.CoverUrl, book.Description, book.TotalCopies, book.AvailableCopies, book.CreatedAt));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Librarian")]
    public async Task<ActionResult<BookDto>> UpdateBook(int id, [FromBody] UpdateBookRequest request)
    {
        var book = await _bookRepository.GetByIdAsync(id);
        if (book == null)
            return NotFound(new { message = "Book not found" });

        if (request.Title != null) book.Title = request.Title;
        if (request.Author != null) book.Author = request.Author;
        if (request.ISBN != null) book.ISBN = request.ISBN;
        if (request.Genre != null) book.Genre = request.Genre;
        if (request.Status.HasValue) book.Status = request.Status.Value;
        if (request.CoverUrl != null) book.CoverUrl = request.CoverUrl;
        if (request.Description != null) book.Description = request.Description;
        if (request.TotalCopies.HasValue) book.TotalCopies = request.TotalCopies.Value;
        if (request.AvailableCopies.HasValue) book.AvailableCopies = request.AvailableCopies.Value;

        await _bookRepository.UpdateAsync(book);

        _logger.LogInformation("Book updated: {Title} (ID: {Id})", book.Title, book.Id);

        return Ok(new BookDto(
            book.Id, book.Title, book.Author, book.ISBN, book.Genre, book.Status,
            book.CoverUrl, book.Description, book.TotalCopies, book.AvailableCopies, book.CreatedAt));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var book = await _bookRepository.GetByIdAsync(id);
        if (book == null)
            return NotFound(new { message = "Book not found" });

        await _bookRepository.DeleteAsync(id);
        _logger.LogInformation("Book deleted: {Title} (ID: {Id})", book.Title, id);

        return NoContent();
    }
}
