# Models API - Postman Requests

## Import Instructions
1. Open Postman
2. Click "Import"
3. Copy and paste the JSON collection below
4. Set up environment variables:
   - `base_url`: http://localhost:3001
   - `api_version`: v1
   - `makeId`: (valid make ObjectId)
   - `vehicleTypeId`: (valid vehicle type ObjectId)
   - `modelId`: (valid model ObjectId)

## Postman Collection JSON

```json
{
  "info": {
    "name": "Royal Drive - Models API",
    "description": "Complete CRUD operations for vehicle models",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3001"
    },
    {
      "key": "api_version",
      "value": "v1"
    }
  ],
  "item": [
    {
      "name": "Models",
      "item": [
        {
          "name": "1. Get All Models",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/{{api_version}}/models",
              "host": ["{{base_url}}"],
              "path": ["api", "{{api_version}}", "models"]
            }
          }
        },
        {
          "name": "2. Get All Models with Filters",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/{{api_version}}/models?page=1&limit=10&search=A4&active=true&sortBy=name&sortOrder=asc",
              "host": ["{{base_url}}"],
              "path": ["api", "{{api_version}}", "models"],
              "query": [
                {
                  "key": "page",
                  "value": "1"
                },
                {
                  "key": "limit",
                  "value": "10"
                },
                {
                  "key": "search",
                  "value": "A4"
                },
                {
                  "key": "active",
                  "value": "true"
                },
                {
                  "key": "sortBy",
                  "value": "name"
                },
                {
                  "key": "sortOrder",
                  "value": "asc"
                }
              ]
            }
          }
        },
        {
          "name": "3. Get Models by Make",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/{{api_version}}/models/make/{{makeId}}",
              "host": ["{{base_url}}"],
              "path": ["api", "{{api_version}}", "models", "make", "{{makeId}}"]
            }
          }
        },
        {
          "name": "4. Get Models by Vehicle Type",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/{{api_version}}/models/vehicle-type/{{vehicleTypeId}}",
              "host": ["{{base_url}}"],
              "path": ["api", "{{api_version}}", "models", "vehicle-type", "{{vehicleTypeId}}"]
            }
          }
        },
        {
          "name": "5. Get Active Models for Dropdown",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/{{api_version}}/models/dropdown",
              "host": ["{{base_url}}"],
              "path": ["api", "{{api_version}}", "models", "dropdown"]
            }
          }
        },
        {
          "name": "6. Get Model by ID",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/{{api_version}}/models/{{modelId}}",
              "host": ["{{base_url}}"],
              "path": ["api", "{{api_version}}", "models", "{{modelId}}"]
            }
          }
        },
        {
          "name": "7. Get Model by Slug",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/{{api_version}}/models/slug/audi-a4",
              "host": ["{{base_url}}"],
              "path": ["api", "{{api_version}}", "models", "slug", "audi-a4"]
            }
          }
        },
        {
          "name": "8. Create New Model",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"A4\",\n  \"make\": \"{{makeId}}\",\n  \"vehicleType\": \"{{vehicleTypeId}}\",\n  \"description\": \"Compact luxury sedan from Audi\",\n  \"active\": true\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/{{api_version}}/models",
              "host": ["{{base_url}}"],
              "path": ["api", "{{api_version}}", "models"]
            }
          }
        },
        {
          "name": "9. Update Model",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"A4 Updated\",\n  \"make\": \"{{makeId}}\",\n  \"vehicleType\": \"{{vehicleTypeId}}\",\n  \"description\": \"Updated compact luxury sedan from Audi\",\n  \"active\": true\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/{{api_version}}/models/{{modelId}}",
              "host": ["{{base_url}}"],
              "path": ["api", "{{api_version}}", "models", "{{modelId}}"]
            }
          }
        },
        {
          "name": "10. Update Model Status",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"active\": false\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/{{api_version}}/models/{{modelId}}/status",
              "host": ["{{base_url}}"],
              "path": ["api", "{{api_version}}", "models", "{{modelId}}", "status"]
            }
          }
        },
        {
          "name": "11. Delete Model",
          "request": {
            "method": "DELETE",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/{{api_version}}/models/{{modelId}}",
              "host": ["{{base_url}}"],
              "path": ["api", "{{api_version}}", "models", "{{modelId}}"]
            }
          }
        },
        {
          "name": "12. Search Models",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/{{api_version}}/models/search?q=A4",
              "host": ["{{base_url}}"],
              "path": ["api", "{{api_version}}", "models", "search"],
              "query": [
                {
                  "key": "q",
                  "value": "A4"
                }
              ]
            }
          }
        },
        {
          "name": "13. Get Popular Models",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/{{api_version}}/models/popular",
              "host": ["{{base_url}}"],
              "path": ["api", "{{api_version}}", "models", "popular"]
            }
          }
        },
        {
          "name": "14. Get Model Statistics",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/{{api_version}}/models/stats",
              "host": ["{{base_url}}"],
              "path": ["api", "{{api_version}}", "models", "stats"]
            }
          }
        }
      ]
    }
  ]
}
```

## Individual Request Bodies for Testing

### 1. Create Model - Audi A4 (Sedan)
```json
{
  "name": "A4",
  "make": "REPLACE_WITH_AUDI_MAKE_ID",
  "vehicleType": "REPLACE_WITH_SEDAN_VEHICLE_TYPE_ID",
  "description": "Compact luxury sedan from Audi",
  "active": true
}
```

### 2. Create Model - BMW 3 Series (Sedan)
```json
{
  "name": "3 Series",
  "make": "REPLACE_WITH_BMW_MAKE_ID",
  "vehicleType": "REPLACE_WITH_SEDAN_VEHICLE_TYPE_ID",
  "description": "Premium compact executive sedan from BMW",
  "active": true
}
```

### 3. Create Model - Audi Q5 (SUV)
```json
{
  "name": "Q5",
  "make": "REPLACE_WITH_AUDI_MAKE_ID",
  "vehicleType": "REPLACE_WITH_SUV_VEHICLE_TYPE_ID",
  "description": "Compact luxury SUV from Audi",
  "active": true
}
```

### 4. Create Model - Honda Civic (Hatchback)
```json
{
  "name": "Civic",
  "make": "REPLACE_WITH_HONDA_MAKE_ID",
  "vehicleType": "REPLACE_WITH_HATCHBACK_VEHICLE_TYPE_ID",
  "description": "Popular compact car from Honda",
  "active": true
}
```

### 5. Update Model Status
```json
{
  "active": false
}
```

### 6. Update Model Details
```json
{
  "name": "A4 Allroad",
  "make": "REPLACE_WITH_AUDI_MAKE_ID",
  "vehicleType": "REPLACE_WITH_SEDAN_VEHICLE_TYPE_ID",
  "description": "All-weather compact luxury sedan from Audi",
  "active": true
}
```

## Environment Variables Setup

Create these environment variables in Postman:

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `base_url` | Backend server URL | `http://localhost:3001` |
| `api_version` | API version | `v1` |
| `makeId` | Valid make ObjectId | `66f2a1b8c4d5e6f7a8b9c0d1` |
| `vehicleTypeId` | Valid vehicle type ObjectId | `66f2a1b8c4d5e6f7a8b9c0d2` |
| `modelId` | Valid model ObjectId | `66f2a1b8c4d5e6f7a8b9c0d3` |

## Testing Workflow

1. **Setup Prerequisites:**
   - Ensure makes exist (use Makes API to create Audi, BMW, Honda)
   - Ensure vehicle types exist (use Vehicle Types API to create Sedan, SUV, Hatchback)
   - Update environment variables with actual ObjectIds

2. **Test Create Operations:**
   - Create models for different makes and vehicle types
   - Test duplicate name validation (try creating same model for same make)

3. **Test Read Operations:**
   - Get all models
   - Get models by make
   - Get models by vehicle type
   - Get model by ID and slug

4. **Test Update Operations:**
   - Update model details
   - Update model status

5. **Test Delete Operations:**
   - Delete models (ensure no vehicles reference them first)

6. **Test Edge Cases:**
   - Invalid ObjectIds
   - Non-existent makes/vehicle types
   - Validation errors

## Common Test Scenarios

### Scenario 1: Create Audi Models
```bash
# First create models for Audi
POST /models - A4 (Sedan)
POST /models - A6 (Sedan)
POST /models - Q5 (SUV)
POST /models - Q7 (SUV)

# Then verify
GET /models/make/{audiMakeId}
```

### Scenario 2: Create BMW Models
```bash
# Create models for BMW
POST /models - 3 Series (Sedan)
POST /models - 5 Series (Sedan)
POST /models - X3 (SUV)
POST /models - X5 (SUV)

# Then verify
GET /models/make/{bmwMakeId}
```

### Scenario 3: Test Vehicle Type Filtering
```bash
# Get all sedan models
GET /models/vehicle-type/{sedanVehicleTypeId}

# Get all SUV models
GET /models/vehicle-type/{suvVehicleTypeId}
```

This collection provides comprehensive testing for all Models API endpoints! 🚀
