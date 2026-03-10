# VacationPlan Backend API

> Backend API for Trip Itinerary Manager - A centralized application for managing trip itineraries with accommodations, activities, and transport.

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 13
- npm >= 9.0.0

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Configure your .env file with database credentials
```

### Database Setup

```bash
# Run migrations to create tables
npm run db:migrate

# Seed database with sample data (development only)
npm run db:seed

# Reset database (WARNING: Deletes all data)
npm run db:reset
```

### Running the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will start on `http://localhost:3000`

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # PostgreSQL connection configuration
├── controllers/
│   ├── ItineraryController.js  # Itinerary CRUD operations
│   └── ItemController.js       # Item CRUD operations
├── database/
│   ├── migrations/
│   │   └── 001_create_tables.sql  # Database schema
│   └── seeds/
│       └── seed_data.sql          # Sample data
├── middleware/
│   ├── authMiddleware.js    # JWT authentication
│   └── errorHandler.js      # Global error handling
├── routes/
│   ├── itineraryRoutes.js   # Itinerary endpoints
│   └── itemRoutes.js        # Item endpoints
├── scripts/
│   ├── migrate.js           # Migration runner
│   ├── seed.js              # Seed runner
│   └── reset.js             # Database reset
├── services/
│   ├── ItineraryService.js  # Itinerary data access
│   └── ItemService.js       # Item data access
├── tests/
│   └── setup.js             # Jest test setup
├── utils/
│   ├── CompletenessCalculator.js  # Progress tracking
│   └── ItineraryValidator.js      # Input validation
├── .env.example             # Environment template
├── .eslintrc.js             # ESLint configuration
├── .gitignore               # Git ignore rules
├── jest.config.js           # Jest configuration
├── package.json             # Dependencies and scripts
├── README.md                # This file
└── server.js                # Application entry point
```

## 🔌 API Endpoints

### Health Check

```
GET /health - Check API status
```

### Itineraries

```
GET    /api/v1/itineraries     - List user's itineraries
POST   /api/v1/itineraries     - Create new itinerary
GET    /api/v1/itineraries/:id - Get single itinerary
PUT    /api/v1/itineraries/:id - Update itinerary
DELETE /api/v1/itineraries/:id - Delete itinerary
```

### Itinerary Items

```
GET    /api/v1/itineraries/:id/items - List items for itinerary
POST   /api/v1/itineraries/:id/items - Add item to itinerary
PUT    /api/v1/items/:id              - Update item
DELETE /api/v1/items/:id              - Delete item
POST   /api/v1/items/bulk             - Bulk operations
```

### Authentication

All endpoints (except `/health`) require authentication via Bearer token:

```
Authorization: Bearer <jwt_token>
```

## 🧪 Testing

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode
npm run test:watch

# Run integration tests only
npm run test:integration
```

### Coverage Requirements

- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

## 🔧 Development

### Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

### Environment Variables

See `.env.example` for all available configuration options:

- **Database**: Connection settings for PostgreSQL
- **Authentication**: JWT and Auth0/Firebase configuration
- **Server**: Port and CORS settings
- **Monitoring**: Sentry and Datadog integration

## 🗄️ Database Schema

### Tables

- **users**: User accounts with external authentication
- **itineraries**: Trip itineraries with basic information
- **itinerary_items**: Detailed items (accommodations, activities, transport)

### Key Features

- UUID primary keys
- Automatic timestamps (created_at, updated_at)
- Cascade deletes for referential integrity
- Indexes for query optimization
- Check constraints for data validation

## 🏗️ Architecture

### Design Pattern: MVC with Service Layer

```
Request → Routes → Controllers → Services → Database
                       ↓
                   Validators
                   Utilities
```

### Key Components

- **Controllers**: Handle HTTP requests, validate input, return responses
- **Services**: Data access layer, database queries
- **Middleware**: Authentication, error handling
- **Utilities**: Validation, calculations, business logic

## 📊 Monitoring

### Error Tracking (Sentry)

- Automatic error capture
- Performance monitoring
- Release tracking

### APM (Datadog)

- API latency metrics
- Database query performance
- Custom metrics

## 🔐 Security

- JWT-based authentication
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- CORS configuration
- Helmet.js security headers
- Rate limiting (recommended for production)

## 🚢 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure database connection with SSL
- [ ] Set secure `JWT_SECRET`
- [ ] Configure external auth provider
- [ ] Set up Sentry error tracking
- [ ] Configure Datadog monitoring
- [ ] Enable rate limiting
- [ ] Set up database backups
- [ ] Configure CORS for frontend domain

### Docker Support (Coming Soon)

```bash
# Build image
docker build -t vacation-plan-backend .

# Run container
docker run -p 3000:3000 vacation-plan-backend
```

## 📝 API Documentation

Interactive API documentation available at `/api/docs` (when Swagger is enabled).

## 🤝 Contributing

1. Follow the code style (ESLint + Prettier)
2. Write tests for new features
3. Maintain >80% code coverage
4. Update documentation

## 📄 License

MIT License - See LICENSE file for details

## 🔗 Related Projects

- Frontend: VacationPlan Vue.js Application
- Documentation: [Plan.md](../Plan.md)

## 📞 Support

For issues and questions, please open a GitHub issue.

---

**Version**: 1.0.0  
**Last Updated**: 2024-01-15
