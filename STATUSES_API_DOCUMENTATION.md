# Statuses API Documentation

## 📝 Overview

The Statuses API provides complete CRUD operations for managing vehicle status types in the Royal Drive system. This includes Available, Sold, Pending, Reserved, and On Hold statuses that track the current state of vehicles in your inventory.

## 📋 Data Structure

### Status Object
```typescript
interface IStatus {
  _id: string;
  name: string;              // e.g., "Available"
  code: string;              // e.g., "available"
  slug: string;              // e.g., "available"
  description?: string;      // Optional description
  color?: string;            // Optional color code for UI display (e.g., "#28a745")
  icon?: string;             // Optional icon class or emoji for UI display
  isDefault: boolean;        // Whether this is the default status for new vehicles
  active: boolean;           // Whether the status is active
  vehicleCount?: number;     // Virtual field - number of vehicles with this status
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
  statuses: T[];
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

### 1. Get All Statuses
**Endpoint:** `GET /api/statuses`  
**Description:** Retrieve all statuses with optional filtering and pagination

**Query Parameters:**
- `search` (string, optional): Search by name, code, or description
- `active` (boolean, optional): Filter by active status
- `isDefault` (boolean, optional): Filter by default status
- `sortBy` (string, optional): Sort field (`name`, `code`, `createdAt`, `updatedAt`)
- `sortOrder` (string, optional): Sort direction (`asc`, `desc`)
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)

**Example Request:**
```bash
GET /api/statuses?search=available&active=true&page=1&limit=10&sortBy=name&sortOrder=asc
```

**Example Response:**
```json
{
  "success": true,
  "message": "Statuses retrieved successfully",
  "data": {
    "statuses": [
      {
        "_id": "60b5f0e4e5d4c12345678901",
        "name": "Available",
        "code": "available",
        "slug": "available",
        "description": "Vehicle is available for sale and can be purchased immediately",
        "color": "#28a745",
        "icon": "✅",
        "isDefault": true,
        "active": true,
        "vehicleCount": 85,
        "createdAt": "2025-01-09T10:00:00.000Z",
        "updatedAt": "2025-01-09T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "pages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  },
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

---

### 2. Get Active Statuses
**Endpoint:** `GET /api/statuses/active`  
**Description:** Retrieve only active statuses

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)

**Example Request:**
```bash
GET /api/statuses/active?page=1&limit=10
```

---

### 3. Search Statuses
**Endpoint:** `GET /api/statuses/search`  
**Description:** Search statuses by name, code, or description

**Query Parameters:**
- `q` (string, required): Search query
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)

**Example Request:**
```bash
GET /api/statuses/search?q=pending&page=1&limit=10
```

---

### 4. Get Status Statistics
**Endpoint:** `GET /api/statuses/stats`  
**Description:** Get statistical information about statuses

**Example Response:**
```json
{
  "success": true,
  "message": "Status statistics retrieved successfully",
  "data": {
    "total": 5,
    "active": 5,
    "inactive": 0,
    "defaultStatus": {
      "name": "Available",
      "code": "available"
    },
    "mostUsed": {
      "name": "Available",
      "vehicleCount": 85
    }
  },
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

---

### 5. Get Statuses Dropdown
**Endpoint:** `GET /api/statuses/dropdown`  
**Description:** Get active statuses for dropdown/select components

**Example Response:**
```json
{
  "success": true,
  "message": "Active statuses retrieved successfully",
  "data": [
    {
      "_id": "60b5f0e4e5d4c12345678901",
      "name": "Available",
      "code": "available",
      "slug": "available",
      "color": "#28a745",
      "icon": "✅"
    },
    {
      "_id": "60b5f0e4e5d4c12345678902",
      "name": "Sold",
      "code": "sold",
      "slug": "sold",
      "color": "#dc3545",
      "icon": "🚗"
    }
  ],
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

---

### 6. Get Default Status
**Endpoint:** `GET /api/statuses/default`  
**Description:** Get the current default status for new vehicles

**Example Response:**
```json
{
  "success": true,
  "message": "Default status retrieved successfully",
  "data": {
    "_id": "60b5f0e4e5d4c12345678901",
    "name": "Available",
    "code": "available",
    "slug": "available",
    "description": "Vehicle is available for sale and can be purchased immediately",
    "color": "#28a745",
    "icon": "✅",
    "isDefault": true,
    "active": true,
    "vehicleCount": 85,
    "createdAt": "2025-01-09T10:00:00.000Z",
    "updatedAt": "2025-01-09T10:00:00.000Z"
  },
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

---

### 7. Get Status by ID
**Endpoint:** `GET /api/statuses/:id`  
**Description:** Retrieve a specific status by its ID

**Example Request:**
```bash
GET /api/statuses/60b5f0e4e5d4c12345678901
```

---

### 8. Get Status by Slug
**Endpoint:** `GET /api/statuses/slug/:slug`  
**Description:** Retrieve a specific status by its slug

**Example Request:**
```bash
GET /api/statuses/slug/available
```

---

### 9. Get Status by Code
**Endpoint:** `GET /api/statuses/code/:code`  
**Description:** Retrieve a specific status by its code

**Example Request:**
```bash
GET /api/statuses/code/available
```

---

### 10. Create Status
**Endpoint:** `POST /api/statuses`  
**Description:** Create a new status

**Request Body:**
```json
{
  "name": "Available",
  "code": "available",
  "description": "Vehicle is available for sale and can be purchased immediately",
  "color": "#28a745",
  "icon": "✅",
  "isDefault": false,
  "active": true
}
```

**Validation Rules:**
- `name`: Required, 1-50 characters, unique
- `code`: Required, 1-30 characters, lowercase letters/numbers/hyphens only, unique
- `description`: Optional, max 300 characters
- `color`: Optional, valid hex color code (e.g., #28a745)
- `icon`: Optional, max 100 characters
- `isDefault`: Optional, boolean (default: false)
- `active`: Optional, boolean (default: true)

**Example Response:**
```json
{
  "success": true,
  "message": "Status created successfully",
  "data": {
    "_id": "60b5f0e4e5d4c12345678901",
    "name": "Available",
    "code": "available",
    "slug": "available",
    "description": "Vehicle is available for sale and can be purchased immediately",
    "color": "#28a745",
    "icon": "✅",
    "isDefault": false,
    "active": true,
    "vehicleCount": 0,
    "createdAt": "2025-01-09T10:00:00.000Z",
    "updatedAt": "2025-01-09T10:00:00.000Z"
  },
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

---

### 11. Update Status
**Endpoint:** `PUT /api/statuses/:id`  
**Description:** Update an existing status

**Request Body:**
```json
{
  "name": "Available (Updated)",
  "code": "available",
  "description": "Updated description for available status",
  "color": "#28a745",
  "icon": "✅",
  "isDefault": false,
  "active": true
}
```

**Validation Rules:**
- `name`: Optional, 1-50 characters, unique
- `code`: Optional, 1-30 characters, lowercase letters/numbers/hyphens only, unique
- `description`: Optional, max 300 characters
- `color`: Optional, valid hex color code
- `icon`: Optional, max 100 characters
- `isDefault`: Optional, boolean
- `active`: Optional, boolean

---

### 12. Update Status Active State
**Endpoint:** `PATCH /api/statuses/:id/status`  
**Description:** Update only the active state of a status

**Request Body:**
```json
{
  "active": false
}
```

**Validation Rules:**
- `active`: Required, boolean

---

### 13. Set Default Status
**Endpoint:** `PATCH /api/statuses/:id/default`  
**Description:** Set a status as the default status for new vehicles

**Example Request:**
```bash
PATCH /api/statuses/60b5f0e4e5d4c12345678901/default
```

**Example Response:**
```json
{
  "success": true,
  "message": "Default status set successfully",
  "data": {
    "_id": "60b5f0e4e5d4c12345678901",
    "name": "Available",
    "code": "available",
    "slug": "available",
    "isDefault": true,
    "active": true,
    "updatedAt": "2025-01-09T10:00:00.000Z"
  },
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

---

### 14. Bulk Update Status Active State
**Endpoint:** `PATCH /api/statuses/bulk/status`  
**Description:** Update active state for multiple statuses

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
  "message": "2 statuses updated successfully",
  "data": {
    "updatedCount": 2,
    "active": false
  },
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

---

### 15. Delete Status
**Endpoint:** `DELETE /api/statuses/:id`  
**Description:** Delete a status

**Example Request:**
```bash
DELETE /api/statuses/60b5f0e4e5d4c12345678901
```

**Example Response:**
```json
{
  "success": true,
  "message": "Status deleted successfully",
  "data": {
    "deletedId": "60b5f0e4e5d4c12345678901"
  },
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

**Note:** Cannot delete the default status. Set another status as default first.

---

## 🚗 Standard Vehicle Statuses

Common statuses that should be supported:
- **Available** - Vehicle is available for sale (default)
- **Sold** - Vehicle has been sold and is no longer available
- **Pending** - Vehicle sale is pending completion
- **Reserved** - Vehicle is reserved for a specific customer
- **On Hold** - Vehicle is temporarily not available for sale

---

## ❌ Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "error": "Status name is required",
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Failed to retrieve status",
  "error": "Status not found",
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

### Conflict (409)
```json
{
  "success": false,
  "message": "Failed to create status",
  "error": "Status with this name already exists",
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

### Cannot Delete Default (400)
```json
{
  "success": false,
  "message": "Failed to delete status",
  "error": "Cannot delete the default status. Set another status as default first.",
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Failed to retrieve statuses",
  "error": "Database connection failed",
  "timestamp": "2025-01-09T10:00:00.000Z"
}
```

---

## 📚 Usage Examples

### Frontend Integration
```typescript
// Fetch all statuses for admin panel
const getStatuses = async (page: number = 1) => {
  const response = await fetch(`/api/statuses?page=${page}&limit=10`);
  return response.json();
};

// Get statuses for dropdown
const getStatusesDropdown = async () => {
  const response = await fetch('/api/statuses/dropdown');
  return response.json();
};

// Get default status
const getDefaultStatus = async () => {
  const response = await fetch('/api/statuses/default');
  return response.json();
};

// Create new status
const createStatus = async (statusData: CreateStatusRequest) => {
  const response = await fetch('/api/statuses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(statusData)
  });
  return response.json();
};

// Set default status
const setDefaultStatus = async (statusId: string) => {
  const response = await fetch(`/api/statuses/${statusId}/default`, {
    method: 'PATCH'
  });
  return response.json();
};
```

---

## 💡 Important Notes

1. **Default Status**: Only one status can be marked as default at a time. Setting a new default automatically removes the default flag from others.

2. **Slug Generation**: Slugs are automatically generated from the status name.

3. **Code Generation**: If no code is provided, it's automatically generated from the name.

4. **Color Codes**: Use valid hex color codes (e.g., #28a745) for consistent UI theming.

5. **Cannot Delete Default**: The default status cannot be deleted. Set another status as default first.

6. **Vehicle Integration**: When creating/updating vehicles, use the status `code` field.

7. **Icons**: Icons can be emoji, icon classes, or any string representation for UI display.

8. **Uniqueness**: Both status names and codes must be unique across the system.

This API provides complete CRUD operations for status management in the Royal Drive system.
