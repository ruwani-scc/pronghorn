# VacationPlan SQL Database Project

This is a SQL Server Database Project containing the complete database schema for the VacationPlan application.

## Overview

This project contains all database objects including:
- Table definitions with constraints
- Indexes for performance optimization
- Foreign key relationships
- Check constraints for data validation
- Seed data for development/testing

## Database Schema

### Tables

#### 1. users
Stores user account information with external authentication.

**Columns:**
- `id` (UNIQUEIDENTIFIER, PK) - User unique identifier
- `email` (NVARCHAR(255), UNIQUE) - User email address
- `auth_provider_id` (NVARCHAR(255), UNIQUE) - External auth provider ID (e.g., Auth0)
- `created_at` (DATETIME2) - Record creation timestamp
- `updated_at` (DATETIME2) - Record last update timestamp

**Indexes:**
- Primary key on `id`
- Unique constraints on `email` and `auth_provider_id`
- Non-clustered indexes on `email` and `auth_provider_id`

#### 2. itineraries
Stores trip itineraries with basic information.

**Columns:**
- `id` (UNIQUEIDENTIFIER, PK) - Itinerary unique identifier
- `user_id` (UNIQUEIDENTIFIER, FK) - Reference to users table
- `title` (NVARCHAR(255)) - Itinerary title
- `destination` (NVARCHAR(255)) - Trip destination
- `start_date` (DATE) - Trip start date
- `end_date` (DATE) - Trip end date
- `description` (NVARCHAR(MAX)) - Itinerary description
- `created_at` (DATETIME2) - Record creation timestamp
- `updated_at` (DATETIME2) - Record last update timestamp

**Constraints:**
- Foreign key to `users` table with CASCADE delete
- Check constraint: `end_date >= start_date`

**Indexes:**
- Primary key on `id`
- Non-clustered index on `user_id`
- Composite index on `start_date, end_date`
- Non-clustered index on `created_at` (descending)

#### 3. itinerary_items
Stores individual items within an itinerary (accommodations, activities, transport).

**Columns:**
- `id` (UNIQUEIDENTIFIER, PK) - Item unique identifier
- `itinerary_id` (UNIQUEIDENTIFIER, FK) - Reference to itineraries table
- `category` (NVARCHAR(50)) - Item category: 'accommodation', 'activity', or 'transport'
- `title` (NVARCHAR(255)) - Item title
- `description` (NVARCHAR(MAX)) - Item description
- `start_datetime` (DATETIME2) - Item start date/time
- `end_datetime` (DATETIME2) - Item end date/time
- `location` (NVARCHAR(255)) - Item location
- `confirmation_code` (NVARCHAR(100)) - Booking confirmation code
- `cost` (DECIMAL(10,2)) - Item cost
- `currency` (NVARCHAR(3)) - Currency code (default: 'USD')
- `metadata` (NVARCHAR(MAX)) - JSON metadata for category-specific fields
- `display_order` (INT) - Display order within itinerary (default: 0)
- `is_completed` (BIT) - Completion status (default: 0)
- `created_at` (DATETIME2) - Record creation timestamp
- `updated_at` (DATETIME2) - Record last update timestamp

**Constraints:**
- Foreign key to `itineraries` table with CASCADE delete
- Check constraint: `category IN ('accommodation', 'activity', 'transport')`

**Indexes:**
- Primary key on `id`
- Non-clustered index on `itinerary_id`
- Non-clustered index on `category`
- Composite index on `itinerary_id, display_order`
- Filtered index on `start_datetime` (where not null)
- Composite index on `itinerary_id, is_completed`

## Relationships

```
users (1) -----> (*) itineraries (1) -----> (*) itinerary_items
```

- One user can have many itineraries
- One itinerary can have many items
- Cascade delete: deleting a user deletes all their itineraries and items
- Cascade delete: deleting an itinerary deletes all its items

## Building and Deploying

### Prerequisites
- SQL Server Data Tools (SSDT) or Visual Studio with SQL Server tooling
- SQL Server 2019 or later (or Azure SQL Database)

### Build the Project

1. Open the solution in Visual Studio
2. Right-click on `VacationPlan.Database` project
3. Select "Build"

### Deploy to Database

#### Using Visual Studio
1. Right-click on `VacationPlan.Database` project
2. Select "Publish"
3. Configure connection string
4. Click "Publish"

#### Using SqlPackage CLI
```bash
SqlPackage.exe /Action:Publish \
  /SourceFile:"VacationPlan.Database.dacpac" \
  /TargetConnectionString:"Server=localhost;Database=VacationPlanDb;Integrated Security=true;"
```

#### Using SQL Server Management Studio (SSMS)
1. Build the project to generate `.dacpac` file
2. In SSMS, right-click on "Databases"
3. Select "Deploy Data-tier Application"
4. Follow the wizard to deploy the `.dacpac` file

## Connection String

Example connection string for the application:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=VacationPlanDb;Integrated Security=true;TrustServerCertificate=true;"
  }
}
```

For Azure SQL Database:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=tcp:yourserver.database.windows.net,1433;Database=VacationPlanDb;User ID=yourusername;Password=yourpassword;Encrypt=true;"
  }
}
```

## Seed Data

The project includes a post-deployment script (`Scripts/PostDeployment/SeedData.sql`) that:
- Creates a test user account
- Creates a sample itinerary
- Populates sample itinerary items

**Note:** Seed data is only for development/testing. Remove or modify for production deployments.

## Entity Framework Core Integration

This database schema is designed to work with Entity Framework Core. The corresponding C# models are in the `VacationPlan.Core` project:

- `User.cs` → users table
- `Itinerary.cs` → itineraries table
- `ItineraryItem.cs` → itinerary_items table

The `VacationPlanDbContext` in `VacationPlan.Infrastructure` manages the EF Core configuration.

## Migrations

While this SQL project provides the complete schema, you can also use EF Core migrations:

```bash
# Add new migration
dotnet ef migrations add MigrationName --project VacationPlan.Infrastructure

# Update database
dotnet ef database update --project VacationPlan.Infrastructure
```

## Performance Considerations

- All foreign keys have corresponding indexes
- Composite indexes optimize common query patterns
- Filtered indexes reduce storage for nullable columns
- Cascade deletes eliminate orphaned records automatically

## Security

- No sensitive data stored in plain text
- Authentication handled by external provider
- Use parameterized queries to prevent SQL injection
- Apply principle of least privilege for database users

## Monitoring and Maintenance

- Monitor index fragmentation regularly
- Update statistics for optimal query performance
- Review execution plans for slow queries
- Consider partitioning for large datasets

## Version Control

This SQL project is tracked in source control alongside the application code, ensuring:
- Database schema versioning
- Team collaboration
- Deployment automation
- Rollback capability

## Support

For issues or questions related to the database schema, please refer to the main project documentation or contact the development team.
