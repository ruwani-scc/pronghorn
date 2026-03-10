# VacationPlan API Documentation

## Base URL

```
http://localhost:3000/api/v1
```

## Authentication

All API endpoints (except `/health`) require authentication via Bearer token:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully" // Optional
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "errors": { // Optional validation errors
    "field_name": "Error description"
  }
}
```

## Endpoints

### Health Check

#### Check API Status

```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T12:00:00.000Z"
}
```

---

### Itineraries

#### List User's Itineraries

```http
GET /api/v1/itineraries
```

**Query Parameters:**
- `limit` (number, optional): Maximum number of results (default: 50)
- `offset` (number, optional): Offset for pagination (default: 0)
- `sortBy` (string, optional): Sort field (default: created_at)
- `sortOrder` (string, optional): Sort direction - ASC/DESC (default: DESC)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "title": "Summer Vacation 2024",
      "destination": "Paris, France",
      "start_date": "2024-07-01",
      "end_date": "2024-07-15",
      "description": "Two weeks in Paris",
      "created_at": "2024-01-15T12:00:00.000Z",
      "updated_at": "2024-01-15T12:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### Create Itinerary

```http
POST /api/v1/itineraries
```

**Request Body:**
```json
{
  "title": "Summer Vacation 2024",
  "destination": "Paris, France",
  "start_date": "2024-07-01",
  "end_date": "2024-07-15",
  "description": "Two weeks exploring Paris"
}
```

**Validation Rules:**
- `title`: Required, max 255 characters
- `destination`: Optional, max 255 characters
- `start_date`: Required, format YYYY-MM-DD
- `end_date`: Required, format YYYY-MM-DD, must be >= start_date
- `description`: Optional, max 5000 characters
- Trip duration: Max 365 days

**Response:** `201 Created`
```json
{
  "success": true,
  "data": { /* itinerary object */ },
  "message": "Itinerary created successfully"
}
```

#### Get Single Itinerary

```http
GET /api/v1/itineraries/:id
```

**Response:**
```json
{
  "success": true,
  "data": { /* itinerary object */ }
}
```

#### Update Itinerary

```http
PUT /api/v1/itineraries/:id
```

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "destination": "Updated Destination",
  "start_date": "2024-07-01",
  "end_date": "2024-07-20",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated itinerary */ },
  "message": "Itinerary updated successfully"
}
```

#### Delete Itinerary

```http
DELETE /api/v1/itineraries/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Itinerary deleted successfully"
}
```

---

### Itinerary Items

#### List Items for Itinerary

```http
GET /api/v1/itineraries/:id/items
```

**Query Parameters:**
- `category` (string, optional): Filter by category (accommodation, activity, transport)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "itinerary_id": "uuid",
      "category": "accommodation",
      "title": "Hotel Luxe Paris",
      "description": "Luxury hotel in city center",
      "start_datetime": "2024-07-01T15:00:00Z",
      "end_datetime": "2024-07-15T11:00:00Z",
      "location": "123 Champs-Élysées, Paris",
      "confirmation_code": "HLP-12345",
      "cost": 2500.00,
      "currency": "USD",
      "metadata": {
        "stars": 5,
        "room_type": "Deluxe Suite"
      },
      "display_order": 0,
      "is_completed": false,
      "created_at": "2024-01-15T12:00:00.000Z",
      "updated_at": "2024-01-15T12:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### Add Item to Itinerary

```http
POST /api/v1/itineraries/:id/items
```

**Request Body:**
```json
{
  "category": "accommodation",
  "title": "Hotel Luxe Paris",
  "description": "Luxury hotel",
  "start_datetime": "2024-07-01T15:00:00Z",
  "end_datetime": "2024-07-15T11:00:00Z",
  "location": "123 Champs-Élysées, Paris",
  "confirmation_code": "HLP-12345",
  "cost": 2500.00,
  "currency": "USD",
  "metadata": {
    "stars": 5
  },
  "display_order": 0
}
```

**Validation Rules:**
- `category`: Required, one of: accommodation, activity, transport
- `title`: Required, max 255 characters
- `description`: Optional, max 5000 characters
- `start_datetime`: Optional, ISO 8601 format
- `end_datetime`: Optional, ISO 8601 format, must be > start_datetime
- `location`: Optional, max 255 characters
- `confirmation_code`: Optional, max 100 characters
- `cost`: Optional, positive number, max 999999.99
- `currency`: Optional, 3-letter code (default: USD)
- `metadata`: Optional, JSON object
- `display_order`: Optional, non-negative integer

**Response:** `201 Created`
```json
{
  "success": true,
  "data": { /* item object */ },
  "message": "Item created successfully"
}
```

#### Update Item

```http
PUT /api/v1/items/:id
```

**Request Body:** (all fields optional, same as create)

**Response:**
```json
{
  "success": true,
  "data": { /* updated item */ },
  "message": "Item updated successfully"
}
```

#### Delete Item

```http
DELETE /api/v1/items/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Item deleted successfully"
}
```

#### Bulk Operations

```http
POST /api/v1/items/bulk
```

**Request Body (Reorder):**
```json
{
  "operation": "reorder",
  "items": [
    { "id": "uuid1", "display_order": 0 },
    { "id": "uuid2", "display_order": 1 }
  ]
}
```

**Request Body (Bulk Delete):**
```json
{
  "operation": "bulk_delete",
  "items": ["uuid1", "uuid2"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bulk reorder completed successfully",
  "processed": 2
}
```

---

## HTTP Status Codes

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request (validation errors)
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Rate Limiting

- General API: 100 requests per 15 minutes
- Authentication: 5 requests per 15 minutes

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 2024-01-15T12:15:00.000Z
```

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Server error |

## Examples

### Create Complete Trip

```javascript
// 1. Create itinerary
const itinerary = await fetch('/api/v1/itineraries', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Paris Vacation',
    destination: 'Paris, France',
    start_date: '2024-07-01',
    end_date: '2024-07-15'
  })
});

// 2. Add accommodation
const hotel = await fetch(`/api/v1/itineraries/${itinerary.id}/items`, {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    category: 'accommodation',
    title: 'Hotel Luxe Paris',
    start_datetime: '2024-07-01T15:00:00Z',
    end_datetime: '2024-07-15T11:00:00Z',
    cost: 2500.00
  })
});
```

## Support

For API support, please contact the development team or open an issue on GitHub.
