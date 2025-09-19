# Fuel Types API Documentation

## Overview
The Fuel Types API provides endpoints to manage fuel types in the Royal Drive system. Fuel types represent different types of fuel that vehicles can use (e.g., Gasoline, Petrol, Hybrid, Electric, Diesel).

## Base URL
```
http://localhost:3001/api/v1/fuel-types
```

---

## 📋 Data Structure

### Fuel Type Object
```typescript
interface FuelType {
  _id: string;           // MongoDB ObjectId
  name: string;          // Fuel type name (e.g., "Gasoline", "Electric")
  slug: string;          // URL-friendly version (e.g., "gasoline", "electric")
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
| `search` | string | - | Search in fuel type name |
| `active` | boolean | - | Filter by active status |
| `sortBy` | string | 'name' | Sort field (name, createdAt, updatedAt) |
| `sortOrder` | string | 'asc' | Sort direction (asc, desc) |

**Example URLs:**
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
        "name": "Gasoline",
        "slug": "gasoline",
        "active": true,
        "createdAt": "2025-01-09T10:00:00.000Z",
        "updatedAt": "2025-01-09T10:00:00.000Z",
        "vehicleCount": 125
      },
      {
        "_id": "66f2a1b8c4d5e6f7a8b9c0d2",
        "name": "Electric",
        "slug": "electric",
        "active": true,
        "createdAt": "2025-01-09T10:00:00.000Z",
        "updatedAt": "2025-01-09T10:00:00.000Z",
        "vehicleCount": 45
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

---

### 2. Get Active Fuel Types for Dropdown
**GET** `/fuel-types/dropdown`

**Perfect for frontend dropdowns** - returns simplified list of active fuel types only.

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
      "name": "Gasoline",
      "slug": "gasoline"
    },
    {
      "_id": "66f2a1b8c4d5e6f7a8b9c0d2",
      "name": "Electric",
      "slug": "electric"
    },
    {
      "_id": "66f2a1b8c4d5e6f7a8b9c0d3",
      "name": "Hybrid",
      "slug": "hybrid"
    }
  ]
}
```

---

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
    "name": "Gasoline",
    "slug": "gasoline",
    "active": true,
    "createdAt": "2025-01-09T10:00:00.000Z",
    "updatedAt": "2025-01-09T10:00:00.000Z",
    "vehicleCount": 125
  }
}
```

---

### 4. Get Fuel Type by Slug
**GET** `/fuel-types/slug/:slug`

**Parameters:**
- `slug` (string, required) - URL-friendly slug

**Example URL:**
```
GET /api/v1/fuel-types/slug/gasoline
```

**Response (200 OK):** Same as Get Fuel Type by ID

---

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
  "name": "Gasoline",
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
    "name": "Gasoline",
    "slug": "gasoline",
    "active": true,
    "createdAt": "2025-01-09T10:00:00.000Z",
    "updatedAt": "2025-01-09T10:00:00.000Z"
  }
}
```

---

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
  "name": "Premium Gasoline",
  "active": true
}
```

**Response (200 OK):** Same as create response

---

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
    "name": "Gasoline",
    "active": false,
    "updatedAt": "2025-01-09T10:00:00.000Z"
  }
}
```

---

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

---

### 9. Search Fuel Types
**GET** `/fuel-types/search`

**Query Parameters:**
- `q` (string, required) - Search query

**Example URL:**
```
GET /api/v1/fuel-types/search?q=electric
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Fuel types search completed successfully",
  "timestamp": "2025-01-09T10:00:00.000Z",
  "data": [
    {
      "_id": "66f2a1b8c4d5e6f7a8b9c0d2",
      "name": "Electric",
      "slug": "electric",
      "active": true,
      "vehicleCount": 45
    }
  ]
}
```

---

### 10. Get Popular Fuel Types
**GET** `/fuel-types/popular`

Returns fuel types sorted by vehicle count (most used first).

**Query Parameters:**
- `limit` (number, optional) - Number of results (default: 10, max: 50)

**Example URL:**
```
GET /api/v1/fuel-types/popular?limit=5
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
      "name": "Gasoline",
      "slug": "gasoline",
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

---

### 11. Get Fuel Type Statistics
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

All endpoints return consistent error responses:

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
- `Fuel type name can only contain letters, numbers, spaces, and hyphens`
- `Fuel type with this name already exists`
- `Active must be a boolean value`

---

## 📋 Validation Rules

### Name:
- **Required**: Yes
- **Type**: String
- **Length**: 2-50 characters
- **Pattern**: Letters, numbers, spaces, hyphens only
- **Unique**: Yes (case-insensitive)
- **Trimmed**: Yes

### Active:
- **Required**: No
- **Type**: Boolean
- **Default**: true

### Slug:
- **Auto-generated**: Yes (from name)
- **Format**: Lowercase, hyphenated (e.g., "plug-in-hybrid")
- **Unique**: Yes

---

## 💡 Important Notes

1. **Slug Generation**: Slugs are automatically generated from the name. Never send slug in POST/PUT requests.

2. **Unique Names**: Fuel type names must be unique across the system (case-insensitive).

3. **Vehicle Count**: The `vehicleCount` field shows how many vehicles use this fuel type.

4. **Common Fuel Types**: Gasoline, Diesel, Electric, Hybrid, Plug-in Hybrid, Ethanol, CNG, LPG

5. **Integration**: Use the fuel type name or ID when creating vehicles with specific fuel types.

## 🚗 Example Fuel Types

Common fuel types to create:
- **Gasoline** (Most common)
- **Electric** (Growing category)
- **Hybrid** (Gas + Electric)
- **Diesel** (Trucks, some cars)
- **Plug-in Hybrid** (Rechargeable hybrid)
- **Ethanol** (E85)
- **CNG** (Compressed Natural Gas)
- **LPG** (Liquefied Petroleum Gas)

This comprehensive API provides everything needed to manage fuel types in your Royal Drive application! 🚀
