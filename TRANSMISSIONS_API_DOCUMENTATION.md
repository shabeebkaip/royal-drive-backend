# Transmissions API Documentation

## Overview
The Transmissions API provides endpoints to manage transmission types in the Royal Drive system. Each transmission represents a category of transmission (e.g., Manual, Automatic, CVT, Semi-Automatic) used by vehicles.

## Base URL
```
http://localhost:3001/api/v1/transmissions
```

---

## 📋 Data Structure

### Transmission Object
```typescript
interface Transmission {
  _id: string;           // MongoDB ObjectId
  name: string;          // Transmission name (e.g., "Manual", "Automatic")
  slug: string;          // URL-friendly version (e.g., "manual", "automatic")
  active: boolean;       // Whether transmission is active (default: true)
  createdAt: string;     // ISO timestamp
  updatedAt: string;     // ISO timestamp
  vehicleCount?: number; // Virtual field - count of vehicles for this transmission
}
```

### Standard API Response
```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}
```

### Pagination Response
```typescript
interface PaginatedResponse<T> {
  transmissions: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

---

## 🔗 API Endpoints

### 1. Get All Transmissions
**GET** `/transmissions`

Retrieve all transmissions with filtering, searching, and pagination.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number for pagination |
| `limit` | number | 10 | Items per page (max: 100) |
| `search` | string | - | Search in name |
| `active` | boolean | - | Filter by active status |
| `sortBy` | string | 'name' | Sort field (name, createdAt, updatedAt) |
| `sortOrder` | string | 'asc' | Sort direction (asc, desc) |

**Example URL:**
```
GET /api/v1/transmissions?active=true&search=Manual&page=1&limit=10
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Transmissions retrieved successfully",
  "timestamp": "2025-01-09T10:00:00.000Z",
  "data": {
    "transmissions": [
      {
        "_id": "68cc2018dca3934ee5d06055",
        "name": "Manual",
        "slug": "manual",
        "active": true,
        "createdAt": "2025-01-09T10:00:00.000Z",
        "updatedAt": "2025-01-09T10:00:00.000Z",
        "vehicleCount": 45
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 4,
      "pages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

### 2. Get Active Transmissions for Dropdown
**GET** `/transmissions/dropdown`

Returns simplified list of active transmissions only. Perfect for frontend dropdowns.

**Example URL:**
```
GET /api/v1/transmissions/dropdown
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Active transmissions retrieved successfully",
  "timestamp": "2025-01-09T10:00:00.000Z",
  "data": [
    {
      "_id": "68cc2018dca3934ee5d06055",
      "name": "Manual",
      "slug": "manual"
    },
    {
      "_id": "68cc2018dca3934ee5d06056",
      "name": "Automatic",
      "slug": "automatic"
    }
  ]
}
```

### 3. Get Transmission by ID
**GET** `/transmissions/:id`

**Parameters:**
- `id` (string, required) - MongoDB ObjectId

**Example URL:**
```
GET /api/v1/transmissions/68cc2018dca3934ee5d06055
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Transmission retrieved successfully",
  "timestamp": "2025-01-09T10:00:00.000Z",
  "data": {
    "_id": "68cc2018dca3934ee5d06055",
    "name": "Manual",
    "slug": "manual",
    "active": true,
    "createdAt": "2025-01-09T10:00:00.000Z",
    "updatedAt": "2025-01-09T10:00:00.000Z",
    "vehicleCount": 45
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Transmission not found",
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

### 4. Get Transmission by Slug
**GET** `/transmissions/slug/:slug`

**Parameters:**
- `slug` (string, required) - URL-friendly slug

**Example URL:**
```
GET /api/v1/transmissions/slug/manual
```

**Response (200 OK):** Same as Get Transmission by ID

### 5. Create New Transmission
**POST** `/transmissions`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```typescript
{
  name: string;          // Required - Transmission name (2-50 characters)
  active?: boolean;      // Optional - Defaults to true
}
```

**Example Request Body:**
```json
{
  "name": "Manual",
  "active": true
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Transmission created successfully",
  "timestamp": "2025-01-09T10:00:00.000Z",
  "data": {
    "_id": "68cc2018dca3934ee5d06055",
    "name": "Manual",
    "slug": "manual",
    "active": true,
    "createdAt": "2025-01-09T10:00:00.000Z",
    "updatedAt": "2025-01-09T10:00:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Transmission name is required"
    }
  ],
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

**Error Response (409 Conflict):**
```json
{
  "success": false,
  "message": "Transmission name already exists",
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

### 6. Update Transmission
**PUT** `/transmissions/:id`

**Parameters:**
- `id` (string, required) - MongoDB ObjectId

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:** Same as Create Transmission

**Example URL:**
```
PUT /api/v1/transmissions/68cc2018dca3934ee5d06055
```

**Example Request Body:**
```json
{
  "name": "5-Speed Manual",
  "active": true
}
```

**Response (200 OK):** Same as create response

### 7. Update Transmission Status
**PATCH** `/transmissions/:id/status`

**Parameters:**
- `id` (string, required) - MongoDB ObjectId

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```typescript
{
  active: boolean;  // Required - New status
}
```

**Example URL:**
```
PATCH /api/v1/transmissions/68cc2018dca3934ee5d06055/status
```

**Example Request Body:**
```json
{
  "active": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Transmission status updated successfully",
  "timestamp": "2025-01-09T10:00:00.000Z",
  "data": {
    "_id": "68cc2018dca3934ee5d06055",
    "name": "Manual",
    "slug": "manual",
    "active": false,
    "updatedAt": "2025-01-09T10:00:00.000Z"
  }
}
```

### 8. Delete Transmission
**DELETE** `/transmissions/:id`

**Parameters:**
- `id` (string, required) - MongoDB ObjectId

**Example URL:**
```
DELETE /api/v1/transmissions/68cc2018dca3934ee5d06055
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Transmission deleted successfully",
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Transmission not found",
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

### 9. Search Transmissions
**GET** `/transmissions/search`

**Query Parameters:**
- `q` (string, required) - Search query

**Example URL:**
```
GET /api/v1/transmissions/search?q=automatic
```

**Response (200 OK):** Same format as Get All Transmissions

### 10. Get Popular Transmissions
**GET** `/transmissions/popular`

Returns transmissions sorted by vehicle count (most used first).

**Example URL:**
```
GET /api/v1/transmissions/popular
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Popular transmissions retrieved successfully",
  "timestamp": "2025-01-09T10:00:00.000Z",
  "data": [
    {
      "_id": "68cc2018dca3934ee5d06055",
      "name": "Automatic",
      "slug": "automatic",
      "vehicleCount": 125,
      "active": true
    },
    {
      "_id": "68cc2018dca3934ee5d06056",
      "name": "Manual",
      "slug": "manual",
      "vehicleCount": 89,
      "active": true
    }
  ]
}
```

### 11. Get Transmission Statistics
**GET** `/transmissions/stats`

**Example URL:**
```
GET /api/v1/transmissions/stats
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Transmission statistics retrieved successfully",
  "timestamp": "2025-01-09T10:00:00.000Z",
  "data": {
    "total": 4,
    "active": 4,
    "inactive": 0
  }
}
```

---

## ⚠️ Error Responses

All endpoints return consistent error responses with the following structure:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message",
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

### Common HTTP Status Codes:
- **200** - Success
- **201** - Created
- **400** - Bad Request (validation errors)
- **404** - Not Found
- **409** - Conflict (duplicate name)
- **500** - Internal Server Error

### Common Validation Errors:
- `Transmission name is required`
- `Transmission name must be between 2 and 50 characters`
- `Transmission name already exists`
- `Transmission name can only contain letters, numbers, spaces, and hyphens`
- `Active must be a boolean value`

---

## 📋 Validation Rules

### Transmission Name:
- **Required**: Yes
- **Type**: String
- **Length**: 2-50 characters
- **Unique**: Yes (case-insensitive)
- **Trimmed**: Yes
- **Pattern**: Letters, numbers, spaces, and hyphens only

### Active:
- **Required**: No
- **Type**: Boolean
- **Default**: true

### Slug:
- **Auto-generated**: Yes (from name)
- **Format**: lowercase, URL-friendly
- **Unique**: Yes

---

## 💡 Important Notes

1. **Slug Generation**: Slugs are automatically generated from the transmission name by the backend. Never send slug in POST/PUT requests.

2. **Name Uniqueness**: Transmission names must be unique across the system. Duplicate names will return a 409 Conflict error.

3. **Active Status**: All transmissions default to `active: true`. Use the dedicated status endpoint for toggling.

4. **Vehicle Count**: The `vehicleCount` field is a virtual field that shows how many vehicles use this transmission type.

5. **Case Sensitivity**: Transmission names preserve original casing, but uniqueness checks are case-insensitive.

6. **Integration**: When creating vehicles, use the transmission `_id` in the vehicle's transmission type field.

7. **Name Pattern**: Only letters, numbers, spaces, and hyphens are allowed in transmission names.

## 🚗 Standard Transmission Types

Common transmission types that should be supported:
- **Manual** - Manual transmission (stick shift)
- **Automatic** - Traditional automatic transmission
- **CVT** - Continuously Variable Transmission
- **Semi-Automatic** - Semi-automatic transmission

This API provides complete CRUD operations for transmission management in the Royal Drive system.
