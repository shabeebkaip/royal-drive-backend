# Vehicle Types - Postman Request Bodies

## 🚀 Complete Postman Collection for Vehicle Types API

### Base URL
```
http://localhost:3001/api/v1/vehicle-types
```

---

## 📝 **POST Requests - Create Vehicle Types**

### 1. Create SUV
**Method:** `POST`  
**URL:** `{{baseUrl}}/vehicle-types`  
**Headers:**
```json
{
  "Content-Type": "application/json"
}
```
**Body (raw JSON):**
```json
{
  "name": "SUV",
  "description": "Sport Utility Vehicle - Perfect for families and outdoor adventures with higher ground clearance and spacious interior",
  "icon": "https://example.com/icons/suv.png",
  "active": true
}
```

### 2. Create Sedan
**Method:** `POST`  
**URL:** `{{baseUrl}}/vehicle-types`  
**Body (raw JSON):**
```json
{
  "name": "Sedan",
  "description": "Traditional four-door passenger car with separate trunk compartment, ideal for daily commuting",
  "icon": "https://example.com/icons/sedan.png"
}
```

### 3. Create Hatchback
**Method:** `POST`  
**URL:** `{{baseUrl}}/vehicle-types`  
**Body (raw JSON):**
```json
{
  "name": "Hatchback",
  "description": "Compact car with rear door that swings upward, providing easy access to cargo area",
  "icon": "https://example.com/icons/hatchback.png",
  "active": true
}
```

### 4. Create Coupe
**Method:** `POST`  
**URL:** `{{baseUrl}}/vehicle-types`  
**Body (raw JSON):**
```json
{
  "name": "Coupe",
  "description": "Two-door car with fixed roof and sporty design, emphasizing style and performance",
  "icon": "https://example.com/icons/coupe.png"
}
```

### 5. Create Convertible
**Method:** `POST`  
**URL:** `{{baseUrl}}/vehicle-types`  
**Body (raw JSON):**
```json
{
  "name": "Convertible",
  "description": "Car with a roof structure that can be folded, detached, or retracted for open-air driving",
  "icon": "https://example.com/icons/convertible.png",
  "active": true
}
```

### 6. Create Truck
**Method:** `POST`  
**URL:** `{{baseUrl}}/vehicle-types`  
**Body (raw JSON):**
```json
{
  "name": "Truck",
  "description": "Motor vehicle designed primarily for transportation of cargo with open rear bed",
  "icon": "https://example.com/icons/truck.png"
}
```

### 7. Create Van
**Method:** `POST`  
**URL:** `{{baseUrl}}/vehicle-types`  
**Body (raw JSON):**
```json
{
  "name": "Van",
  "description": "Large vehicle used for transporting goods or multiple passengers with spacious interior",
  "icon": "https://example.com/icons/van.png",
  "active": true
}
```

### 8. Create Crossover
**Method:** `POST`  
**URL:** `{{baseUrl}}/vehicle-types`  
**Body (raw JSON):**
```json
{
  "name": "Crossover",
  "description": "Vehicle built on car platform but with higher ground clearance, combining SUV benefits with car efficiency",
  "icon": "https://example.com/icons/crossover.png"
}
```

### 9. Create Luxury
**Method:** `POST`  
**URL:** `{{baseUrl}}/vehicle-types`  
**Body (raw JSON):**
```json
{
  "name": "Luxury",
  "description": "High-end vehicles with premium features, superior comfort, and advanced technology",
  "icon": "https://example.com/icons/luxury.png",
  "active": true
}
```

### 10. Create Wagon
**Method:** `POST`  
**URL:** `{{baseUrl}}/vehicle-types`  
**Body (raw JSON):**
```json
{
  "name": "Wagon",
  "description": "Car body style variant of sedan with extended rear cargo area, perfect for families",
  "icon": "https://example.com/icons/wagon.png"
}
```

---

## 🔄 **PUT Requests - Update Vehicle Types**

### Update SUV (Complete Update)
**Method:** `PUT`  
**URL:** `{{baseUrl}}/vehicle-types/{{suvId}}`  
**Body (raw JSON):**
```json
{
  "name": "Sport Utility Vehicle",
  "description": "Updated description: Large family vehicle with all-wheel drive capability and enhanced cargo space",
  "icon": "https://example.com/icons/suv-updated.png",
  "active": true
}
```

### Update Sedan (Partial Update)
**Method:** `PUT`  
**URL:** `{{baseUrl}}/vehicle-types/{{sedanId}}`  
**Body (raw JSON):**
```json
{
  "description": "Updated: Four-door passenger car perfect for business and daily commuting with excellent fuel efficiency"
}
```

---

## 🔧 **PATCH Requests - Update Status**

### Deactivate Vehicle Type
**Method:** `PATCH`  
**URL:** `{{baseUrl}}/vehicle-types/{{vehicleTypeId}}/status`  
**Body (raw JSON):**
```json
{
  "active": false
}
```

### Activate Vehicle Type
**Method:** `PATCH`  
**URL:** `{{baseUrl}}/vehicle-types/{{vehicleTypeId}}/status`  
**Body (raw JSON):**
```json
{
  "active": true
}
```

---

## 📊 **GET Requests (No Body Required)**

### Get All Vehicle Types
**Method:** `GET`  
**URL:** `{{baseUrl}}/vehicle-types`

### Get All with Pagination
**Method:** `GET`  
**URL:** `{{baseUrl}}/vehicle-types?page=1&limit=5`

### Get Active Only
**Method:** `GET`  
**URL:** `{{baseUrl}}/vehicle-types?active=true`

### Search Vehicle Types
**Method:** `GET`  
**URL:** `{{baseUrl}}/vehicle-types/search?q=sport`

### Get Dropdown Data
**Method:** `GET`  
**URL:** `{{baseUrl}}/vehicle-types/dropdown`

### Get Vehicle Type by ID
**Method:** `GET`  
**URL:** `{{baseUrl}}/vehicle-types/{{vehicleTypeId}}`

### Get Vehicle Type by Slug
**Method:** `GET`  
**URL:** `{{baseUrl}}/vehicle-types/slug/suv`

### Get Popular Vehicle Types
**Method:** `GET`  
**URL:** `{{baseUrl}}/vehicle-types/popular`

### Get Statistics
**Method:** `GET`  
**URL:** `{{baseUrl}}/vehicle-types/stats`

---

## 🗑️ **DELETE Requests (No Body Required)**

### Delete Vehicle Type
**Method:** `DELETE`  
**URL:** `{{baseUrl}}/vehicle-types/{{vehicleTypeId}}`

---

## 🧪 **Test Scenarios**

### 1. Validation Error Test
**Method:** `POST`  
**URL:** `{{baseUrl}}/vehicle-types`  
**Body (raw JSON):**
```json
{
  "name": "",
  "description": "This should fail due to empty name"
}
```
**Expected:** `400 Bad Request`

### 2. Duplicate Name Test
**Method:** `POST`  
**URL:** `{{baseUrl}}/vehicle-types`  
**Body (raw JSON):**
```json
{
  "name": "SUV",
  "description": "This should fail if SUV already exists"
}
```
**Expected:** `409 Conflict`

### 3. Invalid Icon URL Test
**Method:** `POST`  
**URL:** `{{baseUrl}}/vehicle-types`  
**Body (raw JSON):**
```json
{
  "name": "Invalid Icon Test",
  "icon": "not-a-valid-url",
  "description": "This should fail due to invalid icon URL"
}
```
**Expected:** `400 Bad Request`

### 4. Missing Required Field Test
**Method:** `POST`  
**URL:** `{{baseUrl}}/vehicle-types`  
**Body (raw JSON):**
```json
{
  "description": "This should fail due to missing name"
}
```
**Expected:** `400 Bad Request`

---

## 🌐 **Postman Environment Variables**

Create these environment variables in Postman:

```json
{
  "baseUrl": "http://localhost:3001/api/v1",
  "suvId": "{{created_suv_id}}",
  "sedanId": "{{created_sedan_id}}",
  "vehicleTypeId": "{{any_created_id}}"
}
```

---

## 📋 **Quick Test Collection**

### Collection Order (Run in sequence):
1. **Create SUV** → Save ID to environment
2. **Create Sedan** → Save ID to environment  
3. **Get All Vehicle Types** → Verify creation
4. **Get Dropdown** → Test frontend integration
5. **Update SUV** → Test modification
6. **Search "sport"** → Test search functionality
7. **Get Statistics** → Verify counts
8. **Deactivate Sedan** → Test status change
9. **Get Active Only** → Verify filtering
10. **Delete Test Type** → Test deletion

---

## 🎯 **Expected Success Responses**

### Create Response (201):
```json
{
  "success": true,
  "message": "Vehicle type created successfully",
  "timestamp": "2025-01-09T...",
  "data": {
    "_id": "66f2a1b8c4d5e6f7a8b9c0d1",
    "name": "SUV",
    "slug": "suv",
    "icon": "https://example.com/icons/suv.png",
    "description": "Sport Utility Vehicle...",
    "active": true,
    "createdAt": "2025-01-09T10:00:00.000Z",
    "updatedAt": "2025-01-09T10:00:00.000Z"
  }
}
```

### Dropdown Response (200):
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
      "icon": "https://example.com/icons/suv.png"
    }
  ]
}
```

This comprehensive collection covers all Vehicle Types API endpoints with realistic data for testing! 🚀
