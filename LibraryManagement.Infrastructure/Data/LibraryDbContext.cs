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
                Name = "Sizwe Librarian",
                Email = "librarian@library.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Lib123!"),
                Role = UserRole.Librarian,
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new User
            {
                Id = 3,
                Name = "Luyanda Patron",
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
            },
            new Book
            {
                Id = 7,
                Title = "The Great Gatsby",
                Author = "F. Scott Fitzgerald",
                ISBN = "978-0743273565",
                Genre = "Fiction",
                Status = BookStatus.Available,
                TotalCopies = 4,
                AvailableCopies = 4,
                Description = "A novel about the American dream and tragedy in the Jazz Age",
                CreatedAt = DateTime.UtcNow
            },
            new Book
            {
                Id = 8,
                Title = "Pride and Prejudice",
                Author = "Jane Austen",
                ISBN = "978-1503290563",
                Genre = "Fiction",
                Status = BookStatus.Available,
                TotalCopies = 5,
                AvailableCopies = 5,
                Description = "A classic romantic novel about manners and matrimonial machinations",
                CreatedAt = DateTime.UtcNow
            },
        new Book
        {
            Id = 9,
            Title = "Design Patterns (GoF)",
            Author = "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
            ISBN = "978-0201633610",
            Genre = "Programming",
            Status = BookStatus.Available,
            TotalCopies = 2,
            AvailableCopies = 2,
            Description = "Elements of reusable object?oriented software",
            CreatedAt = DateTime.UtcNow
        },
        new Book
        {
            Id = 10,
            Title = "You Don't Know JS Yet",
            Author = "Kyle Simpson",
            ISBN = "978-1098115464",
            Genre = "Programming",
            Status = BookStatus.Available,
            TotalCopies = 3,
            AvailableCopies = 3,
            Description = "A deep dive into JavaScript’s core mechanisms",
            CreatedAt = DateTime.UtcNow
        },
        new Book
        {
            Id = 11,
            Title = "Introduction to Algorithms (CLRS)",
            Author = "Cormen, Leiserson, Rivest, Stein",
            ISBN = "978-0262033848",
            Genre = "Programming",
            Status = BookStatus.Available,
            TotalCopies = 3,
            AvailableCopies = 3,
            Description = "Comprehensive algorithms textbook",
            CreatedAt = DateTime.UtcNow
        },
        new Book
        {
            Id = 12,
            Title = "A Brief History of Time",
            Author = "Stephen Hawking",
            ISBN = "978-0553380163",
            Genre = "Science",
            Status = BookStatus.Available,
            TotalCopies = 4,
            AvailableCopies = 4,
            Description = "Exploration of the universe’s origins and structure",
            CreatedAt = DateTime.UtcNow
        },
        new Book
        {
            Id = 13,
            Title = "The Selfish Gene",
            Author = "Richard Dawkins",
            ISBN = "978-0198788607",
            Genre = "Science",
            Status = BookStatus.Available,
            TotalCopies = 4,
            AvailableCopies = 4,
            Description = "Evolutionary biology from a gene?centric view",
            CreatedAt = DateTime.UtcNow
        },
        new Book
        {
            Id = 14,
            Title = "Sapiens: A Brief History of Humankind",
            Author = "Yuval Noah Harari",
            ISBN = "978-0062316097",
            Genre = "Science",
            Status = BookStatus.Available,
            TotalCopies = 4,
            AvailableCopies = 4,
            Description = "Big history of human species",
            CreatedAt = DateTime.UtcNow
        },
        new Book
        {
            Id = 15,
            Title = "The Structure of Scientific Revolutions",
            Author = "Thomas S. Kuhn",
            ISBN = "978-0226458120",
            Genre = "Science",
            Status = BookStatus.Available,
            TotalCopies = 3,
            AvailableCopies = 3,
            Description = "Foundations of paradigm shifts in science",
            CreatedAt = DateTime.UtcNow
        },
        new Book
        {
            Id = 16,
            Title = "The Immortal Life of Henrietta Lacks",
            Author = "Rebecca Skloot",
            ISBN = "978-1400052189",
            Genre = "Science",
            Status = BookStatus.Available,
            TotalCopies = 4,
            AvailableCopies = 4,
            Description = "Story of Henrietta Lacks and HeLa cells",
            CreatedAt = DateTime.UtcNow
        },
        new Book
        {
            Id = 17,
            Title = "Guns, Germs, and Steel",
            Author = "Jared Diamond",
            ISBN = "978-0393354324",
            Genre = "History",
            Status = BookStatus.Available,
            TotalCopies = 4,
            AvailableCopies = 4,
            Description = "Analysis of factors shaping civilizations",
            CreatedAt = DateTime.UtcNow
        },
        new Book
        {
            Id = 18,
            Title = "The Art of War",
            Author = "Sun Tzu",
            ISBN = "978-1590302255",
            Genre = "History",
            Status = BookStatus.Available,
            TotalCopies = 3,
            AvailableCopies = 3,
            Description = "Ancient military strategy classic",
            CreatedAt = DateTime.UtcNow
        },
        new Book
        {
            Id = 19,
            Title = "The Diary of Anne Frank",
            Author = "Anne Frank",
            ISBN = "978-0553296983",
            Genre = "History",
            Status = BookStatus.Available,
            TotalCopies = 5,
            AvailableCopies = 5,
            Description = "Wartime diary of a Jewish girl",
            CreatedAt = DateTime.UtcNow
        },
        new Book
        {
            Id = 20,
            Title = "Decline of the Roman Empire",
            Author = "Edward Gibbon",
            ISBN = "978-0140442106",
            Genre = "History",
            Status = BookStatus.Available,
            TotalCopies = 3,
            AvailableCopies = 3,
            Description = "Classic history of Rome’s fall",
            CreatedAt = DateTime.UtcNow
        },
        new Book
        {
            Id = 21,
            Title = "The Second World War",
            Author = "Antony Beevor",
            ISBN = "978-0241987091",
            Genre = "History",
            Status = BookStatus.Available,
            TotalCopies = 4,
            AvailableCopies = 4,
            Description = "Comprehensive WWII history",
            CreatedAt = DateTime.UtcNow
        },
        new Book
        {
            Id = 22,
            Title = "Steve Jobs",
            Author = "Walter Isaacson",
            ISBN = "978-1451648539",
            Genre = "Biography",
            Status = BookStatus.Available,
            TotalCopies = 3,
            AvailableCopies = 3,
            Description = "Biography of Apple co?founder",
            CreatedAt = DateTime.UtcNow
        },
        new Book
        {
            Id = 23,
            Title = "Long Walk to Freedom",
            Author = "Nelson Mandela",
            ISBN = "978-0316548182",
            Genre = "Biography",
            Status = BookStatus.Available,
            TotalCopies = 4,
            AvailableCopies = 4,
            Description = "Autobiography of Nelson Mandela",
            CreatedAt = DateTime.UtcNow
        },
        new Book
        {
            Id = 24,
            Title = "The Diary of Samuel Pepys",
            Author = "Samuel Pepys",
            ISBN = "978-0141440644",
            Genre = "Biography",
            Status = BookStatus.Available,
            TotalCopies = 3,
            AvailableCopies = 3,
            Description = "17th?century English diary",
            CreatedAt = DateTime.UtcNow
        },
        new Book
        {
            Id = 25,
            Title = "Einstein: His Life and Universe",
            Author = "Walter Isaacson",
            ISBN = "978-0743264747",
            Genre = "Biography",
            Status = BookStatus.Available,
            TotalCopies = 3,
            AvailableCopies = 3,
            Description = "Life of Albert Einstein",
            CreatedAt = DateTime.UtcNow
        },
        new Book
        {
            Id = 26,
            Title = "Becoming",
            Author = "Michelle Obama",
            ISBN = "978-1524763138",
            Genre = "Biography",
            Status = BookStatus.Available,
            TotalCopies = 5,
            AvailableCopies = 5,
            Description = "Memoir of Michelle Obama",
            CreatedAt = DateTime.UtcNow
        },
        new Book
        {
            Id = 27,
            Title = "The Murder of Roger Ackroyd",
            Author = "Agatha Christie",
            ISBN = "978-0007119318",
            Genre = "Mystery",
            Status = BookStatus.Available,
            TotalCopies = 4,
            AvailableCopies = 4,
            Description = "Hercule Poirot mystery",
            CreatedAt = DateTime.UtcNow
        },
        new Book
        {
            Id = 28,
            Title = "The Girl with the Dragon Tattoo",
            Author = "Stieg Larsson",
            ISBN = "978-0307454546",
            Genre = "Mystery",
            Status = BookStatus.Available,
            TotalCopies = 4,
            AvailableCopies = 4,
            Description = "Thriller novel",
            CreatedAt = DateTime.UtcNow
        },
        new Book
        {
            Id = 29,
            Title = "Gone Girl",
            Author = "Gillian Flynn",
            ISBN = "978-0307588371",
            Genre = "Mystery",
            Status = BookStatus.Available,
            TotalCopies = 4,
            AvailableCopies = 4,
            Description = "Psychological thriller",
            CreatedAt = DateTime.UtcNow
        },
        new Book
        {
            Id = 30,
            Title = "The Da Vinci Code",
            Author = "Dan Brown",
            ISBN = "978-0307474278",
            Genre = "Mystery",
            Status = BookStatus.Available,
            TotalCopies = 5,
            AvailableCopies = 5,
            Description = "Conspiracy thriller",
            CreatedAt = DateTime.UtcNow
        },
        new Book
        {
            Id = 31,
            Title = "And Then There Were None",
            Author = "Agatha Christie",
            ISBN = "978-0062073488",
            Genre = "Mystery",
            Status = BookStatus.Available,
            TotalCopies = 5,
            AvailableCopies = 5,
            Description = "Classic locked?room mystery",
            CreatedAt = DateTime.UtcNow
        }
        );
    }
}
