# VacationPlan Backend API - C# .NET

> Backend API for Trip Itinerary Manager built with ASP.NET Core and Entity Framework Core

## Overview

This is a C# .NET implementation of the VacationPlan backend API, providing the same functionality as the Node.js version with:

- **ASP.NET Core 8.0** Web API
- **Entity Framework Core** with PostgreSQL
- **JWT Authentication** for secure API access
- **Clean Architecture** pattern (API → Core → Infrastructure)
- **RESTful API** design with comprehensive validation

## Architecture

```
backend-dotnet/
├── VacationPlan.API/           # Web API Layer (Controllers, Middleware)
├── VacationPlan.Core/          # Domain Layer (Models, Interfaces, DTOs)
├── VacationPlan.Infrastructure/# Data Layer (DbContext, Repositories)
├── VacationPlan.Tests/         # Unit & Integration Tests
└── VacationPlan.sln            # Solution File
```

## Technology Stack

- **.NET 8.0** - Latest LTS framework
- **ASP.NET Core** - Web API framework
- **Entity Framework Core 8.0** - ORM for PostgreSQL
- **Npgsql** - PostgreSQL provider
- **JWT Bearer Authentication** - Secure API access
- **FluentValidation** - Request validation
- **Serilog** - Structured logging
- **Swagger/OpenAPI** - API documentation
- **xUnit** - Testing framework

## Prerequisites

- **.NET 8.0 SDK** or later
- **PostgreSQL 14+**
- **Visual Studio 2022** or **VS Code** with C# extension
- **Docker** (optional, for containerized deployment)

## Getting Started

### 1. Clone and Navigate

```bash
cd backend-dotnet
```

### 2. Configure Database

Create `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=vacation_plan;Username=postgres;Password=yourpassword"
  },
  "JwtSettings": {
    "Secret": "your-secret-key-min-32-chars-long",
    "Issuer": "VacationPlan",
    "Audience": "VacationPlanAPI",
    "ExpirationMinutes": 60
  }
}
```

### 3. Database Migration

```bash
# From VacationPlan.API directory
dotnet ef database update
```

### 4. Run the Application

```bash
dotnet run --project VacationPlan.API
```

API will be available at:
- **HTTPS**: `https://localhost:7001`
- **HTTP**: `http://localhost:5001`
- **Swagger UI**: `https://localhost:7001/swagger`

## API Endpoints

Same endpoints as Node.js version:

### Health Check
- `GET /health` - API health status

### Itineraries
- `GET /api/v1/itineraries` - List user's itineraries
- `POST /api/v1/itineraries` - Create new itinerary
- `GET /api/v1/itineraries/{id}` - Get single itinerary
- `PUT /api/v1/itineraries/{id}` - Update itinerary
- `DELETE /api/v1/itineraries/{id}` - Delete itinerary

### Itinerary Items
- `GET /api/v1/itineraries/{id}/items` - List items for itinerary
- `POST /api/v1/itineraries/{id}/items` - Add item to itinerary
- `PUT /api/v1/items/{id}` - Update item
- `DELETE /api/v1/items/{id}` - Delete item
- `POST /api/v1/items/bulk` - Bulk operations (reorder, delete)

## Project Structure

### VacationPlan.API
Web API layer with controllers, middleware, and startup configuration.

```
VacationPlan.API/
├── Controllers/
│   ├── HealthController.cs
│   ├── ItinerariesController.cs
│   └── ItemsController.cs
├── Middleware/
│   ├── ErrorHandlingMiddleware.cs
│   ├── RateLimitingMiddleware.cs
│   └── RequestLoggingMiddleware.cs
├── Program.cs
└── appsettings.json
```

### VacationPlan.Core
Domain models, DTOs, interfaces, and business logic.

```
VacationPlan.Core/
├── Models/
│   ├── User.cs
│   ├── Itinerary.cs
│   └── ItineraryItem.cs
├── DTOs/
│   ├── CreateItineraryDto.cs
│   ├── UpdateItineraryDto.cs
│   └── ...
├── Interfaces/
│   ├── IItineraryRepository.cs
│   └── IItemRepository.cs
└── Validators/
    ├── CreateItineraryValidator.cs
    └── ...
```

### VacationPlan.Infrastructure
Data access, repositories, and external service integrations.

```
VacationPlan.Infrastructure/
├── Data/
│   ├── VacationPlanDbContext.cs
│   └── Configurations/
├── Repositories/
│   ├── ItineraryRepository.cs
│   └── ItemRepository.cs
└── Migrations/
```

## Development

### Build Solution

```bash
dotnet build
```

### Run Tests

```bash
dotnet test
```

### Create Migration

```bash
dotnet ef migrations add MigrationName --project VacationPlan.Infrastructure --startup-project VacationPlan.API
```

### Code Formatting

```bash
dotnet format
```

## Docker Support

### Build Image

```bash
docker build -t vacation-plan-dotnet -f VacationPlan.API/Dockerfile .
```

### Run Container

```bash
docker run -p 5001:80 -e ConnectionStrings__DefaultConnection="Host=host.docker.internal;Port=5432;Database=vacation_plan;Username=postgres;Password=yourpassword" vacation-plan-dotnet
```

## Configuration

### Environment Variables

- `ASPNETCORE_ENVIRONMENT` - Environment (Development, Staging, Production)
- `ConnectionStrings__DefaultConnection` - PostgreSQL connection string
- `JwtSettings__Secret` - JWT signing key
- `JwtSettings__ExpirationMinutes` - Token expiration time

## Security Features

- **JWT Authentication** - Bearer token authentication
- **Rate Limiting** - 100 requests per 15 minutes
- **CORS** - Configurable cross-origin policies
- **HTTPS Enforcement** - Redirect HTTP to HTTPS in production
- **Input Validation** - FluentValidation for all requests
- **SQL Injection Prevention** - Entity Framework parameterized queries

## Performance

- **Async/Await** - All I/O operations are asynchronous
- **Database Connection Pooling** - Managed by Npgsql
- **Response Caching** - HTTP cache headers
- **Pagination** - Efficient data loading

## Testing

```bash
# Run all tests
dotnet test

# Run with coverage
dotnet test /p:CollectCoverage=true /p:CoverageReporter=html

# Run specific test class
dotnet test --filter FullyQualifiedName~ItineraryControllerTests
```

## Deployment

### Azure App Service

```bash
az webapp up --name vacation-plan-api --runtime "DOTNET|8.0"
```

### AWS Elastic Beanstalk

```bash
eb init -p docker vacation-plan-api
eb create vacation-plan-env
```

## Monitoring

- **Serilog** - Structured logging to console, file, and external services
- **Health Checks** - `/health` endpoint for monitoring
- **Metrics** - Custom metrics via Application Insights (optional)

## Comparison with Node.js Version

| Feature | Node.js | C# .NET |
|---------|---------|----------|
| Framework | Express.js | ASP.NET Core |
| Language | JavaScript | C# |
| ORM | pg (raw SQL) | Entity Framework Core |
| Validation | Custom | FluentValidation |
| Testing | Jest | xUnit |
| Type Safety | JavaScript | Strong typing |
| Performance | Good | Excellent |
| Ecosystem | npm | NuGet |

## Contributing

Same contribution guidelines as the main project.

## License

MIT License - Same as Node.js backend

## Support

For issues or questions:
- Check the [API Documentation](../backend/docs/API.md)
- Open an issue on GitHub
- Contact the development team
