# Drive Types API Documentation

## 📝 Overview

The Drive Types API provides complete CRUD operations for managing vehicle drivetrain types in the Royal Drive system. This includes Front-Wheel Drive (FWD), Rear-Wheel Drive (RWD), All-Wheel Drive (AWD), and 4-Wheel Drive (4WD) systems.

## 📋 Data Structure

### DriveType Object
```typescript
interface IDriveType {
  _id: string;
  name: string;              // e.g., "Front-Wheel Drive"
  code: string;              // e.g., "FWD"
  slug: string;              // e.g., "front-wheel-drive"
  description?: string;      // Optional description
  active: boolean;           // Whether the drive type is active
  vehicleCount?: number;     // Virtual field - number of vehicles using this drive type
  createdAt: Date;
  updatedAt: Date;
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
  driveTypes: T[];
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

### 1. Get All Drive Types
**Endpoint:** `GET /api/drive-types`  
**Description:** Retrieve all drive types with optional filtering and pagination

**Query Parameters:**
- `search` (string, optional): Search by name, code, or description
- `active` (boolean, optional): Filter by active status
- `sortBy` (string, optional): Sort field (`name`, `code`, `createdAt`, `updatedAt`)
- `sortOrder` (string, optional): Sort direction (`asc`, `desc`)
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)

**Example Request:**
```bash
GET /api/drive-types?search=wheel&active=true&page=1&limit=10&sortBy=name&sortOrder=asc
```

**Example Response:**
```json
{
  "success": true,
  "message": "Drive types retrieved successfully",
  "data": {
    "driveTypes": [
      {
        "_id": "60b5f0e4e5d4c12345678901",
        "name": "Front-Wheel Drive",
        "code": "FWD",
        "slug": "front-wheel-drive",
        "description": "Engine power is transmitted to the front wheels",
        "active": true,
        "vehicleCount": 145,
        "createdAt": "2025-01-09T10:00:00.000Z",
        "updatedAt": "2025-01-09T10:00:00.000Z"
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
  },
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

---

### 2. Get Active Drive Types
**Endpoint:** `GET /api/drive-types/active`  
**Description:** Retrieve only active drive types

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)

**Example Request:**
```bash
GET /api/drive-types/active?page=1&limit=10
```

---

### 3. Search Drive Types
**Endpoint:** `GET /api/drive-types/search`  
**Description:** Search drive types by name, code, or description

**Query Parameters:**
- `q` (string, required): Search query
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)

**Example Request:**
```bash
GET /api/drive-types/search?q=all+wheel&page=1&limit=10
```

---

### 4. Get Drive Type Statistics
**Endpoint:** `GET /api/drive-types/stats`  
**Description:** Get statistical information about drive types

**Example Response:**
```json
{
  "success": true,
  "message": "Drive type statistics retrieved successfully",
  "data": {
    "total": 4,
    "active": 4,
    "inactive": 0,
    "mostUsed": {
      "name": "Front-Wheel Drive",
      "vehicleCount": 145
    }
  },
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

---

### 5. Get Drive Types Dropdown
**Endpoint:** `GET /api/drive-types/dropdown`  
**Description:** Get active drive types for dropdown/select components

**Example Response:**
```json
{
  "success": true,
  "message": "Active drive types retrieved successfully",
  "data": [
    {
      "_id": "60b5f0e4e5d4c12345678901",
      "name": "Front-Wheel Drive",
      "code": "FWD",
      "slug": "front-wheel-drive"
    },
    {
      "_id": "60b5f0e4e5d4c12345678902",
      "name": "Rear-Wheel Drive",
      "code": "RWD",
      "slug": "rear-wheel-drive"
    }
  ],
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

---

### 6. Get Drive Type by ID
**Endpoint:** `GET /api/drive-types/:id`  
**Description:** Retrieve a specific drive type by its ID

**Example Request:**
```bash
GET /api/drive-types/60b5f0e4e5d4c12345678901
```

---

### 7. Get Drive Type by Slug
**Endpoint:** `GET /api/drive-types/slug/:slug`  
**Description:** Retrieve a specific drive type by its slug

**Example Request:**
```bash
GET /api/drive-types/slug/front-wheel-drive
```

---

### 8. Get Drive Type by Code
**Endpoint:** `GET /api/drive-types/code/:code`  
**Description:** Retrieve a specific drive type by its code

**Example Request:**
```bash
GET /api/drive-types/code/FWD
```

---

### 9. Create Drive Type
**Endpoint:** `POST /api/drive-types`  
**Description:** Create a new drive type

**Request Body:**
```json
{
  "name": "Front-Wheel Drive",
  "code": "FWD",
  "description": "Engine power is transmitted to the front wheels",
  "active": true
}
```

**Validation Rules:**
- `name`: Required, 1-50 characters
- `code`: Required, 1-10 characters, uppercase letters and numbers only
- `description`: Optional, max 300 characters
- `active`: Optional, boolean (default: true)

**Example Response:**
```json
{
  "success": true,
  "message": "Drive type created successfully",
  "data": {
    "_id": "60b5f0e4e5d4c12345678901",
    "name": "Front-Wheel Drive",
    "code": "FWD",
    "slug": "front-wheel-drive",
    "description": "Engine power is transmitted to the front wheels",
    "active": true,
    "vehicleCount": 0,
    "createdAt": "2025-01-09T10:00:00.000Z",
    "updatedAt": "2025-01-09T10:00:00.000Z"
  },
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

---

### 10. Update Drive Type
**Endpoint:** `PUT /api/drive-types/:id`  
**Description:** Update an existing drive type

**Request Body:**
```json
{
  "name": "Front-Wheel Drive (Updated)",
  "code": "FWD",
  "description": "Updated description for front-wheel drive system",
  "active": true
}
```

**Validation Rules:**
- `name`: Optional, 1-50 characters
- `code`: Optional, 1-10 characters, uppercase letters and numbers only
- `description`: Optional, max 300 characters
- `active`: Optional, boolean

---

### 11. Update Drive Type Status
**Endpoint:** `PATCH /api/drive-types/:id/status`  
**Description:** Update only the active status of a drive type

**Request Body:**
```json
{
  "active": false
}
```

**Validation Rules:**
- `active`: Required, boolean

---

### 12. Bulk Update Drive Type Status
**Endpoint:** `PATCH /api/drive-types/bulk/status`  
**Description:** Update active status for multiple drive types

**Request Body:**
```json
{
  "ids": ["60b5f0e4e5d4c12345678901", "60b5f0e4e5d4c12345678902"],
  "active": false
}
```

**Validation Rules:**
- `ids`: Required, array of valid MongoDB ObjectIds
- `active`: Required, boolean

**Example Response:**
```json
{
  "success": true,
  "message": "2 drive types updated successfully",
  "data": {
    "updatedCount": 2,
    "active": false
  },
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

---

### 13. Delete Drive Type
**Endpoint:** `DELETE /api/drive-types/:id`  
**Description:** Delete a drive type

**Example Request:**
```bash
DELETE /api/drive-types/60b5f0e4e5d4c12345678901
```

**Example Response:**
```json
{
  "success": true,
  "message": "Drive type deleted successfully",
  "data": {
    "deletedId": "60b5f0e4e5d4c12345678901"
  },
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

---

## 🚗 Standard Drive Types

Common drive types that should be supported:
- **Front-Wheel Drive (FWD)** - Engine power transmitted to front wheels
- **Rear-Wheel Drive (RWD)** - Engine power transmitted to rear wheels  
- **All-Wheel Drive (AWD)** - Power distributed to all wheels automatically
- **4-Wheel Drive (4WD)** - Power can be manually engaged to all wheels

---

## ❌ Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "error": "Drive type name is required",
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Failed to retrieve drive type",
  "error": "Drive type not found",
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

### Conflict (409)
```json
{
  "success": false,
  "message": "Failed to create drive type",
  "error": "Drive type with this name already exists",
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Failed to retrieve drive types",
  "error": "Database connection failed",
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

---

## 📚 Usage Examples

### Frontend Integration
```typescript
// Fetch all drive types for admin panel
const getDriveTypes = async (page: number = 1) => {
  const response = await fetch(`/api/drive-types?page=${page}&limit=10`);
  return response.json();
};

// Get drive types for dropdown
const getDriveTypesDropdown = async () => {
  const response = await fetch('/api/drive-types/dropdown');
  return response.json();
};

// Create new drive type
const createDriveType = async (driveTypeData: CreateDriveTypeRequest) => {
  const response = await fetch('/api/drive-types', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(driveTypeData)
  });
  return response.json();
};
```

---

This API provides complete CRUD operations for drive type management in the Royal Drive system.
