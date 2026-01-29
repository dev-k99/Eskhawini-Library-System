using LibraryManagement.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Infrastructure.Data;

public class LibraryDbContext : DbContext
{
    public LibraryDbContext(DbContextOptions<LibraryDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Book> Books => Set<Book>();
    public DbSet<Loan> Loans => Set<Loan>();
    public DbSet<Reservation> Reservations => Set<Reservation>();
    public DbSet<AnalyticsLog> AnalyticsLogs => Set<AnalyticsLog>();
    public DbSet<SustainabilityMetric> SustainabilityMetrics => Set<SustainabilityMetric>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Email).HasMaxLength(255).IsRequired();
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.Role).HasConversion<string>();
        });

        // Book configuration
        modelBuilder.Entity<Book>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.ISBN);
            entity.HasIndex(e => e.Title);
            entity.HasIndex(e => e.Genre);
            entity.Property(e => e.Title).HasMaxLength(500).IsRequired();
            entity.Property(e => e.Author).HasMaxLength(255).IsRequired();
            entity.Property(e => e.ISBN).HasMaxLength(20);
            entity.Property(e => e.Genre).HasMaxLength(100);
            entity.Property(e => e.Status).HasConversion<string>();
        });

        // Loan configuration
        modelBuilder.Entity<Loan>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.BookId);
            entity.Property(e => e.Status).HasConversion<string>();
            
            entity.HasOne(e => e.User)
                .WithMany(u => u.Loans)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasOne(e => e.Book)
                .WithMany(b => b.Loans)
                .HasForeignKey(e => e.BookId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Reservation configuration
        modelBuilder.Entity<Reservation>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.BookId);
            entity.Property(e => e.Status).HasConversion<string>();
            
            entity.HasOne(e => e.User)
                .WithMany(u => u.Reservations)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasOne(e => e.Book)
                .WithMany(b => b.Reservations)
                .HasForeignKey(e => e.BookId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // AnalyticsLog configuration
        modelBuilder.Entity<AnalyticsLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.EventType);
            entity.HasIndex(e => e.Timestamp);
            entity.Property(e => e.EventType).HasMaxLength(50).IsRequired();
        });

        // SustainabilityMetric configuration
        modelBuilder.Entity<SustainabilityMetric>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.DistanceKm).HasPrecision(10, 2);
            entity.Property(e => e.WeightKg).HasPrecision(10, 2);
            entity.Property(e => e.CarbonFootprintKg).HasPrecision(10, 4);
            
            entity.HasOne(e => e.Loan)
                .WithOne(l => l.SustainabilityMetric)
                .HasForeignKey<SustainabilityMetric>(e => e.LoanId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Seed initial data
        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        // Seed admin user (password: Admin123!)
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                Name = "Admin User",
                Email = "admin@library.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                Role = UserRole.Admin,
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new User
            {
                Id = 2,
                Name = "Jane Librarian",
                Email = "librarian@library.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Lib123!"),
                Role = UserRole.Librarian,
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new User
            {
                Id = 3,
                Name = "John Patron",
                Email = "patron@library.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Patron123!"),
                Role = UserRole.Patron,
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );

        // Seed sample books
        modelBuilder.Entity<Book>().HasData(
            new Book
            {
                Id = 1,
                Title = "Clean Code",
                Author = "Robert C. Martin",
                ISBN = "978-0132350884",
                Genre = "Programming",
                Status = BookStatus.Available,
                TotalCopies = 3,
                AvailableCopies = 3,
                Description = "A Handbook of Agile Software Craftsmanship",
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Book
            {
                Id = 2,
                Title = "The Pragmatic Programmer",
                Author = "David Thomas, Andrew Hunt",
                ISBN = "978-0135957059",
                Genre = "Programming",
                Status = BookStatus.Available,
                TotalCopies = 2,
                AvailableCopies = 2,
                Description = "Your Journey to Mastery",
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Book
            {
                Id = 3,
                Title = "Design Patterns",
                Author = "Gang of Four",
                ISBN = "978-0201633610",
                Genre = "Programming",
                Status = BookStatus.Available,
                TotalCopies = 2,
                AvailableCopies = 2,
                Description = "Elements of Reusable Object-Oriented Software",
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Book
            {
                Id = 4,
                Title = "1984",
                Author = "George Orwell",
                ISBN = "978-0451524935",
                Genre = "Fiction",
                Status = BookStatus.Available,
                TotalCopies = 5,
                AvailableCopies = 5,
                Description = "A dystopian social science fiction novel",
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Book
            {
                Id = 5,
                Title = "To Kill a Mockingbird",
                Author = "Harper Lee",
                ISBN = "978-0060935467",
                Genre = "Fiction",
                Status = BookStatus.Available,
                TotalCopies = 4,
                AvailableCopies = 4,
                Description = "A novel about racial injustice in the American South",
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );
    }
}
