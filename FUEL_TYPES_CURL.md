# Fuel Types API - cURL Commands

## Environment Variables
Set these variables in your terminal for easier testing:
```bash
export BASE_URL="http://localhost:3001"
export API_VERSION="v1"
export FUEL_TYPE_ID="66f2a1b8c4d5e6f7a8b9c0d1"  # Replace with actual fuel type ID
```

---

## 📋 Complete cURL Commands

### 1. Get All Fuel Types
```bash
curl -X GET "$BASE_URL/api/$API_VERSION/fuel-types" \
  -H "Content-Type: application/json"
```

### 2. Get All Fuel Types with Filters
```bash
# With pagination and search
curl -X GET "$BASE_URL/api/$API_VERSION/fuel-types?page=1&limit=10&search=electric&active=true&sortBy=name&sortOrder=asc" \
  -H "Content-Type: application/json"

# Filter by active status
curl -X GET "$BASE_URL/api/$API_VERSION/fuel-types?active=true" \
  -H "Content-Type: application/json"
```

### 3. Get Active Fuel Types for Dropdown
```bash
curl -X GET "$BASE_URL/api/$API_VERSION/fuel-types/dropdown" \
  -H "Content-Type: application/json"
```

### 4. Get Fuel Type by ID
```bash
curl -X GET "$BASE_URL/api/$API_VERSION/fuel-types/$FUEL_TYPE_ID" \
  -H "Content-Type: application/json"
```

### 5. Get Fuel Type by Slug
```bash
curl -X GET "$BASE_URL/api/$API_VERSION/fuel-types/slug/gasoline" \
  -H "Content-Type: application/json"
```

### 6. Create New Fuel Type
```bash
# Gasoline
curl -X POST "$BASE_URL/api/$API_VERSION/fuel-types" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gasoline",
    "active": true
  }'
```

### 7. Update Fuel Type
```bash
curl -X PUT "$BASE_URL/api/$API_VERSION/fuel-types/$FUEL_TYPE_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Gasoline",
    "active": true
  }'
```

### 8. Update Fuel Type Status
```bash
# Deactivate fuel type
curl -X PATCH "$BASE_URL/api/$API_VERSION/fuel-types/$FUEL_TYPE_ID/status" \
  -H "Content-Type: application/json" \
  -d '{
    "active": false
  }'

# Activate fuel type
curl -X PATCH "$BASE_URL/api/$API_VERSION/fuel-types/$FUEL_TYPE_ID/status" \
  -H "Content-Type: application/json" \
  -d '{
    "active": true
  }'
```

### 9. Delete Fuel Type
```bash
curl -X DELETE "$BASE_URL/api/$API_VERSION/fuel-types/$FUEL_TYPE_ID" \
  -H "Content-Type: application/json"
```

### 10. Search Fuel Types
```bash
curl -X GET "$BASE_URL/api/$API_VERSION/fuel-types/search?q=electric" \
  -H "Content-Type: application/json"
```

### 11. Get Popular Fuel Types
```bash
curl -X GET "$BASE_URL/api/$API_VERSION/fuel-types/popular?limit=5" \
  -H "Content-Type: application/json"
```

### 12. Get Fuel Type Statistics
```bash
curl -X GET "$BASE_URL/api/$API_VERSION/fuel-types/stats" \
  -H "Content-Type: application/json"
```

---

## 🚗 Sample Fuel Type Creation Commands

### Create Common Fuel Types
```bash
# 1. Gasoline
curl -X POST "$BASE_URL/api/$API_VERSION/fuel-types" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gasoline",
    "active": true
  }'

# 2. Electric
curl -X POST "$BASE_URL/api/$API_VERSION/fuel-types" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electric",
    "active": true
  }'

# 3. Hybrid
curl -X POST "$BASE_URL/api/$API_VERSION/fuel-types" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hybrid",
    "active": true
  }'

# 4. Diesel
curl -X POST "$BASE_URL/api/$API_VERSION/fuel-types" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Diesel",
    "active": true
  }'

# 5. Plug-in Hybrid
curl -X POST "$BASE_URL/api/$API_VERSION/fuel-types" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Plug-in Hybrid",
    "active": true
  }'

# 6. Ethanol
curl -X POST "$BASE_URL/api/$API_VERSION/fuel-types" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ethanol",
    "active": true
  }'

# 7. CNG (Compressed Natural Gas)
curl -X POST "$BASE_URL/api/$API_VERSION/fuel-types" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CNG",
    "active": true
  }'

# 8. LPG (Liquefied Petroleum Gas)
curl -X POST "$BASE_URL/api/$API_VERSION/fuel-types" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "LPG",
    "active": true
  }'
```

---

## 🧪 Testing Workflow Commands

### 1. Setup Test Data
```bash
# First, create some fuel types
curl -X POST "$BASE_URL/api/$API_VERSION/fuel-types" \
  -H "Content-Type: application/json" \
  -d '{"name": "Gasoline"}' | jq '.'

curl -X POST "$BASE_URL/api/$API_VERSION/fuel-types" \
  -H "Content-Type: application/json" \
  -d '{"name": "Electric"}' | jq '.'

# Get all fuel types to see created ones
curl -X GET "$BASE_URL/api/$API_VERSION/fuel-types" | jq '.'
```

### 2. Test CRUD Operations
```bash
# Create a test fuel type and capture ID
FUEL_TYPE_ID=$(curl -s -X POST "$BASE_URL/api/$API_VERSION/fuel-types" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Fuel Type"
  }' | jq -r '.data._id')

echo "Created fuel type with ID: $FUEL_TYPE_ID"

# Read - Get the created fuel type
curl -X GET "$BASE_URL/api/$API_VERSION/fuel-types/$FUEL_TYPE_ID" | jq '.'

# Update - Modify the fuel type
curl -X PUT "$BASE_URL/api/$API_VERSION/fuel-types/$FUEL_TYPE_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Test Fuel Type",
    "active": true
  }' | jq '.'

# Update Status - Deactivate
curl -X PATCH "$BASE_URL/api/$API_VERSION/fuel-types/$FUEL_TYPE_ID/status" \
  -H "Content-Type: application/json" \
  -d '{"active": false}' | jq '.'

# Delete - Remove the fuel type
curl -X DELETE "$BASE_URL/api/$API_VERSION/fuel-types/$FUEL_TYPE_ID" | jq '.'
```

### 3. Test Validation Errors
```bash
# Test duplicate fuel type name
curl -X POST "$BASE_URL/api/$API_VERSION/fuel-types" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gasoline"
  }' | jq '.'

# Test invalid fuel type name (too short)
curl -X POST "$BASE_URL/api/$API_VERSION/fuel-types" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "A"
  }' | jq '.'

# Test missing required fields
curl -X POST "$BASE_URL/api/$API_VERSION/fuel-types" \
  -H "Content-Type: application/json" \
  -d '{}' | jq '.'

# Test invalid characters in name
curl -X POST "$BASE_URL/api/$API_VERSION/fuel-types" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test@#$%"
  }' | jq '.'
```

### 4. Test Filtering and Search
```bash
# Get active fuel types only
curl -X GET "$BASE_URL/api/$API_VERSION/fuel-types?active=true" | jq '.data.fuelTypes[].name'

# Search fuel types
curl -X GET "$BASE_URL/api/$API_VERSION/fuel-types/search?q=electric" | jq '.data[].name'

# Get popular fuel types
curl -X GET "$BASE_URL/api/$API_VERSION/fuel-types/popular" | jq '.data[] | {name, vehicleCount}'

# Get statistics
curl -X GET "$BASE_URL/api/$API_VERSION/fuel-types/stats" | jq '.data'

# Get dropdown data
curl -X GET "$BASE_URL/api/$API_VERSION/fuel-types/dropdown" | jq '.data[] | {_id, name}'
```

### 5. Test Pagination
```bash
# Test pagination
curl -X GET "$BASE_URL/api/$API_VERSION/fuel-types?page=1&limit=3" | jq '.data.pagination'

# Test sorting
curl -X GET "$BASE_URL/api/$API_VERSION/fuel-types?sortBy=name&sortOrder=desc" | jq '.data.fuelTypes[].name'
```

---

## 💡 Tips for Testing

1. **Use jq for JSON formatting:**
   ```bash
   curl ... | jq '.'
   ```

2. **Extract specific fields:**
   ```bash
   curl ... | jq '.data.fuelTypes[] | {name, slug, active}'
   ```

3. **Save response to variable:**
   ```bash
   RESPONSE=$(curl -s ...)
   echo $RESPONSE | jq '.data._id'
   ```

4. **Test with invalid data:**
   - Invalid ObjectIds
   - Missing required fields
   - Duplicate fuel type names
   - Invalid characters in names

5. **Check error responses:**
   ```bash
   curl -X POST "$BASE_URL/api/$API_VERSION/fuel-types" \
     -H "Content-Type: application/json" \
     -d '{}' | jq '.errors'
   ```

6. **Test by slug:**
   ```bash
   # Create a fuel type and test slug access
   curl -X GET "$BASE_URL/api/$API_VERSION/fuel-types/slug/plug-in-hybrid" | jq '.'
   ```

This comprehensive cURL collection covers all Fuel Types API endpoints with real-world examples! 🚀
