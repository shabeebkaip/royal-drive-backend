# Models API Documentation

## Overview
The Models API provides endpoints to manage vehicle models in the Royal Drive system. Each model represents a specific vehicle model (e.g., A4, A6 for Audi; 3 Series, 5 Series for BMW) and belongs to a specific make and vehicle type.

## Base URL
```
http://localhost:3001/api/v1/models
```

---

## 📋 Data Structure

### Model Object
```typescript
interface Model {
  _id: string;           // MongoDB ObjectId
  name: string;          // Model name (e.g., "A4", "3 Series")
  slug: string;          // URL-friendly version (e.g., "audi-a4", "bmw-3-series")
  make: {                // Populated Make object
    _id: string;
    name: string;
    slug: string;
    logo?: string;
  };
  vehicleType: {         // Populated VehicleType object
    _id: string;
    name: string;
    slug: string;
    icon?: string;
  };
  description?: string;  // Optional description
  active: boolean;       // Whether model is active (default: true)
  createdAt: string;     // ISO timestamp
  updatedAt: string;     // ISO timestamp
  vehicleCount?: number; // Virtual field - count of vehicles for this model
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

### 1. Get All Models
**GET** `/models`

Retrieve all models with filtering, searching, and pagination.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number for pagination |
| `limit` | number | 10 | Items per page (max: 100) |
| `search` | string | - | Search in name and description |
| `active` | boolean | - | Filter by active status |
| `make` | string | - | Filter by make ID |
| `vehicleType` | string | - | Filter by vehicle type ID |
| `sortBy` | string | 'name' | Sort field (name, createdAt, updatedAt) |
| `sortOrder` | string | 'asc' | Sort direction (asc, desc) |

**Example URLs:**
```
GET /api/v1/models
GET /api/v1/models?make=66f2a1b8c4d5e6f7a8b9c0d1
GET /api/v1/models?vehicleType=66f2a1b8c4d5e6f7a8b9c0d2
GET /api/v1/models?search=A4&active=true
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Models retrieved successfully",
  "timestamp": "2025-01-09T10:00:00.000Z",
  "data": {
    "models": [
      {
        "_id": "66f2a1b8c4d5e6f7a8b9c0d1",
        "name": "A4",
        "slug": "audi-a4",
        "make": {
          "_id": "66f2a1b8c4d5e6f7a8b9c0d1",
          "name": "Audi",
          "slug": "audi",
          "logo": "https://example.com/audi-logo.png"
        },
        "vehicleType": {
          "_id": "66f2a1b8c4d5e6f7a8b9c0d2",
          "name": "Sedan",
          "slug": "sedan",
          "icon": "https://example.com/sedan-icon.png"
        },
        "description": "Compact luxury sedan",
        "active": true,
        "createdAt": "2025-01-09T10:00:00.000Z",
        "updatedAt": "2025-01-09T10:00:00.000Z",
        "vehicleCount": 12
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

---

### 2. Get Models by Make
**GET** `/models/make/:makeId`

**Parameters:**
- `makeId` (string, required) - Make ObjectId

**Example URL:**
```
GET /api/v1/models/make/66f2a1b8c4d5e6f7a8b9c0d1
```

**Response (200 OK):** Same format as Get All Models

---

### 3. Get Models by Vehicle Type
**GET** `/models/vehicle-type/:vehicleTypeId`

**Parameters:**
- `vehicleTypeId` (string, required) - VehicleType ObjectId

**Example URL:**
```
GET /api/v1/models/vehicle-type/66f2a1b8c4d5e6f7a8b9c0d2
```

**Response (200 OK):** Same format as Get All Models

---

### 4. Get Active Models for Dropdown
**GET** `/models/dropdown`

Returns simplified list of active models for frontend dropdowns.

**Example URL:**
```
GET /api/v1/models/dropdown
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Active models retrieved successfully",
  "timestamp": "2025-01-09T10:00:00.000Z",
  "data": [
    {
      "_id": "66f2a1b8c4d5e6f7a8b9c0d1",
      "name": "A4",
      "slug": "audi-a4",
      "make": {
        "_id": "66f2a1b8c4d5e6f7a8b9c0d1",
        "name": "Audi",
        "slug": "audi"
      },
      "vehicleType": {
        "_id": "66f2a1b8c4d5e6f7a8b9c0d2",
        "name": "Sedan",
        "slug": "sedan"
      }
    }
  ]
}
```

---

### 5. Get Model by ID
**GET** `/models/:id`

**Parameters:**
- `id` (string, required) - Model ObjectId

**Example URL:**
```
GET /api/v1/models/66f2a1b8c4d5e6f7a8b9c0d1
```

**Response (200 OK):** Same as individual model object above

---

### 6. Get Model by Slug
**GET** `/models/slug/:slug`

**Parameters:**
- `slug` (string, required) - URL-friendly slug

**Example URL:**
```
GET /api/v1/models/slug/audi-a4
```

**Response (200 OK):** Same as Get Model by ID

---

### 7. Create New Model
**POST** `/models`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```typescript
{
  name: string;          // Required - Model name (1-50 characters)
  make: string;          // Required - Make ObjectId
  vehicleType: string;   // Required - VehicleType ObjectId
  description?: string;  // Optional - Description (max 500 characters)
  active?: boolean;      // Optional - Defaults to true
}
```

**Example Request Body:**
```json
{
  "name": "A4",
  "make": "66f2a1b8c4d5e6f7a8b9c0d1",
  "vehicleType": "66f2a1b8c4d5e6f7a8b9c0d2",
  "description": "Compact luxury sedan from Audi",
  "active": true
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Model created successfully",
  "timestamp": "2025-01-09T10:00:00.000Z",
  "data": {
    "_id": "66f2a1b8c4d5e6f7a8b9c0d1",
    "name": "A4",
    "slug": "audi-a4",
    "make": {
      "_id": "66f2a1b8c4d5e6f7a8b9c0d1",
      "name": "Audi",
      "slug": "audi",
      "logo": "https://example.com/audi-logo.png"
    },
    "vehicleType": {
      "_id": "66f2a1b8c4d5e6f7a8b9c0d2",
      "name": "Sedan",
      "slug": "sedan",
      "icon": "https://example.com/sedan-icon.png"
    },
    "description": "Compact luxury sedan from Audi",
    "active": true,
    "createdAt": "2025-01-09T10:00:00.000Z",
    "updatedAt": "2025-01-09T10:00:00.000Z"
  }
}
```

**Error Response (409 Conflict):**
```json
{
  "success": false,
  "message": "Model with this name already exists for this make",
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

---

### 8. Update Model
**PUT** `/models/:id`

**Parameters:**
- `id` (string, required) - Model ObjectId

**Request Body:** Same as Create Model

**Example URL:**
```
PUT /api/v1/models/66f2a1b8c4d5e6f7a8b9c0d1
```

**Response (200 OK):** Same as create response

---

### 9. Update Model Status
**PATCH** `/models/:id/status`

**Parameters:**
- `id` (string, required) - Model ObjectId

**Request Body:**
```typescript
{
  active: boolean;  // Required - New status
}
```

**Example URL:**
```
PATCH /api/v1/models/66f2a1b8c4d5e6f7a8b9c0d1/status
```

**Example Request Body:**
```json
{
  "active": false
}
```

---

### 10. Delete Model
**DELETE** `/models/:id`

**Parameters:**
- `id` (string, required) - Model ObjectId

**Example URL:**
```
DELETE /api/v1/models/66f2a1b8c4d5e6f7a8b9c0d1
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Model deleted successfully",
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

---

### 11. Search Models
**GET** `/models/search`

**Query Parameters:**
- `q` (string, required) - Search query

**Example URL:**
```
GET /api/v1/models/search?q=A4
```

---

### 12. Get Popular Models
**GET** `/models/popular`

Returns models sorted by vehicle count.

**Example URL:**
```
GET /api/v1/models/popular
```

---

### 13. Get Model Statistics
**GET** `/models/stats`

**Example URL:**
```
GET /api/v1/models/stats
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Model statistics retrieved successfully",
  "timestamp": "2025-01-09T10:00:00.000Z",
  "data": {
    "total": 125,
    "active": 118,
    "inactive": 7
  }
}
```

---

## ⚠️ Error Responses

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (duplicate name for same make)
- `500` - Internal Server Error

**Common Validation Errors:**
- `Model name is required`
- `Model name must be between 1 and 50 characters`
- `Make is required`
- `Vehicle type is required`
- `Make must be a valid ObjectId`
- `Vehicle type must be a valid ObjectId`
- `Model with this name already exists for this make`

---

## 💡 Important Notes

1. **Slug Generation**: Slugs are auto-generated from make name + model name (e.g., "audi-a4", "bmw-3-series").

2. **Uniqueness**: Model names must be unique per make. You can have "A4" for Audi and "A4" for another make, but not two "A4" models for Audi.

3. **Relationships**: Models must reference valid Make and VehicleType ObjectIds.

4. **Population**: All GET requests automatically populate make and vehicleType details.

5. **Integration**: When creating vehicles, use the model `_id` in the vehicle's `model` field.

## 🚗 Example Model Structure

**Audi Models:**
- A3 (Sedan)
- A4 (Sedan)
- A6 (Sedan)
- Q5 (SUV)
- Q7 (SUV)

**BMW Models:**
- 3 Series (Sedan)
- 5 Series (Sedan)
- X3 (SUV)
- X5 (SUV)

This API provides complete CRUD operations for vehicle model management with proper make and vehicle type relationships! 🚀
