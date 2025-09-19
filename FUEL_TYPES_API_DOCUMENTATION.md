# Fuel Types API Documentation

## Overview
The Fuel Types API provides endpoints to manage fuel types in the Royal Drive system. Each fuel type represents a category of fuel that vehicles can use (e.g., Petrol, Electric, Hybrid, Diesel) for categorization and filtering purposes.

## Base URL
```
http://localhost:3001/api/v1/fuel-types
```

---

## 📋 Data Structure

### FuelType Object
```typescript
interface FuelType {
  _id: string;           // MongoDB ObjectId
  name: string;          // Fuel type name (e.g., "Petrol", "Electric")
  slug: string;          // URL-friendly version (e.g., "petrol", "electric")
  active: boolean;       // Whether fuel type is active (default: true)
  createdAt: string;     // ISO timestamp
  updatedAt: string;     // ISO timestamp
  vehicleCount?: number; // Virtual field - count of vehicles using this fuel type
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
  fuelTypes: T[];
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

### 1. Get All Fuel Types
**GET** `/fuel-types`

Retrieve all fuel types with filtering, searching, and pagination.

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
GET /api/v1/fuel-types
GET /api/v1/fuel-types?active=true
GET /api/v1/fuel-types?search=electric&page=1&limit=5
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Fuel types retrieved successfully",
  "timestamp": "2025-01-09T10:00:00.000Z",
  "data": {
    "fuelTypes": [
      {
        "_id": "66f2a1b8c4d5e6f7a8b9c0d1",
        "name": "Petrol",
        "slug": "petrol",
        "active": true,
        "createdAt": "2025-01-09T10:00:00.000Z",
        "updatedAt": "2025-01-09T10:00:00.000Z",
        "vehicleCount": 125
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 8,
      "pages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

### 2. Get Active Fuel Types for Dropdown
**GET** `/fuel-types/dropdown`

Returns simplified list of active fuel types only. Perfect for frontend dropdowns.

**Example URL:**
```
GET /api/v1/fuel-types/dropdown
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Active fuel types retrieved successfully",
  "timestamp": "2025-01-09T10:00:00.000Z",
  "data": [
    {
      "_id": "66f2a1b8c4d5e6f7a8b9c0d1",
      "name": "Petrol",
      "slug": "petrol"
    },
    {
      "_id": "66f2a1b8c4d5e6f7a8b9c0d2",
      "name": "Electric",
      "slug": "electric"
    }
  ]
}
```

### 3. Get Fuel Type by ID
**GET** `/fuel-types/:id`

**Parameters:**
- `id` (string, required) - MongoDB ObjectId

**Example URL:**
```
GET /api/v1/fuel-types/66f2a1b8c4d5e6f7a8b9c0d1
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Fuel type retrieved successfully",
  "timestamp": "2025-01-09T10:00:00.000Z",
  "data": {
    "_id": "66f2a1b8c4d5e6f7a8b9c0d1",
    "name": "Petrol",
    "slug": "petrol",
    "active": true,
    "createdAt": "2025-01-09T10:00:00.000Z",
    "updatedAt": "2025-01-09T10:00:00.000Z",
    "vehicleCount": 125
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Fuel type not found",
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

### 4. Get Fuel Type by Slug
**GET** `/fuel-types/slug/:slug`

**Parameters:**
- `slug` (string, required) - URL-friendly slug

**Example URL:**
```
GET /api/v1/fuel-types/slug/petrol
```

**Response (200 OK):** Same as Get Fuel Type by ID

### 5. Create New Fuel Type
**POST** `/fuel-types`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```typescript
{
  name: string;          // Required - Fuel type name (2-50 characters)
  active?: boolean;      // Optional - Defaults to true
}
```

**Example Request Body:**
```json
{
  "name": "Petrol",
  "active": true
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Fuel type created successfully",
  "timestamp": "2025-01-09T10:00:00.000Z",
  "data": {
    "_id": "66f2a1b8c4d5e6f7a8b9c0d1",
    "name": "Petrol",
    "slug": "petrol",
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
      "message": "Fuel type name is required"
    }
  ],
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

**Error Response (409 Conflict):**
```json
{
  "success": false,
  "message": "Fuel type with this name already exists",
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

### 6. Update Fuel Type
**PUT** `/fuel-types/:id`

**Parameters:**
- `id` (string, required) - MongoDB ObjectId

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:** Same as Create Fuel Type

**Example URL:**
```
PUT /api/v1/fuel-types/66f2a1b8c4d5e6f7a8b9c0d1
```

**Example Request Body:**
```json
{
  "name": "Premium Petrol",
  "active": true
}
```

**Response (200 OK):** Same as create response

### 7. Update Fuel Type Status
**PATCH** `/fuel-types/:id/status`

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
PATCH /api/v1/fuel-types/66f2a1b8c4d5e6f7a8b9c0d1/status
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
  "message": "Fuel type status updated successfully",
  "timestamp": "2025-01-09T10:00:00.000Z",
  "data": {
    "_id": "66f2a1b8c4d5e6f7a8b9c0d1",
    "name": "Petrol",
    "active": false,
    "updatedAt": "2025-01-09T10:00:00.000Z"
  }
}
```

### 8. Delete Fuel Type
**DELETE** `/fuel-types/:id`

**Parameters:**
- `id` (string, required) - MongoDB ObjectId

**Example URL:**
```
DELETE /api/v1/fuel-types/66f2a1b8c4d5e6f7a8b9c0d1
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Fuel type deleted successfully",
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Fuel type not found",
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

### 9. Search Fuel Types
**GET** `/fuel-types/search`

**Query Parameters:**
- `q` (string, required) - Search query

**Example URL:**
```
GET /api/v1/fuel-types/search?q=electric
```

**Response (200 OK):** Same format as Get All Fuel Types

### 10. Get Popular Fuel Types
**GET** `/fuel-types/popular`

Returns fuel types sorted by vehicle count (most used first).

**Example URL:**
```
GET /api/v1/fuel-types/popular
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Popular fuel types retrieved successfully",
  "timestamp": "2025-01-09T10:00:00.000Z",
  "data": [
    {
      "_id": "66f2a1b8c4d5e6f7a8b9c0d1",
      "name": "Petrol",
      "slug": "petrol",
      "vehicleCount": 125,
      "active": true
    },
    {
      "_id": "66f2a1b8c4d5e6f7a8b9c0d2",
      "name": "Electric",
      "slug": "electric",
      "vehicleCount": 45,
      "active": true
    }
  ]
}
```

### 11. Get Fuel Types Statistics
**GET** `/fuel-types/stats`

**Example URL:**
```
GET /api/v1/fuel-types/stats
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Fuel type statistics retrieved successfully",
  "timestamp": "2025-01-09T10:00:00.000Z",
  "data": {
    "total": 8,
    "active": 7,
    "inactive": 1
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
- `Fuel type name is required`
- `Fuel type name must be between 2 and 50 characters`
- `Fuel type name already exists`
- `Fuel type name can only contain letters, numbers, spaces, and hyphens`
- `Active must be a boolean value`

---

## 📋 Validation Rules

### Fuel Type Name:
- **Required**: Yes
- **Type**: String
- **Length**: 2-50 characters
- **Pattern**: Letters, numbers, spaces, hyphens only (`/^[a-zA-Z0-9\s\-]+$/`)
- **Unique**: Yes (case-insensitive)
- **Trimmed**: Yes

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

1. **Slug Generation**: Slugs are automatically generated from the fuel type name by the backend. Never send slug in POST/PUT requests.

2. **Name Uniqueness**: Fuel type names must be unique across the system. Duplicate names will return a 409 Conflict error.

3. **Active Status**: All fuel types default to `active: true`. Use the dedicated status endpoint for toggling.

4. **Vehicle Count**: The `vehicleCount` field is a virtual field that shows how many vehicles use each fuel type.

5. **Case Sensitivity**: Fuel type names preserve original casing, but uniqueness checks are case-insensitive.

6. **Integration**: When creating vehicles, use the fuel type name or ID in the vehicle's engine fuel type field.

---

## 🚗 Standard Fuel Types

Common fuel types that should be supported:

- **Petrol** - Regular gasoline fuel
- **Gasoline** - Same as petrol (regional naming)
- **Electric** - Battery electric vehicles
- **Hybrid** - Gas-electric combination
- **Diesel** - Diesel fuel vehicles
- **Plug-in Hybrid** - Rechargeable hybrid vehicles
- **Ethanol** - E85 ethanol fuel
- **CNG** - Compressed Natural Gas
- **LPG** - Liquefied Petroleum Gas

This API provides complete CRUD operations for fuel type management in the Royal Drive system.
