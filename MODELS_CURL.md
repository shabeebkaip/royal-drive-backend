# Models API - cURL Commands

## Environment Variables
Set these variables in your terminal for easier testing:
```bash
export BASE_URL="http://localhost:3001"
export API_VERSION="v1"
export MAKE_ID="66f2a1b8c4d5e6f7a8b9c0d1"        # Replace with actual Audi make ID
export VEHICLE_TYPE_ID="66f2a1b8c4d5e6f7a8b9c0d2"  # Replace with actual Sedan vehicle type ID
export MODEL_ID="66f2a1b8c4d5e6f7a8b9c0d3"         # Replace with actual model ID
```

---

## 📋 Complete cURL Commands

### 1. Get All Models
```bash
curl -X GET "$BASE_URL/api/$API_VERSION/models" \
  -H "Content-Type: application/json"
```

### 2. Get All Models with Filters
```bash
# With pagination and search
curl -X GET "$BASE_URL/api/$API_VERSION/models?page=1&limit=10&search=A4&active=true&sortBy=name&sortOrder=asc" \
  -H "Content-Type: application/json"

# Filter by make
curl -X GET "$BASE_URL/api/$API_VERSION/models?make=$MAKE_ID" \
  -H "Content-Type: application/json"

# Filter by vehicle type
curl -X GET "$BASE_URL/api/$API_VERSION/models?vehicleType=$VEHICLE_TYPE_ID" \
  -H "Content-Type: application/json"
```

### 3. Get Models by Make
```bash
curl -X GET "$BASE_URL/api/$API_VERSION/models/make/$MAKE_ID" \
  -H "Content-Type: application/json"
```

### 4. Get Models by Vehicle Type
```bash
curl -X GET "$BASE_URL/api/$API_VERSION/models/vehicle-type/$VEHICLE_TYPE_ID" \
  -H "Content-Type: application/json"
```

### 5. Get Active Models for Dropdown
```bash
curl -X GET "$BASE_URL/api/$API_VERSION/models/dropdown" \
  -H "Content-Type: application/json"
```

### 6. Get Model by ID
```bash
curl -X GET "$BASE_URL/api/$API_VERSION/models/$MODEL_ID" \
  -H "Content-Type: application/json"
```

### 7. Get Model by Slug
```bash
curl -X GET "$BASE_URL/api/$API_VERSION/models/slug/audi-a4" \
  -H "Content-Type: application/json"
```

### 8. Create New Model
```bash
# Audi A4 (Sedan)
curl -X POST "$BASE_URL/api/$API_VERSION/models" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "A4",
    "make": "'$MAKE_ID'",
    "vehicleType": "'$VEHICLE_TYPE_ID'",
    "description": "Compact luxury sedan from Audi",
    "active": true
  }'
```

### 9. Update Model
```bash
curl -X PUT "$BASE_URL/api/$API_VERSION/models/$MODEL_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "A4 Updated",
    "make": "'$MAKE_ID'",
    "vehicleType": "'$VEHICLE_TYPE_ID'",
    "description": "Updated compact luxury sedan from Audi",
    "active": true
  }'
```

### 10. Update Model Status
```bash
# Deactivate model
curl -X PATCH "$BASE_URL/api/$API_VERSION/models/$MODEL_ID/status" \
  -H "Content-Type: application/json" \
  -d '{
    "active": false
  }'

# Activate model
curl -X PATCH "$BASE_URL/api/$API_VERSION/models/$MODEL_ID/status" \
  -H "Content-Type: application/json" \
  -d '{
    "active": true
  }'
```

### 11. Delete Model
```bash
curl -X DELETE "$BASE_URL/api/$API_VERSION/models/$MODEL_ID" \
  -H "Content-Type: application/json"
```

### 12. Search Models
```bash
curl -X GET "$BASE_URL/api/$API_VERSION/models/search?q=A4" \
  -H "Content-Type: application/json"
```

### 13. Get Popular Models
```bash
curl -X GET "$BASE_URL/api/$API_VERSION/models/popular" \
  -H "Content-Type: application/json"
```

### 14. Get Model Statistics
```bash
curl -X GET "$BASE_URL/api/$API_VERSION/models/stats" \
  -H "Content-Type: application/json"
```

---

## 🚗 Sample Model Creation Commands

### Audi Models
```bash
# Audi A3 (Sedan)
curl -X POST "$BASE_URL/api/$API_VERSION/models" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "A3",
    "make": "'$MAKE_ID'",
    "vehicleType": "'$VEHICLE_TYPE_ID'",
    "description": "Premium compact sedan from Audi",
    "active": true
  }'

# Audi A4 (Sedan)
curl -X POST "$BASE_URL/api/$API_VERSION/models" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "A4",
    "make": "'$MAKE_ID'",
    "vehicleType": "'$VEHICLE_TYPE_ID'",
    "description": "Compact luxury sedan from Audi",
    "active": true
  }'

# Audi A6 (Sedan)
curl -X POST "$BASE_URL/api/$API_VERSION/models" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "A6",
    "make": "'$MAKE_ID'",
    "vehicleType": "'$VEHICLE_TYPE_ID'",
    "description": "Mid-size luxury sedan from Audi",
    "active": true
  }'

# Audi Q5 (SUV) - Update VEHICLE_TYPE_ID to SUV ID
curl -X POST "$BASE_URL/api/$API_VERSION/models" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Q5",
    "make": "'$MAKE_ID'",
    "vehicleType": "REPLACE_WITH_SUV_VEHICLE_TYPE_ID",
    "description": "Compact luxury SUV from Audi",
    "active": true
  }'

# Audi Q7 (SUV)
curl -X POST "$BASE_URL/api/$API_VERSION/models" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Q7",
    "make": "'$MAKE_ID'",
    "vehicleType": "REPLACE_WITH_SUV_VEHICLE_TYPE_ID",
    "description": "Full-size luxury SUV from Audi",
    "active": true
  }'
```

### BMW Models (Update MAKE_ID to BMW ID)
```bash
# BMW 3 Series (Sedan)
curl -X POST "$BASE_URL/api/$API_VERSION/models" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "3 Series",
    "make": "REPLACE_WITH_BMW_MAKE_ID",
    "vehicleType": "'$VEHICLE_TYPE_ID'",
    "description": "Premium compact executive sedan from BMW",
    "active": true
  }'

# BMW 5 Series (Sedan)
curl -X POST "$BASE_URL/api/$API_VERSION/models" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "5 Series",
    "make": "REPLACE_WITH_BMW_MAKE_ID",
    "vehicleType": "'$VEHICLE_TYPE_ID'",
    "description": "Mid-size luxury sedan from BMW",
    "active": true
  }'

# BMW X3 (SUV)
curl -X POST "$BASE_URL/api/$API_VERSION/models" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "X3",
    "make": "REPLACE_WITH_BMW_MAKE_ID",
    "vehicleType": "REPLACE_WITH_SUV_VEHICLE_TYPE_ID",
    "description": "Compact luxury SUV from BMW",
    "active": true
  }'

# BMW X5 (SUV)
curl -X POST "$BASE_URL/api/$API_VERSION/models" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "X5",
    "make": "REPLACE_WITH_BMW_MAKE_ID",
    "vehicleType": "REPLACE_WITH_SUV_VEHICLE_TYPE_ID",
    "description": "Mid-size luxury SUV from BMW",
    "active": true
  }'
```

### Honda Models (Update MAKE_ID to Honda ID)
```bash
# Honda Civic (Hatchback)
curl -X POST "$BASE_URL/api/$API_VERSION/models" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Civic",
    "make": "REPLACE_WITH_HONDA_MAKE_ID",
    "vehicleType": "REPLACE_WITH_HATCHBACK_VEHICLE_TYPE_ID",
    "description": "Popular compact car from Honda",
    "active": true
  }'

# Honda Accord (Sedan)
curl -X POST "$BASE_URL/api/$API_VERSION/models" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Accord",
    "make": "REPLACE_WITH_HONDA_MAKE_ID",
    "vehicleType": "'$VEHICLE_TYPE_ID'",
    "description": "Mid-size sedan from Honda",
    "active": true
  }'

# Honda CR-V (SUV)
curl -X POST "$BASE_URL/api/$API_VERSION/models" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CR-V",
    "make": "REPLACE_WITH_HONDA_MAKE_ID",
    "vehicleType": "REPLACE_WITH_SUV_VEHICLE_TYPE_ID",
    "description": "Compact SUV from Honda",
    "active": true
  }'
```

---

## 🧪 Testing Workflow Commands

### 1. Setup Test Data
```bash
# First, get makes and vehicle types
curl -X GET "$BASE_URL/api/$API_VERSION/makes" | jq '.data.makes[] | {_id, name}'
curl -X GET "$BASE_URL/api/$API_VERSION/vehicle-types" | jq '.data.vehicleTypes[] | {_id, name}'

# Update your environment variables with actual IDs
export AUDI_MAKE_ID="actual_audi_id_here"
export BMW_MAKE_ID="actual_bmw_id_here"
export SEDAN_TYPE_ID="actual_sedan_id_here"
export SUV_TYPE_ID="actual_suv_id_here"
```

### 2. Create Test Models
```bash
# Create Audi A4
MODEL_ID=$(curl -s -X POST "$BASE_URL/api/$API_VERSION/models" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "A4",
    "make": "'$AUDI_MAKE_ID'",
    "vehicleType": "'$SEDAN_TYPE_ID'",
    "description": "Compact luxury sedan from Audi"
  }' | jq -r '.data._id')

echo "Created model with ID: $MODEL_ID"
```

### 3. Test CRUD Operations
```bash
# Read - Get the created model
curl -X GET "$BASE_URL/api/$API_VERSION/models/$MODEL_ID" | jq '.'

# Update - Modify the model
curl -X PUT "$BASE_URL/api/$API_VERSION/models/$MODEL_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "A4 Quattro",
    "make": "'$AUDI_MAKE_ID'",
    "vehicleType": "'$SEDAN_TYPE_ID'",
    "description": "All-wheel drive luxury sedan from Audi"
  }' | jq '.'

# Update Status - Deactivate
curl -X PATCH "$BASE_URL/api/$API_VERSION/models/$MODEL_ID/status" \
  -H "Content-Type: application/json" \
  -d '{"active": false}' | jq '.'

# Delete - Remove the model
curl -X DELETE "$BASE_URL/api/$API_VERSION/models/$MODEL_ID" | jq '.'
```

### 4. Test Validation Errors
```bash
# Test duplicate model name for same make
curl -X POST "$BASE_URL/api/$API_VERSION/models" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "A4",
    "make": "'$AUDI_MAKE_ID'",
    "vehicleType": "'$SEDAN_TYPE_ID'"
  }' | jq '.'

# Test invalid make ID
curl -X POST "$BASE_URL/api/$API_VERSION/models" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Model",
    "make": "invalid_id",
    "vehicleType": "'$SEDAN_TYPE_ID'"
  }' | jq '.'

# Test missing required fields
curl -X POST "$BASE_URL/api/$API_VERSION/models" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Model"
  }' | jq '.'
```

### 5. Test Filtering and Search
```bash
# Get models by make
curl -X GET "$BASE_URL/api/$API_VERSION/models/make/$AUDI_MAKE_ID" | jq '.data.models[].name'

# Search models
curl -X GET "$BASE_URL/api/$API_VERSION/models/search?q=A4" | jq '.data.models[].name'

# Get popular models
curl -X GET "$BASE_URL/api/$API_VERSION/models/popular" | jq '.data.models[] | {name, vehicleCount}'

# Get statistics
curl -X GET "$BASE_URL/api/$API_VERSION/models/stats" | jq '.data'
```

---

## 💡 Tips for Testing

1. **Use jq for JSON formatting:**
   ```bash
   curl ... | jq '.'
   ```

2. **Extract specific fields:**
   ```bash
   curl ... | jq '.data.models[] | {name, slug, make.name}'
   ```

3. **Save response to variable:**
   ```bash
   RESPONSE=$(curl -s ...)
   echo $RESPONSE | jq '.data._id'
   ```

4. **Test with invalid data:**
   - Invalid ObjectIds
   - Missing required fields
   - Duplicate model names for same make

5. **Check error responses:**
   ```bash
   curl -X POST "$BASE_URL/api/$API_VERSION/models" \
     -H "Content-Type: application/json" \
     -d '{}' | jq '.error'
   ```

This comprehensive cURL collection covers all Models API endpoints with real-world examples! 🚀
