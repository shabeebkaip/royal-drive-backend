# Vehicle Types API Documentation for Frontend Developers

## Overview
The Vehicle Types API provides endpoints to manage vehicle types in the Royal Drive system. Each vehicle type represents a category of vehicles (e.g., SUV, Sedan, Hatchback, Coupe) with associated metadata like icons and descriptions.

## Base URL
```
http://localhost:3001/api/v1/vehicle-types
```

---

## 📋 Data Structure

### Vehicle Type Object
```typescript
interface VehicleType {
  _id: string;           // MongoDB ObjectId
  name: string;          // Type name (e.g., "SUV", "Sedan", "Hatchback")
  slug: string;          // URL-friendly version (e.g., "suv", "sedan", "hatchback")
  icon?: string;         // Optional icon URL
  description?: string;  // Optional description
  active: boolean;       // Whether vehicle type is active (default: true)
  createdAt: string;     // ISO timestamp
  updatedAt: string;     // ISO timestamp
  vehicleCount?: number; // Virtual field - count of vehicles for this type
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

## 🔗 Endpoints

### 1. Get All Vehicle Types
**GET** `/vehicle-types`

Retrieve all vehicle types with filtering, searching, and pagination.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number for pagination |
| `limit` | number | 10 | Items per page (max: 100) |
| `search` | string | - | Search in name and description |
| `active` | boolean | - | Filter by active status |
| `sortBy` | string | 'name' | Sort field (name, createdAt, updatedAt) |
| `sortOrder` | string | 'asc' | Sort direction (asc, desc) |

**Example Requests:**
```javascript
// Get all vehicle types
fetch('/api/v1/vehicle-types')

// Get active vehicle types only
fetch('/api/v1/vehicle-types?active=true')

// Search vehicle types
fetch('/api/v1/vehicle-types?search=SUV')

// Paginated with sorting
fetch('/api/v1/vehicle-types?page=2&limit=5&sortBy=name&sortOrder=desc')
```

**Response:**
```json
{
  "success": true,
  "message": "Vehicle types retrieved successfully",
  "timestamp": "2025-01-09T...",
  "data": {
    "vehicleTypes": [
      {
        "_id": "66f2a1b8c4d5e6f7a8b9c0d1",
        "name": "SUV",
        "slug": "suv",
        "icon": "https://example.com/suv-icon.png",
        "description": "Sport Utility Vehicle - Perfect for families",
        "active": true,
        "createdAt": "2025-01-09T10:00:00.000Z",
        "updatedAt": "2025-01-09T10:00:00.000Z",
        "vehicleCount": 15
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 8,
      "pages": 1
    }
  }
}
```

---

### 2. Get Active Vehicle Types for Dropdown
**GET** `/vehicle-types/dropdown`

**Perfect for frontend dropdowns** - returns simplified list of active vehicle types only.

**Example Request:**
```javascript
fetch('/api/v1/vehicle-types/dropdown')
```

**Response:**
```json
{
  "success": true,
  "message": "Active vehicle types retrieved successfully",
  "timestamp": "2025-01-09T...",
  "data": [
    {
      "_id": "66f2a1b8c4d5e6f7a8b9c0d1",
      "name": "SUV",
      "slug": "suv",
      "icon": "https://example.com/suv-icon.png"
    },
    {
      "_id": "66f2a1b8c4d5e6f7a8b9c0d2",
      "name": "Sedan",
      "slug": "sedan",
      "icon": "https://example.com/sedan-icon.png"
    }
  ]
}
```

---

### 3. Get Vehicle Type by ID
**GET** `/vehicle-types/:id`

**Parameters:**
- `id` (string, required) - MongoDB ObjectId

**Example Request:**
```javascript
fetch('/api/v1/vehicle-types/66f2a1b8c4d5e6f7a8b9c0d1')
```

**Response:**
```json
{
  "success": true,
  "message": "Vehicle type retrieved successfully",
  "timestamp": "2025-01-09T...",
  "data": {
    "_id": "66f2a1b8c4d5e6f7a8b9c0d1",
    "name": "SUV",
    "slug": "suv",
    "icon": "https://example.com/suv-icon.png",
    "description": "Sport Utility Vehicle - Perfect for families",
    "active": true,
    "createdAt": "2025-01-09T10:00:00.000Z",
    "updatedAt": "2025-01-09T10:00:00.000Z",
    "vehicleCount": 15
  }
}
```

---

### 4. Get Vehicle Type by Slug
**GET** `/vehicle-types/slug/:slug`

**Parameters:**
- `slug` (string, required) - URL-friendly slug

**Example Request:**
```javascript
fetch('/api/v1/vehicle-types/slug/suv')
```

**Response:** Same as Get Vehicle Type by ID

---

### 5. Create New Vehicle Type
**POST** `/vehicle-types`

**Request Body:**
```typescript
{
  name: string;          // Required - Vehicle type name
  icon?: string;         // Optional - Icon URL
  description?: string;  // Optional - Description
  active?: boolean;      // Optional - Defaults to true
}
```

**Example Request:**
```javascript
fetch('/api/v1/vehicle-types', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'SUV',
    icon: 'https://example.com/suv-icon.png',
    description: 'Sport Utility Vehicle - Perfect for families',
    active: true
  })
})
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Vehicle type created successfully",
  "timestamp": "2025-01-09T...",
  "data": {
    "_id": "66f2a1b8c4d5e6f7a8b9c0d1",
    "name": "SUV",
    "slug": "suv",  // Auto-generated by backend
    "icon": "https://example.com/suv-icon.png",
    "description": "Sport Utility Vehicle - Perfect for families",
    "active": true,
    "createdAt": "2025-01-09T10:00:00.000Z",
    "updatedAt": "2025-01-09T10:00:00.000Z"
  }
}
```

---

### 6. Update Vehicle Type
**PUT** `/vehicle-types/:id`

**Parameters:**
- `id` (string, required) - MongoDB ObjectId

**Request Body:** Same as Create Vehicle Type

**Example Request:**
```javascript
fetch('/api/v1/vehicle-types/66f2a1b8c4d5e6f7a8b9c0d1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Sport Utility Vehicle',
    description: 'Updated description for SUV'
  })
})
```

**Response (200 OK):** Same as create response

---

### 7. Update Vehicle Type Status
**PATCH** `/vehicle-types/:id/status`

**Parameters:**
- `id` (string, required) - MongoDB ObjectId

**Request Body:**
```typescript
{
  active: boolean;  // Required - New status
}
```

**Example Request:**
```javascript
fetch('/api/v1/vehicle-types/66f2a1b8c4d5e6f7a8b9c0d1/status', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    active: false
  })
})
```

---

### 8. Delete Vehicle Type
**DELETE** `/vehicle-types/:id`

**Parameters:**
- `id` (string, required) - MongoDB ObjectId

**Example Request:**
```javascript
fetch('/api/v1/vehicle-types/66f2a1b8c4d5e6f7a8b9c0d1', {
  method: 'DELETE'
})
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Vehicle type deleted successfully",
  "timestamp": "2025-01-09T..."
}
```

---

### 9. Search Vehicle Types
**GET** `/vehicle-types/search`

**Query Parameters:**
- `q` (string, required) - Search query

**Example Request:**
```javascript
fetch('/api/v1/vehicle-types/search?q=sport')
```

---

### 10. Get Popular Vehicle Types
**GET** `/vehicle-types/popular`

Returns vehicle types sorted by vehicle count.

**Example Request:**
```javascript
fetch('/api/v1/vehicle-types/popular')
```

---

### 11. Get Vehicle Type Statistics
**GET** `/vehicle-types/stats`

**Example Request:**
```javascript
fetch('/api/v1/vehicle-types/stats')
```

**Response:**
```json
{
  "success": true,
  "message": "Vehicle type statistics retrieved successfully",
  "timestamp": "2025-01-09T...",
  "data": {
    "total": 8,
    "active": 7,
    "inactive": 1
  }
}
```

---

## 🎯 Common Frontend Patterns

### React Vehicle Type Dropdown Component
```jsx
const VehicleTypeDropdown = () => {
  const [vehicleTypes, setVehicleTypes] = useState([]);
  
  useEffect(() => {
    fetch('/api/v1/vehicle-types/dropdown')
      .then(res => res.json())
      .then(data => setVehicleTypes(data.data));
  }, []);
  
  return (
    <select>
      {vehicleTypes.map(type => (
        <option key={type._id} value={type._id}>
          {type.name}
        </option>
      ))}
    </select>
  );
};
```

### Create Vehicle Type Form
```jsx
const createVehicleType = async (formData) => {
  const response = await fetch('/api/v1/vehicle-types', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  
  const result = await response.json();
  if (result.success) {
    // Handle success
  } else {
    // Handle error
  }
};
```

---

## ⚠️ Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message",
  "timestamp": "2025-01-09T..."
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (duplicate name)
- `500` - Internal Server Error

---

## 💡 Important Notes

1. **Slug Generation**: Slugs are automatically generated from the vehicle type name by the backend. Don't send slug in POST/PUT requests.

2. **Icon Validation**: Icon URLs must be valid HTTP/HTTPS URLs. The backend validates URL format.

3. **Name Uniqueness**: Vehicle type names must be unique. Attempting to create duplicates will return a 409 error.

4. **Active Status**: All vehicle types default to `active: true`. Use the status endpoint to toggle active/inactive.

5. **Vehicle Count**: The `vehicleCount` virtual field shows how many vehicles belong to each type.

6. **Case Sensitivity**: Vehicle type names preserve original casing, but slugs are always lowercase.

---

## 🚗 Common Vehicle Types

Here are the most common vehicle types you might want to create:

- **SUV** - Sport Utility Vehicle
- **Sedan** - Traditional four-door car
- **Hatchback** - Compact car with rear hatch
- **Coupe** - Two-door sports car
- **Convertible** - Car with retractable roof
- **Truck** - Pickup truck for cargo
- **Van** - Multi-purpose vehicle
- **Wagon** - Station wagon
- **Crossover** - Car-based SUV
- **Luxury** - High-end premium vehicles

This API provides everything needed to build a complete vehicle type management interface in your frontend application! 🚀
