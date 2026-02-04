# Eskhawini LibraryOS - Modern Library Management System

> A full-stack enterprise library management application demonstrating clean architecture, real-time features, and modern web development practices.

[![.NET 8](https://img.shields.io/badge/.NET-8.0-512BD4?style=flat-square&logo=dotnet)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

---

## 🎯 Project Overview

LibraryOS is a production-ready library management system built to solve real-world challenges in modern library operations. The application implements industry-standard patterns including **Clean Architecture**, **CQRS principles**, and **Event-Driven Design** using **SignalR** for real-time updates.

**Key Achievement**: Successfully integrated 8+ complex systems (authentication, real-time notifications, QR code generation, email services, analytics, sustainability tracking) into a cohesive, scalable application.

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                          │
│  React SPA + Tailwind CSS + SignalR Client + Axios HTTP       │
└────────────────────┬────────────────────────────────────────────┘
                     │ REST API + WebSocket
┌────────────────────┴────────────────────────────────────────────┐
│                      API Layer (ASP.NET Core 8)                 │
│  Controllers │ SignalR Hub │ Middleware │ JWT Auth             │
└────────────────────┬────────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────────┐
│                    Business Logic Layer (Core)                  │
│  Entities │ DTOs │ Interfaces │ Domain Services                │
└────────────────────┬────────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────────┐
│                 Infrastructure Layer (Repositories)             │
│  EF Core │ PostgreSQL │ Email Service │ QR Generator           │
└─────────────────────────────────────────────────────────────────┘
```

### Clean Architecture Implementation

The project follows **Clean Architecture** principles with clear separation of concerns:

- **Core Layer**: Domain entities, business logic, and interfaces (dependency-free)
- **Infrastructure Layer**: Concrete implementations of repositories, services, and external integrations
- **API Layer**: HTTP endpoints, middleware, and presentation logic
- **Frontend**: Decoupled React SPA consuming REST APIs

**Benefits Achieved**:
- ✅ Testability: Business logic isolated from infrastructure
- ✅ Maintainability: Clear boundaries between layers
- ✅ Flexibility: Easy to swap implementations (e.g., PostgreSQL → SQL Server)

---

## 💡 Technical Highlights & Problem Solving

### 1. Real-Time Notification System

**Challenge**: Users needed instant updates when books became available or loans were due, without constantly polling the server.

**Solution**: Implemented **SignalR** hub with connection management and automatic reconnection:

```csharp
// Server-side hub with user group management
public class NotificationHub : Hub
{
    public async Task JoinUserGroup(Guid userId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, userId.ToString());
    }
}

// Client-side automatic reconnection
signalRService.connection.onclose(async () => {
    await startConnection(); // Exponential backoff implemented
});
```

**Learning**: Discovered SignalR's connection lifecycle management and the importance of handling reconnection scenarios in production applications.

---

### 2. JWT Authentication with Refresh Token Flow

**Challenge**: Balance security (short-lived tokens) with user experience (don't force frequent re-login).

**Solution**: Implemented refresh token rotation pattern:

```csharp
// Token generation with refresh token
var (accessToken, refreshToken) = GenerateTokens(user);

// Automatic token refresh on 401 responses
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      const newToken = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    }
  }
);
```

**Key Learning**: Understanding token-based authentication patterns and implementing secure token storage in both backend (database) and frontend (localStorage with XSS considerations).

---

### 3. Password Reset with Email Verification

**Challenge**: Implement secure password reset without SMS infrastructure.

**Solution**: Built 6-digit code verification system with time-based expiry:

```csharp
// Secure code generation with expiry
private static string GenerateResetCode() => 
    new Random().Next(100000, 999999).ToString();

// In-memory storage with TTL (15 minutes)
_resetCodes[email] = new ResetCodeData {
    Code = code,
    ExpiryTime = DateTime.UtcNow.AddMinutes(15)
};
```

**Implementation Details**:
- Professional HTML email templates with inline CSS
- Multi-step wizard UI with progress indicators
- Security: No user enumeration (same response for existing/non-existing emails)

**Production Consideration**: Noted that in-memory storage should be replaced with Redis for distributed deployments.

---

### 4. QR Code Integration for Loan Management

**Challenge**: Speed up checkout/return process and reduce manual data entry errors.

**Solution**: Integrated **ZXing.Net** for dynamic QR code generation:

```csharp
// Generate QR code encoding ISBN + due date
var qrData = $"{loan.Book.ISBN}|{loan.DueDate:yyyy-MM-dd}";
var writer = new BarcodeWriter {
    Format = BarcodeFormat.QR_CODE,
    Options = new QrCodeEncodingOptions {
        Height = 300, Width = 300, Margin = 1
    }
};
var qrBitmap = writer.Write(qrData);
```

**Learning**: Understanding barcode standards and the importance of data validation when scanning QR codes at physical kiosks.

---

### 5. Role-Based Access Control (RBAC)

**Challenge**: Different user types (Admin, Librarian, Patron) need different permissions across the application.

**Solution**: Implemented comprehensive RBAC with enum-based roles:

```csharp
// Backend authorization attributes
[Authorize(Roles = "Admin,Librarian")]
public async Task<ActionResult> GetAllLoans() { }

// Frontend role checks
const { isAdmin, isLibrarian } = useAuth();
const canManageBooks = isAdmin || isLibrarian;
```

**Key Implementation**:
- Role stored in JWT claims for stateless validation
- Frontend UI adapts based on user role (conditional rendering)
- Backend enforces authorization at controller level

**Learning**: Discovered the difference between authentication (who you are) and authorization (what you can do), and implemented both correctly.

---

### 6. Sustainability Tracking & Analytics

**Challenge**: Calculate environmental impact of library usage to promote eco-friendly reading habits.

**Solution**: Built carbon footprint calculator using industry standards:

```csharp
// Calculate environmental savings
public async Task<EcoImpactDto> GetEcoImpact()
{
    var totalLoans = await _context.Loans.CountAsync();
    
    return new EcoImpactDto {
        TreesSaved = totalLoans * 0.02, // Industry standard: 50 books = 1 tree
        WaterLitersSaved = totalLoans * 30, // Paper manufacturing water usage
        CO2Reduced = totalLoans * 2.5 // kg CO2 per new book
    };
}
```

**Features**:
- Real-time analytics dashboard with **Recharts** visualizations
- Most borrowed books tracking
- Genre popularity trends
- Environmental impact metrics

**Learning**: Integrating third-party charting libraries and designing meaningful data aggregations for business insights.

---

### 7. Voice Search Integration

**Challenge**: Improve accessibility and user experience for hands-free searching.

**Solution**: Integrated **Web Speech API** with fallback handling:

```javascript
const recognition = new webkitSpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  setSearchQuery(transcript);
  searchBooks(transcript);
};
```

**Learning**: Browser API compatibility issues and the importance of progressive enhancement for accessibility features.

---

## 🚧 Challenges Overcome

### Challenge 1: SignalR CORS Configuration

**Problem**: SignalR connections failing with CORS errors in production.

**Root Cause**: Missing CORS configuration for WebSocket upgrade requests.

**Solution**:
```csharp
app.UseCors(policy => policy
    .WithOrigins("http://localhost:5173")
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials()); // Critical for SignalR

app.MapHub<NotificationHub>("/hubs/notifications");
```

**Learning**: WebSocket connections require `AllowCredentials()` for cookie-based authentication.

---

### Challenge 2: Entity Framework Navigation Property Loading

**Problem**: `NullReferenceException` when accessing `loan.Book.Title` despite data existing in database.

**Root Cause**: EF Core lazy loading not configured; navigation properties not explicitly loaded.

**Solution**:
```csharp
// Explicit eager loading
var loans = await _context.Loans
    .Include(l => l.Book)
    .Include(l => l.User)
    .Where(l => l.Status == LoanStatus.Active)
    .ToListAsync();
```

**Learning**: Understanding EF Core's loading strategies (lazy, eager, explicit) and when to use each.

---

### Challenge 3: Enum Serialization Between Backend & Frontend

**Problem**: Backend sends enum as number (0, 1, 2), frontend expects string ("Admin", "Librarian", "Patron").

**Solution**: Implemented enum mapping in AuthContext:
```javascript
const UserRole = {
  0: 'Patron',
  1: 'Librarian',
  2: 'Admin'
};

const normalizeUser = (userData) => {
  if (typeof userData.role === 'number') {
    userData.role = UserRole[userData.role] || 'Patron';
  }
  return userData;
};
```

**Learning**: Data transformation strategies and the importance of consistent data contracts between layers.

---

### Challenge 4: React State Management for Multi-Step Forms

**Problem**: Password reset flow with 4 steps losing state on navigation.

**Solution**: Centralized state management with validation:
```javascript
const [step, setStep] = useState(1);
const [formData, setFormData] = useState({
  email: '',
  code: '',
  newPassword: '',
  confirmPassword: ''
});

// Preserve state across steps
const handleNextStep = () => {
  if (validateCurrentStep()) {
    setStep(prev => prev + 1);
  }
};
```

**Learning**: React state management patterns and component lifecycle optimization.

---

### Challenge 5: File Upload & Storage for Book Covers

**Problem**: Storing book cover images efficiently without increasing database size.

**Solution**: Used external URLs (Open Library API) with fallback:
```javascript
const coverUrl = book.coverUrl || 
  `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;
```

**Production Alternative Considered**: AWS S3 for file storage with CloudFront CDN.

**Learning**: Evaluating trade-offs between local storage, external APIs, and cloud services.

---

## 🎨 UI/UX Design Decisions

### Premium Light Theme

**Design Philosophy**: Professional, accessible, and deployment-ready.

**Color Palette**:
- Primary: `#2563eb` (Blue-600) - Trust, professionalism
- Success: `#059669` (Emerald-600) - Positive actions
- Warning: `#ca8a04` (Yellow-600) - Attention needed
- Error: `#dc2626` (Red-600) - Critical alerts
- Neutrals: Gray scale (50, 100, 200, 600, 900)

**Typography**:
- Headings: `SF Pro Display` / System font stack
- Body: `Inter` - Clean, readable, professional
- Monospace: `Courier New` - For codes, ISBNs

**Component Library Approach**:
- Tailwind utility classes for rapid development
- Consistent spacing scale (4px base unit)
- Reusable button variants (primary, secondary, accent)
- Card-based layouts for content hierarchy

**Accessibility Considerations**:
- WCAG AA contrast ratios (4.5:1 for text)
- Keyboard navigation support
- Screen reader friendly labels
- Focus indicators on interactive elements

---

## 📊 Database Schema Design

### Entity Relationship Diagram

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│    Users    │         │    Books    │         │    Loans    │
├─────────────┤         ├─────────────┤         ├─────────────┤
│ Id (PK)     │────┐    │ Id (PK)     │────┐    │ Id (PK)     │
│ Name        │    │    │ Title       │    │    │ UserId (FK) │
│ Email       │    │    │ Author      │    │    │ BookId (FK) │
│ PasswordHash│    │    │ ISBN        │    │    │ CheckoutDate│
│ Role        │    │    │ Genre       │    │    │ DueDate     │
│ RefreshToken│    │    │ CoverUrl    │    │    │ ReturnDate  │
└─────────────┘    │    │ TotalCopies │    │    │ Status      │
                   │    │ Available   │    │    │ QRCode      │
                   │    └─────────────┘    │    └─────────────┘
                   │                       │
                   │    ┌─────────────┐   │
                   └────│Reservations │───┘
                        ├─────────────┤
                        │ Id (PK)     │
                        │ UserId (FK) │
                        │ BookId (FK) │
                        │ Date        │
                        │ Status      │
                        └─────────────┘
```

### Key Design Decisions

1. **Guid Primary Keys**: Better for distributed systems and prevents enumeration attacks
2. **Soft Deletes**: `IsDeleted` flag instead of hard deletes for audit trail
3. **Timestamps**: `CreatedAt`, on all entities for tracking
4. **Indexes**: On foreign keys, email (for lookups), ISBN (for searches)
5. **Enum Storage**: Stored as integers with lookup tables for performance

---

## 🔒 Security Implementation

### 1. Authentication & Authorization
- ✅ **Bcrypt Password Hashing** (work factor: 12)
- ✅ **JWT with RS256** asymmetric signing
- ✅ **Refresh Token Rotation** (one-time use)
- ✅ **HTTPS Enforcement** in production
- ✅ **CORS Policy** restricting origins

### 2. Input Validation
- ✅ **DTO Validation** with DataAnnotations
- ✅ **SQL Injection Prevention** via EF Core parameterization
- ✅ **XSS Protection** through React's automatic escaping
- ✅ **CSRF Tokens** for state-changing operations

### 3. Rate Limiting (Planned)
- Password reset: 5 requests/hour per email
- Login attempts: 5 attempts/15 minutes
- API endpoints: 100 requests/minute per user

### 4. Data Privacy
- ✅ Passwords never logged or exposed in responses
- ✅ Email verification for password reset
- ✅ User data access restricted by role
- ✅ Sensitive configuration in environment variables

---

## 📚 What I Learned

### Technical Skills Developed

**Backend Development**:
- Clean Architecture implementation in .NET
- Entity Framework Core relationships and migrations
- SignalR real-time communication patterns
- JWT authentication with refresh tokens
- Dependency Injection and service lifetime management
- Background services for scheduled tasks

**Frontend Development**:
- React hooks (useState, useEffect, useContext, useCallback)
- Custom hook creation for reusable logic
- React Router navigation and route protection
- Axios interceptors for global error handling
- SignalR client integration and connection management
- Tailwind CSS utility-first design system

**DevOps & Deployment**:
- Docker containerization with multi-stage builds
- Docker Compose for local development environments
- PostgreSQL database administration
- Environment-based configuration management
- API documentation with Swagger/OpenAPI

### Soft Skills Enhanced

1. **Problem Decomposition**: Breaking complex features (like real-time notifications) into smaller, manageable tasks
2. **Debugging Methodology**: Systematic approach to identifying issues (reproduce → isolate → hypothesize → test)
3. **Documentation**: Writing clear commit messages, code comments, and architectural decision records
4. **Time Management**: Prioritizing features based on business value vs. implementation complexity

### Key Insights

💡 **Architecture Matters**: Investing time upfront in clean architecture saved hours during feature additions

💡 **Type Safety**: TypeScript would have caught many runtime errors caught during testing

💡 **Testing**: Unit tests for business logic and integration tests for APIs would increase confidence in deployments

💡 **Performance**: Database indexes and query optimization are critical for scalability

💡 **User Experience**: Small details (loading states, error messages, animations) significantly impact perceived quality

---

## 🛠️ Technology Stack

### Backend
| Technology | Purpose | Why Chosen |
|-----------|---------|------------|
| ASP.NET Core 8 | Web API Framework | High performance, cross-platform, mature ecosystem |
| Entity Framework Core | ORM | Simplifies database operations, supports migrations |
| PostgreSQL | Database | ACID compliance, JSON support, open-source |
| SignalR | Real-time Communication | Built-in .NET library, WebSocket fallback |
| ZXing.Net | QR Code Generation | Industry standard, well-documented |
| JWT | Authentication | Stateless, scalable, standard-compliant |
| Swagger | API Documentation | Interactive testing, auto-generated from code |

### Frontend
| Technology | Purpose | Why Chosen |
|-----------|---------|------------|
| React 18 | UI Library | Component reusability, large ecosystem, virtual DOM |
| Tailwind CSS | Styling | Utility-first approach, no CSS bloat, rapid development |
| React Router | Navigation | Standard for React SPAs, code splitting support |
| Axios | HTTP Client | Interceptor support, automatic JSON transformation |
| Recharts | Data Visualization | React-native, responsive, declarative API |
| Lucide React | Icons | Modern, consistent, tree-shakeable |

### Development Tools
- **Visual Studio 2022** - Backend development with debugging
- **VS Code** - Frontend development with ESLint, Prettier
- **Postman** - API testing and collection management
- **Git** - Version control with feature branching
- **Docker Desktop** - Local containerization

---

## 📂 Project Structure

```
LibraryManagement/
│
├── LibraryManagement.API/              # 🌐 Presentation Layer
│   ├── Controllers/                    # REST API endpoints
│   │   ├── AuthController.cs          # Auth, login, password reset
│   │   ├── BooksController.cs         # Book CRUD operations
│   │   ├── LoansController.cs         # Loan management, QR codes
│   │   ├── AnalyticsController.cs     # Dashboard data
│   │   └── SustainabilityController.cs # Eco-impact metrics
│   ├── Hubs/
│   │   └── NotificationHub.cs         # SignalR real-time hub
│   ├── Middleware/
│   │   └── ExceptionHandlingMiddleware.cs  # Global error handling
│   ├── Program.cs                     # App configuration, DI setup
│   └── appsettings.json              # Configuration (DB, JWT, Email)
│
├── LibraryManagement.Core/             # 🎯 Business Logic Layer
│   ├── Entities/                      # Domain models
│   │   ├── User.cs                   # User entity with roles
│   │   ├── Book.cs                   # Book entity with inventory
│   │   ├── Loan.cs                   # Loan with status tracking
│   │   └── Reservation.cs            # Waitlist management
│   ├── DTOs/                         # Data transfer objects
│   │   ├── AuthDtos.cs               # Login, register requests
│   │   ├── BookDtos.cs               # Book request/response models
│   │   └── PasswordResetDtos.cs      # Password reset flow
│   ├── Interfaces/                    # Contracts (abstractions)
│   │   ├── IAuthService.cs
│   │   ├── IBookRepository.cs
│   │   ├── IEmailService.cs
│   │   └── IPasswordResetService.cs
│   └── Enums/
│       ├── UserRole.cs               # Admin, Librarian, Patron
│       └── LoanStatus.cs             # Active, Returned, Overdue
│
├── LibraryManagement.Infrastructure/   # 🔧 Data Access Layer
│   ├── Data/
│   │   ├── AppDbContext.cs          # EF Core DbContext
│   │   └── DatabaseSeeder.cs         # Initial data seeding
│   ├── Repositories/                  # Repository pattern implementations
│   │   ├── UserRepository.cs
│   │   ├── BookRepository.cs
│   │   └── LoanRepository.cs
│   ├── Services/                      # Infrastructure services
│   │   ├── AuthService.cs            # JWT generation, validation
│   │   ├── EmailService.cs           # SMTP email sending
│   │   ├── PasswordResetService.cs   # Code generation & verification
│   │   └── QRCodeService.cs          # QR code generation
│   └── Migrations/                    # EF Core database migrations
│
└── library-frontend/                   # ⚛️ React Frontend
    ├── src/
    │   ├── components/
    │   │   ├── Auth/
    │   │   │   ├── Login.jsx         # Login form with demo credentials
    │   │   │   └── ForgotPassword.jsx # Multi-step password reset
    │   │   ├── Dashboard/
    │   │   │   └── Dashboard.jsx      # Role-based dashboard
    │   │   ├── Books/
    │   │   │   └── BookCatalog.jsx    # Search, filter, CRUD
    │   │   ├── Loans/
    │   │   │   └── LoansPage.jsx      # Loan management, QR modal
    │   │   ├── Analytics/
    │   │   │   └── AnalyticsPage.jsx  # Charts and metrics
    │   │   ├── Layout/
    │   │   │   └── Layout.jsx         # Sidebar, navbar, footer
    │   │   └── LandingPage.jsx        # Marketing homepage
    │   ├── context/
    │   │   └── AuthContext.jsx        # Global auth state
    │   ├── services/
    │   │   ├── api.js                 # Axios configuration & endpoints
    │   │   └── signalr.js             # SignalR client connection
    │   ├── App.jsx                    # Router configuration
    │   └── main.jsx                   # React entry point
    ├── public/
    │   └── index.html
    ├── package.json
    └── tailwind.config.js             # Tailwind CSS configuration
```

---

## 🎯 Key Features Breakdown

### 1. Authentication & Authorization ✅
- User registration with email verification
- Secure login with JWT tokens
- Refresh token rotation for security
- Password reset via email (6-digit code)
- Role-based access control (Admin, Librarian, Patron)
- Protected routes in frontend

### 2. Book Management ✅
- Complete CRUD operations
- Search by title, author, ISBN, genre
- Voice search integration (Web Speech API)
- Cover image URLs from Open Library API
- Inventory tracking (total copies, available)
- Genre categorization (Fiction, Science, History, etc.)

### 3. Loan Management ✅
- Checkout books with due date calculation
- Return books with overdue detection
- QR code generation for each loan (ISBN + due date)
- Loan status tracking (Active, Returned, Overdue)
- User loan history
- Librarian view of all active loans

### 4. Real-Time Notifications ✅
- SignalR WebSocket connection
- Instant notifications for:
  - Book availability
  - Due date reminders
  - Overdue notices
  - Reservation ready alerts
- Toast notifications with auto-dismiss
- Connection recovery on disconnect

### 5. Analytics & Insights ✅
- Dashboard summary (total books, users, loans)
- Most borrowed books (bar chart)
- Genre popularity trends (pie chart)
- Borrowing patterns over time
- User activity metrics
- Librarian/Admin only access

### 6. Sustainability Tracking ✅
- Environmental impact calculator
- Trees saved from library usage
- Water consumption reduction
- CO2 emissions avoided
- Carbon footprint calculator
- Eco-friendly tips for users

### 7. Email Notifications ✅
- Password reset codes
- Loan due reminders
- Overdue notifications
- Book return confirmations
- Professional HTML templates
- SMTP integration (Gmail)

### 8. Premium UI/UX ✅
- Light theme with blue accent color
- Responsive design (mobile, tablet, desktop)
- Loading states and skeleton screens
- Error handling with user-friendly messages
- Smooth animations and transitions
- Accessible keyboard navigation

---

## 🔮 Future Enhancements

### Short-Term (Production Ready)
- [ ] **Unit Tests**: xUnit for backend services, Jest for React components
- [ ] **Integration Tests**: Test database with TestContainers
- [ ] **CI/CD Pipeline**: GitHub Actions for automated testing & deployment
- [ ] **Redis Integration**: Replace in-memory reset codes with distributed cache
- [ ] **Rate Limiting**: Protect API endpoints from abuse
- [ ] **Logging**: Serilog with structured logging to file/database
- [ ] **Health Checks**: `/health` endpoint for monitoring

### Medium-Term (Enhanced Features)
- [ ] **Book Reservations**: Waitlist when books are unavailable
- [ ] **Fine Calculation**: Automated overdue fine calculation
- [ ] **PDF Reports**: Generate borrowing history reports
- [ ] **Multi-Language**: i18n support (English, Spanish, French)
- [ ] **Dark Mode**: Theme toggle in user settings
- [ ] **Advanced Search**: Filters by publication date, language, rating
- [ ] **Book Reviews**: User ratings and reviews system

### Long-Term (Advanced Features)
- [ ] **ML Recommendations**: ML.NET for personalized book suggestions
- [ ] **Mobile App**: React Native app for QR scanning
- [ ] **Barcode Scanner**: Physical barcode integration
- [ ] **E-Book Integration**: Link to digital book libraries
- [ ] **Microservices**: Split into Auth, Books, Loans, Analytics services
- [ ] **GraphQL API**: Alternative to REST for flexible queries
- [ ] **Elasticsearch**: Advanced full-text search capabilities

---

## 🚀 Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL 16](https://www.postgresql.org/)
- [Git](https://git-scm.com/)

### Quick Start (Local Development)

#### 1. Clone Repository

```bash
git clone https://github.com/yourusername/library-os.git
cd library-os
```

#### 2. Database Setup

**Option A: Docker (Recommended)**

```bash
docker run -d \
  --name library-postgres \
  -e POSTGRES_DB=librarydb \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:16-alpine
```

**Option B: Local PostgreSQL**

```sql
CREATE DATABASE librarydb;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE librarydb TO postgres;
```

#### 3. Backend Setup

```bash
cd LibraryManagement.API

# Update connection string in appsettings.json if needed
# "DefaultConnection": "Host=localhost;Database=librarydb;Username=postgres;Password=postgres"

# Install dependencies
dotnet restore

# Apply migrations
dotnet ef database update

# Run seeder (creates admin, librarian, patron users + 30 books)
dotnet run

# API: https://localhost:7090/
# Swagger: https://localhost:7090/swagger
```

#### 4. Frontend Setup

```bash
cd library-frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=https://localhost:7090/api" > .env

# Start development server
npm run dev

# Frontend: http://localhost:5173
```

#### 5. Test the Application

**Demo Credentials:**
- **Admin**: `admin@library.com` / `Admin123!`
- **Librarian**: `librarian@library.com` / `Librarian123!`
- **Patron**: `patron@library.com` / `Patron123!`

**Test Features:**
1. Login with patron account
2. Search for books using voice search
3. Checkout a book
4. View QR code for loan
5. Check analytics dashboard (requires admin/librarian)
6. Test password reset flow
7. Return a book
8. View sustainability metrics

---

## 📖 API Documentation

### Swagger/OpenAPI

Interactive API documentation available at: `https://localhost:7090/swagger`

**Features**:
- Try-it-out functionality for all endpoints
- Request/response schemas
- Authentication with Bearer token
- Example requests and responses

### Authentication Flow

```bash
# 1. Register a new userttp://localhost:5000/
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}

# 2. Login to get tokens
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

# Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "a8f5f167f44f4964e6c998dee827110c",
  "user": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Patron"
  }
}

# 3. Use token in subsequent requests
GET /api/books
Headers: { "Authorization": "Bearer eyJhbGciOiJIUzI1NiIs..." }
```

---

## 🧪 Testing

### Manual Testing Checklist

**Authentication**:
- [ ] User registration
- [ ] User login
- [ ] Token refresh
- [ ] Password reset flow
- [ ] Role-based access

**Book Management**:
- [ ] List all books
- [ ] Search books
- [ ] Create book (admin/librarian)
- [ ] Update book
- [ ] Delete book (admin)

**Loan Management**:
- [ ] Checkout book
- [ ] View my loans
- [ ] View all loans (librarian)
- [ ] Return book
- [ ] Generate QR code

**Real-Time Features**:
- [ ] Receive notifications
- [ ] SignalR reconnection

**UI/UX**:
- [ ] Responsive design on mobile
- [ ] Form validation
- [ ] Loading states
- [ ] Error handling

### Automated Testing (To Be Implemented)

```csharp
// Example unit test
[Fact]
public async Task CreateBook_WithValidData_ReturnsBook()
{
    // Arrange
    var book = new CreateBookDto {
        Title = "Clean Code",
        Author = "Robert Martin",
        ISBN = "9780132350884"
    };
    
    // Act
    var result = await _bookService.CreateAsync(book);
    
    // Assert
    Assert.NotNull(result);
    Assert.Equal(book.Title, result.Title);
}
```

---

## 🎓 Learning Resources Used

### Documentation
- [ASP.NET Core Docs](https://docs.microsoft.com/aspnet/core)
- [Entity Framework Core Docs](https://docs.microsoft.com/ef/core)
- [React Documentation](https://react.dev)
- [SignalR Tutorial](https://docs.microsoft.com/aspnet/core/signalr/introduction)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)



### Community
- Stack Overflow for specific issues
- Reddit r/dotnet, r/reactjs
- GitHub discussions on library issues

---

## 👤 Author

**Your Name**
- LinkedIn: [LinkedIn](https://www.linkedin.com/in/kwanele-ntshangase-abab7037b/)
- Portfolio: [My Portfolio](https://dev-k99.github.io/Portfolio/)

---
---

## 🙏 Acknowledgments

- **Clean Architecture** principles by Robert C. Martin
- **Material Design** guidelines for UI/UX inspiration
- **Open Library** for book cover API
- **ZXing** team for QR code library
- **SignalR** team at Microsoft for real-time communication
- **Tailwind CSS** team for utility-first CSS framework

---

## 📞 Contact & Support

**Questions or Issues?**
- Email: kwanelerh069@gmail.com

**Want to Contribute?**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

<div align="center">

**Built with ❤️ for modern libraries**

⭐ Star this repo if you find it helpful!

</div>
